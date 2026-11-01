import re, os, sys
D = os.path.dirname(os.path.abspath(__file__))
SP = os.path.dirname(D)
s = open(os.path.join(SP, 'rtk3-battle.html')).read()
camp = open(os.path.join(D, 'sound.js')).read() + '\n' + open(os.path.join(D, 'bios.js')).read() + '\n' + open(os.path.join(D, 'camp.js')).read() + '\n' + open(os.path.join(D, 'scen.js')).read()

def rep(o, n, c=1):
    global s
    k = s.count(o)
    assert k == c, (k, o[:80])
    s = s.replace(o, n)

# ---------- head ----------
rep('<title>RTK3 Battle Prototype</title>', '<title>RTK3</title>')

CAMP_CSS = r'''
/* ---------- title + campaign ---------- */
[hidden]{display:none!important}
body{margin:0}
body.lock{overflow:hidden}
.screen{position:fixed;inset:0;display:flex;flex-direction:column;background:var(--ink);z-index:5}
.tbg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 0%}
.tshade{position:absolute;inset:0;background:linear-gradient(0deg,rgba(20,17,13,.95) 0%,rgba(20,17,13,.8) 30%,rgba(20,17,13,0) 62%)}
.tcontent{position:relative;margin:auto 0 0;padding-block:16px max(16px,env(safe-area-inset-bottom,0px));padding-left:max(28px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));max-width:640px;display:flex;flex-direction:column;gap:10px;overflow:auto;max-height:100%}
.tbrand{display:flex;align-items:center;gap:12px}
.tname{font:700 34px/1 var(--f-display);letter-spacing:.03em}
.tsub{color:var(--muted);font-size:13.5px;margin-top:3px}
.tbig{display:none}
.tscen{display:flex;flex-direction:column;gap:3px}
.tscen b{font:700 21px var(--f-display)}
.tscen p{margin:2px 0 0;color:#cfc4aa;font-size:14px;max-width:46ch}
.tbtns{display:flex;flex-wrap:wrap;gap:8px}
.tbtns button{min-height:46px;padding:0 18px;font-size:15px}
@media (max-height:430px){.tscen p{display:none}.tname{font-size:28px}}
@media (orientation:portrait){.tbg{inset:0 auto auto -2vw;width:170vw;height:auto;max-width:none;object-fit:fill;-webkit-mask-image:linear-gradient(180deg,#000 70%,transparent);mask-image:linear-gradient(180deg,#000 70%,transparent)}}
.ctop{flex:none;display:flex;align-items:center;flex-wrap:wrap;gap:6px 16px;padding-block:6px;padding-left:max(12px,env(safe-area-inset-left,0px));padding-right:max(12px,env(safe-area-inset-right,0px));background:var(--panel);border-bottom:1px solid var(--line)}
.cfac{display:flex;align-items:center;gap:8px;line-height:1.15}
.cfac small{display:block;color:var(--muted);font-size:12px}
.seal.sm{width:32px;height:32px;font-size:19px}
.cres{display:flex;gap:14px;font-size:13px;font-variant-numeric:tabular-nums}
.cres span{color:var(--muted);margin-right:4px}
.ctop button{min-height:38px}
.cmain{flex:1;min-height:0;display:flex;gap:10px;padding-block:8px;padding-left:max(10px,env(safe-area-inset-left,0px));padding-right:max(10px,env(safe-area-inset-right,0px))}
.mapcol{flex:1 1 auto;min-width:0;display:flex;justify-content:center;align-items:flex-start}
.mapbox{position:relative;width:min(100%,calc((100dvh - 76px)*1.5));aspect-ratio:3/2;max-width:100%;border-radius:6px;overflow:hidden;border:1px solid var(--line);background:#3b3626}
.mapimg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.mapshade{position:absolute;inset:0;background:rgba(20,17,13,.25)}
#routes{position:absolute;inset:0;width:100%;height:100%}
#routes line{stroke:#f3e6c4;stroke-width:1.6;stroke-dasharray:4 4;opacity:.8;vector-effect:non-scaling-stroke}
#routes line.long{stroke-dasharray:2 5}
#routes line.march{stroke-width:3;stroke-dasharray:none;opacity:.9}
#cityLayer,#armyLayer{position:absolute;inset:0}
.city{position:absolute;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0;min-width:46px;min-height:44px;padding:2px 4px;background:none;border:0;border-radius:6px;color:#fff;font:700 12px/1.15 var(--f-body);text-shadow:0 1px 2px #000,0 0 4px #000}
.city:hover{border:0;background:rgba(20,17,13,.25)}
.city .dia{width:15px;height:15px;transform:rotate(45deg);border:2px solid #14110d;margin-bottom:3px}
.city.mine .dia{border-color:#f3e6c4}
.city.sel .dia{border-color:var(--gold);box-shadow:0 0 0 3px rgba(212,173,85,.5)}
.city.sel{background:rgba(20,17,13,.45)}
.city small{font-size:10.5px;font-weight:600;opacity:.92;font-variant-numeric:tabular-nums}
.army{position:absolute;transform:translate(-50%,-50%);display:flex;align-items:center;gap:3px;padding:1px 5px 1px 2px;border:1px solid;border-radius:3px;font:700 10.5px var(--f-body);color:#fff;font-variant-numeric:tabular-nums;box-shadow:0 1px 3px rgba(0,0,0,.6)}
.army span{font:900 11px var(--f-zh);background:rgba(0,0,0,.3);padding:0 2px;border-radius:2px}
.cpanel{flex:0 0 340px;min-width:0;overflow-y:auto;background:var(--panel);border:1px solid var(--line);border-radius:6px;padding:10px 12px;display:flex;flex-direction:column;gap:9px}
.ph{display:flex;align-items:center;gap:10px}
.phzh{font:900 28px/1 var(--f-zh)}
.cityart{display:block;width:100%;height:92px;object-fit:cover;object-position:50% 60%;border-radius:5px;border:1px solid var(--line);flex:none}
.phn{font:700 19px/1.1 var(--f-display)}
.phs{font-size:12.5px}
.sgrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px 14px;font-size:13px;font-variant-numeric:tabular-nums}
.srow{display:flex;flex-wrap:wrap;justify-content:space-between;gap:0 6px}
.srow span{color:var(--muted)}
.srow i{font-style:normal;color:var(--muted);font-weight:400}
.sbar{flex-basis:100%;height:4px;background:#0d0b08;border-radius:2px;margin-top:2px}
.sbar i{display:block;height:100%;background:var(--gold);border-radius:2px}
.sec{font:700 12px var(--f-display);letter-spacing:.08em;text-transform:uppercase;color:var(--gold);margin-top:2px}
.muted{color:var(--muted);font-size:13px;margin:0}
.bad{color:#e88b7f;font-size:13px;margin:0}
.glist{display:flex;flex-direction:column;gap:4px}
.grow{display:flex;align-items:center;gap:9px;padding:3px 0;text-align:left;font-weight:500;width:100%}
button.grow,label.grow{padding:4px 8px;border:1px solid var(--line);background:var(--panel2);border-radius:5px;cursor:pointer}
label.grow.on{border-color:var(--gold)}
label.grow input{width:18px;height:18px;accent-color:#d4ad55;flex:none}
.gmid{flex:1;min-width:0;display:flex;flex-direction:column;line-height:1.2}
.gmid b{font-size:14px}
.gmid small{color:var(--muted);font-size:12px;font-variant-numeric:tabular-nums}
.gport{object-fit:cover;object-position:50% 0;border-radius:4px;flex:none;border:1px solid var(--line)}
.gseal{display:grid;place-items:center;border-radius:4px;flex:none;color:#f6ecd4;font-family:var(--f-zh);font-weight:900}
.gst{font-size:11.5px;padding:1px 8px;border-radius:99px;border:1px solid #4f9a5a;color:#86cc90;white-space:nowrap}
.gst.done{border-color:var(--line);color:var(--muted)}
.cmdgrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}
.cmdgrid button{display:flex;flex-direction:column;align-items:center;gap:1px;padding:6px 2px;font-size:12px;min-height:50px}
.czh{font:900 17px/1.1 var(--f-zh);color:var(--gold)}
.primary .czh{color:#fff6e4}
.wide{width:100%;min-height:44px;display:flex;align-items:center;justify-content:center;gap:8px}
.note{font-size:12.5px;border-left:3px solid;padding:4px 8px;background:var(--panel2);border-radius:3px}
.clog{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:4px;font-size:12.5px;color:var(--muted)}
.clog li:first-child{color:var(--paper)}
.clog span{font-variant-numeric:tabular-nums;color:#7d7058;margin-right:4px}
.dlgo{z-index:40}
.dlgbox{background:var(--panel);border:1px solid var(--gold);border-radius:8px;padding:18px 20px;width:min(100%,560px);max-height:100%;overflow:auto;display:flex;flex-direction:column;gap:10px}
.dlgbox h2{margin:0;font:700 22px var(--f-display)}
.dlgbox p{margin:0}
.dzh{font:900 46px/1 var(--f-zh);color:var(--gold)}
.dbtns{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;margin-top:4px}
.dbtns button{min-height:44px;min-width:110px}
.vs{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.vs>div{background:var(--panel2);border:1px solid var(--line);border-radius:6px;padding:8px 10px;display:flex;flex-direction:column;gap:2px;font-size:13.5px}
.vs small{color:var(--muted)}
.cap1{display:flex;gap:14px;align-items:center}
.mrow{display:flex;flex-direction:column;gap:4px;font-size:13.5px}
.mrow select{font:inherit;color:inherit;background:var(--panel2);border:1px solid var(--line);border-radius:5px;padding:8px;min-height:40px}
.mrow input[type=range]{accent-color:#d4ad55;width:100%}
.mg{max-height:min(240px,calc(100dvh - 230px));overflow:auto}
.dlgbox.dwide{width:min(100%,780px)}
.mcols{display:grid;grid-template-columns:minmax(0,1fr);gap:10px}
.mcol{display:flex;flex-direction:column;gap:8px;min-width:0}
@media (orientation:landscape){.mcols{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}.mg{max-height:calc(100dvh - 260px);min-height:96px}.dlgbox.dwide{padding:12px 16px;gap:8px}}
.mapimg{width:100%}
.msum{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;font-size:13px}
.msum div{background:var(--panel2);border-radius:5px;padding:6px 8px;display:flex;flex-direction:column}
.msum span{color:var(--muted);font-size:11.5px;text-transform:uppercase;letter-spacing:.06em}
#toast{position:fixed;left:50%;bottom:max(14px,env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:60;background:#2a2219;border:1px solid var(--gold);border-radius:6px;padding:8px 14px;font-size:14px;max-width:min(92vw,520px);box-shadow:0 4px 18px rgba(0,0,0,.5)}
.bhead{display:flex;align-items:center;gap:12px}
@media (orientation:portrait){
  .cmain{flex-direction:column;overflow-y:auto}
  .mapcol{flex:none}
  .mapbox{width:100%}
  .cpanel{flex:none;overflow:visible}
  .cmdgrid{grid-template-columns:repeat(4,minmax(0,1fr))}
}
@media (max-height:430px){.ctop{gap:4px 12px}.cres{gap:10px}.cpanel{flex-basis:300px}}
/* ---------- city-centred campaign ---------- */
.iconbtn{display:inline-flex;align-items:center;gap:6px;position:relative}
.iconbtn .badge{position:absolute;top:-6px;right:-6px;min-width:18px;height:18px;border-radius:9px;background:#c4473a;color:#fff;font:700 11px/18px var(--f-body);text-align:center;font-style:normal;padding:0 4px}
.cbody{flex:1;min-height:0;display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.45fr) minmax(0,.85fr);gap:10px;padding-block:8px;padding-left:max(10px,env(safe-area-inset-left,0px));padding-right:max(10px,env(safe-area-inset-right,0px))}
.ccol{min-width:0;min-height:0;overflow-y:auto;background:var(--panel);border:1px solid var(--line);border-radius:6px;padding:10px;display:flex;flex-direction:column;gap:8px}
.cA{padding:0;overflow:hidden auto}
.cA .sgrid{padding:2px 10px 10px;font-size:12.5px;gap:5px 12px}
.cscene{position:relative;flex:none;height:clamp(120px,42%,220px);background-color:#3b3626;background-repeat:no-repeat;border-bottom:1px solid var(--line)}
.cscap{position:absolute;left:0;right:0;bottom:0;display:flex;align-items:center;gap:10px;padding:18px 12px 8px;background:linear-gradient(0deg,rgba(14,12,9,.92),rgba(14,12,9,0))}
.cnav{position:absolute;top:50%;transform:translateY(-70%);width:36px;height:44px;padding:0;font:700 26px/1 var(--f-body);background:rgba(14,12,9,.65);border-color:rgba(236,226,201,.25);z-index:1}
.cnav.prev{left:6px}.cnav.next{right:6px}
.chead{display:flex;justify-content:space-between;align-items:flex-start;gap:8px}
.chead button{flex:none;min-height:36px}
.ohead,.orow{display:grid;grid-template-columns:36px minmax(0,1fr) repeat(4,27px) 56px;align-items:center;gap:6px}
.ohead{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);padding:0 6px}
.ohead span:nth-child(n+3){text-align:center}
.olist{display:flex;flex-direction:column;gap:4px}
.orow{padding:4px 6px;border-radius:5px;background:var(--panel2);border:1px solid transparent;text-align:left;width:100%;font-weight:500}
.orow .on{text-align:center;font-variant-numeric:tabular-nums;font-size:14px}
.orow .gst{justify-self:end}
.oname{display:flex;flex-direction:column;min-width:0;line-height:1.2}
.oname b{font-size:14px;overflow-wrap:anywhere}
.oname small{color:var(--muted);font-size:11.5px}
button.orow.pick{grid-template-columns:38px minmax(0,1fr) minmax(0,1.2fr);border-color:var(--line);cursor:pointer}
.opick{display:flex;flex-direction:column;line-height:1.2;font-size:13px}
.opick small{color:#86cc90;font-size:12px}
.cmdgrid button.on{border-color:var(--gold);background:#3a2f1f}
.mapview{position:absolute;inset:0;z-index:30;background:rgba(10,8,6,.96);display:flex;flex-direction:column}
.mvhead{flex:none;display:flex;align-items:center;flex-wrap:wrap;gap:6px 12px;padding-block:6px;padding-left:max(12px,env(safe-area-inset-left,0px));padding-right:max(12px,env(safe-area-inset-right,0px));border-bottom:1px solid var(--line)}
.mvt{font:700 17px var(--f-display)}
.legend{display:flex;gap:6px;flex-wrap:wrap;font-size:11.5px}
.legend span{padding:1px 8px;border-radius:99px;border:1px solid}
.mvbody{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;padding:8px}
.mapview .mapbox{width:min(100%,calc((100dvh - 80px)*1.5))}
@media (orientation:portrait){
  .cbody{display:flex;flex-direction:column;overflow-y:auto}
  .ccol{overflow:visible;flex:none}
  .cscene{height:200px}
}
@media (max-height:430px){.cres{gap:10px}.ctop .iconbtn span{display:none}}

'''
rep('@media (prefers-reduced-motion:reduce){*{scroll-behavior:auto}}', CAMP_CSS + '@media (prefers-reduced-motion:reduce){*{scroll-behavior:auto}}')

