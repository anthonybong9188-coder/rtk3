p='game/camp.js';s=open(p).read()
def R(a,b,n=1):
    global s; assert s.count(a)==n,(a[:90],s.count(a)); s=s.replace(a,b)
# pre-battle snapshot first (anchor is unique)
R("  let res;\n","  let res;\n  if(playerIn&&UI.snap){try{localStorage.setItem(PRE,UI.snap)}catch(e){}}\n")
# ===== A. loyalty column
R("""<span>Cha</span><span>${mine?'Status':'Loyal'}</span></div>`;""","""<span>Cha</span><span title="Loyalty">Loy</span><span>${mine?'Status':''}</span></div>`;""")
R("""<span class="on">${g.cha}</span>${mine?`<span class="gst ${g.acted?'done':''}">${g.acted?'Done':'Ready'}</span>`:`<span class="on">${g.loy}</span>`}</div>`""",
  """<span class="on">${g.cha}</span><span class="on loy ${isRuler(g)?'':g.loy<60?'risk':g.loy<75?'warn':''}" title="Loyalty${g.loy<60?': may leave':g.loy<75?': can be lured':''}">${isRuler(g)?'—':g.loy}</span>${mine?`<span class="gst ${g.acted?'done':''}">${g.acted?'Done':'Ready'}</span>`:'<span></span>'}</div>`""")
# ===== B. threat bar
R("function renderCampaign(){\n  if(!S)return;","""function threats(){return S.armies.filter(a=>a.fac!=='shu'&&C(a.to).owner==='shu'&&!allied('shu',a.fac)).sort((x,y)=>x.left-y.left)}
function renderThreats(){let el=$('#threatBar');if(!el){el=document.createElement('div');el.id='threatBar';el.setAttribute('role','alert');$('#campaign .ctop').after(el)}
  const T=threats();el.hidden=!T.length;
  el.innerHTML=T.map(a=>`<button data-city="${a.to}" class="${a.left<=1?'soon':''}"><b>⚠</b> ${FACS[a.fac].short} army of <b>${fmt(a.troops)}</b>${a.gens.length?` (${a.gens.map(id=>GN(id).name).slice(0,2).join(', ')}${a.gens.length>2?'…':''})`:''} reaches <b>${C(a.to).name}</b> ${a.left<=1?'next month':`in ${a.left} months`}</button>`).join('')}
function renderCampaign(){
  if(!S)return;renderThreats();""")
R("  UI.busy=false;renderCampaign();if(!S.over)monthFx();\n}","""  UI.busy=false;renderCampaign();if(!S.over){monthFx();const seen=new Set(S.seenThreat||[]),nw=threats().filter(a=>!seen.has(a.id));S.seenThreat=threats().map(a=>a.id);
    if(nw.length)setTimeout(()=>toast(`⚠ ${nw.map(a=>`${FACS[a.fac].short} army of ${fmt(a.troops)} marching on ${C(a.to).name}`).join(' · ')}`),1150)}
}""")
# ===== C. choose defenders and commander
R("""  if(playerIn){
    const me=a.fac==='shu',foe=me?c.owner:a.fac;""","""  if(playerIn&&c.owner==='shu'&&gensIn(c.id).length){defG=await pickDefenders(a,c,gens,defG);if(!defG)defG=cmdOrder(gensIn(c.id)).slice(0,4)}
  if(playerIn){
    const me=a.fac==='shu',foe=me?c.owner:a.fac;""")
