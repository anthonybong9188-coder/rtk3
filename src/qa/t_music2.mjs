import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});const p=await b.newPage({viewport:{width:915,height:412}});
await p.addInitScript(()=>{const A=window.Audio;window.__aud=[];window.Audio=function(s){const a=new A(s);window.__aud.push(a);return a}});
await p.goto('file://'+process.cwd()+'/rtk3-game.html');await p.waitForTimeout(1500);await p.evaluate(()=>document.getElementById('newBtn').click());await p.waitForTimeout(200);await p.click('[data-r="normal"]');await p.waitForTimeout(500);
await p.evaluate(()=>{playCampaignBattle({id:99,fac:'shu',from:'jiangxia',to:'xiangyang',gens:['zhangfei'],troops:5000,rice:2000,left:0,total:2,train:70},C('xiangyang'),[GN('zhangfei')],[GN('caoren')])});
await p.mouse.click(5,5);await p.waitForTimeout(2000);
const seq=[await p.evaluate(()=>window.__aud.map(a=>a.src.split('/').pop()+(a.paused?'':'▶')+(a.loop?'L':'')).join(' '))];
for(let i=0;i<3;i++){await p.evaluate(()=>{const a=window.__aud.filter(a=>!a.paused).pop();a.dispatchEvent(new Event('ended'))});await p.waitForTimeout(1500);seq.push(await p.evaluate(()=>window.__aud.filter(a=>!a.paused).map(a=>a.src.split('/').pop()).join(' ')))}
console.log(seq);await b.close();
