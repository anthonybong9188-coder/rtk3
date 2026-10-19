import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1000,height:460},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///tmp/claude-0/-home-claude/3caa1e0b-7a90-56f6-b65a-93a3eae7fddc/scratchpad/rtk3-game.html');await p.click('#newBtn');await p.waitForTimeout(200);await p.click('[data-r="normal"]');await p.waitForTimeout(300);
// Han Xuan gone, Huang Zhong leads, Changsha falls to Shu, Huang Zhong captured
await p.evaluate(()=>{delete S.gens.hanxuan;succession('han');const c=C('changsha');c.owner='shu';GN('weiyan').fac='shu';window.__p=handleCapture(GN('huangzhong'),'shu',c)});
await p.waitForTimeout(300);await p.screenshot({path:'hz2.png'});console.log(await p.evaluate(()=>document.querySelector('#dlgbox').innerText.replace(/\n+/g,' | ')));
await p.evaluate(()=>{Math.random=()=>0.99});await p.click('[data-r="rec"]');await p.waitForTimeout(300);
console.log(await p.evaluate(()=>[S.log[0].h,GN('huangzhong').hidden,GN('huangzhong').city]));
console.log('errors',errs);await b.close();
