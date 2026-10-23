import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/rtk3-game.html');await p.waitForFunction(()=>typeof newCampaign==='function');
await p.evaluate(()=>{newCampaign('normal');UI={mode:'city',cmd:null,busy:false,noConfirm:true};showScreen('campaign');renderCampaign();
 const a={id:78,fac:'wei',from:'jiangling',to:'jiangxia',gens:['caoren','xuchu'],troops:15000,rice:5000,left:0,total:2,train:70};S.armies.push(a);for(const g of ['caoren','xuchu'])S.gens[g].army=78;
 window.__r=null;resolveArrival(a).then(()=>window.__r='done')});
await p.waitForTimeout(800);await p.screenshot({path:'def1.png'});
const steps=process.argv.slice(2);for(const s of steps){await p.evaluate(s=>{const b=document.querySelector(`#dlg [data-r="${s}"]`);b&&b.click()},s);await p.waitForTimeout(250)}
await p.screenshot({path:'def2.png'});
await p.evaluate(()=>{document.querySelector('#dlg [data-r="go"]').click()});await p.waitForTimeout(300);
await p.evaluate(()=>{document.querySelector('#dlg [data-r="fight"]')?.click()});await p.waitForTimeout(1500);
console.log(await p.evaluate(()=>G&&G.units.map(u=>u.side+':'+u.name+':'+u.troops)),errs);await b.close();
