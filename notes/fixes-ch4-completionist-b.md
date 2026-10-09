# 4교시 completionist playtest (b): post-ending fixes

The report is a pass over the world after the ending (festival day, 오후 네 시). Each item below says what changed, or why it didn't.

## Bugs
- **박 경비 아저씨 quizzed every talk.** Talking to him wasn't a story beat. The 4교시 guard never called `quizLine` at all:
  his script always added a random `Q.guard` item (picked with replacement, so a repeat could come right after a right answer) after the
  meta line "잠깐, 전에 배운 단어 하나 복습해요.". He now uses `quizLine(GUARD_Q,'guard')`, which allows one quiz per story beat and
  only says hello after that. The lead-in is "자, 아저씨가 문제 하나 낼게요." (his line from 3교시).
  - `quizLine` (src/school.js) picks the quizzer's own `C.REVIEW` lines first (by their id) when the word is due. It skips any word
    asked in this conversation or the two before it (`askedIn[w] >= talkN-2`; the engine's `isDue` only skipped one), so he can't ask a
    word the laptop just asked. The fallback also skips a word asked recently. Only 4교시's guard has REVIEW lines of his own, so the
    other quizzers (1교시 이모, 2교시 분식집, 3교시 경비) behave as before apart from that recency rule.
  - His voice: 4 new REVIEW lines (`by:'guard'`) for earlier words (벌금, 엿듣다, 기회, 얼다), graded. A due
    word he has no line for is still asked in its notebook sentence after his "문제 하나" lead-in. With nothing due he asks one of
    `GUARD_Q`: 5 questions in his voice (명찰, 오해하다, 마주치다, 소문나다, 창피하다), ungraded and kept out of `Q` (their words
    belong to other 교시). The old ending-only item (고쳐야/고치러) is gone.
  - No ★ toast: the old `Q.guard` items had no `w` and no `review` flag, so they were never graded. His due-word questions now carry
    `review:true`. A ★ toast still shows only when a word reaches level 3.
- **Balloon line, but no balloon drawn** (1층 복도 and the 교장실 wall): the line is now "벽에 축제 안내 종이가 붙어 있어요.". The
  교무실/교장실 walls get the plain lines, as in the shared school (the 4교시 override had lost that split).
- **Orange ★ over people:** not changed. The owner still has to decide on markers. 다온 also gets two more post-ending lines (4
  rotate now), so she repeats herself less.
- **Album phone clock 13:42 at 4 pm:** that clock is the phone's status bar, which shows the current time, not when the photo was
  taken. `DJ_PHOTO.time` now follows the story like the 운동장 clock: 13:42 when 찬 takes the photo, 13:50 before the show, 14:05 on
  air, 16:00 after.

## Confusion
- **Laptop vs ★:** the 일지 ★ counts 4교시 words only. When the laptop's due words are all from earlier 교시, 4교시's `term.due` now
  adds " 다 1~3교시 단어예요." When only some are, it adds " 1~3교시 단어도 있어요.". 4교시's `term.allWords` no longer mentions the
  notebook: "다시 맞힐수록 ★가 늘어나요. 사람들이 또 물어볼 거예요." (people do ask 4교시 words after the ending).
  src/game.js is unchanged because its message is true in 1–3교시.
- **하리 and 찬 after the ending:** each now has 4 post-ending exchanges, and `pickNew` never picks the same one twice in a row.

## Korean
- 교장: "아시다시피" became "여러분도 알다시피".
- "써 있어요" became "쓰여 있어요" everywhere: ch1 (9), ch4 (7), and two glosses in lexicon/defs.json (메뉴판, 명함). school.js
  already had 쓰여.
- Items that tested endings, not words:
  - 태식 쏘다: 쏠까 became 쏟을게.
  - ch1 BANK 쏘다: 쏠까요 became 쏟을게요.
  - The grammar-block items marked `gram:1`, like the first item in each block: ch1 동갑 (동갑이거든/동갑일게), 설레다, and the
    round-2 쏘다 tense item; ch2 놀리다, 포기하다, 긴장하다. These were all BANK sentences the 4교시 laptop could ask.
  - The guard's 고쳐야/고치러 item was removed.
- Non-forms: 체육 선생님's 줍어 became 지워 (a sound-alike word). The same non-form was also fixed everywhere else (줍어/줍었어요/
  줍었어 in ch1, ch2, ch3), plus 엿듣었어요 (ch3 BANK, now 잊었어요) and 엿들지 (4교시 태식, now 열지).
- Glosses (lexicon/defs.json):
  - 보다 now also means "check on, look after" (문제가 없게 살펴요), for "회로는 내가 봤어" and "소리는 내가 볼게".
  - 듣다 is in 해요체 (귀로 소리를 알아요).
  - 하다 is no longer circular (어떤 일이나 행동을 이뤄요).
  - New analyzer fixes: 쏟을게(요) → 쏟다 + -(으)ㄹ게.
- 편의점: "나도 라디오…" became "저도 라디오…", since he speaks to customers. The guard's "나도 들을게요" stays: an older adult
  using 나 with 해요 to students is natural.
- 분식집: "텔레비전 광고" became "방송에 광고 한번 해 볼까요?".

## State mismatches after the show
- 체육 선생님 (gate): his talk after the show is "축제 끝! 다들 수고했어요. / 정리 끝나면 조심히 집에 가요.". His show-time lines
  (분위기 밀지 마요, 쫓겨나다) now have `when:!done`, and a new 분위기 line covers after the show.
- 1반 떡볶이 부스: from the afternoon it says "\"다 팔렸어요!\" 종이가 붙어 있어요.", matching its seller.
- 문구점 사장님: her `after` follows the days ("오늘 축제죠?…", then "방송 잘 들었어요…" / her daughter wants to join). Her 효과
  and 동네 lines have pre-show and post-show versions.
- 2학년 3반 door/window: from the afternoon, everyone is in the 운동장 (the classroom is empty).
- Posters as news: the shop windows and the 1층 게시판 say "붙었어요!" only on the evening the posters go up, and "아직 붙어 있어요"
  from the festival morning on.
- 학원/street night look: `evening()` (after school until the festival morning) controls the lamp light and its line, the 학원
  windows (lit or sky in the glass) and their line, and the 학원 hall windows (night street or day street) and the "창밖이 벌써
  어두워요" line. At 4 pm on the festival day it's all daytime.
- 방송실 sign vs lamp: both blink after the show (VARIANTS), so both lines say so: the sign "빨간 불이 아직 깜빡깜빡해요" and the lamp
  "방송은 끝났는데 아직 깜빡여요" (it said "아직 따뜻해요").
- 태식: "사흘 전에 학원 빠진 거…" (today is his day off).
- 구름: "정 선생님한테 상담 받을까? 방송하고 공부, 둘 다 하는 법." fits his promise.
- End round: 2학년 학생's 심화반 line is now true at any time ("나 심화반 시험 떨어졌어. 그래서 오늘은 놀 거야."). `wrapUp`
  quotes heard lines without their `when`. 다온's 약속 line became "농담하면 벌금. 이건 우리 약속이야." (not "방송 끝나고").
  Other pre-show lines can still come back in the end round. They read as recollection ("오늘 배운 말, 한 번 더 떠올려요"), so
  they stay.

## Not done / for later
- 1교시 매점 이모 still uses a meta lead-in ("먹으면서 전에 배운 단어 하나 복습해요."). It's outside this report.
- Checks: build + validate ok; extract 0 without a definition; coverage 100% ch1–ch4. Not played in Chrome. The quizLine/guard/term
  logic was unit-checked in a vm (no browser).
