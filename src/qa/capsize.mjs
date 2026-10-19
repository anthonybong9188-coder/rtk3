import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:900,height:400}});
await p.goto('file://'+process.cwd()+'/rtk3-game.html');await p.waitForTimeout(1500);
await p.evaluate(async()=>{for(const n of ['general','general_cap','shield'])sprSheet(n,'wei');await new Promise(r=>setTimeout(r,1500));
 const cv=document.createElement('canvas');cv.width=900;cv.height=400;cv.id='tc';cv.style.cssText='position:fixed;left:0;top:0;z-index:99999;background:#7a6a40';document.body.appendChild(cv);const c=cv.getContext('2d');
 drawFigure(c,{x:120,y:330,s:2.35,face:1,fac:'wei',type:'shield',officer:true,seed:1});
 drawFigure(c,{x:300,y:330,s:1.6,face:-1,fac:'wei',type:'shield',seed:1});
 for(let fr=0;fr<5;fr++)drawFigure(c,{cap:true,fr,x:420+fr*100,y:330,s:2.35,face:1,fac:'wei'});});
await p.waitForTimeout(300);await p.screenshot({path:'capsize.png'});await b.close();