# ---------- markup ----------
rep('<div class="app">', '<div id="battleView" hidden>\n<div class="app">')
rep('''    <div class="seal">蜀</div>
    <div>
      <h1>RTK3 · Battle Prototype</h1>
      <p class="sub">Test scenario: Hanzhong, 219 · Shu vs Wei · win by breaking Cao Ren's force</p>
    </div>''', '''    <div class="seal">戰</div>
    <div>
      <h1 id="bTitle">Battle</h1>
      <p class="sub" id="bSub"></p>
    </div>''')
rep('''    <button id="speedBtn" title="Battle scene speed">Scenes 1×</button>''', '''    <button id="retreatBtn" title="Withdraw your army from the battle">Retreat</button>
    <button id="speedBtn" title="Battle scene speed">Scenes 1×</button>''')
rep('''        <p>Break Cao Ren's force or every Wei unit within 15 turns. You lose if Liu Bei's force breaks. Tap an enemy to attack it; your unit moves into range on its own.</p>''',
    '''        <p>Break the enemy commander's force (gold border) or every enemy unit. The attacker has 15 turns; after that the defender wins. You lose if your own commander's force breaks. Tap an enemy to attack it; your unit moves into range on its own.</p>''')
rep('''          <tr><td>Fort</td><td>1.5</td></tr>''', '''          <tr><td>Fort</td><td>1.25 + walls ÷ 250</td></tr>''')

