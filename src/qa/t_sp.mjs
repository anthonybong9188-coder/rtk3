import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2.6});
await p.goto('file://'+process.cwd()+'/rtk3-game.html');await p.waitForTimeout(800);
const r=await p.evaluate(async()=>{const out={};for(const id of ['zhang_fei','guan_yu','zhao_yun','zhuge_liang','cao_ren']){const P=id;const t=performance.now();const im=await spPre(P).pr;out[id]=im?`${im.naturalWidth}x${im.naturalHeight} ${Math.round(performance.now()-t)}ms ${im.src.split('/').pop()}`:'FAIL'}return out});
console.log(r);
await p.evaluate(()=>{speed=1;PORT.zf='zhang_fei';cutIn({id:'zf'},{zh:'咆哮',n:'Roar'})});await p.waitForTimeout(450);await p.screenshot({path:'cutin.png'});await b.close();
