import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'public');
const target = path.join(root, 'docs');

await fs.mkdir(target, { recursive: true });
await fs.cp(source, target, { recursive: true, force: true });
await fs.writeFile(path.join(target, '.nojekyll'), '', 'utf8');
console.log(`GitHub Pages 站点已生成：${target}`);
