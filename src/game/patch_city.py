p='game/camp.js';s=open(p).read()
def R(a,b,n=1):
    global s; assert s.count(a)==n,(a[:100],s.count(a)); s=s.replace(a,b)

# ---------- helpers: per-city stores
R("const isDelegated=c=>!!(c&&c.owner==='shu'&&c.gov);",
"""const isDelegated=c=>!!(c&&c.owner==='shu'&&c.gov);
// each city keeps its own gold and rice; a faction's wealth is the sum of its cities
const facGold=f=>Math.round(citiesOf(f).reduce((s,c)=>s+(c.gold||0),0)),facRice=f=>Math.round(citiesOf(f).reduce((s,c)=>s+(c.rice||0),0));
const canPay=(c,cost)=>Object.entries(cost).every(([r,n])=>(c[r]||0)>=n);
// spread a faction's stores over its cities by population (new game and old saves)
function spreadStores(f,gold,rice){const cs=citiesOf(f);const P=cs.reduce((s,c)=>s+c.pop,0)||1;for(const c of cs){c.gold=(c.gold||0)+Math.round(gold*c.pop/P);c.rice=(c.rice||0)+Math.round(rice*c.pop/P)}}
function migrateStores(){if(Object.values(S.cities).every(c=>typeof c.gold==='number'))return;
  for(const c of Object.values(S.cities)){c.gold=c.purse?Math.round(c.purse.gold):0;c.rice=c.purse?Math.round(c.purse.rice):0;delete c.purse}
  for(const f in FACS){const F=S.fac&&S.fac[f];if(F)spreadStores(f,F.gold||0,F.rice||0)}
  for(const a of S.armies)a.gold=a.gold||0}""")

# ---------- new game
R("  S.diff=diff||'normal';for(const f in FACS)S.fac[f]={gold:FACS[f].gold,rice:FACS[f].rice};S.fac.shu.gold=DF().gold;S.fac.shu.rice=DF().rice;",
  "  S.diff=diff||'normal';")
R("""    S.cities[id]={id,name,zh,x,y,owner,troops,farm,farmMax,com,comMax,walls,order,pop,train}}""",
  """    S.cities[id]={id,name,zh,x,y,owner,troops,farm,farmMax,com,comMax,walls,order,pop,train,gold:0,rice:0}}
  for(const f in FACS)spreadStores(f,f==='shu'?DF().gold:FACS[f].gold,f==='shu'?DF().rice:FACS[f].rice);""")
# load / continue
R("function startFrom(sv){S=sv;if(!S)return;delete S.savedAt;","function startFrom(sv){S=sv;if(!S)return;delete S.savedAt;migrateStores();")

# ---------- assignments / governor
R("const k=g.assign.k,afford=Object.entries(CMDS[k].cost).every(([r,n])=>S.fac.shu[r]>=n);",
  "const k=g.assign.k,afford=canPay(c,CMDS[k].cost);")
R("cannot carry out his ${CMDS[k].n.toLowerCase()} assignment: not enough gold.`","cannot carry out his ${CMDS[k].n.toLowerCase()} assignment: ${c.name} is short of gold.`")
R("    const P=c.purse;S.fac.__gov=P;const did=[];","    const P=c;const did=[];")
R("      if(!k||!Object.entries(CMDS[k].cost).every(([r,n])=>P[r]>=n))continue;doCmd(k,g,c,'__gov');did.push(CMDS[k].n.toLowerCase())}\n    delete S.fac.__gov;",
  "      if(!k||!canPay(c,CMDS[k].cost))continue;doCmd(k,g,c,'shu');did.push(CMDS[k].n.toLowerCase())}")
R("function endDelegation(c,msg){if(c.purse){S.fac.shu.gold+=Math.round(c.purse.gold);S.fac.shu.rice+=Math.round(c.purse.rice)}c.gov=null;c.purse=null;c.mode=null;",
  "function endDelegation(c,msg){c.gov=null;c.mode=null;")
