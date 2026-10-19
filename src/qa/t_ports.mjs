import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412}});
await p.goto('file://'+process.cwd()+'/rtk3-game.html');await p.click('#newBtn');await p.waitForTimeout(200);await p.click('[data-r="normal"]');await p.waitForTimeout(500);
const r=await p.evaluate(async()=>{const bad=[];const ids=[...new Set(S.gens?Object.values(S.gens).map(g=>g.img).filter(Boolean):[])];
 for(const f of ids){await new Promise(res=>{const im=new Image();im.onload=()=>res();im.onerror=()=>{bad.push(f);res()};im.src=`portraits/${f}.webp`})}return {n:ids.length,bad}});
console.log(r);await b.close();
