CHAPTERS.push({id:'ch1',n:'1교시',title:'전학생',place:'운동장 · 복도 · 2학년 3반 · 급식실 · 방송실',words:20,save:'banghu-ch1',color:'#B8433A',
 start:{zone:'yard',x:7,y:12,dir:'up'},introWho:'…',  // starts left of the gate so the first view shows the 느티나무
 /* round 2: f.seated (sitting at your desk starts class) is new; old saves already past it get it here. The classroom door moved
    from the right wall to the back wall, so a save standing in the old door column is moved to the new door. */
 migrate:st=>{const F=st.f||(st.f={}),it=st.items||[],b=st.badges||[];
  if(F.paidFine&&!F.seated&&(it.includes('복숭아 쪽지')||b.includes('지우개')||b.includes('일부러')||F.lunch))F.seated=1;
  if(st.zone==='class'&&st.x===19)Object.assign(st,{x:18,y:11,dir:'up'});
  /* round 3: the seats moved below their desks (facing the board), and 찬 sits at a lunch table */
  const taken=st.zone==='class'&&st.y===11&&(st.x===11||st.x===12&&F.paidFine||st.x===10&&F.seated&&!it.includes('복숭아 쪽지')&&!b.includes('일부러'));
  if(taken)Object.assign(st,{x:13,y:11,dir:'left'});
  if(st.zone==='cafe'&&st.x===10&&st.y===4)Object.assign(st,{y:3})},
 make:()=>{
/* =====================================================================
   1교시 · 전학생 — story: notes/story.md (1교시). Original story; nothing from the webtoon but the word list.
   Day one: the player arrives late, pays 다온's 벌금, sits down (class starts), finds a note signed 복숭아 in her eraser sleeve,
   meets 찬 at lunch and 구름 in the 방송실 corner, delivers the closure notice to 교장 and gets the deal.
   Steps: {say} · {ask, opts:[[text,1],[wrong,0,'why']], w} · {build:[tiles…], w}; award/give/take/set/who/when/finale.
   ===================================================================== */
const WORDS=['반장','교장','종례','소문나다','지우개','줍다','벌금','걷다','동갑','친해지다','당황하다','평범하다','설레다','일부러','사실대로','전하다','구석','하필','마주치다','쏘다'];
const DICT={
 '반장':{k:'반의 리더 학생. 한 반에 한 명 있어요.',e:'class president',ex:'우리 반 반장은 다온이에요.',hj:'班長 · 長 = 선장, 사장님의 장'},
 '교장':{k:'학교에서 제일 높은 선생님.',e:'principal',ex:'교장 선생님이 조회에서 길게 말해요.',hj:'校長 · 校 = 학교의 교 · 長 = 반장의 장'},
 '종례':{k:'학교가 끝날 때 반에서 하는 짧은 모임.',e:'end-of-day homeroom',ex:'종례 끝나고 같이 집에 가자.',hj:'終禮 · 終 = 끝 · 아침 모임은 조례(朝禮)'},
 '소문나다':{k:'많은 사람이 그 이야기를 알게 돼요. "전학생 왔대!" → 다들 알아요.',e:'(word) to get around, to spread',ex:'전학생이 왔다고 벌써 소문났어.',hj:'所聞 · 聞 = 듣다 · 신문(新聞)의 문'},
 '지우개':{k:'연필 글씨를 지우는 작은 물건.',e:'eraser',ex:'지우개 좀 빌려줄래?'},
 '줍다':{k:'바닥에 떨어진 것을 손으로 잡고 올려요. 주워요, 주웠어요.',e:'to pick up (from the floor)',ex:'바닥에서 동전을 주웠어요.'},
 '벌금':{k:'규칙을 안 지켜서 내는 돈.',e:'fine, penalty',ex:'지각하면 벌금 오백 원이야.',hj:'罰金 · 金 = 돈 · 연체료도 벌금 같은 거예요'},
 '걷다':{k:'여러 사람한테서 돈을 모아요. 걷어요. (걸어요는 발로 가는 걷다)',e:'to collect (money from people)',ex:'반장이 벌금을 걷어요.'},
 '동갑':{k:'나이가 같아요.',e:'(being) the same age',ex:'우리 둘은 동갑이에요.',hj:'同甲 · 同 = 같다'},
 '친해지다':{k:'점점 친구가 돼요.',e:'to become close (friends)',ex:'같이 놀면서 친해졌어요.',hj:'親 · 친구(親舊)의 친'},
 '당황하다':{k:'갑자기 놀라서 어떻게 할지 몰라요.',e:'to be flustered, thrown',ex:'갑자기 질문을 받아서 당황했어요.',hj:'唐慌'},
 '평범하다':{k:'특별하지 않아요. 보통이에요.',e:'to be ordinary',ex:'저는 평범한 고등학생이에요.',hj:'平凡 · 平 = 평화의 평'},
 '설레다':{k:'좋은 일을 기다려서 마음이 두근두근해요.',e:'to be excited, (heart) to flutter',ex:'새 학교 첫날이라 설레요.'},
 '일부러':{k:'알면서, 하고 싶어서 해요. 실수의 반대.',e:'on purpose',ex:'일부러 늦은 거 아니에요.'},
 '사실대로':{k:'진짜 있었던 일 그대로. 거짓말 없이.',e:'truthfully, as it happened',ex:'사실대로 말해 주세요.',hj:'事實 · 實 = 열매, 진짜'},
 '전하다':{k:'다른 사람의 말이나 물건을 대신 가져다줘요.',e:'to pass on, to deliver (a message/thing)',ex:'선생님한테 이 편지 좀 전해 줘.',hj:'傳 · 전설(傳說)의 전'},
 '구석':{k:'방에서 벽 두 개가 만나는 안쪽 자리.',e:'corner (inside)',ex:'고양이가 구석에 숨었어요.'},
 '하필':{k:'다른 때도 많은데 왜 꼭 지금! (안 좋은 일에 써요)',e:'of all (times/things)',ex:'하필 오늘 비가 와요.',hj:'何必 · 何 = 무엇, 왜'},
 '마주치다':{k:'생각 못 했는데 딱 만나요. 눈이 서로 딱 만나요.',e:'to run into; (eyes) to meet',ex:'복도에서 선생님하고 마주쳤어요.'},
 '쏘다':{k:'친구한테 내가 돈을 다 내고 사 줘요. (원래 뜻: 총이나 활을 쏘다)',e:'to treat (someone to food); to shoot',ex:'오늘은 내가 떡볶이 쏠게!'},
 /* grammar of this chapter */
 '-(으)ㄹ게':{k:'내가 하겠다고 약속할 때. "내가 할게!"',e:"I'll … (a promise to the listener)"},
 '-거든':{k:'이유를 설명할 때. "바쁘거든."',e:"…, you see (giving the reason)"},
 /* glosses for words in lines that are not badges (a chapter DICT entry also wins over the shared dictionary when a word is tapped) */
 '전학생':{k:'다른 학교에서 온 새 학생.',e:'transfer student'},
 '지각':{k:'학교에 늦게 오는 것.',e:'being late (to school)'},
 '담임':{k:'우리 반을 가르치고 도와주는 선생님.',e:'homeroom teacher'},
 '방송실':{k:'학교 방송을 하는 방. 마이크와 기계가 있어요.',e:'broadcast room'},
 '방송부':{k:'학교 방송을 하는 동아리.',e:'broadcast club'},
 '부원':{k:'동아리에 들어간 사람.',e:'club member'},
 '축제':{k:'학교에서 다 같이 즐겁게 노는 큰 날.',e:'(school) festival'},
 '복숭아':{k:'분홍색의 달고 부드러운 과일.',e:'peach'},
 '매점':{k:'학교 안의 작은 가게. 빵이나 우유를 팔아요.',e:'school store'},
 '교무실':{k:'선생님들이 일하는 방.',e:"teachers' office"},
 '복습 노트':{k:'배운 단어를 다시 공부하는 공책. 교탁 위에 있어요.',e:'review notebook'},
 '안내문':{k:'무엇을 알려 주는 종이.',e:'notice'},
 '느티나무':{k:'잎이 많고 아주 오래 사는 큰 나무.',e:'zelkova tree'},
 '하교':{k:'수업이 끝나고 집에 가는 것.',e:'leaving school (end of day)'},
 '얼른':{k:'빨리. 지금 바로.',e:'quickly, right away'},
 '차렷':{k:'"바로 서요!" 하는 말. 경례 전에 해요.',e:'"Attention!" (class command)'},
 '경례':{k:'"인사!" 하는 말. 반장이 하면 다 같이 인사해요.',e:'"Bow!" (class command)'},
 '의외':{k:'생각 못 한 일이라서 좀 놀라워요.',e:'unexpected, surprising'},
 '식판':{k:'급식을 담는 큰 접시. 칸이 있어요.',e:'(school) meal tray'},
 '생일턱':{k:'생일인 사람이 친구들한테 밥이나 간식을 사 주는 것.',e:'a birthday treat (the birthday person treats friends)'},
};
/* sounds-alike / looks-alike words, used when a listening question is built */
const CONFUSE={'반장':['반찬','교장'],'교장':['교실','공장'],'종례':['조례','종이'],'소문나다':['소리 나다','소원'],'지우개':['지우다','지붕'],'줍다':['춥다','주다'],
 '벌금':['벌레','지금'],'걷다':['걸다','겉'],'동갑':['동네','동감'],'친해지다':['친하다','진해지다'],'당황하다':['당연하다','방황하다'],'평범하다':['평평하다','편하다'],
 '설레다':['설명하다','썰다'],'일부러':['일부','이불'],'사실대로':['사실','마음대로'],'전하다':['전화하다','정하다'],'구석':['구슬','구경'],'하필':['하품','필요'],
 '마주치다':['마치다','맞추다'],'쏘다':['쓰다','싸다']};

/* extra review questions (the 복습 노트 uses these too, alongside every NPC question).
   Rule: never echo the definition — put the word in a new situation, or contrast forms / near-words / endings. */
const BANK=[
 {w:'반장',ask:'우리 반 ___이 선생님 심부름을 갔어요.',opts:[['반장',1],['반찬',0,'하하, 반찬은 밥하고 먹는 음식이에요. 반의 리더는 "반장".']]},
 {w:'교장',ask:'___ 선생님이 운동장에서 길게 말해요.',opts:[['교장',1],['교실',0,'교실은 공부하는 방이에요. 사람이 아니에요. "교장" 선생님.']]},
 {w:'종례',ask:'___ 끝나고 같이 떡볶이 먹으러 가자.',opts:[['종례',1],['조례',0,'조례는 아침 모임이에요. 학교가 끝날 때는 "종례".']]},
 {w:'소문나다',ask:'그 가게 떡볶이가 맛있다고 ___.',opts:[['소문났어요',1],['소문했어요',0,'"소문하다"는 없어요. 이야기가 퍼지면 "소문났어요".']]},
 {w:'지우개',ask:'샤프는 있는데 ___가 없어. 하나만 빌려줄래?',opts:[['지우개',1],['지우기',0,'"지우기"는 지우는 일이에요. 빌리는 물건은 "지우개".'],['지붕',0,'지붕은 집 위에 있어요. 빌리는 물건은 "지우개".']]},
 {w:'줍다',ask:'길에서 천 원을 ___.',opts:[['주웠어요',1],['줍었어요',0,'줍다 → 주워요, 주웠어요. "ㅂ"이 "우"가 돼요.']]},
 {w:'벌금',ask:'주차를 잘못해서 ___ 오만 원을 냈어요.',opts:[['벌금',1],['용돈',0,'용돈은 부모님한테 받는 돈이에요. 잘못해서 내는 돈은 "벌금".']]},
 {w:'걷다',ask:'반장이 친구들한테서 사진 값을 ___.',opts:[['걷었어요',1],['걸었어요',0,'걸었어요는 발로 간 거예요. 돈을 모으면 "걷었어요".']]},
 {w:'동갑',ask:'형하고 선생님은 둘 다 서른 살. ___이에요.',opts:[['동갑',1],['동네',0,'동네는 사는 곳이에요. 나이가 같으면 "동갑".']]},
 {w:'친해지다',ask:'같은 반이 되고 금방 ___.',opts:[['친해졌어요',1],['친했어요',0,'친했어요는 원래 친한 거예요. 점점 친구가 되면 "친해졌어요".']]},
 {w:'당황하다',ask:'선생님이 갑자기 제 이름을 불러서 ___.',opts:[['당황했어요',1],['당연했어요',0,'당연하다는 "물론 그래요"예요. 놀라서 어쩔 줄 모르면 "당황했어요".']]},
 {w:'평범하다',ask:'우리 아빠는 회사원이에요. 아주 ___ 사람이에요.',opts:[['평범한',1],['평화로운',0,'평화롭다는 조용하고 싸움이 없을 때예요. 보통 사람은 "평범한".']]},
 {w:'설레다',ask:'내일은 축제! 너무 ___.',opts:[['설레요',1],['슬퍼요',0,'축제는 좋은 일이에요! 기다려서 두근두근하면 "설레요".']]},
 {w:'일부러',ask:'미안해! ___ 그런 거 아니야. 발이 미끄러졌어.',opts:[['일부러',1],['혹시',0,'혹시는 "어쩌면"이에요. 알면서 한 건 "일부러".']]},
 {w:'사실대로',ask:'선생님, ___ 말할게요. 제가 창문을 깼어요.',opts:[['사실대로',1],['마음대로',0,'마음대로는 내가 하고 싶은 대로예요. 거짓말 없이는 "사실대로".']]},
 {w:'전하다',ask:'엄마한테 고맙다고 ___ 주세요.',opts:[['전해',1],['전화해',0,'전화하다는 폰으로 말하는 거예요. 말을 대신 보내면 "전해".']]},
 {w:'구석',ask:'청소할 때 방 ___까지 닦아요. 먼지가 많아요.',opts:[['구석',1],['구경',0,'구경은 재밌는 걸 보는 거예요. 방 안쪽 끝은 "구석".']]},
 {w:'하필',ask:'시험 날인데 ___ 오늘 감기에 걸렸어.',opts:[['하필',1],['항상',0,'항상은 매번이야. 다른 날도 많은데 왜 꼭 오늘 → "하필".'],['역시',0,'역시는 생각한 대로야. 운이 나쁠 때는 "하필".']]},
 {w:'마주치다',ask:'옛날 친구하고 길에서 ___.',opts:[['마주쳤어요',1],['마쳤어요',0,'마치다는 일을 끝내는 거예요. 우연히 만나면 "마주쳤어요".']]},
 {w:'쏘다',ask:'오늘 용돈 받았어요. 저녁은 제가 ___!',opts:[['쏠게요',1],['쏠까요',0,'"-ㄹ까요?"는 물어볼 때예요. 사 준다고 약속하면 "쏠게요".']]},
 /* round 2: a second question in a fresh sentence for every word, so review can't be answered from memory of the story line */
 {w:'반장',ask:'반 친구들이 다 민지를 골랐어요. 이제 민지가 우리 반 ___이에요.',opts:[['반장',1],['교장',0,'교장은 학교에서 제일 높은 선생님이에요. 반의 리더 학생은 "반장".'],['반찬',0,'반찬은 밥하고 먹는 음식이에요! 반의 리더는 "반장".']]},
 {w:'교장',ask:'___ 선생님이 우리 반 수업을 보러 왔어요. 다들 조용해요.',opts:[['교장',1],['반장',0,'반장은 학생이에요. 선생님 앞에는 "교장".'],['교실',0,'교실은 방이에요. 사람이 아니에요. "교장" 선생님.']]},
 {w:'종례',ask:'오후 네 시예요. ___ 끝나면 바로 학원에 가요.',opts:[['종례',1],['조례',0,'조례는 아침 모임이에요. 오후 네 시는 "종례".']]},
 {w:'소문나다',ask:'이거 비밀이야. ___ 큰일 나.',opts:[['소문나면',1],['소문하면',0,'"소문하다"는 없어요. 이야기가 퍼지면 "소문나면".'],['소리 나면',0,'소리 나다는 귀에 들리는 거예요. 이야기가 퍼지면 "소문나면".']]},
 {w:'지우개',ask:'틀린 글씨를 ___로 깨끗하게 지웠어요.',opts:[['지우개',1],['지우기',0,'"지우기"는 지우는 일이에요. 손에 드는 물건은 "지우개".'],['지붕',0,'지붕은 집 위에 있어요. 글씨를 지우는 물건은 "지우개".']]},
 {w:'줍다',ask:'쓰레기를 ___ 쓰레기통에 넣었어요.',opts:[['주워서',1],['줍어서',0,'줍다 → 주워요, 주워서. "ㅂ"이 "우"가 돼요.'],['추워서',0,'춥다는 날씨가 차가울 때예요. 손으로 잡고 올리면 "주워서".']]},
 {w:'벌금',ask:'쓰레기를 길에 버려서 ___을 냈어요.',opts:[['벌금',1],['월급',0,'월급은 일하고 받는 돈이에요. 잘못해서 내는 돈은 "벌금".'],['용돈',0,'용돈은 부모님한테 받는 돈이에요. 잘못해서 내는 돈은 "벌금".']]},
 {w:'걷다',ask:'선생님 생일 선물 사려고 반 친구들한테서 돈을 ___.',opts:[['걷었어요',1],['걸었어요',0,'걸었어요는 발로 간 거예요. 돈을 모으면 "걷었어요".'],['걸렸어요',0,'걸리다는 시간이 들거나 감기에 걸릴 때예요. 돈을 모으면 "걷었어요".']]},
 {w:'동갑',ask:'나 열일곱 살이야. 너도 열일곱? 우리 ___이네!',opts:[['동갑',1],['동생',0,'동생은 나보다 어린 사람이에요. 나이가 같으면 "동갑".'],['동네',0,'동네는 사는 곳이에요. 나이가 같으면 "동갑".']]},
 {w:'친해지다',ask:'처음엔 말도 안 했는데 같이 축구하면서 ___.',opts:[['친해졌어요',1],['친했어요',0,'친했어요는 처음부터 친한 거예요. 점점 친구가 되면 "친해졌어요".'],['진해졌어요',0,'진하다는 색이나 커피가 강할 때예요. 친구는 "친해졌어요".']]},
 {w:'당황하다',ask:'수업 중에 내 핸드폰이 크게 울렸어요. 너무 ___.',opts:[['당황했어요',1],['당연했어요',0,'당연하다는 "물론 그래요"예요. 놀라서 어쩔 줄 모르면 "당황했어요".'],['평범했어요',0,'평범하면 놀라지 않아요. 갑자기 놀라면 "당황했어요".']]},
 {w:'평범하다',ask:'생일도 아니고 시험도 없어요. 그냥 ___ 하루예요.',opts:[['평범한',1],['평평한',0,'평평하다는 땅이 판판할 때예요. 특별하지 않은 날은 "평범한".'],['평범해',0,'"하루" 같은 말 앞에서는 "평범한"이에요.']]},
 {w:'설레다',ask:'내일 처음 비행기를 타요. 너무 ___ 잠이 안 와요.',opts:[['설레서',1],['피곤해서',0,'피곤하면 잠이 잘 와요! 두근두근해서 못 자면 "설레서".'],['슬퍼서',0,'비행기 타는 건 좋은 일이에요. 두근두근하면 "설레서".']]},
 {w:'일부러',ask:'동생이 ___ 내 케이크를 먹었어요. 먹으면서 웃어요!',opts:[['일부러',1],['실수로',0,'실수로는 모르고 한 거예요. 웃으면서 먹었으면 "일부러".'],['혹시',0,'혹시는 "어쩌면"이에요. 알면서 한 건 "일부러".']]},
 {w:'사실대로',ask:'엄마, ___ 말할게요. 시험 점수가 오십 점이에요.',opts:[['사실대로',1],['마음대로',0,'마음대로는 하고 싶은 대로예요. 거짓말 없이는 "사실대로".'],['일부러',0,'일부러는 알면서 하는 거예요. 거짓말 없이는 "사실대로".']]},
 {w:'전하다',ask:'이 선물, 다온이한테 좀 ___ 줄래? 나는 부끄러워.',opts:[['전해',1],['전화해',0,'선물은 전화로 못 줘요! 물건을 대신 가져다주면 "전해".']]},
 {w:'구석',ask:'교실 뒤 ___에 청소 도구가 있어요.',opts:[['구석',1],['구경',0,'구경은 재밌는 걸 보는 거예요. 방 안쪽 끝은 "구석".'],['구슬',0,'구슬은 작고 동그란 알이에요. 방 안쪽 끝은 "구석".']]},
 {w:'하필',ask:'우산을 안 가져왔는데 ___ 오늘 비가 와요.',opts:[['하필',1],['항상',0,'항상은 매번이에요. 다른 날도 많은데 왜 꼭 오늘 → "하필".'],['역시',0,'역시는 생각한 대로예요. 운이 나쁠 때는 "하필".']]},
 {w:'마주치다',ask:'화장실에서 나오다가 교장 선생님하고 딱 ___.',opts:[['마주쳤어요',1],['마쳤어요',0,'마치다는 일을 끝내는 거예요. 우연히 만나면 "마주쳤어요".'],['맞췄어요',0,'맞추다는 답을 맞게 하는 거예요. 우연히 만나면 "마주쳤어요".']]},
 {w:'쏘다',ask:'어제 찬이 나한테 피자를 ___. 그래서 오늘은 내가 사.',opts:[['쐈거든',1],['쏠게',0,'"-ㄹ게"는 앞으로 할 약속이에요. 어제 일이고 이유니까 "쐈거든".'],['쏘거든',0,'어제 일이에요. 지난 일이니까 "쐈거든".']]},
 /* grammar: -(으)ㄹ게 (promise) · -거든 (the reason) */
 {w:'동갑',ask:'왜 반말하냐고? 우리 ___.',opts:[['동갑이거든',1],['동갑일게',0,'"-ㄹ게"는 약속할 때예요. 이유를 말하면 "동갑이거든".']]},
 {w:'종례',ask:'종례 끝나고 문자 ___. 기다려.',opts:[['할게',1],['하거든',0,'"-거든"은 이유를 말할 때예요. 약속은 "할게".']]},
 {w:'설레다',ask:'어젯밤에 잠을 못 잤어. 너무 ___.',opts:[['설렜거든',1],['설렐게',0,'"-ㄹ게"는 약속이에요. 못 잔 이유는 "설렜거든".']]},
];

const Q={ // NPC questions, kept here so review can reuse them. who:'나' = the player says it; who:'…' = narration.
 jung:[
  {w:'동갑',ask:'반 친구들도 열여덟 살, 학생도 열여덟 살. 다 ___이에요.',opts:[['동갑',1],['동네',0,'동네는 사는 곳이에요. 나이가 같으면 "동갑".'],['동생',0,'동생은 나보다 어린 사람이에요. 다 열여덟 살이면 "동갑".']]},
  {w:'평범하다',ask:'그냥 아주 ___ 반이에요. 걱정 마요.',opts:[['평범한',1],['평평한',0,'평평하다는 땅이 판판할 때예요. 특별하지 않으면 "평범한".'],['평범해',0,'"반" 같은 말 앞에서는 "평범한"이에요.']]},
  {w:'반장',ask:'모르는 게 있으면 ___한테 물어보세요. 오다온이에요.',opts:[['반장',1],['교장',0,'교장 선생님은 학교에서 제일 높은 분이에요. 다온은 학생이에요. "반장".'],['반찬',0,'하하, 반찬은 밥하고 먹는 음식이에요! "반장".']]},
  {w:'교장',ask:'옆방은 ___ 선생님 방이에요. 지나갈 때 인사해요.',opts:[['교장',1],['교실',0,'교실은 공부하는 방이에요. 사람이 아니에요. "교장" 선생님.'],['반장',0,'반장은 학생이에요. 선생님이 아니에요. "교장" 선생님.']]},
 ],
 daon:[
  {w:'벌금',ask:'십오 분 지각. 그러니까 너는 ___ 오백 원.',opts:[['벌금',1],['용돈',0,'용돈은 부모님이 주는 돈이야. 내가 주는 거 아니야. "벌금".'],['연체료',0,'연체료는 책을 늦게 반납할 때야. 지각은 "벌금".']]},
  {w:'걷다',ask:'아침마다 내가 이걸로 벌금을 ___.',opts:[['걷어',1],['걸어',0,'"걸어"는 발로 가는 걷다야. 돈을 모으는 걷다는 "걷어".'],['줘',0,'반장은 돈을 받아. 모으는 거야 → "걷어".']]},
  {w:'사실대로',who:'나',ask:'사실대로 말할게. 버스가 안 ___.',opts:[['왔거든',1],['올게',0,'"-ㄹ게"는 앞으로 할 일을 약속할 때야. 이유는 "왔거든".'],['오거든',0,'버스는 아까 안 왔어. 지난 일이니까 "왔거든".']]},
  {w:'사실대로',ask:'다음에 늦어도 ___ 말해. 거짓말하면 벌금 두 배야.',opts:[['사실대로',1],['마음대로',0,'마음대로는 네가 하고 싶은 대로야. 거짓말 없이는 "사실대로".'],['일부러',0,'일부러는 알면서 하는 거야. 거짓말 없이는 "사실대로".']]},
  {w:'벌금',who:'나',ask:'벌금? 응, 지금 ___.',opts:[['낼게',1],['낼까',0,'"-ㄹ까?"는 물어보는 말이야. 약속은 "낼게".'],['내거든',0,'"-거든"은 이유를 말할 때야. 약속은 "낼게".']]},
 ],
 eraser:[
  {w:'지우개',who:'…',ask:'반만 남은 ___. 다온이 많이 지웠나 봐요.',opts:[['지우개',1],['필통',0,'필통은 연필을 넣는 통이에요. 쓰면 작아지는 건 "지우개".'],['지우기',0,'"지우기"는 지우는 일이에요. 물건 이름은 "지우개".']]},
  {w:'줍다',who:'…',ask:'바닥에 떨어진 지우개를 ___.',opts:[['주웠어요',1],['줍었어요',0,'줍다는 "주워요, 주웠어요"로 바뀌어요. 돕다 → 도와요처럼요.'],['추웠어요',0,'춥다는 날씨가 차가울 때예요. 손으로 잡고 올리면 "주웠어요".']]},
 ],
 daonS:[
  {w:'일부러',ask:'몰랐어. 내가 ___ 넣은 거 아니야.',opts:[['일부러',1],['사실대로',0,'사실대로는 거짓말 없이 말할 때야. 알면서 한 건 "일부러".'],['갑자기',0,'갑자기는 생각 못 한 일이 빨리 생길 때야. 알면서 하면 "일부러".']]},
  {w:'하필',ask:'근데 왜 ___ 방송실이야? 거기 아무도 안 가.',opts:[['하필',1],['항상',0,'항상은 매번이야. 다른 곳도 많은데 왜 꼭 거기 → "하필".'],['역시',0,'역시는 생각한 대로야. 이상한 곳을 고르면 "하필".']]},
 ],
 chan:[
  {w:'소문나다',ask:'전학생이 귀신 봤다고 벌써 ___!',opts:[['소문났어',1],['소문했어',0,'"소문하다"는 없어. 이야기가 퍼지면 "소문났어".'],['소리 났어',0,'소리 나다는 귀에 들리는 거야. 이야기가 퍼지면 "소문났어".']]},
  {w:'설레다',ask:'우리 반에 전학생은 처음이야. 그래서 좀 ___.',opts:[['설레',1],['지겨워',0,'지겹다는 같은 게 계속돼서 싫을 때야. 처음이라 두근두근하면 "설레".'],['피곤해',0,'피곤하면 자고 싶어. 새 친구는 좋은 일이야 → "설레".']]},
  {w:'쏘다',ask:'돈? 됐어. 이건 내가 ___!',opts:[['쏠게',1],['쓸게',0,'쓰다는 글씨를 쓰거나 돈을 쓸 때야. 친구한테 사 주는 건 "쏠게"!'],['살까',0,'"-ㄹ까"는 물어보는 말이야. 약속은 "쏠게".']]},
  {w:'쏘다',ask:'왜 쏘냐고? 오늘 내 ___.',opts:[['생일이거든',1],['생일일게',0,'"-ㄹ게"는 약속할 때야. 이유를 말할 때는 "생일이거든".']]},
  {w:'친해지다',ask:'나도 처음엔 무서웠어. 근데 같은 반 하면서 ___.',opts:[['친해졌어',1],['친했어',0,'친했어는 원래 친한 거야. 점점 친구가 되면 "친해졌어".'],['진해졌어',0,'진하다는 색이나 커피가 강할 때야. 친구는 "친해졌어".']]},
 ],
 gureum:[
  {w:'구석',who:'나',ask:'쪽지에 "방송실 ___"이라고 써 있어요. 여기예요?',opts:[['구석',1],['구경',0,'구경은 재밌는 걸 보는 거예요. 방 안쪽 끝은 "구석".'],['구슬',0,'구슬은 작고 동그란 알이에요. 방 안쪽 끝은 "구석".']]},
  {w:'당황하다',ask:'여기는 아무도 안 와요. 그래서 좀 ___.',opts:[['당황했어요',1],['당연했어요',0,'당연하다는 "물론 그래요"예요. 놀라서 어쩔 줄 모르면 "당황했어요".'],['평범했어요',0,'평범하면 놀라지 않아요. 사람이 와서 놀랐으면 "당황했어요".']]},
  {w:'마주치다',who:'…',ask:'눈이 딱 ___. 그 애가 얼른 고개를 돌려요.',opts:[['마주쳤어요',1],['마쳤어요',0,'마치다는 일을 끝내는 거예요. 눈이 만나면 "마주쳤어요".'],['맞췄어요',0,'맞추다는 답을 맞게 하는 거예요. 눈이 만나면 "마주쳤어요".']]},
  {w:'전하다',who:'나',ask:'네, 걱정 마요. 제가 꼭 ___.',opts:[['전할게요',1],['전할까요',0,'"-ㄹ까요?"는 물어보는 말이에요. 구름은 벌써 부탁했어요. 약속은 "전할게요".'],['전했거든요',0,'"-거든요"는 이유를 말할 때예요. 아직 안 전했어요. 약속은 "전할게요".']]},
 ],
 jong:[
  {w:'종례',ask:'오늘 ___는 짧게 해요. 다들 학원 가야죠?',opts:[['종례',1],['조례',0,'조례는 아침 모임이에요. 지금은 하루 끝이니까 "종례".'],['종이',0,'하하, 종이는 글씨를 쓰는 거예요. 끝날 때 모임은 "종례".']]},
 ],
 cafe:[ // 매점 이모: known words only, no badges
  {ask:'감기 때문에 몸 ___가 안 좋아요.',opts:[['상태',1],['상대',0,'소리가 비슷해요! 상대는 같이 경기하는 사람. 건강은 "상태".']]},
  {ask:'다음 경기 ___는 3반이에요. 이겨요!',opts:[['상대',1],['상태',0,'상태는 건강이나 기분이에요. 같이 경기하는 사람은 "상대".']]},
  {ask:'빌린 책은 친구한테 꼭 ___.',opts:[['돌려줘요',1],['돌아가요',0,'돌아가다는 내가 가는 거예요. 물건을 주는 건 "돌려줘요".']]},
  {ask:'학교 앞 강아지가 멍멍 ___.',opts:[['짖어요',1],['지어요',0,'짓다는 집이나 밥을 만들 때예요. 강아지는 "짖어요".']]},
  {ask:'이번 시합은 꼭 이길 거예요. 안 ___ 거예요.',opts:[['질',1],['지을',0,'"지을 거예요"는 짓다(집을 짓다)예요. 시합에서 지다 → "질 거예요".']]},
  {ask:'선생님한테 칭찬을 ___.',opts:[['받았어요',1],['맞았어요',0,'맞다는 비나 공에 맞을 때예요. 칭찬은 "받았어요".']]},
  {ask:'고장 난 의자는 선생님이 ___ 돼요.',opts:[['고쳐야',1],['고치해야',0,'"고치다"에 "하다"는 없어요. 고치다 → 고쳐요 → "고쳐야 돼요".']]},
 ],
};

const ITEMS={'복숭아 쪽지':'"점심시간, 방송실 구석. —복숭아" 예쁜 글씨예요.','바나나우유':'찬이 쏜 바나나우유. 아직 차가워요.','폐부 안내문':'"축제까지 부원이 다섯 명이 안 되면 방송부는 문을 닫습니다. —교장" 뒤에 구름의 답: "아직 안 끝났어요."'};
const f=()=>state.f;
const hasItem=i=>state.items.includes(i);
const has=w=>state.badges.includes(w);
const NOTE='복숭아 쪽지';
const pick=a=>a[Math.random()*a.length|0];  // a repeat line picked at random, so a character talked to often doesn't say the same thing

const ZONES={
 yard:{name:'느티고 · 운동장',reg:'NEUTI HIGH · YARD',outdoor:1,
  legend:{'H':{tile:'building'},'C':{tile:'clock'},'E':{tile:'entrance',walk:1},'.':{tile:'sand',walk:1},',':{tile:'stone',walk:1},'*':{tile:'bed'},
   'Y':{tile:'zelkova',front:'zelkovaTop'},'n':{tile:'ybench'},'g':{tile:'goal'},'b':{tile:'booth'},'f':{tile:'fence'},'G':{tile:'gate'}},
  map:[
"HHHHHHHHHHHHHHHHHHHHHHHH",
"HHHHHHHHHHHCCHHHHHHHHHHH",
"HHHHHHHHHHHHHHHHHHHHHHHH",
"HHHHHHHHHHHEEHHHHHHHHHHH",
"f****......,,......****f",
"f..........,,..........f",
"f.YYYY.....,,......gg..f",
"f.YYYY.....,,..........f",
"f.YYYY.n...,,..........f",
"f.YYYY.n...,,..........f",
"f..........,,..........f",
"f..........,,.....bb...f",
"f..........,,.....bb...f",
"fffffffffffGGfffffffffff"],
  rooms:[[1,4,10,12,'운동장 · 느티나무'],[13,4,22,12,'운동장']],
  warps:{'11,3':{to:'hall',x:5,y:8,dir:'up'},'12,3':{to:'hall',x:6,y:8,dir:'up'}},
  spots:{},
  things:{'H':['느티고등학교 건물이에요. 창문이 반짝여요.','3층 창문에서 누가 손을 흔들어요.','오래된 건물이지만 깨끗해요.'],
   'C':()=>f().done?'시계가 네 시를 가리켜요. 하교 시간이에요.':f().lunch?'시계가 열두 시 반이에요. 점심시간!':'시계가 아홉 시 십오 분이에요. 지각이에요!',
   '*':['화단에 노란 꽃이 피었어요.','꽃 이름표: "2학년 3반이 심었어요."','벌이 꽃 사이를 날아다녀요.'],
   'Y':['아주 큰 느티나무예요. 학교 이름도 이 나무예요.','나뭇잎 사이로 햇빛이 반짝여요.','나무에 작은 이름표: "오백 살"','바람이 불어요. 나뭇잎이 사락사락.'],
   'n':'나무 벤치예요. 누가 이름을 새겼어요.',
   'g':['축구 골대예요. 그물에 구멍이 있어요.','골대 옆에 공이 하나 있어요.'],
   'b':['경비실이에요. 라디오 소리가 작게 들려요.','창문에 열쇠가 많이 걸려 있어요.'],
   'f':['초록색 울타리예요.','울타리 밖에 버스 정류장이 보여요.'],
   'G':()=>f().done?nextChapterAsk('정문이에요. 오늘은 끝!'):'정문이에요. 아직 집에 갈 시간이 아니에요.'},
  npcs:['guard','xLate','xSoc1','xSoc2','xBench1','xBench2','xHome1','xHome2']},
 hall:{name:'느티고 · 1층 복도',reg:'NEUTI HIGH · 1F',
  legend:{'#':{tile:'wall'},',':{tile:'hallFloor',walk:1},'.':{tile:'checkFloor',walk:1},'D':{tile:'doorway',walk:1},
   'N':{tile:'notice'},'V':{tile:'classWin'},'R':{tile:'classDoor',walk:1},'P':{tile:'speaker'},
   'c':{tile:'cabinet'},'w':{tile:'water'},'p':{tile:'plant'},'k':{tile:'odesk'},'t':{tile:'trophy'},'K':{tile:'pdesk',over:1},'o':{tile:'sofa'},'a':{tile:'lowTable'},
   's':{tile:'shoes'},'E':{tile:'exitDoor',walk:1},'S':{tile:'stairs'},'W':{tile:'hallWin'},'F':{tile:'cafDoor',walk:1},'Q':{tile:'bcDoor',walk:1},'q':{tile:'bcSign'},'m':{tile:'classSign'}},
  map:[
"##################NN#VRm#P##",
"#ccw.pcc#tt...tt#,,,,,,,,,,#",
"#.......#..KK...#,,,,,,,,,,#",
"#kk..kk.#.......#,,,,,,,,,,#",
"#kk..kk.#oao....#,,,,,,,,,,#",
"####D########D###,,,,,,,,,,#",
"#,,,,,,,,,,,,,,,,,,,,,,,,,,#",
"#,,,,,,,,,,,,,,,,,,,,,,,,,,#",
"#,,,,,,,,,,,,,,,,,,,,,,,,,,#",
"#ssssEE#SSS#WWW#FF#WWWW#Qq##"],
  rooms:[[1,1,7,4,'교무실'],[9,1,15,4,'교장실'],[17,1,26,4,'복도 · 2학년 3반 앞'],[1,5,26,8,'1층 복도'],[15,7,18,8,'1층 복도 · 급식실 앞'],[22,6,26,8,'복도 끝 · 방송실 앞']],
  warps:{'5,9':{to:'yard',x:11,y:4,dir:'down'},'6,9':{to:'yard',x:12,y:4,dir:'down'},
   '22,0':{to:'class',x:18,y:11,dir:'up',lock:()=>!f().metTeacher&&'2학년 3반. 아직 담임 선생님을 못 만났어요.'},
   '16,9':{to:'cafe',x:10,y:1,dir:'down',lock:()=>!f().lunch&&'급식실 문이 닫혔어요. 아직 점심시간이 아니에요.'},
   '17,9':{to:'cafe',x:11,y:1,dir:'down',lock:()=>!f().lunch&&'급식실 문이 닫혔어요. 아직 점심시간이 아니에요.'},
   '24,9':{to:'bcast',x:7,y:1,dir:'down',lock:()=>!f().metChan&&(hasItem(NOTE)?'방송실… 배가 꼬르륵. 점심부터 먹어요.':'"방송실". 문이 잠겨 있어요.')}},
  spots:{},
  things:{'#':['하얀 벽이에요. 아래쪽은 초록색이에요.','벽에 "복도에서 뛰지 마세요" 종이가 있어요.','누가 벽에 작게 낙서했어요.'],
   'N':['게시판: "축제 다음 달! 반마다 하나씩 준비해요."','게시판: "중간고사 등수는 교무실 앞에."','게시판 구석에 "방송부 부원 모집" 종이가 찢어져 있어요.'],
   'V':['창문으로 2학년 3반 교실이 보여요.','교실 안에서 웃음소리가 들려요.'],
   'P':()=>f().done?'스피커에서 아직 지지직 소리가 나요.':'낡은 스피커예요. 아무 소리도 안 나요.',
   'c':['서류가 가득한 캐비닛이에요.','서랍에 "모의고사 성적"이라고 써 있어요. 열면 큰일 나요.'],
   'w':'정수기예요. 물이 시원해요.',
   'p':'화분이에요. 잎이 반짝반짝해요.',
   'k':['선생님 책상이에요. 시험지가 높이 쌓였어요.','커피 컵에 "국어"라고 써 있어요.','모니터에 시간표가 떠 있어요.'],
   't':['트로피가 많아요. "1994 방송 대회"도 있어요.','상장과 사진이 가득한 장식장이에요.'],
   'K':'교장 선생님 책상이에요. 이름표가 반짝여요.',
   'o':'까만 소파예요. 아주 푹신해 보여요.',
   'a':'작은 탁자 위에 녹차가 두 잔 있어요.',
   's':x=>!f().done?'신발장이에요. 실내화가 줄줄이 있어요.':x===2?'쪽지: "고마워. 다음은 노래. —복숭아"':'신발장이에요. 옆 칸에 분홍색 종이가 보여요.',
   'S':['계단이에요. 위층은 3학년 교실이에요.','위에서 선배들 목소리가 들려요. 좀 무서워요.'],
   'W':['창밖에 운동장하고 느티나무가 보여요.','창밖에서 새가 짹짹 울어요.'],
   'm':'"2학년 3반" 팻말이에요. 문 옆에 있어요.',
   'q':()=>f().done?'"방송실" 팻말. "방송 중" 불이 깜빡여요!':'"방송실" 팻말이에요. "방송 중" 불은 꺼져 있어요.'},
  npcs:['jung','principal','gureumH','xHall1','xHall2','xNotice','xWin','xSenior','xBye','xClean']},
 class:{name:'2학년 3반 교실',reg:'CLASS 2-3',
  legend:{'#':{tile:'wall'},'.':{tile:'wood',walk:1},'B':{tile:'board'},'J':{tile:'timetable'},'W':{tile:'sideWin'},'k':{tile:'tdesk',over:1},'T':{tile:'terminal'},
   'R':{tile:'classDoor',walk:1},'d':{tile:'desk'},'L':{tile:'lockers'},'b':{tile:'piggy'}},
  map:[
"####BBBBBBBBB##J####",
"W..................#",
"W.......kT.........#",
"W..................#",
"W.dd.dd.dd.dd.dd...#",
"W..................#",
"W.dd.dd.dd.dd.dd...#",
"W..................#",
"W.dd.dd.dd.dd.dd...#",
"W..................#",
"W.dd.dd.dd.dd.dd.b.#",
"W..................#",
"WLLLLLLLLLLLLLLLLLR#",
"####################"],
  rooms:[[1,1,18,3,'2학년 3반 · 교탁 앞'],[1,4,18,11,'2학년 3반 교실']],
  warps:{'18,12':{to:'hall',x:22,y:1,dir:'down'}},
  spots:{},
  things:{'#':['교실 벽이에요. 반 사진이 붙어 있어요.','벽에 "2학년 3반"이라고 써 있어요.'],
   'B':x=>x===4?'칠판에 오늘 날짜가 있어요.':x===12?'칠판 구석: "주번: 남궁찬"':['칠판에 "전학생 환영!"이라고 써 있어요.','분필 글씨가 반쯤 지워졌어요.','칠판에 수학 문제가 남아 있어요. 어려워요.'][x%3],
   'J':'시간표예요. 오늘 점심 다음은 수학이에요.',
   'W':['창밖에 느티나무가 보여요.','창문이 열려 있어요. 바람이 시원해요.','창가에 작은 화분이 있어요.'],
   'k':'교탁이에요. 분필하고 출석부가 있어요.',
   'd':(x,y)=>x===11&&y===10?(f().seated?'내 자리예요. 아직 아무것도 없어요.':'내 자리예요. 의자는 책상 아래쪽에 있어요.'):x===12&&y===10?'다온의 자리예요. 필통이 아주 깔끔해요.':['책상 위에 수학 문제집이 있어요.','책상에 작은 낙서: "졸려…"','책상 위에 필통하고 물병이 있어요.','책상 서랍에 과자가 숨어 있어요.'][x%4],
   'b':()=>f().paidFine?'벌금 저금통이에요. 내 오백 원도 들어 있어요.':'분홍색 돼지 저금통. 배에 "벌금"이라고 써 있어요.',
   'L':['사물함이에요. 이름표가 다 붙어 있어요.','사물함 하나가 안 닫혀요. 체육복이 보여요.','"오다온" 사물함. 아주 깔끔해요.']},
  npcs:['daon','daonSeat','seat','eraser','mate','mate2','jongnye','chanC','xC1','xC2','xC3','xC4','xC5']},
 cafe:{name:'급식실',reg:'CAFETERIA',
  legend:{'#':{tile:'wall'},',':{tile:'checkFloor',walk:1},'D':{tile:'exitDoor',walk:1},'M':{tile:'menu'},'W':{tile:'sideWin'},'h':{tile:'snacks'},
   'k':{tile:'kitchen'},'=':{tile:'serve',over:1},'m':{tile:'shopCounter',over:1},'v':{tile:'vending'},'t':{tile:'lunchTable'}},
  map:[
"#####MM###DD#####hhhhhh#",
"#kkkkkkkk#,,,,,,#,,,,,,#",
"#========#,,,,,,#mmmm,v#",
"W,,,,,,,,,,,,,,,#,,,,,,#",
"W,,,,,,,,,,,,,,,,,,,,,,#",
"W,tttt,,tttt,,tttt,,,,,#",
"W,,,,,,,,,,,,,,,,,,,,,,#",
"W,tttt,,tttt,,tttt,,,,,#",
"W,,,,,,,,,,,,,,,,,,,,,,#",
"W,tttt,,tttt,,tttt,,,,,#",
"W,,,,,,,,,,,,,,,,,,,,,,#",
"########################"],
  rooms:[[1,1,15,10,'급식실'],[17,1,22,4,'매점']],
  warps:{'10,0':{to:'hall',x:16,y:8,dir:'up'},'11,0':{to:'hall',x:17,y:8,dir:'up'}},
  spots:{},
  things:{'#':['급식실 벽이에요. 맛있는 냄새가 나요.','벽에 "음식 남기지 마세요!"라고 써 있어요.'],
   'M':'오늘의 메뉴: 밥, 미역국, 불고기, 김치.',
   'W':['창밖에 느티나무가 보여요.','창밖 운동장에서 남자애들이 공을 차요.'],
   'h':['과자하고 빵이 가득해요.','바나나우유가 한 줄 있어요. 인기가 많아요.','복숭아 주스도 있어요. 분홍색이에요.'],
   'k':['큰 솥에서 국이 보글보글 끓어요.','조리실에서 김이 올라와요.'],
   '=':['배식대예요. 불고기 냄새가 좋아요.','김치가 아주 빨개요. 매워 보여요.','밥이 산처럼 쌓였어요.'],
   'm':'매점 계산대예요. 사탕 통이 있어요.',
   'v':()=>f().metChan?'자판기예요. 바나나우유는 벌써 다 팔렸어요.':'자판기예요. 동전이 없어요.',
   't':['식판에 밥이 반쯤 남았어요.','긴 식탁이에요. 반찬 냄새가 나요.','누가 우유를 쏟았어요. 하필 여기에.','누가 밥을 다 먹었어요. 식판이 깨끗해요.']},
  npcs:['chan','imo','xK1','xK2','xK3','xK4','xK5','xK6']},
 bcast:{name:'방송실',reg:'BROADCAST ROOM',
  legend:{'#':{tile:'wall'},'.':{tile:'oldFloor',walk:1},'D':{tile:'exitDoor',walk:1},'r':{tile:'rack'},'A':{tile:'onair'},'O':{tile:'poster'},'W':{tile:'streetWin'},
   'M':{tile:'mixer'},'i':{tile:'micStand'},'s':{tile:'oldSofa'},'c':{tile:'tapeCart'},'x':{tile:'boxes'}},
  map:[
"##rrrrADD#OO####",
"#..............W",
"#..MMMM....i...W",
"#..............W",
"#ss.........c..W",
"#ss............W",
"#..............W",
"#.....xx.......W",
"#.....x.....x..W",
"#cx.........xx.#",
"################"],
  rooms:[[1,1,14,6,'방송실'],[11,7,14,9,'방송실 · 구석']],
  warps:{'7,0':{to:'hall',x:24,y:8,dir:'up'},'8,0':{to:'hall',x:24,y:8,dir:'up'}},
  spots:{},
  things:{'#':['벽에 먼지가 많아요.','벽에 오래된 사진 자국이 있어요.'],
   'r':['카세트테이프가 가득해요. 다 옛날 노래예요.','테이프 이름이 다 손글씨예요.','테이프 하나에 "점심 방송 1"이라고 써 있어요.'],
   'A':()=>f().done?'불이 꺼진 램프예요… 방금 깜빡였어요?':'"방송 중" 램프예요. 불이 꺼졌어요.',
   'O':['빛바랜 포스터예요. 아주 옛날 거예요.','포스터에 마이크 그림이 있어요.'],
   'W':['창문이 먼지 때문에 뿌예요.','창밖에 학교 앞 길하고 빌라들이 보여요.','창밖 전봇대에 전깃줄이 많아요. 새가 앉아 있어요.','건너편 건물 2층은 학원이에요. 멀리 아파트도 보여요.','길 건너에 편의점이 있어요. 밖에 파라솔하고 테이블이 있어요.'],
   'M':['방송 기계예요. 버튼을 눌러도 아무것도 안 돼요.','기계 위에 먼지가 하얗게 쌓였어요.','"절대 만지지 마세요" 종이가 붙어 있어요.'],
   'i':'마이크예요. "아, 아…" 소리가 안 나요.',
   's':['낡은 소파예요. 앉으면 먼지가 펑!','소파 밑에 과자 봉지가 있어요.'],
   'c':'옛날 녹음기예요. 테이프가 걸려 있어요.',
   'x':['상자에 "축제 1998"이라고 써 있어요.','상자 안에 전선이 가득해요.','상자가 무거워요. 안 움직여요.']},
  npcs:['gureum']},
};

const LOOK={
 player:{hair:'#2B2422',skin:'#E6BE9C',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#B8433A',style:'short'},
 gureum:{hair:'#3B2E2A',skin:'#E2B794',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#B8433A',style:'bob'},
 daon:{hair:'#2A2024',skin:'#EBC3A2',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#B8433A',style:'bun',lashes:1,lips:'#C9707A'},
 chan:{hair:'#6B4A2E',skin:'#D9A57E',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#B8433A',style:'spiky'},
 jung:{hair:'#3A2A28',skin:'#E6BE9C',shirt:'#3F8A80',pants:'#3E4350',style:'bob',lashes:1,lips:'#B85F68'},
 principal:{hair:'#C9C6C2',skin:'#E3B898',shirt:'#7A3E54',pants:'#3A3340',style:'bun',coat:1,lashes:1,lips:'#A8505E'},
 imo:{hair:'#4A3A34',skin:'#D9A882',shirt:'#F2E6C8',pants:'#6B5B4B',style:'bun',lashes:1,lips:'#C06A6A'},
 guard:{hair:'#8C8C90',skin:'#C9926C',shirt:'#3E5A46',pants:'#33403A',style:'bald',cap:'#3E5A46'},
 mate:{hair:'#2E2622',skin:'#E0B48E',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#B8433A',style:'short'},
 mate2:{hair:'#3A2B26',skin:'#EEC7A6',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#B8433A',style:'long',lashes:1,lips:'#CC7680'},
 /* extras: background students (tie colour by year) and staff */
 xLate:{hair:'#2A2220',skin:'#E8C09C',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#3F7D5A',style:'spiky'},
 xSoc1:{hair:'#1E1A1C',skin:'#D29C76',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#B8433A',style:'short'},
 xSoc2:{hair:'#3A2A22',skin:'#E2B48C',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#C9A13A',style:'spiky'},
 xBench1:{hair:'#2B1F1F',skin:'#F0CBAA',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#3F7D5A',style:'long',lashes:1,lips:'#D0808A'},
 xBench2:{hair:'#4A3226',skin:'#E6BC98',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#3F7D5A',style:'bob',lashes:1,lips:'#C97680'},
 xHome1:{hair:'#241E20',skin:'#DDAE88',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#B8433A',style:'bun',lashes:1,lips:'#C46E78'},
 xHome2:{hair:'#3B2C24',skin:'#EAC2A0',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#B8433A',style:'short'},
 xHall1:{hair:'#1C1A1E',skin:'#E4B690',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#B8433A',style:'spiky'},
 xHall2:{hair:'#2E2420',skin:'#F2CFB0',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#B8433A',style:'long',lashes:1,lips:'#D27C86'},
 xNotice:{hair:'#3E2E28',skin:'#E8BE9A',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#3F7D5A',style:'short'},
 xWin:{hair:'#262022',skin:'#D8A882',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#B8433A',style:'bob',lashes:1,lips:'#BE6A74'},
 xSenior:{hair:'#18181B',skin:'#CF9A74',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#C9A13A',style:'short'},
 xBye:{hair:'#4A3A30',skin:'#F0C8A6',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#3F7D5A',style:'bun',lashes:1,lips:'#D88A92'},
 cleaner:{hair:'#5A4A44',skin:'#D2A27E',shirt:'#E7A6A0',pants:'#4E5866',style:'bun',lashes:1,lips:'#B86A6A',cap:'#F2EEE6'},
 xC1:{hair:'#2C2422',skin:'#E0B28C',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#B8433A',style:'short'},
 xC2:{hair:'#1F1A1C',skin:'#F0C9A8',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#B8433A',style:'long',lashes:1,lips:'#CC7680'},
 xC3:{hair:'#5A3E2C',skin:'#E8BE98',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#B8433A',style:'spiky'},
 xC4:{hair:'#2A2024',skin:'#D6A27C',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#B8433A',style:'bob',lashes:1,lips:'#C46E78'},
 xC5:{hair:'#332824',skin:'#ECC4A2',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#B8433A',style:'short'},
 xK1:{hair:'#2A2220',skin:'#F2CEAE',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#3F7D5A',style:'short'},
 xK2:{hair:'#3A2824',skin:'#E4B894',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#3F7D5A',style:'long',lashes:1,lips:'#D27C86'},
 xK3:{hair:'#1E1C20',skin:'#DCAA84',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#B8433A',style:'spiky'},
 xK4:{hair:'#2E2622',skin:'#EAC0A0',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#B8433A',style:'bun',lashes:1,lips:'#C9707A'},
 xK5:{hair:'#4A382E',skin:'#E2B48E',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#B8433A',style:'short'},
 xK6:{hair:'#181618',skin:'#D09A72',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#C9A13A',style:'short'},
};
const ERASER={art:{pal:{O:'#1B1E2B',w:'#F4F1EA',W:'#D9D4C8',p:'#F2A38A',P:'#D9826C',y:'#F7E7B0'},
 down:['....yyy.....','..OOyyyOOO..','.OwwwpppppO.','.OwwwpPPppO.','.OWWWpppppO.','..OOOOOOOO..']}};

/* seats, 3/4 view from above, bottom-aligned like every sprite. Every desk has a blue chair and every lunch table two orange stools,
   drawn tucked in by the desk / table tile. Someone sitting right below one, facing it, has pulled their seat out: the tile skips
   the tucked-in seat (seatPulled) and the seat is drawn with the sitter.
   CHAIR_N: the desk chair pulled out, facing the board (away from the camera): the seat (hidden under a sitter), then a low
   backrest and the back legs, which back:4 draws again over the sitter's lower back, so the shoulders still show.
   STOOL_N: a lunch stool pulled out, the sitter's back to the camera: its seat and legs show right under the hips (drop 0), and the
   whole seat is pulled up to the table edge (lift 10), so they sit at the table, not a tile away from it.
   STOOL: the stool of someone on the far side of a table, facing the camera: hidden behind them. The sitter shows the lap and sinks
   until it meets the table (keep 14, drop 7). */
const CHAIR_N={art:{pal:{O:'#1B1E2B',h:'#6C8DAD',w:'#4F6F8F',m:'#6F757C'},back:4,
 down:['.OOOOOOOO.','.OhhhhhhO.','.OwwwwwwO.','.OwwwwwwO.','OOOOOOOOOO','OhhhhhhhhO','OOOOOOOOOO','.m......m.']}};
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
const STOOL_PAL={O:'#1B1E2B',e:'#E07A5A',E:'#B85E44',m:'#6F757C'};
const STOOL_N={art:{pal:STOOL_PAL,drop:0,lift:10,
 down:['.OOOOOOOO.','.OeeeeeeO.','.OOOOOOOO.','..m....m..']}};
const STOOL={art:{pal:STOOL_PAL,keep:14,drop:7,
 down:['..OOOOOO..','..OeeeeO..','..OEEEEO..','..OOOOOO..','...m..m...']}};
/* is the seat of the desk / table at x,y pulled out? (someone sits right below it, facing it; the player's own chair counts)
   seatPulledN: someone sits right above a lunch table, facing it (their stool, on the far side, is hidden behind them) */
const seatPulledN=(x,y)=>{try{return live().some(n=>n.x===x&&n.y===y-1&&n.dir==='down'&&!n.walk&&sitting(n))}catch(e){return false}};
const seatPulled=(x,y)=>{try{
 if(player.sit&&player.dir==='up'&&player.x===x&&player.y===y+1)return true;
 return live().some(n=>n.x===x&&n.y===y+1&&!n.walk&&(n.look===CHAIR_N||n.dir==='up'&&sitting(n)))}catch(e){return false}};  // my chair counts whichever way it faces

const JONGNYE=()=>[
 {who:'…',say:'자리에 앉았어요.',sit:{npc:'seat'}},
 {who:'정 선생님',say:'자, 다들 자리에 앉아요.',cam:[8,3]},
 {...Q.jong[0],who:'정 선생님'},
 {who:'정 선생님',say:'다음 달에 {축제|축제}가 있어요.'},
 {who:'정 선생님',say:'반마다 하나씩 준비해요. 생각해 봐요.'},
 {who:'남궁찬',say:'선생님! 전학생이 {방송부|방송부} 한대요!'},
 {who:'정 선생님',say:'오, 그래요? 대단하네요. {부원|부원}은요?'},
 {who:'남궁찬',say:'…저는 구경만 할게요. 구경만.'},
 {who:'오다온',say:'나도. 구경만. 반장은 바쁘거든.'},
 {who:'정 선생님',say:'구경도 좋아요. 그럼 오늘 종례 끝!'},
 {who:'오다온',say:'{차렷|차렷}. {경례|경례}.',cam:null},
 {who:'다 같이',say:'선생님, 수고하셨습니다!',award:['종례'],set:()=>{f().crew3=1}}];

/* when the background extras are around (see the extras at the end of NPC) */
const lunchT=()=>!!f().lunch&&!f().deal;            // lunch break: yard, hall and 급식실 are busy
const classT=()=>!f().lunch||(!!f().deal&&!f().crew3); // lessons and 종례: classmates in their seats
const NPC={
 guard:{name:'박 경비 아저씨',zone:'yard',x:17,y:12,dir:'left',look:LOOK.guard,
  script:()=>{const F=f();   // repeat lines follow the day: morning, lunch, 종례, 하교
   if(F.done)return [{say:'하교예요? 조심히 가요.'},{say:'…아까 그 노래, 학생도 들었어요?'},{say:'옛날 방송부 노래예요. 참 오랜만이네요.'}];
   if(F.crew3)return [{say:'벌써 하교예요? 첫날, 수고했어요.'},{say:'방송부 한다면서요? 소문 다 났어요.'},{say:'방송실 열쇠는 아저씨한테 있어요. 언제든지 와요.'}];
   if(F.deal)return [{say:'지금 종례 시간 아니에요?'},{say:'반장한테 혼나요. 얼른 교실에 가요.'}];
   if(F.gotNotice)return [{who:'나',say:'아저씨, 방송실 알아요?'},{say:'방송실? 옛날에는 점심마다 노래가 나왔어요.'},{say:'그때 디제이 목소리가 참 좋았는데…'}];
   if(F.metChan)return [{say:'점심 맛있게 먹었어요? 얼굴이 좋네요.'},{say:'벌써 친구도 생겼어요? 다행이네요.'}];
   if(F.lunch)return [{say:'점심시간이에요. 급식실은 복도 가운데예요.'},{say:'오늘 불고기래요. 얼른 가요.'}];
   if(F.paidFine)return [{say:'벌써 쉬는 시간이에요?'},{say:'벌금 냈어요? 하하. 여기 반장들은 무서워요.'}];
   if(F.metTeacher)return [{say:'학교는 좀 어때요? 다들 착하죠?'},{say:'여기 버스는 항상 늦어요. 내일은 일찍 타요.'}];
   return null},
  talk:()=>[
   {say:'어이구, 학생. 늦었네요.'},
   {say:'처음 보는 얼굴인데… 혹시 전학생이에요?'},
   {say:'저 버스가 또 늦었죠? 그래도 {얼른|얼른} 가요.'},
   {say:'교무실은 들어가서 왼쪽이에요.'}]},

 jung:{name:'정 선생님',zone:'hall',x:6,y:2,dir:'down',look:LOOK.jung,badge:['반장','교장','동갑','평범하다','종례'],
  hide:()=>!!f().deal&&!f().crew3,
  get after(){return f().done?pick([['아까 복도 스피커 소리 들었어요? 신기하네요.','가기 전에 하나만 물어볼게요.'],['아직 안 갔어요? 내일은 늦지 마요.','가기 전에 하나만요.']])
   :pick([['종례 끝났네요. 조심히 가요.','아, 가기 전에 하나만요.'],['첫날 수고했어요. 모르는 게 있으면 언제든지 물어봐요.']])},
  status:()=>{if(!has('반장'))return 'todo';if(!has('종례'))return null},
  script:()=>{const F=f();
   if(!has('반장')||has('종례'))return null;   // first talk, then (after 종례) the review
   if(!F.paidFine)return [{say:'3반은 복도 오른쪽 끝, 위쪽 문이에요.'},{say:'반장 말 잘 들어요. 벌금 무서워요.'}];
   if(!F.seated)return [{say:'반장 만났어요? 벌금, 냈죠? 하하.'},{say:'자리는 반장 옆이에요. 얼른 앉아요.'}];
   if(!F.lunch)return [{say:'쉬는 시간이에요? 첫 수업은 어땠어요?'},{say:'다음 시간도 집중해요. 곧 종이 쳐요.'}];
   if(hasItem('폐부 안내문'))return [{say:'손에 그거 뭐예요? 교장 선생님 거요?'},{say:'교장실은 바로 옆이에요.'}];
   if(F.metChan)return [{say:'점심 맛있었어요? 찬이랑 같이 먹었죠?'},{say:'찬이 말은 반만 믿어요. 하하.'}];
   return [{say:'점심시간이네요. 밥 먹었어요?'},{say:'급식실은 복도 가운데예요. 오늘 불고기예요.'}]},
  talk:()=>[
   {say:'아, 왔어요? {전학생|전학생}이죠?',set:()=>{f().foundTeacher=1}},
   {say:'저는 {담임|담임} 정미숙이에요. 국어 선생님이에요.'},
   {say:'첫날부터 {지각|지각}이네요. 버스 때문이에요?'},
   {say:'하하, 괜찮아요. 우리 반은 2학년 3반이에요.'},
   {say:'학생은 열여덟 살이죠?'},
   Q.jung[0],
   {say:'우리 반에 연예인은 없어요. 천재도 없어요.'},
   Q.jung[1],
   {say:'우리 반에는 규칙이 많아요. 하하.'},
   Q.jung[2],
   Q.jung[3],
   {say:'교장 선생님은 좀 무서워요. 하하, 농담이에요.'},
   {say:'자, {얼른|얼른} 교실에 가요. 3반은 복도 오른쪽 끝, 위쪽 문이에요.',award:['반장','교장','동갑','평범하다'],set:()=>{f().metTeacher=1}}]},

 principal:{name:'한복순 교장 선생님',zone:'hall',x:12,y:1,dir:'down',look:LOOK.principal,
  status:()=>hasItem('폐부 안내문')?'todo':null,
  script:()=>{const F=f();
   if(F.done)return [{say:'스피커에서 노래가 나왔다고요?'},{say:'오래된 스피커예요. 가끔 그래요.'},{say:'조심히 가요. 내일은 늦지 마요.'}];
   if(F.crew3)return [{say:'하교 시간이네요. 첫날은 어땠어요?'},{say:'부원 다섯 명. 잊지 마세요.'}];
   if(F.deal)return [{say:'부원 다섯 명. 잊지 마세요.'},{say:'…방송실 열쇠는 경비 아저씨한테 있어요.'},{say:'지금은 종례 시간이죠? 교실에 가요.'}];
   if(hasItem('폐부 안내문'))return [
    {who:'…',say:'안내문을 교장 선생님한테 전했어요.',take:['폐부 안내문']},
    {say:'뒤에 답이 있네요. "아직 안 끝났어요."'},
    {say:'구름 학생 글씨예요. 그런데 학생은요?'},
    {who:'나',say:'저도 방송부 할 거예요.'},
    {say:'방송부를 하겠다고요? {의외|의외}네요.'},
    {say:'그 방은 오래 조용했어요. 아주 오래.'},
    {say:'좋아요. 축제까지 방송 한 번. 부원 다섯 명.'},
    {say:'그럼 방송실은 그대로 둘게요.',set:()=>{f().deal=1}},
    {who:'…',say:'교장 선생님이 살짝 웃은 것 같아요.'}];
   if(!F.metPr)return null;   // the welcome (talk) comes once
   if(!F.metTeacher)return [{say:'담임 선생님은 만났어요? 교무실은 바로 옆이에요.'}];
   if(F.lunch)return [{say:'점심은 먹었어요? 오늘 급식, 맛있죠?'},{say:'운동장 느티나무 밑도 가 봐요. 시원해요.'}];
   return [{say:'또 왔어요? 지금은 수업 시간이에요.'},{say:'얼른 교실에 가요. 수업 시작했어요.'}]},
  talk:()=>[
   {say:'전학생이군요. 느티고에 온 걸 환영해요.'},
   {say:'운동장의 {느티나무|느티나무}, 봤어요? 오백 살이에요.'},
   {say:'우리 학교 자랑이에요. 내일부터는 늦지 마요.',set:()=>{f().metPr=1}}]},

 gureumH:{name:'백구름',zone:'hall',x:25,y:2,dir:'up',look:LOOK.gureum,badge:['구석','당황하다','마주치다','전하다'],
  hide:()=>!f().crew3,
  get after(){return pick(['내일 점심에 방송실에서 봐요.','…아까 그 노래, 계속 생각나요.','다섯 명… 그래도 해 볼게요.'])},
  status:()=>f().done?undefined:'todo',
  script:()=>{
   if(f().done)return null;
   return [
    {who:'…',say:'{하교|하교} 시간. 복도에 사람이 별로 없어요.'},
    {say:'혼자서는 무서웠는데… 오늘 진짜 고마웠어요.'},
    {say:'다섯 명은 어려워도 해 볼게요.'},
    {who:'스피커',say:'지지직… ♪ 라라라… ♪'},
    {who:'…',say:'고장 난 스피커에서 옛날 노래가 나와요!'},
    {say:'방송실 기계는 다 고장 났는데…'},
    {say:'…지금 그거, 누가 튼 거예요?',set:()=>{f().done=1},finale:1}]},
  talk:()=>[]},

 daon:{name:'오다온',zone:'class',x:18,y:10,dir:'down',look:LOOK.daon,banmal:1,badge:['벌금','걷다','사실대로'],
  hide:()=>!!f().paidFine,
  after:'지각하면 벌금. 규칙은 규칙이야.',
  talk:()=>[
   {say:'잠깐! 너 전학생이지? 나는 반장 오다온.'},
   {say:'오늘 첫날인데 {지각|지각}이야. 우리 반 규칙 알아?'},
   Q.daon[0],
   {say:'이 저금통 보여? 벌금 저금통이야.'},
   Q.daon[1],
   {say:'돈을 모으면 "걷어". 발로 가면 "걸어".'},
   {say:'둘 다 "걷다"야. 헷갈리지?'},
   {say:'근데 왜 늦었어? 사실대로 말해.'},
   Q.daon[2],
   {say:'흠. 진짜야? 알았어. 이번만 믿을게.'},
   Q.daon[3],
   {say:'그래서 벌금은? 지금 낼 거야?'},
   Q.daon[4],
   {say:'오백 원. 땡그랑. 고마워.'},
   {say:'네 자리는 내 옆이야. 넷째 줄. 빨리 와.',award:['벌금','걷다','사실대로'],set:()=>{f().paidFine=1},walk:{npc:'daonSeat',from:[18,10]}}]},

 seat:{name:'내 자리',zone:'class',x:11,y:11,dir:'up',look:CHAIR_N,still:1,fixed:1,
  status:()=>{const F=f();return F.paidFine&&!F.seated||F.deal&&!F.crew3?'todo':null},
  talk:()=>{const F=f();
   if(!F.paidFine)return [{who:'…',say:'빈자리예요. 누구 자리일까요?'}];
   if(F.deal&&!F.crew3)return JONGNYE();
   if(F.seated)return [{who:'…',say:'내 자리예요. 잠깐 앉았어요.',sit:{npc:'seat'}}];
   return [
   {who:'…',say:'내 자리. 다온 옆, 넷째 줄이에요.'},
   {who:'…',say:'의자에 앉았어요. 가방을 내려놓아요.',sit:{npc:'seat'}},
   {who:'…',say:'수업이 시작됐어요. 국어, 영어…'},
   {who:'학교 종',say:'딩동댕동… 쉬는 시간이에요.'},
   {who:'오다온',say:'아, 떨어졌다! 하필 지금…'},
   {who:'…',say:'다온의 지우개가 내 의자 옆으로 굴러왔어요.',set:()=>{f().seated=1}}]}},

 eraser:{name:'떨어진 지우개',zone:'class',x:10,y:11,dir:'down',look:ERASER,badge:['지우개','줍다'],
  hide:()=>!f().seated||!!f().eraserUp||hasItem(NOTE)||has('일부러'),
  after:'작은 지우개예요.',
  talk:()=>[
   {who:'…',say:'바닥에 작고 하얀 게 있어요. 종이 커버가 있어요.'},
   Q.eraser[0],
   Q.eraser[1],
   {who:'…',say:'어? 커버 안에서 종이가 툭 떨어졌어요.',set:()=>{f().eraserUp=1}},  // picked up: it's off the floor
   {who:'…',say:'"점심시간, 방송실 구석. —{복숭아|복숭아}"',give:NOTE},
   {who:'오다온',say:'고마워. …근데 그 쪽지 뭐야?',award:['지우개','줍다']}]},

 daonSeat:{name:'오다온',zone:'class',x:12,y:11,dir:'up',look:LOOK.daon,banmal:1,sit:1,chair:CHAIR_N,badge:['일부러','하필','벌금','걷다','사실대로','지우개','줍다'],
  hide:()=>!f().paidFine,
  get after(){const F=f();   // she is at her desk from the morning to after school
   if(F.done)return ['아까 복도 스피커 들었어? 누가 튼 거야?','…무서운 거 아니야. 그냥 궁금한 거야.'];
   if(F.crew3)return pick([['구경만이야. 진짜 구경만.'],['종례 끝. 내일 지각하면 벌금 또 걷어.']]);
   if(F.deal)return ['종례 시작해. 빨리 앉아.'];
   if(F.gotNotice)return ['방송실 갔다 왔어? …아니, 안 궁금해.'];
   return pick([['밥 안 먹어? 급식실은 복도 가운데야.'],['벌금은 내가 걷어. 규칙은 규칙이야.']])},
  status:()=>{if(!has('일부러'))return hasItem(NOTE)?'todo':null},
  script:()=>{
   if(has('일부러'))return null;
   if(!f().seated)return [{say:'네 자리는 여기, 내 옆이야. 빨리 앉아.'}];
   if(!hasItem(NOTE))return [{say:'내 지우개… 네 발 앞에 있어.'}];
   return null},
  talk:()=>[
   {say:'그 쪽지? 나도 처음 봐.'},
   {say:'그 지우개, 어제 {매점|매점}에서 산 {거거든|-거든}.'},
   {say:'진짜야. 믿어 줘.'},
   Q.daonS[0],
   Q.daonS[1],
   {who:'…',say:'다시 수업이에요. 과학, 음악…',sit:{npc:'seat'}},
   {who:'학교 종',say:'딩동댕동… 점심시간이에요!'},
   {say:'점심시간이네. 밥부터 먹어. 급식실은 복도 가운데야.'},
   {say:'방송실은 복도 오른쪽 끝이야. 나는 안 가.'},
   {say:'…재밌는 일이면 나중에 얘기해 줘.',award:['일부러','하필'],set:()=>{f().lunch=1}}]},

 mate:{name:'반 친구',zone:'class',x:3,y:5,dir:'up',look:LOOK.mate,sit:1,chair:CHAIR_N,
  talk:()=>[{say:'쿨쿨…'},{say:'…오백 원 없어… 반장, 제발…'},{who:'…',say:'자고 있어요. 깨우지 마요.'}]},
 mate2:{name:'반 친구',zone:'class',x:15,y:5,dir:'up',look:LOOK.mate2,sit:1,chair:CHAIR_N,banmal:1,
  script:()=>f().crew3?[{say:'방송부? 대박. 부럽다.'},{say:'축제 때 구경 갈게.'}]:null,
  talk:()=>[{say:'안녕! 너 전학생이지? 반가워.'},{say:'다온이 무섭지? 그래도 착해.'},{say:'다들 학원 때문에 바빠. 나도 그래.'},{say:'어제 모의고사 망했어. 엄청 어려웠거든.'}]},

 jongnye:{name:'정 선생님',zone:'class',x:8,y:1,dir:'down',look:LOOK.jung,
  hide:()=>!f().deal||!!f().crew3,
  status:()=>null,   // 종례 starts when you sit down (see JONGNYE)
  talk:()=>[{say:'자, 자리에 앉아요. 종례 시작해요.'}]},

 chanC:{name:'남궁찬',zone:'class',x:9,y:9,dir:'up',look:LOOK.chan,sit:1,chair:CHAIR_N,banmal:1,badge:['소문나다','설레다','쏘다','친해지다'],
  hide:()=>!f().deal,
  get after(){return f().done?['야, 아까 복도 스피커! 대박.','방송실 귀신이다. 진짜야.']
   :pick([['방송부 소문, 벌써 다 났어. 내가 냈거든.'],['나 구경만 하는 거야. …근데 좀 설레.']])},
  script:()=>!f().crew3?[{say:'야, 너 방송부 한다며? 교장실 앞에서 다 들었어.'},{say:'종례 시작한대. 빨리 앉아.'}]:null,
  talk:()=>[]},

 chan:{name:'남궁찬',zone:'cafe',x:10,y:4,dir:'down',look:LOOK.chan,banmal:1,sit:1,chair:STOOL,badge:['소문나다','설레다','쏘다','친해지다'],
  hide:()=>!!f().deal,
  get after(){return f().gotNotice?['방송실 갔다 왔어? 귀신 있었어? 진짜?','…없었어? 에이, 재미없어.']
   :pick([['방송실 간다며? 귀신 보면 사진 찍어 와!'],['새 소문 있어? 없어? 내가 만들까?']])},
  talk:()=>[
   {who:'…',say:'오늘은 불고기! {식판|식판}을 들고 빈자리에 앉았어요.',sit:{x:10,y:6,dir:'up',chair:STOOL_N}},
   {say:'헉, 너 그 전학생이지? 대박!'},
   {say:'아침에 방송실 앞에 서 있었지? 거기 귀신 나오는 방이야.'},
   Q.chan[0],
   {say:'나는 남궁찬. 이 학교 소문은 다 내가 알아.'},
   {say:'근데 진짜 귀신 봤어?'},
   {who:'나',say:'아니, 안 봤어.'},
   {say:'에이, 재미없어. 나는 귀신 한 번 보고 싶은데.'},
   Q.chan[1],
   {say:'자, 이거 받아. 바나나우유!',give:'바나나우유'},
   Q.chan[2],
   Q.chan[3],
   {who:'나',say:'생일인데 네가 사? 생일에는 선물을 받잖아.'},
   {say:'한국에서는 생일인 사람이 친구들한테 쏴. {생일턱|생일턱}이야!'},
   {who:'나',say:'아, 그렇구나. 생일 축하해!'},
   {say:'고마워! 우유 하나로 우리 이제 친구야. 하하.'},
   {w:'친해지다',who:'나',build:['우리','벌써','친해졌어']},
   {say:'반장 다온 만났지? 무섭지? 하하.'},
   Q.chan[4],
   {who:'…',say:'밥을 다 먹었어요. 불고기가 진짜 맛있었어요.'},
   {who:'나',say:'근데 방송실이 어디야?'},
   {say:'방송실? 설마 귀신 보러 가?'},
   {say:'복도 오른쪽 끝이야. 급식실 지나서. 조심해!',award:['소문나다','설레다','쏘다','친해지다'],set:()=>{f().metChan=1}}]},

 imo:{name:'매점 이모',zone:'cafe',x:18,y:1,dir:'down',look:LOOK.imo,
  script:()=>{const q=Q.cafe[Math.random()*Q.cafe.length|0],F=f();
   const hi=F.crew3?[{say:'하교해요? 배고프죠? 이거 먹고 가요.'}]
    :F.deal?[{say:'종례 시간 아니에요? 쉿, 빨리 먹고 가요.'}]
    :F.gotNotice?[{say:'또 왔어요? 이거 먹어요. 공짜예요.'}]
    :[{say:'학생, 어서 와요. 점심 먹었어요?'},{say:'후식으로 이거 먹어요. 공짜예요.'}];
   return [...hi,{say:'먹으면서 옛날 단어 하나 해요.'},{...q,old:1},{say:'잘했어요. 또 와요!'}]},
  talk:()=>[]},

 gureum:{name:'백구름',zone:'bcast',x:14,y:9,dir:'left',look:LOOK.gureum,badge:['구석','당황하다','마주치다','전하다'],
  hide:()=>!!f().crew3,
  get after(){return f().deal?pick([['교장 선생님이 진짜 괜찮대요? …다행이에요.'],['종례 끝나면 저도 복도로 갈게요.']]):['저… 마이크 앞에서만 말을 잘해요.']},
  status:()=>f().deal||!has('구석')?undefined:'wait',
  script:()=>has('구석')&&!f().deal?[{say:'교장실은 교무실 옆이에요.'},{say:'…저는 여기서 기다릴게요.'}]:null,
  talk:()=>[
   {who:'…',say:'방송실 안은 조용해요. 먼지가 많아요.'},
   {who:'…',say:'구석에서 누가 부스럭거려요.'},
   {say:'으악! 누, 누구세요?'},
   Q.gureum[0],
   {say:'쪽지요? 저, 저는 몰라요.'},
   {say:'저 숨은 거 아니에요… 진짜예요.'},
   Q.gureum[1],
   {who:'…',say:'그 애가 나를 봐요. 나도 그 애를 봐요.'},
   Q.gureum[2],
   {say:'…그거 바나나우유예요?'},
   {who:'…',say:'바나나우유를 줬어요. 얼굴이 조금 밝아져요.',take:['바나나우유']},
   {say:'고마워요. 저는 백구름. 2학년이에요.'},
   {say:'{방송부|방송부}… 마지막 부원이에요.'},
   {say:'이 마이크도, 기계도 다 고장 났어요.'},
   {say:'그리고 이거요. 교장 선생님이 보냈어요.',give:'폐부 안내문'},
   {who:'…',say:'"축제까지 부원이 다섯 명이 안 되면 방송부는 문을 닫습니다."'},
   {say:'그래서 뒤에 제 답을 썼어요. "아직 안 끝났어요."'},
   {say:'근데 저는 사람 앞에서 말을 잘 못 해요.'},
   {say:'혹시… 제 답, 교장 선생님한테 전해 줄 수 있어요?'},
   Q.gureum[3],
   {who:'나',say:'그리고…'},
   {w:'전하다',who:'나',build:['저도','방송부','하겠다고','전할게요']},
   {say:'네? 방송부를… 같이요? 진짜요?'},
   {say:'교장실은 교무실 옆이에요. …고마워요.',award:['구석','당황하다','마주치다','전하다'],set:()=>{f().gotNotice=1}}]},

 /* ---------- extras: one-off students and staff so the school feels lived-in. No badges, no teaching.
    Morning: classes are on (yard and hall empty but for one other late 1학년). Lunch (lunch, before the deal):
    yard, hall and 급식실 are busy. 종례 (deal, before crew3): everyone is in class. After school: a few leave;
    after the finale the hall is quiet again (DONE). ---------- */
 xLate:{name:'1학년 학생',zone:'yard',x:14,y:9,dir:'up',look:LOOK.xLate,
  hide:()=>!!f().metTeacher,
  talk:()=>[{say:'헉, 선배도 지각이에요?',face:'surprised'},{say:'오늘 버스 진짜 늦었죠?'},{say:'반장한테 걸리면 벌금이에요. 빨리 가요!'}]},
 xSoc1:{name:'2학년 학생',zone:'yard',x:17,y:7,dir:'right',look:LOOK.xSoc1,banmal:1,
  hide:()=>!lunchT(),
  talk:()=>[{say:'야, 전학생! 같이 공 찰래?'},{say:'점심시간은 짧아. 얼른 와.'}]},
 xSoc2:{name:'3학년 선배',zone:'yard',x:21,y:7,dir:'left',look:LOOK.xSoc2,banmal:1,
  hide:()=>!lunchT(),
  talk:()=>[{say:'패스! …아, 하필 골대 맞았어!'},{say:'2학년이야? 축구 좋아해?'}]},
 xBench1:{name:'1학년 학생',zone:'yard',x:8,y:10,dir:'right',look:LOOK.xBench1,
  hide:()=>!lunchT(),
  talk:()=>[{say:'선배, 안녕하세요!',face:'happy'},{say:'느티나무 밑이 제일 시원해요.'}]},
 xBench2:{name:'1학년 학생',zone:'yard',x:9,y:10,dir:'left',look:LOOK.xBench2,
  hide:()=>!lunchT(),
  talk:()=>[{say:'우리 둘이 동갑이에요. 당연하죠? 하하.'},{say:'밥 먹고 매일 여기서 얘기해요.'}]},
 xHome1:{name:'2학년 학생',zone:'yard',x:8,y:11,dir:'right',look:LOOK.xHome1,banmal:1,
  hide:()=>!f().crew3,
  talk:()=>[{say:'종례 끝! 이제 학원 가야 돼.'},{say:'지겹다… 너도 학원 다녀?'}]},
 xHome2:{name:'2학년 학생',zone:'yard',x:9,y:11,dir:'left',look:LOOK.xHome2,banmal:1,
  hide:()=>!f().crew3,
  script:()=>f().done?[{say:'아까 복도 스피커에서 노래 나왔지?',face:'surprised'},{say:'누가 튼 거야? 방송실은 문 닫았잖아.'}]:null,
  talk:()=>[{say:'너 방송부 한다며? 벌써 소문났어.'},{say:'축제 때 진짜 방송해? 대박.'}]},

 xHall1:{name:'2학년 학생',zone:'hall',x:2,y:7,dir:'right',look:LOOK.xHall1,banmal:1,
  hide:()=>!lunchT(),
  talk:()=>[{say:'밥 먹고 운동장 가자. 공 차자.'},{say:'어, 전학생이지? 같이 갈래?'}]},
 xHall2:{name:'2학년 학생',zone:'hall',x:3,y:7,dir:'left',look:LOOK.xHall2,banmal:1,
  hide:()=>!lunchT(),
  talk:()=>[{say:'나는 매점 먼저. 바나나우유 사야 돼.'},{say:'근데 맨날 다 팔려. 하필 나만 늦어.',face:'sad'}]},
 xNotice:{name:'1학년 학생',zone:'hall',x:19,y:1,dir:'up',look:LOOK.xNotice,
  hide:()=>!lunchT(),
  talk:()=>[{say:'축제가 다음 달이래요! 설레요.',face:'happy'},{say:'선배네 반은 뭐 해요?'}]},
 xWin:{name:'2학년 학생',zone:'hall',x:21,y:8,dir:'down',look:LOOK.xWin,banmal:1,
  hide:()=>!lunchT(),
  talk:()=>[{say:'창밖에 느티나무 봐. 진짜 크지?'},{say:'나도 처음 보고 엄청 놀랐어.'}]},
 xSenior:{name:'3학년 선배',zone:'hall',x:10,y:8,dir:'left',look:LOOK.xSenior,banmal:1,
  hide:()=>!lunchT(),
  talk:()=>[{say:'2학년이지? 위층은 3학년 교실이야.'},{say:'조용히 다녀. 다들 모의고사 때문에 예민해.'}]},
 xBye:{name:'1학년 학생',zone:'hall',x:8,y:7,dir:'down',look:LOOK.xBye,
  hide:()=>!f().crew3||!!f().done,
  talk:()=>[{say:'선배, 안녕히 가세요!',face:'happy'},{say:'저는 버스 타요. 오늘은 안 늦을 거예요.'}]},
 xClean:{name:'청소 아주머니',zone:'hall',x:20,y:7,dir:'left',look:LOOK.cleaner,
  hide:()=>!f().crew3||!!f().done,
  talk:()=>[{say:'학생, 하교해요? 조심히 가요.'},{say:'복도 방금 닦았어요. 뛰지 마요.'}]},

 xC1:{name:'반 친구',zone:'class',x:3,y:7,dir:'up',look:LOOK.xC1,sit:1,chair:CHAIR_N,banmal:1,
  hide:()=>!classT(),
  script:()=>f().deal?[{say:'종례 빨리 끝나면 좋겠다.'},{say:'오늘 학원 늦으면 큰일 나.'}]:null,
  talk:()=>[{say:'전학생이다! 반가워.'},{say:'우리 반 평범해. 근데 반장은 좀 무서워.'}]},
 xC2:{name:'반 친구',zone:'class',x:6,y:7,dir:'up',look:LOOK.xC2,sit:1,chair:CHAIR_N,banmal:1,
  hide:()=>!classT(),
  script:()=>f().deal?[{say:'축제? 우리 반은 뭐 하지?',face:'think'}]:null,
  talk:()=>[{say:'쉿, 수학 숙제 하는 중이야.'},{say:'…너 혹시 이거 알아? 아, 몰라도 돼.'}]},
 xC3:{name:'반 친구',zone:'class',x:2,y:9,dir:'up',look:LOOK.xC3,sit:1,chair:CHAIR_N,banmal:1,
  hide:()=>!classT(),
  script:()=>f().deal?[{say:'찬이가 또 소문냈어. 너 방송부 해?'}]:null,
  talk:()=>[{say:'지우개 좀 빌려줄래? …없어? 괜찮아.'},{say:'다온이한테 빌리면 이자 내야 돼. 농담이야.'}]},
 xC4:{name:'반 친구',zone:'class',x:14,y:7,dir:'up',look:LOOK.xC4,sit:1,chair:CHAIR_N,banmal:1,
  hide:()=>!classT(),
  script:()=>f().deal?[{say:'종례 끝나면 같이 집에 갈래?'}]:null,
  talk:()=>[{say:'어디서 왔어? …아, 비밀이야?'},{say:'여기 애들 다 착해. 금방 친해질 거야.'}]},
 xC5:{name:'반 친구',zone:'class',x:5,y:11,dir:'up',look:LOOK.xC5,sit:1,chair:CHAIR_N,banmal:1,
  hide:()=>!lunchT(),
  talk:()=>[{say:'나는 급식 안 먹어. 도시락 싸 왔어.'},{say:'엄마 김밥이 최고야. 하나 줄까?'}]},

 xK1:{name:'1학년 학생',zone:'cafe',x:5,y:3,dir:'up',look:LOOK.xK1,
  hide:()=>!lunchT(),
  talk:()=>[{say:'선배, 줄 서요? 여기가 끝이에요.'},{say:'오늘 불고기라서 줄이 길어요.'}]},
 xK2:{name:'1학년 학생',zone:'cafe',x:6,y:3,dir:'up',look:LOOK.xK2,
  hide:()=>!lunchT(),
  talk:()=>[{say:'배고파요… 일 분이 한 시간 같아요.',face:'sad'}]},
 xK3:{name:'2학년 학생',zone:'cafe',x:3,y:6,dir:'up',look:LOOK.xK3,sit:1,chair:STOOL_N,banmal:1,
  hide:()=>!lunchT(),
  talk:()=>[{say:'김치 진짜 맵다. 물, 물!',face:'surprised'}]},
 xK4:{name:'2학년 학생',zone:'cafe',x:9,y:8,dir:'down',look:LOOK.xK4,sit:1,chair:STOOL,banmal:1,
  hide:()=>!lunchT(),
  talk:()=>[{say:'너 3반 전학생이지? 소문 다 났어.'},{say:'방송실 귀신 봤다며? 진짜야?',face:'surprised'}]},
 xK5:{name:'2학년 학생',zone:'cafe',x:9,y:10,dir:'up',look:LOOK.xK5,sit:1,chair:STOOL_N,banmal:1,
  hide:()=>!lunchT(),
  talk:()=>[{say:'귀신 얘기는 찬이가 만든 거야.'},{say:'걔 원래 그래. 사실대로 말하는 날이 없어.'}]},
 xK6:{name:'3학년 선배',zone:'cafe',x:15,y:6,dir:'up',look:LOOK.xK6,sit:1,chair:STOOL_N,banmal:1,
  hide:()=>!lunchT(),
  talk:()=>[{say:'…혼자 먹는 게 편해.'},{say:'고3은 밥 먹을 시간도 아까워.'}]},
};
const FOLLOW=null;

/* the first line is one word, so nothing is lost if it goes by before the player is ready */
const INTRO=[{who:'…',say:'봄.'},{who:'…',say:'전학 첫날이에요.'},{who:'…',say:'그런데 버스가 십오 분 늦었어요.'},{who:'…',say:'여기가 느티고등학교. 진짜 큰 나무가 있어요.'}];
const DONE=['1교시 끝!','노래는 곧 멈췄어요. 복도가 다시 조용해요.','저쪽 신발장에 분홍색 종이가 보여요.','교실 교탁 위에 {복습 노트|복습 노트}가 있어요.'];

function questText(){
 const F=f();
 if(F.done)return '1교시 끝 · 교탁 위 복습 노트';
 if(!F.metTeacher)return F.foundTeacher?'교무실 · 담임 선생님하고 이야기':'교무실 · 담임 선생님 찾기';
 if(!F.paidFine)return '2학년 3반 · 반장 만나기';
 if(!F.seated&&!hasItem(NOTE)&&!has('일부러'))return '교실 · 내 자리 찾기';
 if(!hasItem(NOTE)&&!has('일부러'))return '교실 · 떨어진 지우개';
 if(!F.lunch)return '교실 · 다온한테 쪽지 보여 주기';
 if(!F.metChan)return '급식실 · 점심 먹기';
 if(!F.gotNotice)return '방송실 · 구석 찾기';
 if(!F.deal)return '교장실 · 안내문 전하기';
 if(!F.crew3)return '교실 · 종례';
 return '복도 · 하교하기';
}

/* ---------- school tiles ---------- */
const WALLISH=new Set(['wall','board','timetable','sideWin','streetWin','hallWin','classWin','notice','speaker','classDoor','exitDoor','cafDoor','bcDoor','bcSign','classSign','menu','snacks','rack','onair','poster','lockers','shoes','stairs']);
const wallish=(x,y)=>{const c=at(x,y);if(c==null)return true;const L=Z.legend[c];return !!L&&WALLISH.has(L.tile)};
function face(X,Y){r(X,Y,16,16,'#EDE3CF');r(X,Y,16,1,'#F8F2E6');r(X,Y+11,16,5,'#8FB8A0');r(X,Y+11,16,1,'#B1D3BE');r(X,Y+15,16,1,'#6E9A82')}
function cap(X,Y,x,y){r(X,Y,16,16,'#6B6157');r(X,Y,16,1,'#81766A');r(X,Y+15,16,1,'#5A5148');if(hash(x,y)<25)r(X+3+hash(y,x)%9,Y+5+hash(x,y)%6,2,1,'#74695E')}
function woodF(X,Y,x,y){r(X,Y,16,16,'#C99A62');for(let j=3;j<16;j+=4)r(X,Y+j,16,1,'#B5854F');const h=hash(x,y);r(X+(h%12)+2,Y+(h%4)*4,1,3,'#B5854F');r(X+(h*7%13),Y+((h>>2)%4)*4+1,2,1,'#D6AA74')}
function hallF(X,Y,x,y){r(X,Y,16,16,'#C9CCC0');r(X,Y,16,1,'#B9BCB0');r(X,Y,1,16,'#B9BCB0');const h=hash(x,y);r(X+h%13+1,Y+(h>>3)%13+1,1,1,'#A9AD9F');r(X+(h*3)%14+1,Y+(h*7)%14+1,1,1,'#DCDED4')}
function checkF(X,Y,x,y){r(X,Y,16,16,'#D8D2C2');r(X,Y,8,8,'#CBC4B2');r(X+8,Y+8,8,8,'#CBC4B2')}
function oldF(X,Y,x,y){r(X,Y,16,16,'#8E6E4E');for(let j=3;j<16;j+=5)r(X,Y+j,16,1,'#7A5C40');const h=hash(x,y);r(X+h%14,Y+(h>>2)%14,2,1,'#A58A6C');if(h<30)r(X+(h*5)%13,Y+(h*3)%13,1,1,'#B9A488')}
function sandF(X,Y,x,y){r(X,Y,16,16,'#D9BC8C');const h=hash(x,y);r(X+h%14+1,Y+(h>>3)%14+1,1,1,'#C4A574');r(X+(h*3)%14+1,Y+(h*7)%14+1,1,1,'#E8D3AA');if(h<20)r(X+(h*11)%13+1,Y+(h*5)%13+1,2,1,'#BFA06E')}
function bldg(X,Y,x,y){r(X,Y,16,16,'#E9E1D0');if(y===0){r(X,Y+6,16,10,'#E9E1D0');r(X,Y,16,6,'#7E8C8A');r(X,Y,16,1,'#9AA8A6');r(X,Y+6,16,1,'#5F6B6A')}
 else{r(X+3,Y+3,10,9,'#5E7F8E');r(X+4,Y+4,8,7,'#A9D8EC');r(X+8,Y+4,1,7,'#5E7F8E');r(X+5,Y+5,2,1,'#E6F6FC');if(y===3)r(X,Y+14,16,2,'#B9AE98')}}
/* one 4×4 tree drawn across its tiles: find the block's top-left, clip to this tile, paint the whole tree */
function blockOrigin(x,y,ch){let ox=x,oy=y;while(at(ox-1,y)===ch)ox--;while(at(x,oy-1)===ch)oy--;return [ox,oy]}
function inTile(X,Y,fn){g.save();g.beginPath();g.rect(X,Y,16,16);g.clip();fn();g.restore()}
const disc=(cx,cy,rad,c)=>{g.fillStyle=c;g.beginPath();g.arc(cx,cy,rad,0,Math.PI*2);g.fill()};

const TILES={
 wall:(X,Y,x,y)=>{if(!wallish(x,y+1)||(y===MH-1&&!wallish(x,y-1)))face(X,Y);else cap(X,Y,x,y)},
 wood:(X,Y,x,y)=>woodF(X,Y,x,y),
 hallFloor:(X,Y,x,y)=>hallF(X,Y,x,y),
 checkFloor:(X,Y,x,y)=>checkF(X,Y,x,y),
 oldFloor:(X,Y,x,y)=>oldF(X,Y,x,y),
 sand:(X,Y,x,y)=>sandF(X,Y,x,y),
 doorway:(X,Y,x,y)=>{checkF(X,Y,x,y);r(X,Y,2,16,'#A9794A');r(X+14,Y,2,16,'#A9794A');r(X+2,Y,12,2,'#B9BCB0')},
 /* classroom */
 board:(X,Y,x,y)=>{face(X,Y);const L=at(x-1,y)!=='B',R=at(x+1,y)!=='B';r(X,Y+1,16,11,'#8A5E36');r(X+(L?2:0),Y+2,16-(L?2:0)-(R?2:0),9,'#2F5A46');
  const h=hash(x,y),c='#E3ECE4';if(!L&&!R){r(X+2+h%5,Y+4,6,1,c);r(X+3,Y+7,4+h%6,1,c);if(h%3===0)r(X+10,Y+5,2,2,'#F2C46B')}
  if(L){r(X+4,Y+4,2,1,c);r(X+7,Y+4,3,1,c);r(X+4,Y+6,8,1,'#C9D6CC')}if(R){r(X+3,Y+4,1,5,'#F2A38A');r(X+5,Y+5,6,1,c)}
  r(X,Y+12,16,1,'#B98E58');r(X+3+h%8,Y+11,2,1,'#FFFFFF')},
 timetable:(X,Y)=>{face(X,Y);r(X+3,Y+1,10,9,'#F4F1E6');r(X+3,Y+1,10,2,'#E07A5A');for(let i=0;i<3;i++)r(X+4,Y+4+i*2,8,1,'#C9C2B0');r(X+7,Y+3,1,7,'#C9C2B0')},
 sideWin:(X,Y,x,y,t)=>{cap(X,Y,x,y);r(X+4,Y,8,16,'#EDE3CF');r(X+5,Y,6,16,'#A9D8EC');r(X+6,Y,1,16,'#D6F0FA');r(X+5,Y+15,6,1,'#EDE3CF');
  if(hash(x,y)%3===0){const s=Math.round(Math.sin(t/900+y));r(X+8+s,Y+4,3,3,'#6FA86A')}if(y%4===1)r(X+5,Y,6,4,'#F2E2B0')},
 /* the 방송실's windows face the street, not the yard: STREET (below) seen through dusty glass. They are in the east wall, so the
    view is turned like the wall: ART.rot(…,1) puts its sky at the outer edge and its road at the room edge; each tile down the
    wall shows the next 16px of it. */
 streetWin:(X,Y,x,y,t)=>{cap(X,Y,x,y);r(X+3,Y,10,16,'#E2D8C2');r(X+4,Y,8,16,'#B4C3C6');  // a wider pane than sideWin: 8px of view
  const v=STREET.east||(STREET.east=ART.rot(STREET.rows,1)),o=(y%4)*16;ART.put(v.slice(o,o+16),STREET.pal,X+4,Y);
  r(X+4,Y+3,1,1,'#D5DCDC');r(X+9,Y+11,1,1,'#D5DCDC')},
 desk:(X,Y,x,y)=>{woodF(X,Y,x,y);r(X+1,Y+2,14,7,'#E3C08A');r(X+1,Y+2,14,1,'#F0D6A8');r(X+1,Y+8,14,1,'#B98E58');r(X+2,Y+9,1,4,'#6F757C');r(X+13,Y+9,1,4,'#6F757C');
  if(!seatPulled(x,y)){r(X+4,Y+11,8,4,'#4F6F8F');r(X+4,Y+11,8,1,'#6C8DAD')}/* the chair, tucked in */const h=hash(x,y);if(h<40)r(X+3,Y+3,4,4,['#E07A5A','#5A8FB0','#7CB46A'][h%3]);if(h%3===0)r(X+9,Y+5,4,1,'#E8B93A')},
 tdesk:(X,Y,x,y)=>{woodF(X,Y,x,y);r(X,Y+3,16,11,'#9C6B3E');r(X,Y+3,16,3,'#B9844F');r(X,Y+3,16,1,'#CF9E66');r(X+2,Y+9,12,1,'#7E5430');r(X+3,Y+1,3,4,'#F2F0EA');r(X+9,Y+3,5,2,'#F4F1E6')},
 terminal:(X,Y,x,y,t)=>{woodF(X,Y,x,y);r(X,Y+3,16,11,'#9C6B3E');r(X,Y+3,16,3,'#B9844F');r(X+2,Y+9,12,1,'#7E5430');
  r(X+2,Y,12,7,'#3E5E8C');r(X+3,Y+1,10,5,'#F7F3E8');r(X+7,Y+1,1,5,'#C9BFA8');r(X+4,Y+2,2,1,'#9AA3B5');r(X+4,Y+4,3,1,'#9AA3B5');r(X+9,Y+2,3,1,'#9AA3B5');r(X+9,Y+4,2,1,'#9AA3B5');
  const due=state&&dueWords().length>0;if(due){const on=Math.floor(t/350)%2;r(X+11,Y,4,4,on?'#F2C46B':'#E8962A');r(X+12,Y+1,2,2,on?'#FFF3C4':'#F2C46B')}},
 lockers:(X,Y,x,y)=>{r(X,Y,16,16,'#8E9BA8');r(X,Y,16,1,'#B3BEC9');const h=hash(x,y);
  [[1,1],[9,1],[1,8],[9,8]].forEach(([a,b],i)=>{r(X+a,Y+b,6,6,'#6E7B88');r(X+a,Y+b,6,1,'#5E6A76');if((h+i)%3===0)r(X+a+1,Y+b+2,4,4,['#E07A5A','#3E5E8C','#7CB46A','#F2C46B'][(h+i)%4]);r(X+a+5,Y+b+3,1,1,'#C9D2DA')})},
 /* 다온's 벌금 저금통: a pink pig with a coin slot on a small stool */
 piggy:(X,Y,x,y)=>{woodF(X,Y,x,y);r(X+3,Y+10,10,2,'#8E9BA8');r(X+3,Y+10,10,1,'#B3BEC9');r(X+4,Y+12,1,4,'#6F757C');r(X+11,Y+12,1,4,'#6F757C');
  r(X+4,Y+3,8,7,'#F2A0B0');r(X+3,Y+4,10,5,'#F2A0B0');r(X+5,Y+3,4,1,'#F9C9D2');r(X+6,Y+2,4,1,'#8A4A58');r(X+4,Y+2,2,2,'#E07A8E');
  r(X+12,Y+5,3,3,'#E07A8E');r(X+13,Y+6,1,1,'#8A4A58');r(X+10,Y+4,1,1,'#1B1E2B');r(X+5,Y+6,4,2,'#FFFFFF');r(X+4,Y+9,2,1,'#E07A8E');r(X+10,Y+9,2,1,'#E07A8E')},
 classDoor:(X,Y,x,y)=>{face(X,Y);r(X+2,Y+1,12,15,'#A9794A');r(X+2,Y+1,12,1,'#C4925F');r(X+4,Y+3,8,5,'#BFE3F0');r(X+5,Y+4,2,1,'#E6F6FC');r(X+11,Y+10,2,2,'#5A3E26')},
 /* corridor */
 classWin:(X,Y,x,y)=>{face(X,Y);r(X+1,Y+1,14,9,'#F8F2E6');r(X+2,Y+2,12,7,'#C9D6CC');r(X+3,Y+6,4,2,'#C99A62');r(X+9,Y+6,4,2,'#C99A62');r(X+8,Y+2,1,7,'#F8F2E6')},
 hallWin:(X,Y,x,y,t)=>{face(X,Y);r(X+1,Y+1,14,10,'#F8F2E6');r(X+2,Y+2,12,8,'#A9D8EC');const s=Math.round(Math.sin(t/1100+x));r(X+2,Y+6+s,12,4-s,'#6FA86A');r(X+5,Y+5+s,4,2,'#86BE7C');
  r(X+8,Y+2,1,8,'#F8F2E6');r(X+3,Y+3,2,1,'#E6F6FC');if(ZID==='bcast'){g.fillStyle='rgba(180,170,150,.45)';g.fillRect(X+2,Y+2,12,8)}},
 notice:(X,Y,x,y)=>{face(X,Y);const L=at(x-1,y)!=='N';r(X+(L?1:0),Y+1,L?15:15,10,'#8A5E36');r(X+(L?2:0),Y+2,L?14:14,8,'#C49A6C');
  if(L){r(X+3,Y+3,5,6,'#F4F1E6');r(X+9,Y+4,4,4,'#F2C46B');r(X+5,Y+3,1,1,'#D2533F')}else{r(X+1,Y+3,6,4,'#BFE3F0');r(X+8,Y+3,4,6,'#F4F1E6');r(X+9,Y+8,3,2,'#F4F1E6');r(X+10,Y+3,1,1,'#3A86C8')}},
 speaker:(X,Y,x,y,t)=>{face(X,Y);r(X+4,Y+1,8,7,'#D8D4CA');r(X+4,Y+1,8,1,'#ECE9E1');r(X+4,Y+8,8,1,'#9A968C');for(let i=0;i<3;i++)for(let j=0;j<2;j++)r(X+5+i*2,Y+3+j*2,1,1,'#7A766C');
  if(state.f.done){const p=Math.floor(t/250)%3;r(X+13,Y+3,1,3,p>0?'#E8962A':'#EDE3CF');r(X+14+(p>1?1:0),Y+2,1,5,p>1?'#E8962A':'#EDE3CF');r(X+2,Y+3,1,3,p>0?'#E8962A':'#EDE3CF')}},
 cabinet:(X,Y,x,y)=>{checkF(X,Y,x,y);r(X+1,Y+1,14,15,'#9AA3AD');r(X+1,Y+1,14,1,'#B9C1C9');[5,10].forEach(b=>r(X+2,Y+b,12,1,'#7A838D'));[3,8,13].forEach(b=>r(X+7,Y+b,2,1,'#5A626B'))},
 water:(X,Y,x,y)=>{checkF(X,Y,x,y);r(X+4,Y+4,8,12,'#F2F0EA');r(X+4,Y+15,8,1,'#C9C6BC');r(X+5,Y,6,5,'#8FC8E8');r(X+6,Y+1,1,3,'#C4E6F6');r(X+6,Y+8,1,2,'#D2533F');r(X+9,Y+8,1,2,'#3A86C8');r(X+5,Y+11,6,1,'#9A968C')},
 plant:(X,Y,x,y)=>{checkF(X,Y,x,y);r(X+5,Y+10,6,6,'#B5653A');r(X+5,Y+10,6,1,'#D07E52');r(X+3,Y+3,10,7,'#3F8F4A');r(X+5,Y+1,6,3,'#3F8F4A');r(X+5,Y+3,2,2,'#6CC07A');r(X+10,Y+6,2,2,'#6CC07A')},
 odesk:(X,Y,x,y)=>{checkF(X,Y,x,y);r(X,Y+4,16,10,'#8C96A0');r(X,Y+4,16,3,'#B9C2CA');r(X,Y+13,16,1,'#6A737C');const h=hash(x,y);
  if(h%2){r(X+4,Y,8,6,'#2B3238');r(X+5,Y+1,6,4,'#69CFD8');r(X+7,Y+6,2,1,'#2B3238')}else{r(X+2,Y+3,6,4,'#F4F1E6');r(X+3,Y+2,6,4,'#FFFFFF');r(X+11,Y+2,3,4,'#C8443A')}},
 trophy:(X,Y,x,y)=>{checkF(X,Y,x,y);r(X+1,Y,14,16,'#7A5230');r(X+2,Y+1,12,6,'#5A3A20');r(X+2,Y+8,12,6,'#5A3A20');r(X+4,Y+3,3,4,'#E8B93A');r(X+5,Y+2,1,1,'#F7D98C');r(X+9,Y+4,3,3,'#C9C6C2');
  r(X+3,Y+10,2,4,'#3E5E8C');r(X+5,Y+10,2,4,'#B8433A');r(X+7,Y+11,2,3,'#7CB46A');r(X+10,Y+9,3,5,'#F4F1E6')},
 pdesk:(X,Y,x,y)=>{checkF(X,Y,x,y);r(X,Y+2,16,12,'#5E3A22');r(X,Y+2,16,3,'#7A4E2E');r(X,Y+2,16,1,'#93623C');r(X,Y+13,16,1,'#432817');
  if(at(x-1,y)==='K'){r(X+4,Y+2,8,2,'#E8B93A');r(X+5,Y+2,6,1,'#F7D98C')}else{r(X+9,Y-2,3,5,'#F4F1E6');r(X+8,Y-3,2,2,'#F2A38A');r(X+11,Y-3,2,2,'#E86D8A');r(X+3,Y+1,5,2,'#F4F1E6')}},
 sofa:(X,Y,x,y)=>{checkF(X,Y,x,y);r(X+1,Y+2,14,12,'#2E2A2E');r(X+1,Y+2,14,4,'#4A444A');r(X+1,Y+2,2,12,'#3A353A');r(X+13,Y+2,2,12,'#3A353A');r(X+3,Y+7,10,1,'#5A545A')},
 lowTable:(X,Y,x,y)=>{checkF(X,Y,x,y);r(X+2,Y+5,12,7,'#8A5E36');r(X+2,Y+5,12,1,'#A67444');r(X+4,Y+6,3,3,'#F2F0EA');r(X+5,Y+7,1,1,'#7CB46A');r(X+9,Y+7,3,3,'#F2F0EA');r(X+10,Y+8,1,1,'#7CB46A')},
 shoes:(X,Y,x,y)=>{face(X,Y);r(X,Y,16,16,'#B9905E');r(X,Y,16,1,'#D2A970');const h=hash(x,y);
  for(let i=0;i<3;i++)for(let j=0;j<2;j++){r(X+1+j*8,Y+1+i*5,6,4,'#7E5A34');if((h+i+j)%4)r(X+2+j*8,Y+3+i*5,4,2,(h+i)%3?'#F2F0EA':'#5A8FB0')}
  if(state.f.done&&x===2)r(X+3,Y+6,4,3,'#F2A38A')},
 exitDoor:(X,Y,x,y)=>{if(ZID==='bcast')oldF(X,Y,x,y);else checkF(X,Y,x,y);r(X,Y,16,16,'#6E7B88');r(X+1,Y+1,14,15,'#BFE3F0');r(X+2,Y+2,3,1,'#E6F6FC');const L=at(x-1,y)!==at(x,y);r(L?X+15:X,Y,1,16,'#6E7B88');r(L?X+12:X+3,Y+8,1,3,'#3A4046')},
 stairs:(X,Y,x,y)=>{r(X,Y,16,16,'#B8BCB0');for(let j=0;j<16;j+=4){r(X,Y+j,16,1,'#8E9286');r(X,Y+j+1,16,1,'#D2D6CA')}if(at(x-1,y)!=='S')r(X,Y,2,16,'#7A5A3A');if(at(x+1,y)!=='S')r(X+14,Y,2,16,'#7A5A3A')},
 cafDoor:(X,Y,x,y)=>{face(X,Y);const L=at(x-1,y)!=='F';r(X+(L?2:0),Y+2,14,14,'#C27A4A');r(X+(L?2:0),Y+2,14,1,'#D9925E');r(X+(L?5:4),Y+5,6,4,'#BFE3F0');r(L?X+14:X+1,Y+9,1,3,'#5A3E26');if(L)r(X+10,Y,6,2,'#F2C46B');else r(X,Y,6,2,'#F2C46B')},
 /* 방송실 door: tall, narrow, framed, with a small dark window and a knob, so it reads as a door; the sign beside it ('q') names the room */
 bcDoor:(X,Y,x,y)=>{face(X,Y);r(X+2,Y+1,12,15,'#5A3E26');r(X+3,Y+2,10,14,'#8E5E3A');r(X+3,Y+2,10,1,'#A87448');
  r(X+5,Y+3,6,4,'#2B2E36');r(X+6,Y+4,2,1,'#5A6478');r(X+5,Y+9,6,5,'#7A4E2E');r(X+6,Y+10,4,3,'#8E5E3A');
  r(X+11,Y+9,2,2,'#E8B93A');r(X+11,Y+9,2,1,'#F7D98C')},
 /* the 2-3 class plate beside its door: a white plate with a green band and "2-3" in a 3×5 pixel font */
 classSign:(X,Y,x,y)=>{face(X,Y);r(X+2,Y+1,12,9,'#8A8E96');r(X+3,Y+2,10,7,'#F4F1E6');r(X+3,Y+2,10,1,'#3E7A5A');
  const D=['111001111100111','111001111001111'];  // "2" and "3", 3 wide × 5 tall, row by row
  const glyph=(g,ox)=>{for(let i=0;i<15;i++)if(D[g][i]==='1')r(X+ox+i%3,Y+4+(i/3|0),1,1,'#2B3038')};
  glyph(0,3);r(X+7,Y+6,2,1,'#2B3038');glyph(1,10);r(X+7,Y+10,2,1,'#8A8E96')},  // 2, a gap, the dash, a gap, 3
 bcSign:(X,Y,x,y,t)=>{face(X,Y);const on=state.f.done&&Math.floor(t/500)%2;
  r(X+2,Y+1,12,9,'#8A8E96');r(X+3,Y+2,10,7,'#F4F1E6');r(X+4,Y+3,8,2,on?'#FF6A5A':'#A8443C');r(X+5,Y+3,6,1,on?'#FFD0C8':'#C45A50');
  r(X+4,Y+6,3,1,'#3E4350');r(X+8,Y+6,4,1,'#3E4350');r(X+7,Y+10,2,1,'#8A8E96')},
 /* cafeteria */
 menu:(X,Y,x,y)=>{face(X,Y);r(X+1,Y+1,15,10,'#2F3A44');if(at(x+1,y)!=='M')r(X+15,Y+1,1,10,'#EDE3CF');const L=at(x-1,y)!=='M';r(X+(L?3:1),Y+3,8,1,'#F2C46B');r(X+(L?3:1),Y+5,10,1,'#E3ECE4');r(X+(L?3:1),Y+7,6,1,'#E3ECE4')},
 kitchen:(X,Y,x,y,t)=>{r(X,Y,16,16,'#C9CDC4');r(X+2,Y+5,12,10,'#AEB4B8');r(X+2,Y+5,12,2,'#D3D8DB');r(X+3,Y+6,10,1,'#7A8086');
  const s=Math.round(Math.sin(t/300+x)*2);g.fillStyle='rgba(255,255,255,.55)';g.fillRect(X+6+s,Y+1,2,3);g.fillRect(X+9-s,Y,2,2)},
 serve:(X,Y,x,y)=>{checkF(X,Y,x,y);r(X,Y+2,16,13,'#AEB4B8');r(X,Y+2,16,4,'#D3D8DB');r(X,Y+14,16,1,'#7A8086');r(X+2,Y+3,12,2,['#F4F1E6','#E0884A','#C8443A','#7CB46A','#9A5A3A'][x%5]);r(X,Y,16,1,'#E6F2F6')},
 lunchTable:(X,Y,x,y)=>{checkF(X,Y,x,y);if(!seatPulledN(x,y)){r(X+3,Y,4,3,'#B85E44');r(X+9,Y,4,3,'#B85E44')}/* far-side stools, tucked in behind the table */r(X,Y+3,16,8,'#E8E2D2');r(X,Y+3,16,1,'#F6F2E8');r(X,Y+10,16,1,'#B9B2A0');const h=hash(x,y);
  if(h%3){r(X+3,Y+4,10,5,'#9AA8B0');r(X+4,Y+5,3,2,'#F4F1E6');r(X+8,Y+5,2,2,'#C8443A');r(X+10,Y+6,2,2,'#E0884A')}if(!seatPulled(x,y)){r(X+3,Y+12,4,3,'#E07A5A');r(X+9,Y+12,4,3,'#E07A5A')}/* two stools, tucked in */},
 snacks:(X,Y,x,y)=>{face(X,Y);r(X,Y+1,16,14,'#9C6B3E');r(X+1,Y+2,14,5,'#6E4A2A');r(X+1,Y+8,14,5,'#6E4A2A');const h=hash(x,y),C=['#E07A5A','#F2C46B','#5A8FB0','#7CB46A','#E86D8A','#F7D154'];
  for(let i=0;i<4;i++){r(X+2+i*3,Y+3,2,4,C[(h+i)%6]);r(X+2+i*3,Y+9,2,4,i%2?'#F7D154':C[(h+i+2)%6])}},
 shopCounter:(X,Y,x,y)=>{checkF(X,Y,x,y);r(X,Y+3,16,11,'#C98F5A');r(X,Y+3,16,3,'#E3B07A');r(X,Y+13,16,1,'#8A5E36');
  if(x%2){r(X+3,Y,3,4,'#F7D154');r(X+7,Y,3,4,'#F7D154');r(X+3,Y,3,1,'#5A8FB0');r(X+7,Y,3,1,'#5A8FB0')}else{r(X+4,Y,8,4,'#3E4350');r(X+5,Y+1,4,1,'#69CFD8')}},
 vending:(X,Y,x,y,t)=>{checkF(X,Y,x,y);r(X+1,Y,14,16,'#C8443A');r(X+1,Y,14,1,'#E0655A');r(X+3,Y+2,8,8,'#BFE3F0');for(let i=0;i<3;i++){r(X+4+i*2,Y+3,1,2,'#F2C46B');r(X+4+i*2,Y+6,1,2,'#7CB46A')}
  r(X+12,Y+3,2,1,Math.floor(t/600)%2?'#7CF07A':'#2E5A2E');r(X+3,Y+12,8,2,'#2B2E36')},
 /* broadcast room */
 rack:(X,Y,x,y)=>{face(X,Y);r(X,Y+1,16,14,'#6B4A2E');r(X+1,Y+2,14,5,'#3E2A1A');r(X+1,Y+8,14,5,'#3E2A1A');const h=hash(x,y),C=['#E3ECE4','#F2C46B','#E07A5A','#5A8FB0','#B9C1C9'];
  for(let i=0;i<7;i++){r(X+1+i*2,Y+3,1,4,C[(h+i)%5]);r(X+1+i*2,Y+9,1,4,C[(h+i*3)%5])}},
 onair:(X,Y,x,y,t)=>{face(X,Y);r(X+2,Y+3,12,6,'#2B2E36');const on=state.f.done&&Math.floor(t/700)%3===0;r(X+3,Y+4,10,4,on?'#E85A4A':'#5A2E2E');r(X+5,Y+5,6,1,on?'#FFD0C8':'#6E3A3A')},
 poster:(X,Y,x,y)=>{face(X,Y);const L=at(x-1,y)!=='O';r(X+(L?1:0),Y+1,L?15:14,12,'#6B4A2E');r(X+(L?2:0),Y+2,L?14:13,10,'#F2BFA0');r(X+(L?2:0),Y+2,L?14:13,1,'#F7D6C0');
  if(L){r(X+7,Y+3,4,5,'#5A5F6E');r(X+8,Y+4,2,3,'#8E94A0');r(X+8,Y+8,2,3,'#5A5F6E')}else{r(X+1,Y+3,9,1,'#C49A6C');r(X+1,Y+5,7,1,'#C49A6C');r(X+1,Y+8,10,1,'#E0A890')}},
 mixer:(X,Y,x,y)=>{oldF(X,Y,x,y);r(X,Y+3,16,10,'#3A3E48');r(X,Y+3,16,2,'#535866');r(X,Y+12,16,1,'#22252C');
  for(let i=0;i<4;i++){r(X+2+i*4,Y+6,1,5,'#1E2128');r(X+1+i*4,Y+7+(hash(x+i,y)%3),3,2,'#B9C1C9');r(X+2+i*4,Y+4,1,1,'#4A2A2A')}r(X+3,Y+3,3,1,'#8A8E96');r(X+10,Y+4,2,1,'#8A8E96')},
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
 /* yard */
 building:(X,Y,x,y)=>bldg(X,Y,x,y),
 clock:(X,Y,x,y)=>{bldg(X,Y,x,y);r(X,Y,16,16,'#E9E1D0');const cx=at(x-1,y)==='C'?X:X+16,cy=Y+8;inTile(X,Y,()=>{disc(cx,cy,8,'#3E4C5A');disc(cx,cy,7,'#F7F3E8');
  g.fillStyle='#2B2E36';const F=state.f,hr=F.done?4:F.lunch?12.5:9.25,mn=F.done?0:F.lunch?30:15;
  const hand=(a,len,w)=>{g.save();g.translate(cx,cy);g.rotate(a);g.fillRect(-w/2,-len,w,len);g.restore()};hand(hr/12*Math.PI*2,4,2);hand(mn/60*Math.PI*2,6,1)})},
 entrance:(X,Y,x,y)=>{r(X,Y,16,16,'#E9E1D0');r(X,Y+1,16,13,'#3E5E6E');r(X+1,Y+2,14,11,'#A9D8EC');r(X+2,Y+3,2,1,'#E6F6FC');const L=at(x-1,y)!=='E';r(L?X+15:X,Y+1,1,13,'#3E5E6E');r(L?X+12:X+3,Y+7,1,3,'#2B2E36');r(X,Y+14,16,2,'#C9C2B0')},
 bed:(X,Y,x,y)=>{sandF(X,Y,x,y);r(X,Y+2,16,10,'#6E4A2E');r(X,Y+11,16,4,'#B5653A');r(X,Y+11,16,1,'#D07E52');r(X,Y+14,16,1,'#8A4A2A');const h=hash(x,y);
  [[2,4,'#F7D154'],[7,6,'#E86D8A'],[11,3,'#F7D154'],[13,7,'#FFFFFF'],[4,8,'#E86D8A']].forEach(([a,b,c],i)=>{if((h+i)%4){r(X+a,Y+b+1,1,2,'#3E8E3A');r(X+a-1,Y+b,3,1,c);r(X+a,Y+b-1,1,1,c)}})},
 zelkova:(X,Y,x,y,t)=>{sandF(X,Y,x,y);const [ox,oy]=blockOrigin(x,y,'Y'),bx=X-(x-ox)*16,by=Y-(y-oy)*16,s=Math.sin(t/1400)*1.2;
  inTile(X,Y,()=>{g.fillStyle='rgba(60,40,20,.18)';g.beginPath();g.ellipse(bx+32,by+58,28,6,0,0,Math.PI*2);g.fill();
   r(bx+27,by+30,10,30,'#6E4A2E');r(bx+29,by+30,3,30,'#8A6040');r(bx+22,by+56,20,4,'#6E4A2E');r(bx+20,by+24,6,3,'#6E4A2E');r(bx+38,by+22,6,3,'#6E4A2E');})},
 zelkovaTop:(X,Y,x,y,t)=>{const [ox,oy]=blockOrigin(x,y,'Y');if(x!==ox||y!==oy)return;  // the canopy: drawn once, over the characters, free to overhang the row above
  const bx=X,by=Y,s=Math.sin(t/1400)*1.2;
   disc(bx+32+s,by+25,27,'#256640');disc(bx+32+s,by+22,27,'#2F7A4E');disc(bx+18+s,by+28,15,'#2F7A4E');disc(bx+46+s,by+28,15,'#2F7A4E');
   disc(bx+28+s,by+16,18,'#3F9460');disc(bx+44+s,by+20,10,'#3F9460');disc(bx+16+s,by+22,9,'#3F9460');
   disc(bx+24+s,by+10,8,'#5DB070');disc(bx+40+s,by+12,6,'#5DB070');disc(bx+14+s,by+18,4,'#5DB070')},
 ybench:(X,Y,x,y)=>{sandF(X,Y,x,y);const T=at(x,y-1)!=='n';r(X+4,Y+(T?2:0),9,T?14:12,'#B68350');for(let j=(T?4:2);j<16;j+=4)r(X+4,Y+j,9,1,'#9A6A3C');r(X+3,Y+(T?2:0),1,T?14:12,'#6E4A28');if(!T)r(X+4,Y+12,2,3,'#6E4A28')},
 goal:(X,Y,x,y)=>{sandF(X,Y,x,y);const L=at(x-1,y)!=='g';for(let i=2;i<15;i+=3)r(X,Y+i,16,1,'#E6E2D6');for(let i=1;i<16;i+=3)r(X+i,Y+2,1,13,'#E6E2D6');
  r(X,Y+1,16,2,'#F7F7F2');r(L?X+1:X+13,Y+1,2,15,'#F7F7F2')},
 booth:(X,Y,x,y)=>{sandF(X,Y,x,y);const T=at(x,y-1)!=='b',L=at(x-1,y)!=='b';
  if(T){r(X,Y+4,16,12,'#E9E1D0');r(X,Y+2,16,4,'#3E5A46');r(X,Y+2,16,1,'#5A7A62');if(L){r(X+4,Y+8,9,6,'#5E7F8E');r(X+5,Y+9,7,4,'#A9D8EC');r(X+6,Y+10,2,1,'#F7F3E8')}}
  else{r(X,Y,16,14,'#E9E1D0');r(X,Y+13,16,1,'#B9AE98');if(!L){r(X+5,Y+2,7,12,'#6E5A44');r(X+10,Y+8,1,1,'#E8B93A')}else{r(X+3,Y+3,6,5,'#5E7F8E');r(X+4,Y+4,4,3,'#A9D8EC')}}},
 fence:(X,Y,x,y)=>{sandF(X,Y,x,y);const H=at(x-1,y)==='f'||at(x+1,y)==='f'||at(x-1,y)==='G'||at(x+1,y)==='G';
  if(H){r(X,Y+6,16,2,'#3E5A46');r(X,Y+11,16,2,'#3E5A46');for(let i=1;i<16;i+=4){r(X+i,Y+2,2,13,'#4F7A5E');r(X+i,Y+2,2,1,'#6E9A7A')}}
  else{r(X+7,Y,2,16,'#4F7A5E');r(X+6,Y,1,16,'#3E5A46');for(let j=2;j<16;j+=5)r(X+5,Y+j,6,2,'#3E5A46')}},
 gate:(X,Y,x,y)=>{sandF(X,Y,x,y);r(X,Y+3,16,2,'#2B2E36');r(X,Y+13,16,2,'#2B2E36');for(let i=1;i<16;i+=3)r(X+i,Y+3,1,12,'#3E4350');const L=at(x-1,y)!=='G';r(L?X:X+13,Y,3,16,'#9AA3AD');r(L?X:X+13,Y,3,1,'#C9D2DA')},
};
const PLAYER=LOOK.player;
return {WORDS,DICT,CONFUSE,BANK,Q,ITEMS,ZONES,NPC,FOLLOW,INTRO,DONE,questText,TILES,PLAYER};
}});
