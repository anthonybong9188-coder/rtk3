import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:900,height:300}});
await p.goto('file://'+process.cwd()+'/rtk3-game.html');await p.waitForTimeout(1500);
await p.evaluate(async()=>{await sprWait();
 const cv=document.createElement('canvas');cv.width=900;cv.height=300;cv.style.cssText='position:fixed;left:0;top:0;z-index:99999;background:#7a6a40';document.body.appendChild(cv);const c=cv.getContext('2d');
 [['spear',1],['shield',1],['archer',1],['spear',null],['shield',null],['archer',null]].forEach(([t,run],i)=>drawFigure(c,{x:80+i*145,y:250,s:1.6,face:1,fac:'shu',type:t,seed:1,run:run}))});
await p.waitForTimeout(300);await p.screenshot({path:'sizes.png'});await b.close();