R("function unitSplit(gs,total){",r"""async function pickDefenders(a,c,gens,def0){
  const all=cmdOrder(gensIn(c.id));const sel=new Set(def0.map(g=>g.id));let cmd=def0[0]&&def0[0].id;
  for(;;){if(!sel.has(cmd))cmd=[...sel][0];
    const r=await dialog(`<div class="dzh">守</div><h2>${FACS[a.fac].short} attacks ${c.name}</h2>
      <p>${fmt(a.troops)} troops led by ${gens.map(g=>g.name).join(', ')||'no general'} are at the gates. Your ${fmt(c.troops)} troops are split evenly between the officers you send out.</p>
      <p class="muted">Pick up to 4 officers to defend, then choose the 帥 commander. If he falls, the defence collapses.</p>
      <div class="tlist dpick">${all.map(g=>`<button data-r="tog:${g.id}" class="${sel.has(g.id)?'on':''}" ${!sel.has(g.id)&&sel.size>=4?'disabled':''}>${gseal(g,30)}<b>${sel.has(g.id)?'✓ ':''}${g.name}</b><small>War ${g.war} · Int ${g.int} · ${TYPES[g.type].n}</small><em>${cmd===g.id?'帥':''}</em></button>`).join('')}</div>
      <div class="envrow"><span>Commander</span>${[...sel].map(id=>`<button data-r="cmd:${id}" class="${cmd===id?'on':''}">帥 ${GN(id).name}</button>`).join('')}</div>`,
      [['go',`Defend with ${sel.size} officer${sel.size>1?'s':''}`,'primary']]);
    if(r.startsWith('tog:')){const id=r.slice(4);if(sel.has(id)){if(sel.size>1)sel.delete(id)}else if(sel.size<4)sel.add(id);continue}
    if(r.startsWith('cmd:')){cmd=r.slice(4);continue}
    const rest=cmdOrder([...sel].filter(id=>id!==cmd).map(GN));return [GN(cmd),...rest]}}
function unitSplit(gs,total){""")
# ===== D. save slots
R("function save(){try{if(S.over)localStorage.removeItem('rtk3-save');else localStorage.setItem('rtk3-save',JSON.stringify(S))}catch(e){}}",
"""function save(){try{if(S.over)localStorage.removeItem('rtk3-save');else localStorage.setItem('rtk3-save',JSON.stringify(S))}catch(e){}}
const SLOTS=['rtk3-slot1','rtk3-slot2','rtk3-slot3'],PRE='rtk3-prebattle';
function readKey(k){try{const t=localStorage.getItem(k);return t?JSON.parse(t):null}catch(e){return null}}
function slotLabel(sv){if(!sv)return 'Empty';const n=Object.values(sv.cities).filter(c=>c.owner==='shu').length;return `${sv.year}, ${sv.month}${({1:'st',2:'nd',3:'rd'})[sv.month]||'th'} month · ${n} cit${n>1?'ies':'y'}${sv.savedAt?' · saved '+new Date(sv.savedAt).toLocaleDateString(undefined,{month:'short',day:'numeric'})+' '+new Date(sv.savedAt).toLocaleTimeString(undefined,{hour:'2-digit',minute:'2-digit'}):''}`}
function writeSlot(k){try{localStorage.setItem(k,JSON.stringify({...S,savedAt:Date.now()}));return true}catch(e){toast('Could not save: storage is full or blocked.');return false}}
function startFrom(sv){S=sv;if(!S)return;delete S.savedAt;for(const d of CITY_DEF)if(S.cities[d[0]]){S.cities[d[0]].x=d[3];S.cities[d[0]].y=d[4]}for(const d of GEN_DEF)if(S.gens[d[0]]&&d[10])S.gens[d[0]].img=d[10];for(const d of GEN_DEF)if(!S.gens[d[0]]){const [id,name,ch,fac,city,war,int,pol,cha,type,img,loy,hidden]=d;const c=S.cities[city];if(c&&c.owner===fac)S.gens[id]={id,name,ch,fac,city,war,int,pol,cha,type,img,loy,hidden:!!hidden,acted:false,army:null}}UI={mode:'city',cmd:null,busy:false};save();showScreen('campaign');renderCampaign()}
async function saveLoadDlg(mode){
  const rows=[['rtk3-save','Autosave'],...SLOTS.map((k,i)=>[k,'Slot '+(i+1)]),[PRE,'Before last battle']].filter(([k])=>mode==='load'||SLOTS.includes(k));
  const r=await dialog(`<h2>${mode==='save'?'Save game':'Load game'}</h2><p class="muted">${mode==='save'?'Pick a slot. Saving over a slot replaces it.':'The autosave updates as you play. “Before last battle” is the start of the month your last battle was fought, so you can replay it.'}</p>
    <div class="tlist slots">${rows.map(([k,n])=>{const sv=readKey(k);return `<button data-r="${k}" ${mode==='load'&&(!sv||sv.over)?'disabled':''}><b>${n}</b><small>${slotLabel(sv)}</small><em>${mode==='save'?(sv?'Overwrite':'Save'):'Load'}</em></button>`}).join('')}</div>`,[['cancel','Cancel']]);
  if(r==='cancel')return false;
  if(mode==='save'){if(readKey(r)&&await dialog(`<h2>Overwrite ${rows.find(x=>x[0]===r)[1]}?</h2><p>${slotLabel(readKey(r))}</p>`,[['no','Cancel'],['yes','Overwrite','primary']])!=='yes')return false;if(writeSlot(r))toast('Game saved.');return true}
  const sv=readKey(r);if(!sv)return false;if(S&&!S.over&&!$('#campaign').hidden&&await dialog(`<h2>Load this game?</h2><p>${slotLabel(sv)}</p><p class="muted">Anything since that save will be lost.</p>`,[['no','Cancel'],['yes','Load','primary']])!=='yes')return false;
  startFrom(sv);toast('Game loaded.');return true}""")
