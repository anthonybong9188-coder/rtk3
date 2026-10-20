import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const errs=[];
for(const [w,h,tag] of [[915,412,'wide'],[412,860,'tall']]){
const b=await chromium.launch();const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:2,hasTouch:true});p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/rtk3-game.html');await p.click('#newBtn');await p.waitForTimeout(200);await p.click('[data-r="normal"]');await p.waitForTimeout(800);
const n=await p.evaluate(()=>document.querySelectorAll('[data-bio]').length);
const el=await p.$('[data-bio="guanyu"]')||await p.$('[data-bio]');console.log(tag,'bio buttons',n);
if(el){await el.scrollIntoViewIfNeeded();await el.click()}else await p.evaluate(()=>bioDlg('guanyu'));
await p.waitForTimeout(500);await p.screenshot({path:`bio_${tag}.png`});
console.log(tag,await p.evaluate(()=>document.querySelector('.bio h2')?.textContent));await b.close()}
console.log(errs);
