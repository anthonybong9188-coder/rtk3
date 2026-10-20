import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/rtk3-game.html');await p.click('#newBtn');await p.waitForTimeout(200);await p.click('[data-r="normal"]');await p.waitForTimeout(300);
await p.evaluate(()=>{const gens=['zhangfei','guanyu','zhaoyun'].map(GN);playCampaignBattle({id:99,fac:'shu',from:'jiangxia',to:'xiangyang',gens:gens.map(g=>g.id),troops:9000,rice:3000,left:0,total:2,train:70},C('xiangyang'),gens,[GN('caoren'),GN('yujin')]);setTimeout(()=>{document.querySelector('#dlg').hidden=true;prepBegin()},400)});
await p.waitForTimeout(1500);
const pre=await p.evaluate(()=>{speed=0;const U=id=>G.units.find(u=>u.id===id),zf=U('zhangfei'),gy=U('guanyu'),zy=U('zhaoyun'),e=enemies()[0];
 for(const o of enemies().slice(1)){o.x=1;o.y=1;o.px=1;o.py=1}
 e.x=6;e.y=5;e.px=6;e.py=5;zf.x=5;zf.y=5;zf.px=5;zf.py=5;gy.x=7;gy.y=5;gy.px=7;gy.py=5;gy.acted=true;zy.x=6;zy.y=4;zy.px=6;zy.py=4;
 G.sel=zf;G.view=zf;G.origin={x:5,y:5};G.reach=reach(zf);G.mode='moved';G.atk=[e];updateUI();
 return {btn:!!document.querySelector('[data-a="joint"]:not([disabled])'),e:e.troops,zf:zf.troops,gy:gy.troops,zy:zy.troops}});
console.log('pre',pre);
await p.click('[data-a="joint"]');await p.waitForTimeout(300);await p.screenshot({path:'joint_t.png'});
console.log('targets',await p.evaluate(()=>G.targets.map(t=>t.u.name+' | '+t.note)));
await p.click('[data-t="0"]');await p.waitForTimeout(2500);
console.log('post',await p.evaluate(()=>{const U=id=>G.units.find(u=>u.id===id);const e=G.units.find(u=>u.side==='wei'&&u.x===6&&u.y===5);
 return {e:e&&e.troops,zf:U('zhangfei').troops,gy:U('guanyu').troops,zy:U('zhaoyun').troops,zfActed:U('zhangfei').acted,zyActed:U('zhaoyun').acted,gyActed:U('guanyu').acted,mode:G.mode,jointAgain:!!document.querySelector('[data-a="joint"]:not([disabled])'),log:G.log.slice(0,4).map(s=>s.replace(/<[^>]+>/g,''))}}));
await p.screenshot({path:'joint_after.png'});console.log(errs);await b.close();
