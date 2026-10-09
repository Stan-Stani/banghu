# Owner decisions, 2026-10-09: mic timing, a shorter form errand, cueing the song

The owner approved three changes from the full-run playtests. Save keys and flags are unchanged. A save made partway through any of these
scenes reloads into the new version without a migration (details under each item).

## 1. 2교시: the mic moment has timing (`src/chapters/ch2.js`, 하리 at the mic, `hariMic`)
- **Before:** 구름 built the moment up ("내가 신호 줄게", "삼, 이, 일…", "지금!"), and then you got one button, "🎙️ 마이크 켜기". It couldn't go wrong.
- **Now:** 구름 gives the rule twice. At his briefing he says "{반주} 먼저. {전주} 끝나면 마이크." (this replaces "삼 초 뒤에 마이크"),
  and at the mic he says "마이크는 네가 켜. {전주} 끝나면 바로." No one counts down any more. The 반주 starts, and you choose when:
  1. "♪ 띵, 띵… 하리가 눈을 감고 숨을 쉬어요." → `🎙️ 마이크 켜기` / `기다리기`. Turning the mic on here is too early.
  2. "♪ …{전주}가 끝나요. 하리가 입을 열어요." → `🎙️ 마이크 켜기` / `기다리기`. Turning it on here is right, and the song goes on air as before.
- **Too early:** 하리's breathing goes out on air. 찬: "푸흡! 숨소리 생방송!" 다온: "…찬, 네 웃음도 생방송이야." This is the
  "우리 목소리가 나가" that 구름 warned about. 구름: "아직 {전주}야. 끄고… 처음부터!" The 반주 then starts again.
- **Too late:** 하리 starts singing into a dead mic and asks "…선배? 제 목소리 나가요?" 구름 restarts the 반주.
- It never fails, and both choices keep the same order every time. The right path takes 2 choices. The new DICT gloss `전주` is in
  ch2, and defs.json has 전주, 띵 and 들르다.
- **Mid-scene save:** no flag is set until the mic goes on (`onAir`), so a reload starts the talk with 하리 over.

## 2. 3교시: one round trip less (`src/chapters/ch3.js`)
- **Before:** 교무실 (form) → 도서관 (찬 signs) → back to the 교무실 to submit → the 복도 게시판.
- **Now:** when 찬 finishes ("이제 답답한 거 없다! 시원하다!"), the 도서관 door opens and 정 선생님 walks in. She heard him from the
  hall. She is a new NPC, `jungLib`, standing at 6,7 in the 도서관. She walks in from the door (`walk:`), and you talk to her right there.
  Her lines are the old submission scene: she takes the form, then asks the Q.jungS question and takes 찬's 독후감 ("…오, 맞춤법이 많이
  좋아졌네요."). Then she sends you to 다온 at the board and walks out (`leave:`).
- **Positions and hide rules:** the 교무실 `jung` is hidden while `signed5 && !submitted`. `jungLib` shows only then. Her 교무실
  status no longer has the "submit" todo. The old submission branch in her 교무실 script is now a one-line stub that can't be reached.
- **Lines:** at the 교무실 she now ends with "좀 도와줘요. 저도 이따 도서관에 들를게요." (it was "…다 쓰면 이름도 받아 와요."). This
  sets up her visit. 찬 waiting in the 도서관 now says "선생님 저기 계셔. 빨리 내. …". The 목표 reads "도서관 · 정 선생님한테
  제출하기" (it was "교무실 · 신청서 제출하기").
- **Lines left as they were:** 구름's "대신 다녀와 줘서 고마워. 교무실은 사람이 많아서 답답해" (you still went to the 교무실 once,
  for the form) and 다온's "신청서는 아침에 정 선생님한테 맡겼어".
- **Mid-scene save:** an old save between 찬's signature and the submission finds her in the 도서관, standing at her spot.

## 3. 4교시: you cue 하리's song (`src/chapters/ch4.js`, the show in `gureumS`)
- **Before:** from the 교장실 to the end you mostly pressed A.
- **Now:** after 하리's "다음 곡… 제가 부를게요.", "구름이 나를 보고 하리 마이크를 가리켜요." 태식 starts the 반주 and you get one
  3-choice moment: "♪ …전주가 끝나요. 하리가 나를 봐요." → `아직` / `조금 더` / `🎙️ 지금!`. The cue is the same as in 2교시: the
  mic goes on as the 전주 ends.
  - `조금 더`: her first words are lost. "…어? 선배?" 다온 (who keeps the time): "괜찮아. 시간 있어. 한 번 더!" The 반주 starts again.
  - `아직`: the yard hears only the 반주. 찬: "여러분, 하리 목소리는 마음으로 들으세요!" The yard laughs, and 하리 does too. The
    반주 starts again.
  - `지금!`: "딸깍." The song plays on. 구름 whispers "타이밍 완벽. 첫 방송 때처럼." before his Q.live question. The rest of the show
    and the 교장's arrival are unchanged.
- **Mid-scene save:** `singing` and `live` are set only after the right cue, so a reload replays the show from its start.

## Tests
- `tests/driver.js`: plain `choose` choices still click the last option by default. A walk step can now pass `pick:[label,…]`, and
  the driver then clicks those labels in order. It tries an exact match first, then a substring match, so the walks can leave off the 🎙️.
- `tests/walk/ch2.js`: `hariMic` picks too early, wait, too late, wait, mic on, so both retries get played.
- `tests/walk/ch4.js`: `gureumS` picks `조금 더`, `아직`, `지금`, so both wrong beats get played.
- `tests/walk/ch3.js`: after 찬 signs, a check that 정 선생님 is in the 도서관 and not the 교무실. Then `{talk:'jungLib'}` replaces
  the trip to the 교무실, and a check confirms that the form and 독후감 are handed in and she is back at her desk.
- **Checks run:** `python3 build.py && node tests/validate.mjs`, `lexicon/extract.py` and `coverage.mjs` ch2–ch4 all pass (0 without a
  definition, 100%).
- **Not run:** `play.mjs` and Chrome, as the brief said. I walked the new branches in a VM instead, stubbing `openDialog` and following each
  pick list. Every path ends where it should: 2교시 on the finale line, 4교시 on "그때, 교장 선생님이 무대 앞으로 와요.".
  The next playtest should look at the 도서관 walk-in (정 선생님 from the door to 6,7) and how long the three choice lines are on a phone.
