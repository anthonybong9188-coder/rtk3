import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///tmp/claude-0/-home-claude/3caa1e0b-7a90-56f6-b65a-93a3eae7fddc/scratchpad/rtk3-game.html');await p.click('#newBtn');await p.waitForTimeout(200);await p.click('[data-r="normal"]');await p.waitForTimeout(300);
await p.evaluate(()=>{const gens=['zhaoyun','zhugeliang','zhangfei'].map(GN);playCampaignBattle({id:99,fac:'shu',from:'jiangxia',to:'xiangyang',gens:gens.map(g=>g.id),troops:9000,rice:3000,left:0,total:2,train:70},C('xiangyang'),gens,[GN('caoren'),GN('yujin')])});
await p.waitForTimeout(2500);
// cavalry charge: move Zhao Yun two tiles away to trigger a charge
await p.evaluate(()=>{speed=1;const a=G.units.find(u=>u.id==='zhaoyun'),d=enemies()[0];d.x=a.x+1;d.y=a.y;d.px=d.x;d.py=d.y;doAttack(a,d,{charge:true,dist:1})});
for(const t of [1200,2400]){await p.waitForTimeout(1200);await p.screenshot({path:`cav_${t}.png`})}
await p.waitForTimeout(2500);
await p.evaluate(()=>{const a=G.units.find(u=>u.id==='zhugeliang'),d=enemies()[1]||enemies()[0];d.x=a.x+2;d.y=a.y;d.px=d.x;d.py=d.y;doAttack(a,d,{})});
await p.waitForTimeout(1300);await p.screenshot({path:'arc.png'});
console.log('errors',errs);await b.close();
