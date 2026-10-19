// AI-only campaign runner: N games x M months, all dialogs auto-answered, invariants checked each month
import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const N=+process.argv[2]||4,M=+process.argv[3]||40,mode=process.argv[4]||'auto';
const inv=fs.readFileSync(new URL('./inv.js',import.meta.url),'utf8');
const b=await chromium.launch();const out={errs:[],viol:[],ends:[]};
for(let gi=0;gi<N;gi++){const p=await b.newPage({viewport:{width:1000,height:460}});
  p.on('pageerror',e=>out.errs.push(`g${gi} ${e.message} ${(e.stack||'').split('\n')[1]||''}`));
  await p.goto('file:///tmp/claude-0/-home-claude/3caa1e0b-7a90-56f6-b65a-93a3eae7fddc/scratchpad/rtk3-game.html');await p.addScriptTag({content:inv});
  await p.click('#newBtn');await p.waitForTimeout(300);
  await p.evaluate(({gi,mode})=>{UI.noConfirm=true;window.monthFx=()=>{};window.monthSummary=async()=>{};
    // seeded randomness per game
    let s=gi*9973+17;Math.random=()=>{s=(s*16807)%2147483647;return (s-1)/2147483646};
    window.__mode=mode},{gi,mode});
  let prevViol=0;
  for(let m=0;m<M;m++){
    // player turn: random but legal actions
    await p.evaluate(async()=>{const R=Math.random;if(S.over)return;
      for(const c of citiesOf('shu')){if(isDelegated(c))continue;
        for(const g of gensIn(c.id).filter(g=>!g.acted)){const ks=Object.keys(CMDS).filter(k=>k!=='reward'&&Object.entries(CMDS[k].cost).every(([r,n])=>S.fac.shu[r]>=n));
          if(R()<.15)continue;const k=ks[Math.floor(R()*ks.length)];if(!k)continue;
          if(['farm','com','train'].includes(k)&&R()<.2&&!g.assign){doCmd(k,g,c,'shu');g.assign={k,left:3}}else{UI.found=null;doCmd(k,g,c,'shu')}}
        if(R()<.15&&gensIn(c.id).some(g=>g.loy<100&&!g.rewarded&&!isRuler(g))&&S.fac.shu.gold>=100){const g=gensIn(c.id).find(g=>g.loy<100&&!g.rewarded&&!isRuler(g));S.fac.shu.gold-=100;doCmd('reward',g,c,'shu')}
        // delegate sometimes
        if(!c.gov&&R()<.08&&!gensIn(c.id).some(g=>g.id==='liubei')&&gensIn(c.id).length){const gv=gensIn(c.id)[0];const gold=Math.min(S.fac.shu.gold,200),rice=Math.min(S.fac.shu.rice,3000);S.fac.shu.gold-=gold;S.fac.shu.rice-=rice;c.purse={gold,rice};c.gov=gv.id;c.mode=['auto','internal','military'][Math.floor(R()*3)];for(const g of gensIn(c.id))g.assign=null}
        // march / transfer
        const free=gensIn(c.id).filter(g=>!g.acted&&g.id!=='liubei');
        if(free.length&&c.troops>4000&&R()<.35){const ns=neighbours(c.id).map(C).filter(t=>t.owner==='shu'||!allied('shu',t.owner));if(ns.length){const t=ns[Math.floor(R()*ns.length)];
          const gs=free.slice(0,1+Math.floor(R()*Math.min(3,free.length)));const tr=Math.floor(c.troops*(.3+R()*.5));const tv=routeOf(c.id,t.id)[2];const rice=Math.min(S.fac.shu.rice,Math.round(tr*RICE_MARCH*(tv+2)));
          for(const g of gs)g.assign=null;launchArmy('shu',c.id,t.id,gs,tr,rice,Object.fromEntries(gs.map((g,i)=>[g.id,Math.floor(tr/gs.length)])))}}}
      // governor requests
      for(const c of citiesOf('shu').filter(isDelegated)){if(R()<.2){const g=Math.floor(c.purse.gold*R()),r=Math.floor(c.purse.rice*R()*.5);c.purse.gold-=g;c.purse.rice-=r;S.fac.shu.gold+=g;S.fac.shu.rice+=r}
        if(R()<.05)endDelegation(c,'qa end')}
      // diplomacy
      for(const c of Object.values(S.cities)){if(c.owner==='shu'||allied('shu',c.owner))continue;if(!neighbours(c.id).some(n=>C(n).owner==='shu'))continue;
        const env=envoysFor(c.id)[0];if(!env)continue;
        if(R()<.05&&!['wei','wu'].includes(c.owner)&&S.fac.shu.gold>=200){const f=c.owner,p=surrenderChance(env,f);S.fac.shu.gold-=200;env.acted=true;
          if(R()<p){S['gone_'+f]=1;const cs=citiesOf(f);for(const x of cs){x.owner='shu';x.troops=Math.round(x.troops*.9)}for(const g of gensOf(f))moveGen(g,'shu',g.city||cs[0].id,60);for(const a of S.armies.filter(a=>a.fac===f))a.fac='shu';S.fac.shu.gold+=S.fac[f].gold;S.fac.shu.rice+=S.fac[f].rice;S.fac[f].gold=0;S.fac[f].rice=0}}
        else if(R()<.08&&S.fac.shu.gold>=100){const t=gensIn(c.id).filter(g=>!isFounder(g))[0];if(t){S.fac.shu.gold-=100;env.acted=true;if(R()<persuadeChance(env,t))moveGen(t,'shu',env.city,70)}}}
    });
    await p.evaluate(()=>{window.__d=false;window.__e=null;endMonth().then(()=>window.__d=true).catch(e=>window.__e=String(e.stack||e))});
    let k=0;for(;k<(mode==="fight"?4000:400);k++){await p.waitForTimeout(25);
      const st=await p.evaluate(()=>{const d=document.querySelector('#dlg');if(d&&!d.hidden){const bs=[...d.querySelectorAll('[data-r]')].filter(b=>!b.disabled);
          const pref=(window.__mode==='fight'&&bs.find(b=>b.dataset.r==='fight'))||bs.find(b=>b.dataset.r==='auto')||bs.find(b=>b.dataset.r==='rec')||bs.find(b=>b.dataset.r==='go')||bs.find(b=>b.classList.contains('primary'))||bs[0];pref&&pref.click()}
        const a=document.querySelector('#actFx');if(a)a.click();
        if(!document.querySelector('#battleView').hidden&&typeof G!=='undefined'&&G&&!G.over&&!G.auto&&G.phase==='player'&&!G.busy){speed=0;G.auto=true;autoTurn()}
        const mo=document.querySelector('#modal');if(mo&&!mo.hidden){const b=mo.querySelector('button');b&&b.click()}
        return [window.__d,window.__e,S.over]});
      if(st[1]){out.errs.push(`g${gi} m${m} endMonth threw: ${st[1].slice(0,300)}`);break}if(st[0]||st[2])break}
    if(k>=(mode==="fight"?4000:400)){out.errs.push(`g${gi} m${m} endMonth hung: `+await p.evaluate(()=>JSON.stringify({bv:!document.querySelector('#battleView').hidden,G:typeof G!=='undefined'&&G?{over:G.over,phase:G.phase,busy:G.busy,auto:G.auto,turn:G.turn,mode:G.mode,units:G.units.map(u=>u.side+':'+u.troops)}:null,dlg:!document.querySelector('#dlg').hidden&&document.querySelector('#dlgbox').innerText.slice(0,60),modal:!document.querySelector('#modal').hidden,actfx:!!document.querySelector('#actFx'),pick:!!document.querySelector('#destPick')})));break}
    const v=await p.evaluate(t=>__inv(t),`g${gi}`);if(v.length>prevViol){out.viol.push(...v.slice(0,6));prevViol=v.length}
    if(await p.evaluate(()=>S.over))break}
  out.ends.push(await p.evaluate(()=>`${S.year}/${S.month} over=${S.over} shu=${citiesOf('shu').length} cities `+Object.keys(FACS).map(f=>f+':'+citiesOf(f).length).join(' ')));
  await p.close()}
await b.close();
const uniq=a=>[...new Set(a)];console.log(JSON.stringify({errs:uniq(out.errs).slice(0,30),viol:uniq(out.viol).slice(0,40),ends:out.ends},null,1));
