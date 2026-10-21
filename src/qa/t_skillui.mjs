import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2,hasTouch:true});
const errs=[];p.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));p.on('requestfailed',r=>{if(!/googleapis/.test(r.url()))errs.push('FAIL '+r.url())});
await p.goto('file://'+process.cwd()+'/rtk3-game.html');await p.waitForTimeout(1200);
await p.evaluate(()=>{newHeroCampaign('normal',{name:'Long Aotian',stats:{war:90,int:85,pol:80,cha:88}});for(const id of GODS){const g=S.gens[id];g.fac='shu';g.hidden=false;g.city='luling'}UI={mode:'city',cmd:null,busy:false};showScreen('campaign');renderCampaign();
 playCampaignBattle({id:99,fac:'shu',from:'luling',to:'guiyang',gens:['hero','fentian','xuannu'],troops:9000,rice:2000,left:0,total:2,train:60},C('guiyang'),['hero','fentian','xuannu'].map(GN),[GN('zhaofan'),GN('chenying')]);setTimeout(()=>{document.querySelector('#dlg').hidden=true;prepBegin()},400)});
await p.waitForTimeout(1800);
const st=await p.evaluate(()=>{speed=1;const h=G.units.find(u=>u.id==='hero'),e=enemies()[0];e.x=h.x+1;e.y=h.y;e.px=e.x;e.py=e.y;G.sel=h;G.view=h;G.origin={x:h.x,y:h.y};G.reach=reach(h);G.mode='select';updateUI();return {h:[h.x,h.y],e:[e.x,e.y],mode:G.mode}});
console.log(st);await p.screenshot({path:'sk0.png'});
// tap hero again to go to moved mode (as player would)
const pos=async(id,side)=>p.evaluate(([id,side])=>{const u=side?enemies()[0]:G.units.find(x=>x.id===id);const r=MC.getBoundingClientRect();return [r.left+(u.x+.5)*T,r.top+(u.y+.5)*T]},[id,side]);
let [x,y]=await pos('hero');await p.mouse.click(x,y);await p.waitForTimeout(400);
console.log('after tap hero',await p.evaluate(()=>[G.mode,[...document.querySelectorAll('#acts button')].map(b=>(b.dataset.sk||b.dataset.a)+(b.disabled?'(x)':'')).join(',')]));
await p.screenshot({path:'sk1.png'});
const sk=await p.$('[data-sk="palm"]');if(sk){await sk.click();await p.waitForTimeout(400)}
console.log('after skill btn',await p.evaluate(()=>[G.mode,G.tmode,G.targets.map(t=>t.u.name)]));await p.screenshot({path:'sk2.png'});
[x,y]=await pos(null,1);await p.mouse.click(x,y);await p.waitForTimeout(700);await p.screenshot({path:'sk3.png'});
await p.waitForTimeout(1200);await p.screenshot({path:'sk4.png'});await p.waitForTimeout(1500);
console.log('after tap enemy',await p.evaluate(()=>[G.mode,enemies()[0].troops,enemies()[0].stun,G.log[0]]),errs);await b.close();
