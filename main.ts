// The Night Shift Diner — a make.fun best-cooking-game entry (Node 22, stdlib only).
//
// The game lives in game/ as plain static files the browser loads with no network:
// game/index.html plus its inline scripts and styles. This program hands the entry
// in by copying game/ and screenshots/ next to this file into the output directory
// and writing /output/dossier.json, the summary the judge reads, built with the
// vendored make.fun game library.
//
// Run it outside the grader with MAKEFUN_OUTPUT_DIR standing in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

// This file's own directory, and where the hand-in goes.
const root = fileURLToPath(new URL('.', import.meta.url));
const output = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Fresh output, then the game, then the screenshots, then the dossier.
mkdirSync(output, { recursive: true });
cpSync(join(root, 'game'), join(output, 'game'), { recursive: true });
mkdirSync(join(output, 'screenshots'), { recursive: true });
if (existsSync(join(root, 'screenshots'))) {
  cpSync(join(root, 'screenshots'), join(output, 'screenshots'), { recursive: true });
}

// The caps are the bounty's own gate.json values: the text cap shapes the dossier's
// bytes, and the rest refuse an entry the scorer would refuse anyway (no more than
// 4 screenshots, none over 256 KiB; no more than 993 entries or 48 MiB under game/).
writeFileSync(
  join(output, 'dossier.json'),
  buildDossier(output, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);
