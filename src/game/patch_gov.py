p='game/camp.js';s=open(p).read()
def R(a,b,n=1):
    global s; assert s.count(a)==n,(a[:90],s.count(a)); s=s.replace(a,b)

# ---------- log counter (for month summary)
R("function addLog(h,f){S.log.unshift({d:`${S.year}/${S.month}`,h,f:f||null});",
  "function addLog(h,f){S.logN=(S.logN||0)+1;S.log.unshift({d:`${S.year}/${S.month}`,h,f:f||null,n:S.logN});")

# ---------- helpers: assignments, governors, tips
R("function renderCampaign(){\n  if(!S)return;",r"""// ===== long-term assignments (farm / commerce / train for N months)
const ASSIGNABLE=['farm','com','train'];
const assignLbl=g=>g.assign?`${CMDS[g.assign.k].n} · ${g.assign.left} mo`:'';
const govOf=c=>c&&c.gov?GN(c.gov):null;
const isDelegated=c=>!!(c&&c.owner==='shu'&&c.gov);
async function confirmBreakAssign(g){if(!g.assign)return true;
  const r=await dialog(`<h2>${g.name} has an assignment</h2><p>He is assigned to <b>${CMDS[g.assign.k].n}</b> for ${g.assign.left} more month${g.assign.left>1?'s':''}.</p><p class="muted">Giving him this order ends the assignment.</p>`,[['no','Keep the assignment'],['yes','End it and continue','primary']]);
  if(r!=='yes')return false;addLog(`${g.name}'s ${CMDS[g.assign.k].n.toLowerCase()} assignment is ended.`,'shu');g.assign=null;return true}
// run every month before the economy: assigned officers, then governed cities
function runAssignments(){
  for(const g of gensOf('shu')){if(!g.assign||g.army||g.acted)continue;const c=C(g.city);if(!c||c.owner!=='shu'||isDelegated(c)){g.assign=null;continue}
    const k=g.assign.k,afford=Object.entries(CMDS[k].cost).every(([r,n])=>S.fac.shu[r]>=n);
    if(!afford){addLog(`${g.name} cannot carry out his ${CMDS[k].n.toLowerCase()} assignment: not enough gold.`,'shu');continue}
    const m=doCmd(k,g,c,'shu');g.assign.left--;addLog(`${m} <i>(assigned${g.assign.left?`, ${g.assign.left} month${g.assign.left>1?'s':''} left`:', finished'})</i>`,'shu');if(!g.assign.left)g.assign=null}}
const GOV_MODES={auto:'Auto',internal:'Internal',military:'Military'};
function govTick(){
  for(const c of citiesOf('shu')){if(!c.gov)continue;
    if(gensIn(c.id).some(g=>g.id==='liubei')){endDelegation(c,'Liu Bei arrives and takes charge of '+c.name+' again.');continue}
    let gv=govOf(c);if(!gv||gv.fac!=='shu'||gv.city!==c.id){const nx=gensIn(c.id).sort((a,b)=>b.pol-a.pol)[0];
      if(!nx){endDelegation(c,`${c.name} has no officer left to govern it and returns to your direct rule.`);continue}c.gov=nx.id;gv=nx;addLog(`${nx.name} takes over as governor of ${c.name}.`,'shu')}
    const P=c.purse;S.fac.__gov=P;const did=[];
    const gs=gensIn(c.id).filter(g=>!g.acted).sort((a,b)=>b.pol-a.pol);
    for(const g of gs){let k=null;const md=c.mode||'auto',room=troopCap(c)-c.troops;
      const threat=neighbours(c.id).map(C).filter(n=>n.owner!=='shu'&&!allied('shu',n.owner)).reduce((x,n)=>Math.max(x,n.troops),0);
      if(c.order<45&&P.rice>500)k='patrol';
      else if(md==='military'){if(room>1000&&P.gold>=400&&g.cha>=50&&c.order>55)k='recruit';else if(c.train<100&&g.war>=50)k='train';else if(c.walls<100&&P.gold>=150)k='walls';else if(c.train<100)k='train'}
      else if(md==='internal'){if(c.farm<c.farmMax&&P.gold>=150&&g.pol>=45)k='farm';else if(c.com<c.comMax&&P.gold>=150&&g.pol>=45)k='com';else if(c.order<80)k='patrol';else if(c.walls<100&&P.gold>=150)k='walls'}
      else{if(threat>c.troops&&room>1000&&P.gold>=400&&g.cha>=50&&c.order>55)k='recruit';else if(c.train<70&&g.war>=60)k='train';else if(c.com<c.comMax&&P.gold>=150&&g.pol>=55)k='com';else if(c.farm<c.farmMax&&P.gold>=150&&g.pol>=50)k='farm';else if(c.walls<100&&P.gold>=150)k='walls';else if(c.train<100)k='train'}
      if(!k||!Object.entries(CMDS[k].cost).every(([r,n])=>P[r]>=n))continue;doCmd(k,g,c,'__gov');did.push(CMDS[k].n.toLowerCase())}
    delete S.fac.__gov;
    if(did.length)addLog(`Governor ${gv.name} (${GOV_MODES[c.mode||'auto']}) runs ${c.name}: ${[...new Set(did)].join(', ')}.`,'shu')}}
function endDelegation(c,msg){if(c.purse){S.fac.shu.gold+=Math.round(c.purse.gold);S.fac.shu.rice+=Math.round(c.purse.rice)}c.gov=null;c.purse=null;c.mode=null;if(msg)addLog(msg,'shu')}
async function delegateDlg(c){
  const gs=gensIn(c.id).filter(g=>g.id!=='liubei').sort((a,b)=>b.pol-a.pol);let gid=c.gov||(gs[0]&&gs[0].id),mode=c.mode||'auto';
  let gold=c.purse?0:Math.min(S.fac.shu.gold,300),rice=c.purse?0:Math.min(S.fac.shu.rice,Math.round(c.troops*RICE_CITY*6/500)*500);
  for(;;){const first=!c.gov;
    const r=await dialog(`<div class="dzh">守</div><h2>${first?'Delegate':'Governor of'} ${c.name}</h2>
      <p class="muted">A governor runs the city every month with its own purse: the city's income goes to the purse, its troops eat from it, and his orders are paid from it. You can still ask him to send gold, rice, troops or officers.</p>
      <div class="sec">Governor</div><div class="envrow">${gs.map(g=>`<button data-r="g:${g.id}" class="${gid===g.id?'on':''}">${g.name} <i>Pol ${g.pol} · War ${g.war}</i></button>`).join('')}</div>
      <div class="sec">Policy</div><div class="envrow">${Object.entries(GOV_MODES).map(([k,n])=>`<button data-r="m:${k}" class="${mode===k?'on':''}">${n}</button>`).join('')}</div>
      <p class="muted">${{auto:'Balanced: keeps order, answers threats with recruits, then builds.',internal:'Farming and commerce first, then order and walls.',military:'Recruits troops and drills them, then repairs walls.'}[mode]}</p>
      ${first?`<div class="sec">Starting purse (from your treasury)</div><div class="mrow"><label for="dG">Gold <b>${fmt(gold)}</b> of ${fmt(S.fac.shu.gold)}</label><input id="dG" type="range" min="0" max="${S.fac.shu.gold}" step="50" value="${gold}"></div>
      <div class="mrow"><label for="dR">Rice <b>${fmt(rice)}</b> of ${fmt(S.fac.shu.rice)}</label><input id="dR" type="range" min="0" max="${S.fac.shu.rice}" step="500" value="${rice}"></div>`:`<p>Purse: <b>${fmt(c.purse.gold)}</b> gold · <b>${fmt(c.purse.rice)}</b> rice</p>`}`,
      [['cancel','Cancel'],...(first?[]:[['end','Take back direct rule']]),['go',first?'Appoint governor':'Save','primary']]);
    const gi=document.getElementById('dG'),ri=document.getElementById('dR');
    if(r.startsWith('g:')){gid=r.slice(2);continue}if(r.startsWith('m:')){mode=r.slice(2);continue}
    if(r==='end'){endDelegation(c,`You take back direct rule of ${c.name}. Its purse returns to the treasury.`);save();return}
    if(r!=='go'||!gid)return;
    if(first){S.fac.shu.gold-=gold;S.fac.shu.rice-=rice;c.purse={gold,rice};for(const g of gensIn(c.id))g.assign=null}
    c.gov=gid;c.mode=mode;addLog(`${GN(gid).name} governs ${c.name} (${GOV_MODES[mode]}).`,'shu');save();return}}
// the sliders in delegateDlg re-render on change; keep their values between redraws
document.addEventListener('input',e=>{if(e.target.id==='dG'||e.target.id==='dR'){const b=e.target.previousElementSibling.querySelector('b');b.textContent=fmt(+e.target.value)}});
async function requestDlg(c){
  const own=neighbours(c.id).map(C).filter(x=>x.owner==='shu');
  const r=await dialog(`<div class="dzh">令</div><h2>Request from ${c.name}</h2><p class="muted">Governor ${govOf(c).name} will carry out your order.</p>
    <div class="dipl"><button data-r="money"><span class="czh">庫</span>Gold & rice<small>send to your treasury</small></button><button data-r="move" ${own.length?'':'disabled'}><span class="czh">運</span>Troops & officers<small>to a neighbouring city</small></button></div>`,[['cancel','Cancel']]);
  if(r==='move'){openMarch(c.id,null,'transfer');return}
  if(r!=='money')return;
  const P=c.purse;const q=await dialog(`<h2>Send from ${c.name}'s purse</h2>
    <div class="mrow"><label for="qG">Gold <b>0</b> of ${fmt(P.gold)}</label><input id="qG" type="range" min="0" max="${Math.round(P.gold)}" step="50" value="0"></div>
    <div class="mrow"><label for="qR">Rice <b>0</b> of ${fmt(P.rice)}</label><input id="qR" type="range" min="0" max="${Math.round(P.rice)}" step="500" value="0"></div>
    <p class="muted">The governor keeps the rest to run the city. Troops eat ${fmt(Math.round(c.troops*RICE_CITY))} rice a month here.</p>`,[['cancel','Cancel'],['go','Send','primary']]);
  const g=+(document.getElementById('qG')||{}).value||0,rr=+(document.getElementById('qR')||{}).value||0;
  if(q!=='go')return;P.gold-=g;P.rice-=rr;S.fac.shu.gold+=g;S.fac.shu.rice+=rr;addLog(`${c.name} sends ${fmt(g)} gold and ${fmt(rr)} rice to your treasury.`,'shu');save()}
document.addEventListener('input',e=>{if(e.target.id==='qG'||e.target.id==='qR'){e.target.previousElementSibling.querySelector('b').textContent=fmt(+e.target.value)}});
// ===== tooltips (long-press on phones, hover on desktop)
const TIPS={Troops:'Soldiers stationed here. A city can hold about 12% of its population.',Training:'How well drilled the troops are. Fully trained troops hit about 30% harder.',
  Farming:'Sets the rice harvest in the 7th month (40 rice per point).',Commerce:'Sets the gold the city earns each month, scaled by order.',Walls:'Fortifications. Higher walls make defenders much stronger in sieges.',
  Order:'Public order. Low order cuts income; below 30 troops start to desert.',Population:'People living here. Limits recruiting and grows when order is 60 or more.',Harvest:'Months until the next harvest (7th month).',
  War:'War: strength in battle and duels.',Int:'Intelligence: fire attacks, searching, persuading and envoys.',Pol:'Politics: farming, commerce and walls.',Cha:'Charisma: recruiting and how loyal your officers stay.',Loy:'Loyalty: below 75 rivals can lure him away; below 60 he may leave on his own. Reward raises it.',
  Gold:'Your treasury. Pays for commands and salaries (5 gold per officer a month).',Rice:'Feeds your troops: 0.1 a month per soldier in a city, 0.2 on the march.',Cities:'Cities you hold. Hold 10 of the 14 by the end of 215 to win.',
  Status:'Ready: can act this month. Done: has acted. Assigned: on a long-term task.'};
(()=>{let t=null,tipEl=null;const show=(el,x,y)=>{hide();const k=el.dataset.tip;if(!TIPS[k])return;tipEl=document.createElement('div');tipEl.className='tipbox';tipEl.innerHTML=`<b>${k}</b> ${TIPS[k]}`;document.body.appendChild(tipEl);
    const r=tipEl.getBoundingClientRect();tipEl.style.left=Math.max(8,Math.min(innerWidth-r.width-8,x-r.width/2))+'px';tipEl.style.top=(y-r.height-14<8?y+20:y-r.height-14)+'px';SND.fx('tap')};
  const hide=()=>{if(tipEl){tipEl.remove();tipEl=null}};
  addEventListener('pointerdown',e=>{const el=e.target.closest('[data-tip]');hide();if(!el)return;clearTimeout(t);t=setTimeout(()=>{show(el,e.clientX,e.clientY);el.dataset.tipped='1'},450)},{passive:true});
  ['pointerup','pointercancel','pointermove'].forEach(ev=>addEventListener(ev,e=>{if(ev==='pointermove'&&e.pointerType==='mouse')return;clearTimeout(t)},{passive:true}));
  addEventListener('click',e=>{const el=e.target.closest('[data-tipped]');if(el){delete el.dataset.tipped;e.stopPropagation();e.preventDefault()}},true);
  addEventListener('scroll',hide,{capture:true,passive:true});addEventListener('pointerup',()=>setTimeout(hide,2200),{passive:true});
  addEventListener('mouseover',e=>{const el=e.target.closest('[data-tip]');if(el&&!el.title)el.title=TIPS[el.dataset.tip]||''},{passive:true})})();
function renderCampaign(){
  if(!S)return;""")

