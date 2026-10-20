import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('requestfailed',r=>{if(/portraits/.test(r.url()))errs.push('FAIL '+r.url())});
await p.goto('file://'+process.cwd()+'/rtk3-game.html');await p.click('#newBtn');await p.waitForTimeout(200);await p.click('[data-r="normal"]');await p.waitForTimeout(800);
console.log(await p.evaluate(async()=>{const by={};for(const g of Object.values(S.gens)){const k=g.fac||'free';by[k]=(by[k]||0)+1}
 const bad=[];for(const g of Object.values(S.gens))if(g.img)await new Promise(r=>{const i=new Image();i.onload=r;i.onerror=()=>{bad.push(g.img);r()};i.src='portraits/'+g.img+'.webp'});
 return {total:Object.keys(S.gens).length,by,bad}}),errs);await b.close();
