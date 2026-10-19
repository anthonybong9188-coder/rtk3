// battle fuzz: random legal taps inside tactical battles (move, attack, fire, duel, hero specials, wait, end turn)
import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const RUNS=+process.argv[2]||6;
const b=await chromium.launch();const errs=[],res=[];
const P=[['zhangfei','guanyu','zhaoyun','zhugeliang'],['guanyu','zhaoyun'],['zhangfei','mizhu','sunqian'],['zhugeliang','zhaoyun','guanyu','zhangfei']];
const E=[['caoren','xuchu','yujin','yuejin'],['huangzhong','weiyan','hanxuan'],['xiahouyuan','lidian'],['zhangliao','lidian','manchong']];
for(let r=0;r<RUNS;r++){const p=await b.newPage({viewport:{width:1000,height:460}});p.on('pageerror',e=>errs.push(`r${r} ${e.message} @ ${(e.stack||'').split('\n').slice(1,3).join(' | ')}`));
  await p.goto('file:///tmp/claude-0/-home-claude/3caa1e0b-7a90-56f6-b65a-93a3eae7fddc/scratchpad/rtk3-game.html');await p.click('#newBtn');await p.waitForTimeout(300);
  await p.evaluate(({r,pg,eg})=>{let s=r*104729+11;Math.random=()=>{s=(s*16807)%2147483647;return (s-1)/2147483646};speed=r%3===0?1:0;
    for(const id of eg)GN(id).city='xiangyang';const gens=pg.map(GN);const a={id:99,fac:'shu',from:'jiangxia',to:'xiangyang',gens:pg,troops:6000*pg.length,rice:3000,left:0,total:2,train:70};
    window.__res=null;playCampaignBattle(a,C(r%4===1?'xiangyang':'xiangyang'),gens,eg.map(GN)).then(x=>window.__res=x)},{r,pg:P[r%4],eg:E[r%4]});
  let taps=0;const kinds={};for(let t=0;t<2500;t++){
    const st=await p.evaluate(()=>{const R=Math.random;if(window.__res)return 'done';
      const vis=el=>{const b=el.getBoundingClientRect();return b.width>2&&b.height>2&&!el.closest('[hidden]')};
      const d=document.querySelector('#dlg:not([hidden])');if(d){const bs=[...d.querySelectorAll('[data-r]')].filter(x=>!x.disabled);bs[Math.floor(R()*bs.length)]?.click();return 'dlg'}
      const mo=document.querySelector('#modal:not([hidden]) button');if(mo){mo.click();return 'modal'}
      const du=[...document.querySelectorAll('.duelBtns button')].filter(x=>!x.disabled&&vis(x));if(du.length){du[Math.floor(R()*du.length)].click();return 'duel'}
      if(!G||G.over||G.busy||G.phase!=='player')return 'wait';
      const acts=[...document.querySelectorAll('#acts button')].filter(x=>!x.disabled&&vis(x));
      const tiles=(G.atk&&G.atk.length&&R()<.6)?G.atk.map(u=>({x:u.x,y:u.y})):(G.reach&&G.reach.tiles||[]);
      const roll=R();
      if(acts.length&&roll<.45){const a=acts[Math.floor(R()*acts.length)];a.click();return 'act:'+(a.dataset.a||a.textContent.trim().slice(0,6))}
      if(tiles.length&&roll<.85){const t=tiles[Math.floor(R()*tiles.length)];return {tile:t}}
      if(roll<.95){const u=G.units.filter(u=>u.side==='shu'&&!u.acted);if(u.length){const x=u[Math.floor(R()*u.length)];return {tile:{x:x.x,y:x.y}}}}
      document.querySelector('#endBtn')?.click();return 'end'});
    if(st==='done')break;if(typeof st==='string')kinds[st]=(kinds[st]||0)+1;
    if(st&&st.tile){const pt=await p.evaluate(t=>{const cv=document.querySelector('#map'),r=cv.getBoundingClientRect();const T=r.width/COLS;return {x:r.left+(t.x+.5)*T,y:r.top+(t.y+.5)*(r.height/ROWS)}},st.tile);
      // scroll unit into view then tap
      await p.evaluate(t=>{try{focusUnit({x:t.x,y:t.y},true)}catch(e){}},st.tile);const pt2=await p.evaluate(t=>{const cv=document.querySelector('#map'),r=cv.getBoundingClientRect();return {x:r.left+(t.x+.5)*r.width/COLS,y:r.top+(t.y+.5)*r.height/ROWS}},st.tile);
      await p.mouse.click(pt2.x,pt2.y).catch(()=>{});taps++}
    await p.waitForTimeout(st==='wait'?60:30)}
  const out=await p.evaluate(()=>window.__res?JSON.stringify({win:window.__res.attWin,att:window.__res.att,cap:window.__res.captured,log:G.log.slice(-1)}):'NOT FINISHED turn '+G.turn+' phase '+G.phase+' busy '+G.busy);
  res.push(`r${r} taps ${taps} ${JSON.stringify(kinds)}: ${out.slice(0,160)}`);await p.close()}
await b.close();console.log(JSON.stringify({errs:[...new Set(errs)].slice(0,20),res},null,1));