# statRow + header tips
R("function statRow(label,val,max){return `<div class=\"srow\"><span>${label}</span>","function statRow(label,val,max){return `<div class=\"srow\" data-tip=\"${label}\"><span>${label}</span>")
R("""<span>War</span><span>Int</span><span>Pol</span><span>Cha</span><span title="Loyalty">Loy</span><span>${mine?'Status':''}</span></div>`;""",
  """<span data-tip="War">War</span><span data-tip="Int">Int</span><span data-tip="Pol">Pol</span><span data-tip="Cha">Cha</span><span data-tip="Loy">Loy</span><span data-tip="Status">${mine?'Status':''}</span></div>`;""")
R("function renderCampaign(){\n  if(!S)return;","function renderCampaign(){\n  if(!S)return;document.querySelectorAll('.cres>div').forEach(d=>{const k=(d.querySelector('span')||{}).textContent;if(TIPS[k])d.dataset.tip=k});")

# status column: assigned / governor
R("""${mine?`<span class="gst ${g.acted?'done':''}">${g.acted?'Done':'Ready'}</span>`""",
  """${mine?`<span class="gst ${g.acted?'done':g.assign?'asg':''}" title="${g.assign?assignLbl(g):''}">${c.gov===g.id?'Governor':g.acted?'Done':g.assign?'Assigned':'Ready'}</span>`""")

