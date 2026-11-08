import { execFileSync } from 'node:child_process';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import sharp from 'sharp';

const temporary = await mkdtemp(path.join(tmpdir(), 'arasaka-media-'));
const machine = path.join(temporary, 'cybermachine.png');
execFileSync('curl', ['--fail', '--silent', '--show-error', '--location', '--retry', '2', '--max-time', '60', 'https://raw.githubusercontent.com/Arasaka-Academy/CyberMachine/bad1f7f7d4f72a296fcca2286984ff70e44040ca/docs/images/r2/exploded.png', '-o', machine]);
await sharp(machine).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 85 }).toFile('public/images/cybermachine.webp');
await sharp('public/images/social-source.svg').png().toFile('public/og-image.png');
await sharp('public/icon.svg').resize(180, 180).png().toFile('public/apple-icon.png');
console.log('Prepared the real CyberMachine digital assembly image and sharing assets.');
