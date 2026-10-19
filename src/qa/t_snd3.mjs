import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},hasTouch:true,isMobile:true,deviceScaleFactor:2});
await p.goto('file://'+process.cwd()+'/rtk3-game.html');await p.click('#newBtn');await p.waitForTimeout(200);await p.click('[data-r="normal"]');await p.waitForTimeout(300);
await p.evaluate(()=>{const gens=['zhangfei','guanyu','zhaoyun'].map(GN);playCampaignBattle({id:99,fac:'shu',from:'jiangxia',to:'xiangyang',gens:gens.map(g=>g.id),troops:9000,rice:3000,left:0,total:2,train:70},C('xiangyang'),gens,[GN('caoren'),GN('yujin')]);setTimeout(()=>{document.querySelector('#dlg').hidden=true;prepBegin()},400)});
await p.waitForTimeout(2000);
const r=await p.$$eval('.sndbtn',bs=>bs.map(b=>b.getBoundingClientRect()).filter(r=>r.width).map(r=>[r.x+r.width/2,r.y+r.height/2]));
await p.touchscreen.tap(...r[0]);await p.waitForTimeout(400);await p.screenshot({path:'snd.png'});
await p.$eval('#vSfx',e=>{e.value=30;e.dispatchEvent(new Event('input'))});console.log(await p.evaluate(()=>SND.set));await b.close();
