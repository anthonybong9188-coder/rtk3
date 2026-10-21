import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/rtk3-game.html');await p.waitForFunction(()=>typeof newHeroCampaign==='function');
await p.evaluate(()=>{newHeroCampaign('normal',{name:'Long Aotian',stats:{war:90,int:85,pol:80,cha:88}});for(const id of GODS){const g=S.gens[id];g.fac='shu';g.hidden=false;g.city='luling'}UI={mode:'city',cmd:null,busy:false};showScreen('campaign');renderCampaign();
 playCampaignBattle({id:99,fac:'shu',from:'luling',to:'guiyang',gens:['xuannu','fentian','yueshuang','nuwa'],troops:12000,rice:2000,left:0,total:2,train:60},C('guiyang'),['xuannu','fentian','yueshuang','nuwa'].map(GN),[GN('zhaofan'),GN('chenying')]);setTimeout(()=>{document.querySelector('#dlg').hidden=true;prepBegin()},400)});
await p.waitForTimeout(1800);
const at=(x,y)=>p.evaluate(([x,y])=>{const r=MC.getBoundingClientRect();return [r.left+(x+.5)*T,r.top+(y+.5)*T]},[x,y]);
async function run(id,sk,place,tapXY,shot){
 await p.evaluate(([id,place])=>{speed=1;for(const u of G.units)u.acted=false;const s=G.units.find(u=>u.id===id);const es=enemies();
  for(const u of G.units)if(u.side==='shu'&&u!==s){u.x=0;u.y=G.units.indexOf(u)%8;u.px=u.x;u.py=u.y}
  if(id==='nuwa')s.troops=1000;s.cd={};s.x=place.s[0];s.y=place.s[1];s.px=s.x;s.py=s.y;es.forEach((e,i)=>{e.troops=3000;e.stun=0;e.x=place.e[i][0];e.y=place.e[i][1];e.px=e.x;e.py=e.y});
  G.sel=s;G.view=s;G.origin={x:s.x,y:s.y};G.reach=reachFrom?reachFrom(s,G.origin):reach(s);G.mode='moved';G.atk=[];updateUI();focusUnit(s,true)},[id,place]);
 await p.waitForTimeout(200);await p.click(`[data-sk="${sk}"]`);await p.waitForTimeout(300);console.log('dbg',await p.evaluate(()=>[G.mode,G.tmode,G.targets.map(t=>t.u.x+','+t.u.y+(t.u.area?'['+t.u.area.length+']':'')).join(' '),G.sel&&G.sel.id,G.sel&&[G.sel.x,G.sel.y]]));
 const [x,y]=await at(...tapXY);console.log('dbg2',await p.evaluate(([x,y])=>{const e=document.elementFromPoint(x,y);return [e&&(e.id||e.className),G.busy,G.phase,document.querySelector('.bmap').dataset.dragged]},[x,y]));await p.mouse.click(x,y);await p.waitForTimeout(shot?2900:300);if(shot)await p.screenshot({path:shot});await p.waitForFunction(()=>!G.busy,null,{timeout:15000});await p.waitForTimeout(300);
 return await p.evaluate(()=>[G.mode,enemies().map(e=>e.name+':'+e.troops+(e.stun?'❄':'')).join(' '),G.log[0].replace(/<[^>]+>/g,'').slice(0,90)])}
console.log('mend',await run('nuwa','mend',{s:[3,4],e:[[5,4],[9,1]]},[3,4],'sk_mend.png'));
console.log('frost',await run('yueshuang','frost',{s:[3,4],e:[[4,5],[9,1]]},[3,4]));
console.log('burn-enemy-d1',await run('fentian','burn',{s:[3,4],e:[[4,4],[9,1]]},[4,4],'sk_burn.png'));
console.log('star-tap-enemy',await run('xuannu','star',{s:[3,4],e:[[6,4],[9,1]]},[6,4]));
console.log(errs);await b.close();
