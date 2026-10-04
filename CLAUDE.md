# 방과 후 — school walk-around Korean game

Source lives in `src/` (`shell.html`, `chapters/chN.js`, `engine.js` — the engine is a copy of 성실호's, exodus-a); `python3 build.py`
assembles the single-file `index.html`, published as a claude.ai artifact and on GitHub Pages (public repo Stan-Stani/banghu).
Never edit `index.html` by hand. Each chapter (교시) is a cartridge with its own save key; never change an existing key or break its saves.

## What the game is
- **Story:** the story, cast and places are original, from `notes/story.md`. Nothing from the webtoon the vocabulary came from: no names, scenes or plot.
- **Vocabulary:** from that webtoon's first four free episodes, one chapter per episode. `tools/build_words.py` builds `src/words.json` from the
  local tallies in `source/`, which is gitignored and never committed: no dialogue, notes, images, or Korean gloss fragments in anything public.
- **Learner:** rusty intermediate (~TOPIK 3) on a phone. Korean only, with English behind ?. No on-screen instruction text.

## Checks before publishing
- `python3 build.py && node tests/validate.mjs`
- `python3 lexicon/extract.py .` must report `0 without a definition` (add to lexicon/defs.json; analyzer misreads → lexicon/fixes.json).
- `node tests/coverage.mjs chN`: every object tile says something when inspected; keep it at 100%.
- `node tests/play.mjs chN` plays `tests/walk/chN.js` with real key presses (400px phone viewport) and must end with `ERRORS: none`.
  One playtest at a time (machine-wide lock); never more than 2 agents playtesting in parallel (this 7 GB machine froze once).
- `python3 tests/sheet.py chN`, then LOOK at every contact sheet.
