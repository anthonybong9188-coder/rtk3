import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const b=await chromium.launch();const errs=[],out=[];
for(const sp of [0,1]){const p=await b.newPage({viewport:{width:1000,height:460}});p.on('pageerror',e=>errs.push(`sp${sp} ${e.message} @ ${(e.stack||'').split('\n')[1]}`));
await p.goto('file:///tmp/claude-0/-home-claude/3caa1e0b-7a90-56f6-b65a-93a3eae7fddc/scratchpad/rtk3-game.html');await p.click('#newBtn');await p.waitForTimeout(300);
await p.evaluate(sp=>{speed=sp;const gens=['zhangfei','guanyu','zhaoyun','zhugeliang'].map(GN);const a={id:99,fac:'shu',from:'jiangxia',to:'xiangyang',gens:gens.map(g=>g.id),troops:20000,rice:3000,left:0,total:2,train:70};
  window.__res=null;playCampaignBattle(a,C('xiangyang'),gens,['caoren','xuchu','yujin','yuejin'].map(GN)).then(x=>window.__res=x)},sp);
await p.waitForTimeout(1500);
for(const k of ['roar','sweep','lone','wind']){
  const r=await p.evaluate(async k=>{const h=HERO[k];const s=G.units.find(u=>u.id===h.who);if(!s)return k+': no unit';
    // put two enemies next to him
    const es=enemies();const free=[[1,0],[-1,0],[0,1],[0,-1]].map(([dx,dy])=>({x:s.x+dx,y:s.y+dy})).filter(t=>inb(t.x,t.y)&&!unitAt(t.x,t.y)&&terAt(t.x,t.y)!=='w');
    es.slice(0,2).forEach((e,i)=>{if(free[i]){e.x=e.px=free[i].x;e.y=e.py=free[i].y}});
    s.cd={};const tg=h.self?null:(h.targets(s)[0]||null);if(!h.self&&!tg)return k+': no target';
    const before=enemies().map(e=>e.troops).join(',');const t0=performance.now();
    const res=await Promise.race([heroAct(k,s,tg),new Promise(r=>setTimeout(()=>r('TIMEOUT'),25000))]);G.busy=false;
    return `${k}: ${res??'ok'} ${Math.round(performance.now()-t0)}ms enemies ${before} -> ${enemies().map(e=>e.troops).join(',')}`},k);
  out.push(`sp${sp} `+r)}
// duels: Zhang Fei vs each enemy, random choices
for(let d=0;d<4;d++){const r=await p.evaluate(async d=>{const s=G.units.find(u=>u.side==='shu'&&u.war>90),e=enemies()[d%enemies().length];if(!s||!e)return 'no duelists';
    const pr=playDuel(s,e);const t=setInterval(()=>{const dd=document.querySelector('#duelDone');if(dd&&!dd.hidden){(dd.querySelector('button')||dd).click();return}const bs=[...document.querySelectorAll('.duelBtns button')].filter(x=>!x.disabled&&!x.hidden);if(bs.length)bs[Math.floor(Math.random()*bs.length)].click()},300);
    const res=await Promise.race([pr,new Promise(r=>setTimeout(()=>r('TIMEOUT'),40000))]);clearInterval(t);return 'duel '+JSON.stringify(res).slice(0,80)},d);out.push(`sp${sp} `+r)}
await p.close()}
await b.close();console.log(JSON.stringify({errs:[...new Set(errs)],out},null,1));
