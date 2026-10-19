import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
import fs from 'fs';const inv=fs.readFileSync(new URL('./inv.js',import.meta.url),'utf8');
const b=await chromium.launch();const errs=[],out=[];const U='file:///tmp/claude-0/-home-claude/3caa1e0b-7a90-56f6-b65a-93a3eae7fddc/scratchpad/rtk3-game.html';
const page=async()=>{const p=await b.newPage({viewport:{width:1000,height:460}});p.on('pageerror',e=>errs.push(e.message+' @ '+(e.stack||'').split('\n')[1]));await p.goto(U);await p.addScriptTag({content:inv});return p};
const runMonth=async p=>{await p.evaluate(()=>{UI.noConfirm=true;window.monthFx=()=>{};window.__d=false;endMonth().then(()=>window.__d=true)});
  for(let k=0;k<300;k++){await p.waitForTimeout(30);const d=await p.evaluate(()=>{const d=document.querySelector('#dlg');if(!d.hidden){const b=d.querySelector('[data-r="auto"]')||d.querySelector('[data-r].primary')||d.querySelector('[data-r]');b&&b.click()}return window.__d});if(d)break}};
// 1. old-format save (no new fields) -> continue -> play
let p=await page();await p.click('#newBtn');await p.waitForTimeout(150);await p.evaluate(d=>{const b=document.querySelector('#dlg:not([hidden]) [data-r="'+d+'"]');b&&b.click()},process.argv[5]||'normal');await p.waitForTimeout(200);
await p.evaluate(()=>{const o=JSON.parse(JSON.stringify(S));delete o.logN;delete o.intel;delete o.seenThreat;delete o.intelD;delete o.surTry;for(const g of Object.values(o.gens)){delete g.assign;delete g.rewarded}for(const c of Object.values(o.cities)){delete c.gov;delete c.purse;delete c.mode;delete c.gold;delete c.rice}o.fac={};for(const f in FACS)o.fac[f]={gold:1000,rice:20000};o.log=o.log.map(l=>({d:l.d,h:l.h,f:l.f}));localStorage.setItem('rtk3-save',JSON.stringify(o))});
await p.reload();await p.addScriptTag({content:inv});await p.waitForTimeout(200);await p.click('#contBtn');await p.waitForTimeout(200);await runMonth(p);await runMonth(p);
out.push('old save: '+JSON.stringify(await p.evaluate(()=>[dateStr(),__inv('old'),C('jiangxia').gold,C('xuchang').rice])));
// 2. corrupt save
await p.evaluate(()=>{localStorage.setItem('rtk3-save','{not json');localStorage.setItem('rtk3-slot1','garbage')});await p.reload();await p.waitForTimeout(300);
out.push('corrupt: title shows '+await p.evaluate(()=>[!document.querySelector('#title').hidden,document.querySelector('#contBtn').hidden,document.querySelector('#loadBtn')?.hidden]));
await p.click('#newBtn');await p.waitForTimeout(150);await p.evaluate(d=>{const b=document.querySelector('#dlg:not([hidden]) [data-r="'+d+'"]');b&&b.click()},process.argv[5]||'normal');await p.waitForTimeout(200);await p.evaluate(()=>{const d=document.querySelector('#dlg');if(!d.hidden)d.querySelector('[data-r="yes"]')?.click()});await p.waitForTimeout(200);
out.push('after corrupt new game: '+await p.evaluate(()=>S&&dateStr()));
// 3. slot round trip with governor + assignment + army
await p.addScriptTag({content:inv});
await p.evaluate(()=>{const c=C('changsha');c.owner='shu';for(const g of gensIn('changsha'))g.fac='shu';c.gov='huangzhong';c.mode='internal';GN('mizhu').assign={k:'farm',left:3};launchArmy('shu','jiangxia','xiangyang',[GN('zhangfei')],3000,2000,{zhangfei:3000});writeSlot('rtk3-slot2')});
const before=await p.evaluate(()=>JSON.stringify([C('changsha').gold,GN('mizhu').assign,S.armies.length]));
await p.evaluate(()=>{startFrom(readKey('rtk3-slot2'))});await p.waitForTimeout(200);
out.push('slot roundtrip equal: '+(before===await p.evaluate(()=>JSON.stringify([C('changsha').gold,GN('mizhu').assign,S.armies.length]))));
await runMonth(p);out.push('after month: '+JSON.stringify(await p.evaluate(()=>__inv('slot'))));
// 4. storage full
out.push('storage full: '+await p.evaluate(()=>{const o=Storage.prototype.setItem;Storage.prototype.setItem=()=>{throw new Error('QuotaExceeded')};let r;try{save();r=writeSlot('rtk3-slot3')}catch(e){r='THREW '+e}Storage.prototype.setItem=o;return r}));
// 5. endings: win and timeout and liu bei capture
await p.evaluate(()=>{for(const c of Object.values(S.cities).slice(0,10))c.owner='shu';checkCampaignEnd()});await p.waitForTimeout(300);
out.push('win dialog: '+await p.evaluate(()=>!document.querySelector('#dlg').hidden&&document.querySelector('#dlgbox').innerText.slice(0,40)));
await p.evaluate(()=>document.querySelector('#dlg [data-r]').click());await p.waitForTimeout(200);
out.push('after win: title='+await p.evaluate(()=>!document.querySelector('#title').hidden)+' save cleared='+await p.evaluate(()=>!localStorage.getItem('rtk3-save')));
await p.click('#newBtn');await p.waitForTimeout(150);await p.evaluate(d=>{const b=document.querySelector('#dlg:not([hidden]) [data-r="'+d+'"]');b&&b.click()},process.argv[5]||'normal');await p.waitForTimeout(200);await p.evaluate(()=>{S.year=215;S.month=12});await runMonth(p);await p.waitForTimeout(300);
out.push('end 215: '+await p.evaluate(()=>[S.over,document.querySelector('#dlgbox').innerText.slice(0,60)]));
await b.close();console.log(JSON.stringify({errs:[...new Set(errs)],out},null,1));
