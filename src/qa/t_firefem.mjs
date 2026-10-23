import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/rtk3-game.html');await p.waitForFunction(()=>typeof newHeroCampaign==='function');
await p.evaluate(()=>{newHeroCampaign('normal',{name:'Long Aotian',stats:{war:90,int:85,pol:80,cha:88}});for(const id of GODS){const g=S.gens[id];g.fac='shu';g.hidden=false;g.city='luling'}UI={mode:'city',cmd:null,busy:false};showScreen('campaign');renderCampaign();
 playCampaignBattle({id:99,fac:'shu',from:'luling',to:'guiyang',gens:['xuannu'],troops:5000,rice:2000,left:0,total:2,train:60},C('guiyang'),[GN('xuannu')],[GN('zhaofan')]);setTimeout(()=>{document.querySelector('#dlg').hidden=true;prepBegin()},400)});
await p.waitForTimeout(1800);
await p.evaluate(()=>{speed=1;const s=G.units.find(u=>u.id==='xuannu'),e=enemies()[0];e.x=s.x+2;e.y=s.y;e.px=e.x;e.py=e.y;window.__f=playFire(s,e,500,e.troops)});
for(const t of [700,1500,2300]){await p.waitForTimeout(t===700?700:800);await p.screenshot({path:`ff_${t}.png`})}
console.log(errs);await b.close();
