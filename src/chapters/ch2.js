CHAPTERS.push({id:'ch2',n:'2교시',title:'노래 한 곡',place:'방송실 · 음악실 · 체육관 · 학교 앞 분식집',words:20,save:'banghu-ch2',color:'#5A8FB0',
 start:{zone:'bcast',x:9,y:6,dir:'up'},introWho:'…',
 migrate:st=>{const F=st.f||{};if((F.ready||F.done)&&!F.nextDay)F.nextDay=1;  // saves from before the day break (2026-10-04)
  if(!st.school){if(st.zone==='gym')st.y=12-st.y;if(st.zone==='hall')Object.assign(st,{x:5,y:8,dir:'up'});st.school=1}},  // saves from before the shared school (2026-10-06): gym flipped, 1층 redrawn
 make:()=>{
/* =====================================================================
   2교시 · 노래 한 곡 — story: notes/story.md (2교시). Original story; nothing from the webtoon but the word list.
   The club needs a voice. 구름 hands over a recruiting poster; a 1학년 singing alone in the 음악실 freezes and runs,
   dropping her 명찰; 정 선생님 names her (유하리); in the 체육관 the player stops two 3학년s teasing her;
   at the 분식집 after school 찬's awful joke breaks the ice and 다온 pushes her to try one song;
   next lunchtime the test broadcast goes out and 하리 joins (crew of four).
   Steps: {say} · {ask, opts:[[text,1],[wrong,0,'why']], w} · {build:[tiles…], w}; award/give/take/set/who/when/face/finale.
   ===================================================================== */
const WORDS=['괴롭히다','긴장하다','얼다','심장','분위기','어색하다','장난','놀리다','명찰','곡','기회','놓치다','타이밍','효과','포기하다','즐기다','챙기다','재촉하다','연락처','데려오다'];
const DICT={
 '괴롭히다':{k:'남이 싫어하는 일을 계속 해서 힘들게 해요.',e:'to bully, to torment',ex:'약한 친구를 괴롭히면 안 돼요.'},
 '긴장하다':{k:'걱정돼서 몸과 마음이 딱딱해져요.',e:'to be nervous, tense',ex:'시험 전에 너무 긴장했어요.',hj:'緊張 · 張 = 주장(主張)의 장'},
 '얼다':{k:'물이 차가워서 얼음이 돼요. 너무 놀라서 몸이 안 움직여도 "얼었어요".',e:'to freeze',ex:'무대에서 너무 떨려서 얼었어요.'},
 '심장':{k:'가슴 안에서 쿵쿵 뛰는 몸의 부분.',e:'heart (the organ)',ex:'달리기를 하면 심장이 빨리 뛰어요.',hj:'心臟 · 心 = 마음, 중심(中心)의 심'},
 '분위기':{k:'어떤 곳의 느낌. 예: 조용한 분위기, 좋은 분위기.',e:'mood, atmosphere',ex:'교실 분위기가 아주 좋아요.',hj:'雰圍氣 · 氣 = 공기(空氣), 인기(人氣)의 기'},
 '어색하다':{k:'자연스럽지 않고 불편해요. 할 말이 없어요.',e:'to be awkward',ex:'처음 만나서 좀 어색했어요.',hj:'語塞 · 語 = 말, 단어(單語)의 어'},
 '장난':{k:'재미로 하는 일. 너무 하면 남이 싫어해요.',e:'joke, prank, mischief',ex:'그냥 장난이야. 화내지 마.'},
 '놀리다':{k:'남을 보고 웃으면서 기분 나쁘게 해요. 예: "하하, 머리 이상해!"',e:'to tease, to make fun of',ex:'친구 앞머리를 보고 놀렸어요.'},
 '명찰':{k:'교복에 다는 이름표.',e:'name tag',ex:'명찰에 내 이름이 쓰여 있어요.',hj:'名札 · 名 = 이름, 유명(有名)의 명'},
 '곡':{k:'노래나 음악 하나. "한 곡, 두 곡"으로 세요.',e:'a song, a piece (of music)',ex:'노래 한 곡만 불러 주세요.',hj:'曲 · 작곡(作曲)의 곡'},
 '기회':{k:'무엇을 하기에 딱 좋은 때. 예: 좋은 기회, 마지막 기회.',e:'chance, opportunity',ex:'이번 기회에 방송을 해 봐요.',hj:'機會 · 會 = 모이다, 회의(會議)의 회'},
 '놓치다':{k:'잡아야 하는 것을 못 잡아요. 버스, 기회, 공…',e:'to miss (a chance, a bus), to let slip',ex:'버스를 놓쳐서 지각했어요.'},
 '타이밍':{k:'무엇을 하기에 딱 맞는 때. 영어 timing.',e:'timing',ex:'농담은 타이밍이 중요해요.'},
 '효과':{k:'무엇을 해서 생기는 좋은 변화.',e:'effect',ex:'이 약은 효과가 빨라요.',hj:'效果 · 果 = 열매, 결과(結果)의 과'},
 '포기하다':{k:'하던 일을 끝까지 안 하고 그만둬요.',e:'to give up',ex:'어려워도 포기하지 마요.',hj:'抛棄'},
 '즐기다':{k:'무엇을 재미있게 해요. 예: 음악을 즐겨요.',e:'to enjoy',ex:'주말에 음악을 즐겨요.'},
 '챙기다':{k:'필요한 것을 잊지 않고 가져가요. 남을 잘 돌봐요.',e:'to pack, to take along; to look after',ex:'우산 꼭 챙겨요.'},
 '재촉하다':{k:'빨리 하라고 자꾸 말해요.',e:'to hurry (someone), to press',ex:'엄마가 빨리 나가라고 재촉했어요.'},
 '연락처':{k:'전화번호처럼 연락할 수 있는 번호나 주소.',e:'contact (number/info)',ex:'연락처 좀 알려 줘.',hj:'連絡處 · 處 = 곳'},
 '데려오다':{k:'다른 사람과 같이 이쪽으로 와요. "데리고 와요."',e:'to bring (a person) here',ex:'내일 동생도 데려올게요.'},
 /* grammar of this chapter */
 '-(으)ㄹ까(요)':{k:'같이 하자고 물어보거나, 혼자 고민할 때. "갈까?"',e:"shall I/we …? / should I …?"},
 '-지 마':{k:'하지 말라고 할 때. "울지 마." 공손하게는 "-지 마세요".',e:"don't …"},
 /* glosses for words in lines that are not badges */
 '모집':{k:'사람을 모으는 것.',e:'recruiting'},
 '부원':{k:'동아리에 들어간 사람.',e:'club member'},
 '방송부':{k:'학교 방송을 하는 동아리.',e:'broadcast club'},
 '음악실':{k:'음악 수업을 하는 교실.',e:'music room'},
 '체육관':{k:'안에서 운동하는 큰 건물.',e:'gym'},
 '분식집':{k:'떡볶이, 김밥 같은 싼 음식을 파는 가게.',e:'snack bar (cheap Korean food)'},
 '생수':{k:'병에 든 마시는 물.',e:'bottled water'},
 '방과 후':{k:'학교 수업이 다 끝난 다음.',e:'after school'},
 '직빵':{k:'"바로 효과가 있다"는 재밌는 말.',e:'(slang) works instantly'},
 '사연함':{k:'라디오에 보낼 이야기를 넣는 상자.',e:'story (letter) box'},
 '벌점':{k:'규칙을 안 지키면 받는 나쁜 점수.',e:'penalty point'},
};
/* sounds-alike / looks-alike words, used when a listening question is built */
const CONFUSE={'괴롭히다':['괴롭다','고르다'],'긴장하다':['건강하다','진정하다'],'얼다':['열다','알다'],'심장':['시장','심판'],'분위기':['분야','위기'],
 '어색하다':['색다르다','어떡하다'],'장난':['장남','잔반'],'놀리다':['놀다','노리다'],'명찰':['명함','경찰'],'곡':['국','공'],'기회':['기획','기와'],
 '놓치다':['놓다','고치다'],'타이밍':['타이핑','다이빙'],'효과':['효도','과자'],'포기하다':['포장하다','보기'],'즐기다':['즐겁다','줄이다'],
 '챙기다':['생기다','쟁기'],'재촉하다':['재채기','재주'],'연락처':['연락하다','연습장'],'데려오다':['데려가다','내려오다']};

/* extra review questions (구름's laptop uses these too, alongside every NPC question) */
const BANK=[
 {w:'괴롭히다',ask:'약한 친구를 ___ 사람은 진짜 나빠요.',opts:[['괴롭히는',1],['괴로운',0,'괴롭다는 내 마음이 아픈 거예요. 남을 힘들게 하면 "괴롭히는".']]},
 {w:'긴장하다',ask:'면접 전에 손에 땀이 나요. 많이 ___.',opts:[['긴장했어요',1],['건강했어요',0,'건강하다는 몸이 튼튼한 거예요. 떨리면 "긴장했어요".']]},
 {w:'얼다',ask:'냉동실에 넣은 물이 꽁꽁 ___.',opts:[['얼었어요',1],['얼렸어요',0,'얼리다는 내가 무엇을 얼게 만드는 거예요. 물이 혼자 얼면 "얼었어요".'],['열었어요',0,'열다는 문을 여는 거예요. 물이 얼음이 되면 "얼었어요".']]},
 {w:'심장',ask:'의사 선생님이 내 가슴에 귀를 대고 ___ 소리를 들었어요.',opts:[['심장',1],['시장',0,'시장은 물건을 사는 곳이에요. 가슴에서 뛰는 건 "심장".'],['심판',0,'심판은 경기의 규칙을 보는 사람이에요. 가슴 소리는 "심장".']]},
 {w:'분위기',ask:'카페 음악이 조용해서 ___가 좋아요.',opts:[['분위기',1],['기분',0,'기분은 한 사람의 마음이에요. 그곳의 느낌은 "분위기".']]},
 {w:'어색하다',ask:'싸운 친구하고 둘이 엘리베이터에… 너무 ___.',opts:[['어색해요',1],['색달라요',0,'색다르다는 새롭고 특별할 때예요. 불편하면 "어색해요".']]},
 {w:'장난',ask:'동생이 내 신발을 숨겼어요. ___이 심해요.',opts:[['장난',1],['장남',0,'장남은 첫째 아들이에요. 재미로 하는 일은 "장난".']]},
 {w:'놀리다',ask:'친구가 내 목소리를 따라 하면서 ___.',opts:[['놀렸어요',1],['놀았어요',0,'놀다는 재밌게 시간을 보내는 거예요. 기분 나쁘게 하면 "놀렸어요".']]},
 {w:'명찰',ask:'오늘 ___을 집에 두고 왔어요. 벌점 받을 것 같아요.',opts:[['명찰',1],['명함',0,'명함은 회사 사람이 주는 작은 종이예요. 학교에서 없으면 벌점인 건 "명찰".']]},
 {w:'곡',ask:'노래방에서 세 ___을 불렀어요.',opts:[['곡',1],['국',0,'하하, 국은 먹는 거예요. 노래는 한 "곡", 두 "곡".']]},
 {w:'기회',ask:'이런 ___는 다시 안 와요. 꼭 해 봐요.',opts:[['기회',1],['기억',0,'기억은 머릿속에 남은 거예요. 딱 좋은 때는 "기회".']]},
 {w:'놓치다',ask:'공을 잡으려고 했는데 손에서 ___.',opts:[['놓쳤어요',1],['놓았어요',0,'놓다는 일부러 어디에 두는 거예요. 잡으려고 했는데 못 잡으면 "놓쳤어요".']]},
 {w:'타이밍',ask:'친구한테 고백하려면 ___이 중요해요.',opts:[['타이밍',1],['타이핑',0,'타이핑은 자판으로 글씨를 치는 거예요. 딱 맞는 때는 "타이밍".']]},
 {w:'효과',ask:'약을 먹고 금방 나았어요. 이 약은 ___가 빨라요.',opts:[['효과',1],['효도',0,'효도는 부모님을 잘 모시는 거예요. 좋은 변화는 "효과".'],['과자',0,'하하, 과자는 간식이에요. 약의 좋은 변화는 "효과".']]},
 {w:'효과',ask:'매일 운동했더니 ___가 있었어요.',opts:[['효과',1],['효도',0,'효도는 부모님을 잘 모시는 거예요. 좋은 변화는 "효과".']]},
 {w:'포기하다',ask:'수학이 어려워도 ___ 마세요.',opts:[['포기하지',1],['포장하지',0,'포장하다는 선물을 종이로 싸는 거예요. 그만두는 건 "포기하지".']]},
 {w:'즐기다',ask:'축제는 이기는 게 아니에요. 그냥 ___.',opts:[['즐겨요',1],['즐거워요',0,'즐겁다는 기분이에요. "~을/를 재밌게 하다"는 "즐겨요".']]},
 {w:'챙기다',ask:'수학여행 가요. 칫솔 꼭 ___.',opts:[['챙겨요',1],['생겨요',0,'생기다는 없던 게 새로 나타나는 거예요. 가져가면 "챙겨요".']]},
 {w:'재촉하다',ask:'빨리 오라고 친구가 문자로 계속 ___.',opts:[['재촉해요',1],['재채기해요',0,'재채기는 "에취!"예요. 빨리 하라고 하면 "재촉해요".']]},
 {w:'연락처',ask:'새 친구한테 ___를 물어봤어요.',opts:[['연락처',1],['연습장',0,'연습장은 공부하는 공책이에요. 전화번호는 "연락처".']]},
 {w:'데려오다',ask:'내일 우리 집에 올 때 동생도 ___ 돼.',opts:[['데려와도',1],['데려가도',0,'우리 집으로 "오는" 거니까 "데려와도". 다른 곳으로 같이 가면 "데려가도".'],['내려와도',0,'내려오다는 위에서 아래로 오는 거예요. 같이 오면 "데려와도".']]},
 /* grammar: -(으)ㄹ까(요) (shall we? / should I?) · -지 마 (don't) */
 {w:'곡',ask:'노래방이다! 내가 먼저 한 곡 ___?',opts:[['부를까',1],['부르지 마',0,'"-지 마"는 하지 말라는 거야. 물어볼 때는 "부를까?"']]},
 {w:'놀리다',ask:'동생한테: "내 머리 보고 웃지 마. ___!"',opts:[['놀리지 마',1],['놀릴까',0,'"-ㄹ까"는 물어보는 말이에요. 하지 말라고 할 때는 "놀리지 마".']]},
 {w:'포기하다',ask:'너무 힘들어… 그냥 여기서 ___?',opts:[['포기할까',1],['포기할게',0,'"-ㄹ게"는 약속이에요. 고민하면서 물어볼 때는 "포기할까?"']]},
 {w:'긴장하다',ask:'발표하는 친구한테: "괜찮아. ___."',opts:[['긴장하지 마',1],['긴장할까',0,'"-ㄹ까"는 물어볼 때예요. 하지 말라고 할 때는 "긴장하지 마".']]},
];

const Q={ // NPC questions, kept here so review can reuse them. who:'나' = the player says it.
 gureum:[
  {own:1,w:'기회',ask:'축제 전까지 방송 한 번. 이번이 마지막 ___야.',opts:[['기회',1],['기억',0,'기억은 머릿속에 남은 거야. 딱 좋은 때는 "기회".'],['기분',0,'기분은 마음 상태야. 한 번뿐인 좋은 때는 "기회".']]},
  {own:1,w:'놓치다',ask:'첫날 버스가 늦어서 지각했다며? 나도 자주 버스를 ___. 그래서 아침마다 뛰어.',opts:[['놓쳐',1],['놓아',0,'놓다는 물건을 어디에 두는 거야. 버스를 못 타면 "놓쳐".'],['넣어',0,'넣다는 안에 들어가게 하는 거야. 버스를 못 타면 "놓쳐".']]},
  {own:1,w:'기회',ask:'아무튼 좋은 기회야. 그럼 우리 뭐부터 ___?',opts:[['할까',1],['할게',0,'"-ㄹ게"는 약속이야. 같이 정하자고 물어볼 때는 "할까?"'],['하지 마',0,'"-지 마"는 하지 말라는 거야. 물어볼 때는 "할까?"']]},
 ],
 hariM:[
  {own:1,w:'얼다',who:'…',ask:'그 애가 나를 보고 그대로 ___.',opts:[['얼었어요',1],['열었어요',0,'열다는 문을 여는 거예요. 놀라서 몸이 안 움직이면 "얼었어요".'],['울었어요',0,'울다는 눈물이 나는 거예요. 몸이 딱 굳으면 "얼었어요".']]},
  {own:1,w:'심장',who:'…',ask:'쿵쿵쿵… 그 애 ___ 소리가 여기까지 들릴 것 같아요.',opts:[['심장',1],['시장',0,'시장은 물건을 사는 곳이에요. 가슴에서 뛰는 건 "심장".'],['심판',0,'심판은 경기의 규칙을 보는 사람이에요. 가슴에서 뛰는 건 "심장".']]},
  {own:1,w:'곡',ask:'딱 한 ___만 불렀어요. 진짜예요.',opts:[['곡',1],['권',0,'권은 책을 셀 때예요. 노래는 한 "곡", 두 "곡".'],['장',0,'장은 종이를 셀 때예요. 노래는 한 "곡", 두 "곡".']]},
 ],
 jung:[
  {w:'명찰',who:'나',ask:'음악실에 1학년 ___이 떨어져 있었어요.',opts:[['명찰',1],['명함',0,'명함은 회사 사람이 주는 작은 종이예요. 교복에 다는 이름표는 "명찰".'],['경찰',0,'하하, 경찰은 도둑을 잡는 사람이에요. 이름표는 "명찰".']]},
  {who:'나',ask:'그럼 이 명찰, 제가 직접 ___?',opts:[['줄까요',1],['주지 마세요',0,'"-지 마세요"는 하지 말라는 말이에요. 물어볼 때는 "줄까요?"'],['줬어요',0,'아직 안 줬어요! 물어볼 때는 "줄까요?"']]},
 ],
 chanG:[
  {w:'놀리다',ask:'저건 웃긴 게 아니야. 1학년 애를 ___ 거야.',opts:[['놀리는',1],['노는',0,'놀다는 같이 재밌게 시간을 보내는 거야. 남을 보고 기분 나쁘게 웃으면 "놀리는".'],['노리는',0,'노리다는 무엇을 잡으려고 보는 거야. 남을 보고 기분 나쁘게 웃으면 "놀리는".']]},
  {w:'장난',ask:'선배들은 웃으면서 "그냥 ___이야" 그래.',opts:[['장난',1],['장남',0,'장남은 첫째 아들이야. 재미로 하는 일은 "장난".'],['잔반',0,'잔반은 먹고 남은 밥이야. 재미로 하는 일은 "장난".']]},
  {own:1,w:'놀리다',ask:'선배들한테 이렇게 말하자. "1학년 ___!"',opts:[['놀리세요',0,'그러면 "더 놀려라"가 돼! 하지 말라고 할 때는 "놀리지 마세요".'],['놀리지 마세요',1],['놀릴까요',0,'"-ㄹ까요?"는 물어보는 말이야. 하지 말라면 "놀리지 마세요".']]},
 ],
 teaser:[
  {w:'괴롭히다',who:'나',ask:'장난이요? 하리 얼굴 보세요. 이건 하리를 ___ 거예요.',opts:[['괴롭히는',1],['괴로운',0,'괴롭다는 내 마음이 힘든 거예요. 남을 힘들게 하면 "괴롭히는".'],['도와주는',0,'도와주는 건 좋은 일이에요! 싫은 일을 계속하면 "괴롭히는".']]},
  {w:'괴롭히다',who:'나',ask:'선배님, 이제 하리 ___.',opts:[['괴롭히지 마세요',1],['괴롭힐까요',0,'"-ㄹ까요?"는 물어보는 말이에요. 하지 말라면 "괴롭히지 마세요".'],['괴롭혀 주세요',0,'하하, 그건 "괴롭혀라"예요! 하지 말라면 "괴롭히지 마세요".']]},
 ],
 hariG:[
  {own:1,w:'긴장하다',ask:'목소리도 안 나와요. 너무 ___ 그래요.',opts:[['긴장해서',1],['건강해서',0,'건강하다는 몸이 튼튼한 거예요. 떨리고 목이 막히면 "긴장해서".'],['편해서',0,'편하면 목소리가 잘 나와요. 떨리면 "긴장해서".']]},
  {w:'긴장하다',who:'나',ask:'괜찮아. 너무 ___.',opts:[['긴장하지 마',1],['긴장할까',0,'"-ㄹ까"는 물어보는 말이야. 하지 말라고 할 때는 "긴장하지 마".'],['긴장해',0,'그러면 "긴장해라"가 돼요! 응원은 "긴장하지 마".']]},
 ],
 hariB:[
  {w:'포기하다',own:1,ask:'혼자 못 정하겠어요. 그냥 ___?',opts:[['포기할까요',1],['포기할게요',0,'"-ㄹ게요"는 약속이에요. 고민하면서 물어보면 "포기할까요?"'],['포기하지 마요',0,'그건 남한테 하지 말라는 말이에요. 물어보면 "포기할까요?"']]},
  {w:'포기하다',who:'나',ask:'아직 ___ 마. 한 번만 해 보자.',opts:[['포기하지',1],['포장하지',0,'포장하다는 선물을 종이로 싸는 거예요. 그만두는 건 "포기하다".'],['포기할까',0,'"마" 앞에는 "-지"가 와요. "포기하지 마".']]},
 ],
 chanB:[
  {own:1,w:'어색하다',ask:'다들 왜 말이 없어. 아, 이런 ___ 분위기 싫어.',opts:[['어색한',1],['어색해',0,'"분위기" 앞에서는 "어색한 분위기"야.'],['색다른',0,'색다르다는 새롭고 특별할 때야. 조용하고 불편하면 "어색한".']]},
  {own:1,w:'어색하다',ask:'하리가 웃었어! 이제 하나도 안 ___.',opts:[['어색해',1],['어색한',0,'"안" 다음에 문장이 끝나면 "어색해"야.'],['어서 와',0,'하하, 그건 인사야. 불편하지 않으면 "안 어색해".']]},
 ],
 daonB:[
  {own:1,w:'분위기',ask:'찬이 농담 하나로 여기 ___가 바뀌었어.',opts:[['분위기',1],['기분',0,'기분은 한 사람 마음이야. 여기 모두가 같이 느끼는 건 "분위기".'],['날씨',0,'날씨는 하늘이야. 사람들 사이의 느낌은 "분위기".']]},
  {w:'재촉하다',who:'나',ask:'하리 너무 ___ 마. 시간 많아.',opts:[['재촉하지',1],['재채기하지',0,'재채기는 "에취!"야. 빨리 하라고 자꾸 말하면 "재촉하다".'],['재촉할까',0,'"마" 앞에는 "-지"가 와. "재촉하지 마".']]},
  {own:1,w:'연락처',ask:'하리야, 네 ___ 좀 여기 찍어 줘.',opts:[['연락처',1],['연습장',0,'연습장은 공부하는 공책이야. 폰에 넣는 번호는 "연락처".'],['주소',0,'주소는 집이 어디 있는지야. 폰에 넣는 번호는 "연락처".']]},
  {own:1,w:'데려오다',ask:'내일 점심에 방송실에서 기다려. 하리는 내가 ___.',opts:[['데려올게',1],['따라올게',0,'따라오다는 내가 남의 뒤에서 오는 거야. 하리랑 같이 오면 "데려올게".'],['내려올게',0,'내려오다는 위에서 아래로 오는 거야. 하리랑 같이 오면 "데려올게".']]},
  {own:1,w:'데려오다',ask:'하리를 몇 시에 ___? 열두 시 반 어때?',opts:[['데려올까',1],['데려올게',0,'"-ㄹ게"는 약속이야. 물어볼 때는 "데려올까?"'],['데려오지 마',0,'"-지 마"는 하지 말라는 거야. 물어볼 때는 "데려올까?"']]},
 ],
 gureumL:[
  {w:'타이밍',ask:'마이크를 너무 일찍 켜면 노래 대신 우리 목소리가 나가. 너무 늦게 켜면 조용해. ___이 중요해.',opts:[['타이밍',1],['타이핑',0,'타이핑은 자판으로 글씨를 치는 거야. 딱 맞는 때는 "타이밍".'],['다이빙',0,'하하, 다이빙은 물에 뛰어드는 거야. 딱 맞는 때는 "타이밍".']]},
  {w:'타이밍',ask:'농담도 ___이 좋아야 웃겨.',opts:[['타이밍',1],['기회',0,'비슷하지만, 딱 맞는 "순간"은 "타이밍"이라고 해.'],['효과',0,'효과는 하고 나서 생기는 변화야. 딱 맞는 때는 "타이밍".']]},
  {own:1,w:'챙기다',ask:'방송 끝나면 네가 하리 좀 ___ 줘. 많이 떨 거야.',opts:[['챙겨',1],['생겨',0,'생기다는 없던 게 새로 나타나는 거야. 옆에서 잘 돌보면 "챙겨".'],['놀려',0,'하하, 놀리면 하리가 울어! 잘 돌봐 주면 "챙겨".']]},
  {own:1,w:'타이밍',ask:'자, 노래 ___? 준비됐어?',opts:[['틀까',1],['틀게',0,'"-ㄹ게"는 약속이야. 같이 정할 때는 "틀까?"'],['틀지 마',0,'"-지 마"는 하지 말라는 거야. 물어볼 때는 "틀까?"']]},
 ],
 hariMic:[
  {own:1,w:'효과',who:'오다온',ask:'노래 한 곡에 복도가 다 멈췄어. 방송 ___ 대박이다.',opts:[['효과',1],['효자',0,'효자는 부모님한테 잘하는 아들이야. 바뀌는 힘은 "효과".'],['효도',0,'효도는 부모님한테 잘하는 거야. 바뀌는 힘은 "효과".']]},
  {own:1,w:'즐기다',who:'백구름',ask:'하리야, 너 오늘 노래를 진짜 ___.',opts:[['즐겼어',1],['즐거웠어',0,'즐겁다는 기분이야. "노래를" 다음에는 "즐겼어".'],['줄였어',0,'줄이다는 작게 만드는 거야. 재밌게 하면 "즐겼어".']]},
 ],
 owner:[ // 분식집 아저씨: 1교시 words and old mix-ups only, no badges
  {ask:'지각해서 반장한테 ___ 오백 원을 냈어요.',opts:[['벌금',1],['용돈',0,'용돈은 부모님한테 받는 돈이에요. 규칙을 어기면 "벌금".']]},
  {ask:'바닥에 떨어진 지우개를 ___.',opts:[['주웠어요',1],['줍었어요',0,'줍다는 "주워요, 주웠어요"로 바뀌어요.']]},
  {ask:'우리는 둘 다 열여덟 살. ___이에요.',opts:[['동갑',1],['동네',0,'동네는 사는 곳이에요. 나이가 같으면 "동갑".']]},
  {ask:'버스에서 옛날 친구하고 딱 ___.',opts:[['마주쳤어요',1],['마쳤어요',0,'마치다는 일을 끝내는 거예요. 우연히 만나면 "마주쳤어요".']]},
  {ask:'오늘 떡볶이는 내가 ___!',opts:[['쏠게',1],['쓸게',0,'쓰다는 글씨를 쓰는 거예요. 사 주면 "쏠게".']]},
  {ask:'전학생이 왔다고 벌써 ___.',opts:[['소문났어요',1],['소리 났어요',0,'소리 나다는 귀에 들리는 거예요. 이야기가 퍼지면 "소문났어요".']]},
  {ask:'가게 앞 강아지가 멍멍 ___.',opts:[['짖어요',1],['지어요',0,'짓다는 집이나 밥을 만들 때예요. 강아지는 "짖어요".']]},
 ],
};

const ITEMS={'모집 포스터':'"방송부 부원 모집! 목소리만 있으면 돼요."','하리 명찰':'초록색 명찰. "1학년 2반 유하리"','하리 연락처':'다온이 보내 준 하리 번호. 이름 옆에 마이크 그림.','생수':'분식집 아저씨가 준 차가운 물.'};
const f=()=>state.f;
const hasItem=i=>state.items.includes(i);
const has=w=>state.badges.includes(w);

/* school exit: closed in class time and during the next day's lunch until the broadcast is done */
const outLock=()=>!f().afterSchool?'아직 수업 시간이에요. 밖에 못 나가요.':f().nextDay&&!f().done?'점심시간이에요. 학교 밖에 나가면 안 돼요.':false;
/* 느티고 (src/school.js): the 방송실, the 2층 음악실 and the 체육관 across the 운동장 are open; the 정문 leads to 학교 앞. */
const ZONES={...SCHOOL({open:['hall2','music','gym','bcast'],gate:{to:'street',x:10,y:8,dir:'up',lock:outLock},zones:{
 bcast:{paint:[[13,0,'b'],[7,2,'T']],
  things:{'#':['벽에 먼지가 많아요.','벽에 오래된 사진 자국이 있어요.','구름이 벽을 조금 닦았어요. 거기만 하얘요.'],
   'r':['카세트테이프가 가득해요. 다 옛날 노래예요.','테이프 이름이 다 손글씨예요.','테이프 하나에 "점심 방송 1"이라고 쓰여 있어요.'],
   'A':()=>f().done?'"방송 중" 램프. 아직 따뜻해요.':f().ready?'"방송 중" 램프. 곧 켜질 거예요.':'"방송 중" 램프예요. 불이 꺼졌어요.',
   'b':()=>f().done?'사연함 안에 카세트하고 쪽지. "1994 방송부 · 복숭아" — "목소리 좋다. 다음은 이야기."':'사연함이에요. 아직 비어 있어요.',
   'O':['빛바랜 포스터예요. 아주 옛날 거예요.','포스터에 마이크 그림이 있어요.'],
   'W':['창문이 먼지 때문에 뿌예요.','창밖에 학교 앞 길하고 빌라들이 보여요.','창밖 전봇대에 전깃줄이 많아요. 새가 앉아 있어요.','건너편 건물 2층은 학원이에요. 멀리 아파트도 보여요.','길 건너에 편의점이 있어요. 밖에 파라솔하고 테이블이 있어요.'],
   'M':x=>f().done?['방송 기계예요. 방금 방송해서 아직 따뜻해요.','버튼 위에 이름표: "노래" "마이크"','구름이 기계를 깨끗하게 닦았어요.'][x%3]
     :['방송 기계예요. 구름이 테이프로 고쳤어요.','버튼 위에 이름표: "노래" "마이크"','기계 위에 먼지가 하얗게 쌓였어요.'][x%3],
   'i':()=>f().done?'마이크예요. 하리 목소리가 아직 귀에 남아 있어요.':'마이크예요. "아, 아…" 오늘은 소리가 나요.',
   's':['낡은 소파예요. 앉으면 먼지가 펑!','소파 밑에 과자 봉지가 있어요.'],
   'c':'옛날 녹음기예요. 테이프가 걸려 있어요.',
   'x':['상자에 "축제 1998"이라고 쓰여 있어요.','상자 안에 전선이 가득해요.','상자가 무거워요. 안 움직여요.']},
  npcs:['gureum','gureumL','hariMic','daonL','chanL']},
 hall:{
  things:{'#':['하얀 벽이에요. 아래쪽은 초록색이에요.','벽에 "복도에서 뛰지 마세요" 종이가 있어요.','누가 벽에 작게 음표를 그렸어요.'],
   'N':()=>f().poster?'게시판: "방송부 부원 모집! 목소리만 있으면 돼요."':'게시판: "축제 다음 달! 반마다 하나씩 준비해요."',
   'P':()=>f().done?'스피커에서 아직 노래가 귀에 남아요.':f().ready?'스피커예요. 곧 소리가 날 거예요.':'낡은 스피커예요. 아무 소리도 안 나요.',
   'c':['서류가 가득한 캐비닛이에요.','서랍에 "벌점 기록"이라고 쓰여 있어요. 무서워요.'],
   'w':'정수기예요. 물이 시원해요.',
   'p':'화분이에요. 잎이 반짝반짝해요.',
   'k':['선생님 책상이에요. 시험지가 높이 쌓였어요.','커피 컵에 "국어"라고 쓰여 있어요.','책상 위에 독후감 종이가 한 무더기 있어요.'],
   's':['신발장이에요. 실내화가 줄줄이 있어요.','신발장 하나에 초록색 운동화. 1학년 거예요.'],
   'W':['창밖에 운동장하고 느티나무가 보여요.','창밖에서 새가 짹짹 울어요.']},
  npcs:['jung','student','xA','xB','xSenior','xWin','xClean','xBye','xF','xG','xH','xI','xJ']},
 hall2:{locks:{music:()=>!f().poster&&'음악실이에요. 문이 잠겨 있어요.'},
  things:{'V':x=>x>4?(x>=20?'도서관 창문이에요. 책장이 보여요.':'3학년 교실이에요. 다들 문제집만 봐요.'):(()=>!f().poster?'음악실 창문이에요. 안이 조용해요.':!f().metHari?'창문 너머로 노랫소리가 들려요!':'음악실 안에 피아노가 보여요.')()}},
 yard:{locks:{gym:()=>!f().knowHari&&'체육관이에요. 점심시간이라 문이 잠겨 있어요.'}},
 music:{
  things:{'#':['벽에 "조용히! 연습 중"이라고 쓰여 있어요.','벽이 폭신해요. 소리를 먹는 벽이에요.'],
   'M':x=>x===4?'칠판에 높은음자리표가 크게 있어요.':['칠판에 악보가 그려져 있어요.','칠판 구석: "다음 시간 가창 시험"','칠판에 음표가 춤을 추는 것 같아요.'][x%3],
   'J':x=>x===12?'옛날 음악가 사진이에요. 하얀 머리가 길어요.':'옛날 음악가 사진. 눈이 나를 따라와요…',
   'W':['창밖에 운동장이 보여요.','창문이 조금 열려 있어요. 노래가 밖으로 나갔겠어요.'],
   'P':x=>x===4?'피아노 위에 악보가 펼쳐져 있어요.':['피아노예요. 건반 하나가 안 눌려요.','피아노 뚜껑에 손자국이 있어요. 아직 따뜻해요.'][x%2],
   's':['보면대예요. 악보에 연필로 "숨!"이라고 쓰여 있어요.','보면대가 조금 기울었어요.'],
   'h':['파란 의자예요. 줄이 반듯해요.','의자 위에 누가 리코더를 두고 갔어요.','의자 밑에 작은 머리끈이 떨어져 있어요.'],
   'd':['드럼이에요. 치고 싶지만… 쉿.','심벌이 반짝반짝해요.'],
   'x':['악기 선반이에요. 리코더하고 우쿨렐레가 있어요.','탬버린이 하나 있어요. 방울이 하나 빠졌어요.']},
  npcs:['hariM','tagM']},
 gym:{
  things:{'#':['체육관 벽이에요. 공 자국이 많아요.','벽에 "느티고 화이팅!" 현수막이 있어요.'],
   'W':['높은 창문이에요. 햇빛이 길게 들어와요.','창문에 그물이 있어요. 공 때문이에요.'],
   'H':['농구 골대예요. 그물이 반쯤 찢어졌어요.','골대가 높아요. 찬은 한 번도 못 넣었대요.'],
   'm':['파란 매트예요. 누우면 바로 잠이 와요.','매트에서 땀 냄새가 나요. 별로예요.'],
   'o':['공 수레예요. 농구공하고 배구공이 가득해요.','공 하나가 바람이 빠졌어요.'],
   'b':['나무 관람석이에요. 계단처럼 높아져요.','관람석에 누가 물병을 두고 갔어요.','관람석 밑에 배드민턴 공이 숨어 있어요.']},
  npcs:['chanG','chanG2','teaser','teaser2','hariG','xPE','xBall1','xBall2']}}}),
 street:{name:'학교 앞',reg:'IN FRONT OF SCHOOL',outdoor:1,
  legend:{'R':{tile:'roof'},'K':{tile:'sign'},'O':{tile:'shopWin'},'e':{tile:'closedDoor'},'E':{tile:'shopDoor',walk:1},'h':{tile:'brick'},
   ',':{tile:'pave',walk:1},'r':{tile:'road'},'z':{tile:'crosswalk',walk:1},'l':{tile:'lamp'},'t':{tile:'streetTree'},'B':{tile:'busStop'},
   'f':{tile:'sfence'},'G':{tile:'sgate',walk:1}},
  map:[
"RRRRRRRhRRRRRRRRhRRRRRRR",
"KKKKKKKhKKKKKKKKhKKKKKKK",
"OOeOOOOhOOOEOOOOhOOeOOOO",
",,,,,,,,,,,,,,,,,,,,,,,,",
",t,,,,l,,,,,,,,,,,l,,,t,",
"rrrrrrrrrrzzrrrrrrrrrrrr",
"rrrrrrrrrrzzrrrrrrrrrrrr",
",,,,,,,,,,,,,,,,,,BB,,,,",
",t,,,,,,,,,,,,,,,,,,,,t,",
"ffffffffffGGffffffffffff"],
  rooms:[[0,3,23,4,'학교 앞 · 가게'],[0,7,23,8,'학교 앞']],
  warps:{'11,2':{to:'bunsik',x:7,y:9,dir:'up'},'10,9':{to:'yard',x:11,y:12,dir:'up'},'11,9':{to:'yard',x:12,y:12,dir:'up'}},
  spots:{},
  things:{'R':x=>x<7?'문구점 지붕이에요. 파란색이에요.':x<16?'분식집 지붕이에요. 빨간색이에요.':'편의점 지붕이에요. 초록색이에요.',
   'K':x=>x<7?'간판: "느티 문구"':x<16?'간판: "엄마손 분식" 떡볶이 그림이 있어요.':'간판: "24시 편의점"',
   'O':x=>x<7?'문구점 창문. 예쁜 공책하고 펜이 있어요.':x<16?['창문 너머로 떡볶이가 보글보글.','창문에 "떡볶이 삼천 원" 종이.'][x%2]:'편의점 창문. 컵라면이 줄줄이 있어요.',
   'e':x=>x<7?'문구점 문이에요. "잠깐 은행 다녀올게요"':'편의점 문이에요. 사람이 너무 많아요.',
   'h':['빨간 벽돌 벽이에요.','벽돌 사이에 작은 풀이 자라요.'],
   'r':['차가 다니는 길이에요. 횡단보도로 건너요.','학원 버스가 쌩 지나가요.','길에 노란 줄이 있어요.'],
   'l':'가로등이에요. 아직 불이 꺼져 있어요.',
   't':['가로수예요. 잎이 반짝여요.','나무 밑에 고양이가 자고 있어요.'],
   'B':['버스 정류장이에요. "학원가 방향"','정류장 의자에 학생들이 앉아 있었어요.'],
   'f':['학교 울타리예요. 안에 느티나무가 보여요.','울타리에 "학생 안전 구역" 표지판.']},
  npcs:['xS1','xS2','xS3','xS4']},
 bunsik:{name:'엄마손 분식',reg:'SNACK BAR',
  legend:{'#':{tile:'wall'},'.':{tile:'tileFloor',walk:1},'D':{tile:'exitDoor',walk:1},'M':{tile:'menu'},'W':{tile:'hallWin'},
   'k':{tile:'pan'},'=':{tile:'bcounter',over:1},'t':{tile:'btable',over:1},'j':{tile:'water'},'p':{tile:'plant'},'u':{tile:'fridge'}},
  map:[
"#MMMM##WWWW##WW#",
"#kkk...........#",
"#=====.........#",
"#..............#",
"#..tt...tt..tt.#",
"#..............#",
"#..tt...tt..tt.#",
"#..............#",
"#j..........p.u#",
"#..............#",
"#######DD#######"],
  rooms:[[1,1,14,9,'엄마손 분식']],
  warps:{'7,10':{to:'street',x:11,y:3,dir:'down'},'8,10':{to:'street',x:11,y:3,dir:'down'}},
  spots:{},
  things:{'#':['벽에 연예인 사인이 가득해요.','벽에 "학생 할인" 종이가 붙어 있어요.'],
   'M':['메뉴: 떡볶이, 순대, 튀김, 김밥.','"떡볶이 삼천 원. 학생은 많이 줘요."','메뉴판 구석: "외상 안 돼요!"'],
   'W':['창밖으로 학교 울타리가 보여요.','창문에 김이 서렸어요.'],
   'k':x=>['떡볶이가 빨갛게 보글보글 끓어요.','순대가 김을 내요. 냄새가 좋아요.','튀김이 바삭바삭해 보여요.'][x%3],
   '=':['계산대예요. 사탕 통이 있어요.','계산대에 "카드 돼요" 종이.'],
   't':['빨간 탁자예요. 떡볶이 국물 자국이 있어요.','탁자 위에 휴지하고 이쑤시개가 있어요.','탁자에 누가 "졸업 축하" 낙서를 했어요.'],
   'j':'물은 셀프예요. 컵이 쌓여 있어요.',
   'p':'화분이에요. 고추가 열렸어요!',
   'u':['냉장고에 음료수가 가득해요.','바나나우유가 있어요. 찬이 좋아하겠어요.']},
  npcs:['owner','hariB','chanB','daonB','tableB']}};

/* the street outside the 방송실, drawn upright (sky on top, road at the bottom), 64px wide = four window tiles. A Korean school street:
   a red-brick 빌라 with a water tank on the roof, a concrete 전봇대 with tangled power lines and a transformer (a bird on a wire),
   a two-storey 상가 (a 학원 upstairs, a shop's sign band and glass front below) with 아파트 towers far behind, a white 빌라, and a
   bright 편의점 (blue sign band, shelves behind the glass) with a parasol, a plastic table and red chairs out front. */
const STREET={pal:{L:'rgba(60,66,72,.55)',k:'#3C4248',Q:'#6E8FB0',b:'#7E3E2E',B:'#9A4E3A',V:'#C9DCE6',Y:'#F2D27A',d:'#5A4636',
  P:'#9AA0A6',X:'#5E646A',A:'#C9D2D8',a:'#AEB8C0',W:'#E6DCC8',w:'#BDB3A0',S:'#2E9C8E',s:'#F4F1E6',G:'#D8E8EE',e:'#8E979C',
  g:'#8C8F92',m:'#E8E4D8',
  n:'#2B6CB0',o:'#F4F1E6',H:'#F4F6E8',x:'#D9534F',y:'#F2C94C',u:'#E8E4D8',U:'#3E8E5A',p:'#6F757C',t:'#C9CED3',c:'#C0392B'},
 rows:['..........QQ....LPLLAAA...AAAA.....QQ...........................',
       'L.bbbbbbbbQQbb.LLPXLAaALkLAaAALLLwwwQwwwwwwwwwwLLLLLLLLLLLLLLLLL',
       '..BVVBBVVBBVVB...P..WWWWWWWWWWW..WVVWWVVWWVVWW..................',
       '..BBBBBBBBBBBB...P..WVVWVVWVVWW..WWWWWWWWWWWWW..nnoonnnnnn.uUUu.',
       '..BVYBBVVBBYVB...P..SSSSsSSSsSS..WVVWWYVWWVVWW..HHHHHHHHHH..p...',
       '..BBBBBBBBBBBB...P..GGGGGeGGGGG..WWWWWWWWWWWWW..HxyHHyxHHH.tttt.',
       '..BVVBBddBBVVB...P..GGdGGeGGGGG..WVVWWdddWWVVW..HHdHHHHHHH.c..c.',
       'gggmggggggmggggggmggggggmggggggmggggggmggggggmgggggmggggggmggggg']};
/* 분식집 stools (blue), the same scheme as 1교시's lunch tables: a table draws its stools tucked in unless someone sits right next
   to it, facing it; then the stool is drawn with the sitter. STOOL_N: the sitter's back to the camera, pulled up to the table edge;
   STOOL: on the far side, facing the camera, hidden behind the sitter, whose lap meets the table. */
const STOOL_PAL={O:'#1B1E2B',e:'#2B6E9A',E:'#1E4F70',m:'#6F757C'};
const STOOL_N={art:{pal:STOOL_PAL,drop:0,lift:4,down:['.OOOOOOOO.','.OeeeeeeO.','.OOOOOOOO.','..m....m..']}};
const STOOL={art:{pal:STOOL_PAL,keep:14,drop:7,down:['..OOOOOO..','..OeeeeO..','..OEEEEO..','..OOOOOO..','...m..m...']}};
const seatPulled=(x,y)=>{try{if(player.sit&&player.dir==='up'&&player.x===x&&player.y===y+1)return true;
 return live().some(n=>n.x===x&&n.y===y+1&&n.dir==='up'&&!n.walk&&sitting(n))}catch(e){return false}};
const seatPulledN=(x,y)=>{try{return live().some(n=>n.x===x&&n.y===y-1&&n.dir==='down'&&!n.walk&&sitting(n))}catch(e){return false}};

const LOOK={
 player:{hair:'#2B2422',skin:'#E6BE9C',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#B8433A',style:'short'},
 gureum:{hair:'#3B2E2A',skin:'#E2B794',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#B8433A',style:'bob'},
 daon:{hair:'#2A2024',skin:'#EBC3A2',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#B8433A',style:'bun',lashes:1,lips:'#C9707A'},
 chan:{hair:'#6B4A2E',skin:'#D9A57E',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#B8433A',style:'spiky'},
 hari:{hair:'#1F1A1E',skin:'#F0CDAF',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#3F7D5A',style:'long',lashes:1,lips:'#D27C86'},
 jung:{hair:'#3A2A28',skin:'#E6BE9C',shirt:'#C98F6A',pants:'#3E4350',style:'bob',lashes:1,lips:'#B85F68'},
 owner:{hair:'#3A2E2A',skin:'#D6A07A',shirt:'#E8833A',pants:'#4A4038',style:'short'},
 teaser:{hair:'#2A2426',skin:'#D2A07A',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#C9A13A',style:'spiky'},
 teaser2:{hair:'#4A3428',skin:'#E4B994',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#C9A13A',style:'short'},
 student:{hair:'#3A2B26',skin:'#EEC7A6',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#3F7D5A',style:'bob',lashes:1,lips:'#CC7680'},
 /* extras: background students (tie colour by year) and staff */
 xA:{hair:'#2A2220',skin:'#E2B48E',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#B8433A',style:'short'},
 xB:{hair:'#3A2824',skin:'#F0CAA8',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#B8433A',style:'long',lashes:1,lips:'#D07A84'},
 xSenior:{hair:'#1A181C',skin:'#D4A07A',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#C9A13A',style:'spiky'},
 xWin:{hair:'#4A3428',skin:'#E8BE9A',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#B8433A',style:'bob',lashes:1,lips:'#C46E78'},
 cleaner:{hair:'#5A4A44',skin:'#D2A27E',shirt:'#E7A6A0',pants:'#4E5866',style:'bun',lashes:1,lips:'#B86A6A',cap:'#F2EEE6'},
 xBye:{hair:'#2E2420',skin:'#EAC2A0',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#3F7D5A',style:'spiky'},
 xF:{hair:'#241E20',skin:'#DCAA84',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#B8433A',style:'bun',lashes:1,lips:'#C9707A'},
 xG:{hair:'#3B2C24',skin:'#E6BC98',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#B8433A',style:'short'},
 xH:{hair:'#2B1F1F',skin:'#F2CFB0',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#3F7D5A',style:'long',lashes:1,lips:'#D88A92'},
 xI:{hair:'#18181B',skin:'#CF9A74',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#C9A13A',style:'short'},
 xJ:{hair:'#5A3E2C',skin:'#E0B28C',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#B8433A',style:'spiky'},
 pe:{hair:'#1E1C20',skin:'#C99470',shirt:'#3E7FC0',pants:'#2E3A5A',style:'short'},
 xBall1:{hair:'#2C2422',skin:'#D6A27C',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#B8433A',style:'short'},
 xBall2:{hair:'#332824',skin:'#ECC4A2',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#B8433A',style:'spiky'},
 xS1:{hair:'#2A2220',skin:'#F2CEAE',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#3F7D5A',style:'bob',lashes:1,lips:'#D27C86'},
 xS2:{hair:'#4A382E',skin:'#E4B894',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#3F7D5A',style:'short'},
 xS3:{hair:'#1F1A1C',skin:'#DDAE88',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#B8433A',style:'long',lashes:1,lips:'#CC7680'},
 xS4:{hair:'#2E2622',skin:'#D09A72',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#C9A13A',style:'short'},
};
const NOTAG='하리 명찰';
const TAG={art:{pal:{O:'#1B1E2B',g:'#3E8E5A',w:'#F4F1E6'},down:['OOOOOOOO','OgwwwwgO','OgwwwwgO','OOOOOOOO']}};  // 하리's 명찰 on the floor
const pick=a=>a[Math.random()*a.length|0];  // a repeat line picked at random, so a character talked to often doesn't say the same thing

const NPC={
 gureum:{name:'백구름',zone:'bcast',x:5,y:3,dir:'up',look:LOOK.gureum,badge:['기회','놓치다'],banmal:1,
  hide:()=>!!f().hariMaybe,
  after:'이번 기회, 진짜 놓치면 안 돼.',
  script:()=>{
   if(!has('기회'))return null;
   if(f().afterSchool)return [{say:'분식집? 나는 기계 고쳐야 돼. 다녀와.'},{say:'끝나면 방송실로 와. 나 여기 있어.'}];
   if(f().stoodUp)return [{say:'찬이한테 톡 왔어. 3학년 선배들한테 말했다며?',face:'surprised'},{say:'너 진짜 용감하다. 나는 못 해.'}];
   if(f().knowHari)return [{say:'유하리? 1학년이구나.'},{say:'체육관은 운동장 오른쪽이야. 초록색 지붕.'}];
   if(f().metHari)return [{say:'노래하는 애가 도망갔어? 하하… 나 같다.',face:'happy'},{say:'명찰 있으면 선생님이 알 거야.'},{say:'교무실은 복도 왼쪽 위야.'}];
   if(f().poster)return [{say:'음악실은 2층이야. 계단으로 올라가.'},{say:'쉿, 조용히 들어가.'}];
   return null},
  talk:()=>[
   {say:'왔어요? 어제 진짜 고마웠어요.',face:'happy'},
   {say:'우리 동갑이니까… 이제 말 편하게 할게.'},
   {who:'나',say:'그래. 아, 어제 신발장에 분홍색 쪽지가 있었어. "다음은 노래." 복숭아래.'},
   {say:'…또 복숭아? 노래…? 누구지.',face:'think'},
   {say:'자, 이거 봐. 부원 {모집|모집} 포스터야.',give:'모집 포스터'},
   {say:'축제까지 방송 한 번. 근데 목소리가 없어.',face:'sad'},
   Q.gureum[0],
   {say:'이번 기회 놓치면 끝이야. 방송실도 끝.',face:'sad'},
   Q.gureum[1],
   {say:'하하, 다온이한테 벌금도 냈지?',face:'happy'},
   {who:'나',say:'응… 오백 원. 그 얘기는 그만해.'},
   Q.gureum[2],
   {say:'아, 그러고 보니… 아까 음악실 앞을 지났어.',face:'think'},
   {say:'안에서 노래가 들렸어. 목소리가 진짜 좋았어.'},
   {say:'누군지는 몰라. 가서 말을 걸어 볼래?'},
   {say:'나는… 모르는 사람은 좀 무서워.',face:'sad'},
   {w:'놓치다',who:'나',build:['이번 기회는','절대','안 놓칠게']},
   {say:'좋아! 음악실은 2층이야. 계단으로 올라가.',face:'happy',award:['기회','놓치다'],set:()=>{f().poster=1}}]},

 hariM:{name:'유하리',zone:'music',x:7,y:2,dir:'up',look:LOOK.hari,badge:['얼다','심장','곡'],
  hide:()=>!!f().metHari,
  talk:()=>[
   {who:'노랫소리',say:'♪ 라라… 오늘도 나는… ♪'},
   {who:'…',say:'피아노 옆에서 여자애가 노래해요.'},
   {who:'…',say:'초록색 넥타이. 1학년이에요.'},
   {who:'…',say:'목소리가 진짜 맑아요.'},
   {say:'…!!',face:'surprised'},
   {who:'…',say:'눈이 마주쳤어요.'},
   Q.hariM[0],
   {say:'저, 저… 그, 그게…',face:'surprised'},
   {who:'…',say:'그 애가 가슴에 손을 올려요.'},
   Q.hariM[1],
   {who:'…',say:'포스터를 보여 줬어요. "방송부 부원 모집"'},
   {say:'바, 방송이요? 사람들 앞에서요?',face:'surprised'},
   {say:'저는 그냥… 혼자 연습했어요.',face:'sad'},
   Q.hariM[2],
   {say:'죄, 죄송해요! 볼일이 있어서!',face:'surprised'},
   {who:'…',say:'그 애가 후다닥 나갔어요. 바닥에 뭐가 있어요.',set:()=>{f().metHari=1},leave:{npc:'hariM',to:[8,10]}},
   {who:'…',say:'초록색 명찰이에요. 떨어뜨리고 갔어요.',give:NOTAG},
   {who:'…',say:'…얼마나 놀랐으면.',award:['얼다','심장','곡']}]},

 tagM:{name:'명찰',zone:'music',x:7,y:2,dir:'down',look:TAG,still:1,
  hide:()=>!f().metHari||hasItem(NOTAG)||has('명찰'),
  talk:()=>[{who:'…',say:'초록색 명찰이에요.'}]},

 jung:{name:'정 선생님',zone:'hall',x:6,y:2,dir:'down',look:LOOK.jung,badge:['명찰'],
  get after(){return pick([['점심 방송 잘 들었어요. 교무실이 다 조용했어요.'],['하리 학생 목소리, 정말 좋았어요.','근데 명찰은 늘 달고 다녀요. {벌점|벌점} 무서워요.']])},  // only after the finale; before it the script has a line for every phase
  status:()=>{if(!has('명찰'))return hasItem(NOTAG)?'todo':null},
  script:()=>{
   if(!has('명찰')&&!hasItem(NOTAG))return f().poster?[{say:'방송부 포스터 봤어요. 잘 만들었네요.'},{say:'목소리 좋은 학생? 2층 음악실에 가 봐요.'}]
    :[{say:'점심은 먹었어요? 방송실 먼지 조심해요.'}];
   if(has('명찰')&&f().stoodUp&&!f().afterSchool)return [{say:'아까 체육관이 시끄러웠어요. 무슨 일 있었어요?'},{say:'…하리 학생은 괜찮아요?'}];
   if(has('명찰')&&!f().afterSchool)return [{say:'체육관은 운동장 오른쪽, 초록색 지붕이에요.'},{say:'1학년들은 지금 체육관에 있어요.'}];
   if(has('명찰')&&!f().nextDay)return [{say:'오늘 방과 후에 무슨 일 있어요? 표정이 바빠요.'},{say:'방송실은 복도 아래쪽 오른쪽, 포스터 붙은 문이에요.'}];
   if(has('명찰')&&!f().done)return [{say:'오늘 점심 방송 해요? 교무실에서도 들을게요.',face:'happy'}];
   return null},
  talk:()=>[
   {say:'어, 왔어요? 손에 그거 뭐예요?'},
   Q.jung[0],
   {say:'아, 명찰이네요. 이름이 쓰여 있어요.'},
   {say:'1학년 유하리. 아, 이 학생 알아요.',face:'happy'},
   {say:'목소리가 좋아요. 근데 대답은 맨날 작아요.'},
   {say:'명찰이 없으면 {벌점|벌점}이에요. 빨리 줘야 해요.'},
   Q.jung[1],
   {say:'네, 좋아요. 다음 시간이 1학년 체육이에요.'},
   {say:'지금 체육관에 있을 거예요. 운동장 오른쪽, 초록색 지붕.',award:['명찰'],set:()=>{f().knowHari=1}}]},

 student:{name:'1학년 학생',zone:'hall',x:7,y:8,dir:'right',look:LOOK.student,
  script:()=>{
   if(f().done)return [{say:'선배! 점심 방송 들었어요! 하리 대박!',face:'happy'},{say:'우리 반이 다 울었어요. 진짜로요.'}];
   if(f().metHari)return [{say:'하리요? 우리 반이에요. 착해요.'},{say:'근데 말이 별로 없어요. 노래도 혼자만 해요.'}];
   return null},
  talk:()=>[
   {say:'선배, 그 소문 들었어요?'},
   {say:'2층 음악실에서 노래하는 귀신이 나온대요!',face:'surprised'},
   {say:'근데 목소리가 엄청 예쁘대요. 이상하죠?'}]},

 chanG:{name:'남궁찬',zone:'gym',x:12,y:10,dir:'up',look:LOOK.chan,badge:['장난','놀리다'],banmal:1,
  hide:()=>!!f().afterSchool||!!f().chanGym,
  get after(){return pick([['선배들한테 말하는 거, 멋있었어.'],['솔직히 나 다리 떨렸어. 비밀이야.']])},
  script:()=>has('장난')&&!f().stoodUp?[{say:'저쪽이야. 공 수레 옆.'},{say:'같이 가. 나 뒤에 있을게.'}]:null,
  talk:()=>[
   {say:'헉, 너 여기서 뭐 해?',face:'surprised'},
   {who:'나',say:'1학년 유하리를 찾아. 너는?'},
   {say:'나? 선생님이 공 가져오라고 시켰어.'},
   {say:'근데 저기 봐. 3학년 선배들 또 저래.',face:'angry',cam:[21,7]},
   {say:'1학년 애 노래를 따라 하면서 웃어. 맨날 저래.'},
   Q.chanG[0],
   {say:'선배들은 웃어. 진짜 재밌대.'},
   Q.chanG[1],
   {say:'근데 저 1학년 얼굴 봐. 하나도 안 웃어.',face:'sad'},
   Q.chanG[2],
   {say:'같이 가자. 나 혼자는… 좀 무서워. 하하.',award:['장난','놀리다'],set:()=>{f().chanGym=1},walk:{npc:'chanG2',from:[12,10]},cam:null}]},

 /* 찬 next to the seniors, once he's said "같이 가자" (he walks over from the door) */
 chanG2:{name:'남궁찬',zone:'gym',x:19,y:6,dir:'right',look:LOOK.chan,badge:['장난','놀리다'],banmal:1,
  hide:()=>!f().chanGym||!!f().afterSchool,
  get after(){return pick([['선배들한테 말하는 거, 멋있었어.'],['솔직히 나 다리 떨렸어. 비밀이야.']])},
  script:()=>!f().stoodUp?[{say:'저 선배들이야. 공 수레 옆.'},{say:'같이 가. 나 바로 뒤에 있을게.'}]:null,
  talk:()=>[]},

 teaser:{name:'3학년 선배',zone:'gym',x:20,y:7,dir:'right',look:LOOK.teaser,badge:['괴롭히다'],banmal:1,
  hide:()=>!!f().stoodUp,
  status:()=>f().chanGym?undefined:'wait',
  script:()=>!f().chanGym?[{say:'뭐야, 2학년? 우리한테 볼일 있어?',face:'angry'}]:null,
  talk:()=>[
   {say:'야, 1학년. 화장실에서 노래했다며?',face:'happy',turn:[{npc:'teaser',dir:'right'},{npc:'teaser2',dir:'right'}]},
   {who:'갈색 머리 선배',say:'하하! 화장실 가수! 한 곡 불러 봐!',face:'happy'},
   {who:'유하리',say:'…',face:'sad'},
   {who:'남궁찬',say:'서, 선배님들… 1학년 놀리지 마세요.'},
   {say:'뭐? 우리 그냥 장난친 거야.'},
   {...Q.teaser[0],ok:'뭐?'},
   {say:'괴롭힌다고? 말도 안 돼. 그냥 웃긴 거야.',face:'angry'},
   {...Q.teaser[1],ok:'…뭐?'},
   {who:'갈색 머리 선배',say:'…야, 2학년이 이런 말까지 하네. 가자.'},
   {say:'…알았어. 그만할게. 쳇.',face:'sad'},
   {who:'…',say:'선배들이 공을 들고 나갔어요.',award:['괴롭히다'],set:()=>{f().stoodUp=1},leave:[{npc:'teaser',to:[11,12]},{npc:'teaser2',to:[12,12]}]}]},

 teaser2:{name:'갈색 머리 선배',zone:'gym',x:21,y:6,dir:'down',look:LOOK.teaser2,banmal:1,
  hide:()=>!!f().stoodUp,
  talk:()=>[{say:'뭐야. 우리 고3이야. 공부 때문에 힘들어.'},{say:'그래서 좀 웃자는 거야. 별거 아니야.'}]},

 hariG:{name:'유하리',zone:'gym',x:22,y:7,dir:'left',look:LOOK.hari,badge:['긴장하다'],
  hide:()=>!!f().afterSchool,
  status:()=>{if(!has('긴장하다'))return f().stoodUp?'todo':'wait'},
  script:()=>!f().stoodUp?[{say:'…',face:'sad'},{who:'…',say:'하리가 고개를 푹 숙이고 있어요.'}]:null,
  talk:()=>[
   {say:'서, 선배… 고맙습니다.',face:'sad'},
   {who:'남궁찬',say:'괜찮아? 저 선배들 원래 저래.'},
   {who:'…',say:'명찰을 돌려줬어요.',take:[NOTAG]},
   {say:'아, 제 명찰! 아까 음악실에서 떨어뜨렸어요.',face:'happy'},
   {say:'저… 사람들 앞에 서면 손이 떨려요.'},
   Q.hariG[0],
   {say:'그래서 혼자서만 노래해요. 화장실이나 음악실.'},
   {who:'남궁찬',say:'너 노래 진짜 잘한다며? 소문났어.'},
   {...Q.hariG[1],ok:'…'},
   {say:'…네. 고마워요, 선배.',face:'happy'},
   {who:'학교 종',say:'딩동댕동… 점심시간 끝!'},
   {who:'남궁찬',say:'헉, 수업! 이따 {방과 후|방과 후}에 {분식집|분식집} 갈까?',face:'happy'},
   {who:'남궁찬',say:'학교 앞, 길 건너편 빨간 가게. 다온이도 부를게.'},
   {say:'네? 저, 저도요…?',face:'surprised'},
   {who:'남궁찬',say:'당연하지! 떡볶이는 다 같이 먹어야 맛있어.',face:'happy'},
   {say:'…네. 갈게요.',face:'happy'},
   {who:'…',sfx:'bell',say:'그리고 오후 수업이 다 끝났어요.',award:['긴장하다'],set:()=>{f().afterSchool=1}}]},

 /* the 분식집 table: one ! in its middle (markDx: between its two tiles), and A at the table, even from your seat, talks to
    whoever's turn it is (proxy); their own markers are off (nomark) */
 tableB:{name:'식탁',zone:'bunsik',x:9,y:6,dir:'down',look:null,still:1,markDx:-8,markDy:10,
  hide:()=>!f().afterSchool||!!f().hariMaybe,
  proxy:()=>['hariB','chanB','daonB'].map(k=>NPC[k]).find(n=>status(n)==='todo')||NPC.hariB,
  status:()=>['hariB','chanB','daonB'].some(k=>status(NPC[k])==='todo')?'todo':null,
  talk:()=>[]},

 owner:{name:'분식집 아저씨',zone:'bunsik',x:4,y:1,dir:'down',look:LOOK.owner,
  script:()=>{const q=Q.owner[Math.random()*Q.owner.length|0];
   const hi=f().done?{say:'방송 잘했다면서요? 학생들이 다 얘기해요.',face:'happy'}:{say:'어서 와요! 오늘 떡볶이 맛있어요.'};
   return [hi,{say:'먹으면서 옛날 단어 하나 해요.'},{...q,old:1},{say:'잘했어요. 또 와요!',face:'happy'}]},
  talk:()=>[]},

 hariB:{nomark:1,name:'유하리',zone:'bunsik',x:9,y:5,dir:'down',look:LOOK.hari,sit:1,chair:STOOL,badge:['포기하다'],
  hide:()=>!f().afterSchool||!!f().hariMaybe,
  get after(){return f().joke?['찬 선배 농담… 사실 좀 웃겼어요.']:['…저 진짜 못 할 것 같아요.']},  // she only agrees to one song later, to 다온
  talk:()=>[
   {who:'…',say:'떡볶이가 보글보글. 하리는 젓가락만 들고 있어요.',sit:{x:9,y:7,dir:'up',chair:STOOL_N}},
   {say:'선배, 저 방송… 못 할 것 같아요.',face:'sad'},
   {say:'노래하려고 하면 목이 딱 막혀요.'},
   Q.hariB[0],
   {...Q.hariB[1],ok:'…'},
   {say:'…저도 모르겠어요.',face:'sad'},
   {who:'…',say:'아무도 말을 안 해요. 분위기가 무거워졌어요.',award:['포기하다'],set:()=>{f().hariGiveUp=1}}]},

 chanB:{nomark:1,name:'남궁찬',zone:'bunsik',x:8,y:5,dir:'down',look:LOOK.chan,sit:1,chair:STOOL,badge:['어색하다'],banmal:1,
  hide:()=>!f().afterSchool||!!f().hariMaybe,
  get after(){return pick([['떡볶이는 왜 빨개? …아, 이미 했지.'],['하리 웃었지? 봤지? 나 천재야.']])},
  status:()=>{if(!has('어색하다'))return f().hariGiveUp?'todo':'wait'},
  script:()=>!has('어색하다')&&!f().hariGiveUp?[{say:'떡볶이 나왔다! 하리 얘기부터 들어 봐.'}]:null,
  talk:()=>[
   {say:'아, 왜 이렇게 조용해.'},
   Q.chanB[0],
   {say:'내가 웃긴 얘기 하나 할게.'},
   {say:'떡볶이가 왜 빨간지 알아?',face:'think'},
   {say:'…부끄러워서! 하하하!',face:'happy'},
   {who:'…',say:'…아무도 안 웃어요. 더 어색해요.'},
   {who:'유하리',say:'…푸흡. 하하!',face:'happy'},
   {say:'봐! 웃었다! 나 천재야.',face:'happy'},
   Q.chanB[1],
   {say:'떡볶이는 긴장 푸는 데 최고야. 먹어!',award:['어색하다'],set:()=>{f().joke=1}}]},

 daonB:{nomark:1,name:'오다온',zone:'bunsik',x:8,y:7,dir:'up',look:LOOK.daon,sit:1,chair:STOOL_N,badge:['분위기','재촉하다','연락처','데려오다'],banmal:1,
  hide:()=>!f().afterSchool||!!f().hariMaybe,
  status:()=>{if(!has('분위기'))return f().joke?'todo':'wait'},
  script:()=>!has('분위기')&&!f().joke?[{say:'나? 찬이한테 끌려왔어.',face:'angry'},{say:'학원 가기 전에 잠깐만이야.'}]:null,
  talk:()=>[
   {say:'찬이한테 끌려왔는데… 웃기긴 하네.'},
   {say:'그나저나 하리가 웃었다. 다행이야.'},
   Q.daonB[0],
   {say:'유하리. 한 곡만 해. 딱 한 번.'},
   {who:'유하리',say:'그, 근데 언니…',face:'sad'},
   {say:'빨리. 대답해. 해? 안 해?',face:'angry'},
   {who:'남궁찬',say:'야, 다온아… 하리 또 얼잖아.'},
   {...Q.daonB[1],ok:'…'},
   {say:'…알았어. 재촉 안 할게. 미안.',face:'sad'},
   {say:'근데 하리야, 포기하지 마. 아깝잖아.'},
   {who:'유하리',say:'…한 곡만이요. 딱 한 곡.',face:'think'},
   {say:'좋아. 자, 내 폰.',face:'happy'},
   Q.daonB[2],
   {who:'…',say:'내 폰에도 하리 연락처가 왔어요.',give:'하리 연락처'},
   Q.daonB[3],
   Q.daonB[4],
   {who:'나',say:'좋아. 열두 시 반. 구름한테도 말할게.'},
   {who:'분식집 아저씨',say:'학생들, 물 챙겨 가요. 서비스!',face:'happy',give:'생수'},
   {say:'늦으면 벌금이야, 하리야. …농담이야.',award:['분위기','재촉하다','연락처','데려오다']},
   {who:'…',say:'다들 가방을 챙겨서 분식집을 나가요.',set:()=>{f().hariMaybe=1},
    leave:[{npc:'hariB',to:[7,10]},{npc:'chanB',to:[8,10]},{npc:'daonB',to:[7,10]}]}]},

 gureumL:{name:'백구름',zone:'bcast',x:5,y:3,dir:'up',look:LOOK.gureum,badge:['기회','놓치다','타이밍','챙기다'],banmal:1,
  hide:()=>!f().hariMaybe,
  get after(){return pick([['하리 목소리 들었지? 복도가 다 멈췄어.'],['타이밍. 노래 먼저, 그다음 마이크.'],['부원 넷! 이제 한 명만 더.']])},
  script:()=>has('타이밍')&&!f().done?[{say:'하리한테 가 봐. 마이크 앞에 있어.'},{say:'긴장 풀리게 말 좀 걸어 줘.'}]:null,
  talk:()=>[
   {say:'어, 왔어? 나는 아직 기계 고쳐.'},
   {who:'…',say:'분식집 이야기를 다 해 줬어요.'},
   {say:'진짜? 하리가 한 곡 한대? 대박.',face:'surprised'},
   {who:'…',say:'하리 연락처를 구름한테도 보냈어요.',take:['하리 연락처']},
   {say:'고마워. 내일 점심에 봐.',face:'happy'},
   {who:'…',say:'그리고 다음 날 점심시간.',set:()=>{f().nextDay=1}},
   {who:'…',say:'방송실이 북적북적해요. 다온이 진짜 하리를 데려왔어요.',cam:[12,4]},
   {say:'자, 방송 순서 알려 줄게.',cam:null},
   {say:'노래 먼저. 삼 초 뒤에 마이크.'},
   Q.gureumL[0],
   {say:'첫 방송이니까 타이밍이 진짜 중요해.'},
   Q.gureumL[1],
   {say:'아, 그리고 물. 노래하기 전에 물이 필요해.',face:'think'},
   {who:'…',say:'분식집에서 받은 생수를 줬어요.',take:['생수']},
   {say:'오! 물까지 챙겼어? 역시.',face:'happy'},
   Q.gureumL[2],
   Q.gureumL[3],
   {say:'하리는 마이크 앞에 있어. 말 좀 걸어 줘.',award:['타이밍','챙기다'],set:()=>{f().ready=1}}]},

 hariMic:{name:'유하리',zone:'bcast',x:11,y:3,dir:'up',look:LOOK.hari,badge:['얼다','심장','곡','긴장하다','포기하다','효과','즐기다'],
  hide:()=>!f().nextDay,
  get after(){return pick([['선배, 다음 곡도 연습하고 있어요.'],['저 아직 손이 떨려요. 그래도 좋아요.']])},
  status:()=>{if(!has('효과'))return f().ready?'todo':'wait'},
  script:()=>!has('효과')&&!f().ready?[{say:'선배… 심장이 터질 것 같아요.',face:'sad'},{who:'…',say:'하리가 물병만 꼭 잡고 있어요.'}]:null,
  talk:()=>[
   {say:'선배… 심장이 터질 것 같아요.',face:'sad'},
   {who:'백구름',say:'괜찮아. 노래하는 동안 나만 봐.',turn:{npc:'hariMic',dir:'left'}},
   {who:'백구름',say:'자, 노래 들어간다. 삼, 이, 일…'},
   {who:'…',say:'"방송 중" 램프에 빨간 불이 켜졌어요.',set:()=>{f().onAir=1}},
   {who:'스피커',say:'♪ …오늘도 나는… ♪'},
   {who:'…',say:'처음엔 떨려요. 그다음엔 점점 맑아져요.'},
   {who:'…',say:'방송실 밖 복도가 조용해졌어요. 다들 스피커를 봐요.'},
   {who:'…',say:'노래가 끝났어요. 하리가 숨을 길게 쉬어요.'},
   {who:'백구름',say:'…마이크 껐어. 이제 말해도 돼.',set:()=>{f().onAir=0}},
   {who:'남궁찬',say:'헉, 복도 봐! 다 멈췄어! 대박!',face:'surprised'},
   {...Q.hariMic[0],ok:'맞아!'},
   {say:'저… 무서웠는데, 오히려 재밌었어요.',face:'happy'},
   {...Q.hariMic[1],ok:'맞아!'},
   {who:'…',say:'하리가 모집 포스터에 이름을 썼어요.',take:['모집 포스터']},
   {say:'1학년 유하리. 방송부 할게요!',face:'happy',award:['효과','즐기다'],set:()=>{f().crew4=1}},
   {who:'오다온',say:'…나도 쓸게. 이름만이야. 반장은 바쁘거든.'},
   {who:'…',say:'다온도 포스터에 이름을 썼어요.'},
   {who:'백구름',say:'부원 넷! 하리야, 마이크 다시 켤게. 마지막 인사.',face:'happy'},
   {w:'즐기다',build:['느티고 여러분,','우리 방송을','즐겨','주세요']},
   {who:'…',say:'복도 여기저기서 박수 소리가 들려요.',set:()=>{f().done=1},finale:1}]},

 daonL:{name:'오다온',zone:'bcast',x:13,y:5,dir:'left',look:LOOK.daon,badge:['분위기','재촉하다','연락처','데려오다'],banmal:1,
  hide:()=>!f().nextDay,
  get after(){return pick([['방송부 시간표, 내가 만들게. 늦으면 벌금.'],['봐. 데려온다고 했지? 나는 말한 건 해.']])},
  script:()=>f().done?null:[{say:'봐. 데려온다고 했지.'},{say:'재촉은 안 했어. …조금만 했어.',face:'think'}],
  talk:()=>[]},

 chanL:{name:'남궁찬',zone:'bcast',x:3,y:6,dir:'right',look:LOOK.chan,badge:['장난','놀리다','어색하다'],banmal:1,
  hide:()=>!f().nextDay,
  after:'다음 방송 땐 내 농담 코너도 있어. 진짜야.',
  script:()=>f().done?[{say:'나 구경만 한다고 했지?'},{say:'…근데 이제 그냥 부원 할까?',face:'think'}]
   :[{say:'쉿! 방송 전이야. 나 오늘 장난 안 쳐.'},{say:'…진짜야. 하리가 웃어야 하니까.'}],
  talk:()=>[]},

 /* ---------- extras: one-off students and staff so the school feels lived-in. No badges, no teaching.
    Day one lunch (before afterSchool): the hall is busy. After school (afterSchool, before nextDay): 학교 앞 is busy,
    the 농구부 practises in the gym, a cleaner is in the hall. Next day's lunch (nextDay): the hall waits for the broadcast,
    and after the finale talks about it. The 음악실 and the 분식집 stay as the scenes describe them. ---------- */
 xA:{name:'2학년 학생',zone:'hall',x:18,y:2,dir:'right',look:LOOK.xA,banmal:1,
  hide:()=>!!f().afterSchool,
  talk:()=>[{say:'방송부가 부원 모집한대. 봤어?'},{say:'목소리만 있으면 된대. 너 해 봐!'}]},
 xB:{chat:'xA',name:'2학년 학생',zone:'hall',x:19,y:2,dir:'left',look:LOOK.xB,banmal:1,
  hide:()=>!!f().afterSchool,
  talk:()=>[{say:'나? 싫어. 마이크 앞에 서면 얼어.',face:'sad'},{say:'노래는 노래방에서만 할래.'}]},
 xSenior:{name:'3학년 선배',zone:'hall',x:12,y:8,dir:'left',look:LOOK.xSenior,banmal:1,
  hide:()=>!!f().afterSchool,
  talk:()=>[{say:'…모의고사 끝나면 잘 거야.'},{say:'삼 일 동안. 아무도 깨우지 마.'}]},
 xWin:{name:'2학년 학생',zone:'hall',x:20,y:8,dir:'down',look:LOOK.xWin,banmal:1,
  hide:()=>!!f().afterSchool,
  talk:()=>[{say:'점심시간에 체육관은 잠겨 있어.'},{say:'근데 안에서 공 소리가 나. 이상하지?',face:'think'}]},
 xClean:{name:'청소 아주머니',zone:'hall',x:22,y:7,dir:'left',look:LOOK.cleaner,
  hide:()=>!f().afterSchool||!!f().nextDay,
  talk:()=>[{say:'학생, 아직 집에 안 갔어요?'},{say:'방송실은 늦게까지 불이 켜져 있네요.'}]},
 xBye:{name:'1학년 학생',zone:'hall',x:2,y:7,dir:'right',look:LOOK.xBye,
  hide:()=>!f().afterSchool||!!f().nextDay,
  talk:()=>[{say:'선배, 안녕히 가세요!'},{say:'저는 학원이요. 벌써 늦었어요!',face:'surprised'}]},
 xF:{name:'2학년 학생',zone:'hall',x:18,y:2,dir:'right',look:LOOK.xF,banmal:1,
  hide:()=>!f().nextDay,
  script:()=>f().done?[{say:'아까 그 노래 들었어? 소름!',face:'happy'}]:null,
  talk:()=>[{say:'오늘 점심에 방송한대. 진짜야?'}]},
 xG:{chat:'xF',name:'2학년 학생',zone:'hall',x:19,y:2,dir:'left',look:LOOK.xG,banmal:1,
  hide:()=>!f().nextDay,
  script:()=>f().done?[{say:'1학년이래. 목소리 진짜 좋다.'},{say:'처음엔 떨던데, 금방 괜찮아졌어.'}]:null,
  talk:()=>[{say:'스피커 고장 아니었어? 맨날 조용했잖아.'}]},
 xH:{name:'1학년 학생',zone:'hall',x:20,y:8,dir:'down',look:LOOK.xH,
  hide:()=>!f().nextDay,
  script:()=>f().done?[{say:'복도에서 다 같이 박수 쳤어요!',face:'happy'},{say:'저 심장이 아직 쿵쿵해요.'}]:null,
  talk:()=>[{say:'선배, 스피커에서 무슨 소리 나요?'},{say:'지지직… 아, 기대돼요.'}]},
 xI:{name:'3학년 선배',zone:'hall',x:12,y:8,dir:'left',look:LOOK.xI,banmal:1,
  hide:()=>!f().nextDay,
  script:()=>f().done?[{say:'…노래 좋더라. 고3도 귀는 있어.'}]:null,
  talk:()=>[{say:'점심 방송? 시끄럽지만 않으면 돼.'}]},
 xJ:{name:'옆 반 학생',zone:'hall',x:23,y:7,dir:'down',look:LOOK.xJ,banmal:1,
  hide:()=>!f().nextDay,
  script:()=>f().done?[{say:'방송 내일도 해? 매일 해?',face:'happy'}]:null,
  talk:()=>[{say:'방송실 앞에 사람이 많네. 무슨 일이야?'}]},

 xPE:{name:'체육 선생님',zone:'gym',x:6,y:10,dir:'up',look:LOOK.pe,
  hide:()=>!f().afterSchool||!!f().nextDay,
  talk:()=>[{say:'지금은 농구부 연습 시간이에요.'},{say:'구경은 괜찮아요. 공 조심해요!'}]},
 xBall1:{name:'2학년 학생',zone:'gym',x:2,y:6,dir:'left',look:LOOK.xBall1,banmal:1,
  hide:()=>!f().afterSchool||!!f().nextDay,
  talk:()=>[{say:'슛! …또 안 들어갔어.',face:'sad'},{say:'오늘 타이밍이 계속 안 맞아.'}]},
 xBall2:{name:'2학년 학생',zone:'gym',x:4,y:4,dir:'left',look:LOOK.xBall2,banmal:1,
  hide:()=>!f().afterSchool||!!f().nextDay,
  talk:()=>[{say:'야, 너도 한 번 던져 볼래?'},{say:'못 넣으면 아이스크림 쏘기. 하하, 장난이야.'}]},

 xS1:{name:'1학년 학생',zone:'street',x:4,y:3,dir:'right',look:LOOK.xS1,
  hide:()=>!f().afterSchool||!!f().nextDay,
  talk:()=>[{say:'선배, 문구점 닫았어요. 은행 갔대요.'}]},
 xS2:{chat:'xS1',name:'1학년 학생',zone:'street',x:5,y:3,dir:'left',look:LOOK.xS2,
  hide:()=>!f().afterSchool||!!f().nextDay,
  talk:()=>[{say:'펜 사야 되는데… 기다릴까요?',face:'think'},{say:'아니면 편의점 갈까요?'}]},
 xS3:{name:'2학년 학생',zone:'street',x:19,y:8,dir:'up',look:LOOK.xS3,banmal:1,
  hide:()=>!f().afterSchool||!!f().nextDay,
  talk:()=>[{say:'버스 또 늦어. 여기 버스는 항상 늦어.',face:'sad'}]},
 xS4:{name:'3학년 선배',zone:'street',x:21,y:3,dir:'up',look:LOOK.xS4,banmal:1,
  hide:()=>!f().afterSchool||!!f().nextDay,
  talk:()=>[{say:'편의점에 사람 너무 많다.'},{say:'삼각김밥 하나 사기도 힘드네.'}]},
};
const FOLLOW=null;

const INTRO=[{who:'…',say:'다음 날 점심시간. 방송실.'},{who:'…',say:'구름이 큰 종이를 들고 기다려요.'}];
const DONE=['2교시 끝!','사연함에 카세트가 하나 들어 있어요.','"1994 방송부 · 복숭아" 쪽지: "목소리 좋다. 다음은 이야기."','방송실 책상 위 복습 노트에서 단어를 다시 볼 수 있어요.'];

function questText(){
 const F=f();
 if(F.done)return '2교시 끝 · 방송실 복습 노트';
 if(!F.poster)return '방송실 · 구름이랑 얘기하기';
 if(!F.metHari)return '음악실 · 노래하는 사람 찾기';
 if(!F.knowHari)return '교무실 · 명찰 보여 드리기';
 if(!F.chanGym)return '체육관 · 명찰 주인 찾기';
 if(!F.stoodUp)return '체육관 · 선배들 말리기';
 if(!F.afterSchool)return '체육관 · 하리한테 명찰 주기';
 if(!F.hariGiveUp)return '분식집 · 하리 얘기 듣기';
 if(!F.joke)return '분식집 · 분위기 바꾸기';
 if(!F.hariMaybe)return '분식집 · 다온이랑 얘기하기';
 if(!F.nextDay)return '방송실 · 구름한테 얘기하기';
 if(!F.ready)return '방송실 · 방송 준비하기';
 return '방송실 · 하리 응원하기';
}

/* ---------- school tiles (shared look with 1교시) ---------- */
const WALLISH=new Set([...SCHOOL_WALLISH,'wall','board','timetable','sideWin','streetWin','hallWin','classWin','notice','speaker','classDoor','exitDoor','bcDoor','menu','rack','onair','poster','lockers','shoes','stairs',
 'sayeon','musicDoor','gymDoor','staffBoard','portraits','gymWin','hoop']);
const wallish=(x,y)=>{const c=at(x,y);if(c==null)return true;const L=Z.legend[c];return !!L&&WALLISH.has(L.tile)};
function face(X,Y){const B=ZID==='bunsik',G=ZID==='gym';r(X,Y,16,16,B?'#F2D6A8':'#EDE3CF');r(X,Y,16,1,B?'#FAE6C4':'#F8F2E6');
 r(X,Y+11,16,5,B?'#C8643A':G?'#5A8FB0':'#8FB8A0');r(X,Y+11,16,1,B?'#DE8058':G?'#7AAFD0':'#B1D3BE');r(X,Y+15,16,1,B?'#A04A28':G?'#3E6E90':'#6E9A82')}
function cap(X,Y,x,y){r(X,Y,16,16,'#6B6157');r(X,Y,16,1,'#81766A');r(X,Y+15,16,1,'#5A5148');if(hash(x,y)<25)r(X+3+hash(y,x)%9,Y+5+hash(x,y)%6,2,1,'#74695E')}
function woodF(X,Y,x,y){r(X,Y,16,16,'#C99A62');for(let j=3;j<16;j+=4)r(X,Y+j,16,1,'#B5854F');const h=hash(x,y);r(X+(h%12)+2,Y+(h%4)*4,1,3,'#B5854F');r(X+(h*7%13),Y+((h>>2)%4)*4+1,2,1,'#D6AA74')}
function hallF(X,Y,x,y){r(X,Y,16,16,'#C9CCC0');r(X,Y,16,1,'#B9BCB0');r(X,Y,1,16,'#B9BCB0');const h=hash(x,y);r(X+h%13+1,Y+(h>>3)%13+1,1,1,'#A9AD9F');r(X+(h*3)%14+1,Y+(h*7)%14+1,1,1,'#DCDED4')}
function checkF(X,Y,x,y){r(X,Y,16,16,'#D8D2C2');r(X,Y,8,8,'#CBC4B2');r(X+8,Y+8,8,8,'#CBC4B2')}
function oldF(X,Y,x,y){r(X,Y,16,16,'#8E6E4E');for(let j=3;j<16;j+=5)r(X,Y+j,16,1,'#7A5C40');const h=hash(x,y);r(X+h%14,Y+(h>>2)%14,2,1,'#A58A6C');if(h<30)r(X+(h*5)%13,Y+(h*3)%13,1,1,'#B9A488')}
function tileF(X,Y){r(X,Y,16,16,'#ECE2D0');r(X,Y,8,8,'#DFD0B8');r(X+8,Y+8,8,8,'#DFD0B8');r(X,Y,16,1,'#F6EEE0')}
function paveF(X,Y,x,y){r(X,Y,16,16,'#C9C6BC');r(X,Y,16,1,'#B3B0A6');r(X,Y+8,16,1,'#B3B0A6');r(X+(y%2?4:12),Y,1,8,'#B3B0A6');r(X+(y%2?12:4),Y+8,1,8,'#B3B0A6');
 const h=hash(x,y);if(h<30)r(X+h%13+1,Y+(h>>2)%6+1,2,1,'#D8D5CC')}
function courtF(X,Y,x,y){r(X,Y,16,16,'#D6A466');for(let j=3;j<16;j+=4)r(X,Y+j,16,1,'#C99556');const h=hash(x,y);r(X+(h%12)+2,Y+(h%4)*4+1,3,1,'#E2B477');
 if(x>=2&&x<=21&&y>=2&&y<=9){const L='#F4F1E6';
  if(y===2)r(X,Y,16,1,L);if(y===9)r(X,Y+15,16,1,L);if(x===2)r(X,Y,1,16,L);if(x===21)r(X+15,Y,1,16,L);if(x===11)r(X+15,Y,1,16,L);if(x===12)r(X,Y,1,16,L);
  if(x>=10&&x<=13&&y>=4&&y<=7)inTile(X,Y,()=>{g.strokeStyle=L;g.lineWidth=1;g.beginPath();g.arc(X-(x-12)*16,Y-(y-6)*16,22,0,Math.PI*2);g.stroke()})}}
function inTile(X,Y,fn){g.save();g.beginPath();g.rect(X,Y,16,16);g.clip();fn();g.restore()}
const disc=(cx,cy,rad,c)=>{g.fillStyle=c;g.beginPath();g.arc(cx,cy,rad,0,Math.PI*2);g.fill()};
const floorOf=(X,Y,x,y)=>ZID==='bcast'?oldF(X,Y,x,y):ZID==='music'?woodF(X,Y,x,y):ZID==='gym'?courtF(X,Y,x,y):ZID==='bunsik'?tileF(X,Y):checkF(X,Y,x,y);
const SHOP=x=>x===7||x===16?-1:x<7?0:x<16?1:2;
const SHOPC=[['#4F7AA8','#6E96C2','#3A5E86'],['#C8443A','#E0655A','#9A3028'],['#3F8F5A','#5DB070','#2E6E44']];

const TILES={...SCHOOL_TILES,
 wall:(X,Y,x,y)=>{if(!wallish(x,y+1)||(y===MH-1&&!wallish(x,y-1)))face(X,Y);else cap(X,Y,x,y)},
 wood:(X,Y,x,y)=>woodF(X,Y,x,y),
 hallFloor:(X,Y,x,y)=>hallF(X,Y,x,y),
 checkFloor:(X,Y,x,y)=>checkF(X,Y,x,y),
 oldFloor:(X,Y,x,y)=>oldF(X,Y,x,y),
 tileFloor:(X,Y)=>tileF(X,Y),
 court:(X,Y,x,y)=>courtF(X,Y,x,y),
 doorway:(X,Y,x,y)=>{checkF(X,Y,x,y);r(X,Y,2,16,'#A9794A');r(X+14,Y,2,16,'#A9794A');r(X+2,Y,12,2,'#B9BCB0')},
 exitDoor:(X,Y,x,y)=>{floorOf(X,Y,x,y);r(X,Y,16,16,'#6E7B88');r(X+1,Y+1,14,15,'#BFE3F0');r(X+2,Y+2,3,1,'#E6F6FC');const L=at(x-1,y)!==at(x,y);r(L?X+15:X,Y,1,16,'#6E7B88');r(L?X+12:X+3,Y+8,1,3,'#3A4046')},
 /* 방송실 (hub) */
 terminal:(X,Y,x,y,t)=>{oldF(X,Y,x,y);r(X+1,Y+9,14,3,'#6E4A2E');r(X+1,Y+9,14,1,'#8A6040');r(X+2,Y+12,2,4,'#4A3020');r(X+12,Y+12,2,4,'#4A3020');
  r(X+2,Y+3,12,6,'#3E6B8A');r(X+3,Y+4,5,4,'#F4F1E6');r(X+8,Y+4,5,4,'#F4F1E6');r(X+8,Y+3,1,6,'#2B4D66');  // the 복습 노트, open: blue cover, two pages
  r(X+4,Y+5,3,1,'#9AA3AD');r(X+4,Y+7,3,1,'#9AA3AD');r(X+9,Y+5,3,1,'#9AA3AD');r(X+9,Y+7,3,1,'#9AA3AD');r(X+12,Y+2,1,4,'#E8962A');
  const due=state&&dueWords().length>0;if(due){const on=Math.floor(t/350)%2;r(X+11,Y,4,4,on?'#F2C46B':'#E8962A');r(X+12,Y+1,2,2,on?'#FFF3C4':'#F2C46B')}},
 sayeon:(X,Y,x,y)=>{face(X,Y);r(X+3,Y+1,10,10,'#C98F5A');r(X+3,Y+1,10,2,'#E3B07A');r(X+5,Y+4,6,1,'#3E2A1A');r(X+5,Y+6,6,3,'#F4F1E6');r(X+6,Y+7,4,1,'#E86D8A');
  if(state.f.done){r(X+6,Y+2,4,2,'#2B2E36');r(X+7,Y+2,2,1,'#F2A38A')}},
 rack:(X,Y,x,y)=>{face(X,Y);r(X,Y+1,16,14,'#6B4A2E');r(X+1,Y+2,14,5,'#3E2A1A');r(X+1,Y+8,14,5,'#3E2A1A');const h=hash(x,y),C=['#E3ECE4','#F2C46B','#E07A5A','#5A8FB0','#B9C1C9'];
  for(let i=0;i<7;i++){r(X+1+i*2,Y+3,1,4,C[(h+i)%5]);r(X+1+i*2,Y+9,1,4,C[(h+i*3)%5])}},
 onair:(X,Y,x,y,t)=>{face(X,Y);r(X+2,Y+3,12,6,'#2B2E36');const on=(state.f.done&&Math.floor(t/700)%3===0)||(!!state.f.onAir&&!state.f.done);r(X+3,Y+4,10,4,on?'#E85A4A':'#5A2E2E');r(X+5,Y+5,6,1,on?'#FFD0C8':'#6E3A3A')},
 poster:(X,Y,x,y)=>{face(X,Y);const L=at(x-1,y)!=='O';r(X+(L?1:0),Y+1,L?15:14,12,'#6B4A2E');r(X+(L?2:0),Y+2,L?14:13,10,'#F2BFA0');r(X+(L?2:0),Y+2,L?14:13,1,'#F7D6C0');
  if(L){r(X+7,Y+3,4,5,'#5A5F6E');r(X+8,Y+4,2,3,'#8E94A0');r(X+8,Y+8,2,3,'#5A5F6E')}else{r(X+1,Y+3,9,1,'#C49A6C');r(X+1,Y+5,7,1,'#C49A6C');r(X+1,Y+8,10,1,'#E0A890')}},
 hallWin:(X,Y,x,y,t)=>{face(X,Y);r(X+1,Y+1,14,10,'#F8F2E6');r(X+2,Y+2,12,8,'#A9D8EC');const s=Math.round(Math.sin(t/1100+x));
  if(ZID==='bunsik'){r(X+2,Y+7,12,3,'#C9C6BC');r(X+3,Y+4,3,3,'#6FA86A');r(X+10,Y+3,1,4,'#3E4350')}else{r(X+2,Y+6+s,12,4-s,'#6FA86A');r(X+5,Y+5+s,4,2,'#86BE7C')}
  r(X+8,Y+2,1,8,'#F8F2E6');r(X+3,Y+3,2,1,'#E6F6FC');if(ZID==='bcast'){g.fillStyle='rgba(180,170,150,.45)';g.fillRect(X+2,Y+2,12,8)}},
 mixer:(X,Y,x,y,t)=>{oldF(X,Y,x,y);r(X,Y+3,16,10,'#3A3E48');r(X,Y+3,16,2,'#535866');r(X,Y+12,16,1,'#22252C');const live=state.f.ready&&!state.f.done;
  for(let i=0;i<4;i++){r(X+2+i*4,Y+6,1,5,'#1E2128');r(X+1+i*4,Y+7+(hash(x+i,y)%3),3,2,'#B9C1C9');r(X+2+i*4,Y+4,1,1,live&&(Math.floor(t/200)+i)%3?'#7CF07A':'#4A2A2A')}r(X+3,Y+3,3,1,'#8A8E96');r(X+10,Y+4,2,1,'#8A8E96');
  if(x===3)r(X+1,Y+9,6,2,'#F2C46B')},
 micStand:(X,Y,x,y)=>{oldF(X,Y,x,y);r(X+7,Y+6,2,9,'#2B2E36');r(X+4,Y+14,8,2,'#2B2E36');r(X+5,Y,6,7,'#5A5F6E');r(X+6,Y+1,4,4,'#8E94A0');r(X+6,Y+2,4,1,'#6E747E');r(X+6,Y+4,4,1,'#6E747E')},
 oldSofa:(X,Y,x,y)=>{oldF(X,Y,x,y);let ox=x,oy=y,ex=x,ey=y;while(at(ox-1,y)==='s')ox--;while(at(x,oy-1)==='s')oy--;while(at(ex+1,y)==='s')ex++;while(at(x,ey+1)==='s')ey++;
  const bx=X-(x-ox)*16,by=Y-(y-oy)*16,W=(ex-ox+1)*16-3,H=(ey-oy+1)*16-2,mid=by+(H/2|0);
  const box=(x0,y0,w,h,c)=>{r(x0+1,y0,w-2,h,c);r(x0,y0+1,w,h-2,c)};   // a rectangle with its corners rounded off
  inTile(X,Y,()=>{ // one old sofa seen from above, its back against the wall on the left
   box(bx+3,by+3,W,H,'rgba(0,0,0,.25)');box(bx,by,W,H,'#2E2438');                              // shadow, outline
   box(bx+1,by+1,9,H-2,'#4E3D5C');r(bx+8,by+2,1,H-4,'#6A5680');                                  // backrest
   box(bx+1,by+1,W-2,7,'#5F4B72');box(bx+1,by+H-8,W-2,7,'#5F4B72');                             // armrests
   r(bx+2,by+2,W-5,1,'#7E6A96');r(bx+2,by+H-7,W-5,1,'#7E6A96');
   const cw=W-12,c1=by+8,c2=mid+1,h1=mid-c1,h2=by+H-8-c2;
   box(bx+10,c1,cw,h1,'#A893C0');box(bx+10,c2,cw,h2,'#A893C0');                                 // two puffy seat cushions
   r(bx+11,c1+1,cw-3,1,'#C4B4D8');r(bx+11,c2+1,cw-3,1,'#C4B4D8');                               // highlights
   r(bx+11,c1+h1-2,cw-2,1,'#8A75A3');r(bx+11,c2+h2-2,cw-2,1,'#8A75A3');                         // underside shading
   r(bx+16,c2+3,5,2,'#E7DDF0');r(bx+14,c2+3,9,1,'#E2D3A6');r(bx+15,c2+5,7,1,'#E2D3A6')})}, // an old tear, taped
 tapeCart:(X,Y,x,y)=>{oldF(X,Y,x,y);r(X+1,Y+3,14,11,'#4A4E5A');r(X+1,Y+3,14,1,'#646A78');disc(X+5,Y+7,3,'#22252C');disc(X+11,Y+7,3,'#22252C');disc(X+5,Y+7,1,'#B9C1C9');disc(X+11,Y+7,1,'#B9C1C9');r(X+3,Y+11,10,1,'#8A8E96');r(X+2,Y+14,2,2,'#22252C');r(X+12,Y+14,2,2,'#22252C')},
 boxes:(X,Y,x,y)=>{oldF(X,Y,x,y);r(X+1,Y+5,14,10,'#B98E58');r(X+1,Y+5,14,2,'#D2A970');r(X+7,Y+5,2,10,'#E3C99A');r(X+1,Y+14,14,1,'#8A6A40');
  if(hash(x,y)%2){r(X+3,Y,10,6,'#A67E4A');r(X+3,Y,10,1,'#C49A6C');r(X+5,Y+2,6,2,'#F4F1E6')}},
 /* corridor */
 notice:(X,Y,x,y)=>{face(X,Y);const L=at(x-1,y)!=='N';r(X+(L?1:0),Y+1,15,10,'#8A5E36');r(X+(L?2:0),Y+2,14,8,'#C49A6C');
  if(L){r(X+3,Y+3,5,6,'#F4F1E6');r(X+9,Y+4,4,4,'#F2C46B');r(X+5,Y+3,1,1,'#D2533F')}else if(state.f.poster&&ZID==='hall'){r(X+1,Y+2,10,8,'#F7F3E8');r(X+2,Y+3,8,2,'#5A8FB0');r(X+4,Y+6,3,3,'#5A5F6E');r(X+8,Y+6,2,1,'#C9C2B0')}
  else{r(X+1,Y+3,6,4,'#BFE3F0');r(X+8,Y+3,4,6,'#F4F1E6')}},
 classWin:(X,Y,x,y)=>{face(X,Y);r(X+1,Y+1,14,9,'#F8F2E6');r(X+2,Y+2,12,7,'#C9D6CC');const M=ZID==='hall2'&&x<=4;  // the 음악실's windows (2층) look in on the piano; the rest on desks
  if(M){r(X+3,Y+5,6,3,'#22252C');r(X+3,Y+5,6,1,'#3A3E48')}else{r(X+3,Y+6,4,2,'#C99A62');r(X+9,Y+6,4,2,'#C99A62')}r(X+8,Y+2,1,7,'#F8F2E6');
  if(M&&state.f.poster&&!state.f.metHari){r(X+11,Y+2,1,3,'#2B2E36');r(X+10,Y+4,2,1,'#2B2E36')}},
 musicDoor:(X,Y,x,y)=>{face(X,Y);const L=at(x-1,y)!=='U';r(X+(L?2:0),Y+2,14,14,'#A9794A');r(X+(L?2:0),Y+2,14,1,'#C4925F');r(X+(L?5:3),Y+5,6,4,'#BFE3F0');r(X+(L?6:4),Y+6,2,1,'#E6F6FC');
  r(L?X+14:X+1,Y+10,1,3,'#5A3E26');if(L){r(X+10,Y,6,2,'#E86D8A')}else{r(X,Y,6,2,'#E86D8A');r(X+8,Y+12,2,2,'#3E2A1A');r(X+9,Y+9,1,4,'#3E2A1A');r(X+10,Y+9,2,1,'#3E2A1A')}},
 gymDoor:(X,Y,x,y)=>{face(X,Y);const L=at(x-1,y)!=='G';r(X+(L?2:0),Y+2,14,14,'#4F7A5E');r(X+(L?2:0),Y+2,14,1,'#6E9A7A');r(X+(L?4:2),Y+4,8,4,'#BFE3F0');r(X+(L?5:3),Y+5,2,1,'#E6F6FC');
  r(L?X+14:X+1,Y+9,1,3,'#2B3A30');if(L)r(X+10,Y,6,2,'#E8962A');else r(X,Y,6,2,'#E8962A')},
 speaker:(X,Y,x,y,t)=>{face(X,Y);r(X+4,Y+1,8,7,'#D8D4CA');r(X+4,Y+1,8,1,'#ECE9E1');r(X+4,Y+8,8,1,'#9A968C');for(let i=0;i<3;i++)for(let j=0;j<2;j++)r(X+5+i*2,Y+3+j*2,1,1,'#7A766C');
  if(state.f.done){const p=Math.floor(t/250)%3;r(X+13,Y+3,1,3,p>0?'#E8962A':'#EDE3CF');r(X+14+(p>1?1:0),Y+2,1,5,p>1?'#E8962A':'#EDE3CF');r(X+2,Y+3,1,3,p>0?'#E8962A':'#EDE3CF')}},
 cabinet:(X,Y,x,y)=>{checkF(X,Y,x,y);r(X+1,Y+1,14,15,'#9AA3AD');r(X+1,Y+1,14,1,'#B9C1C9');[5,10].forEach(b=>r(X+2,Y+b,12,1,'#7A838D'));[3,8,13].forEach(b=>r(X+7,Y+b,2,1,'#5A626B'))},
 water:(X,Y,x,y)=>{floorOf(X,Y,x,y);r(X+4,Y+4,8,12,'#F2F0EA');r(X+4,Y+15,8,1,'#C9C6BC');r(X+5,Y,6,5,'#8FC8E8');r(X+6,Y+1,1,3,'#C4E6F6');r(X+6,Y+8,1,2,'#D2533F');r(X+9,Y+8,1,2,'#3A86C8');r(X+5,Y+11,6,1,'#9A968C')},
 plant:(X,Y,x,y)=>{floorOf(X,Y,x,y);r(X+5,Y+10,6,6,'#B5653A');r(X+5,Y+10,6,1,'#D07E52');r(X+3,Y+3,10,7,'#3F8F4A');r(X+5,Y+1,6,3,'#3F8F4A');r(X+5,Y+3,2,2,'#6CC07A');r(X+10,Y+6,2,2,'#6CC07A');
  if(ZID==='bunsik'){r(X+4,Y+5,1,2,'#D8442A');r(X+9,Y+3,1,2,'#D8442A');r(X+11,Y+7,1,2,'#D8442A')}},
 odesk:(X,Y,x,y)=>{checkF(X,Y,x,y);r(X,Y+4,16,10,'#8C96A0');r(X,Y+4,16,3,'#B9C2CA');r(X,Y+13,16,1,'#6A737C');const h=hash(x,y);
  if(h%2){r(X+4,Y,8,6,'#2B3238');r(X+5,Y+1,6,4,'#69CFD8');r(X+7,Y+6,2,1,'#2B3238')}else{r(X+2,Y+3,6,4,'#F4F1E6');r(X+3,Y+2,6,4,'#FFFFFF');r(X+11,Y+2,3,4,'#C8443A')}},
 shoes:(X,Y,x,y)=>{face(X,Y);r(X,Y,16,16,'#B9905E');r(X,Y,16,1,'#D2A970');const h=hash(x,y);
  for(let i=0;i<3;i++)for(let j=0;j<2;j++){r(X+1+j*8,Y+1+i*5,6,4,'#7E5A34');if((h+i+j)%4)r(X+2+j*8,Y+3+i*5,4,2,(h+i)%3?'#F2F0EA':'#5A8FB0')}
  if(x===3)r(X+10,Y+8,4,2,'#3F7D5A')},
 stairs:(X,Y,x,y)=>{r(X,Y,16,16,'#B8BCB0');for(let j=0;j<16;j+=4){r(X,Y+j,16,1,'#8E9286');r(X,Y+j+1,16,1,'#D2D6CA')}if(at(x-1,y)!=='S')r(X,Y,2,16,'#7A5A3A');if(at(x+1,y)!=='S')r(X+14,Y,2,16,'#7A5A3A')},
 bcDoor:(X,Y,x,y,t)=>{face(X,Y);const L=at(x-1,y)!=='Q',on=(state.f.ready&&!state.f.done)||(state.f.done&&Math.floor(t/500)%2);  // two-leaf door, ON AIR lamp over the middle
  r(X+(L?1:0),Y+1,15,15,'#2B2E36');r(X+(L?2:0),Y+2,L?14:13,14,'#4A5672');r(X+(L?2:0),Y+2,L?14:13,1,'#62708E');r(L?X+15:X,Y+2,1,14,'#2B2E36');
  r(X+(L?5:3),Y+4,6,4,'#BFE3F0');r(X+(L?6:4),Y+5,2,1,'#E6F6FC');r(L?X+13:X+2,Y+9,1,3,'#C9D2DA');
  if(L)r(X+11,Y,5,2,on?'#E85A4A':'#6A3A36');else r(X,Y,4,2,on?'#E85A4A':'#6A3A36');
  if(at(x+1,y)!=='Q'&&state.f.poster){r(X+4,Y+9,8,6,'#F7F3E8');  /* the poster on the last (or only) leaf */r(X+5,Y+10,6,2,'#5A8FB0');r(X+7,Y+13,2,1,'#5A5F6E')}},
 /* 음악실 */
 sideWin:(X,Y,x,y,t)=>{cap(X,Y,x,y);r(X+4,Y,8,16,'#EDE3CF');r(X+5,Y,6,16,'#A9D8EC');r(X+6,Y,1,16,'#D6F0FA');r(X+5,Y+15,6,1,'#EDE3CF');
  if(hash(x,y)%3===0){const s=Math.round(Math.sin(t/900+y));r(X+8+s,Y+4,3,3,'#6FA86A')}if(y%4===1)r(X+5,Y,6,4,'#F2E2B0')},
 staffBoard:(X,Y,x,y)=>{face(X,Y);const L=at(x-1,y)!=='M',R=at(x+1,y)!=='M',a=L?2:0,w=16-a-(R?2:0);r(X,Y+1,16,11,'#8A5E36');r(X+a,Y+2,w,9,'#F7F3E8');
  for(let i=0;i<5;i++)r(X+a,Y+3+i*2,w,1,'#AEB6C6');const h=hash(x,y);if(L){r(X+4,Y+2,2,9,'#2B2E36');r(X+6,Y+4,1,2,'#2B2E36')}else{r(X+2+h%9,Y+6+(h%3),3,2,'#2B2E36');r(X+4+h%9,Y+2+(h%3),1,5,'#2B2E36');if(h%2)r(X+9,Y+4,2,2,'#2B2E36')}
  r(X,Y+12,16,1,'#B98E58')},
 portraits:(X,Y,x,y)=>{face(X,Y);const wig=at(x-1,y)!=='J';r(X+3,Y+1,10,11,'#C9A13A');r(X+4,Y+2,8,9,'#5A4A3A');r(X+5,Y+3,6,4,wig?'#F4F4F4':'#2B2422');r(X+4,Y+5,2,4,wig?'#F4F4F4':'#5A4A3A');r(X+10,Y+5,2,4,wig?'#F4F4F4':'#5A4A3A');
  r(X+6,Y+5,4,4,'#E6BE9C');r(X+5,Y+9,6,2,'#2C3E63');r(X+7,Y+9,2,1,'#F4F1E6')},
 piano:(X,Y,x,y)=>{woodF(X,Y,x,y);const L=at(x-1,y)!=='P',R=at(x+1,y)!=='P';r(X,Y+1,16,13,'#22252C');r(X,Y+1,16,3,'#3A3E48');r(X,Y+1,16,1,'#5A5F6E');
  r(X,Y+9,16,4,'#F4F1E6');[1,3,6,8,10,13].forEach(i=>r(X+i,Y+9,1,2,'#22252C'));if(L)r(X,Y+1,1,13,'#111318');if(R)r(X+15,Y+1,1,13,'#111318');
  if(!L&&!R){r(X+3,Y+2,10,6,'#F7F3E8');for(let i=0;i<3;i++)r(X+4,Y+3+i*2,8,1,'#AEB6C6')}r(X,Y+13,16,1,'#111318')},
 mstand:(X,Y,x,y)=>{woodF(X,Y,x,y);r(X+7,Y+8,2,7,'#2B2E36');r(X+4,Y+14,8,2,'#2B2E36');r(X+3,Y+1,10,7,'#F7F3E8');r(X+3,Y+7,10,1,'#2B2E36');r(X+4,Y+3,8,1,'#AEB6C6');r(X+4,Y+5,6,1,'#AEB6C6');r(X+6,Y+4,2,2,'#2B2E36')},
 chair:(X,Y,x,y)=>{woodF(X,Y,x,y);r(X+3,Y+3,10,7,'#5A8FB0');r(X+3,Y+3,10,1,'#7AAFD0');r(X+3,Y+10,10,3,'#3E6E90');r(X+3,Y+13,1,3,'#6F757C');r(X+12,Y+13,1,3,'#6F757C');
  if(hash(x,y)<15)r(X+5,Y+5,6,1,'#F4F1E6')},
 drums:(X,Y,x,y)=>{woodF(X,Y,x,y);if(at(x-1,y)!=='d'){r(X+4,Y+3,1,10,'#8A8E96');disc(X+4,Y+3,4,'#E8B93A');disc(X+4,Y+3,1,'#F7D98C');disc(X+11,Y+10,4,'#C8443A');disc(X+11,Y+10,3,'#F4F1E6')}
  else{disc(X+7,Y+9,6,'#C8443A');disc(X+7,Y+9,5,'#F4F1E6');r(X+6,Y+8,2,2,'#B8433A');disc(X+13,Y+3,3,'#E8B93A')}},
 shelf:(X,Y,x,y)=>{woodF(X,Y,x,y);r(X,Y+1,16,14,'#8A5E36');r(X+1,Y+2,14,5,'#5A3A20');r(X+1,Y+8,14,6,'#5A3A20');for(let i=0;i<4;i++)r(X+2+i*3,Y+2,1,5,i%2?'#F4F1E6':'#E8D9A8');
  if(at(x-1,y)!=='x'){disc(X+8,Y+11,3,'#E0A060');r(X+8,Y+8,1,3,'#7A5230')}else{disc(X+7,Y+11,3,'#C9A13A');disc(X+7,Y+11,2,'#5A3A20')}},
 /* 체육관 */
 gymWin:(X,Y,x,y)=>{face(X,Y);r(X+1,Y+1,14,9,'#F8F2E6');r(X+2,Y+2,12,7,'#BFE3F0');r(X+8,Y+2,1,7,'#F8F2E6');r(X+2,Y+5,12,1,'#F8F2E6');for(let i=2;i<14;i+=3)r(X+i,Y+2,1,7,'rgba(90,95,110,.25)');r(X+3,Y+3,2,1,'#E6F6FC')},
 hoop:(X,Y,x,y)=>{cap(X,Y,x,y);const Lw=x===0;r(Lw?X+9:X+3,Y+1,4,14,'#F4F1E6');r(Lw?X+9:X+3,Y+1,4,1,'#C9C6C2');r(Lw?X+9:X+3,Y+6,4,4,'#D2533F');r(Lw?X+10:X+4,Y+7,2,2,'#F4F1E6');
  r(Lw?X+13:X+1,Y+7,2,2,'#E8762A');r(Lw?X+13:X+1,Y+9,2,4,'#F4F1E6')},
 mat:(X,Y,x,y)=>{courtF(X,Y,x,y);const T=at(x,y-1)!=='m',L=at(x-1,y)!=='m';r(X,Y,16,16,'#3E6FA8');if(T)r(X,Y,16,2,'#5A8CC4');if(L)r(X,Y,2,16,'#4A7CB4');r(X,Y+15,16,1,'#2E5A8C');r(X+15,Y,1,16,'#2E5A8C');r(X+6,Y+7,4,1,'#2E5A8C')},
 /* the 방송실's windows face the street, not the yard: STREET (below) seen through dusty glass. They are in the east wall, so the
    view is turned like the wall: ART.rot(…,1) puts its sky at the outer edge and its road at the room edge; each tile down the
    wall shows the next 16px of it. */
 streetWin:(X,Y,x,y,t)=>{cap(X,Y,x,y);r(X+3,Y,10,16,'#E2D8C2');r(X+4,Y,8,16,'#B4C3C6');  // a wider pane than sideWin: 8px of view
  const v=STREET.east||(STREET.east=ART.rot(STREET.rows,1)),o=(y%4)*16;ART.put(v.slice(o,o+16),STREET.pal,X+4,Y);
  r(X+4,Y+3,1,1,'#D5DCDC');r(X+9,Y+11,1,1,'#D5DCDC')},
 ballCart:(X,Y,x,y)=>{courtF(X,Y,x,y);r(X+1,Y+4,14,10,'#8A8E96');r(X+2,Y+5,12,8,'#5A5F6E');const h=hash(x,y),took=state.f.stoodUp;  // after "선배들이 공을 들고 나갔어요": one ball left
  if(!took)disc(X+5,Y+7,3,h%2?'#E8762A':'#F2F0EA');disc(X+11,Y+8,3,'#E8762A');if(!took)disc(X+8,Y+5,3,h%2?'#F2F0EA':'#E8762A');
  r(X+4,Y+7,3,1,'#9A4A1A');r(X+2,Y+14,2,2,'#2B2E36');r(X+12,Y+14,2,2,'#2B2E36')},
 bleacher:(X,Y,x,y)=>{r(X,Y,16,7,'#C99556');r(X,Y,16,1,'#E2B477');r(X,Y+7,16,1,'#7A5230');r(X,Y+8,16,7,'#B5854F');r(X,Y+8,16,1,'#D6A466');r(X,Y+15,16,1,'#7A5230');
  if(at(x-1,y)!=='b')r(X,Y,1,16,'#7A5230');if(at(x+1,y)!=='b')r(X+15,Y,1,16,'#7A5230');if(hash(x,y)<12)r(X+6,Y+2,3,4,'#5A8FB0')},
 /* 학교 앞 */
 roof:(X,Y,x,y)=>{const s=SHOP(x);if(s<0)return TILES.brick(X,Y,x,y);const [c,l,d]=SHOPC[s];r(X,Y,16,16,c);for(let j=2;j<12;j+=4)r(X,Y+j,16,1,l);r(X,Y+12,16,4,d);
  for(let i=0;i<16;i+=4)r(X+i,Y+12,2,4,'#F4F1E6')},
 sign:(X,Y,x,y)=>{const s=SHOP(x);if(s<0)return TILES.brick(X,Y,x,y);const [c,l,d]=SHOPC[s];r(X,Y,16,16,'#E9E1D0');r(X,Y+2,16,11,c);r(X,Y+2,16,1,l);r(X,Y+12,16,1,d);
  if(SHOP(x-1)!==s)r(X,Y+2,1,11,d);if(SHOP(x+1)!==s)r(X+15,Y+2,1,11,d);const mid=[3,11,20][s];
  if(x===mid){if(s===0){r(X+3,Y+6,9,3,'#F2C46B');r(X+12,Y+6,2,3,'#F2A38A');r(X+2,Y+7,1,1,'#2B2E36')}else if(s===1){r(X+3,Y+9,10,2,'#2B2E36');r(X+4,Y+5,8,4,'#E8762A');r(X+5,Y+6,3,1,'#F7F3E8');r(X+9,Y+7,2,1,'#F7F3E8')}else{r(X+3,Y+5,4,6,'#F7F3E8');r(X+9,Y+5,4,6,'#F7F3E8');r(X+4,Y+6,2,2,c);r(X+10,Y+8,2,2,c)}}
  else if((x+s)%2===0){r(X+3,Y+5,4,5,'#F7F3E8');r(X+9,Y+5,4,5,'#F7F3E8');r(X+4,Y+6,2,3,c);r(X+10,Y+7,2,2,c)}},
 shopWin:(X,Y,x,y,t)=>{const s=SHOP(x);r(X,Y,16,16,'#E9E1D0');r(X+1,Y+1,14,12,'#3E4350');r(X+2,Y+2,12,10,'#A9D8EC');r(X+3,Y+3,2,1,'#E6F6FC');const h=hash(x,y);
  if(s===0){r(X+3,Y+7,3,4,'#E86D8A');r(X+7,Y+6,3,5,'#5A8FB0');r(X+11,Y+8,2,3,'#F2C46B')}
  else if(s===1){r(X+3,Y+8,10,3,'#2B2E36');r(X+4,Y+7,8,2,'#D8442A');const w=Math.round(Math.sin(t/400+x)*1.5);g.fillStyle='rgba(255,255,255,.6)';g.fillRect(X+6+w,Y+3,2,3);g.fillRect(X+9-w,Y+4,2,2)}
  else{for(let j=0;j<2;j++){r(X+2,Y+6+j*3,12,1,'#8A8E96');for(let i=0;i<4;i++)r(X+3+i*3,Y+4+j*3,2,2,['#E8762A','#F2C46B','#E86D8A','#7CB46A'][(h+i+j)%4])}}
  r(X,Y+13,16,3,'#B9AE98')},
 closedDoor:(X,Y,x,y)=>{r(X,Y,16,16,'#E9E1D0');r(X+2,Y+1,12,15,'#6E7B88');r(X+3,Y+2,10,10,'#8FA8B8');r(X+5,Y+5,6,3,'#F4F1E6');r(X+6,Y+6,4,1,'#C8443A');r(X+11,Y+10,1,2,'#2B2E36')},
 shopDoor:(X,Y,x,y)=>{paveF(X,Y,x,y);r(X,Y,16,16,'#E9E1D0');r(X+2,Y+1,12,15,'#5A3E26');r(X+3,Y+2,10,14,'#BFE3F0');r(X+4,Y+4,2,6,'#E6F6FC');r(X+2,Y+1,12,5,'#C8443A');
  for(let i=5;i<14;i+=3)r(X+i,Y+1,1,5,'#9A3028');r(X+11,Y+9,1,3,'#2B2E36')},
 brick:(X,Y,x,y)=>{r(X,Y,16,16,'#A8644A');for(let j=3;j<16;j+=4){r(X,Y+j,16,1,'#8E5038');const o=(j>>2)%2?4:0;r(X+o,Y+j-3,1,3,'#8E5038');r(X+o+8,Y+j-3,1,3,'#8E5038')}},
 pave:(X,Y,x,y)=>paveF(X,Y,x,y),
 road:(X,Y,x,y)=>{r(X,Y,16,16,'#4A4E56');const h=hash(x,y);if(h<40)r(X+h%13+1,Y+(h>>2)%12+2,1,1,'#5A5E66');
  if(y===5){r(X,Y,16,2,'#9A968C');r(X,Y+15,16,1,'#E8B93A')}else{r(X,Y+14,16,2,'#9A968C');r(X,Y,16,1,'#E8B93A')}},
 crosswalk:(X,Y,x,y)=>{r(X,Y,16,16,'#4A4E56');for(let i=1;i<16;i+=5)r(X+i,Y,3,16,'#F4F1E6');if(y===5)r(X,Y,16,2,'#9A968C');else r(X,Y+14,16,2,'#9A968C')},
 lamp:(X,Y,x,y)=>{paveF(X,Y,x,y);r(X+7,Y+3,2,12,'#3E4350');r(X+5,Y+14,6,2,'#2B2E36');r(X+4,Y,8,3,'#2B2E36');r(X+5,Y+2,6,1,'#F7E7B0')},
 streetTree:(X,Y,x,y,t)=>{paveF(X,Y,x,y);r(X+2,Y+12,12,4,'#8E9286');r(X+3,Y+12,10,1,'#6E4A2E');r(X+7,Y+7,2,6,'#6E4A2E');const s=Math.round(Math.sin(t/1300+x)*1);
  disc(X+8+s,Y+6,6,'#2F7A4E');disc(X+6+s,Y+4,4,'#3F9460');disc(X+10+s,Y+5,3,'#3F9460');disc(X+6+s,Y+3,2,'#5DB070')},
 busStop:(X,Y,x,y)=>{paveF(X,Y,x,y);const L=at(x-1,y)!=='B';r(X,Y+1,16,3,'#3E5E8C');r(X,Y+1,16,1,'#5A7AAC');r(X+(L?1:0),Y+4,L?15:14,7,'#BFE3F0');r(X,Y+11,16,2,'#8A5E36');r(X+1,Y+13,1,3,'#3E4350');r(X+14,Y+13,1,3,'#3E4350');
  if(L){r(X+1,Y+4,1,9,'#3E4350');r(X+3,Y+5,5,4,'#F2C46B')}else r(X+15,Y+4,1,9,'#3E4350')},
 sfence:(X,Y,x,y)=>{paveF(X,Y,x,y);r(X,Y+6,16,2,'#3E5A46');r(X,Y+11,16,2,'#3E5A46');for(let i=1;i<16;i+=4){r(X+i,Y+2,2,13,'#4F7A5E');r(X+i,Y+2,2,1,'#6E9A7A')}},
 sgate:(X,Y,x,y)=>{paveF(X,Y,x,y);r(X,Y+3,16,2,'#2B2E36');r(X,Y+13,16,2,'#2B2E36');const L=at(x-1,y)!=='G';r(L?X:X+13,Y,3,16,'#9AA3AD');r(L?X:X+13,Y,3,1,'#C9D2DA')},
 /* 분식집 */
 menu:(X,Y,x,y)=>{face(X,Y);r(X+1,Y+1,15,10,'#F7E7B0');if(at(x+1,y)!=='M')r(X+15,Y+1,1,10,'#F2D6A8');const L=at(x-1,y)!=='M';r(X+(L?1:0),Y+1,L?15:16,1,'#C8443A');
  r(X+(L?3:1),Y+3,8,2,'#C8443A');r(X+(L?3:1),Y+6,10,1,'#5A3E26');r(X+(L?3:1),Y+8,6,1,'#5A3E26');r(X+12,Y+3,2,2,'#2B2E36')},
 pan:(X,Y,x,y,t)=>{r(X,Y,16,16,'#AEB4B8');r(X,Y,16,2,'#D3D8DB');r(X+1,Y+4,14,10,'#2B2E36');const k=x%3;
  if(k===1){r(X+2,Y+5,12,8,'#D8442A');[[3,6],[8,7],[5,10],[10,10]].forEach(([a,b])=>r(X+a,Y+b,3,1,'#F4E9D8'));r(X+11,Y+6,2,2,'#E8B87A')}
  else if(k===2){r(X+2,Y+5,12,8,'#6A4A5A');for(let i=0;i<3;i++)r(X+3+i*4,Y+6,3,6,'#4A2E3E')}
  else{r(X+2,Y+5,12,8,'#C9A06A');for(let i=0;i<3;i++)r(X+3+i*4,Y+7,3,3,'#E8B93A')}
  const s=Math.round(Math.sin(t/300+x)*2);g.fillStyle='rgba(255,255,255,.55)';g.fillRect(X+6+s,Y,2,3);g.fillRect(X+9-s,Y+1,2,2)},
 bcounter:(X,Y,x,y)=>{tileF(X,Y);r(X,Y+2,16,13,'#B9844F');r(X,Y+2,16,4,'#D6A466');r(X,Y+2,16,1,'#E8C08A');r(X,Y+14,16,1,'#7A5230');
  if(x===2){r(X+3,Y,4,3,'#F4F1E6');r(X+4,Y+1,2,1,'#E86D8A')}else if(x===4){r(X+4,Y+2,8,3,'#3E4350');r(X+5,Y+3,4,1,'#69CFD8')}else if(hash(x,y)%2)r(X+5,Y+3,6,2,'#F4F1E6')},
 btable:(X,Y,x,y,t)=>{tileF(X,Y);if(!seatPulledN(x,y)){r(X+3,Y,4,3,'#1E4F70');r(X+9,Y,4,3,'#1E4F70')}/* far-side stools */const L=at(x-1,y)!=='t';r(X,Y+3,16,9,'#C8443A');r(X,Y+3,16,1,'#E0655A');r(X,Y+11,16,1,'#9A3028');if(L)r(X,Y+3,1,9,'#9A3028');else r(X+15,Y+3,1,9,'#9A3028');
  if(L){disc(X+9,Y+7,3,'#F4F1E6');disc(X+9,Y+7,2,'#D8442A')}else{r(X+3,Y+5,3,4,'#BFE3F0');r(X+8,Y+6,4,1,'#F4F1E6')}if(!seatPulled(x,y)){r(X+3,Y+13,4,3,'#2B6E9A');r(X+9,Y+13,4,3,'#2B6E9A')}/* stools, tucked in */
  if(x===9&&y===6&&state.f.afterSchool&&!state.f.nextDay){  // the scene table: a pan of 떡볶이 across its middle, steaming
   r(X-5,Y+4,10,6,'#2B2E36');r(X-4,Y+5,8,4,'#C8361E');for(const [a,b] of [[-3,5],[0,6],[2,5],[-1,7],[3,7]])r(X+a,Y+b,2,1,'#F2C9A0');
   const k=Math.floor(t/400)%2;r(X-2+k,Y+1,1,2,'#F4F1E6');r(X+2-k,Y+0,1,2,'#F4F1E6')}},
 fridge:(X,Y,x,y,t)=>{tileF(X,Y);r(X+1,Y,14,16,'#E8E8E8');r(X+1,Y,14,1,'#FFFFFF');r(X+2,Y+2,12,12,'#BFE3F0');for(let j=0;j<3;j++){r(X+2,Y+5+j*4,12,1,'#9AA3AD');for(let i=0;i<4;i++)r(X+3+i*3,Y+2+j*4,2,3,['#F7D154','#E86D8A','#7CB46A','#E8762A'][(i+j)%4])}
  r(X+12,Y+14,2,1,Math.floor(t/700)%2?'#7CF07A':'#2E5A2E')},
};
const PLAYER=LOOK.player;
return {WORDS,DICT,CONFUSE,BANK,Q,ITEMS,ZONES,NPC,FOLLOW,INTRO,DONE,questText,TILES,PLAYER};
}});