TITLE_CAMP = '''
<div id="title" class="screen" hidden>
  <img class="tbg" id="tbg" src="art/title_liubei.jpg" alt=""><div class="tlogo" id="tlogo">赤壁之戰</div>
  <div class="tshade"></div>
  <div class="tcontent">
    <div class="tbrand"><div class="seal">國</div><div><div class="tname">RTK3</div><div class="tsub">A strategy game of the Three Kingdoms</div></div></div>
    <div class="tbig">天下三分</div>
    <div class="tmode" role="tablist"><button data-tm="lb" class="on" role="tab">劉 Liu Bei</button><button data-tm="hero" role="tab">俠 New Hero</button></div>
    <div class="tscen"><span class="lbl">Scenario · 208 AD</span><b id="tscenT">The Battle of Red Cliffs</b>
      <p id="tscenP">Cao Cao has taken Jing province and sails his fleet down the Yangtze. Liu Bei holds Jiangxia, allied with Sun Quan of Wu. Hold 10 of the 14 cities by the end of 215.</p></div>
    <div class="tbtns" id="tbtns"><button id="newBtn" class="primary">New game as Liu Bei</button><button id="heroBtn">New game as a New Hero</button><button id="contBtn" hidden>Continue · <span id="contInfo"></span></button><button id="loadBtn">Load game</button></div>
  </div>
</div>
<div id="campaign" class="screen" hidden>
  <header class="ctop">
    <div class="cfac"><span class="seal sm" id="cSeal" style="background:#3f7f4a">蜀</span><div><b id="cLord">Liu Bei</b><small id="cDate"></small></div></div>
    <div class="cres"><div><span>Gold</span><b id="cGold"></b></div><div><span>Rice</span><b id="cRice"></b></div><div><span>Troops</span><b id="cTroops"></b></div><div><span>Cities</span><b id="cCities"></b></div></div>
    <div class="spacer"></div>
    <button id="mapBtn" class="iconbtn" aria-label="Open the map of China"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M3 6.5 9 3.5l6 3 6-3v14l-6 3-6-3-6 3z"/><path d="M9 3.5v14M15 6.5v14"/></svg><span>Map</span><i id="mapBadge" class="badge" hidden></i></button>
    <button id="menuBtn" class="iconbtn" aria-label="Menu"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg><span>Menu</span></button>
    <button id="endMonth" class="primary">End month</button>
  </header>
  <main class="cbody">
    <section class="ccol cA" id="cA"></section>
    <section class="ccol cB" id="cB"></section>
    <section class="ccol cC" id="cC"></section>
  </main>
  <div id="mapView" class="mapview" hidden>
    <div class="mvhead"><b class="mvt">Map of China</b><span class="muted">Tap a city to go there</span><div id="mapLegend" class="legend"></div><div class="spacer"></div><button id="mapClose" class="iconbtn" aria-label="Close the map"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg><span>Close</span></button></div>
    <div class="mvbody"><div class="mapbox"><img src="art/map.jpg" alt="" class="mapimg"><div class="mapshade"></div><svg id="routes" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"></svg><div id="armyLayer"></div><div id="cityLayer"></div></div></div>
  </div>
</div>
'''
rep('<div id="battleView" hidden>', TITLE_CAMP + '<div id="battleView" hidden>')
rep('''      </div>
    </div>
  </details>
</div>
''', '''      </div>
    </div>
  </details>
</div>
</div>
''')
rep('''    <button class="primary" id="mBtn">Play again</button>
  </div>
</div>''', '''    <button class="primary" id="mBtn">Return to map</button>
  </div>
</div>
<div id="dlg" class="overlay dlgo" hidden><div class="dlgbox" id="dlgbox" role="dialog" aria-modal="true"></div></div>
<div id="toast" hidden></div>''')

