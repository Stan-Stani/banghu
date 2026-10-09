# 문법 노트: sources and fact-check (2026-10-09)

Every explanation line of the twelve notes in `src/grammar.js` was checked against the pages below, opened and read (표준국어대사전
entries load their text by script, so they were rendered in headless Chrome). Each line now carries the numbers of the sources it
rests on, and the card lists the sources under 출처, the same way a 문화 노트 does. Examples (예문) carry no citations; each one was
reread for naturalness and for fit with the explanation, and none needed a change.

Sources, in order of preference:
- 한국어기초사전 (krdict.korean.go.kr): the learner's dictionary entry for the ending, particle or construction.
- 표준국어대사전 (stdict.korean.go.kr): especially its 「한 걸음 더」 notes.
- 한국어교수학습샘터 «문법·표현 내용 검색» (kcenter.korean.go.kr): 국립국어원's grammar material for teaching Korean as a foreign
  language, with meaning, forms, restrictions (제약 정보) and similar patterns (유사 문법). It has no entry for -기는 하다, 척, -대,
  -래, -다 보니 or -(으)라고, so those notes rest on the dictionaries.
- 국립국어원 온라인가나다 and 새국어생활: used once each, where neither dictionary covers the point.

Numbers below are the source numbers in each note's `src`.