# command list: show assigned officers, and a duration picker for farm/com/train
R("""    b+=`<div class="chead"><div><div class="sec">${v.zh} ${v.n} · ${cost}</div><p class="muted">Choose who will do it. ${v.tip}.</p></div><button data-act="back">Cancel</button></div>`;""",
  """    b+=`<div class="chead"><div><div class="sec">${v.zh} ${v.n} · ${cost}${ASSIGNABLE.includes(k)&&(UI.dur||1)>1?' a month':''}</div><p class="muted">Choose who will do it. ${v.tip}.</p></div><button data-act="back">Cancel</button></div>`;
    if(ASSIGNABLE.includes(k))b+=`<div class="durrow"><span>For</span>${[1,3,6,12].map(n=>`<button data-act="dur" data-n="${n}" class="${(UI.dur||1)===n?'on':''}">${n===1?'This month':n+' months'}</button>`).join('')}</div>${(UI.dur||1)>1?`<p class="muted">Starting this month, he repeats it at the end of every month, paying ${cost} each time. Total ${Object.entries(v.cost).map(([r,n])=>`${n*(UI.dur)} ${r}`).join(', ')||'free'}.</p>`:''}`;""")
R("""<span class="oname"><b>${g.name}</b><small>${isRuler(g)?'Ruler':TYPES[g.type].n}</small></span><span class="opick">""",
  """<span class="oname"><b>${g.name}</b><small>${g.assign?`<span class="asgt">Assigned: ${assignLbl(g)}</span>`:isRuler(g)?'Ruler':TYPES[g.type].n}</small></span><span class="opick">""")