# ---------- battle code ----------
s = re.sub(r'const MAP=\[\n(?:".*",?\n?)+\];?', 'let MAP=[];', s, count=1)
assert 'let MAP=[];' in s
rep("const PORT={lb:'liu_bei',gy:'guan_yu',zf:'zhang_fei',hz:'huang_zhong',cr:'cao_ren',xd:'xiahou_dun'};", "const PORT={};")
s = re.sub(r'function mkUnits\(\)\{return \[\n(?:.*\n)*?\]\.map\(.*\n', '', s, count=1)
assert 'function mkUnits' not in s
rep("desc:'Until Wei\\'s turn ends, intercept any cavalry attack on a unit within 1 square'}", "desc:'Until the enemy turn ends, intercept any cavalry attack on a unit within 1 square'}")
# training factor
for X in 'adep':
    s = s.replace(f'dmgCalc({X}.type,{X}.war,', f'tf({X})*dmgCalc({X}.type,{X}.war,')
rep('function fireDmg(', "const tf=u=>.7+.3*((u.train??70)/100);\nfunction fireDmg(")
# battle start
rep('''function newGame(){
  G={units:mkUnits(),turn:1,maxTurn:15,phase:'player',sp:3,sel:null,view:null,mode:'idle',reach:null,origin:null,targets:[],tmode:null,log:[],floats:[],fires:[],enemyTiles:null,busy:false,over:false};
  log('The armies meet at Hanzhong. Break <span class="w">Cao Ren</span> in his fort.');
  updateUI();
}''', '''let battleResolve=null;
function startBattle(cfg){
  MAP=cfg.map;T_INFO.c.def=1+(.25+cfg.walls/250)*(cfg.playerAttacks&&typeof DF==='function'?DF().wall:1);
  const F=FACS[cfg.foe];FAC.wei={main:F.main,dark:F.dark,light:F.light,name:F.short};
  for(const g of Object.values(S.gens))if(g.img)PORT[g.id]=g.img;
  $('#bTitle').textContent=cfg.title;$('#bSub').textContent=cfg.sub;
  showScreen('battleView');$('#log').innerHTML='';
  G={units:cfg.units.map(u=>({...u,max:u.troops,acted:false,stun:0,dueled:false,px:u.x,py:u.y,cd:{},guard:false})),turn:1,maxTurn:15,phase:'player',sel:null,view:null,mode:'idle',reach:null,origin:null,targets:[],tmode:null,log:[],floats:[],fires:[],enemyTiles:null,busy:false,over:false,cfg,broken:[]};
  const pc=G.units.find(u=>u.side==='shu'&&u.cmd),ec=G.units.find(u=>u.side==='wei'&&u.cmd);
  G.pcName=pc.name;G.ecName=ec.name;
  log(cfg.playerAttacks?`Break <span class="w">${ec.name}</span>'s force within 15 turns to take the city. Your commander is ${pc.name}.`:`Hold the walls for 15 turns, or break <span class="w">${ec.name}</span>'s force. Your commander is ${pc.name}.`);
  resizeMap();updateUI();
  return new Promise(res=>{battleResolve=res});
}''')
rep("  if(!mctx)return;const c=mctx;", "  if(!mctx||!G)return;const c=mctx;")
rep("$('#phase').textContent=G.over?'Battle over':G.phase==='player'?'Your move':'Wei is moving';",
    "$('#phase').textContent=G.over?'Battle over':G.phase==='player'?'Your move':`${FAC.wei.name} is moving`;")