R("  let gold=c.purse?0:Math.min(S.fac.shu.gold,300),rice=c.purse?0:Math.min(S.fac.shu.rice,Math.round(c.troops*RICE_CITY*6/500)*500);\n","")
R("<p class=\"muted\">A governor runs the city every month with its own purse: the city's income goes to the purse, its troops eat from it, and his orders are paid from it. You can still ask him to send gold, rice, troops or officers.</p>",
  "<p class=\"muted\">A governor runs the city every month, paying for his orders from the city's own gold and rice. You can still order him to send gold, rice, troops or officers to your other cities.</p>")
a=s[s.index("      ${first?`<div class=\"sec\">Starting purse"):]
a=a[:a.index("rice</p>`}`,")+len("rice</p>`}`,")]
R(a,"      <p>${c.name} holds <b>${fmt(c.gold)}</b> gold · <b>${fmt(c.rice)}</b> rice.</p>`,")
R("    const gi=document.getElementById('dG'),ri=document.getElementById('dR');if(gi)gold=+gi.value;if(ri)rice=+ri.value;\n","")
R("endDelegation(c,`You take back direct rule of ${c.name}. Its purse returns to the treasury.`)","endDelegation(c,`You take back direct rule of ${c.name}.`)")
R("    if(first){S.fac.shu.gold-=gold;S.fac.shu.rice-=rice;c.purse={gold,rice};for(const g of gensIn(c.id))g.assign=null}","    if(first){for(const g of gensIn(c.id))g.assign=null}")
a=s[s.index("async function requestDlg(c){"):]
a=a[:a.index("// ===== tooltips")]
R(a,"async function requestDlg(c){openMarch(c.id,null,'transfer')}\n")

# ---------- top bar & city panel
R("  const sf=S.fac.shu,my=citiesOf('shu');","  const my=citiesOf('shu');")
R("  $('#cGold').textContent=fmt(sf.gold);$('#cRice').textContent=fmt(sf.rice);","  $('#cGold').textContent=fmt(facGold('shu'));$('#cRice').textContent=fmt(facRice('shu'));")
R("  a+=`<div class=\"sgrid\">${statRow('Troops',fmt(c.troops))}","  a+=`<div class=\"sgrid\">${mine?statRow('City gold',fmt(c.gold))+statRow('City rice',fmt(c.rice)):''}${statRow('Troops',fmt(c.troops))}")
R("    const afford=Object.entries(v.cost).every(([r,n])=>S.fac.shu[r]>=n);","    const afford=canPay(c,v.cost);")
R("if(!afford)b+=`<p class=\"bad\">Not enough ${Object.keys(v.cost).join(' and ')}.</p>`;","if(!afford)b+=`<p class=\"bad\">${c.name} does not have enough ${Object.keys(v.cost).join(' and ')} (${fmt(c.gold)} gold). Transfer some from another city.</p>`;")
R("<div>Purse <b>${fmt(c.purse.gold)}</b> gold · <b>${fmt(c.purse.rice)}</b> rice</div></div>","<div><b>${fmt(c.gold)}</b> gold · <b>${fmt(c.rice)}</b> rice</div></div>")
R("<span class=\"czh\">令</span> Request</button>","<span class=\"czh\">運</span> Order a transfer</button>")
# tooltips
R("Gold:'Your treasury. Pays for commands and salaries (5 gold per officer a month).',Rice:'Feeds your troops: 0.1 a month per soldier in a city, 0.2 on the march.',",
  "Gold:'Total gold in all your cities. Each city pays for its own orders and officers (5 gold each a month); move gold with Transfer.',Rice:'Total rice in all your cities. Troops eat from their own city: 0.1 a month per soldier, 0.2 on the march.','City gold':'Gold kept in this city. Its orders, rewards and officer salaries are paid from here.','City rice':'Rice kept in this city. Its troops eat from here and its harvest lands here.',")

# ---------- doCmd: charge the city
R("  const F=S.fac[f],v=CMDS[k];for(const [r,n] of Object.entries(v.cost))F[r]-=n;","  const F=c,v=CMDS[k];for(const [r,n] of Object.entries(v.cost))F[r]-=n;")
R("*(f!=='shu'&&f!=='__gov'?DF().aiRec:DF().pRec)),","*(f!=='shu'?DF().aiRec:DF().pRec)),")

