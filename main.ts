// Entry for make.fun's news-image-20261122: one image that sums up the world
// news of Sunday 22 November 2026. The picture ships in this repository as
// entry.png (a JPEG under a .png name, which the gate allows: it tells PNG
// from JPEG by the first bytes). This program's whole job is to place those
// exact bytes at /output/entry.png, so both grader runs produce the same
// file. Node 22, standard library only, no network.
//
// Locally:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const src = join(here, 'entry.png');
const dst = join(outDir, 'entry.png');

// The gate tells PNG from JPEG by the first bytes and rejects a file that
// is neither, so sniff the magic before copying: this entry ships JPEG
// bytes under the entry.png name, which the gate expressly allows.
const head = readFileSync(src).subarray(0, 8);
const isJpeg = head[0] === 0xff && head[1] === 0xd8;
const isPng = head.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47]));
if (!isJpeg && !isPng) {
  throw new Error('entry.png is neither PNG nor JPEG by its first bytes');
}
const format = isJpeg ? 'JPEG' : 'PNG';

// The grader hands us a writable /output; locally MAKEFUN_OUTPUT_DIR may
// point at a folder that does not exist yet, so make sure it is there.
mkdirSync(outDir, { recursive: true });
copyFileSync(src, dst);

// Both grader runs must produce the same bytes, so verify the copy landed
// whole: a size mismatch would mean a truncated write, and failing loudly
// here beats silently submitting a broken image to the gate.
const want = statSync(src).size;
const got = statSync(dst).size;
if (got !== want) {
  throw new Error(`entry.png copy truncated: wrote ${got} of ${want} bytes`);
}
console.log(`entry.png: ${got} bytes of ${format} copied to ${dst}`);
