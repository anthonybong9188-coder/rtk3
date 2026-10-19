import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2.6});
p.on('requestfailed',r=>console.log('FAIL',r.url()));p.on('response',r=>{if(r.status()>=400)console.log('HTTP',r.status(),r.url())});
await p.goto('file:///tmp/claude-0/-home-claude/3caa1e0b-7a90-56f6-b65a-93a3eae7fddc/scratchpad/rtk3-game.html');await p.click('#newBtn');await p.waitForTimeout(200);await p.click('[data-r="normal"]');await p.waitForTimeout(300);
await p.evaluate(()=>{const gens=['zhangfei','guanyu','zhaoyun'].map(GN);playCampaignBattle({id:99,fac:'shu',from:'jiangxia',to:'xiangyang',gens:gens.map(g=>g.id),troops:9000,rice:3000,left:0,total:2,train:70},C('xiangyang'),gens,[GN('caoren'),GN('yujin')])});
await p.waitForTimeout(2500);await p.screenshot({path:'sc_map.png'});
await p.evaluate(async()=>{speed=1;const a=G.units.find(u=>u.id==='zhangfei'),d=enemies()[0];d.x=a.x+1;d.y=a.y;d.px=d.x;d.py=d.y;doAttack(a,d,{})});
for(const t of [900,1900,2900,3800]){await p.waitForTimeout(t===900?900:1000);await p.screenshot({path:`sc_${t}.png`})}
await b.close();
