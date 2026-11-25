// Rush Hour Kitchen — the entrypoint for make.fun's best-cooking-game bounty.
// Node 22, standard library only. The game itself is plain static files under
// game/ (index.html, no build step, no network requests), and this program is
// the handoff: it copies game/ and screenshots/ from beside this file into the
// grader's output directory and writes dossier.json there, using the vendored
// make.fun game library to build the dossier the judge reads.
//
// Run it outside the grader with MAKEFUN_OUTPUT_DIR standing in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

// Paths are resolved from this file's own directory, never from the cwd,
// so the program behaves the same wherever the grader invokes it from.
const here = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outDir, { recursive: true });
cpSync(join(here, 'game'), join(outDir, 'game'), { recursive: true });
mkdirSync(join(outDir, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });
}

// Dossier caps from the scorer's reference: text budget shapes the bytes,
// the rest refuse an entry the scorer would refuse (too many or too large
// screenshots, too many game files, game files too large in total, or a
// game path that is too long — game/ counts against /output's own cap).
writeFileSync(
  join(outDir, 'dossier.json'),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);