R("  try{\n    S.intel={};S.intelD=dateStr();","  try{\n    try{UI.snap=JSON.stringify(S)}catch(e){}\n    S.intel={};S.intelD=dateStr();")
R("$('#contBtn').onclick=()=>{S=loadSave();","$('#contBtn').onclick=()=>startFrom(loadSave());\nconst _oldCont=()=>{S=loadSave();")
R("""[['full',fs?'⛶ Exit fullscreen':'⛶ Fullscreen'],['title','Back to title'],['close','Keep playing','primary']]);if(r==='full')toggleFull();""",
  """[['save','💾 Save game'],['load','📂 Load game'],['full',fs?'⛶ Exit fullscreen':'⛶ Fullscreen'],['title','Back to title'],['close','Keep playing','primary']]);if(r==='save')await saveLoadDlg('save');if(r==='load')await saveLoadDlg('load');if(r==='full')toggleFull();""")
R("<p class=\"muted\">The game saves itself at the start of every month.</p>","<p class=\"muted\">The game autosaves as you play. You also have 3 save slots, plus a save from before your last battle.</p>")
# defeat dialog: offer replay
R("""${w?'Victory':'Defeat'} at ${c.name}</h2><p>${res.summary}</p>`,[['ok','Continue','primary']])""",
  """${w?'Victory':'Defeat'} at ${c.name}</h2><p>${res.summary}</p>`,[['ok','Continue','primary']])""")
open(p,'w').write(s)
# title screen: Load button
a='game/assemble.py';t=open(a).read()
old='<button id="contBtn" hidden>Continue · <span id="contInfo"></span></button></div>'
assert t.count(old)==1
t=t.replace(old,'<button id="contBtn" hidden>Continue · <span id="contInfo"></span></button><button id="loadBtn">Load game</button></div>')
open(a,'w').write(t)
s=open(p).read()
s=s.replace("$('#contBtn').onclick=()=>startFrom(loadSave());","$('#contBtn').onclick=()=>startFrom(loadSave());\n$('#loadBtn').onclick=()=>saveLoadDlg('load');",1)
s=s.replace("function renderTitle(){const sv=loadSave(),has=!!(sv&&!sv.over);","function renderTitle(){const sv=loadSave(),has=!!(sv&&!sv.over);$('#loadBtn').hidden=![...SLOTS,PRE].some(k=>{const x=readKey(k);return x&&!x.over});",1)
open(p,'w').write(s)
h='game/hud.py';u=open(h).read()
u=u.replace(".cmdpick.on{color:#1a140c;",""".ohead,.orow{grid-template-columns:36px minmax(0,1fr) repeat(5,27px) 56px}
.orow .loy.warn{color:#e8a05f;font-weight:700}.orow .loy.risk{color:#ff8a7a;font-weight:800}
#threatBar{display:flex;flex-direction:column;gap:4px;padding:6px max(16px,env(safe-area-inset-left)) 0}
#threatBar button{display:block;width:100%;text-align:left;min-height:34px;padding:6px 12px;border-radius:8px;background:#3a1f18;border:1px solid #a3554a;color:#ffd6cc;font-size:13.5px;line-height:1.3}
#threatBar button.soon{background:#5a2018;border-color:#e88b7f;animation:autoPulse 1.4s ease-in-out infinite}
#threatBar b{color:#fff}
.dpick button.on{border-color:var(--gold);background:#2a2116}.dpick em{color:var(--gold)}
.slots button{min-height:54px}.slots em{font-size:14px!important}
.cmdpick.on{color:#1a140c;""",1)
open(h,'w').write(u)
print('ok')
