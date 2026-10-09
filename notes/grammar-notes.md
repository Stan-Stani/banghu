# 문법 노트 (grammar notes)

Twelve short notes, about three per 교시. Each one explains the grammar of one story line and unlocks when that line is said. The
step carries `grammar:'id'`, and the note's text is in `src/grammar.js` as `{t, lines:[[ko,en]…], ex:[[ko,en]…]}`. A note gets the
same chip as a 문화 노트 ("📖 문법 노트 · title"). It has its own list under the 문법 노트 heading in the 일지, and its card shows the lines
first, then the examples under 예문. English is behind ?, and every Korean word can be tapped. Seen and read notes are saved under
`banghu-grammar` and `banghu-grammarRead`. The 문화 노트 keys are not changed.

Every note follows the same layout: a title (the pattern and a short gist), 2–4 lines of simple 해요체, and 2–3 examples. The
game's own line comes first in the examples, then everyday ones. `tests/validate.mjs` checks that every `grammar:'id'` has a note
and that every note is unlocked by some step. In the lines, patterns are written as whole words ("믿을게", not "-ㄹ게"). That way a
tap opens a real dictionary entry. `lexicon/fixes.json` maps those words to the pattern's entry.

| 교시 | id | title | unlocked by (speaker: line) | where |
|---|---|---|---|---|
| 1 | `lge` | -(으)ㄹ게: 내가 하는 약속 | 다온: 흠. 진짜야? 알았어. 이번만 믿을게. | ch1 `daon` (the 벌금 scene) |
| 1 | `geodeun` | -거든: 내 사정 알려 주기 | 다온: 그 지우개, 어제 매점에서 산 거거든. | ch1 `daonSeat` (after the 쪽지) |
| 1 | `buteo` | N부터: 이것 먼저 해요 | 다온: 점심시간이네. 밥부터 먹어. 급식실은 복도 가운데야. | ch1 `daonSeat` (lunch bell) |
| 2 | `damyeo` | -다며?: 들은 말 확인하기 | 3학년 선배: 야, 1학년. 화장실에서 노래했다며? | ch2 `teaser` (체육관) |
| 2 | `gineun` | -기는 하다: 그건 인정해요 | 다온: 찬이한테 끌려왔는데… 웃기긴 하네. | ch2 `daonB` (분식집) |
| 2 | `jana` | -잖아: 너도 아는 이야기 | 다온: 근데 하리야, 포기하지 마. 아깝잖아. | ch2 `daonB` (분식집) |
| 3 | `cheok` | -는 척하다: 아닌데 그런 것처럼 | 나: 책이 거꾸로잖아. 읽는 ___하는 거지? (척) | ch3 `Q.chanL[0]` (도서관, 찬) |
| 3 | `dae` | -대: 남한테 들은 말 | 찬: 누가 "방송부 끝났대?" 이렇게 썼어. | ch3 `chanRumor` (복도) |
| 3 | `rae` | -래: 하라고 한 말 전하기 | 구름: 엄마가 학원을 하나 더 다니래. 방과 후에. | ch3 `gureumNR` (노래방) |
| 4 | `daboni` | -다 보니: 하다가 바뀐 것 | 구름: 밤새 혼자 ___ 점점 더 무서워졌어. (고민하다 보니) | ch4 `Q.gureum[1]` (방송실, first talk) |
| 4 | `rago` | -(으)라고: 그렇게 되라는 마음 | 교장 선생님: 그래서 몰래 쪽지를 썼어요. 여러분 힘내라고. | ch4 `principalS` (the reveal) |
| 4 | `deora` | -더라: 내가 직접 본 일 | "목소리 좋더라." 구름이 그 말을 세 번 했어요. | ch4 `DONE` (the epilogue) |

## Why these
- The owner asked for these notes after 다온's "밥부터 먹어", where 부터 takes the object marker's place and means "first".
- -(으)ㄹ게 and -거든 are 1교시's own grammar: its gram:1 questions test them.
- 척 and -대 are 3교시's own grammar. The -대 note is placed on 찬's quote of the post because the 3교시 mystery depends on that
  spelling: the post is written "끝났데", not "끝났대".
- -다 보니 is 4교시's own grammar.
- Each of the others is a pattern a TOPIK 3 learner is likely to stumble on, and each is placed at the main-path line where it first
  matters. One exception: -잖아 first comes up in 1교시, in the player's line at 찬's table ("생일에는 선물을 받잖아"). Its note
  goes on 다온's line in 2교시 instead, because 찬's table already unlocks the 생일 턱 문화 노트.
- Some patterns were suggested but appear only in optional review lines, never in a story step: -(으)ㄹ 뻔하다, -아/어 버리다,
  -는 김에 and -기로 하다. Those were left out.
