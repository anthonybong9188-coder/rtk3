import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/rtk3-game.html');await p.click('#newBtn');await p.waitForTimeout(200);await p.click('[data-r="normal"]');await p.waitForTimeout(1500);
await p.evaluate(()=>{window._mo=marchOut(['zhangfei','guanyu','zhaoyun'].map(GN),12000,C('xiangyang'))});
for(const t of [400,1000,1600]){await p.waitForTimeout(600);await p.screenshot({path:`march_${t}.png`})}
await p.evaluate(()=>window._mo);console.log('stage hidden after:',await p.evaluate(()=>$('#stage').hidden),errs);await b.close();
