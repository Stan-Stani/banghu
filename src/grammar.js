/* 문법 노트: the grammar of a story line, unlocked when the line is said (a step's grammar:'id'), read in the journal after the
   문화 노트. Each note: t = the pattern and a short gist; lines = 2–4 lines of simple 해요체 (English behind ?), each with the numbers
   of the sources it rests on; ex = 2–3 examples, the game's own line first (with who says it), then everyday ones; src = the
   sources, shown as links under the card like a 문화 노트's. No instruction text. Notes are listed in story order (1–4교시).
   Patterns in the lines are written as whole words ("믿을게", not "-ㄹ게") so every word in them taps to a real dictionary entry.
   Rule: fact-check every line against the sources themselves (국립국어원's 한국어기초사전 first, then 표준국어대사전 and its
   grammar materials; open pages that block plain fetches in a real browser), cite each line, and drop or soften any claim no
   source supports. Checked 2026-10-09 (notes/grammar-sources.md). */
globalThis.GRAMMAR_NOTES={
 /* 1교시 */
 lge:{t:'-(으)ㄹ게: 내가 하는 약속',
  lines:[
   ['내가 앞으로 할 일을 듣는 사람한테 말할 때 써요. 약속 같은 말이에요.',"You use it to tell the listener what you are going to do. It works like a promise.",[1,3]],
   ['받침이 없으면 "할게", "갈게", 받침이 있으면 "믿을게", "먹을게"예요. 그런데 "만들다"는 "만들게"예요. 존댓말은 "할게요"예요.',"No final consonant: 할게, 갈게. With one: 믿을게, 먹을게. But a verb ending in ㄹ, like 만들다, gives 만들게. Polite: 할게요.",[1,2,3]],
   ['하는 사람은 "나"나 "우리"예요. 물어볼 때는 안 써요. "너 갈게?"는 틀리고, "갈래?"라고 물어요.',"The one doing it is always me (or us), and you can't ask with it: 너 갈게? is wrong; ask 갈래? instead.",[3,4]],
   ['"할 거야"는 그냥 내 계획이에요. "할게"는 듣는 사람을 생각하면서 하는 말이에요.',"할 거야 just states your plan. 할게 is said with the listener in mind.",[3]]],
  ex:[
   ['다온: 흠. 진짜야? 알았어. 이번만 믿을게.',"Daon: Hmm. Really? Fine. I'll believe you, just this once."],
   ['늦어서 미안해. 다음에는 일찍 올게.',"Sorry I'm late. Next time I'll come early."],
   ['제가 창문 닫을게요.',"I'll close the window."]],
  src:[
   ['한국어기초사전 「-ㄹ게」 (국립국어원)','https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=80987'],  /*nolex*/
   ['한국어기초사전 「-을게」 (국립국어원)','https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=80981'],  /*nolex*/
   ['한국어교수학습샘터 문법·표현 「-을게」 (국립국어원)','https://kcenter.korean.go.kr/kcenter/search/dgrammar/view.do?mode=view&id=198'],  /*nolex*/
   ['한국어교수학습샘터 문법·표현 「-을래2」 (국립국어원)','https://kcenter.korean.go.kr/kcenter/search/dgrammar/view.do?mode=view&id=785']]},  /*nolex*/
 geodeun:{t:'-거든: 내 사정 알려 주기',
  lines:[
   ['듣는 사람이 모를 것 같은 이유나 사정을 말할 때 문장 끝에 써요.',"At the end of a sentence, it tells the listener a reason or a background you think they don't know.",[1,3,4]],
   ['다온의 "어제 산 거거든"은 "나도 처음 봐"의 이유예요. 어제 산 새 지우개라서 쪽지는 다온도 몰라요.',"Daon's 어제 산 거거든 is the reason she has never seen the note: she only bought the eraser yesterday, so she knows nothing about it either.",[1,4]],
   ['지난 일은 "왔거든", 존댓말은 "왔거든요"예요.',"For the past: 왔거든. Polite: 왔거든요.",[1,2]],
   ['문장 가운데에 오면 뜻이 달라요. "시간 있거든 전화해."는 "시간 있으면 전화해."예요.',"In the middle of a sentence it means something else: 시간 있거든 전화해 means 시간 있으면 전화해 (call me if you have time).",[1,3,5]]],
  ex:[
   ['다온: 그 지우개, 어제 매점에서 산 거거든.',"Daon: I only bought that eraser at the school store yesterday, you see."],
   ['오늘은 못 가. 숙제가 많거든.',"I can't go today. I've got a lot of homework, you see."],
   ['배 안 고파요. 아까 빵 먹었거든요.',"I'm not hungry. I had some bread a little while ago, you see."]],
  src:[
   ['한국어기초사전 「-거든」 (국립국어원)','https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=66501'],  /*nolex*/
   ['한국어기초사전 「-거든요」 (국립국어원)','https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=66503'],  /*nolex*/
   ['표준국어대사전 「-거든」 (국립국어원)','https://stdict.korean.go.kr/search/searchView.do?word_no=390313&searchKeywordTo=3'],  /*nolex*/
   ['한국어교수학습샘터 문법·표현 「-거든2」 (국립국어원)','https://kcenter.korean.go.kr/kcenter/search/dgrammar/view.do?mode=view&id=216'],  /*nolex*/
   ['한국어교수학습샘터 문법·표현 「-거든1」 (국립국어원)','https://kcenter.korean.go.kr/kcenter/search/dgrammar/view.do?mode=view&id=96']]},  /*nolex*/
 buteo:{t:'부터: 이것 먼저 해요',
  lines:[
   ['"부터"는 보통 시작을 말해요. "아홉 시부터", "내일부터"처럼요.',"부터 usually marks where something starts: 아홉 시부터 (from nine o'clock), 내일부터 (from tomorrow).",[1,2,3]],
   ['"밥부터 먹어"의 "부터"는 순서예요. 다른 일보다 밥을 먼저 먹으라는 말이에요.',"In 밥부터 먹어 it is about order: eat before you do anything else.",[2,3]],
   ['"밥을 먹어"에 "부터"를 붙이면 "을"은 빠지고 "밥부터 먹어"가 돼요. 그래도 "밥"은 먹는 것이에요.',"Put 부터 on 밥을 먹어 and the 을 drops out: 밥부터 먹어. 밥 is still the thing being eaten.",[3,4]]],
  ex:[
   ['다온: 점심시간이네. 밥부터 먹어.',"Daon: It's lunchtime. Eat first."],
   ['숙제부터 해. 게임은 그다음이야.',"Do your homework first. Games come after."],
   ['집에 오면 손부터 씻어요.',"When you get home, wash your hands first."]],
  src:[
   ['한국어기초사전 「부터」 (국립국어원)','https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=70055'],  /*nolex*/
   ['표준국어대사전 「부터」 (국립국어원)','https://stdict.korean.go.kr/search/searchView.do?word_no=432619&searchKeywordTo=3'],  /*nolex*/
   ['한국어교수학습샘터 문법·표현 「부터」 (국립국어원)','https://kcenter.korean.go.kr/kcenter/search/dgrammar/view.do?mode=view&id=37'],  /*nolex*/
   ['국립국어원 온라인가나다 「보조사」 (2026-05-18)','https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=27&qna_seq=331236']]},  /*nolex*/
 /* 2교시 */
 damyeo:{t:'-다며?: 들은 말 확인하기',
  lines:[
   ['남한테 들은 이야기가 맞는지 듣는 사람한테 확인할 때 써요.',"You use it to check with the listener whether something you heard is true.",[1,3]],
   ['"노래했다며?"는 "노래했다고 들었어. 맞아?"예요.',"노래했다며? means: I heard you sang. Is that true?",[1,3]],
   ['"노래했다면서?"도 같은 말이에요. 존댓말은 "노래했다면서요?"예요.',"노래했다면서? means the same. Polite: 노래했다면서요?",[1,3]],
   ['명사는 "반장이라며?"처럼 말해요.',"With a noun: 반장이라며? (I heard you're the class president?)",[2,3]]],
  ex:[
   ['3학년 선배: 야, 1학년. 화장실에서 노래했다며?',"Senior: Hey, first-year. We heard you sang in the bathroom?"],
   ['다음 주에 이사 간다며? 어디로 가?',"I heard you're moving next week? Where to?"],
   ['내일 시험 없다면서요? 진짜예요?',"I heard there's no test tomorrow? Is that true?"]],
  src:[
   ['한국어기초사전 「-다며」 (국립국어원)','https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=81466'],  /*nolex*/
   ['한국어기초사전 「-라며」 (국립국어원)','https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=81469'],  /*nolex*/
   ['한국어교수학습샘터 문법·표현 「-는다면서」 (국립국어원)','https://kcenter.korean.go.kr/kcenter/search/dgrammar/view.do?mode=view&id=237']]},  /*nolex*/
 gineun:{t:'-기는 하다: 그건 인정해요',
  lines:[
   ['어떤 일이 맞다고 일단 인정할 때 써요.',"You use it to grant that something is so, at least up to a point.",[1,2]],
   ['다온은 찬한테 끌려와서 싫었지만, 웃긴 건 인정해요.',"Daon didn't want to be dragged along by Chan, but she admits it is funny.",[1,2]],
   ['"웃기긴"은 "웃기기는"과 같은 말이에요. 말할 때는 이렇게 짧게 자주 말해요.',"웃기긴 is the same as 웃기기는; in speech it is often said this short way.",[3,4]],
   ['"좋기는 한데 비싸요"처럼 뒤에 다른 이야기가 오기도 해요.',"Something else can come next, as in 좋기는 한데 비싸요 (it's nice, but it's expensive).",[1,2]]],
  ex:[
   ['다온: 찬이한테 끌려왔는데… 웃기긴 하네.',"Daon: Chan dragged me here… but it is funny, I'll give him that."],
   ['그 영화 재미있기는 했어. 근데 너무 길었어.',"The movie was fun, sure. But it was too long."],
   ['비싸긴 하지만 맛있어요.',"It is expensive, but it's tasty."]],
  src:[
   ['한국어기초사전 「하다」 보조 형용사 (국립국어원)','https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=62899'],  /*nolex*/
   ['표준국어대사전 「하다」 보조 동사·보조 형용사 (국립국어원)','https://stdict.korean.go.kr/search/searchView.do?word_no=363685&searchKeywordTo=3'],  /*nolex*/
   ['한국어기초사전 「ㄴ」 조사 (국립국어원)','https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=85847'],  /*nolex*/
   ['표준국어대사전 「ㄴ」 조사 (국립국어원)','https://stdict.korean.go.kr/search/searchView.do?word_no=406398&searchKeywordTo=3']]},  /*nolex*/
 jana:{t:'-잖아: 너도 아는 이야기',
  lines:[
   ['듣는 사람도 이미 아는 일을 확인시켜 줄 때 써요. "너도 알지?" 하는 느낌이에요.',"You use it to remind the listener of something they already know: it has a \"you know that, right?\" feeling.",[1,3]],
   ['다온의 "아깝잖아"는 "그만두면 아까워. 너도 알지?"예요.',"Daon's 아깝잖아 means: it would be a waste if you quit, and you know it.",[1,3]],
   ['지난 일은 "말했잖아", 존댓말은 "아깝잖아요"예요.',"For the past: 말했잖아. Polite: 아깝잖아요.",[1,2,3]],
   ['틀린 생각을 고쳐 주듯이 말할 때도 써요. 그래서 핀잔처럼 들릴 때도 있어요.',"It is also used as if to correct someone's wrong idea, so it can sound like a little dig.",[1,3]]],
  ex:[
   ['다온: 근데 하리야, 포기하지 마. 아깝잖아.',"Daon: But Hari, don't give up. It'd be a waste, you know."],
   ['내가 어제 말했잖아.',"I told you yesterday, remember?"],
   ['오늘 토요일이잖아요. 학교 안 가요.',"It's Saturday today, you know. There's no school."]],
  src:[
   ['한국어기초사전 「-잖아」 (국립국어원)','https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=86756'],  /*nolex*/
   ['한국어기초사전 「-잖아요」 (국립국어원)','https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=86757'],  /*nolex*/
   ['한국어교수학습샘터 문법·표현 「-잖아」 (국립국어원)','https://kcenter.korean.go.kr/kcenter/search/dgrammar/view.do?mode=view&id=294']]},  /*nolex*/
 /* 3교시 */
 cheok:{t:'-는 척하다: 아닌데 그런 것처럼',
  lines:[
   ['사실은 아닌데, 그런 것처럼 보이게 할 때 써요. 찬은 책을 안 읽는데 읽는 척해요.',"You use it when you act as if something is so when it isn't. Chan isn't reading; he is pretending to.",[1,2,3]],
   ['동사는 "읽는 척", 형용사는 "괜찮은 척", 지난 일은 "본 척"이에요.',"After a verb: 읽는 척. After an adjective: 괜찮은 척. For the past: 본 척 (pretend to have seen).",[1,2]],
   ['"읽은 적 있어"의 "적"은 "때"예요. 이 말은 경험을 말해요. 소리는 "척"과 비슷해도 뜻이 달라요.',"The 적 in 읽은 적 있어 means \"time\", and the phrase tells of an experience. It sounds like 척 but means something else.",[1,4,5]]],
  ex:[
   ['나: 책이 거꾸로잖아. 읽는 척하는 거지?',"Me: The book is upside down. You're just pretending to read, right?"],
   ['말하기 싫어서 자는 척했어요.',"I didn't want to talk, so I pretended to be asleep."],
   ['동생은 엄마가 불러도 못 들은 척해요.',"Even when Mom calls, my little brother pretends he didn't hear."]],
  src:[
   ['한국어기초사전 「척」 의존 명사 (국립국어원)','https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=72054'],  /*nolex*/
   ['한국어기초사전 「척하다」 (국립국어원)','https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=72226'],  /*nolex*/
   ['표준국어대사전 「척」 의존 명사 (국립국어원)','https://stdict.korean.go.kr/search/searchView.do?word_no=490923&searchKeywordTo=3'],  /*nolex*/
   ['한국어기초사전 「적」 의존 명사 (국립국어원)','https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=71232'],  /*nolex*/
   ['한국어교수학습샘터 문법·표현 「-은 적이 있다」 (국립국어원)','https://kcenter.korean.go.kr/kcenter/search/dgrammar/view.do?mode=view&id=803']]},  /*nolex*/
 dae:{t:'-대: 남한테 들은 말',
  lines:[
   ['남한테 들은 말을 전할 때 써요. "끝났대"는 "끝났다고 해"를 줄인 말이에요.',"You use it to pass on something you heard. 끝났대 is short for 끝났다고 해 (they say it's over).",[1]],
   ['지금 일은 "간대", "먹는대", "바쁘대"예요. 존댓말은 "끝났대요"예요.',"For now: 간대, 먹는대, 바쁘대. Polite: 끝났대요.",[1,2,3,4]],
   ['"끝났데"는 다른 말이에요. 내가 직접 본 일을 말하는 "끝났더라"와 비슷해요.',"끝났데, spelled with 데, is a different ending: it is like 끝났더라, for something you saw yourself.",[5,6]]],
  ex:[
   ['찬: 누가 "방송부 끝났대?" 이렇게 썼어.',"Chan: Someone wrote this: \"The broadcast club is finished, I hear?\""],
   ['내일 비가 온대.',"They say it's going to rain tomorrow."],
   ['하리가 노래를 진짜 잘한대요.',"They say Hari sings really well."]],
  src:[
   ['한국어기초사전 「-대」 (국립국어원)','https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=85757'],  /*nolex*/
   ['한국어기초사전 「-ㄴ대」 (국립국어원)','https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=86859'],  /*nolex*/
   ['한국어기초사전 「-는대」 (국립국어원)','https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=86860'],  /*nolex*/
   ['한국어기초사전 「-대요」 (국립국어원)','https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=85758'],  /*nolex*/
   ['표준국어대사전 「-데」 (국립국어원)','https://stdict.korean.go.kr/search/searchView.do?word_no=415074&searchKeywordTo=3'],  /*nolex*/
   ['한국어기초사전 「-데」 (국립국어원)','https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=77242']]},  /*nolex*/
 rae:{t:'-래: 하라고 한 말 전하기',
  lines:[
   ['누가 "해!" 하고 시킨 말을 전할 때 써요. "다니래"는 "다니라고 해"를 줄인 말이에요.',"You use it to pass on what someone told you to do. 다니래 is short for 다니라고 해.",[1]],
   ['엄마가 "학원 하나 더 다녀!" 했어요. 그래서 구름은 "엄마가 학원을 하나 더 다니래"라고 말해요.',"Mom said: go to one more hagwon! So Gureum says 엄마가 학원을 하나 더 다니래.",[1]],
   ['받침이 있으면 "먹으래", 하지 말라는 말은 "가지 말래"예요.',"With a final consonant: 먹으래. Telling someone not to: 가지 말래.",[1,2,3]],
   ['명사 뒤에 오면 뜻이 달라요. "복숭아래"는 "복숭아라고 해"예요.',"After a noun it means something else: 복숭아래 means 복숭아라고 해 (it says it's Boksunga).",[1]]],
  ex:[
   ['구름: 엄마가 학원을 하나 더 다니래. 방과 후에.',"Gureum: My mom says I have to go to one more hagwon. After school."],
   ['선생님이 내일까지 숙제 내래.',"The teacher says to hand in the homework by tomorrow."],
   ['의사 선생님이 푹 쉬래요.',"The doctor says I should get plenty of rest."]],
  src:[
   ['한국어기초사전 「-래」 (국립국어원)','https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=86535'],  /*nolex*/
   ['한국어기초사전 「-으래」 (국립국어원)','https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=80914'],  /*nolex*/
   ['한국어기초사전 「말다」 보조 동사 (국립국어원)','https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=72580']]},  /*nolex*/
 /* 4교시 */
 daboni:{t:'-다 보니: 하다가 바뀐 것',
  lines:[
   ['어떤 일을 하다가 새로 알게 되거나 바뀐 것을 말할 때 써요.',"You use it for something you found out, or something that changed, while you were doing something.",[1,2]],
   ['구름은 밤새 계속 고민했어요. 그래서 점점 더 무서워졌어요.',"Gureum kept worrying all night, and so it got scarier and scarier.",[1]],
   ['"고민하다 보니까"도 같은 말이에요. "열심히 하다 보면 늘어요"처럼 "하다 보면"도 써요.',"고민하다 보니까 means the same. You'll also hear 하다 보면: 열심히 하다 보면 늘어요 (keep at it and you'll get better).",[1,2]]],
  ex:[
   ['구름: 밤새 혼자 고민하다 보니 점점 더 무서워졌어.',"Gureum: I worried about it alone all night, and it just got scarier and scarier."],
   ['한국 드라마를 자주 보다 보니 한국어가 늘었어요.',"From watching Korean dramas a lot, my Korean got better."],
   ['얘기하다 보니까 벌써 밤 열두 시예요.',"We kept talking, and now it's already midnight."]],
  src:[
   ['한국어기초사전 「보다」 보조 동사 (국립국어원)','https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=62171'],  /*nolex*/
   ['한국어기초사전 「-다가 보다」 (국립국어원)','https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=75171']]},  /*nolex*/
 rago:{t:'-(으)라고: 그렇게 되라는 마음',
  lines:[
   ['"이렇게 됐으면 좋겠다" 하는 마음으로 한 일을 말할 때 써요. 그 일을 한 목적이에요.',"You use it for something you did wanting a certain result: it gives the purpose of what you did.",[1,2,3]],
   ['"여러분 힘내라고"는 "여러분이 힘을 냈으면 좋겠어서"예요. 그래서 교장 선생님이 몰래 쪽지를 썼어요.',"여러분 힘내라고 means: because I wanted you to keep your spirits up. That's why the principal wrote the notes in secret.",[1,3]],
   ['말할 때는 교장 선생님처럼 문장 뒤에 따로 붙이기도 해요.',"In speech it is often added after the sentence, as the principal does here.",[4]],
   ['받침이 있으면 "먹으라고", "읽으라고"예요.',"With a final consonant: 먹으라고, 읽으라고.",[2]]],
  ex:[
   ['교장 선생님: 그래서 몰래 쪽지를 썼어요. 여러분 힘내라고.',"Principal: So I wrote the notes in secret. To keep your spirits up."],
   ['동생 먹으라고 빵을 남겨 뒀어요.',"I saved some bread for my little brother to eat."],
   ['잘 보이라고 글씨를 크게 썼어요.',"I wrote in big letters so it would be easy to see."]],
  src:[
   ['한국어기초사전 「-라고」 (국립국어원)','https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=86501'],  /*nolex*/
   ['한국어기초사전 「-으라고」 (국립국어원)','https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=87174'],  /*nolex*/
   ['표준국어대사전 「-라고」 (국립국어원)','https://stdict.korean.go.kr/search/searchView.do?word_no=534431&searchKeywordTo=3'],  /*nolex*/
   ['권재일, 「어순」, 새국어생활 2006년 봄호 (국립국어원)','https://www.korean.go.kr/nkview/nklife/2006_1/2006_0113.pdf']]},  /*nolex*/
 deora:{t:'-더라: 내가 직접 본 일',
  lines:[
   ['내가 직접 보거나 듣고 느낀 일을 나중에 다른 사람한테 말할 때 써요.',"You use it to tell someone, later, about something you saw or heard and felt yourself.",[1,2]],
   ['구름 엄마는 방송을 직접 들었어요. 그래서 "목소리 좋더라"라고 말해요.',"Gureum's mom heard the broadcast herself, so she says 목소리 좋더라.",[1,2]],
   ['남한테 들은 말이면 "좋더라"가 아니라 "좋대"예요.',"If you only heard it from someone else, it's 좋대, not 좋더라.",[2,4]],
   ['존댓말은 "좋더라고요"예요.',"Polite: 좋더라고요.",[2,3]]],
  ex:[
   ['"목소리 좋더라." 구름이 그 말을 세 번 했어요.',"\"Your voice sounded good.\" Gureum told us that three times."],
   ['그 영화 봤어? 진짜 재미있더라.',"Have you seen that movie? It was really good."],
   ['어제 가 보니까 가게 문이 닫혀 있더라고요.',"When I went yesterday, the shop was closed."]],
  src:[
   ['한국어기초사전 「-더라」 (국립국어원)','https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=81524'],  /*nolex*/
   ['한국어교수학습샘터 문법·표현 「-더라」 (국립국어원)','https://kcenter.korean.go.kr/kcenter/search/dgrammar/view.do?mode=view&id=251'],  /*nolex*/
   ['한국어기초사전 「-더라고요」 (국립국어원)','https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=82330'],  /*nolex*/
   ['한국어기초사전 「-대」 (국립국어원)','https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=85757']]},  /*nolex*/
};
