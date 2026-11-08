import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, readdir, writeFile, copyFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const temporary = await mkdtemp(path.join(tmpdir(), 'arasaka-fonts-'));
await mkdir('public/fonts/licenses', { recursive: true });
const base = 'https://raw.githubusercontent.com/Arasaka-Academy/CyberUI/e31c0355b2b5189c9af1e6e26150f28a44287659/public/fonts/';
const download = (url, output) => execFileSync('curl', ['--fail', '--silent', '--show-error', '--location', '--retry', '2', '--max-time', '90', url, '-o', output]);
for (const [source, target, family] of [['Oxanium-Regular.ttf', 'oxanium-regular.woff2', 'Oxanium'], ['Oxanium-SemiBold.ttf', 'oxanium-semibold.woff2', 'Oxanium'], ['ShareTechMono-Regular.ttf', 'share-tech-mono.woff2', 'ShareTechMono']]) {
  const input = path.join(temporary, source);
  download(`${base}${source}`, input);
  execFileSync('pyftsubset', [input, '--unicodes=U+0020-007E,U+00D7,U+2014,U+2191-2193,U+2197', '--flavor=woff2', '--no-hinting', `--output-file=public/fonts/${target}`]);
  download(`${base}OFL-${family}.txt`, `public/fonts/licenses/OFL-${family}.txt`);
}
let sourceText = '';
async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name === 'cyberui') continue;
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await collect(file);
    else if (/\.(tsx?|css)$/.test(entry.name)) sourceText += await readFile(file, 'utf8');
  }
}
await collect('src');
await writeFile(path.join(temporary, 'characters.txt'), [...new Set(sourceText)].join(''));
const input = path.join(temporary, 'NotoSansSC.ttf');
download('https://raw.githubusercontent.com/google/fonts/main/ofl/notosanssc/NotoSansSC%5Bwght%5D.ttf', input);
download('https://raw.githubusercontent.com/google/fonts/main/ofl/notosanssc/OFL.txt', 'public/fonts/licenses/OFL-NotoSansSC.txt');
execFileSync('pyftsubset', [input, `--text-file=${path.join(temporary, 'characters.txt')}`, '--unicodes=U+0020-007E', '--flavor=woff2', '--no-hinting', '--output-file=public/fonts/noto-sans-sc.woff2']);
await copyFile(path.join(temporary, 'characters.txt'), 'public/fonts/characters.txt');
console.log('Prepared self-hosted WOFF2 fonts and retained their OFL notices.');
