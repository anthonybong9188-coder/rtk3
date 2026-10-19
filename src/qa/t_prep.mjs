import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},hasTouch:true,isMobile:true,deviceScaleFactor:2});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/rtk3-game.html');await p.click('#newBtn');await p.waitForTimeout(200);await p.click('[data-r="normal"]');await p.waitForTimeout(300);
await p.evaluate(()=>{const gens=['zhangfei','guanyu','zhaoyun'].map(GN);playCampaignBattle({id:99,fac:'shu',from:'jiangxia',to:'xiangyang',gens:gens.map(g=>g.id),troops:9000,rice:3000,left:0,total:2,train:70},C('xiangyang'),gens,[GN('caoren'),GN('yujin')])});
await p.waitForTimeout(1500);await p.screenshot({path:'prep1.png'});
await p.tap('[data-r="t:zhangfei:shield"]');await p.waitForTimeout(300);await p.screenshot({path:'prep2.png'});
console.log('zf type',await p.evaluate(()=>[G.units.find(u=>u.id==='zhangfei').type,S.gens.zhangfei.type,G.phase]));
await p.tap('[data-r="scout"]');await p.waitForTimeout(300);
// scout: tap an enemy unit
const pos=await p.evaluate(()=>{const e=G.units.find(u=>u.side==='wei');const r=MC.getBoundingClientRect();return [r.left+(e.x+.5)*T,r.top+(e.y+.5)*T]});
await p.evaluate(([x,y])=>{const bm=document.querySelector('.bmap');const e=G.units.find(u=>u.side==='wei');focusUnit(e,true)},pos);await p.waitForTimeout(400);
const pos2=await p.evaluate(()=>{const e=G.units.find(u=>u.side==='wei');const r=MC.getBoundingClientRect();return [r.left+(e.x+.5)*T,r.top+(e.y+.5)*T]});
await p.mouse.click(...pos2);await p.waitForTimeout(400);await p.screenshot({path:'prep3.png'});
console.log('view',await p.evaluate(()=>[G.view&&G.view.name,G.phase]));
await p.tap('#prepBar [data-p="go"]');await p.waitForTimeout(400);
console.log('after go',await p.evaluate(()=>[G.phase,G.sel&&G.sel.name,document.getElementById('prepBar').hidden]));
await p.screenshot({path:'prep4.png'});console.log(errs);await b.close();
