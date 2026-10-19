import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/rtk3-game.html');await p.click('#newBtn');await p.waitForTimeout(200);await p.click('[data-r="normal"]');await p.waitForTimeout(300);
for(const [etype,dx,dy] of [['cav',2,2],['spear',2,-2],['cav',3,0],['shield',1,1]]){
 await p.evaluate(()=>{const gens=['zhangfei','guanyu','zhaoyun'].map(GN);playCampaignBattle({id:99,fac:'shu',from:'jiangxia',to:'xiangyang',gens:gens.map(g=>g.id),troops:9000,rice:3000,left:0,total:2,train:70},C('xiangyang'),gens,[GN('caoren'),GN('yujin')])});
 await p.waitForTimeout(1500);
 const r=await p.evaluate(async([etype,dx,dy])=>{speed=0;const zf=G.units.find(u=>u.id==='zhangfei'),zy=G.units.find(u=>u.id==='zhaoyun'),es=enemies();
  zf.type='spear';zf.x=5;zf.y=5;zy.x=5+dx;zy.y=5+dy;const e=es[0];e.type=etype;e.x=zy.x+1;e.y=zy.y;e.px=e.x;e.py=e.y;for(const o of es.slice(1)){o.x=1;o.y=1;o.stun=1}
  for(const u of G.units.filter(u=>u.side==='shu'&&u!==zf&&u!==zy)){u.x=1;u.y=12}
  zf.guard=true;const zfT=zf.troops,zyT=zy.troops;const pe=window.planEnemy;
  planEnemy=x=>x===e?{path:[],target:zy}:{path:[],target:null};
  await endTurn();await new Promise(r=>setTimeout(r,500));planEnemy=pe;
  return {zfHit:zf.troops<zfT,zyHit:zy.troops<zyT,log:G.log.slice(-6).map(l=>String(l.t||l.msg||l).replace(/<[^>]+>/g,'')).filter(s=>/brac/i.test(s))}},[etype,dx,dy]);
 console.log(etype,dx,dy,JSON.stringify(r));
 await p.evaluate(()=>{try{G.over=true;document.querySelectorAll('#battle,.battle').forEach(x=>x.hidden=true)}catch(e){}});
}
console.log('errors',errs);await b.close();
