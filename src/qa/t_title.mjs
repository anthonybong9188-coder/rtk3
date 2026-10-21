import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const errs=[];
for(const [w,h,t] of [[915,412,'land'],[412,860,'port']]){const b=await chromium.launch();const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:2});p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/rtk3-game.html');await p.waitForTimeout(1500);await p.screenshot({path:`ti_${t}_lb.png`});
await p.click('[data-tm="hero"]');await p.waitForTimeout(900);await p.screenshot({path:`ti_${t}_hero.png`});
console.log(t,await p.evaluate(()=>[$('#newBtn').hidden,$('#heroBtn').hidden,$('#tlogo').textContent]));await b.close()}
console.log(errs);
