// Vercel's generated Node launcher loads Next from the deployment root. In
// subdirectory builds the adapter traces these same dependencies under web/.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const prefix = path.basename(process.cwd());
const functions = '.next/output/functions';
let added = 0;
for (const entry of await readdir(functions, { recursive: true })) {
  if (path.basename(entry) !== '.vc-config.json') continue;
  const filename = path.join(functions, entry);
  const config = JSON.parse(await readFile(filename, 'utf8'));
  if (!config.filePathMap || !config.runtime?.startsWith('nodejs')) continue;
  for (const [dest, source] of Object.entries(config.filePathMap)) {
    if (!prefix || !dest.startsWith(prefix + '/node_modules/')) continue;
    const alias = dest.slice(prefix.length + 1);
    if (Object.hasOwn(config.filePathMap, alias)) continue;
    config.filePathMap[alias] = source;
    added++;
  }
  await writeFile(filename, JSON.stringify(config));
}
console.log('Added runtime dependency paths for Vercel launchers:', added);