# ---------- welcome reward (doCmd already charges the city)
R("for(;;){const can=g.loy<100&&!g.rewarded&&S.fac.shu.gold>=100,img=portraitSrc(g);","for(;;){const gc=C(g.city)||c,can=g.loy<100&&!g.rewarded&&gc.gold>=100,img=portraitSrc(g);")
R("if(r==='rew'){if(!can){toast('Not enough gold.');continue}S.fac.shu.gold-=100;const m=doCmd('reward',g,c,'shu');",
  "if(r==='rew'){if(!can){toast(`${gc.name} does not have 100 gold.`);continue}const m=doCmd('reward',g,gc,'shu');")

# ---------- march / transfer with gold
R("const m={from,to,sel:new Set(),troops:0,rice:0,cmd:null,al:{}},xfer=mode==='transfer',purse=C(from).gov?C(from).purse:null,RS=purse||S.fac.shu;",
  "const m={from,to,sel:new Set(),troops:0,rice:0,gold:0,cmd:null,al:{}},xfer=mode==='transfer',purse=C(from).gov?C(from):null,RS=C(from);")
R("const maxT=src.troops,maxR=Math.round(RS.rice);","const maxT=src.troops,maxR=Math.round(RS.rice),maxG=Math.round(RS.gold);m.gold=Math.min(m.gold,maxG);")
R("    box.innerHTML=`<h2>${xfer?'Transfer from':'March from'} ${src.name}${purse?' <small class=\"muted\">· paid from the governor\\'s purse</small>':''}</h2>",
  "    box.innerHTML=`<h2>${xfer?'Transfer from':'March from'} ${src.name}${purse?' <small class=\"muted\">· governed city</small>':''}</h2>")
R("""      <div class="mrow"><label for="mRice">Rice <b>${fmt(m.rice)}</b> of ${fmt(maxR)} · lasts ${lasts} month${lasts===1?'':'s'}</label>""",
  """      ${own||xfer?`<div class="mrow"><label for="mGold">Gold to send <b>${fmt(m.gold)}</b> of ${fmt(maxG)}</label><input id="mGold" type="range" min="0" max="${maxG}" step="50" value="${m.gold}"></div>`:''}
      <div class="mrow"><label for="mRice">Rice${own?' to send':''} <b>${fmt(m.rice)}</b> of ${fmt(maxR)}${own?(m.troops?` · ${fmt(Math.max(0,m.rice-need()))} arrives`:''):` · lasts ${lasts} month${lasts===1?'':'s'}`}</label>""")
R("${own&&m.troops?`<p class=\"${short?'bad':'muted'}\">The journey needs ${fmt(need())} rice for ${fmt(m.troops)} troops${short?' — not enough rice.':'. Rice left over joins the destination.'}</p>`:''}",
  "${own&&m.troops?`<p class=\"${short?'bad':'muted'}\">The troops eat ${fmt(need())} rice on the way${short?' — not enough rice.':'; the rest is stored in '+tgt.name+'.'}</p>`:''}${own?`<p class=\"muted\">Gold and rice travel with the convoy and arrive in ${tr} month${tr>1?'s':''}.</p>`:''}")
R("${!m.sel.size&&!m.troops||(!m.troops&&!own)||!m.to||empty||short?'disabled':''}",
  "${(!m.sel.size&&!m.troops&&!(own&&(m.gold||m.rice)))||(!m.troops&&!own)||!m.to||empty||short?'disabled':''}")
R("    $('#mRice').onchange=()=>draw();","    $('#mRice').onchange=()=>draw();\n    const gi=$('#mGold');if(gi){gi.oninput=e=>{m.gold=+e.target.value;e.target.previousElementSibling.querySelector('b').textContent=fmt(m.gold)};gi.onchange=()=>draw()}")
R("for(const g of order)g.assign=null;if(purse){S.fac.shu.rice+=m.rice;purse.rice-=m.rice}launchArmy('shu',m.from,m.to,order,m.troops,m.rice,Object.fromEntries(order.map(g=>[g.id,m.al[g.id]||0])));",
  "for(const g of order)g.assign=null;launchArmy('shu',m.from,m.to,order,m.troops,m.rice,Object.fromEntries(order.map(g=>[g.id,m.al[g.id]||0])),own?m.gold:0);")
