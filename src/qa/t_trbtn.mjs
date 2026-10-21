import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/rtk3-game.html');await p.click('#newBtn');await p.waitForTimeout(200);await p.click('[data-r="normal"]');await p.waitForTimeout(800);
await p.screenshot({path:'trbtn.png'});await p.click('.trbtn');await p.waitForTimeout(300);console.log(await p.evaluate(()=>document.querySelector('#dlgbox h2')?.textContent),errs);await b.close();
