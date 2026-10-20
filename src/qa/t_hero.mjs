import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});
const errs=[];p.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await p.goto('file://'+process.cwd()+'/rtk3-game.html');await p.waitForTimeout(1500);
await p.evaluate(()=>document.getElementById('heroBtn').click());await p.waitForTimeout(300);await p.fill('#heroName','Long Aotian The Great');await p.click('[data-r="ok"]');await p.waitForTimeout(300);
await p.click('[data-r="roll"]');await p.waitForTimeout(200);await p.screenshot({path:'h1.png'});await p.click('[data-r="ok"]');await p.waitForTimeout(300);await p.click('[data-r="normal"]');await p.waitForTimeout(1200);
await p.screenshot({path:'h2.png'});
console.log(await p.evaluate(()=>({name:S.gens.hero.name,stats:[S.gens.hero.war,S.gens.hero.int,S.gens.hero.pol,S.gens.hero.cha],city:S.sel,own:Object.values(S.cities).map(c=>c.id+':'+c.owner).join(' '),lb:Object.values(S.gens).filter(g=>g.fac==='lb').length,shu:Object.values(S.gens).filter(g=>g.fac==='shu').map(g=>g.id)})));
// search 4 times as hero, one per month
for(let m=0;m<4;m++){
 await p.evaluate(()=>{S.gens.hero.acted=false;UI.mode='cmd';UI.cmd='search';renderCampaign()});await p.waitForTimeout(200);
 await p.evaluate(()=>document.querySelector('[data-gen="hero"]').click());await p.waitForTimeout(3500);
 if(m===0){await p.waitForTimeout(5000);await p.screenshot({path:'h3.png'})}
 await p.waitForTimeout(m===0?9000:500);await p.evaluate(()=>{const d=document.querySelector('#dlg:not([hidden]) [data-r="ok"]');if(d)d.click()});await p.waitForTimeout(400);
 for(let k=0;k<3;k++){await p.evaluate(()=>{const o=document.querySelector('#dlg:not([hidden]) [data-r="ok"]');if(o)o.click()});await p.waitForTimeout(300)}
}
console.log(await p.evaluate(()=>GODS.map(id=>S.gens[id].name+':'+S.gens[id].fac+'@'+S.gens[id].city)));
// end some months
for(let i=0;i<3;i++){await p.evaluate(()=>{document.querySelectorAll('#dlg').forEach(d=>d.hidden=true)});await p.evaluate(async()=>{speed=0;try{await endMonth(true)}catch(e){console.log('em',e.message)}});await p.waitForTimeout(1500);for(let k=0;k<6;k++){const o=await p.$('#dlg:not([hidden]) button.primary');if(o){await o.click();await p.waitForTimeout(300)}}}
console.log(await p.evaluate(()=>({date:S.year+'/'+S.month,own:Object.values(S.cities).map(c=>c.id+':'+c.owner).join(' ')})),errs);
await p.evaluate(()=>{openMap()});await p.waitForTimeout(600);await p.screenshot({path:'h4.png'});await b.close();
