import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const errs=[];
for(const [w,h,t] of [[915,412,'land'],[412,860,'port']]){
const b=await chromium.launch();const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:2});p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/rtk3-game.html');await p.waitForTimeout(1200);await p.evaluate(()=>document.getElementById('newBtn').click());await p.waitForTimeout(200);await p.click('[data-r="normal"]');await p.waitForTimeout(800);
await p.evaluate(()=>openMap());await p.waitForTimeout(700);await p.screenshot({path:`mapf_${t}.png`});
await p.click('[data-mfac="wei"]');await p.waitForTimeout(500);await p.screenshot({path:`mapf_${t}_wei.png`});
console.log(t,await p.evaluate(()=>[document.querySelector('.mapview .mapbox').getBoundingClientRect().width,document.getElementById('mfacInfo').textContent]));await b.close()}
console.log(errs);
