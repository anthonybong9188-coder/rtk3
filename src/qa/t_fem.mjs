import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('response',r=>{if(r.status()>=400)errs.push(r.url())});p.on('requestfailed',r=>{if(/portraits/.test(r.url()))errs.push('FAIL '+r.url())});
await p.goto('file://'+process.cwd()+'/rtk3-game.html');await p.click('#newBtn');await p.waitForTimeout(200);await p.click('[data-r="normal"]');await p.waitForTimeout(800);
console.log(await p.evaluate(()=>['sunshangxiang','daqiao','xiaoqiao','diaochan','huangyueying','guanyinping','zhurong','caiwenji'].map(id=>{const g=S.gens[id];return g?`${id}:${g.fac}@${g.city}${g.hidden?' hidden':''} img=${g.img}`:id+':MISSING'})));
await p.evaluate(()=>{const gens=['guanyinping','huangyueying','diaochan'].map(GN);playCampaignBattle({id:99,fac:'shu',from:'jiangxia',to:'xiangyang',gens:gens.map(g=>g.id),troops:9000,rice:3000,left:0,total:2,train:70},C('xiangyang'),gens,[GN('caoren')])});
await p.waitForTimeout(1500);await p.evaluate(()=>{document.querySelector('#dlg').hidden=true;prepBegin()});await p.waitForTimeout(800);await p.screenshot({path:'fem_battle.png'});
console.log(errs.filter(e=>!/googleapis/.test(e)));await b.close();
