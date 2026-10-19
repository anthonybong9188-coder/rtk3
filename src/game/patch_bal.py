p='game/camp.js';s=open(p).read()
def R(a,b,n=1):
    global s; assert s.count(a)==n,(a[:90],s.count(a)); s=s.replace(a,b)
# ---- difficulty table
R("function newCampaign(){",r"""// difficulty: inc = your gold income, wall = how much enemy walls help them when YOU attack,
// aiRec = enemy recruiting, aiBar = how much stronger the enemy must be before it attacks
const DIFF={easy:{n:'Easy',zh:'易',inc:1.5,gold:3000,rice:45000,wall:.5,aiRec:.7,aiBar:.45,d:'Your treasury grows faster, enemy walls are weaker, and rivals attack only with a big advantage.'},
  normal:{n:'Normal',zh:'中',inc:1.2,gold:2000,rice:35000,wall:.75,aiRec:1,aiBar:.15,d:'The intended challenge. Strike Wei after Red Cliffs while Jiangling is weak.'},
  hard:{n:'Hard',zh:'難',inc:1,gold:1500,rice:30000,wall:1,aiRec:1.3,aiBar:-.1,d:'Rivals recruit faster and attack sooner. Walls are at full strength.'}};
const DF=()=>DIFF[(S&&S.diff)||'normal'];
// how much a city's walls multiply its defence; enemy walls are softened by difficulty when Shu attacks
function wallF(c,attacker){const k=c.owner!=='shu'&&attacker==='shu'?DF().wall:1;return 1+(.15+c.walls/250)*k}
function newCampaign(diff){""")
R("  for(const f in FACS)S.fac[f]={gold:FACS[f].gold,rice:FACS[f].rice};",
  "  S.diff=diff||'normal';for(const f in FACS)S.fac[f]={gold:FACS[f].gold,rice:FACS[f].rice};S.fac.shu.gold=DF().gold;S.fac.shu.rice=DF().rice;")
# new game: ask difficulty
a=s[s.index("$('#newBtn').onclick=async()=>{"):]
a=a[:a.index("\n")]
assert "newCampaign();" in a
b=a.replace("newCampaign();","const dr=await dialog(`<h2>Choose difficulty</h2><div class=\"tlist slots\">${Object.entries(DIFF).map(([k,v])=>`<button data-r=\"${k}\" class=\"${k==='normal'?'on':''}\"><span class=\"sl\"><b>${v.zh} ${v.n}</b><small>${v.d}</small></span><em>${k==='normal'?'Recommended':''}</em></button>`).join('')}</div>`,[['cancel','Cancel']]);if(!DIFF[dr])return;newCampaign(dr);",1)
R(a,b)
# menu: change difficulty
R("""[['sound','🔊 Sound'],""","""[['diff',`${DF().zh} Difficulty: ${DF().n}`],['sound','🔊 Sound'],""")
R("if(r==='sound')await soundDlg();","if(r==='diff'){const dr=await dialog(`<h2>Difficulty</h2><p class=\"muted\">You can change this at any time. Gold already in your treasury stays as it is.</p><div class=\"tlist slots\">${Object.entries(DIFF).map(([k,v])=>`<button data-r=\"${k}\" ${S.diff===k?'disabled':''}><span class=\"sl\"><b>${v.zh} ${v.n}${(S.diff||'normal')===k?' · current':''}</b><small>${v.d}</small></span></button>`).join('')}</div>`,[['cancel','Cancel']]);if(DIFF[dr]){S.diff=dr;addLog(`Difficulty set to ${DIFF[dr].n}.`,'shu');save();renderCampaign()}}\n    if(r==='sound')await soundDlg();")
# ---- wall factor in all strength estimates
R("const ratio=thP?myP/(thP*(.7+.3*tgt.train/100)*(1.15+tgt.walls/250)):9;","const ratio=thP?myP/(thP*(.7+.3*tgt.train/100)*wallF(tgt,'shu')):9;")
R("t.troops+inc,t.train)*(1.15+t.walls/250));","t.troops+inc,t.train)*wallF(t,f));")
R("PD=pw(dGs,dT,c.train)*(c.field?1:1.15+c.walls/250)*rnd(.85,1.15);","PD=pw(dGs,dT,c.train)*(c.field?1:wallF(c,a.fac))*rnd(.85,1.15);")
# AI attack threshold
R("const bar=A==='aggressive'?1.25:A==='defensive'?(grudge?1.3:1.8):9;","const bar=(A==='aggressive'?1.25:A==='defensive'?(grudge?1.3:1.8):9)+(t.owner==='shu'?DF().aiBar:0);")
# AI recruit stall fix + recruit scaling
R("if(c.order<50&&F.rice>2000)k='patrol';","if(c.order<60&&F.rice>2000)k='patrol';")
R("c.troops<troopCap(c)-500&&c.order>55&&g.cha>=55)k='recruit';","c.troops<troopCap(c)-500&&c.order>50&&g.cha>=55)k='recruit';")
R("if(k==='recruit'){const n=Math.max(0,Math.min(Math.round(s*10*rnd(.8,1.2)),troopCap(c)-c.troops));",
  "if(k==='recruit'){const n=Math.max(0,Math.min(Math.round(s*10*rnd(.8,1.2)*(f!=='shu'&&f!=='__gov'?DF().aiRec:1)),troopCap(c)-c.troops));")
# player income
R("const inc=dr.reduce((s,c)=>s+c.com*.5*c.order/100,0),sal=","const inc=dr.reduce((s,c)=>s+c.com*.5*c.order/100,0)*(f==='shu'?DF().inc:1),sal=")
R("P.gold=Math.round(P.gold+c.com*.5*c.order/100-","P.gold=Math.round(P.gold+c.com*.5*c.order/100*DF().inc-")
# Red Cliffs aftermath: Jiangling shaken
R("    if(j.owner==='wei'){const lost=Math.round(j.troops*.6);j.troops-=lost;","    if(j.owner==='wei'){const lost=Math.round(j.troops*.6);j.troops-=lost;j.walls=Math.max(40,j.walls-30);j.train=Math.min(j.train,50);j.order=Math.max(30,j.order-25);")
R("<p class=\"muted\">Jiangling is weakened. Wei will not march south again until 210.</p>","<p class=\"muted\">Jiangling is shaken: its walls are damaged and its troops demoralised. Strike now and it can be yours. Wei will not march south again until 210.</p>")
open(p,'w').write(s)
a='game/assemble.py';t=open(a).read()
t=t.replace("MAP=cfg.map;T_INFO.c.def=1.25+cfg.walls/250;","MAP=cfg.map;T_INFO.c.def=1+(.25+cfg.walls/250)*(cfg.playerAttacks&&typeof DF==='function'?DF().wall:1);",1)
open(a,'w').write(t)
h='game/hud.py';u=open(h).read()
u=u.replace(".cmdpick.on{color:#1a140c;",".slots button.on{border-color:var(--gold)}\n.cmdpick.on{color:#1a140c;",1)
open(h,'w').write(u)
print('ok')
