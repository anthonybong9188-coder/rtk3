import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1000,height:460},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///tmp/claude-0/-home-claude/3caa1e0b-7a90-56f6-b65a-93a3eae7fddc/scratchpad/rtk3-game.html');await p.click('#newBtn');await p.waitForTimeout(200);await p.click('[data-r="normal"]');await p.waitForTimeout(300);
await p.screenshot({path:'x0.png'});
await p.evaluate(()=>{const c=C('changsha');c.owner='shu';for(const g of gensIn('changsha'))g.fac='shu';renderCampaign()});
await p.click('[data-act="transfer"]');await p.waitForTimeout(200);
await p.evaluate(()=>{for(const b of [...document.querySelectorAll('.glist input:checked')])b.click()});await p.waitForTimeout(150);
await p.click('[data-pickdest]');await p.waitForTimeout(250);await p.click('[data-pk="changsha"]');await p.waitForTimeout(150);await p.click('[data-pkgo]');await p.waitForTimeout(200);
await p.evaluate(()=>{const g=document.querySelector('#mGold');g.value=800;g.dispatchEvent(new Event('input'));g.dispatchEvent(new Event('change'));const r=document.querySelector('#mRice');r.value=5000;r.dispatchEvent(new Event('input'));r.dispatchEvent(new Event('change'))});await p.waitForTimeout(200);
await p.screenshot({path:'x1.png'});
await p.click('[data-r="go"]');await p.waitForTimeout(200);
console.log(await p.evaluate(()=>JSON.stringify({jx:[C('jiangxia').gold,C('jiangxia').rice],army:S.armies.map(a=>[a.to,a.troops,a.gold,a.rice]),log:S.log[0].h})));
await p.evaluate(()=>{UI.noConfirm=true;window.monthFx=()=>{};window.monthSummary=async()=>{}});
for(let i=0;i<2;i++){await p.evaluate(()=>{window.__d=false;endMonth().then(()=>window.__d=true)});for(let k=0;k<100;k++){await p.waitForTimeout(40);if(await p.evaluate(()=>{const d=document.querySelector('#dlg');if(!d.hidden){const b=d.querySelector('[data-r="auto"]')||d.querySelector('[data-r].primary');b&&b.click()}return window.__d}))break}}
console.log(await p.evaluate(()=>JSON.stringify({cs:[C('changsha').gold,C('changsha').rice],armies:S.armies.filter(a=>a.fac==='shu').length})));
console.log('errors',errs);await b.close();
