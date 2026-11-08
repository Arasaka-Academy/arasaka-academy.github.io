import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const commit = 'e31c0355b2b5189c9af1e6e26150f28a44287659';
const origin = `https://raw.githubusercontent.com/Arasaka-Academy/CyberUI/${commit}/`;
const destination = path.resolve('src/components/cyberui');
const download = (file) => execFileSync('curl', ['--fail', '--silent', '--show-error', '--location', '--retry', '2', '--max-time', '45', `${origin}${file}`], { maxBuffer: 8 * 1024 * 1024 });
const registry = JSON.parse(download('registry.json').toString());
const selected = registry.items.filter((item) => ['button', 'icon-button'].includes(item.name));
if (selected.length !== 2) throw new Error('The pinned registry does not contain the required components.');
const files = new Map(selected.flatMap((item) => item.files).map((file) => [file.path, file]));
const checksums = {};
await mkdir(destination, { recursive: true });
for (const [source, file] of files) {
  const relative = file.target.replace(/^@components\/cyberui\//, '');
  const target = path.resolve(destination, relative);
  if (!source.startsWith('registry/cyberui/') || !target.startsWith(`${destination}${path.sep}`)) throw new Error('Unsafe registry file path.');
  const contents = download(source);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, contents);
  checksums[relative] = createHash('sha256').update(contents).digest('hex');
  console.log(`CyberUI: ${relative}`);
}
await writeFile(path.join(destination, 'PROVENANCE.json'), `${JSON.stringify({ repository: 'Arasaka-Academy/CyberUI', commit, components: selected.map((item) => item.name), checksums }, null, 2)}\n`);
