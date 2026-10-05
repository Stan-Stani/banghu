// Hands-on controller for manual playtests: one persistent phone-sized Chrome; each command does one thing like a player would
// and saves a screenshot. Usage (from the repo root):
//   node tests/manual/ctl.mjs start [ch1]     open the game fresh (no saves) at 400×820
//   node tests/manual/ctl.mjs key <Key> [n]   press a key n times: ArrowUp/Down/Left/Right, z (A), x (B), m (START), Enter, 1–4
//   node tests/manual/ctl.mjs walk <dir> <n>  take n steps (up/down/left/right)
//   node tests/manual/ctl.mjs tap <x> <y>     tap the screen at a point (CSS px of the 400×820 screenshot)
//   node tests/manual/ctl.mjs tapword <word>  tap the first visible word with this text (as a finger would)
//   node tests/manual/ctl.mjs shot            just look
//   node tests/manual/ctl.mjs stop
// After each action it prints the screenshot path and the text a player can see (dialogue, choices, popups, toasts).
import {spawn,execSync} from 'node:child_process';import fs from 'node:fs';import path from 'node:path';
const ROOT=path.resolve(path.dirname(new URL(import.meta.url).pathname),'../..');const DIR='/tmp/banghu-manual';const PORT=9555;
const [,,cmd,...args]=process.argv;const wait=ms=>new Promise(r=>setTimeout(r,ms));
fs.mkdirSync(DIR+'/shots',{recursive:true});
if(cmd==='stop'){try{execSync(`pkill -9 -f "user-data-dir=${DIR}/[p]rof"`)}catch(e){}console.log('stopped');process.exit(0)}
if(cmd==='start'){
  try{execSync(`pkill -9 -f "user-data-dir=${DIR}/[p]rof"`)}catch(e){}await wait(500);
  fs.rmSync(DIR+'/prof',{recursive:true,force:true});fs.copyFileSync(ROOT+'/index.html',DIR+'/index.html');
  for(const f of fs.readdirSync(DIR+'/shots'))fs.unlinkSync(DIR+'/shots/'+f);
  const c=spawn('flatpak',['run',`--filesystem=${DIR}`,'com.google.Chrome','--headless=new','--mute-audio','--disable-gpu','--hide-scrollbars',`--remote-debugging-port=${PORT}`,`--user-data-dir=${DIR}/prof`,'about:blank'],{stdio:'ignore',detached:true});c.unref();
}
let ws;for(let i=0;i<60&&!ws;i++){try{const l=await (await fetch(`http://127.0.0.1:${PORT}/json`)).json();const p=l.find(x=>x.type==='page');if(p)ws=p.webSocketDebuggerUrl}catch(e){}if(!ws)await wait(500)}
if(!ws){console.log('browser not running — use: start');process.exit(1)}
const sock=new WebSocket(ws);await new Promise(r=>sock.onopen=r);let id=0;const pend={};
sock.onmessage=m=>{const d=JSON.parse(m.data);if(d.id&&pend[d.id]){pend[d.id](d.result||d);delete pend[d.id]}};
const cdp=(m,p={})=>new Promise(r=>{const i=++id;pend[i]=r;sock.send(JSON.stringify({id:i,method:m,params:p}))});
const ev=async e=>(await cdp('Runtime.evaluate',{expression:e,returnByValue:true})).result?.value;
await cdp('Emulation.setDeviceMetricsOverride',{width:400,height:820,deviceScaleFactor:2,mobile:true});
const KEYS={ArrowUp:38,ArrowDown:40,ArrowLeft:37,ArrowRight:39,z:90,x:88,m:77,Enter:13,' ':32,'1':49,'2':50,'3':51,'4':52};
const press=async(k,hold=60)=>{const code=KEYS[k]||0;await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:k,windowsVirtualKeyCode:code});await wait(hold);await cdp('Input.dispatchKeyEvent',{type:'keyUp',key:k,windowsVirtualKeyCode:code});await wait(120)};
const tap=async(x,y)=>{for(const type of ['mousePressed','mouseReleased'])await cdp('Input.dispatchMouseEvent',{type,x,y,button:'left',clickCount:1});await wait(250)};
if(cmd==='start'){await cdp('Page.navigate',{url:`file://${DIR}/index.html?ch=${args[0]||'ch1'}`});await wait(2500)}
else if(cmd==='key'){for(let i=0;i<(+args[1]||1);i++)await press(args[0]);await wait(500)}
else if(cmd==='walk'){const k={up:'ArrowUp',down:'ArrowDown',left:'ArrowLeft',right:'ArrowRight'}[args[0]];for(let i=0;i<(+args[1]||1);i++){await press(k,170);await wait(80)}await wait(300)}
else if(cmd==='tap'){await tap(+args[0],+args[1]);await wait(300)}
else if(cmd==='tapword'){const r=await ev(`(()=>{const w=[...document.querySelectorAll('.w,.gl,button,.mo,.mi,.choice,.tile,a')].find(e=>!e.closest("[hidden]")&&e.getClientRects().length&&e.textContent.trim()===${JSON.stringify(args.join(' '))});if(!w)return null;const b=w.getBoundingClientRect();return [b.x+b.width/2,b.y+b.height/2]})()`);
  if(!r){console.log('no visible "'+args.join(' ')+'" to tap')}else{await tap(r[0],r[1]);await wait(300)}}
else if(cmd!=='shot'&&cmd!=='start'){console.log('unknown command');process.exit(1)}
const n=fs.readdirSync(DIR+'/shots').length;const file=`${DIR}/shots/${String(n).padStart(3,'0')}-${cmd}${args.length?'-'+args.join('_').replace(/[^\w가-힣-]/g,''):''}.png`;
const shot=await cdp('Page.captureScreenshot',{format:'png'});fs.writeFileSync(file,Buffer.from(shot.data,'base64'));
const seen=await ev(`(()=>{const vis=e=>e&&!e.closest("[hidden]")&&e.getClientRects().length>0,o=[];const t=id=>document.getElementById(id);
 if(vis(t('dlg')))o.push('DIALOGUE ['+(t('who')?.textContent||'')+'] '+t('txt').textContent);
 const ch=[...document.querySelectorAll('.choice')].filter(vis).map((b,i)=>(i+1)+') '+b.textContent.trim());if(ch.length)o.push('CHOICES '+ch.join('  '));
 const tl=[...document.querySelectorAll('#tiles .tile, #tiles button')].filter(vis).map(b=>b.textContent.trim());if(tl.length)o.push('WORD TILES '+tl.join(' | '));
 if(vis(t('gloss')))o.push('POPUP '+t('gloss').innerText.replace(/\\s+/g,' '));
 if(vis(t('toast')))o.push('TOAST '+t('toast').textContent);
 const q=t('questTxt')||t('quest');if(q&&q.textContent)o.push('목표 '+q.textContent);
 for(const p of document.querySelectorAll('.panel'))if(vis(p))o.push('PANEL '+p.innerText.replace(/\\s+/g,' ').slice(0,400));
 return o.join('\\n')})()`);
console.log(file+'\n'+(seen||'(no text on screen)'));sock.close();process.exit(0);