R("${order.length?order.map(gnm).join(', '):'A convoy'} ${order.length?'set':'sets'} out from ${C(m.from).name} to ${C(m.to).name}${m.troops?` with ${fmt(m.troops)} troops`:''}.`",
  "${order.length?order.map(gnm).join(', '):'A convoy'} ${order.length?'set':'sets'} out from ${C(m.from).name} to ${C(m.to).name}${[m.troops?fmt(m.troops)+' troops':'',m.gold?fmt(m.gold)+' gold':'',m.rice?fmt(m.rice)+' rice':''].filter(Boolean).length?' with '+[m.troops?fmt(m.troops)+' troops':'',m.gold?fmt(m.gold)+' gold':'',m.rice?fmt(m.rice)+' rice':''].filter(Boolean).join(', '):''}.`")
R("function launchArmy(f,from,to,gens,troops,rice,split){","function launchArmy(f,from,to,gens,troops,rice,split,gold){")
R("  src.troops-=troops;S.fac[f].rice-=rice;","  gold=Math.max(0,Math.min(gold||0,src.gold||0));rice=Math.max(0,Math.min(rice,src.rice||0));src.troops-=troops;src.rice-=rice;src.gold-=gold;")
R("troops,rice,left:tr,total:tr,train:src.train};","troops,rice,gold,left:tr,total:tr,train:src.train};")

# ---------- arrivals, retreats, capture
R("  if(!gens.length&&a.troops<=0)return;\n  if(c.owner===a.fac){","  if(c.owner===a.fac){c.gold+=Math.round(a.gold||0);a.gold=0}\n  if(!gens.length&&a.troops<=0){if(c.owner===a.fac)c.rice+=Math.round(a.rice);else returnHome(a,[],0);return}\n  if(c.owner===a.fac){")
R("    c.troops+=a.troops;if(isDelegated(c))c.purse.rice+=Math.round(a.rice);else S.fac[a.fac].rice+=Math.round(a.rice);","    c.troops+=a.troops;c.rice+=Math.round(a.rice);")
R("  home.troops+=troops;S.fac[a.fac].rice+=Math.round(a.rice*.5);","  home.troops+=troops;home.rice+=Math.round(a.rice*.5);home.gold+=Math.round(a.gold||0);")
R("function takeCity(a,c,gens,troops,broken){if(c.gov){c.gov=null;c.purse=null;c.mode=null}","function takeCity(a,c,gens,troops,broken){if(c.gov){c.gov=null;c.mode=null}")
R("  S.fac[a.fac].rice+=Math.round(a.rice*.8);S.fac[a.fac].gold+=300;","  c.gold=Math.round((c.gold||0)*.5+300+(a.gold||0));c.rice=Math.round((c.rice||0)*.5+a.rice*.8);")

# ---------- diplomacy costs: from the envoy's city
R("${p<=0||S.fac.shu.gold<100?'disabled':''}","${p<=0||C(env.city).gold<100?'disabled':''}")
R("const t=GN(r.slice(2)),p=persuadeChance(env,t);S.fac.shu.gold-=100;","const t=GN(r.slice(2)),p=persuadeChance(env,t);C(env.city).gold-=100;")
R("...(done||S.fac.shu.gold<200?[]:[['go','Send the envoy','primary']])","...(done||C(env.city).gold<200?[]:[['go','Send the envoy','primary']])")
R("(S.surTry=S.surTry||{})[f]=dateNum();S.fac.shu.gold-=200;","(S.surTry=S.surTry||{})[f]=dateNum();C(env.city).gold-=200;")
R("      S.fac.shu.gold+=S.fac[f].gold;S.fac.shu.rice+=S.fac[f].rice;S.fac[f].gold=0;S.fac[f].rice=0;S['gone_'+f]=1;","      S['gone_'+f]=1;")
s=s.replace("Costs 100 gold and uses your envoy's action.","Costs 100 gold from the envoy's city and uses his action.",1)
s=s.replace("Costs 200 gold and uses your envoy's action.","Costs 200 gold from the envoy's city and uses his action.",1)

