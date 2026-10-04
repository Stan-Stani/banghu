# Learner playthrough of 1교시 (2026-10-04)

A fresh agent played 1교시 as a rusty TOPIK-3 learner, using only the screen. It never read the code. It took about 370 actions,
answered 31 questions (29 right; both wrong answers came from the A-press bug, now fixed in the engine) and looked up 22 words.
Screenshots: /tmp/banghu-manual/shots/.

## Engine fixes already done (don't work around them)
- **Choices:** nothing is selected when choices appear, and A can't answer by accident. A long-press on a word in a choice shows its definition.
- **The 나 speaker:** `who:'나'` on a step shows "나" with no portrait, and the feedback after that question comes from the NPC.
- **Praise:** after a right answer it is "맞아요!", or "맞아!" if the NPC has `banmal:1`, or the step's own `ok:'…'`.
- **Room label:** it fades after 2.5 s, so it no longer hides ! markers.
- **Popups:** A closes an open definition popup first, without advancing the dialogue.

## Content rules for every chapter
1. **The player's own lines.** Any `ask`/`build` whose sentence is something the PLAYER says (e.g. "사실대로 말할게. 버스가 안 ___") gets `who:'나'`.
   The playthrough saw these labelled with the NPC's name and portrait and couldn't tell who was talking.
2. **반말 friends.** NPCs who speak 반말 to the player (classmates, younger students) get `banmal:1`, so praise is "맞아!".
3. **Doors.** A door drawn more than one tile wide must be a warp on every tile. The cafeteria door in 1교시 only worked on its left tile.
4. **Doors must look like doors.** The 방송실 door looked like a trash can or locker. Also make an NPC hint where key rooms are
   (e.g. "방송실은 복도 끝이야.").
5. **Definitions (DICT k) must be simpler than the word.** The learner hit: 얼른 → "시간을 끌지 않고", 경례 → "구령", 반장 → "대표하다",
   소문나다 → "퍼져요". Use words a TOPIK-2 learner knows, or add a tiny example.
6. **Quizzes must make you think.** Many questions repeated the definition the learner had just tapped, almost word for word
   (벌금, 사실대로, 지우개). The best questions were form contrasts (줍었어요/주웠어요/추웠어요), near-words (종례/조례), and
   choosing the right word for a new situation. Rewrite definition-echo questions into new contexts, contrasts or grammar choices.
7. **Logic and continuity.** Lines must match the moment, the time of day and what the player knows (examples below).

## 1교시-specific issues from the playthrough
- **Goal:** the goal says "점심 먹기", but the player never eats. Either let them eat, or change the goal.
- **Food tray:** "식판이 깨끗해요. 다 먹었어요." reads as if the player has already eaten.
- **다온:** says "수업 시간에는 조용히 해" right after the lunch bell.
- **찬, ghost:** after the player says they didn't see the ghost, 찬 says "에이…" and then "부럽다". It doesn't follow.
- **찬, 방송실:** knows the player is going to the 방송실 without being told.
- **Ending:** the ending narration has the player opening the shoe locker while standing in the hallway.
- **First line:** the very first narration line went by before it could be read. Consider a short, slower opening line.
- **Fine:** "★ 일부러 완벽!" appeared while the word was at level 3/5. That's the engine's ★ threshold, so leave it.

## What worked (keep it)
- **Mystery and humour:** the 복숭아 note mystery, the "귀신 봤대" rumour, the ghost song at the end, and 구경 coming back as a joke at 종례.
- **Practice:** the word-order tiles and the ? review markers.
- **Objects:** inspectable objects with flavour, and no instruction text.
- **Word extras:** 걷다 explaining "걸어요는 발로 가는 걷다", and the hanja note on 하필.