R("  if(b.dataset.gen){const g=GN(b.dataset.gen),k=UI.cmd;UI.busy=true;const m=doCmd(k,g,c,'shu');addLog(m,'shu');save();",
  """  if(b.dataset.gen){const g=GN(b.dataset.gen),k=UI.cmd;
    if(k!=='reward'&&g.assign){UI.busy=true;const ok=await confirmBreakAssign(g);UI.busy=false;if(!ok){renderCampaign();return}}
    const dur=ASSIGNABLE.includes(k)?(UI.dur||1):1;
    UI.busy=true;const m=doCmd(k,g,c,'shu');if(dur>1){g.assign={k,left:dur-1};addLog(`${m} <i>(assigned for ${dur} months)</i>`,'shu')}else addLog(m,'shu');save();""")
R("  if(a==='rtab'){UI.rtab=b.dataset.t;renderCity();return}","""  if(a==='rtab'){UI.rtab=b.dataset.t;renderCity();return}
  if(a==='dur'){UI.dur=+b.dataset.n;renderCity();return}
  if(a==='transfer'){openMarch(c.id,null,'transfer');return}
  if(a==='delegate'){UI.busy=true;try{await delegateDlg(c)}finally{UI.busy=false;renderCampaign()}return}
  if(a==='request'){UI.busy=true;try{await requestDlg(c)}finally{UI.busy=false;renderCampaign()}return}""")
