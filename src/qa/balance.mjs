// Balance study: a sensible Shu bot ('smart') or a builder that never attacks ('turtle'), full games to 215
import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const N=+process.argv[2]||4,BOT=process.argv[3]||'smart',SEED=+process.argv[4]||1;
const b=await chromium.launch();const games=[];
for(let gi=0;gi<N;gi++){const p=await b.newPage({viewport:{width:1000,height:460}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file:///tmp/claude-0/-home-claude/3caa1e0b-7a90-56f6-b65a-93a3eae7fddc/scratchpad/rtk3-game.html');await p.click('#newBtn');await p.waitForTimeout(150);await p.evaluate(d=>{const b=document.querySelector('#dlg:not([hidden]) [data-r="'+d+'"]');b&&b.click()},process.argv[5]||'normal');await p.waitForTimeout(200);
  await p.evaluate(({seed,bot})=>{UI.noConfirm=true;window.monthFx=()=>{};window.monthSummary=async()=>{};let s=seed;Math.random=()=>{s=(s*16807)%2147483647;return (s-1)/2147483646};window.__bot=bot;
    window.__trace=[];window.__ev={attacksOnShu:0,shuAttacks:0,shuWins:0,surrenders:0,persuades:0,lost:[],gained:[]}},{seed:SEED*1000+gi*7+1,bot:BOT});
  for(let m=0;m<88;m++){
    await p.evaluate(()=>{if(S.over)return;const R=Math.random,smart=window.__bot==='smart';
      const pow=(gs,t,tr)=>armyPower(gs,t,tr);
      const threatAt=c=>neighbours(c.id).map(C).filter(n=>n.owner!=='shu'&&!allied('shu',n.owner)).reduce((x,n)=>Math.max(x,n.troops*.65),0)+S.armies.filter(a=>a.to===c.id&&a.fac!=='shu').reduce((x,a)=>x+a.troops,0);
      // 1) diplomacy first (envoys use their action)
      if(smart)for(const c of Object.values(S.cities)){if(c.owner==='shu'||allied('shu',c.owner)||!neighbours(c.id).some(n=>C(n).owner==='shu'))continue;const env=envoysFor(c.id).filter(g=>g.id!=='liubei')[0];if(!env)continue;
        if(!['wei','wu'].includes(c.owner)&&C(env.city).gold>=300&&!(S.surTry&&S.surTry[c.owner]===dateNum())){const f=c.owner,pp=surrenderChance(env,f);if(pp>=.2){C(env.city).gold-=200;env.acted=true;(S.surTry=S.surTry||{})[f]=dateNum();
          if(R()<pp){S['gone_'+f]=1;const cs=citiesOf(f);for(const x of cs){x.owner='shu';x.troops=Math.round(x.troops*.9);x.order=Math.max(20,x.order-10)}for(const g of gensOf(f))moveGen(g,'shu',g.city||cs[0].id,isRuler(g)?55:62);for(const a of S.armies.filter(a=>a.fac===f))a.fac='shu';__ev.surrenders++;__ev.gained.push(dateNum()+':'+cs.map(x=>x.id).join('+')+'(surr)')}
          continue}}
        const t=gensIn(c.id).filter(g=>!isFounder(g)).sort((a,b)=>b.war-a.war)[0];if(t&&C(env.city).gold>=400){const pp=persuadeChance(env,t);if(pp>=.25){C(env.city).gold-=100;env.acted=true;if(R()<pp){moveGen(t,'shu',env.city,70);__ev.persuades++}}}}
      // 2) attacks
      if(smart)for(const c of citiesOf('shu')){if(isDelegated(c))continue;const free=gensIn(c.id).filter(g=>!g.acted&&g.id!=='liubei').sort((a,b)=>b.war-a.war);if(free.length<1||c.troops<6000)continue;
        let best=null;for(const t of neighbours(c.id).map(C)){if(t.owner==='shu'||allied('shu',t.owner))continue;const tr=routeOf(c.id,t.id)[2];const go=free.slice(0,3);
          const keep=Math.max(3000,Math.min(c.troops*.4,threatAt(c)*.8));const send=Math.floor(c.troops-keep);if(send<4000)continue;
          const inc=S.armies.filter(a=>a.to===t.id&&a.fac===t.owner).reduce((s,a)=>s+a.troops,0);
          const ratio=pow(go,send,c.train)/Math.max(1,pow(gensIn(t.id).sort((a,b)=>b.war-a.war).slice(0,4),t.troops+inc,t.train)*(1.15+t.walls/250));
          if(ratio>1.2&&(!best||ratio>best.r))best={t,go,send,r:ratio,tr}}
        if(best&&c.rice>best.send*RICE_MARCH*(best.tr+3)+c.troops*RICE_CITY*3){const rice=Math.round(best.send*RICE_MARCH*(best.tr+3));for(const g of best.go)g.assign=null;
          launchArmy('shu',c.id,best.t.id,best.go,best.send,rice,Object.fromEntries(best.go.map(g=>[g.id,Math.floor(best.send/best.go.length)])));__ev.shuAttacks++}}
      // 3) reinforce threatened cities from safe ones
      for(const c of citiesOf('shu')){if(isDelegated(c)||threatAt(c)>0)continue;const need=citiesOf('shu').filter(x=>neighbours(c.id).includes(x.id)&&threatAt(x)>x.troops*1.1).sort((a,b)=>threatAt(b)-threatAt(a))[0];
        if(need&&c.troops>5000){const amt=Math.floor((c.troops-3000)*.7),tr=routeOf(c.id,need.id)[2];if(c.rice>amt*RICE_MARCH*tr+500)launchArmy('shu',c.id,need.id,[],amt,Math.ceil(amt*RICE_MARCH*tr))}}
      // 3b) mass troops toward the front: rear cities send surplus to the neighbour closest to an enemy
      {const front=new Set(citiesOf('shu').filter(c=>neighbours(c.id).some(n=>C(n).owner!=='shu'&&!allied('shu',C(n).owner))).map(c=>c.id));
       const dist={},q=[...front];for(const id of q)dist[id]=0;while(q.length){const id=q.shift();for(const n of neighbours(id))if(C(n).owner==='shu'&&dist[n]==null){dist[n]=dist[id]+1;q.push(n)}}
       for(const c of citiesOf('shu')){if(isDelegated(c)||!dist[c.id]||c.troops<8000)continue;const to=neighbours(c.id).filter(n=>dist[n]!=null&&dist[n]<dist[c.id])[0];if(!to)continue;
         const amt=Math.floor((c.troops-5000)*.8),tr=routeOf(c.id,to)[2];if(c.rice>amt*RICE_MARCH*tr+2000){const gs=gensIn(c.id).filter(g=>!g.acted&&g.id!=='liubei'&&g.war>=70).slice(0,1);launchArmy('shu',c.id,to,gs,amt,Math.ceil(amt*RICE_MARCH*tr))}}}
      // 3c) supply: rich cities send half their surplus gold and rice to the poorest own neighbour
      for(const c of citiesOf('shu')){const sg=c.gold-1200,sr=c.rice-c.troops*RICE_CITY*12;if(sg<400&&sr<3000)continue;
        const to=neighbours(c.id).map(C).filter(x=>x.owner==='shu').sort((a,b)=>(a.gold+a.rice/20)-(b.gold+b.rice/20))[0];if(!to||to.gold>c.gold*.6)continue;
        launchArmy('shu',c.id,to.id,[],0,sr>3000?Math.round(sr*.5):0,null,sg>400?Math.round(sg*.5):0)}
      // 4) domestic
      for(const c of citiesOf('shu')){if(isDelegated(c))continue;
        for(const g of gensIn(c.id).filter(g=>!g.acted).sort((a,b)=>b.pol-a.pol)){let k=null;const room=troopCap(c)-c.troops,th=threatAt(c);
          if(c.order<55)k='patrol';
          else if((th>c.troops*.8||c.troops<6000)&&room>800&&c.gold>=500&&g.cha>=60&&c.rice>(c.troops+3000)*RICE_CITY*8)k='recruit';
          else if(c.train<85&&g.war>=70)k='train';
          else if(c.com<c.comMax&&c.gold>=100&&g.pol>=60)k='com';
          else if(c.farm<c.farmMax&&c.gold>=100&&g.pol>=55)k='farm';
          else if(c.walls<90&&th>0&&c.gold>=150)k='walls';
          else if(room>800&&c.gold>=600&&g.cha>=55&&c.rice>(c.troops+3000)*RICE_CITY*8)k='recruit';
          else if(c.train<100)k='train';
          if(k&&Object.entries(CMDS[k].cost).every(([r,n])=>c[r]>=n)){UI.found=null;doCmd(k,g,c,'shu')}}
        if(c.gold>=500)for(const g of gensIn(c.id).filter(g=>g.loy<70&&!g.rewarded&&!isRuler(g)).slice(0,1)){doCmd('reward',g,c,'shu')}}
      const own=citiesOf('shu').map(c=>c.id).join(',');window.__prev=window.__prev||own;
      if(own!==window.__prev){const a=window.__prev.split(','),bb=own.split(',');for(const x of a)if(!bb.includes(x))__ev.lost.push(dateNum()+':'+x);for(const x of bb)if(!a.includes(x)&&!__ev.gained.some(g=>g.includes(x)))__ev.gained.push(dateNum()+':'+x);window.__prev=own}
    });
    await p.evaluate(()=>{window.__d=false;endMonth().then(()=>window.__d=true)});
    for(let k=0;k<400;k++){await p.waitForTimeout(20);const d=await p.evaluate(()=>{const d=document.querySelector('#dlg');if(!d.hidden){if(/attacks .*·|守/.test(d.innerText)&&d.querySelector('.dpick'))__ev.attacksOnShu++;const bs=[...d.querySelectorAll('[data-r]')].filter(x=>!x.disabled);
        const pref=bs.find(b=>b.dataset.r==='auto')||bs.find(b=>b.dataset.r==='rec')||bs.find(b=>b.dataset.r==='go')||bs.find(b=>b.classList.contains('primary'))||bs[0];pref&&pref.click()}const a=document.querySelector('#actFx');if(a)a.click();return window.__d||S.over});if(d)break}
    await p.evaluate(()=>{const own=citiesOf('shu').map(c=>c.id).join(',');const pv=window.__prev||'';if(own!==pv){const a=pv.split(','),bb=own.split(',');for(const x of a)if(x&&!bb.includes(x))__ev.lost.push(dateNum()+':'+x);for(const x of bb)if(!a.includes(x)&&!__ev.gained.some(g=>g.endsWith(':'+x)||g.includes(':'+x)))__ev.gained.push(dateNum()+':'+x);window.__prev=own}
      if(S.month===1||S.over)__trace.push(`${S.year}/${S.month} `+['shu','wei','wu','han','jin','liu','zhao'].map(f=>f[0].toUpperCase()+f.slice(1,2)+citiesOf(f).length).join(' ')+` | shuT ${Math.round((citiesOf('shu').reduce((s,c)=>s+c.troops,0)+S.armies.filter(a=>a.fac==='shu').reduce((s,a)=>s+a.troops,0))/1000)}k weiT ${Math.round(citiesOf('wei').reduce((s,c)=>s+c.troops,0)/1000)}k wuT ${Math.round(citiesOf('wu').reduce((s,c)=>s+c.troops,0)/1000)}k gold ${facGold("shu")} rice ${Math.round(facRice("shu")/1000)}k gens ${gensOf('shu').length}`)});
    if(await p.evaluate(()=>S.over))break}
  games.push(await p.evaluate(()=>({end:`${S.year}/${S.month}`,over:S.over,win:citiesOf('shu').length>=WIN_CITIES,shu:citiesOf('shu').length,ev:__ev,trace:__trace})));games.at(-1).errs=errs.slice(0,3);await p.close()}
await b.close();console.log(JSON.stringify(games));