rep("$('#endBtn').disabled=G.phase!=='player'||G.busy||G.over;", "$('#endBtn').disabled=G.phase!=='player'||G.busy||G.over;$('#retreatBtn').disabled=G.phase!=='player'||G.busy||G.over;")
rep("idle:'Tap a <b>green unit</b> to select it. Tap a blue unit to see its reach.'", "idle:'Tap a <b>green unit</b> to select it. Tap an enemy unit to see its reach.'")
rep("$('#hint').innerHTML=G.phase==='enemy'?'Wei is moving…':hint;", "$('#hint').innerHTML=G.phase==='enemy'?`${FAC.wei.name} is moving…`:hint;")
rep('''function sweep(){for(const u of G.units.filter(u=>u.troops<=0))log(`${nm(u)}'s force is broken. ${u.name} retreats from the field.`);''',
    '''function sweep(){for(const u of G.units.filter(u=>u.troops<=0)){log(`${nm(u)}'s force is broken. ${u.name} retreats from the field.`);G.broken.push(u.id)}''')
rep('''function checkEnd(){
  if(G.over)return true;
  const cr=G.units.find(u=>u.id==='cr'),lb=G.units.find(u=>u.id==='lb');
  if(!lb)return endGame(false,'Liu Bei\\'s force is broken. Shu withdraws from Hanzhong.');
  if(!cr||!enemies().length)return endGame(true,`Cao Ren's force breaks on turn ${G.turn}. Hanzhong is yours.`);
  return false}''', '''function checkEnd(){
  if(G.over)return true;
  const pc=G.units.find(u=>u.side==='shu'&&u.cmd),ec=G.units.find(u=>u.side==='wei'&&u.cmd);
  if(!pc||!G.units.some(u=>u.side==='shu'))return endGame(false,`${G.pcName}'s force is broken. Your army falls back.`);
  if(!ec||!enemies().length)return endGame(true,`${G.ecName}'s force breaks on turn ${G.turn}.`);
  return false}''')
