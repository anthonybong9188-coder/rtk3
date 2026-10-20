import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412},deviceScaleFactor:2});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('requestfailed',r=>{if(!/googleapis/.test(r.url()))errs.push('FAIL '+r.url())});
await p.goto('file://'+process.cwd()+'/rtk3-game.html');await p.click('#newBtn');await p.waitForTimeout(200);await p.click('[data-r="normal"]');await p.waitForTimeout(500);
await p.evaluate(()=>{for(const id of GODS){const g=S.gens[id];g.fac='shu';g.hidden=false;g.city='jiangxia'}const gens=['xuannu','nuwa','fentian','yueshuang'].map(GN);playCampaignBattle({id:99,fac:'shu',from:'jiangxia',to:'xiangyang',gens:gens.map(g=>g.id),troops:12000,rice:3000,left:0,total:2,train:70},C('xiangyang'),gens,[GN('caoren'),GN('yujin'),GN('yuejin')]);setTimeout(()=>{document.querySelector('#dlg').hidden=true;prepBegin()},400)});
await p.waitForTimeout(1500);
const out=await p.evaluate(async()=>{speed=1;const U=id=>G.units.find(u=>u.id===id),es=enemies(),r={};
 const X=U('xuannu'),N=U('nuwa'),F=U('fentian'),Y=U('yueshuang');
 X.x=2;X.y=3;N.x=2;N.y=5;F.x=4;F.y=6;Y.x=9;Y.y=3;for(const u of [X,N,F,Y]){u.px=u.x;u.py=u.y}
 es[0].x=5;es[0].y=3;es[1].x=10;es[1].y=4;es[2].x=6;es[2].y=6;for(const e of es){e.px=e.x;e.py=e.y}
 const t0=es.map(e=>e.troops);
 const dirs=starDirs(X);r.star=dirs.map(d=>d.label+' '+d.note);await heroAct('star',X,dirs.find(d=>d.dir[0]===1));
 N.troops=1000;await heroAct('mend',N,null);r.mend=[N.troops,N.iron];
 const bc=burnCentres(F);r.burn=bc.map(c=>c.x+','+c.y+' '+c.note);await heroAct('burn',F,bc[0]);
 await heroAct('frost',Y,null);r.frost=es.map(e=>e.name+':stun'+e.stun);
 r.loss=es.map((e,i)=>e.name+' -'+(t0[i]-e.troops));return r});
console.log(JSON.stringify(out,null,1),errs);
await p.evaluate(()=>{cutIn({id:'fentian'},{zh:'焚天',n:'Burning Sky'})});await p.waitForTimeout(900);await p.screenshot({path:'clip_play.png'});
await b.close();
