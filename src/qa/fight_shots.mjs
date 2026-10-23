import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const pre=process.argv[2]||'f';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/rtk3-game.html');await p.waitForFunction(()=>typeof newCampaign==='function');
await p.evaluate(()=>{newCampaign('normal');UI={mode:'city',cmd:null,busy:false};showScreen('campaign')});
await p.evaluate(()=>{window.BTHEME='plains';const m=genBattleMap('R',false,777,'plains');
 const mk=(id,side,type,x,y,cmd)=>({id,name:S.gens[id]?.name||id,ch:S.gens[id]?.ch||'X',side,type,war:85,int:70,troops:3000,x,y,cmd,train:70});
 startBattle({units:[mk('guanyu','shu','cav',5,4,true),mk('zhaoyun','shu','spear',3,2),mk('zhugeliang','shu','archer',2,3),mk('caoren','wei','shield',6,4,true),mk('xuchu','wei','cav',9,2),mk('yujin','wei','archer',10,5)],foe:'wei',walls:50,map:m,playerAttacks:true,title:'Battle',sub:'test'});
 setTimeout(()=>{document.querySelector('#dlg').hidden=true;try{prepBegin()}catch(e){}},300)});
await p.waitForTimeout(3500);
await p.evaluate(()=>{const a=G.units.find(u=>u.id==='guanyu'),d=G.units.find(u=>u.id==='caoren');speed=1;a.troops=2600;d.troops=1700;window.__fp=playBattle0(a,d,{aB:3000,dB:3000,ctrOn:true,label:''})});
const t0=Date.now();const MS=(process.argv[3]||"400,1300,1900,2500,3300").split(",").map(Number);for(const ms of MS){const w=ms-(Date.now()-t0);if(w>0)await p.waitForTimeout(w);await p.screenshot({path:`${pre}_${ms}.png`})}
console.log(errs);await b.close();
