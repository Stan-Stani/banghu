# 방과 후

A small Korean vocabulary game: the words and grammar patterns of a school-life webtoon's first four episodes, taught
through short **original** everyday sentences. It has no characters and no story. Each episode is a class period
(1교시–4교시); learning a period's key words opens the next. 복습 brings words back as pop quizzes (spaced repetition),
단어장 collects them (말 · 문법), and you can tap any word for a Korean definition (? for English, tap to pin).

Play: https://stan-stani.github.io/banghu/

- `src/words.json`: the word list (dictionary forms, English glosses, which period, frequency). It's built locally by
  `tools/build_words.py` from per-episode word tallies. The captures and tallies stay in the gitignored `source/`.
- `tools/sentences/out-*.json`: the original example sentences, reviewed. `tools/assemble.py` builds them into `src/data.json`.
- `python3 tools/assemble.py && python3 tools/build.py` builds `index.html`. `node tests/play.mjs ch1 flow` plays it in headless Chrome.

Unofficial study aid; no text or images from the webtoon are included.
