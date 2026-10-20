import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const errs=[];
for(const mode of ['1','0']){
const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412}});p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/rtk3-game.html');
await p.evaluate(m=>localStorage.setItem('rtk3_god',m),mode);
await p.click('#newBtn');await p.waitForTimeout(200);await p.click('[data-r="normal"]');await p.waitForTimeout(600);
console.log('god',mode,await p.evaluate(()=>{const c=C('jiangxia'),out=[];
 for(let i=0;i<40;i++){const g=S.gens.zhaoyun;g.acted=false;const m=doCmd('search',g,c,'shu');if(/descends/.test(String(m&&m.m||m)))out.push('ZY-FOUND-GOD')}
 for(let i=0;i<6;i++){S.gens.liubei.acted=false;const r=doCmd('search',S.gens.liubei,c,'shu');out.push(String(r&&r.m||r).slice(0,70))}
 return {log:out,gods:GODS.map(id=>id+':'+(S.gens[id].fac||'-')+'@'+S.gens[id].city)}}));
await b.close()}
console.log(errs);