# reset duration when switching commands
R("if(b.dataset.cmd){if(UI.mode==='cmd'&&UI.cmd===b.dataset.cmd)UI.mode='city';else{UI.mode='cmd';UI.cmd=b.dataset.cmd}renderCity();return}",
  "if(b.dataset.cmd){if(UI.mode==='cmd'&&UI.cmd===b.dataset.cmd)UI.mode='city';else{UI.mode='cmd';UI.cmd=b.dataset.cmd;UI.dur=1}renderCity();return}")
# the list for assignable/other commands: assigned officers still listed (they act at month end)
# column C for own cities: delegated vs direct
R("""  if(mine){
    cc+=`<div class="sec">Commands</div><div class="cmdgrid">""","""  if(mine&&isDelegated(c)){const gv=govOf(c);
    cc+=`<div class="sec">Governed city</div><div class="govcard"><b>${gv?gv.name:'—'}</b><small>Governor · ${GOV_MODES[c.mode||'auto']} policy</small><div>Purse <b>${fmt(c.purse.gold)}</b> gold · <b>${fmt(c.purse.rice)}</b> rice</div></div>
      <button class="primary wide" data-act="request"><span class="czh">令</span> Request gold, rice, troops</button><button class="wide" data-act="delegate"><span class="czh">守</span> Governor & policy</button>`;
  } else if(mine){
    cc+=`<div class="sec">Commands</div><div class="cmdgrid">""")
R("""    cc+=`<button class="primary wide" data-act="march"><span class="czh">征</span> March or move</button>`;""",
  """    cc+=`<div class="mvrow"><button class="primary" data-act="march"><span class="czh">征</span> March</button><button data-act="transfer"><span class="czh">運</span> Transfer</button></div>`;
    if(!gensIn(c.id).some(g=>g.id==='liubei')&&gensIn(c.id).length)cc+=`<button class="wide" data-act="delegate"><span class="czh">守</span> Delegate to a governor</button>`;""")
