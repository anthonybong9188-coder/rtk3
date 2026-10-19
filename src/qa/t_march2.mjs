import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/rtk3-game.html');await p.click('#newBtn');await p.waitForTimeout(200);await p.click('[data-r="normal"]');await p.waitForTimeout(800);
await p.evaluate(()=>openMarch('jiangxia','xiangyang'));await p.waitForTimeout(500);
await p.evaluate(()=>{for(const id of ['zhangfei','guanyu']){const i=document.querySelector(`[data-g="${id}"]`);if(i&&!i.checked){i.checked=true;i.dispatchEvent(new Event('change'))}}});await p.waitForTimeout(300);
await p.click('[data-r="go"]');await p.waitForTimeout(800);
console.log('stage visible:',await p.evaluate(()=>!$('#stage').hidden),await p.evaluate(()=>$('#cap').textContent));
await p.screenshot({path:'march_real.png'});await p.waitForTimeout(2000);console.log('stage after',await p.evaluate(()=>$('#stage').hidden),errs);await b.close();
