import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/rtk3-game.html');await p.waitForFunction(()=>typeof newCampaign==='function');
await p.evaluate(()=>{newCampaign('normal');UI={mode:'city',cmd:null,busy:false,noConfirm:true};showScreen('campaign');renderCampaign();
 const c=C('changsha');C('wuling').owner='shu';C('lingling').owner='shu';for(const id of ['hanxuan','huangzhong','weiyan','yangling'])S.gens[id]&&(S.gens[id].city='changsha');
 window.__r=null;const a={id:77,fac:'shu',from:'jiangxia',to:'changsha',gens:['zhangfei','guanyu'],troops:12000,rice:5000,left:0,total:2,train:70};S.armies.push(a);for(const g of ['zhangfei','guanyu'])S.gens[g].army=77;
 resolveArrival(a).then(()=>window.__r='done')});
for(let k=0;k<60;k++){await p.waitForTimeout(200);const st=await p.evaluate(()=>{const d=document.querySelector('#dlg:not([hidden])');const fb=d&&d.querySelector('[data-r="fight"]');if(fb){fb.click();return 'fight'}
  if(typeof G!=='undefined'&&G&&!G.over&&G.phase==='prep'){document.querySelector('#dlg').hidden=true;prepBegin();return 'prep'}
  if(typeof G!=='undefined'&&G&&!G.over&&G.phase==='player'){window.__def=enemies().map(e=>e.name);for(const e of enemies().filter(e=>!e.cmd)){G.units=G.units.filter(u=>u!==e)}endGame(false,'retreat',true);return 'retreat'}
  if(!$('#modal').hidden){$('#mBtn').click();return 'modal'}
  if(d){const h=(d.querySelector('h2')||{}).textContent;if(/Retreat to/.test(h)){window.__opts=[...d.querySelectorAll('.rchoice button')].map(b=>b.dataset.r);d.querySelectorAll('.rchoice button')[1].click();return 'picked'}const o=d.querySelector('button.primary')||d.querySelector('[data-r]');o&&o.click();return 'dlg '+h}
  return window.__r});if(st==='done')break}
console.log(await p.evaluate(()=>({opts:window.__opts,zf:S.gens.zhangfei.city,owner:C('changsha').owner,def:window.__def,log:S.log.slice(0,4).map(l=>l.h.replace(/<[^>]+>/g,''))})),errs);await b.close();
