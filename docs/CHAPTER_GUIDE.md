# Writing a chapter of 방과 후

Read first: `CLAUDE.md`, `notes/story.md` (the story bible: cast, chapters, word lists), and `/var/home/stan/Developer/exodus-a/src/chapters/ch1.js` (a reference chapter from the sister game — copy its shape; once 방과 후's ch1 exists, use that).
You write exactly two files: `src/chapters/chN.js` and `tests/walk/chN.js`. Never edit `engine.js`, `shell.html`, other chapters, or `index.html`.
If you need an engine feature, stop and report it instead.

## The learner (design for this person)
- Rusty intermediate Korean (~TOPIK 3). Reads Hangul fluently. Comprehension > production.
- **Korean only** in dialogue, in short simple sentences (해요체). English appears only in `DICT[...].e` (shown behind a tap).
- Plays on a phone. **No instruction text** ("press A", "go here") — the world explains itself: locked doors say why, NPCs point the way,
  the 목표 line (questText) names the place + task in a few Korean words.
- Known words/grammar: see `notes/` learner profile summary below. Use known words freely around the new ones.
- Their real mistakes make the best wrong options: 상대/상태, 짓다/짖다/지다 (지을↔질), 돌려주다/돌아가다, 받다/맞다, 고치해야, 견디다/참다.
- Sino-Korean links to known words delight them (`hj` field): e.g. 연료 ↔ 연체료, 관측 ↔ 관중.
- Every wrong option needs a gentle 1–2 sentence Korean explanation that shows the right form.

Known words (selection): 집 학교 도서관 경기장 도장 연구소 카페 사람 선생님 박사 친구 상대 심판 관중 선수 강아지 고양이 배지 기술 공격 방어 상태 회복
시합 경기 규칙 연습 공부 단어 문장 사전 질문 연구 책 핸드폰 의자 탁자 침대 문 주머니 병 열쇠 가방 나무 연못 음식 과일 밥 커피 간식 빨래 반납 연체료
조합 구현 세계 이야기 건강 경고 의견 시간 주말 내일 오늘 처음 마지막 눕다 자다 떨어지다 떨어뜨리다 놓다 넣다 두다 들다 물다 따르다 지키다 빌리다 돌려주다
돌아가다 참다 견디다 개선하다 고치다 어울리다 짓다 짖다 이기다 지다 싸우다 가르치다 배우다 만들다 먹다 낫다 만지다 받다 이해하다 설명하다 저장하다 기억하다
추천하다 결정하다 구경하다 모으다 읽다 피곤하다 강하다 작다 크다 복잡하다 다양하다 자연스럽다 헷갈리다 아프다 무겁다 춥다 맛있다 중립적 어리다 늙다.
Plus every word taught in earlier chapters (they may appear in dialogue and as distractors, never re-taught as badges).
Grammar they use: 해요체, particles, -(으)ㄹ 거예요, -(으)ㄹ 것 같다, -아/어야 돼요, -(으)ㄹ 수 있다, -고 싶다, -(으)ㄴ 적 있다, -(으)면, -지만, -는데, -아/어서, -(으)ㄹ 때, -아/어 주세요.

## Story rules
- The story, cast and places are original and live in `notes/story.md`; follow it. Nothing from the webtoon the words came from (no names, scenes or plot).
- Tone: warm slice-of-life school story with humor; age-appropriate (crushes in the background are fine, nothing sexual); mild teen slang is fine.
- Speech: teachers/adults 해요체 (or 합쇼체 for announcements), friends 반말, younger→older students 해요체.
- Use your chapter's "weave" words from `notes/story.md` naturally in dialogue — they are tappable for a definition even when they aren't badges.

## Shape of a chapter file
```js
CHAPTERS.push({id:'ch2',n:'2교시',title:'…',place:'교실 · 복도 · …',words:20,save:'banghu-ch2',color:'#5A8FB0',
 start:{zone:'…',x:…,y:…,dir:'down'},introWho:'레스타리',
 make:()=>{
  /* 2교시 · … — story: notes/story.md (2교시). */
  const WORDS=[…15–16 words…];
  const DICT={ word:{k:'Korean definition',e:'English',ex:'예문',hj:'漢字 · link to a known word'}, gloss:{k,e} … };
  const CONFUSE={word:['sound-alike','sound-alike']};   // used by listening questions
  const BANK=[ {w,ask,opts}… ];                          // ≥1 extra review question per word
  const Q={ npcKey:[ {w,ask:'… ___ …',opts:[['right',1],['wrong',0,'why, in Korean']]} … ] };
  const ITEMS={'item name':'description'};
  const f=()=>state.f; const hasItem=i=>state.items.includes(i);
  const TILES={ myTile:(X,Y,x,y,t)=>{…} };               // new tile drawings for this chapter
  const ZONES={ zoneId:{name,reg,legend,map,rooms,warps,spots,npcs,dark?,outdoor?,base?,planet?} };
  const NPC={ key:{name,zone,x,y,dir,look,badge,after,talk:()=>[…],script?,status?,pos?,hide?,pool?} };
  const FOLLOW=null | {name,look,when:()=>bool,talk:()=>[…]};
  const INTRO=[{who,say}…]; const DONE=['…','…'];
  function questText(){ … return 'place · task'; }
  const PLAYER=undefined; // optional player look (default: a Diligent crew member); or a function ()=>look to change it mid-chapter, e.g. a disguise
  return {WORDS,DICT,CONFUSE,BANK,Q,ITEMS,ZONES,NPC,FOLLOW,INTRO,DONE,questText,TILES,PLAYER};
 }});
```

### Dialogue steps
`{say}` · `{ask:'… ___ …',opts:[[text,1],[text,0,'why']],w}` · `{build:['어절','어절',…],w}` (tap words in order; 3–5 pieces) ·
`{listen:w}` (only in review; engine builds it). Add to any step: `award:[words]` (adds to the log — put it on the LAST step of a talk),
`give:'item'`, `take:['item']`, `set:()=>{f().flag=1}`, `who:'speaker'`, `when:()=>bool` (skip if false), `finale:1` (on the very last line of the chapter).
Gloss markup inside text: `{shown text|DICT key}` — use for non-badge words a learner may not know.
Every `ask` and `build` needs `w` (the word it practises). Review reuses all `Q` and `BANK` questions.

### NPCs and sprites
People use the humanoid generator: `look:{hair,skin,shirt,pants,belt?,shoes?,style?,cap?,coat?,beard?,arm?}` (hex colors except flags).
`style`: 'short' | 'long' | 'bob' (fringe, chin-length) | 'bald' (grey/colored sides = hair) | 'bun' | 'spiky'.
`lashes:1` (bigger lashed eyes) and `lips:'#hex'` read as feminine — use them for women (Ellie, Dejean, Otylia, Lina…). `coat:1` = long coat over the legs. `cap:color`. `beard:color`.
`arm:color` = mechanical left arm. Follow the book's physical descriptions (outline section C).
Anything that is not a regular human (Gath 3 m tall, the Daves' glowing quartz skin, Knights, Celestials, Ovar beetles, Icarians, saberstones,
drones…) gets a custom pixel-art sprite: `look:{art:{pal:{key:'#hex',…}, down:[rows], up:[rows], left:[rows], walk?:{down:[[rows],[rows]],left:[…]}}}`.
Rows are equal-length strings (≤16 wide, up to 32 tall); '.' is transparent; right = mirrored left. Sprites stand on the tile's bottom edge, so
a 16×32 sprite towers over its neighbours. Outline with '#1B1E2B', light from the top, 2–3 shades per material. `drawArt(rows,pal,X,Y,flip)`
is also available inside TILES for detailed tiles. `kind:'andy'` + `look:{body,visor}` still draws the simple robot.
`badge:[words]` = words this NPC teaches; `talk()` = first conversation; `after` = line before a review question once taught.
`script()` returns steps to override talk (state-dependent scenes) or `null` to fall back. `status()` returns 'todo'|'wait'|null|undefined (marker override).
`pos()` → [x,y] for an NPC that moves after a flag. `hide()` → true removes them (e.g. they became the follower). `pool()` → review questions.

### Zones and maps
Maps are arrays of equal-length strings, at least 11×10 (the view), typically 22–28 wide × 14–18 high. Every char must be in `legend`
(`{tile:'name',walk:1?,over:1?}`; `over` lets you talk across a counter). Built-in tiles you can reuse (spaceship-flavoured — prefer drawing school tiles of your own): tree lawn stone flowers pond bench crate stall cafe window.
Put one `terminal` (the 복습 노트 spaced-review spot) in the chapter's hub zone, and redraw it for school in your TILES (e.g. an open notebook on a desk): `TILES.terminal=(X,Y,x,y,t)=>{…}`. `rooms:[[x0,y0,x1,y1,'label']]` names areas in the corner tag.
`warps:{'x,y':{to,x,y,dir,lock?:()=>false|'Korean reason'}}` — land on a walkable non-warp tile. `spots:{'x,y':'text'}` — inspectable NON-walkable
tiles, reachable from a walkable neighbour that no NPC stands on. `dark:()=>[x0,y0,x1,y1]|null` = lights-out room with a torch circle. `slow:1.6` on a zone = the player walks slower (high gravity).

### Tile drawing
`(X,Y,x,y,t)` → draw a 16×16 tile at screen X,Y for map cell x,y at time t (ms). Helpers: `r(x,y,w,h,color)`, `hash(x,y)` (0–99 stable noise),
`at(x,y)` (map char), `front(x,y)` (bottom edge of a wall run), `stars(X,Y,x,y,t,depth)`, `deck/plate/lawn(X,Y,x,y)`, `g` (canvas 2D context),
`CAM` (camera px), `state` (save). Pixel-art rules: flat colors, 1px detail, light from the top, walls show a lighter "front" face on their
bottom row, gentle animation only (blink, shimmer, drift) via `t`. Match the palette mood from the outline. Keep each tile function short.

## Word lists
Your chapter's 20 teaching words and 2 grammar patterns are fixed in `notes/story.md` (`- N교시 teach: …`, `grammar: …`). Use exactly those, spelled as given.
Weave the grammar focus into questions (choose the right ending) — not only vocabulary.

## Quest + content checklist
- 20 words (from notes/story.md), none taught in earlier chapters (validator enforces), each with: a DICT entry (k, e, ex, hj where Sino-Korean),
  ≥2 questions total across Q+BANK, at least one teaching NPC, sound-alikes in CONFUSE.
- 6–8 quest steps with items/flags; `questText()` covers every state; a finale on the last NPC line (`finale:1`) + `DONE` lines.
- One or two `build` sentence questions; one NPC who reviews earlier chapters' words (no badge, like ch1's café).
- A follower is welcome if the story supports one.
- Lines short: ≤ ~40 Korean characters per `say`.

## Test (all must pass; LOOK at the screenshots)
```
python3 build.py && node tests/validate.mjs
node tests/play.mjs chN            # plays tests/walk/chN.js with real key presses at phone size
python3 tests/sheet.py chN         # contact sheets in tests/shots/chN/ — Read every sheet image and fix what looks wrong
```
`tests/walk/chN.js` is a JS array of steps in player order (see `tests/walk/ch1.js`): `{intro:1,shot}`, `{talk:'npcKey',wrong?,shotBefore?,shotChoice?,shotBuild?}`,
`{inspect:[zone,x,y],shot?}`, `{bump:[zone,'doorChar']}`, `{walkTo:[zone,x,y],then:'shotName'}`, `{check:()=>bool,msg}`, `{clock:ms}`, `{panel:1,shot}`.
Cover every NPC, every item/flag, the finale, a review at the terminal after `{clock:26*3600e3}`, and ~10 named screenshots of distinct places/moments.
