// Static checks for every chapter: node tests/validate.mjs → exits 1 on problems.
import fs from 'node:fs';import vm from 'node:vm';
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]).filter(x=>!x.includes('window.LEX='));
const ctx={state:{f:{},items:[],badges:[],lv:{}},ZID:'',console};vm.createContext(ctx);
vm.runInContext(scripts[0].replace('const CHAPTERS','var CHAPTERS'),ctx);
for(const s of scripts.slice(1,-1))vm.runInContext(s,ctx);
const errs=[];const allWords=new Map();
for(const CH of ctx.CHAPTERS){
 const E=m=>errs.push(`${CH.id}: ${m}`);
 for(const k of ['id','n','title','save','start','make','words','color','place'])if(CH[k]==null)E('missing '+k);
 ctx.state={f:{},items:[],badges:[],lv:{}};const C=CH.make();
 if(C.WORDS.length!==CH.words)E(`words count ${C.WORDS.length} ≠ ${CH.words}`);
 for(const w of C.WORDS){if(allWords.has(w))E(`word "${w}" already taught in ${allWords.get(w)}`);allWords.set(w,CH.id)}
 const walk=(Z,x,y)=>{const c=Z.map[y]&&Z.map[y][x];return !!(c&&Z.legend[c]&&Z.legend[c].walk)};
 const st=CH.start;if(!C.ZONES[st.zone]||!walk(C.ZONES[st.zone],st.x,st.y))E('start not walkable');
 for(const [id,Z] of Object.entries(C.ZONES)){
  const W=Z.map[0].length;Z.map.forEach((r,i)=>{if(r.length!==W)E(`${id} row ${i} len ${r.length}≠${W}`);[...r].forEach(c=>{if(!Z.legend[c])E(`${id} unknown tile char "${c}"`)})});
  if(Z.map.length<10||W<11)E(`${id} map smaller than the 11x10 view`);
  for(const L of Object.values(Z.legend))if(!(L.tile in (C.TILES||{}))&&!['hull','deck','grate','window','console','hydro','bunk','terminal','pipes','engine','airlock','ring','plate','planetWin','crate','stall','lift','tree','lawn','stone','dome','cable','police','cafe','flowers','pond','bench'].includes(L.tile))E(`${id} tile fn missing: ${L.tile}`);
  for(const [k,w] of Object.entries(Z.warps||{})){const [x,y]=k.split(',').map(Number);if(!walk(Z,x,y))E(`${id} warp ${k} not walkable`);const T=C.ZONES[w.to];if(!T){E(`${id} warp to unknown ${w.to}`);continue}if(!walk(T,w.x,w.y)||(T.warps||{})[w.x+','+w.y])E(`${id} warp ${k} lands on bad tile ${w.to} ${w.x},${w.y}`)}
  for(const [c,th] of Object.entries(Z.things||{})){ // a line for every tile of a kind
   if(!Z.legend[c])E(`${id} things key "${c}" is not a tile in its legend`);else if(Z.legend[c].walk)E(`${id} things "${c}" is a walkable tile`);
   if(!Z.map.some(r=>r.includes(c)))E(`${id} things "${c}" is not on the map`);
   const vs=[].concat(typeof th==='function'?th(0,0):th).filter(Boolean);
   for(const v of vs){if(typeof v!=='string')E(`${id} things "${c}" gives a non-string`);else if(/[A-Za-z]/.test(v)||v.length>60)E(`${id} things "${c}" line is English or too long: ${v}`)}}
  for(const k of Object.keys(Z.spots||{})){const [x,y]=k.split(',').map(Number);if(walk(Z,x,y))E(`${id} spot ${k} is on a walkable tile`)}
  for(const k of Z.npcs){const n=C.NPC[k];if(!n){E('no npc '+k);continue}if(n.zone!==id)E(`npc ${k} zone ${n.zone}≠${id}`);if(!walk(Z,n.x,n.y))E(`npc ${k} on unwalkable ${n.x},${n.y}`)}
 }
 const qs=[...Object.values(C.Q).flat(),...(C.BANK||[])];const hasQ=new Set(qs.map(q=>q.w).filter(Boolean));
 for(const q of qs){if(q.w&&!C.WORDS.includes(q.w))E(`question w "${q.w}" not a chapter word`);if(q.opts&&!q.opts.some(o=>o[1]))E('question without a right answer: '+q.ask);if(q.opts)q.opts.filter(o=>!o[1]).forEach(o=>{if(!o[2])E('wrong option without explanation: '+o[0])})}
 const badge=new Set(Object.values(C.NPC).flatMap(n=>n.badge||[]));
 for(const w of C.WORDS){if(!hasQ.has(w))E('no question for '+w);if(!C.DICT[w])E('no DICT for '+w);else for(const k of ['k','e','ex'])if(!C.DICT[w][k])E(`DICT ${w} missing ${k}`);if(!badge.has(w))E('no NPC teaches '+w)}
 const src=CH.make.toString();for(const m of src.matchAll(/\{([^|{}'"`]+)\|([^}'"`]+)\}/g))if(/[가-힣]/.test(m[1])&&!C.DICT[m[2]])E('gloss key missing: '+m[2]);
 if(typeof C.questText()!=='string')E('questText must return a string');
}
// the engine is generated from the shared walk-engine: the copy here must match it
{const shared=new URL('../../walk-engine/engine.js',import.meta.url);if(fs.existsSync(shared)){const mine=fs.readFileSync(new URL('../src/engine.js',import.meta.url),'utf8').replace(/^\/\*[^\n]*\*\/\n/,'');
 if(mine!==fs.readFileSync(shared,'utf8')){errs.push('src/engine.js differs from walk-engine/engine.js — edit walk-engine and run its sync.sh')}}}
console.log(errs.length?errs.join('\n'):`ok · ${ctx.CHAPTERS.length} chapter(s), ${allWords.size} words`);process.exit(errs.length?1:0);