# commands in a delegated city's officer list shouldn't be clickable: mode cmd only when not delegated
R("  if(UI.mode==='cmd'&&mine){","  if(UI.mode==='cmd'&&mine&&!isDelegated(c)){")

# ---------- march dialog: transfer mode
R("function openMarch(from,to){\n  const m={from,to,sel:new Set(),troops:0,rice:0,cmd:null,al:{}};",
  "function openMarch(from,to,mode){\n  const m={from,to,sel:new Set(),troops:0,rice:0,cmd:null,al:{}},xfer=mode==='transfer',purse=C(from).gov?C(from).purse:null,RS=purse||S.fac.shu;")
R("  const targets=()=>neighbours(m.from).map(C).filter(t=>!allied('shu',t.owner)||t.owner==='shu');",
  "  const targets=()=>neighbours(m.from).map(C).filter(t=>xfer?t.owner==='shu':(!allied('shu',t.owner)||t.owner==='shu'));")
R("  const avail=()=>gensIn(m.from).filter(g=>!g.acted);","  const avail=()=>gensIn(m.from).filter(g=>!g.acted&&!(purse&&C(from).gov===g.id));")
R("  const reRice=()=>{m.rice=Math.min(S.fac.shu.rice,Math.round(m.troops*RICE_MARCH*(travel()+3)/100)*100)};",
  "  const need=()=>Math.ceil(m.troops*RICE_MARCH*travel()/100)*100;\n  const reRice=()=>{m.rice=Math.min(RS.rice,xfer||(m.to&&C(m.to).owner==='shu')?need():Math.round(m.troops*RICE_MARCH*(travel()+3)/100)*100)};")
R("  m.rice=Math.min(S.fac.shu.rice,Math.round(m.troops*RICE_MARCH*(travel()+3)/100)*100);","  reRice();")
R("const maxT=src.troops,maxR=S.fac.shu.rice;","const maxT=src.troops,maxR=Math.round(RS.rice);const short=own&&m.troops>0&&m.rice<need();")
R("    box.innerHTML=`<h2>March from ${src.name}</h2>","    box.innerHTML=`<h2>${xfer?'Transfer from':'March from'} ${src.name}${purse?' <small class=\"muted\">· paid from the governor\\'s purse</small>':''}</h2>")
R("${!m.sel.size||(!m.troops&&!own)||!m.to||empty?'disabled':''}>${own?'Move out':'March out'}",
  "${!m.sel.size&&!m.troops||(!m.troops&&!own)||!m.to||empty||short?'disabled':''}>${own?'Transfer':'March out'}")
R("""      ${tgt&&lasts<tr+1&&!own?'<p class="bad">""","""      ${own&&m.troops?`<p class="${short?'bad':'muted'}">The journey needs ${fmt(need())} rice for ${fmt(m.troops)} troops${short?' — not enough rice.':'. Rice left over joins the destination.'}</p>`:''}
      ${tgt&&lasts<tr+1&&!own?'<p class="bad">""")
R("""<b>${g.name}</b><small>W${g.war} I${g.int} · ${TYPES[g.type].n}</small></div>""","""<b>${g.name}</b><small>${g.assign?`<span class="asgt">${assignLbl(g)} · leaving ends it</span>`:`W${g.war} I${g.int} · ${TYPES[g.type].n}`}</small></div>""")
R("    if(b.dataset.r==='go'){const ci=cmdOf(),order=[GN(ci),...cmdOrder([...m.sel].filter(id=>id!==ci).map(GN))];launchArmy('shu',m.from,m.to,order,m.troops,m.rice,Object.fromEntries(order.map(g=>[g.id,m.al[g.id]||0])));",
  "    if(b.dataset.r==='go'){const ci=cmdOf(),order=m.sel.size?[GN(ci),...cmdOrder([...m.sel].filter(id=>id!==ci).map(GN))]:[];for(const g of order)g.assign=null;if(purse){S.fac.shu.rice+=m.rice;purse.rice-=m.rice}launchArmy('shu',m.from,m.to,order,m.troops,m.rice,Object.fromEntries(order.map(g=>[g.id,m.al[g.id]||0])));")