## lge: -(으)ㄹ게
1. 한국어기초사전 「-ㄹ게」 (ParaWordNo=80987) · 2. 한국어기초사전 「-을게」 (80981) · 3. 한국어교수학습샘터 「-을게」 (id=198) ·
4. 한국어교수학습샘터 「-을래2」 (id=785)
- Line 1 (promise to the listener) [1,3]: kept.
- Line 2 (forms) [1,2,3]: **changed.** It said every verb with a final consonant takes 믿을게/먹을게. Both dictionaries and the
  샘터 entry say ㄹ-final verbs take -ㄹ게 (만들게, not 만들을게), so the line now adds "그런데 "만들다"는 "만들게"예요." (English: "But a
  verb ending in ㄹ, like 만들다, gives 만들게").
- Line 3 (only 나/우리; no questions; ask with 갈래?) [3,4]: kept. 샘터 제약 정보 ③ (주어는 1인칭만), ④ (의문문에는 사용할 수 없으며),
  and -을래2 (asks the listener's intention; its subject is the listener).
- Line 4 (할 거야 vs 할게) [3]: kept. 샘터 유사 문법 ②: -을게 "대화를 하는 상대방과 관계가 있으며", -을 거예요 "자신이 이미 결심한
  사실을 이야기한다"; ③: -을게 "초점이 듣는 사람에게 있다".

## geodeun: -거든
1. 한국어기초사전 「-거든」 (66501) · 2. 한국어기초사전 「-거든요」 (66503) · 3. 표준국어대사전 「-거든」 (word_no=390313) ·
4. 한국어교수학습샘터 「-거든2」 (id=216) · 5. 한국어교수학습샘터 「-거든1」 (id=96)
- Line 1 [1,3,4]: **softened.** "듣는 사람이 모르는 이유나 사정" → "듣는 사람이 모를 것 같은 이유나 사정": the sources say the speaker
  *thinks* the listener doesn't know (표준 "청자가 모르고 있을 내용", 샘터 "듣는 사람은 말하는 내용을 잘 모를 것이라고 생각할 때").
  English: "a reason or a background you think they don't know".
- Line 2 (다온's line) [1,4], line 3 (왔거든/왔거든요) [1,2], line 4 (mid-sentence -거든 = -으면) [1,3,5]: kept.

## buteo: N부터
1. 한국어기초사전 「부터」 (70055) · 2. 표준국어대사전 「부터」 (432619) · 3. 한국어교수학습샘터 「부터」 (id=37) ·
4. 국립국어원 온라인가나다 「보조사」 (2026-05-18, qna_seq=331236)
- Line 1 (start) [1,2,3] and line 2 (order: "first") [2,3]: kept. 샘터: "어떤 순서나 서열상 제일 먼저 할 일" (잠부터 잘 거예요); 표준:
  "너부터 먼저 먹어라".
- Line 3: **changed.** It said 부터 "takes the place of" 을/를. 국립국어원's answer says a 보조사 does not take over a case particle's
  role ("격 조사의 역할을 대신한다고 보기는 어려우며"); the case particle can be seen as left out, and 밥만 still works as the object.
  Now: "밥을 먹어"에 "부터"를 붙이면 "을"은 빠지고 "밥부터 먹어"가 돼요. 그래도 "밥"은 먹는 것이에요. (English: "Put 부터 on 밥을 먹어
  and the 을 drops out: 밥부터 먹어. 밥 is still the thing being eaten.")

## damyeo: -다며?
1. 한국어기초사전 「-다며」 (81466) · 2. 한국어기초사전 「-라며」 (81469) · 3. 한국어교수학습샘터 「-는다면서」 (id=237)
- All four lines kept. -다며 is the short form of -다면서; the polite form is -다면서요 (샘터: -다며 takes no 요); after a noun it is
  -라며 (반장이라며).

## gineun: -기는 하다
1. 한국어기초사전 「하다」 보조 형용사 (62899) · 2. 표준국어대사전 「하다」 (363685: 보조 동사 「5」, 보조 형용사 「1」) ·
3. 한국어기초사전 「ㄴ」 조사 (85847) · 4. 표준국어대사전 「ㄴ」 조사 (406398)
- Line 1: **softened.** "인정하지만, 다른 생각도 있을 때" → "어떤 일이 맞다고 일단 인정할 때": the dictionaries define it as
  "일단 긍정하거나 강조함"; the "other thoughts" part moved to line 4 as what can follow.
- Line 2 (다온 admits it's funny) [1,2]: kept.
- Line 3: **changed; one claim dropped.** "웃기긴 is short for 웃기기는" is kept in a form the sources state (ㄴ is the same particle
  as 는, "‘는’보다 더 구어적이다"): "웃기긴"은 "웃기기는"과 같은 말이에요. 말할 때는 이렇게 짧게 자주 말해요. The claim that you can
  repeat the word ("웃기긴 웃기네") was **dropped**: no source found.
- Line 4: **softened.** "뒤에 근데나 하지만이 자주 와요" ("often") → "좋기는 한데 비싸요"처럼 뒤에 다른 이야기가 오기도 해요: both
  dictionaries show a contrast after it (좋기는 한데 가격이 비싸다) but neither says how often.

## jana: -잖아
1. 한국어기초사전 「-잖아」 (86756) · 2. 한국어기초사전 「-잖아요」 (86757) · 3. 한국어교수학습샘터 「-잖아」 (id=294)
- Line 1: **changed.** "이미 아는 일을 다시 말할 때" → "이미 아는 일을 확인시켜 줄 때": the sources say it confirms or corrects
  (확인시키거나 정정해 주듯이), and the listener knew it already "in most cases" (샘터). English now "remind the listener of".
- Line 2 [1,3], line 3 (말했잖아, 아깝잖아요) [1,2,3]: kept.
- Line 4: **replaced.** "윗사람한테 자주 쓰면 따지는 것처럼 들릴 수 있어요" had no source (샘터 only says to add 요 for older or
  higher-ranked listeners, which line 3 already covers). Now the nuance the sources do give: 틀린 생각을 고쳐 주듯이 말할 때도 써요.
  그래서 핀잔처럼 들릴 때도 있어요. (krdict "정정해 주듯이"; 샘터 "고쳐 주려는 듯한 의도", "정보 전달, 사실 확인, 핀잔").

## cheok: -는 척하다
1. 한국어기초사전 「척」 의존 명사 (72054) · 2. 한국어기초사전 「척하다」 (72226) · 3. 표준국어대사전 「척」 (490923) ·
4. 한국어기초사전 「적」 의존 명사 (71232) · 5. 한국어교수학습샘터 「-은 적이 있다」 (id=803)
- Line 1 [1,2,3], line 2 (읽는 척 / 괜찮은 척 / 본 척) [1,2]: kept.
- Line 3: **made precise.** "적은 경험이에요" → "적"은 "때"예요. 이 말은 경험을 말해요.: 적 itself means a time (때); it is
  -은 적이 있다 that tells of an experience (샘터: "이때 '적'은 '때'의 의미와 비슷하다").

## dae: -대
1. 한국어기초사전 「-대」 (85757) · 2. 「-ㄴ대」 (86859) · 3. 「-는대」 (86860) · 4. 「-대요」 (85758) · 5. 표준국어대사전 「-데」
(415074) · 6. 한국어기초사전 「-데」 (77242)
- All three lines kept. -대 = -다고 해; 간대/먹는대/바쁘대; -대요. 표준 「-데」 한 걸음 더: -데 means the same as -더라 (what you
  experienced yourself), while -대 passes on what someone else said.

## rae: -래
1. 한국어기초사전 「-래」 (86535) · 2. 한국어기초사전 「-으래」 (80914) · 3. 한국어기초사전 「말다」 보조 동사 (72580)
- All four lines kept. -래 = -라고 해 (sense 3: passing on a command); 먹으래 (-으래); 가지 말래 (-지 말다 + -래, which attaches to
  ㄹ-final verbs); after a noun (이다) it reports a statement (sense 1: 겨울이래, 영화래).

## daboni: -다 보니
1. 한국어기초사전 「보다」 보조 동사 (62171, sense 5) · 2. 한국어기초사전 「-다가 보다」 (75171)
- Line 1: **softened.** "계속 하다가" → "하다가": the sources say "하는 과정에서"; "계속" (keep doing) is not in them.
- Line 2 (구름's line) [1]: kept.
- Line 3: **softened.** "앞으로의 일은 '열심히 하다 보면 늘어요'처럼 말해요" ("For the future") → "열심히 하다 보면 늘어요"처럼
  "하다 보면"도 써요: the sources list -다(가) 보면 with general and future examples alike, not as the future form.

## rago: -(으)라고 (purpose)
1. 한국어기초사전 「-라고」 (86501) · 2. 한국어기초사전 「-으라고」 (87174) · 3. 표준국어대사전 「-라고」 (534431) ·
4. 권재일, 「어순」, 새국어생활 2006년 봄호 (국립국어원)
- All four lines kept. Line 3 (in speech it can come after the sentence) rests on 권재일: in spoken Korean, moving a non-predicate
  part to the very end of the sentence is common and natural ("서술어 아닌 성분이 문장 맨 뒤로 이동하는 경우가 많다").

## deora: -더라
1. 한국어기초사전 「-더라」 (81524) · 2. 한국어교수학습샘터 「-더라」 (id=251) · 3. 한국어기초사전 「-더라고요」 (82330) ·
4. 한국어기초사전 「-대」 (85757)
- All four lines kept. Line 3 (heard it from someone → 좋대, not 좋더라): 샘터 제약 정보 ④ ("민수에게 들으니까, 철수가 … 걷더라 (x)")
  with -대. Line 4 (polite 좋더라고요): -더라 takes no 요 (샘터 ①), -더라고요 is the 두루높임 form.

## Also changed
- `lexicon/defs.json`: 인정하다, 핀잔, 확인시키다 (new words in the lines). `lexicon/fixes.json`: 한데 (하다 + -(으)ㄴ데), and
  "부터"는 / "부터"를 → -부터.