# ---------- economy: per city, every faction
a=s[s.index("function economy(){"):]
a=a[:a.index("\nasync function events(){")]
R(a,r"""function economy(){
  for(const f of Object.keys(FACS)){if(!alive(f))continue;const cs=citiesOf(f);let starve=0,broke=0;
    for(const c of cs){c.gold=Math.round(c.gold+c.com*.5*c.order/100*(f==='shu'?DF().inc:1)-gensIn(c.id).length*SALARY);
      c.rice=Math.round(c.rice-c.troops*RICE_CITY);
      if(S.month===7){const h=c.farm*40;c.rice+=h;if(f==='shu')addLog(`${c.name}'s harvest brings in ${fmt(h)} rice.`,'shu')}
      if(c.rice<0){c.rice=0;c.troops=Math.round(c.troops*.9);c.order=Math.max(0,c.order-5);starve++;if(f==='shu')addLog(`<b>${c.name} has run out of rice.</b> 10% of its troops desert and order falls.`,'shu')}
      if(c.gold<0){c.gold=0;c.order=Math.max(0,c.order-2);broke++;if(f==='shu')addLog(`${c.name} cannot pay its officials. Order slips.`,'shu')}
      if(c.order>=60)c.pop=Math.round((c.pop*1.004)*10)/10;
      if(c.order<30){const l=Math.round(c.troops*.05);c.troops-=l;if(f==='shu')addLog(`Riots in ${c.name}: ${fmt(l)} troops desert.`,'shu')}}}
}""")

# ---------- AI: per-city money, plus supply convoys
R("  const F=S.fac[f],A=FACS[f].ai;","  const A=FACS[f].ai;")
R("  for(const c of citiesOf(f)){\n    const gs=gensIn(c.id).filter(g=>!g.acted).sort((a,b)=>b.pol-a.pol);","  for(const c of citiesOf(f)){\n    const gs=gensIn(c.id).filter(g=>!g.acted).sort((a,b)=>b.pol-a.pol),F=c;")
R("F.gold>800&&F.rice>allTroops*RICE_CITY*10&&","F.gold>800&&F.rice>(c.troops+1000)*RICE_CITY*10&&")
R("      if(!k)continue;if(!Object.entries(CMDS[k].cost).every(([r,n])=>F[r]>=n))continue;","      if(!k)continue;if(!canPay(c,CMDS[k].cost))continue;")
R("launchArmy(f,c.id,to,spare,amt,Math.min(F.rice,Math.round(amt*RICE_MARCH*tr)));","launchArmy(f,c.id,to,spare,amt,Math.round(amt*RICE_MARCH*tr+Math.max(0,c.rice-c.troops*RICE_CITY*8)*.5),null,Math.max(0,c.gold-600)*.5);")
R("      if(ratio>bar&&F.rice>need+c.troops*RICE_CITY*4&&(!best||ratio>best.score))best={score:ratio,c,t,send,need}}}",
  "      if(ratio>bar&&c.rice>need+(c.troops-send)*RICE_CITY*4&&(!best||ratio>best.score))best={score:ratio,c,t,send,need}}}")
R("  if(A==='passive'){domestic();return}","""  // supply: a city short of rice or gold is fed by its richest neighbour
  for(const c of citiesOf(f)){const lowR=c.rice<c.troops*RICE_CITY*4,lowG=c.gold<300;if(!lowR&&!lowG)continue;
    const d=neighbours(c.id).map(C).filter(x=>x.owner===f&&!S.armies.some(a=>a.fac===f&&a.from===x.id&&a.to===c.id)).sort((x,y)=>(y.rice-y.troops*RICE_CITY*10)-(x.rice-x.troops*RICE_CITY*10))[0];if(!d)continue;
    const sr=lowR?Math.max(0,Math.round((d.rice-d.troops*RICE_CITY*10)*.5)):0,sg=lowG?Math.max(0,Math.round((d.gold-800)*.5)):0;
    if(sr>=1000||sg>=200)launchArmy(f,d.id,c.id,[],0,sr,null,sg)}
  if(A==='passive'){domestic();return}""")
open(p,'w').write(s)
print('ok')
