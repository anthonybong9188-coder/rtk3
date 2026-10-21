import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/rtk3-game.html');await p.waitForTimeout(1200);await p.evaluate(()=>document.getElementById('newBtn').click());await p.waitForTimeout(200);await p.click('[data-r="normal"]');await p.waitForTimeout(800);
const out=[];
await p.evaluate(()=>{UI.noConfirm=true;window.monthFx=()=>{};const c=C('jiangxia'),g=S.gens.zhaoyun;window.__t=[c.train];const m=doCmd('train',g,c,'shu');g.assign={k:'train',left:2,dur:3,from:65,tot:window.__t?0:0};g.assign.tot=c.train-65;window.__t.push(c.train)});
for(let i=0;i<3;i++){await p.evaluate(()=>{window.__d=0;endMonth().then(()=>window.__d=1)});for(let k=0;k<400;k++){await p.waitForTimeout(30);const d=await p.evaluate(()=>{const b=document.querySelector('#dlg:not([hidden]) button.primary');if(b)b.click();const a=document.querySelector('#actFx');if(a)a.click();return window.__d});if(d)break}
 out.push(await p.evaluate(()=>[dateStr(),C('jiangxia').train,JSON.stringify(S.gens.zhaoyun.assign),S.log.filter(l=>/Zhao Yun/.test(l.h)).slice(0,2).map(l=>l.h).join(' || ').replace(/<[^>]+>/g,'')]))}
console.log(await p.evaluate(()=>window.__t),out,errs);await b.close();
