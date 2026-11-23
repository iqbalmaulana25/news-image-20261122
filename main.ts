// Entry for make.fun's news-image-20261122: one image that sums up the world
// news of Sunday 22 November 2026. The picture ships in this repository as
// entry.png (a JPEG under a .png name, which the gate allows: it tells PNG
// from JPEG by the first bytes). This program's whole job is to place those
// exact bytes at /output/entry.png, so both grader runs produce the same
// file. Node 22, standard library only, no network.
//
// Locally:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The grader hands us a writable /output; locally MAKEFUN_OUTPUT_DIR may
// point at a folder that does not exist yet, so make sure it is there.
mkdirSync(outDir, { recursive: true });
copyFileSync(join(here, 'entry.png'), join(outDir, 'entry.png'));