R("addLog(`${order.map(gnm).join(', ')} march from ${C(m.from).name} to ${C(m.to).name} with ${fmt(m.troops)} troops.`,'shu');save()}",
  "addLog(own?`${order.length?order.map(gnm).join(', '):'A convoy'} ${order.length?'set':'sets'} out from ${C(m.from).name} to ${C(m.to).name}${m.troops?` with ${fmt(m.troops)} troops`:''}.`:`${order.map(gnm).join(', ')} march from ${C(m.from).name} to ${C(m.to).name} with ${fmt(m.troops)} troops.`,'shu');save()}")
R("const empty=!own&&[...m.sel].some(id=>!(m.al[id]>0));","const empty=!own&&[...m.sel].some(id=>!(m.al[id]>0));const tgtOwnTroopsOnly=own&&!m.sel.size;")
# arrivals into a delegated city: rice goes to its purse
R("    c.troops+=a.troops;S.fac[a.fac].rice+=Math.round(a.rice);","    c.troops+=a.troops;if(isDelegated(c))c.purse.rice+=Math.round(a.rice);else S.fac[a.fac].rice+=Math.round(a.rice);")

# ---------- economy: delegated cities use their purse
R("""    const inc=cs.reduce((s,c)=>s+c.com*.5*c.order/100,0),sal=gensOf(f).length*SALARY;
    F.gold=Math.round(F.gold+inc-sal);
    const use=cs.reduce((s,c)=>s+c.troops*RICE_CITY,0);F.rice=Math.round(F.rice-use);
    if(S.month===7){const h=cs.reduce((s,c)=>s+c.farm*40,0);F.rice+=h;if(f==='shu')addLog(`The harvest brings in ${fmt(h)} rice.`,'shu')}""",
"""    const dl=cs.filter(isDelegated),dr=cs.filter(c=>!isDelegated(c));
    for(const c of dl){const P=c.purse;P.gold=Math.round(P.gold+c.com*.5*c.order/100-gensIn(c.id).length*SALARY);P.rice=Math.round(P.rice-c.troops*RICE_CITY);
      if(S.month===7){const h=c.farm*40;P.rice+=h;addLog(`${c.name}'s harvest brings ${fmt(h)} rice into the governor's purse.`,'shu')}
      if(P.rice<0){P.rice=0;c.troops=Math.round(c.troops*.9);c.order=Math.max(0,c.order-5);addLog(`<b>${c.name} has run out of rice.</b> 10% of its troops desert.`,'shu')}
      if(P.gold<0){P.gold=0;c.order=Math.max(0,c.order-2)}}
    const inGov=new Set(dl.flatMap(c=>gensIn(c.id).map(g=>g.id)));
    const inc=dr.reduce((s,c)=>s+c.com*.5*c.order/100,0),sal=gensOf(f).filter(g=>!inGov.has(g.id)).length*SALARY;
    F.gold=Math.round(F.gold+inc-sal);
    const use=dr.reduce((s,c)=>s+c.troops*RICE_CITY,0);F.rice=Math.round(F.rice-use);
    if(S.month===7){const h=dr.reduce((s,c)=>s+c.farm*40,0);F.rice+=h;if(f==='shu')addLog(`The harvest brings in ${fmt(h)} rice.`,'shu')}""")
R("    if(F.rice<0){F.rice=0;for(const c of cs){","    if(F.rice<0){F.rice=0;for(const c of dr){")
# captured / lost delegated city
R("function takeCity(a,c,gens,troops,broken){","function takeCity(a,c,gens,troops,broken){if(c.gov){c.gov=null;c.purse=null;c.mode=null}")

# ---------- endMonth: run assignments + governors, then summary
R("    for(const f of Object.keys(FACS))if(f!=='shu'&&alive(f))aiTurn(f);\n    renderMap();",
  "    UI.logStart=S.logN||0;\n    runAssignments();govTick();\n    for(const f of Object.keys(FACS))if(f!=='shu'&&alive(f))aiTurn(f);\n    renderMap();")
