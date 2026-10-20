import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});const p=await b.newPage({viewport:{width:915,height:412}});
await p.addInitScript(()=>{const A=window.Audio;window.__aud=[];window.Audio=function(src){const a=new A(src);window.__aud.push(a);return a}});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('requestfailed',r=>{if(/music/.test(r.url()))errs.push('FAIL '+r.url())});
await p.goto('file://'+process.cwd()+'/rtk3-game.html');await p.click('#newBtn');await p.waitForTimeout(200);await p.click('[data-r="normal"]');await p.waitForTimeout(300);
await p.evaluate(()=>{const gens=['zhangfei','guanyu'].map(GN);playCampaignBattle({id:99,fac:'shu',from:'jiangxia',to:'xiangyang',gens:gens.map(g=>g.id),troops:9000,rice:3000,left:0,total:2,train:70},C('xiangyang'),gens,[GN('caoren')])});
await p.mouse.click(5,5);await p.waitForTimeout(2500);
console.log(await p.evaluate(()=>{const a=[...document.querySelectorAll('audio')];return {made:window.__aud.map(a=>a.src.split('/').pop()+(a.paused?' paused':' playing')+' vol '+a.volume.toFixed(2))}}));
const r=await p.evaluate(async()=>{const out=[];for(const n of ['battle1','battle2']){await new Promise(res=>{const a=new Audio(`music/${n}.mp3`);a.oncanplaythrough=()=>{out.push(n+' ok '+Math.round(a.duration)+'s');res()};a.onerror=()=>{out.push(n+' ERR');res()};setTimeout(()=>{out.push(n+' timeout');res()},4000)})}return out});
console.log(r,errs);await b.close();
