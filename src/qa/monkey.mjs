// random tapping on every visible button/control, with invariant checks
import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const RUNS=+process.argv[2]||3,TAPS=+process.argv[3]||600;
const inv=fs.readFileSync(new URL('./inv.js',import.meta.url),'utf8');
const b=await chromium.launch();const errs=[],viol=[],stats=[];
for(let r=0;r<RUNS;r++){const vp=r%2?{width:412,height:860}:{width:900,height:412};
  const p=await b.newPage({viewport:vp,hasTouch:false});p.on('pageerror',e=>errs.push(`r${r} ${e.message} @ ${(e.stack||'').split('\n').slice(1,3).join(' | ')}`));
  await p.goto('file:///tmp/claude-0/-home-claude/3caa1e0b-7a90-56f6-b65a-93a3eae7fddc/scratchpad/rtk3-game.html');await p.addScriptTag({content:inv});
  await p.evaluate(r=>{let s=r*7919+3;Math.random=()=>{s=(s*16807)%2147483647;return (s-1)/2147483646};window.__rr=Math.random;try{localStorage.clear()}catch(e){};window.speed=0},r);
  let seen=new Set(),last=0;
  for(let t=0;t<TAPS;t++){
    const info=await p.evaluate(()=>{const R=window.__rr;
      const vis=el=>{const b=el.getBoundingClientRect();if(b.width<2||b.height<2)return false;if(el.closest('[hidden]'))return false;const cs=getComputedStyle(el);return cs.visibility!=='hidden'&&cs.display!=='none'};
      // prefer the top-most layer
      const layers=['#actFx','#destPick','#dlg:not([hidden])','#modal:not([hidden])','#battleView:not([hidden])','#mapView:not([hidden])','#campaign:not([hidden])','#title:not([hidden])'];
      let root=null;for(const s of layers){const e=document.querySelector(s);if(e&&vis(e)){root=e;break}}if(!root)root=document.body;
      let els=[...root.querySelectorAll('button:not([disabled]),input[type=range],[data-city],canvas')].filter(vis);
      // never go back to title/ start over too often
      els=els.filter(e=>!/Back to title|Start over/.test(e.textContent)||R()<.03);
      if(!els.length)return {none:true,root:root.id};
      const e=els[Math.floor(R()*els.length)];const b=e.getBoundingClientRect();
      if(e.type==='range'){e.value=Math.floor(R()*(+e.max+1));e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));return {range:1}}
      return {x:b.left+b.width*(.2+R()*.6),y:b.top+b.height*(.2+R()*.6),lbl:(e.dataset.r||e.dataset.act||e.dataset.cmd||e.id||e.tagName)+''}});
    if(info.x!=null){await p.mouse.click(info.x,info.y).catch(()=>{});seen.add(info.lbl)}
    await p.waitForTimeout(info.lbl==='endMonth'?400:40);
    if(t%25===0){const v=await p.evaluate(t=>typeof S!=='undefined'&&S?__inv('r'+t):[],r).catch(()=>[]);if(v.length>last){viol.push(...v.slice(last));last=v.length}}
  }
  stats.push(`run ${r} ${vp.width}x${vp.height}: tapped ${seen.size} distinct controls, now ${await p.evaluate(()=>S?dateStr():'title')}`);await p.close()}
await b.close();console.log(JSON.stringify({errs:[...new Set(errs)].slice(0,25),viol:[...new Set(viol)].slice(0,25),stats},null,1));