R("""    if(nw.length)setTimeout(()=>toast(`⚠ ${nw.map(a=>`${FACS[a.fac].short} army of ${fmt(a.troops)} marching on ${C(a.to).name}`).join(' · ')}`),1150)}""",
  """    setTimeout(()=>monthSummary(nw),1150)}""")
R("function monthFx(){",r"""async function monthSummary(nw){
  const L=S.log.filter(l=>l.n>(UI.logStart||0)).reverse();const mine=L.filter(l=>l.f==='shu'),other=L.filter(l=>l.f!=='shu');const T=threats();
  if(!L.length&&!T.length)return;
  const ic=h=>/takes|defeats|holds|falls|Battle|battle/.test(h)?'⚔':/harvest/.test(h)?'🌾':/goes over|leaves|lured|deserted|slips|defect|joins|agrees to serve|persuades/.test(h)?'🔀':/run out|Riots|empty|desert/.test(h)?'⚠':/Governor|governs|assigned/.test(h)?'守':'·';
  const li=l=>`<li><span class="smi">${ic(l.h)}</span><span>${l.h}</span></li>`;
  UI.busy=true;await dialog(`<div class="dzh">報</div><h2>Report · ${dateStr()}</h2>
    ${T.length?`<div class="sec">Threats</div><ul class="sumlist thr">${T.map(a=>`<li><span class="smi">⚠</span><span>${FACS[a.fac].short} army of <b>${fmt(a.troops)}</b> reaches <b>${C(a.to).name}</b> ${a.left<=1?'next month':`in ${a.left} months`}${nw.includes(a)?' <em class="newb">new</em>':''}</span></li>`).join('')}</ul>`:''}
    ${mine.length?`<div class="sec">Your realm</div><ul class="sumlist">${mine.map(li).join('')}</ul>`:''}
    ${other.length?`<div class="sec">Across the land</div><ul class="sumlist">${other.map(li).join('')}</ul>`:''}
    <p class="muted">Rivals' domestic work is in the Enemies tab.</p>`,[['ok','Continue','primary']]);UI.busy=false;renderCampaign()}
function monthFx(){""")
open(p,'w').write(s)

h='game/hud.py';u=open(h).read()
u=u.replace(".cmdpick.on{color:#1a140c;",""".mvrow{display:grid;grid-template-columns:1.3fr 1fr;gap:6px}.mvrow button{min-height:48px}
.durrow{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin:4px 0 6px}.durrow>span{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.06em}.durrow button{min-height:34px;padding:4px 10px;font-size:13px}.durrow button.on{border-color:var(--gold);color:#f3dc9a;background:#2a2116}
.gst.asg{color:#9cc4e8;border-color:#5a7a9a}.asgt{color:#9cc4e8;font-weight:600}
.govcard{padding:10px 12px;border-radius:10px;background:#1c2418;border:1px solid #4f9a5a;display:flex;flex-direction:column;gap:3px;margin-bottom:6px}.govcard b{color:#f3e6c4}.govcard small{color:var(--muted)}
.tipbox{position:fixed;z-index:400;max-width:280px;padding:8px 12px;border-radius:10px;background:#f3e6c4;color:#241a10;font:500 13.5px/1.4 var(--f-body);box-shadow:0 6px 20px rgba(0,0,0,.5);pointer-events:none}.tipbox b{display:block;font-size:12px;letter-spacing:.05em;text-transform:uppercase;color:#7a5a2a}
[data-tip]{-webkit-touch-callout:none}
.sumlist{list-style:none;margin:0 0 8px;padding:0;display:flex;flex-direction:column;gap:4px;max-height:34vh;overflow:auto;font-size:13.5px}.sumlist li{display:flex;gap:8px;align-items:flex-start}.smi{flex:none;width:20px;text-align:center}.sumlist.thr li{color:#ffd6cc}.newb{font-style:normal;font-size:11px;padding:1px 6px;border-radius:8px;background:#c4473a;color:#fff;margin-left:4px}
.cmdpick.on{color:#1a140c;""",1)
open(h,'w').write(u)
print('ok')
