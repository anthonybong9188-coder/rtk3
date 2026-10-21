import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},hasTouch:true,deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/rtk3-game.html');await p.waitForTimeout(1200);await p.evaluate(()=>document.getElementById('newBtn').click());await p.waitForTimeout(200);await p.click('[data-r="normal"]');await p.waitForTimeout(800);
await p.evaluate(()=>openMap());await p.waitForTimeout(500);
await p.tap('[data-mfac="wu"]');await p.waitForTimeout(300);const a=await p.evaluate(()=>UI.mfac);await p.tap('[data-mfac="wu"]');await p.waitForTimeout(300);const b2=await p.evaluate(()=>UI.mfac);
await p.$eval('[data-city="changsha"]',e=>e.scrollIntoView({block:'center',inline:'center'}));await p.tap('[data-city="changsha"]');await p.waitForTimeout(500);
console.log({pillOn:a,pillOff:b2,sel:await p.evaluate(()=>S.sel),mapHidden:await p.evaluate(()=>$('#mapView').hidden)},errs);await b.close();