rep('''function endGame(win,text){G.over=true;''', '''function endGame(win,text,retreat){G.over=true;G.win=win;G.retreat=!!retreat;''')
rep('''$('#mBtn').onclick=()=>{$('#modal').hidden=true;newGame()};''', '''$('#mBtn').onclick=()=>{$('#modal').hidden=true;const left={};for(const u of G.units)left[u.id]=Math.max(0,Math.round(u.troops));
  const r={win:G.win,retreat:G.retreat,left};showScreen('campaign');if(battleResolve){const f=battleResolve;battleResolve=null;f(r)}};
$('#retreatBtn').onclick=()=>{if(G.phase!=='player'||G.busy||G.over)return;endGame(false,'You sound the retreat. Your army withdraws from the field.',true)};''')
rep("""  if(G.turn>G.maxTurn){endGame(false,'Fifteen turns pass and Wei still holds the fort. Shu runs out of supplies.');return}""",
    """  if(G.turn>G.maxTurn){endGame(!G.cfg.playerAttacks,G.cfg.playerAttacks?'Fifteen turns pass and the walls still stand. Your army withdraws.':'Fifteen turns pass and the attackers give up the siege.');return}""")
rep("  if(e.cmd&&!players.some(p=>manh(p,e)<=3))tiles=[{x:e.x,y:e.y}];", "  if(e.cmd&&G.cfg.playerAttacks&&!players.some(p=>manh(p,e)<=3))tiles=[{x:e.x,y:e.y}];")
rep('''setupStage();resizeMap();newGame();requestAnimationFrame(loop);
window.addEventListener('resize',()=>{resizeMap()});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{terrainCv=renderTerrain(T)});''',
    camp + '''
setupStage();requestAnimationFrame(loop);
window.addEventListener('resize',()=>{if(!$('#battleView').hidden)resizeMap()});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{if(G&&!$('#battleView').hidden)terrainCv=renderTerrain(T)});
showScreen('title');renderTitle();''')

rep("w:'#2c4b58','=':'#2c4b58',c:'#5b6838'}[t];","w:'#2c4b58','=':'#2c4b58',c:'#7d7564'}[t];")
rep("if(t==='.'||t==='c'){c.strokeStyle='#6f7e45';","if(t==='c'){c.strokeStyle='#5f584a';c.lineWidth=1;for(let i=1;i<4;i++)ln(c,X,Y+i*T/4,X+T,Y+i*T/4);for(let i=0;i<4;i++){const o=(i%2)*T/6;for(let k=1;k<3;k++)ln(c,X+o+k*T/3,Y+i*T/4,X+o+k*T/3,Y+(i+1)*T/4)}c.strokeStyle='#d4ad55';c.lineWidth=2;c.strokeRect(X+1.5,Y+1.5,T-3,T-3)}\n    if(t==='.'){c.strokeStyle='#6f7e45';")

exec(open(os.path.join(D,'hud.py')).read())

# ---------- fonts: subset of every CJK character used ----------
chars = ''.join(sorted(set(re.findall(r'[㐀-鿿]', s))))
s = re.sub(r'family=Noto\+Serif\+TC:wght@900&text=[^&]*&', 'family=Noto+Serif+TC:wght@900&text=' + chars + '&', s, count=1)

open(os.path.join(SP, 'rtk3-game.html'), 'w').write(s)
js = re.search(r'<script>(.*)</script>', s, re.S).group(1)
open(os.path.join(D, 'chk.js'), 'w').write(js)
print('ok', len(s), 'chars', len(chars))
