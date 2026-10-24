# Battle redesign: full-screen map HUD, painted terrain, portrait tokens,
# action rail, auto-highlight, and the new fight scene (sprites + portraits).
import re as _re

# ---------------------------------------------------------------- markup
_a = s.index('<div id="battleView" hidden>')
_b = s.index('<div id="stage" class="overlay" hidden>')
_rules = _re.search(r'<details class="rules">.*?</details>', s[_a:_b], _re.S).group(0)
s = s[:_a] + '''<div id="battleView" hidden><div class="bv">
  <div class="bmap"><div class="mapwrap"><canvas id="map" aria-label="Battle map"></canvas></div></div>
  <div class="hud tl" id="info"></div>
  <div class="bhint" id="hint"></div>
  <aside class="rail">
    <div class="turnbox"><span class="lbl">Turn</span><b id="turn"></b><small id="phase"></small></div>
    <div class="pills"><button id="speedBtn" class="pill"></button><button id="logBtn" class="pill">Log</button><button id="retreatBtn" class="pill">Retreat</button></div>
  </aside>
  <div id="acts" class="acts2"></div>
  <div class="hud tp" id="tpanel" hidden></div>
  <div class="hud bl"><button id="endBtn" class="endbtn">End turn</button></div>
  <div class="logpanel" id="logPanel" hidden>
    <div class="lph"><div><b id="bTitle"></b><small id="bSub"></small></div><button id="logClose" class="pill">Close</button></div>
    <ol id="log"></ol>
    ''' + _rules + '''
  </div>
</div></div>

''' + s[_b:]

BCSS = r'''
/* ---------- battle HUD ---------- */
#battleView{position:fixed;inset:0;z-index:6;background:#0b0a08}
.bv{position:relative;width:100%;height:100%;overflow:hidden}
.bmap{position:absolute;inset:0;overflow:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;overscroll-behavior:contain;background:#141a0e;cursor:grab}
.bmap::-webkit-scrollbar{display:none}
.bmap.drag{cursor:grabbing}
.bv .mapwrap{background:none;border:0;border-radius:0;display:block;width:max-content;box-sizing:content-box}
#map{display:block;box-shadow:0 0 0 3px #3a3126,0 10px 40px rgba(0,0,0,.7)}
.rail{position:absolute;z-index:4;top:calc(8px + env(safe-area-inset-top,0px));right:max(8px,env(safe-area-inset-right,0px));display:flex;flex-direction:column;gap:6px;width:132px}
.turnbox{display:flex;flex-direction:column;align-items:center;line-height:1.1;padding:5px 0;border:1px solid #6a5636;border-radius:8px;background:rgba(18,15,11,.86);box-shadow:0 2px 8px rgba(0,0,0,.5)}
.turnbox b{font:700 20px var(--f-display);color:var(--gold)}
.turnbox small{font-size:11px;color:var(--muted)}
.pills{display:grid;grid-template-columns:1fr 1fr;gap:5px}
.pill{padding:4px 6px;font-size:12.5px;min-height:36px;border-radius:18px;background:rgba(30,24,16,.88);box-shadow:0 2px 6px rgba(0,0,0,.5)}
.pills .pill:first-child{grid-column:1/-1}
.acts2{position:absolute;z-index:4;right:max(10px,env(safe-area-inset-right,0px));bottom:calc(10px + env(safe-area-inset-bottom,0px));display:grid;grid-template-columns:repeat(3,72px);direction:rtl;gap:10px}
.acts2>*{direction:ltr}
.acts2:empty{display:none}
.rbtn{width:72px;height:72px;padding:0;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0;position:relative;
  background:radial-gradient(circle at 35% 30%,#4a3a26,#1b150e 70%);border:3px solid #c9a14a;box-shadow:0 3px 10px rgba(0,0,0,.7),inset 0 0 0 2px rgba(0,0,0,.4);color:#f3e6c4}
.rbtn .rzh{font:900 26px/1 var(--f-zh);color:var(--gold)}
.rbtn .rl{font-size:12px;font-weight:700;margin-top:3px;letter-spacing:.02em}
.rbtn.atk{background:radial-gradient(circle at 35% 30%,#b9473a,#5e1a12 72%);border-color:#e0b25a}
.rbtn.atk .rzh{color:#fff2d6}
.rbtn.sk{border-color:#7fb0e0}
.rbtn .cdb{position:absolute;top:-4px;right:-4px;min-width:18px;height:18px;border-radius:9px;background:#5a4a33;color:#fff;font:700 11px/18px var(--f-body);text-align:center}
.rbtn:disabled{opacity:.35}
.hud{position:absolute;z-index:3}
.hud.tl{top:calc(8px + env(safe-area-inset-top,0px));left:max(8px,env(safe-area-inset-left,0px));width:min(250px,32vw);pointer-events:none;background:rgba(18,15,11,.84);border:1px solid #4a3d2a;border-radius:8px;padding:8px 10px;display:flex;flex-direction:column;gap:6px}
.hud.tl:empty{display:none}
.hud.tl .ucard{gap:8px}
.hud.tl .uname{font-size:15px}
.hud.tl .umeta{font-size:11.5px}
.hud.tl .stats{font-size:12px;gap:8px}
.hud.tl .chips .chip{font-size:10.5px;padding:1px 6px}
.hud.bl{left:max(8px,env(safe-area-inset-left,0px));bottom:calc(8px + env(safe-area-inset-bottom,0px))}
.endbtn{min-height:52px;padding:0 24px;font-size:17px;border-radius:22px;background:linear-gradient(180deg,#c24b3c,#7d2117);border:2px solid #e0b25a;color:#fff6e4;font-weight:700;box-shadow:0 2px 8px rgba(0,0,0,.6)}
.hud.tp{left:max(8px,env(safe-area-inset-left,0px));bottom:calc(60px + env(safe-area-inset-bottom,0px));width:min(320px,42vw);max-height:60%;overflow:auto;background:rgba(18,15,11,.92);border:1px solid var(--gold);border-radius:8px;padding:8px}
.bhint{position:absolute;z-index:3;top:calc(6px + env(safe-area-inset-top,0px));left:50%;transform:translateX(-50%);max-width:46%;pointer-events:none;font-size:12px;color:#d9ccae;background:rgba(18,15,11,.7);border-radius:12px;padding:3px 10px;text-align:center}
.bhint:empty{display:none}
.logpanel{position:absolute;z-index:8;top:8px;bottom:8px;left:max(8px,env(safe-area-inset-left,0px));width:min(420px,70vw);overflow:auto;background:rgba(18,15,11,.96);border:1px solid var(--gold);border-radius:8px;padding:10px 12px;display:flex;flex-direction:column;gap:8px}
.logpanel[hidden]{display:none}
.lph{display:flex;justify-content:space-between;gap:8px;align-items:flex-start}
.lph small{display:block;color:var(--muted);font-size:12px}
.logpanel ol{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:5px;font-size:13px;color:var(--muted)}
.logpanel ol li:first-child{color:var(--paper)}
#stage .stage-inner{width:auto;align-items:center}
#sc{width:auto;height:min(calc(100dvh - 70px),calc((100vw - 24px)*9/16));aspect-ratio:16/9;max-width:100%}
@media (orientation:portrait){
  .bhint{top:auto;bottom:calc(168px + env(safe-area-inset-bottom,0px));max-width:80%}
  .hud.tl{width:min(250px,60vw)}
  .acts2{grid-template-columns:repeat(3,64px)}
  .rbtn{width:64px;height:64px}
  .logpanel{width:auto;right:8px}
}
'''
rep('@media (prefers-reduced-motion:reduce){*{scroll-behavior:auto}}', BCSS + '@media (prefers-reduced-motion:reduce){*{scroll-behavior:auto}}')

# ---------------------------------------------------------------- map size + data
rep("const COLS=10, ROWS=8;", "const COLS=14, ROWS=8;")
rep("c:{n:'Fort',def:1.5}}", "c:{n:'Fort',def:1.5},p:{n:'Road',def:1}}")
rep("const gc={'.':", "const gc={p:['#8a7b52','#4f4429'],'.':")
rep('''  if(matchMedia('(orientation:landscape) and (max-height:560px)').matches){T=Math.max(24,Math.floor(Math.min((innerHeight-24)/ROWS,(innerWidth*0.6)/COLS)))}
  else{const w=$('.mapwrap').clientWidth-14; T=Math.max(28,Math.floor(Math.min(w,680)/COLS))}''',
'''  const bm=$('.bmap');T=Math.round(Math.max(52,Math.min(120,Math.min(bm.clientHeight,bm.clientWidth)/5.4)));
  $('.mapwrap').style.padding=`${Math.max(0,Math.round(bm.clientHeight/2-T/2))}px ${Math.max(0,Math.round(bm.clientWidth/2-T/2))}px`;''')

# ---------------------------------------------------------------- painted terrain
_a = s.index('function renderTerrain(T){')
_b = s.index('function drawGlyph(')
s = s[:_a] + r'''function renderTerrain(T){
  const d=DPR(),W=COLS*T,H=ROWS*T,cv=document.createElement('canvas');cv.width=W*d;cv.height=H*d;const c=cv.getContext('2d');c.setTransform(d,0,0,d,0,0);
  const r=rng(9173+MAP.join('').length+MAP.join('').split('f').length*31);
  const at=(x,y)=>inb(x,y)?MAP[y][x]:null, isW=t=>t==='w'||t==='=', isRoad=t=>t==='p'||t==='='||t==='c';
  const cx=x=>x*T+T/2, cy=y=>y*T+T/2;
  // grass
  const g=c.createLinearGradient(0,0,W,H);g.addColorStop(0,'#77923f');g.addColorStop(.5,'#698a39');g.addColorStop(1,'#5b7c33');c.fillStyle=g;c.fillRect(0,0,W,H);
  for(let i=0;i<W*H/70;i++){const x=r()*W,y=r()*H;c.fillStyle=r()<.5?'rgba(160,185,80,.10)':'rgba(35,60,20,.10)';circ(c,x,y,T*(.12+r()*.45));c.fill()}
  c.lineWidth=1;for(let i=0;i<W*H/45;i++){const x=r()*W,y=r()*H;c.strokeStyle=r()<.55?'rgba(175,200,100,.45)':'rgba(40,70,25,.4)';ln(c,x,y,x+(r()-.5)*2.5,y-2-r()*3.5)}
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++)if(at(x,y)==='.'&&r()<.35){for(let k=0;k<3;k++){c.fillStyle=['#f1e7a0','#e9b8c8','#ffffff'][Math.floor(r()*3)];circ(c,x*T+r()*T,y*T+r()*T,Math.max(1,T*.025));c.fill()}}
  // hills: soft ground swell under the tile
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++)if(at(x,y)==='h'){const gg=c.createRadialGradient(cx(x)-T*.15,cy(y)-T*.2,T*.05,cx(x),cy(y),T*.7);gg.addColorStop(0,'rgba(196,182,110,.9)');gg.addColorStop(.6,'rgba(150,140,80,.75)');gg.addColorStop(1,'rgba(110,110,60,0)');c.fillStyle=gg;circ(c,cx(x),cy(y),T*.72);c.fill()}
  // river
  const seg=(test,draw)=>{for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++)if(test(at(x,y))){draw(x,y,x,y);if(test(at(x+1,y)))draw(x,y,x+1,y);if(test(at(x,y+1)))draw(x,y,x,y+1)}};
  const stroke=(w,col)=>(x,y,x2,y2)=>{c.strokeStyle=col;c.lineWidth=w;c.lineCap='round';c.beginPath();c.moveTo(cx(x),cy(y)+(y===0&&y2===0?-T*.6:0));c.lineTo(cx(x2)+.01,cy(y2)+(y2===ROWS-1&&y===ROWS-1?T*.6:0));c.stroke()};
  const edgeRiver=(w,col)=>{for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++)if(isW(at(x,y))){c.strokeStyle=col;c.lineWidth=w;c.lineCap='round';c.beginPath();c.moveTo(cx(x),y===0?0:cy(y));c.lineTo(cx(x),y===ROWS-1?H:cy(y));c.stroke();if(isW(at(x+1,y))){c.beginPath();c.moveTo(cx(x),cy(y));c.lineTo(cx(x+1),cy(y));c.stroke()}if(isW(at(x,y+1))){c.beginPath();c.moveTo(cx(x),cy(y));c.lineTo(cx(x),cy(y+1));c.stroke()}}};
  edgeRiver(T*1.02,'#4b5b2c');edgeRiver(T*.9,'#8c7a4f');edgeRiver(T*.78,'#2f6c86');edgeRiver(T*.5,'#3f86a2');edgeRiver(T*.18,'rgba(160,215,230,.35)');
  c.strokeStyle='rgba(220,240,245,.55)';c.lineWidth=1.2;for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++)if(at(x,y)==='w')for(let k=0;k<3;k++){const yy=y*T+T*(.2+k*.3),xx=x*T+T*(.25+r()*.3);c.beginPath();c.moveTo(xx,yy);c.quadraticCurveTo(xx+T*.08,yy-2,xx+T*.16,yy);c.stroke()}
  // road
  const road=(w,col)=>{c.strokeStyle=col;c.lineWidth=w;c.lineCap='round';c.lineJoin='round';for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++)if(isRoad(at(x,y))&&at(x,y)!=='c'||at(x,y)==='c'&&(isRoad(at(x-1,y))||isRoad(at(x+1,y)))){
      const t=at(x,y);if(t!=='p'&&t!=='=')continue;
      c.beginPath();c.moveTo(cx(x),cy(y));c.lineTo(cx(x)+.01,cy(y));c.stroke();
      for(const [dx,dy] of [[1,0],[0,1]]){const n=at(x+dx,y+dy);if(n==='p'||n==='='||n==='c'){c.beginPath();c.moveTo(cx(x),cy(y));c.lineTo(cx(x+dx),cy(y+dy));c.stroke()}}
      if(x===0){c.beginPath();c.moveTo(0,cy(y));c.lineTo(cx(x),cy(y));c.stroke()}if(x===COLS-1){c.beginPath();c.moveTo(cx(x),cy(y));c.lineTo(W,cy(y));c.stroke()}}};
  road(T*.56,'rgba(80,62,36,.55)');road(T*.46,'#b99a64');road(T*.3,'#ccb07a');
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++)if(at(x,y)==='p')for(let k=0;k<6;k++){c.fillStyle=r()<.5?'rgba(120,96,60,.5)':'rgba(235,215,170,.5)';circ(c,cx(x)+(r()-.5)*T*.5,cy(y)+(r()-.5)*T*.35,Math.max(1,T*.025));c.fill()}
  // bridges
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++)if(at(x,y)==='='){const X=x*T,Y=y*T;c.fillStyle='rgba(0,0,0,.3)';c.fillRect(X-T*.05,Y+T*.27,T*1.1,T*.52);c.fillStyle='#8a6438';c.fillRect(X-T*.08,Y+T*.24,T*1.16,T*.5);c.strokeStyle='#5e4426';c.lineWidth=1;for(let i=0;i<8;i++)ln(c,X-T*.08+i*T*.16,Y+T*.24,X-T*.08+i*T*.16,Y+T*.74);c.strokeStyle='#3e2c18';c.lineWidth=2.5;ln(c,X-T*.08,Y+T*.24,X+T*1.08,Y+T*.24);ln(c,X-T*.08,Y+T*.74,X+T*1.08,Y+T*.74)}
  // fort
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++)if(at(x,y)==='c'){const X=x*T,Y=y*T;c.fillStyle='rgba(0,0,0,.35)';c.fillRect(X+T*.1,Y+T*.2,T*.86,T*.78);
    c.fillStyle='#8f8676';c.fillRect(X+T*.06,Y+T*.16,T*.86,T*.74);for(let i=0;i<4;i++)c.fillRect(X+T*.06+i*T*.235,Y+T*.04,T*.14,T*.14);
    c.strokeStyle='#6a6152';c.lineWidth=1;for(let i=1;i<4;i++)ln(c,X+T*.06,Y+T*.16+i*T*.185,X+T*.92,Y+T*.16+i*T*.185);
    c.fillStyle='#2b241b';c.beginPath();c.arc(X+T*.49,Y+T*.9,T*.14,Math.PI,0);c.fill();c.fillStyle='#b9392d';c.fillRect(X+T*.7,Y-T*.12,T*.16,T*.12);c.strokeStyle='#3e2c18';c.lineWidth=1.5;ln(c,X+T*.7,Y-T*.14,X+T*.7,Y+T*.1)}
  // trees and rocks, back to front
  const props=[];
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){const t=at(x,y);
    if(t==='f'){c.fillStyle='rgba(28,48,18,.35)';rr(c,x*T+1,y*T+1,T-2,T-2,T*.3);c.fill();for(let k=0;k<4;k++)props.push({k:'tree',x:x*T+T*(.18+((k%2)*.5)+r()*.16),y:y*T+T*(.3+Math.floor(k/2)*.42+r()*.1),s:T*(.2+r()*.06)})}
    else if(t==='h'){props.push({k:'hill',x:cx(x),y:cy(y)+T*.18,s:T*.42});if(r()<.6)props.push({k:'rock',x:x*T+T*(.2+r()*.6),y:y*T+T*(.7+r()*.2),s:T*.08})}
    else if(t==='.'&&r()<.12)props.push({k:'bush',x:x*T+T*(.15+r()*.7),y:y*T+T*(.2+r()*.7),s:T*.08})}
  props.sort((a,b)=>a.y-b.y);
  for(const p of props){const {x,y,s}=p;
    if(p.k==='tree'){c.fillStyle='rgba(0,0,0,.28)';c.beginPath();c.ellipse(x+s*.2,y+s*.95,s*.85,s*.28,0,0,Math.PI*2);c.fill();
      c.fillStyle='#4a3220';c.fillRect(x-s*.12,y+s*.2,s*.24,s*.75);
      c.fillStyle='#24401b';circ(c,x,y,s);c.fill();c.fillStyle='#335a24';circ(c,x-s*.2,y-s*.25,s*.72);c.fill();circ(c,x+s*.35,y-s*.05,s*.6);c.fill();
      c.fillStyle='#4d7d32';circ(c,x-s*.3,y-s*.45,s*.4);c.fill();c.fillStyle='rgba(150,190,90,.5)';circ(c,x-s*.42,y-s*.58,s*.18);c.fill()}
    else if(p.k==='hill'){const gg=c.createLinearGradient(x-s,y-s,x+s,y);gg.addColorStop(0,'#c2b475');gg.addColorStop(1,'#7c7442');c.fillStyle=gg;c.beginPath();c.ellipse(x,y,s*1.15,s*.85,0,Math.PI,0);c.fill();
      c.strokeStyle='rgba(60,55,30,.6)';c.lineWidth=1.2;c.beginPath();c.ellipse(x,y,s*1.15,s*.85,0,Math.PI*1.05,Math.PI*1.95);c.stroke();
      c.strokeStyle='rgba(255,245,200,.45)';c.beginPath();c.ellipse(x,y,s*1.0,s*.7,0,Math.PI*1.15,Math.PI*1.45);c.stroke()}
    else if(p.k==='rock'){c.fillStyle='#8c8577';c.beginPath();c.ellipse(x,y,s*1.3,s*.8,0,0,Math.PI*2);c.fill();c.fillStyle='#b5ad9c';c.beginPath();c.ellipse(x-s*.3,y-s*.25,s*.6,s*.35,0,0,Math.PI*2);c.fill()}
    else {c.fillStyle='#2f5224';circ(c,x,y,s);c.fill();c.fillStyle='#4c7a33';circ(c,x-s*.3,y-s*.3,s*.6);c.fill()}}
  // grid + vignette
  c.strokeStyle='rgba(0,0,0,.14)';c.lineWidth=1;for(let i=1;i<COLS;i++)ln(c,i*T+.5,0,i*T+.5,H);for(let j=1;j<ROWS;j++)ln(c,0,j*T+.5,W,j*T+.5);
  const v=c.createRadialGradient(W/2,H/2,Math.min(W,H)*.4,W/2,H/2,Math.max(W,H)*.75);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.35)');c.fillStyle=v;c.fillRect(0,0,W,H);
  return cv}
''' + s[_b:]

# ---------------------------------------------------------------- portrait tokens
rep('''  rr(c,-s/2,-s/2,s,s*.84,s*.16);c.fillStyle=F.main;c.fill();c.lineWidth=u.cmd?2.4:1.4;c.strokeStyle=u.cmd?'#d4ad55':F.dark;c.stroke();
  c.fillStyle='#f6eed8';c.font=`900 ${Math.round(s*.5)}px "Noto Serif TC", serif`;c.textAlign='center';c.textBaseline='middle';c.fillText(u.ch,-s*.06,-s*.06);''',
'''  rr(c,-s/2,-s/2,s,s*.84,s*.16);c.fillStyle=F.dark;c.fill();
  const pim=portImg(u.id);
  if(pim){c.save();rr(c,-s/2+2,-s/2+2,s-4,s*.84-4,s*.13);c.clip();c.drawImage(pim,96,36,320,264,-s/2+2,-s/2+2,s-4,s*.84-4);c.restore()}
  else{c.fillStyle=F.main;rr(c,-s/2+2,-s/2+2,s-4,s*.84-4,s*.13);c.fill();c.fillStyle='#f6eed8';c.font=`900 ${Math.round(s*.5)}px "Noto Serif TC", serif`;c.textAlign='center';c.textBaseline='middle';c.fillText(u.ch,-s*.06,-s*.06)}
  rr(c,-s/2,-s/2,s,s*.84,s*.16);c.lineWidth=u.cmd?3:2.2;c.strokeStyle=u.cmd?'#e8c25e':F.main;c.stroke();''')
rep("const PORT={};", '''const PORT={};const PIMG={};
function portImg(id){const f=PORT[id];if(!f)return null;let im=PIMG[f];if(!im){im=new Image();im.src=`portraits/${f}.webp`;PIMG[f]=im}return im.complete&&im.naturalWidth?im:null}''')

# ---------------------------------------------------------------- highlights
rep('''  if(G.atk&&(G.mode==='select'||G.mode==='moved')){c.strokeStyle=`rgba(229,99,79,${.55+pulse*.45})`;c.lineWidth=2.5;for(const e of G.atk){c.beginPath();c.arc(e.px*T+T/2,e.py*T+T/2,T*.47,0,Math.PI*2);c.stroke()}}''',
'''  if(G.rangeTiles&&G.mode==='select'){c.fillStyle='rgba(205,70,50,.16)';for(const t of G.rangeTiles)c.fillRect(t.x*T+1,t.y*T+1,T-2,T-2)}
  if(G.atk&&(G.mode==='select'||G.mode==='moved')){for(const e of G.atk){c.fillStyle=`rgba(215,55,40,${.32+pulse*.2})`;c.fillRect(e.x*T+1,e.y*T+1,T-2,T-2);c.strokeStyle=`rgba(255,120,95,${.65+pulse*.35})`;c.lineWidth=2.5;c.strokeRect(e.x*T+2.5,e.y*T+2.5,T-5,T-5)}}''')
rep("  G.atk=G.sel?attackable(G.sel):null;", '''  G.atk=G.sel?attackable(G.sel):null;
  G.rangeTiles=null;if(G.sel&&G.mode==='select'&&G.reach){const key=t=>t.x+','+t.y,rs=new Set(G.reach.tiles.map(key)),out=new Map(),[r0,r1]=TYPES[G.sel.type].rng;
    for(const t of G.reach.tiles)for(let dx=-r1;dx<=r1;dx++)for(let dy=-r1;dy<=r1;dy++){const d=Math.abs(dx)+Math.abs(dy);if(d<r0||d>r1)continue;const x=t.x+dx,y=t.y+dy;if(!inb(x,y)||rs.has(x+','+y)||terAt(x,y)==='w')continue;out.set(x+','+y,{x,y})}
    G.rangeTiles=[...out.values()]}''')

# ---------------------------------------------------------------- action rail
rep("  } else h+=`<h3>Unit</h3><p class=\"umeta\" style=\"margin:0\">Nothing selected.</p>`;", "  }")
_a = s.index("  if((G.mode==='moved'||G.mode==='select')&&G.sel){const s=G.sel;\n    const sk=")
_b = s.index("  box.innerHTML=h;\n}") + len("  box.innerHTML=h;\n}")
s = s[:_a] + r'''  let ah='';const rb=(attr,zh,label,ok,cls,cd)=>`<button class="rbtn ${cls||''}" ${attr} ${ok?'':'disabled'}><span class="rzh">${zh}</span><span class="rl">${label}</span>${cd?`<i class="cdb">${cd}</i>`:''}</button>`;
  if(G.mode==='moved'&&G.sel&&G.phase==='player'){const s=G.sel;
    ah+=rb('data-a="attack"',s.type==='archer'?'射':'攻',s.type==='archer'?'Shoot':'Attack',(G.atk||[]).length>0,'atk');
    for(const [k,v] of Object.entries(SKILLS))if(v.who(s)){const cd=s.cd[k]||0,ok=!cd&&(k==='guard'||skillTargets(k,s).length>0);ah+=rb(`data-sk="${k}" title="${v.desc}"`,v.zh,v.n,ok,'sk',cd)}
    ah+=rb('data-a="duel" title="Challenge an adjacent officer"','挑','Duel',duelTargets(s).length>0);
    ah+=rb('data-a="wait" title="End this unit\'s turn"','待','Wait',true);
  }
  let tp='';
  if(G.mode==='target')tp=`<div class="tlist">${G.targets.map((tg,i)=>`<button data-t="${i}"><span>${tg.u.name} <small>${TYPES[tg.u.type].n}</small></span><small>${tg.note}</small></button>`).join('')}<button data-a="back">Back</button></div>`;
  box.innerHTML=h;$('#acts').innerHTML=ah;$('#tpanel').innerHTML=tp;$('#tpanel').hidden=!tp;
}''' + s[_b:]
rep('''$('#info').addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b||G.busy)return;
  if(b.dataset.t!=null){execTarget(G.targets[+b.dataset.t].u);return}''', '''function hitTarget(u){const s=G.sel;if(G.tmode==='attack'&&!inRange(s.type,manh(s,u))){const t=G.reach&&bestAttackTile(s,u);if(t){moveThenAttack(s,u,t);return}}execTarget(u)}
function onAct(e){
  const b=e.target.closest('button');if(!b||G.busy||G.phase!=='player')return;
  if(b.dataset.t!=null){hitTarget(G.targets[+b.dataset.t].u);return}''')
rep('''  if(b.dataset.sk){const k=b.dataset.sk;G.mode='moved';''', '''  if(b.dataset.sk){const k=b.dataset.sk;G.prevMode=G.mode==='select'?'moved':G.mode;G.mode='moved';''')
rep('''  if(a==='duel'){G.tmode='duel';''', '''  if(a==='attack'){G.prevMode=G.mode;G.tmode='attack';const list=G.mode==='moved'?enemies().filter(e=>inRange(s.type,manh(s,e))):(G.atk||[]);G.targets=list.map(e=>{const f=forecast(s,e);return{u:e,note:`deal ~${f.deal} · take ~${f.take}${f.m>1?' ▲':f.m<1?' ▼':''}`}});G.mode='target'}
  if(a==='duel'){G.prevMode=G.mode;G.tmode='duel';''')
rep('''  if(a==='back'){G.mode='moved';G.targets=[]}''', '''  if(a==='back'){G.mode=G.prevMode||'moved';G.targets=[]}''')
rep('''  if(a==='cancel'){s.x=s.px=G.origin.x;s.y=s.py=G.origin.y;G.reach=reach(s);G.mode='select'}
  updateUI()});''', '''  if(a==='cancel'){s.x=s.px=G.origin.x;s.y=s.py=G.origin.y;G.reach=reach(s);G.mode='select'}
  updateUI()}
for(const id of ['#info','#acts','#tpanel'])$(id).addEventListener('click',onAct);
$('#logBtn').onclick=()=>{$('#logPanel').hidden=!$('#logPanel').hidden};
$('#logClose').onclick=()=>{$('#logPanel').hidden=true};''')
rep('''  if(G.mode==='target'){const tg=G.targets.find(t=>t.u===u);if(tg)execTarget(u);else{G.mode='moved';G.targets=[];updateUI()}return}''',
    '''  if(G.mode==='target'){const tg=G.targets.find(t=>t.u===u);if(tg)hitTarget(u);else{G.mode=G.prevMode||'moved';G.targets=[];updateUI()}return}''')
# auto-select the next ready unit
rep('''function finish(u){
  if(G.units.includes(u))u.acted=true;G.sel=null;G.reach=null;G.mode='idle';G.targets=[];updateUI();''', '''function autoSel(){if(!G||G.phase!=='player'||G.over)return;const u=G.units.find(x=>x.side==='shu'&&!x.acted);if(!u)return;G.sel=u;G.view=u;G.origin={x:u.x,y:u.y};G.reach=reach(u);G.mode='select'}
function finish(u){
  if(G.units.includes(u))u.acted=true;G.sel=null;G.reach=null;G.mode='idle';G.targets=[];autoSel();updateUI();''')
rep("  G.view=null;log(`Turn ${G.turn}.`);updateUI()}", "  G.view=null;log(`Turn ${G.turn}.`);autoSel();updateUI()}")
rep("  resizeMap();updateUI();\n  return new Promise", "  $('#logPanel').hidden=true;resizeMap();autoSel();updateUI();\n  return new Promise")
rep("$('#hint').innerHTML=G.phase==='enemy'?`${FAC.wei.name} is moving…`:hint;",
    "$('#hint').innerHTML=G.phase==='enemy'?`${FAC.wei.name} is moving…`:G.mode==='select'?'Tap a <b>blue square</b> to move · tap the general again to act here · tap a <b>red enemy</b> to attack':G.mode==='moved'?'Tap a <b>red enemy</b> or pick an action':G.mode==='target'?'Tap a <b>target</b>':'';")

# ---------------------------------------------------------------- fight scene: layout
rep("const W=800,H=450,GROUND=252;", "const W=800,H=450,GROUND=212;")
s, _n = _re.subn(r"y=GROUND\+20\+row\*31,s=\.95\+row\*\.09;const hx=\(cav\?226:232\)-col\*\(cav\?78:60\)-\(row%2\)\*14;",
                 "y=GROUND+22+row*25,s=.92+row*.07;const hx=(cav?272:268)-col*(cav?74:54)-(row%2)*12;", s)
assert _n == 1, 'buildSide'
s, _n = _re.subn(r"const ox=side==='L'\?62:W-62;\n  return\{u,side,face,sol,nB,nA,before,after,off:\{x:ox,hx:ox,tx:ox,y:GROUND\+74,hy:GROUND\+74,",
                 "const ox=side==='L'?172:W-172;\n  return{u,side,face,sol,nB,nA,before,after,off:{x:ox,hx:ox,tx:ox,y:GROUND+58,hy:GROUND+58,", s)
assert _n == 1, 'officer pos'
rep("drawPanel(c,SL,14,shownT(SL,t),'L');drawPanel(c,SR,W-14,shownT(SR,t),'R');", "drawFightHud(c,SL,SR,shownT(SL,t),shownT(SR,t));")
rep("function playBattle(att,def,r){", r'''const FADE=new Map();
function fadePort(im){let cv=FADE.get(im);if(cv)return cv;cv=document.createElement('canvas');cv.width=256;cv.height=384;const x=cv.getContext('2d');x.drawImage(im,0,0,256,384);x.globalCompositeOperation='destination-in';
  let g=x.createLinearGradient(0,0,256,0);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(.14,'#000');g.addColorStop(.86,'#000');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,256,384);
  g=x.createLinearGradient(0,0,0,384);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(.12,'#000');g.addColorStop(1,'#000');x.fillStyle=g;x.fillRect(0,0,256,384);FADE.set(im,cv);return cv}
function drawBigPortrait(c,u,side){
  const im=portImg(u.id),F=FAC[u.side],h=246,w=h*512/768,x=side==='L'?-10:W-w+10,y=H-h+18;
  c.save();c.strokeStyle='rgba(212,173,85,.55)';c.lineWidth=3;c.beginPath();c.arc(side==='L'?86:W-86,H-62,92,0,Math.PI*2);c.stroke();c.lineWidth=1;c.beginPath();c.arc(side==='L'?86:W-86,H-62,102,0,Math.PI*2);c.stroke();c.restore();
  if(im){c.drawImage(fadePort(im),x,y,w,h)}
  else{c.fillStyle=F.main;circ(c,side==='L'?86:W-86,H-62,70);c.fill();c.strokeStyle='#d4ad55';c.lineWidth=3;c.stroke();c.fillStyle='#f6eed8';c.font='900 64px "Noto Serif TC", serif';c.textAlign='center';c.textBaseline='middle';c.fillText(u.ch,side==='L'?86:W-86,H-60);c.textBaseline='alphabetic'}}
function drawFightHud(c,SL,SR,sl,sr){
  drawBigPortrait(c,SL.u,'L');drawBigPortrait(c,SR.u,'R');
  const x0=176,x1=W-176,y=H-64,cxm=W/2;
  c.fillStyle='rgba(16,13,10,.9)';rr(c,x0,y,x1-x0,54,8);c.fill();c.strokeStyle='#b8913f';c.lineWidth=2;c.stroke();
  c.fillStyle='#b8913f';c.beginPath();c.moveTo(cxm,y-10);c.lineTo(cxm+12,y+2);c.lineTo(cxm,y+12);c.lineTo(cxm-12,y+2);c.closePath();c.fill();
  c.fillStyle='#2a6fb0';circ(c,cxm,y+2,4);c.fill();
  c.textAlign='center';c.fillStyle='#d4ad55';c.font='700 12px "Alegreya SC", Georgia, serif';c.fillText('Troops',cxm,y+19);
  for(const [S,v,side] of [[SL,sl,'L'],[SR,sr,'R']]){const mine=S.u.side==='shu',L=side==='L';
    const bx=L?x0+12:cxm+72,bw=cxm-72-(x0+12),frac=clamp(v/Math.max(1,S.u.max||S.before));
    c.textAlign=L?'left':'right';c.fillStyle='#ece2c9';c.font='700 14px "Alegreya SC", Georgia, serif';c.fillText(S.u.name,L?bx:bx+bw,y+17);
    c.fillStyle='#a6977a';c.font='500 11px "Alegreya Sans", sans-serif';c.fillText(TYPES[S.u.type].n,L?bx+c.measureText(S.u.name).width*1.25+8:bx+bw-c.measureText(S.u.name).width*1.25-8,y+17);
    c.fillStyle='#0b0907';rr(c,bx,y+24,bw,12,6);c.fill();
    const g=c.createLinearGradient(0,y+24,0,y+36);if(mine){g.addColorStop(0,'#7be07a');g.addColorStop(1,'#2f9a3a')}else{g.addColorStop(0,'#ff7a6a');g.addColorStop(1,'#b62d22')}
    c.fillStyle=g;const ww=bw*frac;rr(c,L?bx:bx+bw-ww,y+24,Math.max(ww,1),12,6);c.fill();
    c.textAlign=L?'right':'left';c.fillStyle='#f3e6c4';c.font='700 19px "Alegreya Sans", sans-serif';c.lineWidth=3;c.strokeStyle='#14110d';const tx=L?cxm-14:cxm+14;c.strokeText(String(Math.round(v)),tx,y+38);c.fillText(String(Math.round(v)),tx,y+38)}
  c.textAlign='left'}
function playBattle(att,def,r){''')
# duel badges with portraits
rep('''const bx=align==='L'?px+8:px+w-50;c.fillStyle=F.main;rr(c,bx,21,42,42,3);c.fill();c.fillStyle='#f6eed8';c.font='900 28px "Noto Serif TC", serif';c.textAlign='center';c.textBaseline='middle';c.fillText(u.ch,bx+21,43);''',
    '''const bx=align==='L'?px+8:px+w-50;c.fillStyle=F.main;rr(c,bx,21,42,42,3);c.fill();const pim=portImg(u.id);if(pim){c.save();rr(c,bx+1,22,40,40,3);c.clip();c.drawImage(pim,96,36,320,320,bx+1,22,40,40);c.restore()}else{c.fillStyle='#f6eed8';c.font='900 28px "Noto Serif TC", serif';c.textAlign='center';c.textBaseline='middle';c.fillText(u.ch,bx+21,43)}''')

# ---------------------------------------------------------------- fight scene: new sprites
_a = s.index('function drawHorse(c,ph,running,F){')
_b = s.index('function mountains(')
s = s[:_a] + r'''function drawHorse(c,ph,running,F){
  const g=running?Math.sin(ph):0,O='#1a1410';c.lineCap='round';c.lineJoin='round';
  const leg=(x,a,col)=>{c.strokeStyle=O;c.lineWidth=4.6;ln(c,x,-13,x+a,-1);c.strokeStyle=col;c.lineWidth=3;ln(c,x,-13,x+a,-1);c.fillStyle='#2a1c12';circ(c,x+a,-.5,1.9);c.fill()};
  leg(-10,-g*5,'#5c3c22');leg(9,g*5,'#5c3c22');
  c.strokeStyle=O;c.lineWidth=3.6;c.beginPath();c.moveTo(-17,-19);c.quadraticCurveTo(-25,-15,-24,-6+g*2);c.stroke();c.strokeStyle='#2a1a10';c.lineWidth=2.4;c.stroke();
  c.fillStyle='#7d5432';c.strokeStyle=O;c.lineWidth=1.4;c.beginPath();c.ellipse(0,-17,17,8,0,0,Math.PI*2);c.fill();c.stroke();
  c.fillStyle='#9b6d43';c.beginPath();c.ellipse(-2,-20,12,3.5,0,0,Math.PI*2);c.fill();
  c.fillStyle='#7d5432';c.beginPath();c.moveTo(10,-22);c.quadraticCurveTo(16,-34,22,-34);c.lineTo(28,-30);c.quadraticCurveTo(29,-27,25,-26);c.lineTo(18,-24);c.lineTo(15,-14);c.closePath();c.fill();c.stroke();
  c.fillStyle='#2a1a10';c.beginPath();c.moveTo(12,-24);c.quadraticCurveTo(16,-35,21,-36);c.lineTo(17,-31);c.quadraticCurveTo(14,-27,14,-22);c.closePath();c.fill();
  c.fillStyle=O;circ(c,22,-31,.9);c.fill();
  leg(-6,g*5,'#6d4a2a');leg(13,-g*5,'#6d4a2a');
  c.fillStyle=F.main;c.strokeStyle=O;c.lineWidth=1.2;c.beginPath();c.moveTo(-9,-24);c.lineTo(7,-24);c.lineTo(8,-13);c.lineTo(-10,-13);c.closePath();c.fill();c.stroke();
  c.strokeStyle='#d4ad55';c.lineWidth=1;ln(c,-9.5,-14.5,7.5,-14.5)}
function drawFigure(c,f){
  const F=FAC[f.fac]||FAC.shu,O='#1a1410',skin='#e6bb8e';c.save();c.globalAlpha=f.alpha??1;c.translate(f.x,f.y);c.scale(f.s*f.face,f.s);
  if(!f.fall){c.fillStyle='rgba(0,0,0,.3)';c.beginPath();c.ellipse(0,1,f.type==='cav'?22:9,3,0,0,Math.PI*2);c.fill()}
  if(f.fall)c.rotate(-f.fall*1.4);
  const running=f.run!=null,ph=f.run||0,leg=running?Math.sin(ph)*5:0,bob=running?Math.abs(Math.sin(ph))*1.4:0,sw=f.swing||0;
  c.lineCap='round';c.lineJoin='round';
  if(f.type==='cav'){drawHorse(c,ph,running,F);c.translate(-1,-17)}
  c.translate(0,-bob);
  if(f.officer){c.strokeStyle='#4a3420';c.lineWidth=1.6;ln(c,-6,-22,-6,-62);c.fillStyle=F.main;c.strokeStyle=O;c.lineWidth=1;c.beginPath();c.moveTo(-6,-62);c.lineTo(-23,-62);c.lineTo(-23,-47);c.lineTo(-6,-47);c.closePath();c.fill();c.stroke();
    c.strokeStyle='#d4ad55';c.lineWidth=1;c.strokeRect(-21,-60,13,11);c.save();c.translate(-14.5,-54.5);c.scale(f.face,1);c.fillStyle='#f6eed8';c.font='900 9px "Noto Serif TC", serif';c.textAlign='center';c.textBaseline='middle';c.fillText(f.ch||'',0,.5);c.restore();
    c.fillStyle='#8f2a20';c.strokeStyle=O;c.lineWidth=1;c.beginPath();c.moveTo(-4,-25);c.quadraticCurveTo(-12-leg*.3,-12,-11,-4);c.lineTo(-2,-8);c.closePath();c.fill();c.stroke()}
  if(f.type==='archer'){c.fillStyle='#6b4a2b';c.strokeStyle=O;c.lineWidth=1;rr(c,-9,-30,4,12,1.5);c.fill();c.stroke();c.strokeStyle='#e8e0cc';c.lineWidth=.8;for(let i=0;i<3;i++)ln(c,-8+i,-30,-9+i,-33)}
  if(f.type!=='cav'){for(const [dx,a] of [[-2.5,-leg],[2.5,leg]]){c.strokeStyle=O;c.lineWidth=4.4;ln(c,dx,-12,dx+a,-2);c.strokeStyle='#3d2e22';c.lineWidth=3;ln(c,dx,-12,dx+a,-2);c.fillStyle='#21170f';c.beginPath();c.ellipse(dx+a+1,-1.2,2.6,1.6,0,0,Math.PI*2);c.fill()}}
  else{c.strokeStyle=O;c.lineWidth=4;ln(c,1,-12,4,-3);c.strokeStyle='#3d2e22';c.lineWidth=2.6;ln(c,1,-12,4,-3)}
  if(f.type==='spear'||f.type==='cav'){c.save();c.translate(4,-20);c.rotate(-.55+sw*.5);const L=(f.type==='cav'?31:27)+sw*6;c.strokeStyle=O;c.lineWidth=3.2;ln(c,-11,0,L,0);c.strokeStyle='#7a5530';c.lineWidth=1.8;ln(c,-11,0,L,0);
    c.fillStyle='#dfe3e6';c.strokeStyle=O;c.lineWidth=1;c.beginPath();if(f.type==='cav'&&f.officer){c.moveTo(L-1,-1.5);c.quadraticCurveTo(L+7,-9,L+13,-2);c.lineTo(L+2,3)}else{c.moveTo(L,-2.6);c.lineTo(L+9,0);c.lineTo(L,2.6)}c.closePath();c.fill();c.stroke();
    c.fillStyle='#c0392b';c.beginPath();c.moveTo(L-1,0);c.lineTo(L-5,4.5);c.lineTo(L-3,0);c.fill();c.restore()}
  c.fillStyle=F.main;c.strokeStyle=O;c.lineWidth=1.3;c.beginPath();c.moveTo(-5.5,-26);c.lineTo(5.5,-26);c.lineTo(6.5,-11);c.lineTo(-6.5,-11);c.closePath();c.fill();c.stroke();
  c.fillStyle=F.dark;c.fillRect(-5.8,-25,11.6,4);c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=.8;ln(c,-6,-18,6,-18);ln(c,-6,-15,6,-15);
  c.fillStyle='#5a3a1e';c.fillRect(-6.5,-14,13,2.6);c.fillStyle='#d4ad55';c.fillRect(-1.2,-14,2.4,2.6);
  c.fillStyle=F.dark;c.strokeStyle=O;c.lineWidth=1;circ(c,-5,-24,2.6);c.fill();c.stroke();circ(c,5,-24,2.6);c.fill();c.stroke();
  if(f.type==='shield'){c.save();c.translate(3,-20);c.rotate(-1.15+sw*1.55);c.strokeStyle=O;c.lineWidth=2.6;ln(c,0,0,15,0);c.strokeStyle='#dfe3e6';c.lineWidth=1.5;ln(c,2,0,15,0);c.strokeStyle='#d4ad55';c.lineWidth=2;ln(c,1,-2.5,1,2.5);c.restore();
    c.fillStyle=F.dark;c.strokeStyle=O;c.lineWidth=1.2;c.beginPath();c.ellipse(7,-18,4.8,8.5,0,0,Math.PI*2);c.fill();c.stroke();c.strokeStyle='#d4ad55';c.lineWidth=1;c.beginPath();c.ellipse(7,-18,3.6,7.2,0,0,Math.PI*2);c.stroke();c.fillStyle='#d4ad55';circ(c,7,-18,1.4);c.fill()}
  else if(f.type==='archer'){const pull=f.shoot?6:0;c.strokeStyle=O;c.lineWidth=2.6;c.beginPath();c.arc(4,-21,10,-1.15,1.15);c.stroke();c.strokeStyle='#8a5c30';c.lineWidth=1.5;c.stroke();
    const ax=4+10*Math.cos(1.15),ay=10*Math.sin(1.15);c.strokeStyle='#efe6d2';c.lineWidth=.7;c.beginPath();c.moveTo(ax,-21-ay);c.lineTo(ax-pull,-21);c.lineTo(ax,-21+ay);c.stroke();
    if(f.shoot){c.strokeStyle='#efe6d2';c.lineWidth=1;ln(c,ax-pull,-21,ax+8,-21)}c.strokeStyle=O;c.lineWidth=3.2;ln(c,0,-24,11,-21);c.strokeStyle=skin;c.lineWidth=2;ln(c,0,-24,11,-21)}
  else{c.strokeStyle=O;c.lineWidth=3.2;ln(c,1,-24,5,-20);c.strokeStyle=skin;c.lineWidth=2;ln(c,1,-24,5,-20)}
  c.fillStyle=skin;c.strokeStyle=O;c.lineWidth=1.3;circ(c,0,-33,6.6);c.fill();c.stroke();
  c.fillStyle=O;c.beginPath();c.ellipse(3.2,-33,.9,1.3,0,0,Math.PI*2);c.fill();c.fillStyle='rgba(200,90,70,.35)';circ(c,2.5,-30.5,1.5);c.fill();
  const helm=f.officer?'#c9a24a':F.dark;c.fillStyle=helm;c.strokeStyle=O;c.lineWidth=1.2;c.beginPath();c.arc(0,-34.5,7,Math.PI*1.02,Math.PI*1.98);c.lineTo(8.5,-34);c.lineTo(-8,-34);c.closePath();c.fill();c.stroke();
  c.fillStyle=f.officer?'#8f2a20':F.main;c.beginPath();c.moveTo(-1,-41);c.quadraticCurveTo(-6,-48,-11,-47);c.quadraticCurveTo(-6,-44,-2,-38);c.fill();
  if(f.officer){c.fillStyle='#e8d48a';circ(c,0,-41.5,1.6);c.fill();c.strokeStyle=O;c.lineWidth=1;c.fillStyle='#20140c';c.beginPath();c.moveTo(.5,-29);c.quadraticCurveTo(4,-25,7,-28);c.quadraticCurveTo(4,-27.5,.5,-29);c.fill()}
  c.restore()}
''' + s[_b:]

# ---------------------------------------------------------------- sprite-sheet soldiers
rep("items.push({y:s.hy,f:{x,y:s.hy,s:s.s,face,fac:S.u.side,type:S.u.type,run,swing:sw,",
    "items.push({y:s.hy,f:{x,y:s.hy,s:s.s,face,fac:S.u.side,type:S.u.type,run,swing:sw,fight:S.melee&&alive&&t>=1500&&t<=2700,seed:s.seed,")
rep("function drawFigure(c,f){", r'''const SPRITES={spear:1,shield:1,archer:1,cav:1};const SPIMG={};
function sprFac(f){if(f==='shu')return 'shu';const foe=G&&G.cfg&&G.cfg.foe;return foe==='wei'||foe==='wu'?foe:foe?'ind':'wei'}
function sprSheet(type,fk){const k=type+'_'+fk;let im=SPIMG[k];if(!im){im=new Image();im.src=`sprites/${k}.png`;SPIMG[k]=im}return im.complete&&im.naturalWidth?im:null}
function drawSprite(c,f,sh){
  const now=performance.now(),sd=f.seed||0;let row=0,fr=0;
  if(f.fall>0){row=3;fr=Math.min(3,Math.floor(f.fall*4))}
  else if(f.fight){row=2;fr=Math.floor(now/120+sd*5)%4}
  else if(f.shoot){row=2;fr=Math.floor(now/190+sd*3)%4}
  else if(f.run!=null){row=1;fr=Math.floor(f.run/2.6)%4}
  else{row=0;const p=Math.floor(now/320+sd*3)%6;fr=[0,1,2,3,2,1][p]}
  const cv=f.type==='cav',k=(cv?74:58)/150;c.save();c.globalAlpha=f.alpha??1;c.translate(f.x,f.y);c.scale(f.s*f.face,f.s);
  if(!f.fall){c.fillStyle='rgba(0,0,0,.28)';c.beginPath();c.ellipse(0,1,cv?22:10,3,0,0,Math.PI*2);c.fill()}
  c.drawImage(sh,fr*256,row*176,256,176,-128*k,-168*k,256*k,176*k);c.restore()}
function drawFigure(c,f){
  if(!f.officer&&SPRITES[f.type]){const sh=sprSheet(f.type,sprFac(f.fac));if(sh){drawSprite(c,f,sh);return}}''')

# ---------------------------------------------------------------- general sprites
rep("officer:true,ch:S.u.ch,run:orun,swing:osw,shoot:S.shoot&&t>600&&t<1400,alpha:1-flee}})",
    "officer:true,ch:S.u.ch,run:orun,swing:osw,shoot:S.shoot&&t>600&&t<1400,fight:S.melee&&!flee&&t>=1500&&t<=2700,defeat:S.nA===0&&t>2550&&t<=2900?clamp((t-2550)/350):0,seed:1.7,alpha:1-flee}})")
rep("  if(!f.officer&&SPRITES[f.type]){const sh=sprSheet(f.type,sprFac(f.fac));if(sh){drawSprite(c,f,sh);return}}",
    "  if(f.officer){const sh=sprSheet('general',sprFac(f.fac));if(sh){drawSprite(c,f,sh);return}}\n  else if(SPRITES[f.type]){const sh=sprSheet(f.type,sprFac(f.fac));if(sh){drawSprite(c,f,sh);return}}")
rep("  if(f.fall>0){row=3;fr=Math.min(3,Math.floor(f.fall*4))}",
    "  if(f.fall>0){row=3;fr=Math.min(3,Math.floor(f.fall*4))}\n  else if(f.defeat>0){row=3;fr=f.defeat<.5?0:1}\n  else if(f.officer&&!f.fight&&f.swing>0){row=2;fr=f.swing>.6?2:1}")
rep("const cv=f.type==='cav',k=(cv?74:58)/150;", "const cv=f.type==='cav'||f.officer,k=(f.officer?84:cv?74:58)/150;")

# ---------------------------------------------------------------- turning
rep("fight:S.melee&&alive&&t>=1500&&t<=2700,seed:s.seed,", "fight:S.melee&&alive&&t>=1500&&t<=2700,seed:s.seed,turn:S.melee&&alive?TURN(t,[2700,3500]):1,")
rep("defeat:S.nA===0&&t>2550&&t<=2900?clamp((t-2550)/350):0,seed:1.7,", "defeat:S.nA===0&&t>2550&&t<=2900?clamp((t-2550)/350):0,seed:1.7,turn:flee?TURN(t,[2900]):S.melee?TURN(t,[2700,3500]):1,")
rep("c.translate(f.x,f.y);c.scale(f.s*f.face,f.s);\n  if(!f.fall){c.fillStyle='rgba(0,0,0,.28)'", "c.translate(f.x,f.y);c.scale(f.s*f.face*(f.turn??1),f.s);\n  if(!f.fall){c.fillStyle='rgba(0,0,0,.28)'")
rep("function drawSprite(c,f,sh){", "function TURN(t,ts){for(const t0 of ts)if(t>=t0&&t<t0+240){const k=(t-t0)/240;return Math.sign(k-.5)*Math.max(.12,Math.abs(2*k-1))}return 1}\nfunction drawSprite(c,f,sh){")
# ---------------------------------------------------------------- painted fight backgrounds
_a = s.index("  c.fillStyle='rgba(245,200,130,.35)';circ(c,W*.63,GROUND-46,32)")
_b = s.index("  if(ter==='c'){const x0=defSide==='R'?W-250:0")
s = s[:_a] + "  const BI=bgFor(ter,duel);if(BI){if(ter==='c'&&defSide==='L'){c.save();c.translate(W,0);c.scale(-1,1);c.drawImage(BI,-20,-2,840,473);c.restore()}else c.drawImage(BI,-20,-2,840,473);const sh=c.createLinearGradient(0,GROUND,0,H);sh.addColorStop(0,'rgba(20,14,8,.08)');sh.addColorStop(1,'rgba(20,14,8,.3)');c.fillStyle=sh;c.fillRect(0,GROUND,W,H-GROUND)}else{\n" + s[_a:_b] + "  }\n" + s[_b:]
rep("function makeBG(ter,defSide,duel){", """const BGART={plain:'art/bg_plain.jpg',road:'art/bg_road.jpg',forest:'art/bg_forest.jpg',hill:'art/bg_hill.jpg',river:'art/bg_river.jpg',fort:'art/bg_fort.jpg',bridge:'art/bg_bridge.jpg'},BGUSE={'=':'bridge','.':'plain',p:'road',f:'forest',h:'hill',w:'river',c:'fort',duel:'plain'},BGIMG={};
for(const [k,src] of Object.entries(BGART)){const im=new Image();im.src=src;BGIMG[k]=im}
function bgFor(ter,duel){const im=BGIMG[BGUSE[duel?'duel':ter]];return im&&im.complete&&im.naturalWidth?im:null}
function makeBG(ter,defSide,duel){""")
rep("  if(ter==='f'){for(const [x,s] of [[-10,1],[W+12,1.1]])", "  if(ter==='f'&&!BI){for(const [x,s] of [[-10,1],[W+12,1.1]])")
rep("  if(ter==='c'){const x0=defSide", "  if(ter==='c'&&!BI){const x0=defSide")
# ---------------------------------------------------------------- preload sprites before a fight
rep("function playBattle(att,def,r){\n", """function sprLoad(fk){return ['spear','shield','archer','cav','general'].map(t=>{sprSheet(t,fk);return SPIMG[t+'_'+fk]})}
function sprWait(){const ims=[...sprLoad('shu'),...sprLoad(sprFac('x')),...Object.values(BGIMG)];
  const all=Promise.all(ims.map(im=>im.complete?0:new Promise(ok=>{im.addEventListener('load',ok,{once:true});im.addEventListener('error',ok,{once:true})})));
  return Promise.race([all,new Promise(ok=>setTimeout(ok,4000))])}
sprLoad('shu');
async function playBattle(att,def,r){await sprWait();return playBattle0(att,def,r)}
function playBattle0(att,def,r){
""")
rep("function playDuel(P,E){\n", "async function playDuel(P,E){await sprWait();return playDuel0(P,E)}\nfunction playDuel0(P,E){\n")
rep("  G={units:cfg.units.map(", "  setTimeout(()=>sprWait(),0);G={units:cfg.units.map(")
# ---------------------------------------------------------------- drawn U-turn strips (row 0: turn away, row 1: turn back to face)
rep("function TURN(t,ts){", "const TURNSH={spear:1,shield:1,cav:1,archer:1,general:1},TURN_MS=360;\nfunction TURNK(t,ts){for(let i=0;i<ts.length;i++)if(t>=ts[i]&&t<ts[i]+TURN_MS)return [i,(t-ts[i])/TURN_MS];return null}\nfunction TURN(t,ts){")
rep("  else{row=0;const p=Math.floor(now/320+sd*3)%6;fr=[0,1,2,3,2,1][p]}\n  const cv=f.type==='cav'||f.officer,k=(f.officer?84:cv?74:58)/150;c.save();c.globalAlpha=f.alpha??1;c.translate(f.x,f.y);c.scale(f.s*f.face*(f.turn??1),f.s);",
    "  else{row=0;const p=Math.floor(now/320+sd*3)%6;fr=[0,1,2,3,2,1][p]}\n  let dir=f.face*(f.turn??1);\n  if(f.tk&&!f.fall&&!f.officer&&TURNSH[f.type]){const ts=sprSheet(f.type+'_turn',sprFac(f.fac));if(ts){sh=ts;row=f.tk[0];fr=Math.min(3,Math.floor(f.tk[1]*4));dir=f.tf}}\n  const cv=f.type==='cav'||f.officer,k=(f.officer?84:cv?74:58)/150;c.save();c.globalAlpha=f.alpha??1;c.translate(f.x,f.y);c.scale(f.s*dir,f.s);")
rep("seed:s.seed,turn:S.melee&&alive?TURN(t,[2700,3500]):1,", "seed:s.seed,turn:S.melee&&alive?TURN(t,[2700,3500]):1,tk:S.melee&&alive&&TURNSH[S.u.type]?TURNK(t,[2700,3500]):null,tf:S.face,")
rep("function sprLoad(fk){return ['spear','shield','archer','cav','general'].map(", "function sprLoad(fk){return ['spear','shield','archer','cav','general',...Object.keys(TURNSH).map(t=>t+'_turn')].map(")
# general (officer) turn strip: also used for the turn when he flees
rep("  if(f.tk&&!f.fall&&!f.officer&&TURNSH[f.type]){const ts=sprSheet(f.type+'_turn',sprFac(f.fac));",
    "  const tkey=f.officer?'general':f.type;\n  if(f.tk&&!f.fall&&TURNSH[tkey]){const ts=sprSheet(tkey+'_turn',sprFac(f.fac));")
rep("seed:1.7,turn:flee?TURN(t,[2900]):S.melee?TURN(t,[2700,3500]):1,", "seed:1.7,turn:flee?TURN(t,[2900]):S.melee?TURN(t,[2700,3500]):1,tk:flee?TURNK(t,[2900]):S.melee?TURNK(t,[2700,3500]):null,tf:S.face,")
# ---------------------------------------------------------------- painted battle map (ChatGPT textures + objects)
rep("function renderTerrain(T){\n", r"""const MAPART={};{let left=0;const done=()=>{if(--left===0&&typeof G!=='undefined'&&G&&!$('#battleView').hidden){terrainCv=renderTerrain(T)}};
  for(const n of ['tex_grass','tex_road','tex_water','tree1','tree2','tree3','tree4','hill1','hill2','hill3','hill4','rock1','rock2','bush','reeds','fort','bridge','tuft1','tuft2']){left++;const im=new Image();im.onload=im.onerror=done;im.src='maptiles/'+n+(n.startsWith('tex_')?'.jpg':'.png');MAPART[n]=im}}
function mapArtReady(){return Object.values(MAPART).every(im=>im.complete&&im.naturalWidth)}
function renderTerrainArt(T){
  const d=DPR(),W=COLS*T,H=ROWS*T,cv=document.createElement('canvas');cv.width=W*d;cv.height=H*d;const c=cv.getContext('2d');c.setTransform(d,0,0,d,0,0);
  const r=rng(9173+MAP.join('').length+MAP.join('').split('f').length*31);
  const at=(x,y)=>inb(x,y)?MAP[y][x]:null,isW=t=>t==='w'||t==='=',cx=x=>x*T+T/2,cy=y=>y*T+T/2;
  const pat=(k,tiles)=>{const p=c.createPattern(MAPART[k],'repeat');p.setTransform(new DOMMatrix().scale(T*tiles/512));return p};
  c.fillStyle=pat('tex_grass',2.6);c.fillRect(0,0,W,H);
  for(let i=0;i<COLS*ROWS/3;i++){const x=r()*W,y=r()*H,g=c.createRadialGradient(x,y,0,x,y,T*(.6+r()*.9));const dark=r()<.5;g.addColorStop(0,dark?'rgba(30,45,15,.16)':'rgba(255,235,160,.10)');g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(x-T*1.6,y-T*1.6,T*3.2,T*3.2)}
  const net=(test,w,style,ends)=>{c.strokeStyle=style;c.lineWidth=w;c.lineCap='round';c.lineJoin='round';
    for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){if(!test(at(x,y)))continue;c.beginPath();c.moveTo(cx(x),cy(y));c.lineTo(cx(x)+.01,cy(y));c.stroke();
      for(const [dx,dy] of [[1,0],[0,1]])if(test(at(x+dx,y+dy))){c.beginPath();c.moveTo(cx(x),cy(y));c.lineTo(cx(x+dx),cy(y+dy));c.stroke()}
      for(const [ex,ey,tx,ty] of ends(x,y)){c.beginPath();c.moveTo(cx(x),cy(y));c.lineTo(tx,ty);c.stroke()}}};
  const rEnds=(x,y)=>{const e=[];if(y===0)e.push([0,0,cx(x),0]);if(y===ROWS-1)e.push([0,0,cx(x),H]);if(x===0)e.push([0,0,0,cy(y)]);if(x===COLS-1)e.push([0,0,W,cy(y)]);return e};
  net(isW,T*1.04,'rgba(50,40,20,.35)',rEnds);net(isW,T*.94,pat('tex_road',2.2),rEnds);net(isW,T*.8,pat('tex_water',2.4),rEnds);net(isW,T*.8,'rgba(10,40,60,.12)',rEnds);
  const isR=t=>t==='p'||t==='='||t==='c',rd=t=>t==='p'||t==='=';
  const dEnds=(x,y)=>{const e=[];if(x===0)e.push([0,0,0,cy(y)]);if(x===COLS-1)e.push([0,0,W,cy(y)]);return e};
  const roadNet=(w,style)=>{c.strokeStyle=style;c.lineWidth=w;c.lineCap='round';c.lineJoin='round';for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){if(!rd(at(x,y)))continue;c.beginPath();c.moveTo(cx(x),cy(y));c.lineTo(cx(x)+.01,cy(y));c.stroke();
      for(const [dx,dy] of [[1,0],[0,1]])if(isR(at(x+dx,y+dy))){c.beginPath();c.moveTo(cx(x),cy(y));c.lineTo(cx(x+dx),cy(y+dy));c.stroke()}
      for(const [dx,dy] of [[-1,0],[0,-1]])if(at(x+dx,y+dy)==='c'){c.beginPath();c.moveTo(cx(x),cy(y));c.lineTo(cx(x+dx),cy(y+dy));c.stroke()}
      for(const [,,tx,ty] of dEnds(x,y)){c.beginPath();c.moveTo(cx(x),cy(y));c.lineTo(tx,ty);c.stroke()}}};
  roadNet(T*.6,'rgba(60,42,20,.35)');roadNet(T*.5,pat('tex_road',2));
  const spr=(k,x,yb,w)=>{const im=MAPART[k],h=w*im.naturalHeight/im.naturalWidth;c.drawImage(im,x-w/2,yb-h,w,h)};
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++)if(at(x,y)==='='){const vert=isW(at(x-1,y))||isW(at(x+1,y));c.save();c.translate(cx(x),cy(y));if(vert)c.rotate(Math.PI/2);spr('bridge',0,T*.42,T*1.42);c.restore()}
  const props=[];
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){const t=at(x,y);
    if(t==='f'){c.fillStyle='rgba(20,35,10,.28)';c.beginPath();c.ellipse(cx(x),cy(y)+T*.12,T*.5,T*.36,0,0,Math.PI*2);c.fill();props.push({k:'tree'+(1+Math.floor(r()*4)),x:cx(x)+(r()-.5)*T*.08,y:y*T+T*1.02,w:T*(1.12+r()*.1)})}
    else if(t==='h')props.push({k:'hill'+(1+Math.floor(r()*4)),x:cx(x),y:y*T+T*.98,w:T*1.1})
    else if(t==='c')props.push({k:'fort',x:cx(x),y:y*T+T*1.0,w:T*1.3})
    else if(t==='.'&&r()<.16){const k=['tuft1','tuft2','bush','rock2','reeds'][Math.floor(r()*5)];props.push({k,x:x*T+T*(.25+r()*.5),y:y*T+T*(.45+r()*.45),w:T*(k==='tuft1'||k==='tuft2'?.32:.42)})}
    else if(t==='w'&&r()<.25&&!isW(at(x-1,y)))props.push({k:'reeds',x:x*T+T*.12,y:y*T+T*(.5+r()*.4),w:T*.38})}
  props.sort((a,b)=>a.y-b.y);for(const p of props)spr(p.k,p.x,p.y,p.w);
  c.strokeStyle='rgba(0,0,0,.16)';c.lineWidth=1;for(let i=1;i<COLS;i++)ln(c,i*T+.5,0,i*T+.5,H);for(let j=1;j<ROWS;j++)ln(c,0,j*T+.5,W,j*T+.5);
  const v=c.createRadialGradient(W/2,H/2,Math.min(W,H)*.4,W/2,H/2,Math.max(W,H)*.75);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.32)');c.fillStyle=v;c.fillRect(0,0,W,H);
  return cv}
function renderTerrain(T){
  if(mapArtReady())return renderTerrainArt(T);
""")

# ---------------------------------------------------------------- scrolling camera: drag to pan, auto-centre on the acting unit
rep("function loop(now){drawMap(now);requestAnimationFrame(loop)}", r"""function loop(now){drawMap(now);requestAnimationFrame(loop)}
let camFocus=null;
function focusUnit(u,instant){const bm=$('.bmap');if(!bm||!u)return;const wrap=$('.mapwrap'),pl=parseFloat(wrap.style.paddingLeft)||0,pt=parseFloat(wrap.style.paddingTop)||0;
  bm.scrollTo({left:pl+u.x*T+T/2-bm.clientWidth/2,top:pt+u.y*T+T/2-bm.clientHeight/2,behavior:instant?'auto':'smooth'})}
{const bm=$('.bmap');let d=null;
  bm.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0)return;d={x:e.clientX,y:e.clientY,sl:bm.scrollLeft,st:bm.scrollTop,moved:false}});
  addEventListener('pointermove',e=>{if(!d)return;const dx=e.clientX-d.x,dy=e.clientY-d.y;if(!d.moved&&Math.hypot(dx,dy)>6){d.moved=true;bm.classList.add('drag')}if(d.moved){bm.scrollLeft=d.sl-dx;bm.scrollTop=d.st-dy}});
  addEventListener('pointerup',()=>{if(d&&d.moved){bm.dataset.dragged='1';setTimeout(()=>delete bm.dataset.dragged,0)}d=null;bm.classList.remove('drag')});
  addEventListener('resize',()=>{if(G&&!$('#battleView').hidden){resizeMap();const f=G.sel||G.view;if(f)focusUnit(f,true)}})}""")
rep("MC.addEventListener('click',e=>{\n  if(G.phase!=='player'||G.busy||G.over)return;", "MC.addEventListener('click',e=>{\n  if($('.bmap').dataset.dragged)return;\n  if(G.phase!=='player'||G.busy||G.over)return;")
rep("function updateUI(){\n  $('#turn').textContent=", "function updateUI(){\n  {const f=G.sel||G.view;if(f&&f!==camFocus){camFocus=f;focusUnit(f)}}\n  $('#turn').textContent=")
# Langrisser-style bold move / attack-range squares
rep("  if(G.mode==='select'&&G.reach){c.fillStyle='rgba(120,175,235,.36)';for(const t of G.reach.tiles)c.fillRect(t.x*T+1,t.y*T+1,T-2,T-2)}",
    "  const hl=(t,f,s)=>{rr(c,t.x*T+3,t.y*T+3,T-6,T-6,T*.12);c.fillStyle=f;c.fill();c.lineWidth=2;c.strokeStyle=s;c.stroke()};\n  if(G.mode==='select'&&G.reach){for(const t of G.reach.tiles)hl(t,'rgba(60,120,255,.34)','rgba(150,195,255,.85)')}")
rep("  if(G.rangeTiles&&G.mode==='select'){c.fillStyle='rgba(205,70,50,.16)';for(const t of G.rangeTiles)c.fillRect(t.x*T+1,t.y*T+1,T-2,T-2)}",
    "  if(G.rangeTiles&&G.mode==='select'){for(const t of G.rangeTiles)hl(t,'rgba(235,60,50,.30)','rgba(255,140,120,.85)')}")
rep("'Tap a <b>blue square</b> to move · tap the general again to act here · tap a <b>red enemy</b> to attack'", "'<b>Blue</b>: move · tap the general again to act here · <b>red</b>: attack'")
# defenders always meet the attack on screen when the attacker is in their reach (even if they are wiped out)
rep("  await playBattle(a,d,{aB,dB,dmg,ctr,ctrOn,ranged,", "  const ctrVis=!o.noCounter&&(o.forceCounter||inRange(d.type,dist));\n  await playBattle(a,d,{aB,dB,dmg,ctr,ctrOn:ctrOn||ctrVis,ranged,")
# no red range squares on top of my own units
rep("if(!inb(x,y)||rs.has(x+','+y)||terAt(x,y)==='w')continue;out.set", "if(!inb(x,y)||rs.has(x+','+y)||terAt(x,y)==='w'){continue}{const o=unitAt(x,y);if(o&&o.side==='shu')continue}out.set")
# simultaneous combat: the defender always strikes back (if the attacker is in its reach), with the men who
# fought before falling (average of troops before and after the hit) - even when the unit is wiped out
rep("  const take=!o.noCounter&&left>0&&inRange(d.type,dist)?Math.min(a.troops,Math.round(tf(d)*dmgCalc(d.type,d.war,left,",
    "  const take=!o.noCounter&&inRange(d.type,dist)?Math.min(a.troops,Math.round(tf(d)*dmgCalc(d.type,d.war,(d.troops+left)/2,")
rep("let ctr=0;const ctrOn=!o.noCounter&&d.troops>0&&(o.forceCounter||inRange(d.type,dist));\n  if(ctrOn){ctr=Math.min(a.troops,Math.round(tf(d)*dmgCalc(d.type,d.war,d.troops,",
    "let ctr=0;const ctrOn=!o.noCounter&&(o.forceCounter||inRange(d.type,dist));\n  if(ctrOn){ctr=Math.min(a.troops,Math.round(tf(d)*dmgCalc(d.type,d.war,(dB+d.troops)/2,")
rep("const left=p.troops-deal,take=left>0&&inRange(p.type,dist)?tf(p)*dmgCalc(p.type,p.war,left,",
    "const left=p.troops-deal,take=inRange(p.type,dist)?tf(p)*dmgCalc(p.type,p.war,(p.troops+left)/2,")
# ---------------------------------------------------------------- cavalry Charge: gallop in, slow-motion through the enemy ranks, accelerate out
rep("function sX(s,S,t){if(!S.melee)return s.hx;", """function chargePlan(S,O){const f=S.face,pr=x=>f*x,ox=[...O.sol.map(s=>s.hx),O.off.hx].map(pr),mine=[...S.sol.map(s=>s.hx),S.off.hx].map(pr);
  const Ef=Math.min(...ox),Er=Math.max(...ox),fr=Math.max(...mine),bk=Math.min(...mine);S.ch={f,Ef,Er,Dc:Ef-24-fr,Dp:Er+24-fr,Df:Er+60-bk}}
function chD(S,t){const c=S.ch;if(t<600)return 0;if(t<1050)return lerp(0,c.Dc,(t-600)/450);if(t<2300)return lerp(c.Dc,c.Dp,(t-1050)/1250);if(t<3200){const k=(t-2300)/900;return lerp(c.Dp,c.Df,k*k)}return c.Df}
function sX(s,S,t){if(S.ch)return s.hx+S.ch.f*chD(S,t);if(!S.melee)return s.hx;""")
rep("if(r.charge){const S=att===L?SL:SR;for(const s of S.sol)s.tx=S.side==='L'?W-110-s.col*58-(s.row%2)*10:110+s.col*58+(s.row%2)*10;S.off.tx=S.side==='L'?W-60:60}",
    "if(r.charge){const S=att===L?SL:SR,O=S===SL?SR:SL;for(const s of O.sol)s.tx=s.hx;O.off.tx=O.off.hx;O.hold=true;chargePlan(S,O)}")
rep("if(S.melee&&alive){if(t>600&&t<1500)run=t*.03+s.seed;",
    "let chf=false;if(S.ch&&alive){const p=S.ch.f*x;chf=t>600&&t<3200&&p>=S.ch.Ef-24&&p<=S.ch.Er+24;if(chf)sw=(Math.sin(t*.012+s.seed*3)+1)/2;else if(t>600&&t<3200)run=t*(t>2300?.05:.034)+s.seed}else if(S.melee&&alive){if(t>600&&t<1500)run=t*.03+s.seed;")
rep("if(S.melee&&alive&&t>1500&&t<2700&&Math.random()", "if((S.ch?chf:S.melee&&alive&&t>1500&&t<2700)&&Math.random()")
rep("fight:S.melee&&alive&&t>=1500&&t<=2700,seed:s.seed,turn:S.melee&&alive?TURN(t,[2700,3500]):1,tk:S.melee&&alive&&TURNSH[S.u.type]?TURNK(t,[2700,3500]):null,",
    "fight:S.ch?chf:S.hold?alive&&t>=1050&&t<=2500:S.melee&&alive&&t>=1500&&t<=2700,slow:chf,seed:s.seed,turn:S.melee&&alive&&!S.ch&&!S.hold?TURN(t,[2700,3500]):1,tk:S.melee&&alive&&!S.ch&&!S.hold&&TURNSH[S.u.type]?TURNK(t,[2700,3500]):null,")
rep("if(S.melee&&!flee){if(t>600&&t<1500)orun=t*.03+1;",
    "let ochf=false;if(S.ch&&!flee){const p=S.ch.f*ox;ochf=t>600&&t<3200&&p>=S.ch.Ef-24&&p<=S.ch.Er+24;if(ochf)osw=(Math.sin(t*.012)+1)/2;else if(t>600&&t<3200)orun=t*(t>2300?.05:.034)+1}else if(S.melee&&!flee&&!S.hold){if(t>600&&t<1500)orun=t*.03+1;")
rep("fight:S.melee&&!flee&&t>=1500&&t<=2700,defeat:", "fight:S.ch?ochf:S.hold?!flee&&t>=1050&&t<=2500:S.melee&&!flee&&t>=1500&&t<=2700,slow:ochf,defeat:")
rep("turn:flee?TURN(t,[2900]):S.melee?TURN(t,[2700,3500]):1,tk:flee?TURNK(t,[2900]):S.melee?TURNK(t,[2700,3500]):null,",
    "turn:flee?TURN(t,[2900]):S.melee&&!S.ch&&!S.hold?TURN(t,[2700,3500]):1,tk:flee?TURNK(t,[2900]):S.melee&&!S.ch&&!S.hold?TURNK(t,[2700,3500]):null,")
rep("else if(f.fight){row=2;fr=Math.floor(now/120+sd*5)%4}", "else if(f.fight){row=2;fr=Math.floor(now/(f.slow?220:120)+sd*5)%4}")
# ---------------------------------------------------------------- charge: camera pans past the enemy; cavalry pull up with a gap, then wheel round
rep("const Ef=Math.min(...ox),Er=Math.max(...ox),fr=Math.max(...mine),bk=Math.min(...mine);S.ch={f,Ef,Er,Dc:Ef-24-fr,Dp:Er+24-fr,Df:Er+60-bk}}",
    "const Ef=Math.min(...ox),Er=Math.max(...ox),fr=Math.max(...mine),bk=Math.min(...mine),Df=Er+125-bk,xf=f*(fr+Df);\n  S.ch={f,Ef,Er,Dc:Ef-24-fr,Dp:Er+24-fr,Df,cam:f===1?Math.max(0,xf-(W-185)):-Math.max(0,185-xf)}}\nfunction chCam(S,t){return !S||t<1050?0:lerp(0,S.ch.cam,ease(clamp((t-1050)/2350)))}")
rep("if(t<3200){const k=(t-2300)/900;return lerp(c.Dp,c.Df,k*k)}return c.Df}", "if(t<3400)return lerp(c.Dp,c.Df,ease((t-2300)/1100));return c.Df}")
rep("const c=sctx;c.drawImage(bg,0,0,W,H);const items=[];",
    "const c=sctx,CS=SL.ch?SL:SR.ch?SR:null,cam=chCam(CS,t);\n      if(cam){const bx=-cam*.5;c.drawImage(bg,bx,0,W,H);c.save();c.translate(cam>0?bx+2*W:bx,0);c.scale(-1,1);c.drawImage(bg,0,0,W,H);c.restore()}else c.drawImage(bg,0,0,W,H);\n      c.save();c.translate(-cam,0);const items=[];")
rep("      stepParts(c,dt);\n      drawFightHud(", "      stepParts(c,dt);c.restore();\n      drawFightHud(")
# soldiers
rep("chf=t>600&&t<3200&&p>=S.ch.Ef-24&&p<=S.ch.Er+24;if(chf)sw=(Math.sin(t*.012+s.seed*3)+1)/2;else if(t>600&&t<3200)run=t*(t>2300?.05:.034)+s.seed}",
    "chf=t>600&&t<3400&&p>=S.ch.Ef-24&&p<=S.ch.Er+24;if(chf)sw=(Math.sin(t*.012+s.seed*3)+1)/2;else if(t>600&&t<3300)run=t*(t>2300?.05:.034)+s.seed;if(t>=3450+TURN_MS)face=-S.face}")
rep("tk:S.melee&&alive&&!S.ch&&!S.hold&&TURNSH[S.u.type]?TURNK(t,[2700,3500]):null,", "tk:S.ch?(alive&&t>=3450&&t<3450+TURN_MS?[0,(t-3450)/TURN_MS]:null):S.melee&&alive&&!S.ch&&!S.hold&&TURNSH[S.u.type]?TURNK(t,[2700,3500]):null,")
# officer
rep("ochf=t>600&&t<3200&&p>=S.ch.Ef-24&&p<=S.ch.Er+24;if(ochf)osw=(Math.sin(t*.012)+1)/2;else if(t>600&&t<3200)orun=t*(t>2300?.05:.034)+1}",
    "ochf=t>600&&t<3400&&p>=S.ch.Ef-24&&p<=S.ch.Er+24;if(ochf)osw=(Math.sin(t*.012)+1)/2;else if(t>600&&t<3300)orun=t*(t>2300?.05:.034)+1;if(t>=3450+TURN_MS)oface=-S.face}")
rep("tk:flee?TURNK(t,[2900]):S.melee&&!S.ch&&!S.hold?TURNK(t,[2700,3500]):null,", "tk:flee?TURNK(t,[2900]):S.ch?(t>=3450&&t<3450+TURN_MS?[0,(t-3450)/TURN_MS]:null):S.melee&&!S.ch&&!S.hold?TURNK(t,[2700,3500]):null,")
# ---------------------------------------------------------------- after moving, keep the full move range from the starting square (fix a mis-tap)
rep("function bestAttackTile(s,e){", """function reachFrom(s,o){const x=s.x,y=s.y;s.x=o.x;s.y=o.y;const R=reach(s);s.x=x;s.y=y;return R}
function movePath(s,x,y){if(s.x===G.origin.x&&s.y===G.origin.y)return pathTo(G.reach,s,x,y);const R=reach(s);return R.tiles.some(t=>t.x===x&&t.y===y)?pathTo(R,s,x,y):[{x,y}]}
function bestAttackTile(s,e){""")
rep("-pathTo(G.reach,s,t.x,t.y).length*3;", "-pathTo(G.reach,s,t.x,t.y).length*3+(t.x===s.x&&t.y===s.y?40:0);")
rep("  if(G.mode==='moved')return en.filter(e=>inRange(s.type,manh(s,e)));\n  if(G.mode==='select'&&G.reach)", "  if(G.mode==='moved'&&!G.reach)return en.filter(e=>inRange(s.type,manh(s,e)));\n  if((G.mode==='select'||G.mode==='moved')&&G.reach)")
rep("  if(G.mode==='select'&&G.reach){for(const t of G.reach.tiles)hl(", "  if((G.mode==='select'||G.mode==='moved')&&G.reach){for(const t of G.reach.tiles)if(!(G.mode==='moved'&&t.x===G.sel.x&&t.y===G.sel.y))hl(")
rep("  if(G.rangeTiles&&G.mode==='select'){", "  if(G.rangeTiles&&(G.mode==='select'||G.mode==='moved')){")
rep("G.rangeTiles=null;if(G.sel&&G.mode==='select'&&G.reach){", "G.rangeTiles=null;if(G.sel&&(G.mode==='select'||G.mode==='moved')&&G.reach){")
rep("G.mode==='moved'?'Tap a <b>red enemy</b> or pick an action'", "G.mode==='moved'?'<b>Blue</b>: move somewhere else · <b>red</b>: attack · or pick an action'")
rep("  if(G.mode==='moved')return;\n", "  if(G.mode==='moved'&&G.sel&&G.reach&&!(x===G.sel.x&&y===G.sel.y)&&!u&&G.reach.tiles.some(t=>t.x===x&&t.y===y)){moveSel(x,y);return}\n  if(G.mode==='moved')return;\n")
rep("async function moveSel(x,y){const s=G.sel;G.busy=true;G.mode='busy';updateUI();await animateMove(s,pathTo(G.reach,s,x,y));G.busy=false;G.mode='moved';updateUI()}",
    "async function moveSel(x,y){const s=G.sel;G.busy=true;G.mode='busy';updateUI();await animateMove(s,movePath(s,x,y));G.busy=false;G.mode='moved';G.reach=reachFrom(s,G.origin);updateUI()}")
rep("async function moveThenAttack(s,u,t){G.busy=true;G.mode='busy';updateUI();await animateMove(s,pathTo(G.reach,s,t.x,t.y));", "async function moveThenAttack(s,u,t){G.busy=true;G.mode='busy';updateUI();if(t.x!==s.x||t.y!==s.y)await animateMove(s,movePath(s,t.x,t.y));")
# ---------------------------------------------------------------- unit-type badge: big character on a faction disc
rep("  c.fillStyle=F.dark;circ(c,s*.33,-s*.3,s*.15);c.fill();drawGlyph(c,u.type,s*.33,-s*.3,s*.12);",
    """  {const bx=s*.44,by=-s*.42,br=s*.215;c.fillStyle='rgba(0,0,0,.45)';circ(c,bx+1,by+2,br+1);c.fill();
   c.fillStyle=F.main;circ(c,bx,by,br);c.fill();c.lineWidth=Math.max(1.6,s*.035);c.strokeStyle='#e8c25e';c.stroke();
   c.fillStyle='#fff6e2';c.font=`900 ${Math.round(br*1.3)}px "Noto Serif TC","Songti TC",serif`;c.textAlign='center';c.textBaseline='middle';
   c.fillText(({spear:'槍',shield:'盾',archer:'弓',cav:'騎'})[u.type]||'兵',bx,by+br*.06)}""")
# ---------------------------------------------------------------- commander pick button (march dialog)
rep('@media (prefers-reduced-motion:reduce){*{scroll-behavior:auto}}', '''.cmdpick{margin-left:auto;flex:none;width:34px;height:34px;min-height:0;padding:0;border-radius:50%;font:900 17px/1 var(--f-zh);color:#a6977a;background:#211a12;border:2px solid #4a3d2a}
.spin{margin-left:auto;flex:none;display:flex;align-items:center;gap:4px}
.spin button{width:32px;height:32px;min-height:0;padding:0;border-radius:8px;font:700 20px/1 var(--f-ui,sans-serif);color:#f3dc9a;background:#2a2116;border:2px solid #6b5636}
.spin button:disabled{opacity:.35}
.spin b{min-width:52px;text-align:center;font-variant-numeric:tabular-nums;color:#f3dc9a}
.spin+.cmdpick{margin-left:6px}
.mtot{display:flex;flex-direction:column;gap:2px}.mtot small{color:var(--muted)}
.city .cic{position:relative;display:block;isolation:isolate;margin-bottom:1px}
.city .cic img{display:block;width:100%;height:auto;filter:drop-shadow(0 2px 2px rgba(0,0,0,.55))}
.city .cic::after{content:'';position:absolute;left:8%;right:8%;bottom:-3px;height:7px;border-radius:50%;background:var(--fc);opacity:.85;z-index:-1;filter:blur(1.5px)}
.city.sel .cic img{filter:drop-shadow(0 0 4px var(--gold)) drop-shadow(0 0 2px var(--gold))}
.city{min-height:0}
#monthFx{position:fixed;inset:0;z-index:300;display:grid;place-items:center;pointer-events:none;background:radial-gradient(ellipse at center,rgba(10,8,5,.75),rgba(10,8,5,0) 70%);animation:mfxBg 1.05s ease forwards}
#monthFx .mfx{display:flex;align-items:center;gap:16px;padding:14px 28px 14px 20px;background:linear-gradient(#2a2016,#17120c);border:2px solid #8a6d38;border-radius:12px;box-shadow:0 10px 40px rgba(0,0,0,.6);animation:mfxIn 1.05s cubic-bezier(.2,.8,.2,1) forwards}
#monthFx b{font:900 56px/1 var(--f-zh);text-shadow:0 0 14px currentColor}
#monthFx div div{display:flex;flex-direction:column;gap:4px}
#monthFx i{font:900 30px/1 var(--f-zh);font-style:normal;color:#f3dc9a;letter-spacing:4px}
#monthFx span{font-size:15px;color:#d8c8a4}
@keyframes mfxBg{0%{opacity:0}20%{opacity:1}75%{opacity:1}100%{opacity:0}}
@keyframes mfxIn{0%{opacity:0;transform:translateY(24px) scale(.9)}22%{opacity:1;transform:none}75%{opacity:1;transform:none}100%{opacity:0;transform:translateY(-16px) scale(1.03)}}
@media (prefers-reduced-motion:reduce){#monthFx,#monthFx .mfx{animation-duration:1.05s;animation-timing-function:steps(1,end)}}
.rtabs{display:flex;gap:6px;margin-top:6px}
.rtabs button{flex:1;min-height:34px;padding:4px 8px;font:700 13px/1 var(--f-body);letter-spacing:.06em;text-transform:uppercase;color:#a6977a;background:#1c160f;border:1px solid #4a3d2a;border-radius:8px}
.rtabs button.on{color:#f3dc9a;border-color:#8a6d38;background:#2a2116}
.rtabs .dot{display:inline-grid;place-items:center;width:16px;height:16px;margin-left:4px;border-radius:50%;background:#c4473a;color:#fff;font:800 11px/1 sans-serif;font-style:normal}
.foes{display:flex;flex-direction:column;gap:8px;font-size:12.5px}
.foes .fsub{margin:0;font-size:11.5px}
.foe{border-left:3px solid #4a3d2a;padding-left:8px}
.foeh{display:flex;align-items:center;gap:6px}.foeh i{width:10px;height:10px;border-radius:2px;transform:rotate(45deg)}.foeh b{color:var(--paper)}.foeh small{color:var(--muted);margin-left:auto;font-variant-numeric:tabular-nums}
.foe ul{list-style:none;margin:3px 0 0;padding:0;display:flex;flex-direction:column;gap:2px;color:#cbbd9c}
.foe li.threat{color:#ff9b8c;font-weight:600}
#actFx{position:fixed;inset:0;z-index:290;display:flex;align-items:flex-end;justify-content:center;padding:0 16px max(18px,env(safe-area-inset-bottom));background:linear-gradient(rgba(8,6,4,.45),rgba(8,6,4,.88) 55%);animation:afIn .2s ease;cursor:pointer}
#actFx.leave{opacity:0;transition:opacity .18s}
#actFx .afx{display:flex;align-items:flex-end;gap:14px;width:min(720px,100%);}
#actFx .afp{width:clamp(110px,24vh,190px);aspect-ratio:2/3;object-fit:cover;object-position:50% 15%;border-radius:12px;border:2px solid #8a6d38;box-shadow:0 8px 30px rgba(0,0,0,.6);animation:afSlide .3s cubic-bezier(.2,.8,.2,1);flex:none;background:#2a2116}
#actFx .afx0{display:grid;place-items:center;font:900 64px/1 var(--f-zh);color:#f3dc9a}
#actFx .afr{flex:1;min-width:0;display:flex;flex-direction:column;gap:8px;margin-bottom:8px;animation:afUp .3s .05s cubic-bezier(.2,.8,.2,1) both}
#actFx .afh{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
#actFx .afk{display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:var(--gold);color:#1a140c;font:900 19px/1 var(--f-zh)}
#actFx .afh{align-self:flex-start;padding:4px 12px 4px 4px;border-radius:22px;background:rgba(20,16,10,.92);border:1px solid #4a3d2a}#actFx .afh b{font-size:19px;color:#f3e6c4}#actFx .afh small{color:var(--muted);font-size:13px}
#actFx .afb{position:relative;padding:12px 16px;background:#f3e6c4;color:#241a10;border-radius:14px;font:600 17px/1.35 var(--f-body);box-shadow:0 6px 20px rgba(0,0,0,.45)}
#actFx .afb::before{content:'';position:absolute;left:-9px;bottom:16px;border:9px solid transparent;border-right-color:#f3e6c4;border-left:0}
#actFx .aft{display:block;transition:opacity .12s}#actFx .aft.out{opacity:0}
#actFx .afres{align-self:flex-start;padding:6px 12px;border-radius:8px;background:#2c5a34;border:1px solid #86cc90;color:#e6f6e8;font:700 14.5px/1.3 var(--f-body);animation:afPop .3s cubic-bezier(.3,1.6,.5,1)}
#actFx .afres.bad{background:#4a2a20;border-color:#a3725f;color:#f0d4c8}
#actFx .afskip{color:#8f8064;font-size:11.5px}
@keyframes afIn{from{opacity:0}}@keyframes afSlide{from{opacity:0;transform:translateX(-40px)}}@keyframes afUp{from{opacity:0;transform:translateY(14px)}}@keyframes afPop{from{opacity:0;transform:scale(.7)}}
@media (prefers-reduced-motion:reduce){#actFx,#actFx *{animation:none!important}}
.msum .reinf{display:block;color:#e8a05f;font-size:11.5px;font-weight:600}
.destbtn{display:grid;grid-template-columns:auto 1fr auto;grid-template-rows:auto auto;column-gap:10px;align-items:center;width:100%;text-align:left;padding:10px 14px;border-radius:10px;background:#211a12;border:1px solid #6b5636;color:var(--paper)}
.destbtn i{grid-row:1/3;width:14px;height:14px;transform:rotate(45deg);border-radius:2px}.destbtn b{font-size:17px}.destbtn small{grid-column:2;color:var(--muted);font-size:12.5px}.destbtn em{grid-row:1/3;grid-column:3;font-style:normal;color:var(--gold);font-weight:700;font-size:13px}
.destbtn.empty{border-style:dashed;border-color:var(--gold);background:#2a2116;animation:autoPulse 1.6s ease-in-out infinite}.destbtn .dmap{grid-row:1/3;font-size:22px}
.mrow .lbl{font-size:13px;color:var(--muted)}
#destPick{position:fixed;inset:0;z-index:60;display:flex;flex-direction:column;background:#0b0a08;padding:8px max(8px,env(safe-area-inset-right)) 8px max(8px,env(safe-area-inset-left))}
#destPick .pkbar{display:flex;align-items:center;gap:10px;padding:2px 4px 8px}#destPick .pkbar b{font:700 18px/1 var(--f-head,serif);color:#f3e6c4}#destPick .pkbar .iconbtn{margin-left:auto;min-width:44px;min-height:40px}
#destPick .pkbody{flex:1;min-height:0;display:flex;gap:10px;align-items:flex-start;justify-content:center}
#destPick .pkmap{flex:none;width:min(calc(100vw - 300px),calc((100dvh - 70px)*1.5));max-width:none}
#destPick .pkinfo{flex:1;min-width:220px;max-width:320px;align-self:stretch;overflow:auto;background:#17120c;border:1px solid #4a3d2a;border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:10px}
@media (max-aspect-ratio:4/3){#destPick .pkbody{flex-direction:column;align-items:center}#destPick .pkmap{width:min(100%,calc((100dvh - 330px)*1.5))}#destPick .pkinfo{max-width:none;width:100%}}
.pkroutes{position:absolute;inset:0;width:100%;height:100%}.pkroutes line{stroke:#f3dc9a;stroke-width:2.4;stroke-dasharray:6 5;vector-effect:non-scaling-stroke;animation:pkDash 1s linear infinite}.pkroutes line.foe{stroke:#ff9b8c}.pkroutes line.long{stroke-dasharray:2 6}
@keyframes pkDash{to{stroke-dashoffset:-11}}
.pkcities .city.dim{opacity:.42;filter:grayscale(.7)}
.pkcities .city.pickable .cic::before{content:'';position:absolute;left:50%;top:55%;width:150%;aspect-ratio:2/1;transform:translate(-50%,-50%);border-radius:50%;border:2px solid #f3dc9a;box-shadow:0 0 12px #f3dc9a;animation:pkRing 1.2s ease-in-out infinite;z-index:-1}
.pkcities .city.sel .cic::before{border-color:#fff;box-shadow:0 0 16px #fff;animation:none}
.pkcities .city .here{font-style:normal;font-size:10px;color:#86cc90;font-weight:700}
@keyframes pkRing{50%{opacity:.35;transform:translate(-50%,-50%) scale(1.12)}}
.pkhead{display:flex;align-items:center;gap:10px}.pkzh{font:900 34px/1 var(--f-zh)}.pkhead b{display:block;font-size:20px;color:#f3e6c4}.pkhead small{font-size:13px;font-weight:600}
.pkstats{display:grid;grid-template-columns:1fr 1fr;gap:6px}.pkstats div{background:#211a12;border-radius:8px;padding:6px 8px;display:flex;flex-direction:column}.pkstats span{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}.pkstats b{font-size:16px;font-variant-numeric:tabular-nums}.pkstats small{font-size:11px;color:var(--muted)}.pkstats .reinf{color:#e8a05f;font-weight:600}
.pkgens{display:flex;flex-wrap:wrap;gap:4px}.pkgens span{font-size:12.5px;padding:3px 8px;border-radius:12px;background:#211a12;border:1px solid #4a3d2a}.pkgens i{font-style:normal;color:var(--gold)}
.pkbtns{display:flex;gap:8px;margin-top:auto}.pkbtns button{flex:1;min-height:42px}
.pkhint{margin:0}
.meet{margin:0;padding:6px 10px;border-radius:8px;background:#3a1f18;border:1px solid #a3554a;color:#ffc4b8;font-size:13px;font-weight:600}
.dipl{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:6px}.dipl button{display:flex;flex-direction:column;align-items:center;gap:1px;padding:6px;min-height:58px}.dipl small{font-size:11px;color:var(--muted)}
.envrow{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:4px 0}.envrow>span{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.06em}.envrow button{min-height:34px;padding:4px 10px;font-size:13px}.envrow button.on{border-color:var(--gold);color:#f3dc9a;background:#2a2116}.envrow i{font-style:normal;color:var(--muted);font-size:11.5px}
.tlist{display:flex;flex-direction:column;gap:6px;max-height:40vh;overflow:auto}.tlist button{display:grid;grid-template-columns:auto 1fr auto;grid-template-rows:auto auto;column-gap:10px;align-items:center;text-align:left;padding:6px 10px}
.tlist button>:first-child{grid-row:1/3}.tlist b{font-size:15px}.tlist small{grid-column:2;color:var(--muted);font-size:12px}.tlist em{grid-row:1/3;grid-column:3;font-style:normal;font-weight:800;font-size:18px;color:#f3dc9a}
.bigp{font-size:16px;margin:4px 0}.bigp b{font-size:22px;color:#f3dc9a}
.ohead,.orow{grid-template-columns:36px minmax(0,1fr) repeat(5,27px) 56px}
.orow .loy.warn{color:#e8a05f;font-weight:700}.orow .loy.risk{color:#ff8a7a;font-weight:800}
#threatBar{display:flex;flex-direction:column;gap:4px;padding:6px max(16px,env(safe-area-inset-left)) 0}
#threatBar button{display:block;width:100%;text-align:left;min-height:34px;padding:6px 12px;border-radius:8px;background:#3a1f18;border:1px solid #a3554a;color:#ffd6cc;font-size:13.5px;line-height:1.3}
#threatBar button.soon{background:#5a2018;border-color:#e88b7f;animation:autoPulse 1.4s ease-in-out infinite}
#threatBar b{color:#fff}
.dpick button.on{border-color:var(--gold);background:#2a2116}.dpick em{color:var(--gold)}
.slots button{display:flex!important;justify-content:space-between;align-items:center;gap:10px;min-height:56px}.slots .sl{display:flex;flex-direction:column;gap:3px;min-width:0}.slots .sl small{color:var(--muted);font-size:12.5px}.slots em{font-size:14px!important}
.dpick{max-height:46vh}
.welc{display:flex;gap:16px;align-items:flex-start}.welcp{width:clamp(110px,22vh,170px);aspect-ratio:2/3;object-fit:cover;object-position:50% 15%;border-radius:12px;border:2px solid #8a6d38;flex:none;box-shadow:0 8px 24px rgba(0,0,0,.5)}
.welct{flex:1;min-width:0}.welct h2{margin:2px 0 4px}.welck{font-size:12px;letter-spacing:.08em;color:var(--gold);font-weight:700}
.welct blockquote{margin:10px 0;padding:10px 14px;background:#f3e6c4;color:#241a10;border-radius:12px;font:600 16px/1.4 var(--f-body)}
.warnc{color:#e8a05f}
.mvrow{display:grid;grid-template-columns:1.3fr 1fr;gap:6px}.mvrow button{min-height:48px}
.durrow{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin:4px 0 6px}.durrow>span{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.06em}.durrow button{min-height:34px;padding:4px 10px;font-size:13px}.durrow button.on{border-color:var(--gold);color:#f3dc9a;background:#2a2116}
.gst.asg{color:#9cc4e8;border-color:#5a7a9a}.asgt{color:#9cc4e8;font-weight:600}
.govcard{padding:10px 12px;border-radius:10px;background:#1c2418;border:1px solid #4f9a5a;display:flex;flex-direction:column;gap:3px;margin-bottom:6px}.govcard b{color:#f3e6c4}.govcard small{color:var(--muted)}
.tipbox{position:fixed;z-index:400;max-width:280px;padding:8px 12px;border-radius:10px;background:#f3e6c4;color:#241a10;font:500 13.5px/1.4 var(--f-body);box-shadow:0 6px 20px rgba(0,0,0,.5);pointer-events:none}.tipbox b{display:block;font-size:12px;letter-spacing:.05em;text-transform:uppercase;color:#7a5a2a}
[data-tip]{-webkit-touch-callout:none}
.sumlist{list-style:none;margin:0 0 8px;padding:0;display:flex;flex-direction:column;gap:4px;max-height:34vh;overflow:auto;font-size:13.5px}.sumlist li{display:flex;gap:8px;align-items:flex-start}.smi{flex:none;width:20px;text-align:center}.sumlist.thr li{color:#ffd6cc}.newb{font-style:normal;font-size:11px;padding:1px 6px;border-radius:8px;background:#c4473a;color:#fff;margin-left:4px}
.slots button.on{border-color:var(--gold)}
.cmdpick.on{color:#1a140c;background:var(--gold);border-color:#f3dc9a;box-shadow:0 0 8px rgba(212,173,85,.6)}
.zhb{font-family:var(--f-zh);color:var(--gold)}
.mapview .mvbody{overflow:auto;display:flex;align-items:safe center;justify-content:safe center;touch-action:pan-x pan-y;scrollbar-width:none}
.mapview .mapbox{flex:none;max-width:none;width:calc(min(100vw - 16px, (100dvh - 80px)*1.5) * var(--mz,1))}
.bmap{touch-action:pan-x pan-y}
@media (prefers-reduced-motion:reduce){*{scroll-behavior:auto}}''')
# ---------------------------------------------------------------- pinch / ctrl-wheel zoom for the battle map and the China map
_a = s.index('function resizeMap(){'); _b = s.index('\n}\n', _a) + 3
s = s[:_a] + r'''let ZOOM=1,mapBaseT=60;
function applyMapT(full){const bm=$('.bmap');T=Math.round(clamp(mapBaseT*ZOOM,26,180));
  $('.mapwrap').style.padding=`${Math.max(0,Math.round(bm.clientHeight/2-T/2))}px ${Math.max(0,Math.round(bm.clientWidth/2-T/2))}px`;
  const d=DPR(); MC.width=COLS*T*d; MC.height=ROWS*T*d; MC.style.width=COLS*T+'px'; MC.style.height=ROWS*T+'px';
  mctx=MC.getContext('2d'); mctx.setTransform(d,0,0,d,0,0); if(full||!terrainCv)terrainCv=renderTerrain(T)}
function resizeMap(){const bm=$('.bmap');mapBaseT=Math.max(52,Math.min(120,Math.min(bm.clientHeight,bm.clientWidth)/5.4));applyMapT(true)}
function pinchZoom(el,onZoom,onEnd){let s=null,wt=null;const dist=(a,b)=>Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);
  el.addEventListener('touchstart',e=>{if(e.touches.length===2){s={d:dist(e.touches[0],e.touches[1])};e.preventDefault()}},{passive:false});
  el.addEventListener('touchmove',e=>{if(s&&e.touches.length===2){const [a,b]=e.touches,d=dist(a,b);onZoom(d/s.d,(a.clientX+b.clientX)/2,(a.clientY+b.clientY)/2);s.d=d;e.preventDefault()}},{passive:false});
  el.addEventListener('touchend',e=>{if(s&&e.touches.length<2){s=null;onEnd&&onEnd()}});
  el.addEventListener('wheel',e=>{if(!e.ctrlKey&&!e.metaKey)return;e.preventDefault();onZoom(Math.exp(-e.deltaY*.01),e.clientX,e.clientY);clearTimeout(wt);wt=setTimeout(()=>onEnd&&onEnd(),180)},{passive:false})}
pinchZoom($('.bmap'),(k,fx,fy)=>{const bm=$('.bmap'),r=bm.getBoundingClientRect(),w=$('.mapwrap');
  const pl=parseFloat(w.style.paddingLeft)||0,pt=parseFloat(w.style.paddingTop)||0,cx=(bm.scrollLeft+fx-r.left-pl)/T,cy=(bm.scrollTop+fy-r.top-pt)/T;
  ZOOM=clamp(ZOOM*k,.45,2.2);applyMapT(false);
  bm.scrollLeft=(parseFloat(w.style.paddingLeft)||0)+cx*T-(fx-r.left);bm.scrollTop=(parseFloat(w.style.paddingTop)||0)+cy*T-(fy-r.top)},
  ()=>applyMapT(true));
''' + s[_b:]
rep("setupStage();requestAnimationFrame(loop);", r"""setupStage();requestAnimationFrame(loop);
{let MZ=1;const body=()=>$('#mapView .mvbody'),box=()=>$('#mapView .mapbox');
  pinchZoom($('#mapView .mvbody'),(k,fx,fy)=>{const b=body(),m=box(),r1=m.getBoundingClientRect(),rx=(fx-r1.left)/r1.width,ry=(fy-r1.top)/r1.height;
    MZ=clamp(MZ*k,1,3.2);m.style.setProperty('--mz',MZ);const r2=m.getBoundingClientRect();
    b.scrollLeft+=r2.left+rx*r2.width-fx;b.scrollTop+=r2.top+ry*r2.height-fy});}""")
rep('.cmdpick{margin-left:auto;flex:none;width:34px;height:34px;', '.mg label.grow{box-sizing:border-box;padding:3px 6px;gap:8px}\n.mnote{margin:0;font-size:12px;color:var(--muted)}\n.dlgbox.dwide{padding:12px 14px;gap:8px}\n.cmdpick{margin-left:auto;flex:none;width:32px;height:32px;')
# switch to another ready general even after tapping/moving the current one (he returns to his starting square)
rep("  if(G.mode==='moved')return;\n", "  if(G.mode==='moved'&&u&&u.side==='shu'&&!u.acted&&u!==G.sel){const s=G.sel;s.x=s.px=G.origin.x;s.y=s.py=G.origin.y;G.sel=u;G.view=u;G.origin={x:u.x,y:u.y};G.reach=reach(u);G.mode='select';G.targets=[];updateUI();return}\n  if(G.mode==='moved')return;\n")
# ---------------------------------------------------------------- escape / capture / break-out when a unit is broken
rep("function sweep(){for(const u of G.units.filter(u=>u.troops<=0)){log(`${nm(u)}'s force is broken. ${u.name} retreats from the field.`);G.broken.push(u.id)}",
    """function fateRoll(u,by){if(u.war>=95)return 'breakout';let p=.30;const foes=G.units.filter(e=>e.side!==u.side&&e.troops>0);
  p+=.15*foes.filter(e=>manh(e,u)===1).length;
  if(!DIRS.some(([dx,dy])=>{const x=u.x+dx,y=u.y+dy;return inb(x,y)&&terAt(x,y)!=='w'&&!unitAt(x,y)}))p+=.40;
  p+=((by?by.war:u.war)-u.war)/100;if(u.type==='cav')p-=.10;if(u.type==='archer')p+=.10;
  const tt=terAt(u.x,u.y);if(tt==='w'||tt==='=')p+=.10;if(tt==='f')p-=.10;
  p=clamp(p,.05,.85);if(u.war>=90)p/=2;return Math.random()<p?'capture':'escape'}
function sweep(){for(const u of G.units.filter(u=>u.troops<=0)){const f=u.fate||'escape';
    if(f==='capture'){log(`${nm(u)} is unhorsed and <b>captured</b>!`);G.captured.push(u.id);float(u,'擒 Captured','#ff8a78')}
    else if(f==='breakout'){log(`${nm(u)}'s force is broken, but ${u.name} cuts his way out and escapes!`);float(u,'Breaks free','#f3d27a')}
    else{log(`${nm(u)}'s force is broken. ${u.name} escapes from the field.`);float(u,'Escaped','#e8dcc0')}
    G.broken.push(u.id)}""")
rep("broken:[]};", "broken:[],captured:[]};")
rep("const r={win:G.win,retreat:G.retreat,left};", "const r={win:G.win,retreat:G.retreat,left,captured:[...G.captured]};")
rep("  const ctrVis=!o.noCounter&&(o.forceCounter||inRange(d.type,dist));", "  const ctrVis=!o.noCounter&&(o.forceCounter||inRange(d.type,dist));\n  if(d.troops<=0)d.fate=fateRoll(d,a);if(a.troops<=0)a.fate=fateRoll(a,d);")
# --- fight scene
rep("const c=sctx,CS=SL.ch?SL:SR.ch?SR:null,cam=chCam(CS,t);", "const c=sctx,CS=SL.ch?SL:SR.ch?SR:null,cam=chCam(CS,t),capS=[SL,SR].find(S=>S.nA===0&&S.u.fate==='capture'),capX=capS?sX(capS.off,capS,2900):0;")
rep("for(const s of S.sol){const tt=Math.min(t,s.deathT),x=", "for(const s of S.sol){const tt=Math.min(t,s.deathT);let x=")
rep("          items.push({y:s.hy,f:{x,y:s.hy,s:s.s,face,", "          let srd=false;if(capS&&S!==capS&&alive&&t>3000){const k=ease(clamp((t-3000)/650)),sg=s.i%2?1:-1,tx2=capX+sg*(38+((s.i>>1)%3)*22);x=lerp(x,tx2,k);face=x<capX?1:-1;if(k<1)run=t*.03+s.seed;else run=null;sw=0;srd=true}\n          items.push({y:s.hy,f:{x,y:s.hy,s:s.s,face,")
rep("seed:s.seed,turn:S.melee&&alive&&!S.ch&&!S.hold?", "seed:s.seed,turn:srd?1:S.melee&&alive&&!S.ch&&!S.hold?")
rep("tk:S.ch?(alive&&t>=3450", "tk:srd?null:S.ch?(alive&&t>=3450")
rep("fight:S.ch?chf:S.hold?alive&&t>=1050", "fight:srd?false:S.ch?chf:S.hold?alive&&t>=1050")
rep("const o=S.off,flee=S.nA===0&&t>2900?ease(clamp((t-2900)/900)):0,",
    "const fate=S.nA===0?S.u.fate||'escape':null,o=S.off,flee=fate&&fate!=='capture'&&t>(fate==='breakout'?2800:2900)?ease(clamp((t-(fate==='breakout'?2800:2900))/(fate==='breakout'?650:900))):0,")
rep("        if(flee){orun=t*.03;oface=-S.face}", "        if(fate==='breakout'&&t>2400&&t<2800){osw=(Math.sin(t*.03)+1)/2;orun=null;if(Math.random()<.35*Math.min(dt,30)/16)burst(ox+(Math.random()-.5)*60,o.y-30,7,'#ffe7a8',3.4)}\n        if(flee){orun=t*(fate==='breakout'?.045:.03);oface=-S.face}")
rep("fight:fate==='breakout'", "fight:fate==='breakout'") if False else None
rep("defeat:S.nA===0&&t>2550&&t<=2900?", "defeat:fate==='escape'&&t>2550&&t<=2900?")
rep("        items.push({y:o.y,f:{x:ox-S.face*flee*140,", "        if(fate==='capture'&&t>2550){const k3=t>3050,hx=ox-S.face*Math.max(0,t-3050)*.32;\n          if(k3){items.push({y:o.y-1,f:{cap:true,fr:2,x:hx,y:o.y,s:o.s,face:S.face,fac:S.u.side,alpha:clamp(1-(t-3500)/500)}});items.push({y:o.y+2,f:{cap:true,fr:t<3350?3:4,x:ox,y:o.y,s:o.s,face:S.face,fac:S.u.side}})}\n          else items.push({y:o.y,f:{cap:true,fr:t<2800?0:1,x:ox,y:o.y,s:o.s,face:S.face,fac:S.u.side}})}\n        else items.push({y:o.y,f:{x:ox-S.face*flee*(fate==='breakout'?260:140),")
rep("function drawFigure(c,f){\n", """function drawCap(c,f){const sh=sprSheet('general_cap',sprFac(f.fac));if(!sh)return false;const k=84/150;
  c.save();c.globalAlpha=f.alpha??1;c.translate(f.x,f.y);c.scale(f.s*f.face,f.s);c.drawImage(sh,f.fr*300,0,300,300,-150*k,-292*k,300*k,300*k);c.restore();return true}
function drawFigure(c,f){
  if(f.cap){if(drawCap(c,f))return;f={...f,officer:true,defeat:1,type:'cav'}}
""")
rep("function sprLoad(fk){return ['spear','shield','archer','cav','general',", "function sprLoad(fk){return ['spear','shield','archer','cav','general','general_cap',")
# banner
rep("      if(t>=END){SC.removeEventListener('pointerdown',onSkip);", """      for(const S of [SL,SR]){const fate=S.nA===0?S.u.fate||'escape':null;if(!fate)continue;const t0=fate==='capture'?3150:fate==='breakout'?2700:2950;if(t<t0)continue;
        const p=clamp((t-t0)/250),txt=fate==='capture'?`擒  ${S.u.name} captured!`:fate==='breakout'?`${S.u.name} breaks free!`:`${S.u.name} escapes`;
        c.save();c.globalAlpha=p;c.font=`900 ${fate==='capture'?34:28}px "Noto Serif TC","Alegreya Sans",serif`;c.textAlign='center';c.lineWidth=6;c.strokeStyle='#14110d';
        const y=78-(1-p)*12;c.strokeText(txt,W/2,y);c.fillStyle=fate==='capture'?'#ff7a64':fate==='breakout'?'#f3d27a':'#e8dcc0';c.fillText(txt,W/2,y);c.restore()}
      if(t>=END){SC.removeEventListener('pointerdown',onSkip);""")
rep("ox=sX(o,S,flee?Math.min(t,2900):t)", "ox=sX(o,S,fate==='capture'?Math.min(t,2700):flee?Math.min(t,2900):t)")
rep("capX=capS?sX(capS.off,capS,2900):0;", "capX=capS?sX(capS.off,capS,2700):0;")
# ---------------------------------------------------------------- Fire attack: full fight scene (signal, fire-arrow volley, blaze, panic, embers)
rep("function sprLoad(fk){return ['spear','shield','archer','cav','general','general_cap',", "function sprLoad(fk){return ['spear','shield','archer','cav','general','general_cap','general_sig',")
rep("function drawCap(c,f){", """const FIREFX=new Image();FIREFX.src='sprites/fire_fx.jpg';
function drawSig(c,f){const sh=sprSheet('general_sig',sprFac(f.fac));if(!sh)return false;const k=84/150;
  c.save();c.translate(f.x,f.y);c.scale(f.s*f.face,f.s);c.drawImage(sh,f.fr*300,0,300,300,-150*k,-292*k,300*k,300*k);c.restore();return true}
function fx(c,row,fr,x,y,s,a){if(!FIREFX.complete||!FIREFX.naturalWidth)return;c.save();c.globalCompositeOperation='lighter';c.globalAlpha=a??1;c.drawImage(FIREFX,fr*200,row*200,200,200,x-100*s,y-196*s,200*s,200*s);c.restore()}
function playFire(u,e,dmg,before){
  return new Promise(async resolve=>{
    if(speed===0){resolve();return}await sprWait();
    const L=u.side==='shu'?u:e,R=L===u?e:u;
    const SL=buildSide(L,'L',L===e?before:L.troops,L===e?e.troops:L.troops),SR=buildSide(R,'R',R===e?before:R.troops,R===e?e.troops:R.troops);
    const SC_=u===L?SL:SR,ST=u===L?SR:SL,ter=terAt(e.x,e.y),big=ter==='f'?1.3:ter==='w'||ter==='='?.7:1,burnEnd=ter==='f'?3300:ter==='w'||ter==='='?2500:2900;
    const dieN=ST.nB-ST.nA,pool=[...ST.sol].sort(()=>Math.random()-.5);for(let k=0;k<dieN&&k<pool.length;k++){pool[k].deathT=1600+Math.random()*1100;pool[k].burn=true}
    const tgts=[...ST.sol,ST.off],arrows=[];
    for(let i=0;i<26;i++){const tg=tgts[Math.floor(Math.random()*tgts.length)],sx=SC_.side==='L'?-30-Math.random()*60:W+30+Math.random()*60;
      arrows.push({sx,sy:GROUND-40-Math.random()*80,tx:tg.hx+(Math.random()-.5)*30,ty:(tg.hy||tg.y)+(Math.random()-.5)*8,t0:700+i*28+Math.random()*120,dur:620})}
    const fires=[];for(let i=0;i<Math.round(9*big);i++){const tg=tgts[i%tgts.length];fires.push({x:tg.hx+(Math.random()-.5)*50,y:(tg.hy||tg.y)+6+Math.random()*6,t0:1250+Math.random()*450,s:(.32+Math.random()*.22)*big,ph:Math.random()*4})}
    fires.sort((a,b)=>a.y-b.y);
    const bg=makeBG(ter,e===R?'R':'L',false);ST.u.fate=e.troops<=0?e.fate:null;
    $('#cap').innerHTML=`<span><b style="color:#ffb15a">Fire!</b> <b>${u.name}</b> sets fire to <b>${e.name}</b>${ter==='f'?' · <span class="adv">the forest burns</span>':ter==='w'||ter==='='?' · <span class="dis">damp ground</span>':''}</span><span>Tap to skip</span>`;
    $('#duelUI').hidden=true;$('#stage').hidden=false;parts=[];
    const END=4300,start=performance.now();let skip=false,last=start;const onSkip=()=>{skip=true};SC.addEventListener('pointerdown',onSkip);
    function frame(now){
      const t=skip?END:(now-start)*speed,dt=Math.min(50,now-last)*(skip?0:speed);last=now;const c=sctx;c.drawImage(bg,0,0,W,H);const items=[];
      for(const S of [SL,SR]){
        for(const s of S.sol){const alive=t<s.deathT;let x=s.hx,face=S.face,run=null;
          if(S===ST){if(s.burn&&alive&&t>s.deathT-750){const k=(t-(s.deathT-750))/750;x+=Math.sin(t*.012+s.seed*5)*26*k;face=Math.sin(t*.006+s.seed)>0?1:-1;run=t*.04+s.seed}
            else if(alive&&t>1500)x-=S.face*16*ease(clamp((t-1500)/500))}
          if(!alive&&!s.fx){s.fx=true;burst(x,s.hy-20*s.s,8,'#ff9a3c',2.2)}
          items.push({y:s.hy,f:{x,y:s.hy,s:s.s,face,fac:S.u.side,type:S.u.type,run,seed:s.seed,fall:alive?0:clamp((t-s.deathT)/280),alpha:alive?1:Math.max(.3,1-(t-s.deathT-400)/800)},burn:s.burn&&t>s.deathT-750&&t<s.deathT+500,bx:x,by:s.hy,bs:s.s})}
        const o=S.off;
        if(S===SC_){const fr=t<300?0:t<650?1:t<1000?2:3;items.push({y:o.y,f:{sig:true,fr,x:o.hx,y:o.y,s:o.s,face:S.face,fac:S.u.side}})}
        else{const fate=S.nA===0?S.u.fate||'escape':null,flee=fate&&fate!=='capture'&&t>2900?ease(clamp((t-2900)/800)):0,shy=t>1500&&t<2300;
          if(fate==='capture'&&t>2500){const k3=t>3000,hx=o.hx-S.face*Math.max(0,t-3000)*.32;
            if(k3){items.push({y:o.y-1,f:{cap:true,fr:2,x:hx,y:o.y,s:o.s,face:S.face,fac:S.u.side,alpha:clamp(1-(t-3500)/500)}});items.push({y:o.y+2,f:{cap:true,fr:t<3300?3:4,x:o.hx,y:o.y,s:o.s,face:S.face,fac:S.u.side}})}
            else items.push({y:o.y,f:{cap:true,fr:t<2750?0:1,x:o.hx,y:o.y,s:o.s,face:S.face,fac:S.u.side}})}
          else items.push({y:o.y,f:{x:o.hx-S.face*flee*(fate==='breakout'?260:160)-S.face*(shy?10*Math.sin((t-1500)/800*Math.PI):0),y:o.y,s:o.s,face:flee?-S.face:S.face,fac:S.u.side,type:S.u.type,officer:true,ch:S.u.ch,run:flee?t*.04:null,swing:fate==='breakout'&&t>2500&&t<2900?(Math.sin(t*.03)+1)/2:0,defeat:fate==='escape'&&t>2500&&t<=2900?clamp((t-2500)/350):0,seed:1.7,turn:1,alpha:1-flee}})}}
      items.sort((a,b)=>a.y-b.y);
      for(const f of fires)if(t>=f.t0&&t<f.t0+200)fx(c,0,Math.min(3,Math.floor((t-f.t0)/50)),f.x,f.y,f.s*.9);
      for(const it of items){if(it.f.sig){if(!drawSig(c,it.f))drawFigure(c,{...it.f,officer:true,type:'cav'})}else drawFigure(c,it.f);
        if(it.burn)fx(c,1,Math.floor(t/90+it.bx)%4,it.bx,it.by+2,.28*it.bs,.9)}
      for(const f of fires){if(t<f.t0+200)continue;
        if(t<f.t0+400)fx(c,0,3,f.x,f.y,f.s,(t-f.t0-200)/200);
        if(t<burnEnd)fx(c,1,Math.floor(t/95+f.ph)%4,f.x,f.y,f.s,.85*clamp((t-f.t0-200)/300));
        else if(t<burnEnd+1000)fx(c,2,Math.min(3,Math.floor((t-burnEnd)/250)),f.x,f.y,f.s,1-Math.max(0,(t-burnEnd-700)/300))}
      for(const a of arrows){if(t<a.t0||t>a.t0+a.dur)continue;const p=(t-a.t0)/a.dur,x=lerp(a.sx,a.tx,p),y=lerp(a.sy,a.ty,p)-Math.sin(Math.PI*p)*120,
          p2=Math.max(0,p-.05),x2=lerp(a.sx,a.tx,p2),y2=lerp(a.sy,a.ty,p2)-Math.sin(Math.PI*p2)*120;
        c.save();c.strokeStyle='#e6dccb';c.lineWidth=1.4;ln(c,x2,y2,x,y);c.globalCompositeOperation='lighter';const g=c.createRadialGradient(x,y,0,x,y,9);g.addColorStop(0,'rgba(255,230,140,.95)');g.addColorStop(1,'rgba(255,90,0,0)');c.fillStyle=g;c.beginPath();c.arc(x,y,9,0,7);c.fill();c.restore();
        if(Math.random()<.4)burst(x,y,1,'#ffb15a',.6)}
      stepParts(c,dt);
      if(t>1300&&t<burnEnd+600){c.save();c.globalCompositeOperation='lighter';c.fillStyle=`rgba(255,110,30,${.10*Math.min(1,(t-1300)/400)*Math.min(1,(burnEnd+600-t)/600)*big})`;c.fillRect(0,0,W,H);c.restore()}
      const k=clamp((t-1600)/1100);drawFightHud(c,SL,SR,ST===SL?lerp(SL.before,SL.after,k):SL.before,ST===SR?lerp(SR.before,SR.after,k):SR.before);
      const fate=ST.nA===0?ST.u.fate||'escape':null;if(fate){const t0=fate==='capture'?3100:fate==='breakout'?2600:2900;if(t>t0){const p=clamp((t-t0)/250),txt=fate==='capture'?`擒  ${ST.u.name} captured!`:fate==='breakout'?`${ST.u.name} breaks free!`:`${ST.u.name} escapes`;
        c.save();c.globalAlpha=p;c.font=`900 ${fate==='capture'?34:28}px "Noto Serif TC","Alegreya Sans",serif`;c.textAlign='center';c.lineWidth=6;c.strokeStyle='#14110d';c.strokeText(txt,W/2,78);c.fillStyle=fate==='capture'?'#ff7a64':fate==='breakout'?'#f3d27a':'#e8dcc0';c.fillText(txt,W/2,78);c.restore()}}
      if(t>=END){SC.removeEventListener('pointerdown',onSkip);setTimeout(()=>{$('#stage').hidden=true;resolve()},skip?120:300);return}
      requestAnimationFrame(frame)}
    requestAnimationFrame(frame)})}
function drawCap(c,f){""")
rep("  u.cd.fire=CD;const dmg=Math.min(e.troops,fireDmg(u,e,true));\n  G.fires.push({x:e.x,y:e.y,t0:performance.now(),dur:1300});await sleep(speed===0?350:800);\n  e.troops-=dmg;float(e,'-'+dmg,'#ffb15a');",
    "  u.cd.fire=CD;const dmg=Math.min(e.troops,fireDmg(u,e,true)),before=e.troops;\n  G.fires.push({x:e.x,y:e.y,t0:performance.now(),dur:1300});\n  e.troops-=dmg;if(e.troops<=0)e.fate=fateRoll(e,u);\n  if(speed===0)await sleep(350);else await playFire(u,e,dmg,before);float(e,'-'+dmg,'#ffb15a');")
# ---------------------------------------------------------------- duel weapons (Anthony's assignments; War < 70 = sabre, other unlisted = spear)
rep("function drawCap(c,f){", """const WEAPON={guanyu:'guandao',huangzhong:'guandao',weiyan:'guandao',xingdaorong:'guandao',xuchu:'guandao',
  zhangfei:'spear',zhaoyun:'spear',xiahoudun:'spear',taishici:'spear',zhangliao:'spear',caoren:'spear',huanggai:'spear',chenying:'spear',
  ganning:'spear',lumeng:'spear',zhoutai:'spear',xiahouyuan:'spear',yujin:'spear',lidian:'spear',yuejin:'spear',
  liubei:'sabre',caocao:'sabre',sunquan:'sabre',zhouyu:'sabre'};
function weaponOf(u){return WEAPON[u.id]||(u.war<70?'sabre':'spear')}
function drawCap(c,f){""")
# ---------------------------------------------------------------- duel refusal: enemy refuses if War gap > 30, may refuse if its win chance < 30%
rep("const duelTargets=s=>", """function duelOdds(P,E){const base={strike:24,feint:20,guard:18},ks=['strike','guard','feint'],beat={strike:'guard',guard:'feint',feint:'strike'};let ew=0;const N=600;
  for(let n=0;n<N;n++){let hP=100,hE=100,res=null;
    let pC=P.war-E.war>10,eC=E.war-P.war>10;
    for(let r=1;r<=5&&!res;r++){if(pC&&(hE<60||r>=3)){pC=false;hE-=2*(24+(P.war-E.war)*.8+3);if(hE<=0){res='w';break}continue}
      if(eC&&(hP<60||r>=3)){eC=false;hP-=2*(24+(E.war-P.war)*.8+3);if(hP<=0){res='l';break}continue}
      const w={...E.pers};if(hE<40)w.guard+=.25;const ec=pickW(w),oth=ks.filter(k=>k!==ec),tell=Math.random()<.65?ec:oth[Math.floor(Math.random()*2)];
      const pc=Math.random()<.85?Object.keys(BEATS).find(k=>BEATS[k]===tell):ks[Math.floor(Math.random()*3)];
      if(pc===ec){if(pc==='strike'){hP-=10;hE-=10}else if(pc==='feint'){hP-=3;hE-=3}}
      else if(BEATS[pc]===ec)hE-=Math.max(8,base[pc]+(P.war-E.war)*.8+3);else hP-=Math.max(8,base[ec]+(E.war-P.war)*.8+3);
      if(hP<=0&&hE<=0)res='d';else if(hE<=0)res='w';else if(hP<=0)res='l';else if(r>=5)res=Math.abs(hP-hE)<8?'d':hP>hE?'w':'l'}
    ew+=res==='l'?1:res==='d'?.5:0}
  return ew/N}
function duelAnswer(s,e){const gap=s.war-e.war,ch=duelOdds(s,e);if(gap>30)return{refuse:true,sure:true,ch};if(ch<.3)return{refuse:Math.random()<.75,sure:false,ch};return{refuse:false,ch}}
const duelTargets=s=>""")
rep("G.targets=duelTargets(s).map(e=>({u:e,note:`War ${s.war} vs ${e.war}`}))", "G.targets=duelTargets(s).map(e=>{const ch=duelOdds(s,e);return{u:e,note:`War ${s.war} vs ${e.war}${s.war-e.war>30?' · will refuse':ch<.3?' · may refuse':''}`}})")
rep("async function doDuel(a,d){\n  d.dueled=true;const r=await playDuel(a,d);", """async function doDuel(a,d){
  d.dueled=true;
  if(d.side!=='shu'){const ans=duelAnswer(a,d);if(ans.refuse){float(d,'拒 Refuses','#e8dcc0');log(`${nm(d)} refuses ${a.name}'s challenge${ans.sure?' (no match for him)':' and stays behind his men'}.`);await sleep(700);return 'refused'}}
  const r=await playDuel(a,d);""")
rep("  if(mode==='duel')await doDuel(s,t);\n", "  if(mode==='duel'){if(await doDuel(s,t)==='refused'){G.busy=false;G.mode='moved';G.reach=reachFrom(s,G.origin);updateUI();return}}\n")
# ---------------------------------------------------------------- duel weapon sprite sheets (row0 stance, row1 strike, row2 guard, row3 feint(0-1) / hit(2-3))
rep("function sprLoad(fk){return ['spear','shield','archer','cav','general','general_cap','general_sig',", "function sprLoad(fk){return ['spear','shield','archer','cav','general','general_cap','general_sig','duel_guandao','duel_spear','duel_sabre',")
rep("function renderDuel(now,dt){", """function duelFrame(side,now){const A=D.anim,me=side==='P';
  if(!A){if(D.result&&((D.result==='win'&&!me)||(D.result==='lose'&&me)))return[3,3];return[0,Math.floor(now/170+(me?0:2))%4]}
  const t=now-A.t0,mv=me?A.pc:A.ec,lost=A.win===(me?'E':'P');
  if(lost&&t>=470&&t<1000)return[3,t<640?2:3];
  if(t<230||t>=1000)return[0,Math.floor(now/170)%4];
  const k=clamp((t-230)/440),fr=Math.min(3,Math.floor(k*4));
  if(mv==='strike')return[1,fr];if(mv==='guard')return[2,fr];return[3,Math.min(1,Math.floor(k*2))]}
function drawDuelist(c,u,x,y,s,face,fac,fr){const sh=sprSheet('duel_'+weaponOf(u),sprFac(fac));if(!sh)return false;const k=84/150;
  c.save();c.translate(x,y);c.scale(s*face,s);c.fillStyle='rgba(0,0,0,.28)';c.beginPath();c.ellipse(0,1,22,3,0,0,Math.PI*2);c.fill();
  c.drawImage(sh,fr[1]*256,fr[0]*176,256,176,-128*k,-168*k,256*k,176*k);c.restore();return true}
function renderDuel(now,dt){""")
rep("  drawFigure(c,{x:D.xP+oP,y:H*.9,s:sP,face:1,fac:'shu',", "  if(!drawDuelist(c,D.P,D.xP+oP,H*.9,sP,1,'shu',duelFrame('P',now)))drawFigure(c,{x:D.xP+oP,y:H*.9,s:sP,face:1,fac:'shu',")
rep("  drawFigure(c,{x:D.xE+oE,y:H*.9,s:sE,face:-1,fac:'wei',", "  if(!drawDuelist(c,D.E,D.xE+oE,H*.9,sE,-1,'wei',duelFrame('E',now)))drawFigure(c,{x:D.xE+oE,y:H*.9,s:sE,face:-1,fac:'wei',")
rep("const sP=D.P.type==='cav'?2.1:2.6,sE=D.E.type==='cav'?2.1:2.6;", "const sP=2.1,sE=2.1;")
# ---------------------------------------------------------------- duel Critical: one-time move for the side with War > opponent + 10 (2x damage, always wins the round)
rep('        <button data-c="feint"><span class="zh">虛</span><span>Feint</span><small>beats Guard</small></button>\n      </div>',
    '        <button data-c="feint"><span class="zh">虛</span><span>Feint</span><small>beats Guard</small></button>\n        <button data-c="crit" class="critbtn" hidden><span class="zh">必</span><span>Critical</span><small>once · 2× · always wins</small></button>\n      </div>')
rep(".duelBtns{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}", ".duelBtns{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}\n.duelBtns:has(.critbtn:not([hidden])){grid-template-columns:repeat(4,1fr)}\n.duelBtns .critbtn{border-color:#e0583e;background:linear-gradient(180deg,#5a1c14,#2a100b)}\n.duelBtns .critbtn .zh{color:#ff8a6a}")
rep("LABEL={strike:'Strike',guard:'Guard',feint:'Feint'};", "LABEL={strike:'Strike',guard:'Guard',feint:'Feint',crit:'Critical'};")
# enemy picks critical (once) — more likely when hurt or late
rep("  const w={...D.E.pers};if(D.hp.E<40)w.guard+=.25;D.ec=pickW(w);", """  const w={...D.E.pers};if(D.hp.E<40)w.guard+=.25;D.ec=pickW(w);
  D.eCrit=D.eCrit??(D.E.war-D.P.war>10);D.pCrit=D.pCrit??(D.P.war-D.E.war>10);
  if(D.eCrit&&(Math.random()<(D.hp.E<55||D.round>=4?.6:.22)||D.round>=5)){D.ec='crit';D.eCrit=false}
  $('.critbtn').hidden=!D.pCrit;""")
rep("$('#duelTell').textContent=TELLS[tell].replace('{n}',D.E.name);", "$('#duelTell').textContent=D.ec==='crit'?`${D.E.name}'s eyes blaze. He gathers all his strength!`:TELLS[tell].replace('{n}',D.E.name);")
rep("  const pc=b.dataset.c,ec=D.ec,P=D.P,E=D.E;let win='tie',dP=0,dE=0,msg;\n  const base={strike:24,feint:20,guard:18};",
    """  const pc=b.dataset.c,ec=D.ec,P=D.P,E=D.E;let win='tie',dP=0,dE=0,msg;
  const base={strike:24,feint:20,guard:18,crit:24};if(pc==='crit')D.pCrit=false;""")
rep("  if(pc===ec){if(pc==='strike'){dP=8+", """  if(pc==='crit'&&ec==='crit'){dP=dE=20;msg='Both men put everything into one blow!'}
  else if(pc==='crit'){win='P';dE=2*Math.max(8,Math.round(base.strike+(P.war-E.war)*.8+Math.random()*6));msg=`A devastating blow! ${E.name} cannot answer it.`}
  else if(ec==='crit'){win='E';dP=2*Math.max(8,Math.round(base.strike+(E.war-P.war)*.8+Math.random()*6));msg=`${E.name} unleashes a devastating blow!`}
  else if(pc===ec){if(pc==='strike'){dP=8+""")
# animation: critical uses the strike row with a bigger flash
rep("  if(mv==='strike')return[1,fr];", "  if(mv==='strike'||mv==='crit')return[1,fr];")
rep("    if(t>350&&t<500&&reachK===1)flash=1-(t-350)/150;", "    if(t>350&&t<500&&reachK===1)flash=(1-(t-350)/150)*(A.pc==='crit'||A.ec==='crit'?1.8:1);")
# ================================================================ HERO SPECIALS (War or Int above 90)
rep('@media (prefers-reduced-motion:reduce){*{scroll-behavior:auto}}', r'''#cutin{position:fixed;inset:0;z-index:60;pointer-events:auto;display:flex;align-items:center;justify-content:center;overflow:hidden;background:rgba(5,4,3,0);transition:background .2s}
#cutin[hidden]{display:none}
#cutin.on{background:rgba(5,4,3,.55)}
.ci-band{position:relative;width:100%;height:min(46vh,240px);display:flex;align-items:center;gap:4%;padding:0 6%;box-sizing:border-box;
  background:url(art/skill_banner.png) center/104% 118% no-repeat;filter:drop-shadow(0 8px 24px rgba(0,0,0,.75));
  transform:translateX(-110%) skewX(-8deg)}
#cutin.on .ci-band{animation:ciIn .32s cubic-bezier(.2,.9,.25,1) forwards}
#cutin.out .ci-band{animation:ciOut .25s ease-in forwards}
@keyframes ciIn{from{transform:translateX(-110%) skewX(-8deg)}to{transform:translateX(0) skewX(-8deg)}}
@keyframes ciOut{from{transform:translateX(0) skewX(-8deg);opacity:1}to{transform:translateX(110%) skewX(-8deg);opacity:0}}
.ci-port{height:150%;align-self:flex-end;transform:skewX(8deg);filter:drop-shadow(0 6px 14px rgba(0,0,0,.8));mask-image:linear-gradient(180deg,#000 70%,transparent);-webkit-mask-image:linear-gradient(180deg,#000 70%,transparent)}
.ci-txt{transform:skewX(8deg);display:flex;flex-direction:column;line-height:1}
.ci-zh{font:900 clamp(48px,12vh,96px)/1 var(--f-zh);color:#fff3d6;text-shadow:0 0 18px rgba(255,190,90,.9),3px 3px 0 #3a0c06;opacity:0;transform:scale(2.2)}
#cutin.on .ci-zh{animation:ciStamp .28s .22s cubic-bezier(.3,1.6,.5,1) forwards}
@keyframes ciStamp{to{opacity:1;transform:scale(1)}}
.ci-en{font:700 clamp(18px,4vh,28px) var(--f-display);color:#f3d27a;margin-top:6px;letter-spacing:.04em}
.ci-name{font-size:14px;color:#e8dcc0;margin-top:4px}
@media (prefers-reduced-motion:reduce){*{scroll-behavior:auto}}''')
rep("fire:{n:'Fire',zh:'火',who:u=>u.int>=75,desc:'Burn an enemy within 3 squares, ×1.8 in forest'}};",
r"""fire:{n:'Fire',zh:'火',who:u=>u.int>=75,desc:'Burn an enemy within 3 squares, ×1.8 in forest'}};
const adjE=s=>enemies().filter(e=>manh(s,e)===1),adjA=s=>G.units.filter(u=>u.side===s.side&&u!==s&&manh(u,s)===1);
const HERO={
 roar:{who:'zhangfei',zh:'咆哮',n:'Roar',self:1,can:s=>adjE(s).length>0,desc:'Every adjacent enemy is stunned and loses its next turn'},
 sweep:{who:'guanyu',zh:'青龍斬',n:'Dragon Sweep',self:1,can:s=>adjE(s).length>0,desc:'Strike every adjacent enemy at once; none can strike back'},
 lone:{who:'zhaoyun',zh:'單騎',n:'Lone Rider',targets:s=>adjE(s),desc:'×1.4, no counter, ride through to the square behind'},
 tiger:{who:'xuchu',zh:'虎衛',n:'Tiger Guard',targets:s=>adjA(s),desc:'Until your next turn, attacks on this ally hit Xu Chu instead at half damage'},
 raid:{who:'ganning',zh:'夜襲',n:'Night Raid',targets:s=>adjE(s),desc:'×1.2, no counter, then slip back 2 squares'},
 sharp:{who:'huangzhong',zh:'神射',n:'Sharpshot',targets:s=>enemies().filter(e=>manh(s,e)<=3),desc:'One arrow at range 1–3: ×2 damage, no counter'},
 twin:{who:'taishici',zh:'雙戟',n:'Twin Halberds',targets:s=>adjE(s),desc:'Attack twice in one action'},
 terror:{who:'zhangliao',zh:'威震',n:'Hefei Terror',targets:s=>adjE(s),desc:'Charge ×1.3; the target and its neighbours lose 20% attack for 2 turns'},
 ambush:{who:'weiyan',zh:'奇襲',n:'Ambush',targets:s=>enemies().filter(e=>manh(s,e)<=4&&ambushTile(s,e)),desc:'Appear beside an enemy up to 4 squares away and strike ×1.3, no counter'},
 swift:{who:'xiahouyuan',zh:'神速',n:'Swift March',self:1,can:s=>true,free:1,desc:'+3 movement this turn; he can still act'},
 iron:{who:'zhoutai',zh:'不屈',n:'Iron Body',self:1,can:s=>true,desc:'Half damage for 2 turns and survive one deadly blow'},
 wind:{who:'zhugeliang',zh:'東風',n:'East Wind',self:1,can:s=>!s.eastWind,desc:'His next Fire deals ×2 and spreads to adjacent enemies'},
 blaze:{who:'zhouyu',zh:'赤壁',n:'Red Cliffs',once:1,targets:s=>enemies().filter(e=>manh(s,e)<=3),desc:'Once per battle: a great fire over a 3×3 area'},
 strat:{who:'xunyu',zh:'王佐',n:'Strategist',targets:s=>G.units.filter(u=>u.side===s.side&&u!==s&&u.acted&&manh(u,s)<=2),desc:'An ally within 2 squares that has acted may act again'},
 rally:{who:'lusu',zh:'安撫',n:'Rally',self:1,can:s=>[s,...adjA(s)].some(u=>u.troops<u.max),desc:'Restore 15% troops to himself and adjacent allies'},
 treach:{who:'caocao',zh:'奸雄',n:'Treachery',targets:s=>adjE(s),desc:'An adjacent enemy loses its next turn'}};
for(const [k,h] of Object.entries(HERO))SKILLS[k]={n:h.n,zh:h.zh[0],who:u=>u.id===h.who,desc:h.desc};
function ambushTile(s,e){return DIRS.map(([dx,dy])=>({x:e.x+dx,y:e.y+dy})).filter(t=>inb(t.x,t.y)&&terAt(t.x,t.y)!=='w'&&!unitAt(t.x,t.y)).sort((a,b)=>manh(a,s)-manh(b,s))[0]}""")
rep("  if(k==='volley')return en.filter(e=>manh(s,e)===2);\n  return []}", "  if(k==='volley')return en.filter(e=>manh(s,e)===2);\n  if(HERO[k]&&HERO[k].targets)return HERO[k].targets(s);\n  return []}")
rep("  if(k==='fire')return `~${Math.min(e.troops,fireDmg(s,e,false))} burned${terAt(e.x,e.y)==='f'?' · forest ×1.8':''}`;", "  if(k==='fire')return `~${Math.min(e.troops,fireDmg(s,e,false)*(s.eastWind?2:1))} burned${terAt(e.x,e.y)==='f'?' · forest ×1.8':''}${s.eastWind?' · East Wind ×2':''}`;\n  if(HERO[k])return HERO[k].desc;")
rep("ok=!cd&&(k==='guard'||skillTargets(k,s).length>0)", "ok=!cd&&(k==='guard'||(HERO[k]&&HERO[k].self?HERO[k].can(s):skillTargets(k,s).length>0))&&!(HERO[k]&&HERO[k].once&&s.used&&s.used[k])")
rep("rb(`data-sk=\"${k}\" title=\"${v.desc}\"`,v.zh,v.n,ok,'sk',cd)", "rb(`data-sk=\"${k}\" title=\"${v.desc}\"`,v.zh,v.n,ok,HERO[k]?'sk hero':'sk',cd)")
rep("    if(k==='guard'){doGuard(s);return}", "    if(k==='guard'){doGuard(s);return}\n    if(HERO[k]&&HERO[k].self){G.tmode=k;G.targets=[{u:{fake:1,self:1,x:s.x,y:s.y,area:selfArea(k,s),label:`✦ Cast ${HERO[k].n} here`,name:s.name,type:s.type},note:HERO[k].desc}];G.mode='target';updateUI();return}")
rep("  if(mode==='volley')await doVolley(s,t);\n", "  if(mode==='volley')await doVolley(s,t);\n  if(HERO[mode]){const r=await heroAct(mode,s,t);if(r==='keep'){G.busy=false;G.mode='moved';G.reach=reachFrom(s,G.origin);updateUI();return}}\n")
# ---- effects hooks
rep("const tf=u=>.7+.3*((u.train??70)/100);", "const tf=u=>(.7+.3*((u.train??70)/100))*(u.fear?.8:1);")
rep("mv=TYPES[u.type].mv;", "mv=TYPES[u.type].mv+(u.swift?3:0);")
rep("const dmg=Math.min(d.troops,Math.round(tf(a)*dmgCalc(a.type,a.war,a.troops,d.type,terAt(d.x,d.y),ranged,true)*(o.mult||1)));d.troops-=dmg;",
    "let dmg=Math.min(d.troops,Math.round(tf(a)*dmgCalc(a.type,a.war,a.troops,d.type,terAt(d.x,d.y),ranged,true)*(o.mult||1)*(d.iron?.5:1)));dmg=ironSave(d,dmg);d.troops-=dmg;")
rep("u.cd.fire=CD;const dmg=Math.min(e.troops,fireDmg(u,e,true)),before=e.troops;", "u.cd.fire=CD;const ew=u.eastWind;u.eastWind=false;let dmg=Math.min(e.troops,Math.round(fireDmg(u,e,true)*(ew?2:1)*(e.iron?.5:1))),before=e.troops;dmg=ironSave(e,dmg);")
rep("e.troops-=dmg;if(e.troops<=0)e.fate=fateRoll(e,u);", "e.troops-=dmg;if(e.troops<=0)e.fate=fateRoll(e,u);if(ew)for(const n of adjE(e).filter(n=>n!==u))G.ewSplash=(G.ewSplash||[]).concat([n]);")
rep("charge:o.charge,push:o.push,label:o.label}", "charge:o.charge,push:o.push,label:o.label,tint:o.tint}")
rep("stepParts(c,dt);c.restore();", "stepParts(c,dt);c.restore();if(r.tint){c.fillStyle=r.tint;c.fillRect(0,0,W,H)}")
rep("  G.turn++;", "  G.turn++;for(const u of G.units){if(u.fear)u.fear--;if(u.iron){u.iron--;if(!u.iron)u.ironSave=false}u.guardBy=null;u.swift=false}")
rep("      await doAttack(e,tgt,o);if(checkEnd())return}", "      {const xg=tgt.guardBy&&G.units.find(u=>u.id===tgt.guardBy&&manh(u,tgt)<=1);if(xg&&xg!==tgt){log(`<b>Tiger Guard!</b> ${nm(xg)} throws himself in front of ${nm(tgt)}.`);mfx('shield',xg.x,xg.y,900);tgt=xg;o={...o,mult:(o.mult||1)*.5}}}\n      await doAttack(e,tgt,o);if(checkEnd())return}")
# ---- map effects layer (uses sprites/skill_fx.jpg when present: 6 rows x 4 frames on black)
rep("  // fire\n", r"""  G.mfx=(G.mfx||[]).filter(f=>now-f.t0<f.dur);
  for(const f of G.mfx){const p=(now-f.t0)/f.dur,cx=f.x*T+T/2,cy=f.y*T+T/2,row=FXROW[f.k];
    if(row!=null&&SKFX.complete&&SKFX.naturalWidth){const fr=Math.min(3,Math.floor(p*4)),s=T*(f.s||1.8);c.save();c.globalCompositeOperation='lighter';c.globalAlpha=p>.75?(1-p)*4:1;c.drawImage(SKFX,fr*256,row*256,256,256,cx-s/2,cy-s/2,s,s);c.restore();continue}
    c.save();
    if(f.k==='ring'){for(let i=0;i<2;i++){const q=clamp(p*1.3-i*.25);c.strokeStyle=`rgba(255,226,160,${(1-q)*.9})`;c.lineWidth=T*.08*(1-q)+1;c.beginPath();c.arc(cx,cy,T*(.3+q*1.5),0,7);c.stroke()}}
    else if(f.k==='arc'){c.strokeStyle=`rgba(110,255,170,${1-p})`;c.lineWidth=T*.14*(1-p*.5);c.shadowColor='#4dff9a';c.shadowBlur=18;c.beginPath();c.arc(cx,cy,T*1.05,-2.6,-2.6+p*5.4);c.stroke()}
    else if(f.k==='smoke'){for(let i=0;i<7;i++){const a=i/7*6.28+p*2,r=T*(.15+p*.5);c.fillStyle=`rgba(150,70,200,${.35*(1-p)})`;c.beginPath();c.arc(cx+Math.cos(a)*r,cy+Math.sin(a)*r*.6-p*T*.3,T*(.22+p*.2),0,7);c.fill()}}
    else if(f.k==='heal'){for(let i=0;i<9;i++){const x=cx+Math.sin(i*2.1)*T*.35,y=cy+T*.3-((p*1.3+i*.11)%1)*T*.9;c.fillStyle=`rgba(140,255,150,${.8*(1-p)})`;c.beginPath();c.arc(x,y,T*.05,0,7);c.fill()}c.strokeStyle=`rgba(140,255,150,${.5*(1-p)})`;c.lineWidth=2;c.beginPath();c.arc(cx,cy,T*.48,0,7);c.stroke()}
    else if(f.k==='shield'){c.fillStyle=`rgba(255,210,90,${.22*(1-p)})`;c.strokeStyle=`rgba(255,220,120,${.9*(1-p)})`;c.lineWidth=3;c.beginPath();c.arc(cx,cy,T*.55,0,7);c.fill();c.stroke()}
    else if(f.k==='wind'){c.strokeStyle=`rgba(230,245,255,${.55*Math.sin(p*Math.PI)})`;c.lineWidth=2;for(let i=0;i<14;i++){const y=(i*0.13+.05)*ROWS*T,x0=((p*1.6+i*.37)%1.4-.2)*COLS*T;c.beginPath();c.moveTo(x0,y);c.quadraticCurveTo(x0+T,y-T*.25,x0+T*2.4,y);c.stroke()}}
    else if(f.k==='speed'){c.strokeStyle=`rgba(120,190,255,${.8*(1-p)})`;c.lineWidth=3;for(let i=-2;i<=2;i++){c.beginPath();c.moveTo(cx-T*(.6+p),cy+i*T*.12);c.lineTo(cx+T*.4,cy+i*T*.12);c.stroke()}}
    else if(f.k==='iron'){c.strokeStyle=`rgba(230,170,80,${.9*(1-p)})`;c.lineWidth=4;c.shadowColor='#ffb347';c.shadowBlur=14;c.strokeRect(cx-T*.45,cy-T*.45,T*.9,T*.9)}
    else if(f.k==='scroll'){c.fillStyle=`rgba(240,225,180,${.85*(1-p)})`;const w=T*1.2*Math.min(1,p*3);c.fillRect(cx-w/2,cy-T*.15,w,T*.3)}
    c.restore()}
  // fire
""")
rep("function drawCap(c,f){", r"""const SKFX=new Image();SKFX.src='sprites/skill_fx.jpg';const FXROW={arc:0,ring:1,wind:2,smoke:3,heal:4,shield:5};
function mfx(k,x,y,dur,s){G.mfx=(G.mfx||[]);G.mfx.push({k,x,y,t0:performance.now(),dur:dur||900,s})}
function ironSave(d,dmg){if(d.ironSave&&dmg>=d.troops&&d.troops>1){d.ironSave=false;setTimeout(()=>{float(d,'不屈','#f3d27a');mfx('iron',d.x,d.y,900)},50);return d.troops-1}return dmg}
const CUTIN=document.createElement('div');CUTIN.id='cutin';CUTIN.hidden=true;document.body.appendChild(CUTIN);
function cutIn(u,h){if(speed===0)return Promise.resolve();return new Promise(res=>{const p=PORT[u.id];
  CUTIN.innerHTML=`<div class="ci-band">${p?`<img class="ci-port" src="portraits/sp_${p}.png" onerror="this.onerror=null;this.src='portraits/${p}.webp'" alt="">`:''}<div class="ci-txt"><div class="ci-zh">${h.zh}</div><div class="ci-en">${h.n}!</div><div class="ci-name">${u.name}</div></div></div>`;
  CUTIN.hidden=false;CUTIN.className='';void CUTIN.offsetWidth;CUTIN.className='on';let done=false;
  const end=()=>{if(done)return;done=true;CUTIN.className='on out';setTimeout(()=>{CUTIN.hidden=true;CUTIN.className='';res()},240)};
  CUTIN.onpointerdown=end;setTimeout(end,1250/Math.max(.6,speed||1))})}
function quickHit(a,d,mult,o={}){if(!G.units.includes(d))return 0;let dmg=Math.min(d.troops,Math.round(tf(a)*dmgCalc(a.type,a.war,a.troops,d.type,terAt(d.x,d.y),false,true)*mult*(d.iron?.5:1)));dmg=ironSave(d,dmg);d.troops-=dmg;if(d.troops<=0)d.fate=fateRoll(d,a);float(d,'-'+dmg,o.color||'#ff9a86');return dmg}
function fireHit(u,e,mult){if(!G.units.includes(e))return 0;let dmg=Math.min(e.troops,Math.round(fireDmg(u,e,true)*mult*(e.iron?.5:1)));dmg=ironSave(e,dmg);e.troops-=dmg;if(e.troops<=0)e.fate=fateRoll(e,u);G.fires.push({x:e.x,y:e.y,t0:performance.now(),dur:1300});float(e,'-'+dmg,'#ffb15a');return dmg}
async function heroAct(k,s,t){const h=HERO[k];s.cd[k]=CD;if(h.once){s.used=s.used||{};s.used[k]=1}
  await cutIn(s,h);let keep=false;
  if(k==='roar'){mfx('ring',s.x,s.y,1100,3.2);await sleep(350);for(const e of adjE(s)){e.stun=1;float(e,'✕ Stunned','#f3d27a')}log(`<b>Roar!</b> ${nm(s)}'s roar freezes ${adjE(s).map(nm).join(', ')} in their tracks.`);await sleep(500)}
  else if(k==='sweep'){const es=adjE(s).sort((a,b)=>b.troops-a.troops);mfx('arc',s.x,s.y,900,3.4);await doAttack(s,es[0],{mult:1,noCounter:true,label:'Green Dragon Sweep',tint:'rgba(40,200,110,.10)'});
    for(const e of es.slice(1)){if(!G.units.includes(e))continue;mfx('arc',e.x,e.y,700,1.6);quickHit(s,e,.9,{color:'#8dffb5'});await sleep(220)}log(`<b>Green Dragon Sweep!</b> ${nm(s)} cuts through ${es.length} enemy units.`)}
  else if(k==='lone'){const b=behind(s,t),via={x:t.x,y:t.y};mfx('speed',s.x,s.y,700);await doAttack(s,t,{mult:1.4,noCounter:true,charge:true,label:'Lone Rider',verb:'rides straight through'});if(G.units.includes(s)&&openSq(b)){await animateMove(s,[via,b])}}
  else if(k==='tiger'){t.guardBy=s.id;mfx('shield',t.x,t.y,1200);mfx('shield',s.x,s.y,1200);log(`<b>Tiger Guard!</b> ${nm(s)} stands over ${nm(t)}.`);await sleep(500)}
  else if(k==='raid'){await doAttack(s,t,{mult:1.2,noCounter:true,label:'Night Raid',tint:'rgba(15,25,80,.38)',verb:'raids'});
    if(G.units.includes(s)){const opts=[];for(let dx=-2;dx<=2;dx++)for(let dy=-2;dy<=2;dy++){const x=s.x+dx,y=s.y+dy;if(Math.abs(dx)+Math.abs(dy)!==2||!inb(x,y)||terAt(x,y)==='w'||unitAt(x,y))continue;opts.push({x,y})}
      opts.sort((a,b)=>manh(b,t)-manh(a,t));if(opts[0]){mfx('speed',s.x,s.y,600);await animateMove(s,[opts[0]]);log(`${nm(s)} slips back into the dark.`)}}}
  else if(k==='sharp'){await doAttack(s,t,{mult:2,noCounter:true,label:'Sharpshot',verb:'looses one perfect arrow at'})}
  else if(k==='twin'){await doAttack(s,t,{mult:.8,label:'Twin Halberds ×1'});if(G.units.includes(t)&&G.units.includes(s))await doAttack(s,t,{mult:.8,label:'Twin Halberds ×2'})}
  else if(k==='terror'){await doAttack(s,t,{mult:1.3,ctrMult:.3,charge:true,label:'Hefei Terror',tint:'rgba(170,20,20,.12)'});
    for(const e of [t,...enemies().filter(e=>manh(e,t)===1)])if(G.units.includes(e)){e.fear=2;float(e,'Fear −20%','#ff8a78')}log(`Terror spreads through the enemy around ${nm(t)}.`)}
  else if(k==='ambush'){const tile=ambushTile(s,t);mfx('smoke',s.x,s.y,800);await sleep(250);s.x=s.px=tile.x;s.y=s.py=tile.y;mfx('smoke',s.x,s.y,800);await sleep(300);await doAttack(s,t,{mult:1.3,noCounter:true,label:'Ambush',verb:'bursts out of hiding at'})}
  else if(k==='swift'){s.swift=true;mfx('speed',s.x,s.y,900);float(s,'+3 Move','#9fd0ff');log(`<b>Swift March!</b> ${nm(s)} can move 3 more squares this turn.`);keep=true;await sleep(300)}
  else if(k==='iron'){s.iron=2;s.ironSave=true;mfx('iron',s.x,s.y,1200);float(s,'Iron Body','#f3d27a');log(`<b>Iron Body!</b> ${nm(s)} will not fall: half damage for 2 turns.`);await sleep(400)}
  else if(k==='wind'){s.eastWind=true;mfx('wind',(COLS-1)/2,(ROWS-1)/2,1800,COLS*.9);log(`<b>East Wind!</b> The wind turns. ${nm(s)}'s next Fire will be doubled and spread.`);s.cd.fire=0;await sleep(900)}
  else if(k==='blaze'){const area=enemies().filter(e=>Math.max(Math.abs(e.x-t.x),Math.abs(e.y-t.y))<=1&&e!==t);
    s.cd.fire=CD;let before=t.troops,dmg=Math.min(t.troops,Math.round(fireDmg(s,t,true)*1.5*(t.iron?.5:1)));dmg=ironSave(t,dmg);t.troops-=dmg;if(t.troops<=0)t.fate=fateRoll(t,s);
    for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++)if(inb(t.x+dx,t.y+dy))G.fires.push({x:t.x+dx,y:t.y+dy,t0:performance.now(),dur:1600});
    if(speed)await playFire(s,t,dmg,before);float(t,'-'+dmg,'#ffb15a');for(const e of area){fireHit(s,e,.9);await sleep(150)}
    log(`<b>Red Cliffs!</b> ${nm(s)} sets the whole field around ${nm(t)} ablaze.`)}
  else if(k==='strat'){t.acted=false;mfx('scroll',t.x,t.y,900);float(t,'Ready!','#9fe8a8');log(`<b>Strategist!</b> ${nm(s)}'s counsel lets ${nm(t)} act again.`);await sleep(400)}
  else if(k==='rally'){for(const u of [s,...adjA(s)]){const add=Math.min(u.max-u.troops,Math.round(u.max*.15));if(add>0){u.troops+=add;float(u,'+'+add,'#8dffb5')}mfx('heal',u.x,u.y,1100)}log(`<b>Rally!</b> ${nm(s)} steadies the men around him.`);await sleep(600)}
  else if(k==='treach'){t.stun=1;mfx('smoke',t.x,t.y,1200);float(t,'✕ Confused','#d6a8ff');log(`<b>Treachery!</b> False orders throw ${nm(t)} into confusion.`);await sleep(500)}
  if(G.ewSplash){const l=G.ewSplash;G.ewSplash=null;mfx('wind',(COLS-1)/2,(ROWS-1)/2,1200,COLS*.9);for(const e of l)fireHit(s,e,.5)}
  sweep();return keep?'keep':'done'}
function drawCap(c,f){""")
# East Wind splash after normal Fire
rep("  if(mode==='fire')await doFire(s,t);", "  if(mode==='fire'){await doFire(s,t);if(G.ewSplash){const l=G.ewSplash;G.ewSplash=null;mfx('wind',(COLS-1)/2,(ROWS-1)/2,1200,COLS*.9);await sleep(200);for(const e of l)fireHit(s,e,.5);log('The East Wind carries the flames to the next ranks!');sweep()}}")
# hero button glow
rep(".rbtn.sk{border-color:#7fb0e0}", ".rbtn.sk{border-color:#7fb0e0}\n.rbtn.hero{border-color:#ff8a4a;background:radial-gradient(circle at 35% 30%,#8a2e14,#2a0d06 72%);box-shadow:0 0 12px rgba(255,120,60,.55),0 3px 10px rgba(0,0,0,.7)}\n.rbtn.hero .rzh{color:#ffd9a0}")
# Anthony: keep hero specials only for Guan Yu, Zhang Fei, Zhao Yun, Zhuge Liang
rep("for(const [k,h] of Object.entries(HERO))SKILLS[k]=", "for(const k of Object.keys(HERO))if(!['roar','sweep','lone','wind'].includes(k))delete HERO[k];\nfor(const [k,h] of Object.entries(HERO))SKILLS[k]=")
# ---------------------------------------------------------------- bigger fight scenes on phones: fill the screen, caption overlaid; fullscreen + landscape on start
rep('@media (prefers-reduced-motion:reduce){*{scroll-behavior:auto}}', r'''#stage:has(#duelUI[hidden]){padding:0;background:#000}
#stage:has(#duelUI[hidden]) .stage-inner{position:relative;width:100vw;height:100dvh;justify-content:center;gap:0}
#stage:has(#duelUI[hidden]) #sc{height:min(100dvh,100vw*9/16);width:auto;max-width:100vw;border:0;border-radius:0}
#stage:has(#duelUI[hidden]) .cap{position:absolute;left:50%;transform:translateX(-50%);top:max(4px,env(safe-area-inset-top,0px));width:max-content;max-width:60vw;background:rgba(10,8,6,.6);border-radius:12px;padding:2px 10px;font-size:12px}
@media (prefers-reduced-motion:reduce){*{scroll-behavior:auto}}''')
rep("setupStage();requestAnimationFrame(loop);", r"""setupStage();requestAnimationFrame(loop);
function goFull(){try{const d=document.documentElement;if(!document.fullscreenElement&&d.requestFullscreen&&matchMedia('(pointer:coarse)').matches){d.requestFullscreen({navigationUI:'hide'}).then(()=>{try{screen.orientation.lock('landscape').catch(()=>{})}catch(e){}}).catch(()=>{})}}catch(e){}}
for(const id of ['#newBtn','#contBtn'])$(id).addEventListener('click',goFull,true);
{const m=document.createElement('link');m.rel='manifest';m.href='data:application/manifest+json,'+encodeURIComponent(JSON.stringify({name:'RTK3',short_name:'RTK3',start_url:location.href.split('#')[0],display:'fullscreen',orientation:'landscape',background_color:'#0b0a08',theme_color:'#0b0a08',icons:[{src:new URL('art/icon-192.png',location.href).href,sizes:'192x192',type:'image/png',purpose:'any'},{src:new URL('art/icon-512.png',location.href).href,sizes:'512x512',type:'image/png',purpose:'any maskable'}]}));document.head.appendChild(m);[['apple-touch-icon','art/icon-180.png'],['icon','art/icon-32.png']].forEach(([r,h])=>{const l=document.createElement('link');l.rel=r;l.href=h;document.head.appendChild(l);});
 for(const [n,c] of [['mobile-web-app-capable','yes'],['apple-mobile-web-app-capable','yes'],['apple-mobile-web-app-status-bar-style','black-translucent'],['theme-color','#0b0a08']]){const t=document.createElement('meta');t.name=n;t.content=c;document.head.appendChild(t)}}""")
rep('<div class="pills"><button id="speedBtn" class="pill"></button>', '<div class="pills"><button id="fsBtn" class="pill" aria-label="Fullscreen">⛶ Full</button><button id="speedBtn" class="pill"></button>')
rep(".pills .pill:first-child{grid-column:1/-1}", ".pills #speedBtn{grid-column:auto}")
rep("for(const id of ['#newBtn','#contBtn'])$(id).addEventListener('click',goFull,true);", """for(const id of ['#newBtn','#contBtn'])$(id).addEventListener('click',goFull,true);
function toggleFull(){try{if(document.fullscreenElement)document.exitFullscreen();else{const d=document.documentElement;(d.requestFullscreen?d.requestFullscreen({navigationUI:'hide'}):d.webkitRequestFullscreen()).then?.(()=>{try{screen.orientation.lock('landscape').catch(()=>{})}catch(e){}}).catch?.(()=>{})}}catch(e){}}
$('#fsBtn').onclick=toggleFull;
document.addEventListener('fullscreenchange',()=>{const f=!!document.fullscreenElement;$('#fsBtn').textContent=f?'⛶ Exit':'⛶ Full';setTimeout(()=>{if(G&&!$('#battleView').hidden){resizeMap();const u=G.sel||G.view;if(u)focusUnit(u,true)}},200)});""")

# ---- Retreat: confirm with Full retreat / Auto resolve
rep("$('#retreatBtn').onclick=()=>{if(G.phase!=='player'||G.busy||G.over)return;endGame(false,'You sound the retreat. Your army withdraws from the field.',true)};",
r"""$('#retreatBtn').onclick=async()=>{if(G.over)return;
  if(G.auto){G.auto=false;speed=G.autoSpeed??speed;log('You take back command.');updateUI();return}
  if(G.phase!=='player'||G.busy)return;
  const alive=G.units.filter(u=>u.side==='shu'),tr=alive.reduce((s,u)=>s+u.troops,0);
  const r=await dialog(`<h2>Leave the fight?</h2><p class="muted">You have ${alive.length} unit${alive.length>1?'s':''} and ${tr.toLocaleString()} troops on the field · turn ${G.turn} of ${G.maxTurn}.</p>
    <div class="rchoice"><button data-r="flee"><b>Full retreat</b><small>Withdraw now. Your generals and the troops still standing return home. The battle is lost.</small></button>
    <button data-r="auto"><b>Auto resolve</b><small>Your officers fight on by themselves until the battle ends, with scenes off. Tap “Stop auto” to take back command.</small></button></div>`,
    [['stay','Keep fighting','primary']]);
  if(r==='flee'){endGame(false,'You sound the retreat. Your army withdraws from the field.',true);return}
  if(r==='auto'){G.auto=true;G.autoSpeed=speed;speed=0;log('<b>Auto resolve.</b> Your officers fight on.');updateUI();autoTurn()}};
function planAuto(u){
  const foes=enemies();const R=reach(u);let tiles=R.tiles;
  if(u.cmd&&!G.cfg.playerAttacks&&!foes.some(p=>manh(p,u)<=3))tiles=[{x:u.x,y:u.y}];
  // commander: count how many enemies could hit each tile next turn, and keep out of reach
  let TH=null;if(u.cmd){TH=new Map();const ox=u.x,oy=u.y;
    for(const f of foes){const fr=reach(f);const seen=new Set();for(const ft of fr.tiles)for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++){const d=Math.abs(dx)+Math.abs(dy);if(!d||!inRange(f.type,d))continue;const k=(ft.x+dx)+','+(ft.y+dy);if(seen.has(k))continue;seen.add(k);TH.set(k,(TH.get(k)||0)+1)}}}
  const thr=t=>TH?(TH.get(t.x+','+t.y)||0):0;
  if(u.cmd&&(u.troops<u.max*.6||!G.cfg.playerAttacks)){const allies=G.units.filter(a=>a.side==='shu'&&a!==u);
    let bt=null,bv=Infinity;for(const t of tiles){const near=allies.length?Math.min(...allies.map(a=>Math.abs(t.x-a.x)+Math.abs(t.y-a.y))):0;const v=thr(t)*100+near-T_INFO[terAt(t.x,t.y)].def*3;if(v<bv){bv=v;bt=t}}
    if(bt&&thr(bt)>0){/* nowhere safe: fall through and fight from the best tile */}else return{path:bt?pathTo(R,u,bt.x,bt.y):[],target:null}}
  let best=null;
  for(const t of tiles){const tt=terAt(t.x,t.y);
    for(const p of foes){const dist=Math.abs(t.x-p.x)+Math.abs(t.y-p.y);if(!inRange(u.type,dist))continue;
      const ranged=dist>1,deal=Math.min(p.troops,tf(u)*dmgCalc(u.type,u.war,u.troops,p.type,terAt(p.x,p.y),ranged,false));
      const left=p.troops-deal,take=inRange(p.type,dist)?tf(p)*dmgCalc(p.type,p.war,(p.troops+left)/2,u.type,tt,ranged,false)*.65:0;
      if(u.cmd&&(u.troops-take*1.4<u.max*.5||thr(t)-(left<=0?1:0)>1))continue;
      const sc=deal-take*(u.cmd?1.6:.7)+(left<=0?300:0)+(p.cmd?90:0)+T_INFO[tt].def*25;
      if(!best||sc>best.sc)best={sc,t,p}}}
  if(best)return{path:pathTo(R,u,best.t.x,best.t.y),target:best.p};
  const F=field(foes,u.type);let bt=null,bv=Infinity;
  for(const t of tiles){const v=F[t.y][t.x]-T_INFO[terAt(t.x,t.y)].def*.3+thr(t)*40;if(v<bv){bv=v;bt=t}}
  return{path:bt?pathTo(R,u,bt.x,bt.y):[],target:null}}
async function autoTurn(){
  if(!G||!G.auto||G.over||G.phase!=='player')return;G.busy=true;G.sel=null;G.reach=null;G.mode='idle';updateUI();
  const order={archer:0,cav:1,spear:2,shield:3};
  const list=G.units.filter(u=>u.side==='shu'&&!u.acted).sort((a,b)=>(a.cmd?9:order[a.type])-(b.cmd?9:order[b.type]));
  for(const u of list){if(!G.auto||G.over)break;if(!G.units.includes(u))continue;
    const plan=planAuto(u);G.view=u;updateUI();
    if(plan.path.length){await animateMove(u,plan.path);await sleep(80)}
    if(plan.target&&G.units.includes(u)&&G.units.includes(plan.target)){await doAttack(u,plan.target,{});if(checkEnd()){G.busy=false;return}}
    u.acted=true;await sleep(100)}
  G.busy=false;
  if(!G.auto){autoSel();updateUI();return}
  if(!G.over)endTurn()}""")
rep("G.view=null;log(`Turn ${G.turn}.`);autoSel();updateUI()}",
    "G.view=null;log(`Turn ${G.turn}.`);autoSel();updateUI();if(G.auto)setTimeout(autoTurn,250)}")
rep("$('#retreatBtn').disabled=G.phase!=='player'||G.busy||G.over;",
    "$('#retreatBtn').disabled=G.over||(!G.auto&&(G.phase!=='player'||G.busy));$('#retreatBtn').textContent=G.auto?'Stop auto':'Retreat';$('#retreatBtn').classList.toggle('autoon',!!G.auto);")
rep('.cmdpick.on{color:#1a140c;', '''.rchoice{display:flex;flex-direction:column;gap:8px;margin-top:4px}
.rchoice button{display:flex;flex-direction:column;align-items:flex-start;gap:3px;text-align:left;padding:10px 14px;border-radius:10px;background:#211a12;border:1px solid #6b5636;color:var(--paper)}
.rchoice button b{font-size:16px}.rchoice button small{color:var(--muted);font-size:12.5px;line-height:1.35}
.rchoice button[data-r=flee] b{color:#ff9b8c}.rchoice button[data-r=auto] b{color:#f3dc9a}
#retreatBtn.autoon{background:#7e2a21;border-color:#e88b7f;color:#fff;animation:autoPulse 1.2s ease-in-out infinite}
@keyframes autoPulse{50%{box-shadow:0 0 0 4px rgba(232,139,127,.35)}}
.cmdpick.on{color:#1a140c;''')

rep("function endGame(win,text,retreat){G.over=true;","function endGame(win,text,retreat){if(G.auto){G.auto=false;speed=G.autoSpeed??speed}G.over=true;")

# ---- sound hooks inside battles
rep("async function playBattle(att,def,r){await sprWait();return playBattle0(att,def,r)}",
 "async function playBattle(att,def,r){await sprWait();if(speed){if(r.charge)SND.fx('gallop');SND.fx('shout',.15);const rng=att.type==='archer'||(def.type==='archer'&&r.ctrOn);if(rng)SND.fx('arrows',.35);if(att.type!=='archer'||(r.ctrOn&&def.type!=='archer'))SND.fx('melee',r.charge?1.1:.7)}return playBattle0(att,def,r)}")
rep("async function doAttack(a,d,o={}){","async function doAttack(a,d,o={}){if(!speed)SND.fx(manh(a,d)>1?'arrows':'hit');")
rep("function playFire(u,e,dmg,before){","function playFire(u,e,dmg,before){SND.fx('fire');")
rep("A.sparked=true;burst(W/2","A.sparked=true;SND.fx(A.pc==='crit'||A.ec==='crit'?'crit':'clash');burst(W/2")
rep("async function playDuel(P,E){await sprWait();return playDuel0(P,E)}","async function playDuel(P,E){await sprWait();SND.music('duel');SND.fx('drum');SND.fx('drum',.4);try{return await playDuel0(P,E)}finally{SND.music('battle')}}")
rep("G.captured.push(u.id);float(u,'擒 Captured','#ff8a78')","G.captured.push(u.id);SND.fx('capture');float(u,'擒 Captured','#ff8a78')")
rep("function cutIn(u,h){if(speed===0)return Promise.resolve();","function cutIn(u,h){if(speed===0)return Promise.resolve();SND.fx('special');")
rep("function endGame(win,text,retreat){","function endGame(win,text,retreat){SND.fx(win?'victory':'defeat');SND.music(win?'victory':'defeat');")
# mute buttons: campaign header + battle pills
rep('<button id="menuBtn" class="iconbtn" aria-label="Menu">','<button class="iconbtn sndbtn" onclick="soundDlg()" aria-label="Mute sound">🔊</button><button id="menuBtn" class="iconbtn" aria-label="Menu">')
rep('<div class="pills"><button id="fsBtn" class="pill" aria-label="Fullscreen">⛶ Full</button>','<div class="pills"><button class="pill sndbtn" onclick="soundDlg()" aria-label="Mute sound">🔊</button><button id="fsBtn" class="pill" aria-label="Fullscreen">⛶ Full</button>')
rep("showScreen('title');renderTitle();","showScreen('title');renderTitle();updSndBtns();")

# ---- keep fullscreen across app switches: browsers drop it when the tab is hidden,
# and only a tap may turn it back on, so re-enter on the first tap after returning
rep("function toggleFull(){try{if(document.fullscreenElement)document.exitFullscreen();",
    "function toggleFull(){try{if(document.fullscreenElement){FS.want(false);document.exitFullscreen()}else FS.want(true);if(document.fullscreenElement);")
rep("document.addEventListener('fullscreenchange',()=>{const f=!!document.fullscreenElement;",
r"""var FS=(()=>{let want=false,hidAt=0;try{want=localStorage.getItem('rtk3-fs')==='1'}catch(e){}
  const set=v=>{want=v;try{localStorage.setItem('rtk3-fs',v?'1':'0')}catch(e){}};
  document.addEventListener('visibilitychange',()=>{if(document.hidden)hidAt=performance.now()});
  addEventListener('pagehide',()=>{hidAt=performance.now()});
  document.addEventListener('fullscreenchange',()=>{if(document.fullscreenElement){set(true);return}
    // left fullscreen: if the page is (about to be) hidden it was an app switch, keep the wish; otherwise the player chose to leave
    setTimeout(()=>{if(!document.hidden&&performance.now()-hidAt>1500)set(false)},600)});
  const back=()=>{if(want&&!document.fullscreenElement&&!document.hidden&&matchMedia('(pointer:coarse)').matches){const d=document.documentElement;
    try{(d.requestFullscreen?d.requestFullscreen({navigationUI:'hide'}):d.webkitRequestFullscreen()).then?.(()=>{try{screen.orientation.lock('landscape').catch(()=>{})}catch(e){}}).catch?.(()=>{})}catch(e){}}};
  addEventListener('pointerup',back,{capture:true,passive:true});addEventListener('touchend',back,{capture:true,passive:true});
  return {want:set}})();
document.addEventListener('fullscreenchange',()=>{const f=!!document.fullscreenElement;""")

# QA: duel animation could run one frame after the duel closed
rep("function frame(now){const dt=Math.min(50,now-last);last=now;renderDuel(now,dt);if(D)requestAnimationFrame(frame)}",
    "function frame(now){if(!D)return;const dt=Math.min(50,now-last);last=now;renderDuel(now,dt);if(D)requestAnimationFrame(frame)}")

# ===== Fight-scene staging overhaul: two formations, bigger soldiers, generals behind lines,
# framed portraits, bold damage, dust / shake / zoom; lighter tactical-map overlays
rep("""function buildSide(u,side,before,after){
  const nB=Math.min(10,Math.ceil(before/100)),nA=Math.min(nB,Math.ceil(after/100)),face=side==='L'?1:-1,sol=[];
  const cav=u.type==='cav';
  for(let i=0;i<nB;i++){const col=Math.floor(i/5),row=i%5,y=GROUND+22+row*25,s=.92+row*.07;const hx=(cav?272:268)-col*(cav?74:54)-(row%2)*12;
    sol.push({i,col,row,hx:side==='L'?hx:W-hx,hy:y,s,tx:0,deathT:Infinity,fx:false,seed:Math.random()*6})}
  const ox=side==='L'?172:W-172;
  return{u,side,face,sol,nB,nA,before,after,off:{x:ox,hx:ox,tx:ox,y:GROUND+58,hy:GROUND+58,s:1.45,seed:1,deathT:Infinity}}}""",
"""function buildSide(u,side,before,after){
  const nB=Math.min(12,Math.ceil(before/100)),nA=Math.min(nB,Math.ceil(after/100)),face=side==='L'?1:-1,sol=[];
  const cav=u.type==="cav",ROWS4=4,gap=cav?82:70;
  // ranks (col 0 = front line) of 4 soldiers each, staggered, nearer rows larger
  for(let i=0;i<nB;i++){const col=Math.floor(i/ROWS4),row=i%ROWS4,y=GROUND+14+row*32,s=1.2+row*.09;const hx=322-col*gap-(row%2)*16+(row===0?6:0);
    sol.push({i,col,row,hx:side==='L'?hx:W-hx,hy:y,s,tx:0,deathT:Infinity,fx:false,seed:Math.random()*6})}
  const ox=side==='L'?112:W-112;
  return{u,side,face,sol,nB,nA,before,after,off:{x:ox,hx:ox,tx:ox,y:GROUND+62,hy:GROUND+62,s:1.85,seed:1,deathT:Infinity}}}""")
rep("""function setTargets(A,B,both){
  for(const s of A.sol){const sp=A.u.type==='cav'?58:44;
    if(both)s.tx=A.side==='L'?W/2-22-s.col*sp-(s.row%2)*8:W/2+22+s.col*sp+(s.row%2)*8;
    else{const front=B.side==='R'?W-232:232;s.tx=A.side==='L'?front-34-s.col*sp:front+34+s.col*sp}}
  const o=A.off,front=B.side==='R'?W-232:232;
  o.tx=both?(A.side==='L'?W/2-14:W/2+14):(A.side==='L'?front-26:front+26)}""",
"""function setTargets(A,B,both){
  const f=A.face,bf=B.sol.filter(s=>s.col===0).map(s=>s.hx),front=bf.length?(B.side==='R'?Math.min(...bf):Math.max(...bf)):(B.side==='R'?W-300:300);
  // only the front rank closes to the clash line; the ranks behind step up and hold
  const line=both?W/2:front-f*0;
  for(const s of A.sol){if(s.col===0)s.tx=line-f*(both?30:46)-f*(s.row%2)*10;else s.tx=s.hx+f*(both?52:70)}
  A.off.tx=A.off.hx+f*36}""")
rep("function schedule(S,n,kind){const pool=[...S.sol].sort(()=>Math.random()-.5);",
    "function schedule(S,n,kind){const pool=[...S.sol].sort((a,b)=>(kind==='arrow'?0:a.col-b.col)+(Math.random()-.5)*1.2);")
# only the front rank fights hand to hand
rep("fight:srd?false:S.ch?chf:S.hold?alive&&t>=1050&&t<=2500:S.melee&&alive&&t>=1500&&t<=2700,",
    "fight:srd?false:S.ch?chf:S.hold?alive&&t>=1050&&t<=2500&&s.col===0:S.melee&&alive&&t>=1500&&t<=2700&&s.col===0,")
rep("if((S.ch?chf:S.melee&&alive&&t>1500&&t<2700)&&Math.random()<.05*Math.min(dt,30)/16)",
    "if((S.ch?chf:S.melee&&alive&&s.col===0&&t>1500&&t<2700)&&Math.random()<.05*Math.min(dt,30)/16)")
# framed corner portraits
rep("""function drawBigPortrait(c,u,side){
  const im=portImg(u.id),F=FAC[u.side],h=246,w=h*512/768,x=side==='L'?-10:W-w+10,y=H-h+18;
  c.save();c.strokeStyle='rgba(212,173,85,.55)';c.lineWidth=3;c.beginPath();c.arc(side==='L'?86:W-86,H-62,92,0,Math.PI*2);c.stroke();c.lineWidth=1;c.beginPath();c.arc(side==='L'?86:W-86,H-62,102,0,Math.PI*2);c.stroke();c.restore();
  if(im){c.drawImage(fadePort(im),x,y,w,h)}""",
"""function drawBigPortrait(c,u,side){
  const im=portImg(u.id),F=FAC[u.side],h=132,w=88,x=side==='L'?10:W-w-10,y=H-h-10;
  c.save();c.shadowColor='rgba(0,0,0,.6)';c.shadowBlur=10;c.fillStyle='#14110d';rr(c,x-3,y-3,w+6,h+6,8);c.fill();c.restore();
  if(im){c.save();rr(c,x,y,w,h,6);c.clip();c.drawImage(im,0,40,512,688,x,y,w,h);c.restore()}
  c.strokeStyle=F.main;c.lineWidth=3;rr(c,x,y,w,h,6);c.stroke();c.strokeStyle='rgba(212,173,85,.8)';c.lineWidth=1;rr(c,x-3,y-3,w+6,h+6,8);c.stroke();
  if(im)return;""")
rep("  const x0=176,x1=W-176,y=H-64,cxm=W/2;","  const x0=112,x1=W-112,y=H-62,cxm=W/2;")
# bold damage numbers that pop above each army
rep("""      if(t>2750){const p=clamp((t-2750)/1000);c.globalAlpha=Math.min(1,p*3)*(1-Math.max(0,p-.8)*5);c.font='700 30px "Alegreya Sans", sans-serif';c.textAlign='center';c.lineWidth=4;c.strokeStyle='#14110d';
        for(const S of [SL,SR]){const loss=S.before-S.after;if(!loss)continue;const x=S.side==='L'?190:W-190,y=GROUND-6-p*24;c.strokeText('−'+loss,x,y);c.fillStyle='#ff9a86';c.fillText('−'+loss,x,y)}c.globalAlpha=1}""",
"""      for(const S of [SL,SR]){const loss=S.before-S.after;if(!loss)continue;const t0=kindOf(S)==='arrow'?1450:1750;if(t<t0)continue;const p=clamp((t-t0)/1600);
        const pop=p<.12?.6+p/.12*.55:p<.2?1.15-(p-.12)/.08*.15:1,a=p>.8?1-(p-.8)/.2:1;
        c.save();c.globalAlpha=a;c.translate(S.side==='L'?W/2-120:W/2+120,GROUND-34-p*26);c.scale(pop,pop);c.font='900 46px "Alegreya Sans", sans-serif';c.textAlign='center';c.lineJoin='round';
        c.lineWidth=8;c.strokeStyle='#14110d';c.strokeText('−'+loss,0,0);c.fillStyle=S.u.side==='shu'?'#ffb4a6':'#ffe08a';c.fillText('−'+loss,0,0);c.restore()}""")
# dust at the clash line, small shake on heavy hits, gentle zoom while the lines meet
rep("      const c=sctx,CS=SL.ch?SL:SR.ch?SR:null,cam=chCam(CS,t),",
    """      const both2=SL.melee&&SR.melee,heavy=Math.max((SL.before-SL.after)/Math.max(1,SL.before),(SR.before-SR.after)/Math.max(1,SR.before));
      const zk=1+(both2||SL.ch||SR.ch?.07:.03)*Math.sin(Math.PI*clamp((t-1300)/1700)),sh=t>1550&&t<1950?Math.min(6,2+heavy*14)*Math.sin(t*.09)*(1-(t-1550)/400):0;
      sctx.save();sctx.translate(W/2+sh,GROUND+40+sh*.4);sctx.scale(zk,zk);sctx.translate(-W/2,-(GROUND+40));
      const c=sctx,CS=SL.ch?SL:SR.ch?SR:null,cam=chCam(CS,t),""")
rep("      stepParts(c,dt);c.restore();if(r.tint){c.fillStyle=r.tint;c.fillRect(0,0,W,H)}",
    """      if((both2||(SL.melee||SR.melee))&&t>1450&&t<2800&&Math.random()<.5*Math.min(dt,30)/16)DUST.push({x:W/2+(both2?0:(SL.melee?120:-120))+(Math.random()-.5)*90,y:GROUND+20+Math.random()*100,r:10+Math.random()*16,life:1});
      DUST=DUST.filter(d=>d.life>0);for(const d of DUST){d.life-=dt/1100;d.r+=dt*.025;d.y-=dt*.008;c.globalAlpha=.32*d.life;const g=c.createRadialGradient(d.x,d.y,0,d.x,d.y,d.r);g.addColorStop(0,'#c8a87a');g.addColorStop(1,'rgba(200,168,122,0)');c.fillStyle=g;c.beginPath();c.arc(d.x,d.y,d.r,0,Math.PI*2);c.fill()}c.globalAlpha=1;
      stepParts(c,dt);c.restore();sctx.restore();if(r.tint){c.fillStyle=r.tint;c.fillRect(0,0,W,H)}""")
rep("function playBattle0(att,def,r){","let DUST=[];\nfunction playBattle0(att,def,r){")
rep("parts=[];\n    const END=4100,start=performance.now();","parts=[];DUST=[];\n    const END=4100,start=performance.now();")
# tactical map: outlines instead of heavy blocks; floats above the unit
rep("hl(t,'rgba(60,120,255,.34)','rgba(150,195,255,.85)')","hl(t,'rgba(60,120,255,.13)','rgba(150,200,255,.95)')")
rep("hl(t,'rgba(235,60,50,.30)','rgba(255,140,120,.85)')","hl(t,'rgba(235,60,50,.10)','rgba(255,140,120,.9)')")
rep("c.fillStyle=`rgba(215,55,40,${.32+pulse*.2})`;c.fillRect(e.x*T+1,e.y*T+1,T-2,T-2);","c.fillStyle=`rgba(215,55,40,${.12+pulse*.12})`;c.fillRect(e.x*T+1,e.y*T+1,T-2,T-2);")
rep("if(G.enemyTiles){c.fillStyle='rgba(200,70,50,.28)';","if(G.enemyTiles){c.fillStyle='rgba(200,70,50,.15)';")
rep("""c.font=`700 ${Math.round(T*.34)}px "Alegreya Sans", sans-serif`;c.textAlign='center';c.lineWidth=3;c.strokeStyle='#14110d';const yy=f.y*T+T*.3-p*T*.6;""",
    """c.font=`900 ${Math.round(T*.4)}px "Alegreya Sans", sans-serif`;c.textAlign='center';c.lineWidth=5;c.lineJoin='round';c.strokeStyle='#14110d';const yy=f.y*T-T*.02-p*T*.55;""")

# smaller head-and-shoulders portraits beside the troop bar
rep("const im=portImg(u.id),F=FAC[u.side],h=132,w=88,x=side==='L'?10:W-w-10,y=H-h-10;","const im=portImg(u.id),F=FAC[u.side],h=66,w=66,x=side==='L'?10:W-w-10,y=H-h-6;")
rep("if(im){c.save();rr(c,x,y,w,h,6);c.clip();c.drawImage(im,0,40,512,688,x,y,w,h);c.restore()}","if(im){c.save();rr(c,x,y,w,h,6);c.clip();c.drawImage(im,86,30,340,340,x,y,w,h);c.restore()}")
rep("  const x0=112,x1=W-112,y=H-62,cxm=W/2;","  const x0=84,x1=W-84,y=H-62,cxm=W/2;")

# bigger soldiers and officers now the portraits are small
rep("const cav=u.type===\"cav\",ROWS4=4,gap=cav?82:70;","const cav=u.type===\"cav\",ROWS4=4,gap=cav?96:84;")
rep("y=GROUND+14+row*32,s=1.2+row*.09;const hx=322-col*gap-(row%2)*16+(row===0?6:0);","y=GROUND+10+row*40,s=1.5+row*.12;const hx=338-col*gap-(row%2)*18+(row===0?6:0);")
rep("const ox=side==='L'?112:W-112;\n  return{u,side,face,sol,nB,nA,before,after,off:{x:ox,hx:ox,tx:ox,y:GROUND+62,hy:GROUND+62,s:1.85,","const ox=side==='L'?92:W-92;\n  return{u,side,face,sol,nB,nA,before,after,off:{x:ox,hx:ox,tx:ox,y:GROUND+74,hy:GROUND+74,s:2.35,")
rep("const ox=side==='L'?92:W-92;","const ox=side==='L'?104:W-104;")
rep("A.off.tx=A.off.hx+f*36}","A.off.tx=A.off.hx+f*22}")

# whole army melee: every rank charges in, staggered, some cross into the enemy line
rep("sol.push({i,col,row,hx:side==='L'?hx:W-hx,hy:y,s,tx:0,deathT:Infinity,fx:false,seed:Math.random()*6})}","sol.push({i,col,row,hx:side==='L'?hx:W-hx,hy:y,s,tx:0,deathT:Infinity,fx:false,seed:Math.random()*6,dl:col*90+Math.random()*220})}")
rep("  for(const s of A.sol){if(s.col===0)s.tx=line-f*(both?30:46)-f*(s.row%2)*10;else s.tx=s.hx+f*(both?52:70)}",
"""  for(const s of A.sol){const r=Math.random();
    if(both&&r<.28)s.tx=line+f*(18+Math.random()*70);            // broke through into the enemy ranks
    else s.tx=line-f*((both?16:40)+s.col*30+Math.random()*48);    // pressing in behind / beside the front
  }""")
rep("if(t<600)return s.hx;if(t<1500)return lerp(s.hx,s.tx,ease((t-600)/900));","const d=s.dl||0;if(t<600+d)return s.hx;if(t<1500+d)return lerp(s.hx,s.tx,ease((t-600-d)/900));")
rep("S.melee&&alive&&s.col===0&&t>1500&&t<2700","S.melee&&alive&&t>1500+(s.dl||0)&&t<2700")
rep("S.melee&&alive&&t>=1500&&t<=2700&&s.col===0","S.melee&&alive&&t>=1500+(s.dl||0)&&t<=2700")

# generals ride into the melee: face the enemy general when both charge, else cut into the soldiers
rep("  A.off.tx=A.off.hx+f*22}","  A.off.tx=both?line-f*58:line-f*40}")

# capture sheet was drawn ~1.6x larger than the mounted general; match sizes
rep("const sh=sprSheet('general_cap',sprFac(f.fac));if(!sh)return false;const k=84/150;","const sh=sprSheet('general_cap',sprFac(f.fac));if(!sh)return false;const k=52/150;")

# Brace (spear Guard): covers 2 squares all round incl. diagonals, stops spear AND cavalry attacks
rep("if(e.type==='cav'){const g=G.units.find(u=>u.side==='shu'&&u.guard&&Math.max(Math.abs(u.x-tgt.x),Math.abs(u.y-tgt.y))<=1);",
    "if(e.type==='cav'||e.type==='spear'){const g=G.units.filter(u=>u.side==='shu'&&u.guard&&Math.max(Math.abs(u.x-tgt.x),Math.abs(u.y-tgt.y))<=2).sort((a,b)=>(a===tgt?-1:b===tgt?1:Math.max(Math.abs(a.x-tgt.x),Math.abs(a.y-tgt.y))-Math.max(Math.abs(b.x-tgt.x),Math.abs(b.y-tgt.y))))[0];")
rep("`${nm(g)} meets ${nm(e)}'s charge with braced spears!`:`${nm(g)} braces spears and intercepts ${nm(e)}'s charge on ${nm(tgt)}!`","`${nm(g)} meets ${nm(e)}'s ${e.type==='cav'?'charge':'spears'} with braced spears!`:`${nm(g)} braces spears and intercepts ${nm(e)}'s ${e.type==='cav'?'charge':'attack'} on ${nm(tgt)}!`")
rep("c.strokeRect((g.x-1)*T+2,(g.y-1)*T+2,3*T-4,3*T-4);c.fillStyle='rgba(212,173,85,.08)';c.fillRect((g.x-1)*T+2,(g.y-1)*T+2,3*T-4,3*T-4)","c.strokeRect((g.x-2)*T+2,(g.y-2)*T+2,5*T-4,5*T-4);c.fillStyle='rgba(212,173,85,.08)';c.fillRect((g.x-2)*T+2,(g.y-2)*T+2,5*T-4,5*T-4)")
rep("desc:'Until the enemy turn ends, intercept any cavalry attack on a unit within 1 square'","desc:'Until the enemy turn ends, intercept any cavalry or spear attack on a unit within 2 squares (diagonals included)'")
rep("intercepts cavalry attacks on any unit within 1 square, with full counter.","intercepts cavalry and spear attacks on any unit within 2 squares (diagonals included), with full counter.")
rep("braces spears. Cavalry attacking within 1 square will meet him instead.","braces spears. Cavalry or spearmen attacking within 2 squares will meet him instead.")

# preload + decode special cut-in portraits at battle start so the cut-in shows instantly
rep("const CUTIN=document.createElement('div');","""const SPC={};function spPre(p){if(!p||SPC[p])return SPC[p];const im=new Image();im.decoding='async';const pr=new Promise(r=>{im.onload=()=>{(im.decode?im.decode():Promise.resolve()).catch(()=>{}).then(()=>r(im))};im.onerror=()=>{if(!im.dataset.fb){im.dataset.fb=1;im.src='portraits/'+p+'.webp'}else r(null)}});im.src='portraits/sp_'+p+'.png';SPC[p]={im,pr};return SPC[p]}
function spPreAll(units){for(const u of units||[])if(PORT[u.id])spPre(PORT[u.id])}
const CUTIN=document.createElement('div');""")
rep("function cutIn(u,h){if(speed===0)return Promise.resolve();SND.fx('special');return new Promise(res=>{const p=PORT[u.id];",
    "async function cutIn(u,h){if(speed===0)return;const P0=PORT[u.id]&&spPre(PORT[u.id]);if(P0&&!P0.im.complete)await Promise.race([P0.pr,sleep(450)]);SND.fx('special');return new Promise(res=>{const p=PORT[u.id];")
rep("setTimeout(()=>sprWait(),0);G={units:","setTimeout(()=>{sprWait();spPreAll(cfg.units)},0);G={units:")

# skill cut-in portraits are now ~30KB webp
rep("im.src='portraits/sp_'+p+'.png'","im.src='portraits/sp_'+p+'.webp'")
rep('src="portraits/sp_${p}.png"','src="portraits/sp_${p}.webp"')

# only these generals have special cut-in art; others use their normal portrait directly
rep("const SPC={};function spPre(p){","const SPS=new Set(['yueshuang','nuwa','fentian','xuannu','gan_ning','guan_yu','huang_zhong','wei_yan','xu_chu','zhang_fei','zhao_yun','zhuge_liang']);const SPC={};function spPre(p){")
rep("im.src='portraits/sp_'+p+'.webp';","im.src=SPS.has(p)?'portraits/sp_'+p+'.webp':'portraits/'+p+'.webp';if(!SPS.has(p))im.dataset.fb=1;")
rep('src="portraits/sp_${p}.webp"','src="portraits/${SPS.has(p)?\'sp_\':\'\'}${p}.webp"')

# portrait crops were authored for 512px-wide art; scale to the real image width (webp portraits are 360px)
rep("const PIMG={};","const PIMG={};const PK=im=>(im.naturalWidth||512)/512;")
rep("c.drawImage(im,86,30,340,340,x,y,w,h)","{const k=PK(im);c.drawImage(im,86*k,30*k,340*k,340*k,x,y,w,h)}")
rep("drawImage(pim,96,36,320,264,-s/2+2,-s/2+2,s-4,s*.84-4)","drawImage(pim,96*PK(pim),36*PK(pim),320*PK(pim),264*PK(pim),-s/2+2,-s/2+2,s-4,s*.84-4)")
rep("c.drawImage(pim,96,36,320,320,bx+1,22,40,40)","c.drawImage(pim,96*PK(pim),36*PK(pim),320*PK(pim),320*PK(pim),bx+1,22,40,40)")

# per-type size normalisation: the spear sheet's figures are drawn ~22% shorter than shield/archer
rep("const cv=f.type==='cav'||f.officer,k=(f.officer?84:cv?74:58)/150;","const cv=f.type==='cav'||f.officer,k=(f.officer?84:cv?74:f.type==='spear'?71:f.type==='archer'?62:58)/150;")

# ---- pre-battle preparation: scout the field and pick each officer's troop type ----
rep("#cutin[hidden]{display:none}","""#cutin[hidden]{display:none}
#prepBar{position:fixed;left:50%;bottom:max(10px,env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:8;display:flex;align-items:center;gap:10px;background:rgba(18,15,11,.92);border:1px solid var(--gold,#d4ad55);border-radius:14px;padding:8px 10px 8px 14px;box-shadow:0 6px 20px rgba(0,0,0,.5);max-width:calc(100vw - 24px)}
#prepBar[hidden]{display:none}
#prepBar .pt{font-size:13px;color:#ece2c9;line-height:1.25}#prepBar .pt b{color:#f3dc9a}
#prepBar button{white-space:nowrap}
.prep-foe{display:flex;flex-wrap:wrap;gap:6px;margin:4px 0 10px}
.prep-foe span{background:rgba(160,60,50,.18);border:1px solid rgba(220,120,100,.35);border-radius:10px;padding:3px 9px;font-size:13px}
.prep-row{display:grid;grid-template-columns:minmax(96px,1fr) auto;gap:4px 10px;align-items:center;padding:8px 0;border-top:1px solid rgba(212,173,85,.18)}
.prep-row .pn b{display:block}.prep-row .pn small{color:var(--muted,#a99a7c)}
.prep-types{display:flex;gap:5px}
.prep-types button{min-width:54px;padding:5px 6px;display:flex;flex-direction:column;align-items:center;line-height:1.1;border-radius:9px}
.prep-types button .zh{font-size:17px;font-weight:900}.prep-types button small{font-size:10px}
.prep-types button.on{background:var(--gold,#d4ad55);color:#1a140c;border-color:var(--gold,#d4ad55)}
.prep-hint{grid-column:1/-1;font-size:12px;color:var(--muted,#a99a7c)}.prep-hint .adv{color:#8fd19a}.prep-hint .dis{color:#e88b7f}""")
rep("G.phase==='player'?'Your move':","G.phase==='prep'?'Preparation':G.phase==='player'?'Your move':")
rep("""  if(G.phase!=='player'||G.busy||G.over)return;
  const r=MC.getBoundingClientRect()""","""  if(G.phase==='prep'){const r=MC.getBoundingClientRect(),x=Math.floor((e.clientX-r.left)/T),y=Math.floor((e.clientY-r.top)/T);const u=inb(x,y)&&unitAt(x,y);if(u){G.view=u;updateUI()}return}
  if(G.phase!=='player'||G.busy||G.over)return;
  const r=MC.getBoundingClientRect()""")
rep("  $('#logPanel').hidden=true;resizeMap();autoSel();updateUI();","  $('#logPanel').hidden=true;resizeMap();G.phase='prep';G.view=pc;updateUI();setTimeout(()=>prepDlg(),120);")
rep("function log(h){","""const TZH={spear:'槍',shield:'盾',archer:'弓',cav:'騎'},TSHORT={spear:'Spear',shield:'Shield',archer:'Archer',cav:'Cavalry'};
function prepBar(show){let b=document.getElementById('prepBar');if(!b){b=document.createElement('div');b.id='prepBar';b.innerHTML=`<div class="pt"><b>Preparation</b><br>Drag to scout · tap a unit to inspect</div><button data-p="types">兵 Troop types</button><button data-p="go" class="primary">Begin battle</button>`;
  b.onclick=e=>{const k=e.target.closest('[data-p]');if(!k)return;if(k.dataset.p==='go')prepBegin();else prepDlg()};$('#battleView').appendChild(b)}b.hidden=!show}
function prepHint(t){const foes=G.units.filter(u=>u.side==='wei');const good=foes.filter(f=>typeMult(t,f.type)>1),bad=foes.filter(f=>typeMult(f.type,t)>1&&typeMult(t,f.type)<=1);
  return [good.length?`<span class="adv">strong vs ${good.map(f=>f.name).join(', ')}</span>`:'',bad.length?`<span class="dis">vulnerable to ${bad.map(f=>f.name).join(', ')}</span>`:''].filter(Boolean).join(' · ')||'no clear match-ups'}
async function prepDlg(){if(!G||G.phase!=='prep')return;prepBar(false);
  for(;;){const foes=G.units.filter(u=>u.side==='wei'),mine=G.units.filter(u=>u.side==='shu');
    const r=await dialog(`<h2>Battle preparation</h2><p class="muted">Choose each officer's troop type. Scout first to see the ground. The change applies to this battle only.</p>
      <div class="muted" style="font-size:12px">ENEMY FORCES</div><div class="prep-foe">${foes.map(f=>`<span>${TZH[f.type]||'兵'} <b>${f.name}</b> · ${TSHORT[f.type]||f.type} · ${fmt(f.troops)}</span>`).join('')}</div>
      <div class="muted" style="font-size:12px">YOUR OFFICERS</div>${mine.map(u=>`<div class="prep-row"><div class="pn"><b>${u.name}${u.cmd?' ★':''}</b><small>${fmt(u.troops)} troops · War ${u.war}</small></div><div class="prep-types">${['spear','shield','archer','cav'].map(t=>`<button data-r="t:${u.id}:${t}" class="${u.type===t?'on':''}"><span class="zh">${TZH[t]}</span><small>${TSHORT[t]}</small></button>`).join('')}</div><div class="prep-hint">${prepHint(u.type)}</div></div>`).join('')}`,
      [['scout','Scout field'],['go','Begin battle','primary']]);
    if(r.startsWith('t:')){const [,id,t]=r.split(':'),u=G.units.find(x=>x.id===id&&x.side==='shu');if(u&&TYPES[t]&&u.type!==t){u.type=t;u.cd={}}updateUI();continue}
    if(r==='go'){prepBegin();return}
    prepBar(true);return}}
function prepBegin(){if(!G||G.phase!=='prep')return;prepBar(false);G.phase='player';
  const ch=G.units.filter(u=>u.side==='shu').map(u=>`${nm(u)}: ${TYPES[u.type].n}`).join(', ');log(`The battle begins. ${ch}.`);autoSel();updateUI()}
function log(h){""")

# East Wind no longer ends Zhuge Liang's turn: he can move / cast Fire straight after
rep("s.cd.fire=0;await sleep(900)}","s.cd.fire=0;keep=true;await sleep(900)}")
rep("desc:'His next Fire deals ×2 and spreads to adjacent enemies'}","desc:'Does not end his turn. His next Fire deals ×2 and spreads to adjacent enemies'}")
rep("${nm(s)}'s next Fire will be doubled and spread.`","${nm(s)}'s next Fire will be doubled and spread. He can still act this turn.`")

# ---- Joint attack (合擊): every friendly unit adjacent to the target strikes together; no counter, no turns used; once per turn ----
rep("    ah+=rb('data-a=\"duel\" title=\"Challenge an adjacent officer\"','挑','Duel',duelTargets(s).length>0);",
"    {const jt=jointTargets(s);if(jt.length||G.jointTurn===G.turn)ah+=rb(`data-a=\"joint\" title=\"${G.jointTurn===G.turn?'Already used this turn':'Every unit next to the enemy strikes together. Only the leader takes a counter-attack; no turns used. Once per turn.'}\"`,'合','Joint',jt.length>0,'atk')}\n    ah+=rb('data-a=\"duel\" title=\"Challenge an adjacent officer\"','挑','Duel',duelTargets(s).length>0);")
rep("  if(a==='wait'){finish(s);return}","  if(a==='joint'){G.prevMode=G.mode;G.tmode='joint';G.targets=jointTargets(s).map(e=>{const ps=jointParts(e);return{u:e,note:`${ps.length} units · deal ~${ps.reduce((n,u)=>n+forecast(u,e).deal,0)} · ${s.name} takes ~${forecast(s,e).take}`}});G.mode='target'}\n  if(a==='wait'){finish(s);return}")
rep("  if(mode==='charge')await doCharge(s,t);","  if(mode==='joint'){await doJoint(s,t);G.busy=false;if(checkEnd())return;if(G.units.includes(s)){G.mode='moved';G.reach=reachFrom(s,G.origin)}else autoSel();updateUI();return}\n  if(mode==='charge')await doCharge(s,t);")
rep("function hitTarget(u){","""const jointParts=e=>G.units.filter(u=>u.side==='shu'&&manh(u,e)===1);
function jointTargets(s){if(!G||G.jointTurn===G.turn)return[];return enemies().filter(e=>manh(s,e)===1&&jointParts(e).length>=2)}
async function doJoint(s,t){G.jointTurn=G.turn;const ps=[s,...jointParts(t).filter(u=>u!==s)],before=t.troops;
  log(`<b>Joint attack!</b> ${ps.map(nm).join(', ')} fall on ${nm(t)} together.`);
  await doAttack(s,t,{label:'Joint Attack',verb:'leads a joint attack on'});
  for(const u of ps.slice(1)){if(!G.units.includes(t)||t.troops<=0)break;quickHit(u,t,1,{color:'#ffd27a'})}
  log(`Joint attack: ${nm(t)} loses ${before-Math.max(0,t.troops)} troops. Your units keep their turns.`);sweep()}
function hitTarget(u){""")
rep("intercepts cavalry and spear attacks on any unit within 2 squares (diagonals included), with full counter.","intercepts cavalry and spear attacks on any unit within 2 squares (diagonals included), with full counter. <b>Joint attack</b> (合, any unit): when 2 or more of your units stand next to one enemy, all of them strike it together, including units that already moved. Only the general who leads it takes a counter-attack, and no unit uses up its turn. Once per turn.")

# biography popup styles
rep("#cutin[hidden]{display:none}","""#cutin[hidden]{display:none}
.biob{padding:0;border:0;background:none;cursor:zoom-in;display:block;line-height:0;border-radius:4px}
.biob:focus-visible{outline:2px solid var(--gold,#d4ad55)}
#dlgbox.biobox{max-width:min(860px,96vw)}
.bio{display:grid;grid-template-columns:auto 1fr;gap:16px;align-items:start}
.biop img{height:calc(100dvh - 130px);max-height:520px;width:auto;max-width:34vw;border-radius:8px;border:1px solid var(--line);display:block;box-shadow:0 6px 18px rgba(0,0,0,.5)}
.biot{max-height:calc(100dvh - 130px);overflow:auto;padding-right:4px}
.bioh{display:flex;gap:12px;align-items:center}.bioh h2{margin:0}.bioh p{margin:2px 0 0}
.bioz{font-family:var(--f-zh);font-weight:900;font-size:30px;color:#f3dc9a;line-height:1;white-space:nowrap}
.biof{margin:8px 0}.biofac{color:#fff;border-radius:6px;padding:1px 7px;font-size:12px;margin-right:4px}
.bstats{display:grid;grid-template-columns:repeat(2,1fr);gap:4px 12px;margin:6px 0 4px}
.bst{display:grid;grid-template-columns:34px 26px 1fr;align-items:center;gap:6px;font-size:13px}.bst span{color:var(--muted)}
.bst i{display:block;height:6px;border-radius:3px;background:var(--gold,#d4ad55)}
.biot h3{margin:12px 0 2px;font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:var(--gold,#d4ad55)}
.biot p{margin:0 0 4px;line-height:1.5}.biot ul{margin:2px 0 4px;padding-left:18px;line-height:1.5}
@media (max-width:620px){.bio{grid-template-columns:1fr}.biop img{height:auto;max-height:30dvh;max-width:100%;width:auto;margin:0 auto}.biot{max-height:calc(70dvh - 190px)}}""")
rep(".biof{margin:8px 0}",".biof{margin:8px 0}.biotr{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0 0}.biotr span{background:rgba(212,173,85,.14);border:1px solid rgba(212,173,85,.45);border-radius:8px;padding:3px 8px;font-size:13px}.trmk{font-family:var(--f-zh);color:var(--gold,#d4ad55);font-size:12px}")

# ---- female general battle sprite (fgeneral_<fac>.png); no turn/capture sheets yet, so those fall back to flip / defeat frames
rep("f:{cap:true,","f:{cap:true,fem:femKey(S.u),",6)
rep("officer:true,ch:S.u.ch,","officer:true,ch:S.u.ch,fem:femKey(S.u),",2)
rep("function sprLoad(fk){return ['spear','shield','archer','cav','general',","const FEM=new Set(['sunshangxiang','daqiao','xiaoqiao','diaochan','huangyueying','guanyinping','zhurong','caiwenji','zhenji','zhangchunhua','ladygan','ladymi','xuannu','nuwa','fentian','yueshuang']);const GSHEET={sunshangxiang:'f_sunshangxiang',lubu:'f_lubu',huangwenjing:'f_huangwenjing',huangyueying:'f_huangyueying',diaochan:'f_diaochan',guanyinping:'f_guanyinping',guanyu:'g_guanyu',hero:'g_hero',yueshuang:'g_yueshuang',fentian:'g_fentian',nuwa:'g_nuwa',xuannu:'g_xuannu'};const isFem=u=>!!u&&FEM.has(u.id);const femKey=u=>!u?false:GSHEET[u.id]||(FEM.has(u.id)?'fgeneral':false);\nfunction sprLoad(fk){return ['spear','shield','archer','cav','general','fgeneral',...Object.values(GSHEET),")
rep("const tkey=f.officer?'general':f.type;","const tkey=f.officer?(f.fem||'general'):f.type;")
rep("if(f.cap){if(drawCap(c,f))return;f={...f,officer:true,defeat:1,type:'cav'}}","if(f.cap){if(!f.fem&&drawCap(c,f))return;f={...f,officer:true,defeat:1,type:'cav'}}")
rep("if(f.officer){const sh=sprSheet('general',sprFac(f.fac));if(sh){drawSprite(c,f,sh);return}}","if(f.officer){const sh=sprSheet(f.fem||'general',sprFac(f.fac));if(sh){drawSprite(c,f,sh);return}}")

# ---- goddess skills: Nine Heavens Sword Array, Mend the Sky, Burning Sky, Moonfrost ----
rep("for(const k of Object.keys(HERO))if(!['roar','sweep','lone','wind'].includes(k))delete HERO[k];","""Object.assign(HERO,{
 star:{who:'xuannu',zh:'九天劍陣',n:'Sword Array',targets:s=>starDirs(s),desc:'Starlight swords strike every enemy in a straight line of 6 squares. Pick a direction'},
 mend:{who:'nuwa',zh:'補天',n:'Mend the Sky',self:1,can:s=>true,desc:'Heal herself and adjacent allies 20%; they take half damage until her next turn'},
 burn:{who:'fentian',zh:'焚天',n:'Burning Sky',targets:s=>burnCentres(s),desc:'A 3×3 firestorm centred on a square 2 away: heavy fire damage to every enemy in it'},
 frost:{who:'yueshuang',zh:'月霜',n:'Moonfrost',self:1,can:s=>enemies().some(e=>Math.max(Math.abs(e.x-s.x),Math.abs(e.y-s.y))<=1),desc:'Freeze every enemy in the 3×3 around her: they cannot act next turn'}});
for(const k of Object.keys(HERO))if(!['roar','sweep','lone','wind','star','mend','burn','frost'].includes(k))delete HERO[k];
const ARW={'1,0':['→','East'],'-1,0':['←','West'],'0,1':['↓','South'],'0,-1':['↑','North']};
function starLine(s,dx,dy){const t=[];for(let i=1;i<=6;i++){const x=s.x+dx*i,y=s.y+dy*i;if(!inb(x,y))break;t.push({x,y})}return t}
function starDirs(s){return DIRS.map(([dx,dy])=>{const line=starLine(s,dx,dy);if(!line.length)return null;const hit=line.map(p=>unitAt(p.x,p.y)).filter(u=>u&&u.side!==s.side);const a=ARW[dx+','+dy];
  return{fake:1,x:line[0].x,y:line[0].y,dir:[dx,dy],area:line,label:`${a[0]} ${a[1]}`,name:a[1],type:'shield',note:hit.length?`hits ${hit.map(u=>u.name).join(', ')}`:'no enemies in line'}}).filter(Boolean)}
const area3=(cx,cy)=>{const t=[];for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++)if(inb(cx+dx,cy+dy))t.push({x:cx+dx,y:cy+dy});return t};
function selfArea(k,s){if(k==='frost')return area3(s.x,s.y);if(['mend','roar','sweep'].includes(k))return [{x:s.x,y:s.y},...DIRS.map(([dx,dy])=>({x:s.x+dx,y:s.y+dy})).filter(p=>inb(p.x,p.y))];return [{x:s.x,y:s.y}]}
function burnCentres(s){const out=[];for(let x=0;x<COLS;x++)for(let y=0;y<ROWS;y++){const d=manh(s,{x,y}),eh=unitAt(x,y);if(!(d===2||(d>=1&&d<=2&&eh&&eh.side!==s.side)))continue;const area=area3(x,y),hit=area.map(p=>unitAt(p.x,p.y)).filter(u=>u&&u.side!==s.side);if(!hit.length)continue;
  out.push({fake:1,x,y,area,label:`🔥 ${hit.length} enem${hit.length>1?'ies':'y'}`,name:'Firestorm',type:'shield',hits:hit.length,note:`burns ${hit.map(u=>u.name).join(', ')}`})}return out.sort((a,b)=>b.hits-a.hits)}
const FXF={};function fxFrame(k,im,fr){const key=k+fr;if(FXF[key])return FXF[key];const cv=document.createElement('canvas');cv.width=cv.height=256;const x=cv.getContext('2d');x.drawImage(im,(fr%4)*256,Math.floor(fr/4)*256,256,256,0,0,256,256);const g=x.createRadialGradient(128,128,70,128,128,128);g.addColorStop(0,'#000');g.addColorStop(1,'rgba(0,0,0,0)');x.globalCompositeOperation='destination-in';x.fillStyle=g;x.fillRect(0,0,256,256);FXF[key]=cv;return cv}
const FXS={};function fxSheet(k){if(!FXS[k]){FXS[k]=new Image();FXS[k].src=`sprites/fx_${k}.jpg`}return FXS[k]}
function gfx(k,x,y,s,dur){G.mfx=(G.mfx||[]);G.mfx.push({k:'sheet',sheet:k,x,y,t0:performance.now(),dur:dur||2000,s})}""")
rep("for(const f of G.mfx){const p=(now-f.t0)/f.dur,cx=f.x*T+T/2,cy=f.y*T+T/2,row=FXROW[f.k];","for(const f of G.mfx){const p=(now-f.t0)/f.dur,cx=f.x*T+T/2,cy=f.y*T+T/2,row=FXROW[f.k];\n    if(f.k==='sheet'){const im=fxSheet(f.sheet);if(im.complete&&im.naturalWidth){const fr=Math.min(15,Math.floor(p*16)),s=T*(f.s||2.4);c.save();c.globalCompositeOperation='lighter';c.drawImage(fxFrame(f.sheet,im,fr),cx-s/2,cy-s*.62,s,s);c.restore()}continue}")
rep("  if(HERO[k])return HERO[k].desc;\n  return ''}","  if(e&&e.fake)return e.note;\n  if(HERO[k])return HERO[k].desc;\n  return ''}")
rep("<span>${tg.u.name} <small>${TYPES[tg.u.type].n}</small></span>","<span>${tg.u.label||tg.u.name+' <small>'+TYPES[tg.u.type].n+'</small>'}</span>")
rep("if(G.mode==='target'){for(const tg of G.targets){const u=tg.u;","if(G.mode==='target'){for(const tg of G.targets)if(tg.u.area){c.fillStyle=`rgba(255,170,60,${.1+pulse*.1})`;for(const p of tg.u.area)c.fillRect(p.x*T+1,p.y*T+1,T-2,T-2)}for(const tg of G.targets){const u=tg.u;")
rep("if(G.mode==='target'){const tg=G.targets.find(t=>t.u===u);if(tg)hitTarget(u);","if(G.mode==='target'){const inA=t=>t.u.area&&t.u.area.some(q=>q.x===x&&q.y===y);const tg=G.targets.find(t=>t.u===u)||G.targets.find(t=>t.u.fake&&t.u.x===x&&t.u.y===y)||G.targets.filter(inA).sort((a,b)=>(b.u.hits||0)-(a.u.hits||0))[0];if(tg)hitTarget(tg.u);")
rep("  await cutIn(s,h);let keep=false;","""  await cutIn(s,h);let keep=false;
  if(k==='star'){const [dx,dy]=t.dir,line=t.area;log(`<b>Nine Heavens Sword Array!</b> ${nm(s)} calls down starlight to the ${t.name.toLowerCase()}.`);
    line.forEach((p,i)=>setTimeout(()=>gfx('xuannu',p.x,p.y,2.2,1800),i*110));await sleep(700);
    for(const p of line){const e=unitAt(p.x,p.y);if(e&&e.side!==s.side){SND.fx('hit');quickHit(s,e,1.5,{color:'#ffe27a'})}}await sleep(900)}
  else if(k==='mend'){gfx('nuwa',s.x,s.y,3.6,2000);await sleep(800);for(const u of [s,...adjA(s)]){const add=Math.min(u.max-u.troops,Math.round(u.max*.2));if(add>0){u.troops+=add;float(u,'+'+add,'#b4f0ff')}u.iron=Math.max(u.iron||0,1)}
    log(`<b>Mend the Sky!</b> Rainbow light shields ${nm(s)} and the allies beside her.`);await sleep(900)}
  else if(k==='burn'){gfx('fentian',t.x,t.y,4.2,2000);for(const p of t.area)G.fires.push({x:p.x,y:p.y,t0:performance.now()+500,dur:1500});await sleep(800);
    for(const p of t.area){const e=unitAt(p.x,p.y);if(e&&e.side!==s.side){fireHit(s,e,1.6);await sleep(90)}}log(`<b>Burning Sky!</b> ${nm(s)} turns the field to fire.`);await sleep(800)}
  else if(k==='frost'){gfx('yueshuang',s.x,s.y,4.2,2000);await sleep(900);const fr=enemies().filter(e=>Math.max(Math.abs(e.x-s.x),Math.abs(e.y-s.y))<=1);for(const e of fr){e.stun=1;float(e,'❄ Frozen','#bfe4ff')}
    log(`<b>Moonfrost!</b> ${fr.map(nm).join(', ')} ${fr.length>1?'are':'is'} frozen solid.`);await sleep(800)}""")

# animated cut-in clips (4x4 frames of 256x384) for goddesses that have one
rep("#cutin[hidden]{display:none}","#cutin[hidden]{display:none}\n.ci-clip{aspect-ratio:2/3;background-size:400% 400%;background-repeat:no-repeat}\n.ci-zoom{animation:ciZoom 2s ease-out forwards}@keyframes ciZoom{from{transform:skewX(8deg) scale(1)}to{transform:skewX(8deg) scale(1.12)}}")
rep("const SPS=new Set([","const CLIPS=new Set(['fentian','yueshuang','hero']);const VIDS=new Set(['xuannu','diaochan','guan_yinping','huang_yueying','huang_wenjing','lu_bu','sun_shangxiang']);const GODIDS=new Set(['xuannu','nuwa','fentian','yueshuang']);const SPS=new Set([")
rep("CUTIN.innerHTML=`<div class=\"ci-band\">${p?`<img class=\"ci-port\"","CUTIN.innerHTML=`<div class=\"ci-band\">${p&&CLIPS.has(p)?`<div class=\"ci-port ci-clip\" style=\"background-image:url(portraits/clip_${p}.webp)\"></div>`:p?`<img class=\"ci-port${GODIDS.has(p)?' ci-zoom':''}\"")
rep("  CUTIN.onpointerdown=end;setTimeout(end,1250/Math.max(.6,speed||1))})}","""  const clip=CUTIN.querySelector('.ci-clip');if(clip){let f=0;const step=()=>{if(done)return;clip.style.backgroundPosition=`${(f%4)*100/3}% ${Math.floor(f/4)*100/3}%`;if(++f<16)setTimeout(step,125)};step()}
  CUTIN.onpointerdown=end;setTimeout(end,(clip||GODIDS.has(p)?2100:1250)/Math.max(.6,speed||1))})}""")

# New Hero: Eighteen Dragon-Subduing Palms + hero/consort UI styles
rep("for(const k of Object.keys(HERO))if(!['roar','sweep','lone','wind','star','mend','burn','frost'].includes(k))delete HERO[k];","""HERO.palm={who:'hero',zh:'降龍十八掌',n:'Dragon Palms',targets:s=>adjE(s),desc:'Eighteen Dragon-Subduing Palms: the enemy loses 25% of its troops and, with internal injuries, cannot act next turn'};
for(const k of Object.keys(HERO))if(!['roar','sweep','lone','wind','star','mend','burn','frost','palm'].includes(k))delete HERO[k];""")
rep("  if(k==='star'){","""  if(k==='palm'){gfx('hero',t.x,t.y,3.6,2000);SND.fx('crit');await sleep(1000);const dmg=Math.min(t.troops,Math.max(1,Math.round(t.troops*.25)));t.troops-=dmg;if(t.troops<=0)t.fate=fateRoll(t,s);t.stun=1;float(t,'-'+dmg,'#ffd27a');setTimeout(()=>G.units.includes(t)&&float(t,'Internal injury','#ff9a86'),350);
    log(`<b>Eighteen Dragon-Subduing Palms!</b> ${nm(s)} strikes ${nm(t)}: −${dmg}. Wracked by internal injuries, they cannot act next turn.`);await sleep(900)}
  else if(k==='star'){""")
rep(".biof{margin:8px 0}",""".biof{margin:8px 0}
.hname{width:100%;font-size:20px;padding:10px 12px;border-radius:10px;border:1px solid var(--line);background:var(--panel2);color:inherit;margin:6px 0 2px}
.hstats{display:grid;gap:8px;margin:10px 0}.hstat{display:grid;grid-template-columns:40px 34px 1fr;align-items:center;gap:8px}.hstat span{color:var(--muted)}.hstat b{font-size:20px}.hstat i{display:block;height:8px;border-radius:4px;background:var(--gold,#d4ad55)}
#dlgbox.consbox{max-width:min(880px,96vw)}.cons{display:grid;grid-template-columns:auto 1fr;gap:16px;align-items:start}
.consp img{height:calc(100dvh - 140px);max-height:520px;max-width:34vw;width:auto;border-radius:10px;box-shadow:0 0 30px rgba(255,190,120,.35)}
.const{max-height:calc(100dvh - 140px);overflow:auto}.const .cl{opacity:0;transform:translateY(6px);transition:opacity .9s,transform .9s;margin:8px 0;line-height:1.5}
.const .cl.on{opacity:1;transform:none}.const .cl b{display:block;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--gold,#d4ad55)}
.const .cl.him{padding-left:14px;border-left:2px solid var(--gold,#d4ad55);color:#ece2c9}.const .cl.her{font-style:italic}.const .cl.vow{color:#f3dc9a;font-weight:700}
@media (max-width:620px){.cons{grid-template-columns:1fr}.consp img{height:auto;max-height:30dvh;max-width:100%}.const{max-height:calc(70dvh - 190px)}}""")
rep(".biof{margin:8px 0}",".biof{margin:8px 0}.chr{display:flex;align-items:center;gap:8px}.chead .trbtn{padding:0 10px!important;height:26px!important;min-height:0!important;min-width:0!important;line-height:24px;font-size:13px!important;border-radius:999px;font-weight:700;display:inline-flex;align-items:center;gap:4px;border:1px solid rgba(212,173,85,.6);background:rgba(212,173,85,.12);color:#f3dc9a}.trbtn .czh{font-size:13px}")
# full-screen world map + clickable ruler pills
rep(".biof{margin:8px 0}",""".biof{margin:8px 0}
.mapview .mvhead{position:absolute;top:0;left:0;right:0;z-index:5;background:linear-gradient(180deg,rgba(10,8,6,.92),rgba(10,8,6,.65));border-bottom:0}
.mapview .mvbody{padding:0;align-items:flex-start;justify-content:flex-start}
.mapview .mapbox{width:calc(max(100vw, (100dvh)*1.5) * var(--mz,1))!important;border-radius:0;border:0}
.legend button{padding:2px 9px;border-radius:99px;border:1px solid;font-size:11.5px;min-height:0;background:rgba(0,0,0,.35);color:inherit;cursor:pointer}
.legend button.on{font-weight:700}
.mapbox.mfilter .city{opacity:.35;filter:grayscale(.7);transition:opacity .25s}.mapbox.mfilter .city.mhl{opacity:1;filter:none;transform:translate(-50%,-50%) scale(1.12)}
#mfacInfo{position:fixed;left:50%;bottom:max(12px,env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:6;background:rgba(18,15,11,.93);border:1px solid var(--line);border-radius:12px;padding:8px 14px;display:flex;flex-wrap:wrap;gap:4px 14px;font-size:13px;max-width:calc(100vw - 24px);box-shadow:0 6px 20px rgba(0,0,0,.5)}
#mfacInfo[hidden]{display:none}""")
rep(".legend button{padding:2px 9px;",""".mapview .mvhead{flex-wrap:nowrap;gap:8px;padding-block:4px}
.mapview .mvhead .muted{display:none}
.mapview .mvhead .mvt{white-space:nowrap;font-size:15px}
.mapview .legend{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;min-width:0;flex:1}
.mapview .legend::-webkit-scrollbar{display:none}
.mapview .mvhead .spacer{display:none}
.mapview #mapClose{flex:none;min-height:0;padding:4px 10px}
.mapview .mvbody{padding-top:42px!important}
.legend button{white-space:nowrap;padding:2px 9px;""")
rep(".biof{margin:8px 0}",""".biof{margin:8px 0}
#tbg{transition:opacity .25s}
.tlogo{position:absolute;left:max(24px,env(safe-area-inset-left,0px));top:max(14px,env(safe-area-inset-top,0px));font-family:var(--f-zh);font-weight:900;font-size:clamp(44px,11vh,96px);line-height:1;letter-spacing:.06em;color:#ffd77a;background:linear-gradient(180deg,#fff2c4,#f0b33c 55%,#b8641c);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(0 3px 0 #5a1c0c) drop-shadow(0 0 18px rgba(0,0,0,.65));pointer-events:none}
.tmode{display:inline-flex;gap:4px;padding:3px;border-radius:999px;background:rgba(0,0,0,.45);border:1px solid var(--line);width:max-content}
.tmode button{min-height:0;padding:5px 14px;border-radius:999px;border:0;background:none;color:#cfc4aa;font-size:14px}
.tmode button.on{background:var(--gold,#d4ad55);color:#1a140c;font-weight:700}
@media (orientation:portrait){.tlogo{font-size:clamp(40px,12vw,72px)}}""")
rep(".tmode{display:inline-flex;",".tm-hero .tbg{object-position:78% 0%}@media (orientation:portrait){.tm-hero .tbg{left:-66vw!important}}\n.tmode{display:inline-flex;")

# fire caster: women, goddesses and the hero use their own sprite (attack row) instead of the male signal pose
rep("sig:true,fr,x:o.hx,y:o.y,s:o.s,face:S.face,fac:S.u.side}","sig:true,fr,x:o.hx,y:o.y,s:o.s,face:S.face,fac:S.u.side,fem:femKey(S.u),ch:S.u.ch}")
rep("for(const it of items){if(it.f.sig){if(!drawSig(c,it.f))drawFigure(c,{...it.f,officer:true,type:'cav'})}else drawFigure(c,it.f);",
    "for(const it of items){if(it.f.sig&&it.f.fem){drawFigure(c,{...it.f,sig:false,officer:true,type:'cav',fight:it.f.fr>0,slow:true,seed:1.3})}else if(it.f.sig){if(!drawSig(c,it.f))drawFigure(c,{...it.f,officer:true,type:'cav'})}else drawFigure(c,it.f);")

# themed terrain tint + props
rep("c.fillStyle=pat('tex_grass',2.6);c.fillRect(0,0,W,H);",
"c.fillStyle=pat('tex_grass',2.6);c.fillRect(0,0,W,H);const TH=window.BTHEME||'';const TW={plains:['rgba(225,200,110,.12)','overlay'],hills:['rgba(200,150,80,.18)','overlay'],forest:['rgba(20,110,40,.22)','overlay'],river:['rgba(60,150,90,.18)','overlay'],marsh:['rgba(60,140,120,.22)','overlay'],pass:['rgba(200,170,120,.16)','overlay']}[TH];if(TW){c.save();c.globalCompositeOperation=TW[1];c.fillStyle=TW[0];c.fillRect(0,0,W,H);c.restore()}")
rep("else if(t==='.'&&r()<.16){const k=['tuft1','tuft2','bush','rock2','reeds'][Math.floor(r()*5)];",
"else if(t==='.'&&r()<({forest:.34,marsh:.32,pass:.30,hills:.24,plains:.12}[window.BTHEME]||.16)){const PK={forest:['bush','bush','tuft1','tuft2'],marsh:['reeds','reeds','reeds','tuft2'],pass:['rock2','rock2','rock2','tuft1'],hills:['rock2','tuft1','bush','tuft2'],plains:['tuft1','tuft2','tuft1','bush']}[window.BTHEME]||['tuft1','tuft2','bush','rock2','reeds'];const k=PK[Math.floor(r()*PK.length)];")

# ===== Langrisser-style battle presentation (game/lm.js) =====
rep("function drawToken(c,u,now){","function drawToken0(c,u,now){")
rep("function updateUI(){","function updateUI0(){")
rep("function drawFightHud(c,SL,SR,sl,sr){","function drawFightHud0(c,SL,SR,sl,sr){")
rep("function makeBG(ter,defSide,duel){","function makeBG0(ter,defSide,duel){")
rep("function renderTerrain(T){","function renderTerrain0(T){")
rep("function playBattle0(att,def,r){","function playBattle0_(att,def,r){")
rep("drawFightHud(c,SL,SR,shownT(SL,t),shownT(SR,t));","drawFightHud(c,SL,SR,shownT(SL,t),shownT(SR,t),t,1);")
rep("v.addColorStop(1,'rgba(0,0,0,.55)')","v.addColorStop(1,'rgba(0,0,0,.28)')")
rep("v.addColorStop(1,'rgba(0,0,0,.32)')","v.addColorStop(1,'rgba(0,0,0,.16)')")
rep("if(G.enemyTiles){c.fillStyle='rgba(200,70,50,.15)';for(const t of G.enemyTiles)c.fillRect(t.x*T+1,t.y*T+1,T-2,T-2)}",
    "if(G.threat&&G.phase==='player')lmRegion(c,threatTiles(),'rgba(255,50,30,.20)','rgba(255,110,90,.9)');if(G.enemyTiles)lmRegion(c,G.enemyTiles,'rgba(255,60,40,.30)','rgba(255,140,120,1)');")
rep("if((G.mode==='select'||G.mode==='moved')&&G.reach){for(const t of G.reach.tiles)if(!(G.mode==='moved'&&t.x===G.sel.x&&t.y===G.sel.y))hl(t,'rgba(60,120,255,.13)','rgba(150,200,255,.95)')}",
    "if((G.mode==='select'||G.mode==='moved')&&G.reach)lmRegion(c,G.reach.tiles,'rgba(40,140,255,.40)','rgba(150,215,255,1)');")
rep("if(G.rangeTiles&&(G.mode==='select'||G.mode==='moved')){for(const t of G.rangeTiles)hl(t,'rgba(235,60,50,.10)','rgba(255,140,120,.9)')}",
    "if(G.rangeTiles&&(G.mode==='select'||G.mode==='moved'))lmRegion(c,G.rangeTiles,'rgba(255,55,40,.24)','rgba(255,120,100,.95)');")
rep("if(G.sel){c.strokeStyle='#d4ad55';c.lineWidth=2.5;c.strokeRect(G.sel.px*T+2,G.sel.py*T+2,T-4,T-4)}\n  else if(G.view){c.strokeStyle='rgba(236,226,201,.7)';c.lineWidth=1.5;c.strokeRect(G.view.px*T+2,G.view.py*T+2,T-4,T-4)}",
    "if(G.pv&&G.pv.u)lmPvMark(c,now);")
rep("const u=unitAt(x,y);","const u=unitAt(x,y);if(G.pv&&u!==G.pv.u)G.pv=null;")
rep("""    const s=G.sel;G.tmode='attack';
    if(inRange(s.type,manh(s,u))){execTarget(u);return}""","""    const s=G.sel;G.tmode='attack';
    if(!G.pv||G.pv.u!==u){G.pv={s,u};updateUI();return}G.pv=null;
    if(inRange(s.type,manh(s,u))){execTarget(u);return}""")
rep("$('#fsBtn').textContent=f?'⛶ Exit':'⛶ Full';","$('#fsBtn').textContent='⛶';$('#fsBtn').classList.toggle('on',f);")
rep('''<div class="pills"><button class="pill sndbtn" onclick="soundDlg()" aria-label="Mute sound">🔊</button><button id="fsBtn" class="pill" aria-label="Fullscreen">⛶ Full</button><button id="speedBtn" class="pill"></button><button id="logBtn" class="pill">Log</button><button id="retreatBtn" class="pill">Retreat</button></div>''',
    '''<div class="pills"><button id="threatBtn" class="pill ic" aria-label="Show enemy range" title="Enemy range">👁</button><button id="autoBtn" class="pill" title="Auto battle">AUTO</button><button id="speedBtn" class="pill" title="Battle scene speed"></button><button class="pill ic sndbtn" onclick="soundDlg()" aria-label="Mute sound">🔊</button><button id="fsBtn" class="pill ic" aria-label="Fullscreen">⛶</button><button id="logBtn" class="pill ic" aria-label="Battle log" title="Battle log">☰</button><button id="retreatBtn" class="pill ic" aria-label="Retreat">⚑</button></div>''')
rep('<div id="acts" class="acts2"></div>','<div id="acts" class="acts2"></div><div id="pv" hidden></div><div id="phaseBan"><b></b><small></small></div>')
rep("showScreen('title');renderTitle();", open(os.path.join(D,'lm.js')).read()+"\n"+open(os.path.join(D,'lm2.js')).read()+"\nshowScreen('title');renderTitle();")
rep("for(const S of [SL,SR]){const loss=S.before-S.after;if(!loss)continue;const t0=kindOf(S)==='arrow'?1450:1750;","for(const S of (window.LM_NONUM?[]:[SL,SR])){const loss=S.before-S.after;if(!loss)continue;const t0=kindOf(S)==='arrow'?1450:1750;")
rep('CUTIN.innerHTML=`<div class="ci-band">','CUTIN.innerHTML=`<div class="ci-lines"></div><div class="ci-title"><span>${h.n}</span></div>${p&&VIDS.has(p)?`<video class="ci-port ci-vid" autoplay muted playsinline><source src="portraits/vid_${p}.mp4" type="video/mp4"><source src="portraits/vid_${p}.webm" type="video/webm"></video>`:""}<div class="ci-band">')
rep("</style>", open(os.path.join(D,'lm.css')).read()+"\n</style>")

# skill cut-in can play a real video (portraits/vid_<id>.mp4) when one exists
rep("${p&&CLIPS.has(p)?`<div class=\"ci-port ci-clip\"","${p&&VIDS.has(p)?'':p&&CLIPS.has(p)?`<div class=\"ci-port ci-clip\"")
rep("setTimeout(end,(clip||GODIDS.has(p)?2100:1250)/Math.max(.6,speed||1))","const vid=CUTIN.querySelector('.ci-vid');if(vid){vid.onended=end;const ls=vid.querySelector('source:last-child');if(ls)ls.onerror=end}setTimeout(end,vid?5600:(clip||GODIDS.has(p)?2100:1250)/Math.max(.6,speed||1))")

# Diaochan: Petal Dance
rep("for(const k of Object.keys(HERO))if(!['roar','sweep','lone','wind','star','mend','burn','frost','palm'].includes(k))delete HERO[k];",
    "HERO.chakram={who:'sunshangxiang',zh:'烈焰飛輪',n:'Flaming Chakrams',targets:s=>enemies().filter(e=>manh(s,e)<=3),desc:'Hurl flaming chakrams at an enemy up to 3 squares away: it is struck twice (×0.7 each, no counter)'};HERO.musou={who:'lubu',zh:'無雙亂舞',n:'Heaven-Splitting Sweep',self:1,can:s=>G.units.some(e=>e.side!==s.side&&manh(s,e)<=2),desc:'Lü Bu whirls the Sky Piercer: every enemy within 2 squares takes ×1.2 damage, no counter'};HERO.melody={who:'huangwenjing',zh:'震天曲',n:'Heaven-Shaking Melody',self:1,can:s=>enemies().some(e=>manh(s,e)<=2),desc:'Blades of sound hit every enemy within 2 squares (×0.8, no counter); until your next turn they cannot strike back'};HERO.bagua={who:'huangyueying',zh:'八卦陣',n:'Bagua Formation',targets:s=>enemies().filter(e=>manh(s,e)<=3),desc:'Paint a spinning bagua over an enemy up to 3 squares away: it and every enemy around it take ×0.9 damage (no counter) and lose 20% attack for 2 turns'};HERO.crescent={who:'guanyinping',zh:'青龍月牙',n:'Dragon Crescent',targets:s=>enemies().filter(e=>manh(s,e)<=2),desc:'A crescent wave of dragon energy hits an enemy up to 2 squares away (×1.3, no counter) and the enemy directly behind it (×0.8)'};HERO.petal={who:'diaochan',zh:'閉月花舞',n:'Petal Dance',targets:s=>enemies().filter(e=>manh(s,e)<=2),desc:'A storm of petals hits an enemy up to 2 squares away and up to 2 enemies beside it (×0.8, no counter). The main target is charmed and loses its next turn'};\nfor(const k of Object.keys(HERO))if(!['roar','sweep','lone','wind','star','mend','burn','frost','palm','petal','crescent','bagua','melody','musou','chakram'].includes(k))delete HERO[k];")
rep("  if(k==='palm'){","""  if(k==='petal'){const hit=[t,...enemies().filter(e=>e!==t&&manh(e,t)===1).slice(0,2)];for(const e of hit)mfx('ring',e.x,e.y,900);SND.fx('special');await sleep(500);
    let tot=0;for(const e of hit)tot+=quickHit(s,e,.8,{color:'#ffb4d8'});if(G.units.includes(t)){t.stun=1;setTimeout(()=>G.units.includes(t)&&float(t,'Charmed','#ffb4d8'),350)}
    log(`<b>Petal Dance!</b> ${nm(s)} dances; petals tear through ${hit.map(nm).join(', ')}: −${tot}. ${nm(t)} is charmed and loses its next turn.`);await sleep(800)}
  else if(k==='palm'){""")

# Guan Yinping: Dragon Crescent;  5-row on-foot sheets: row 4 is the fall row
rep("  if(k==='petal'){","""  if(k==='crescent'){const dx=Math.sign(t.x-s.x),dy=Math.sign(t.y-s.y),bh=unitAt(t.x+dx,t.y+dy),hit=[t];if(bh&&bh.side!==s.side&&(dx||dy))hit.push(bh);for(const e of hit)mfx('arc',e.x,e.y,800);SND.fx('crit');await sleep(450);
    let tot=quickHit(s,t,1.3,{color:'#9cff9c'});if(hit[1]&&G.units.includes(hit[1]))tot+=quickHit(s,hit[1],.8,{color:'#9cff9c'});
    log(`<b>Dragon Crescent!</b> ${nm(s)}'s blade wave cuts through ${hit.map(nm).join(' and ')}: −${tot}.`);await sleep(700)}
  else if(k==='petal'){""")
rep("c.drawImage(sh,fr*256,row*176,256,176,-128*k,-168*k,256*k,176*k)","if(row===3&&sh.naturalHeight>800)row=4;c.drawImage(sh,fr*256,row*176,256,176,-128*k,-168*k,256*k,176*k)")

# Huang Yueying: Bagua Formation
rep("  if(k==='crescent'){","""  if(k==='bagua'){const hit=[t,...enemies().filter(e=>e!==t&&Math.max(Math.abs(e.x-t.x),Math.abs(e.y-t.y))<=1)];mfx('ring',t.x,t.y,1100,2.6);for(const e of hit)mfx('arc',e.x,e.y,900);SND.fx('special');await sleep(550);
    let tot=0;for(const e of hit){tot+=quickHit(s,e,.9,{color:'#a8ffb0'});if(G.units.includes(e)){e.fear=2;setTimeout(()=>G.units.includes(e)&&float(e,'Attack −20%','#a8ffb0'),350)}}
    log(`<b>Bagua Formation!</b> ${nm(s)} paints the eight trigrams over ${hit.map(nm).join(', ')}: −${tot}. Their attack drops for 2 turns.`);await sleep(700)}
  else if(k==='crescent'){""")

# Huang Wenjing: Heaven-Shaking Melody (mute = no counter-attacks)
rep("let ctr=0;const ctrOn=!o.noCounter&&","let ctr=0;const ctrOn=!o.noCounter&&!d.mute&&")
rep("const ctrVis=!o.noCounter&&","const ctrVis=!o.noCounter&&!d.mute&&")
rep("for(const u of G.units){if(u.fear)u.fear--;","for(const u of G.units){if(u.fear)u.fear--;if(u.mute)u.mute--;")
rep("  if(k==='bagua'){","""  if(k==='melody'){const hit=enemies().filter(e=>manh(s,e)<=2);mfx('ring',s.x,s.y,1100,3);for(const e of hit)mfx('arc',e.x,e.y,800);SND.fx('special');await sleep(550);
    let tot=0;for(const e of hit){tot+=quickHit(s,e,.8,{color:'#9ad8ff'});if(G.units.includes(e)){e.mute=2;setTimeout(()=>G.units.includes(e)&&float(e,'Stunned by sound','#9ad8ff'),350)}}
    log(`<b>Heaven-Shaking Melody!</b> ${nm(s)}'s strings send blades of sound through ${hit.map(nm).join(', ')}: −${tot}. They cannot strike back until your next turn.`);await sleep(700)}
  else if(k==='bagua'){""")
rep("function selfArea(k,s){if(k==='frost')return area3(s.x,s.y);","function selfArea(k,s){if(k==='frost')return area3(s.x,s.y);if(k==='melody'){const a=[];for(let dx=-2;dx<=2;dx++)for(let dy=-2;dy<=2;dy++)if(Math.abs(dx)+Math.abs(dy)<=2&&inb(s.x+dx,s.y+dy))a.push({x:s.x+dx,y:s.y+dy});return a}")

# Lü Bu: Heaven-Splitting Sweep (works for either side)
rep("  if(k==='melody'){","""  if(k==='musou'){const hit=G.units.filter(e=>e.side!==s.side&&manh(s,e)<=2);mfx('ring',s.x,s.y,1100,3);for(const e of hit)mfx('arc',e.x,e.y,800);SND.fx('crit');await sleep(550);
    let tot=0;for(const e of hit)tot+=quickHit(s,e,1.2,{color:'#ff6a5a'});
    log(`<b>Heaven-Splitting Sweep!</b> ${nm(s)} whirls the Sky Piercer through ${hit.map(nm).join(', ')}: −${tot}.`);await sleep(700)}
  else if(k==='melody'){""")
rep("if(k==='melody'){const a=[];","if(k==='melody'||k==='musou'){const a=[];")
# sheets with more than 4 frames per row (built from video): play every frame
rep("  let dir=f.face*(f.turn??1);","""  {const nf=Math.round(sh.naturalWidth/256);if(nf>4){const pp=(p,n)=>{p%=(2*n-2);return p<n?p:2*n-2-p};
    if(f.fall>0)fr=Math.min(nf-1,Math.floor(f.fall*nf));else if(f.defeat>0)fr=Math.min(nf-1,Math.floor(clamp(f.defeat)*nf*.6));
    else if(row===2&&f.officer&&!f.fight&&f.swing>0)fr=Math.min(nf-1,Math.floor(f.swing*nf));
    else if(row===2)fr=Math.floor(now/(f.slow?90:55)+sd*5)%nf;else if(row===1)fr=Math.floor(f.run*nf/10.4)%nf;else fr=pp(Math.floor(now/110+sd*7),nf)}}
  let dir=f.face*(f.turn??1);""")

rep("  if(k==='musou'){","""  if(k==='chakram'){mfx('ring',t.x,t.y,800);SND.fx('crit');await sleep(400);let tot=quickHit(s,t,.7,{color:'#ffb060'});await sleep(350);if(G.units.includes(t)){mfx('ring',t.x,t.y,800);tot+=quickHit(s,t,.7,{color:'#ffb060'})}
    log(`<b>Flaming Chakrams!</b> ${nm(s)}'s blazing rings strike ${nm(t)} twice: −${tot}.`);await sleep(600)}
  else if(k==='musou'){""")
# video-built soldier sheets have no matching turn sheet: mirror instead
rep("const TURNSH={spear:1,","const TURNSH={")
rep("const TURNSH={shield:1,","const TURNSH={")

# ===== Hu Lao Gate test battle =====
rep('<button id="heroBtn">New game as a New Hero</button>','<button id="heroBtn">New game as a New Hero</button><button id="hulaoBtn">⚔ Hu Lao Gate · vs Lü Bu</button>')
rep("function save(){try{","function save(){if(S&&S.hulao)return;try{")
rep("const tf=u=>(.7+.3*((u.train??70)/100))*(u.fear?.8:1);","const tf=u=>(.7+.3*((u.train??70)/100))*(u.fear?.8:1)*(typeof G!=='undefined'&&G&&G.cfg&&G.cfg.hulao?(u.side==='shu'?.5:.1):1);")
rep("  if(!pc||!G.units.some(u=>u.side==='shu'))return endGame(false,","  if(G.cfg&&G.cfg.hulao){if(!G.units.some(u=>u.side==='shu'))return endGame(false,'All five heroines have fallen. Lü Bu holds Hu Lao Gate.');if(!enemies().length)return endGame(true,`Lü Bu is defeated on turn ${G.turn}! Hu Lao Gate is yours.`);return false}\n  if(!pc||!G.units.some(u=>u.side==='shu'))return endGame(false,")
rep("showScreen('title');renderTitle();", open(os.path.join(D,'hulao.js')).read()+"\n$('#hulaoBtn').onclick=()=>startHulao();\nshowScreen('title');renderTitle();")
rep("  if(e.cmd&&G.cfg.playerAttacks&&!players.some(p=>manh(p,e)<=3))tiles=[{x:e.x,y:e.y}];","  if(e.cmd&&G.cfg.playerAttacks&&!G.cfg.hulao&&!players.some(p=>manh(p,e)<=3))tiles=[{x:e.x,y:e.y}];")
rep("turn:1,maxTurn:15","turn:1,maxTurn:cfg.hulao?30:15")

# ===== feedback round: defender holds & fights back, instant turns, no run-back =====
rep("const both=SL.melee&&SR.melee;setTargets(SL,SR,both);setTargets(SR,SL,both);","const both=SL.melee&&SR.melee;setTargets(SL,SR,both);setTargets(SR,SL,both);if(both&&!r.charge){const D=def===L?SL:SR,A2=D===SL?SR:SL;for(const s of D.sol)s.tx=s.hx;D.off.tx=D.off.hx;D.hold=1;D.holdT=1350;D.holdE=2800;D.holdC=1;setTargets(A2,D,false);A2.off.tx=D.off.hx-A2.face*150}")
rep("S.hold?alive&&t>=1050&&t<=2500&&s.col===0","S.hold?alive&&t>=(S.holdT||1050)&&t<=(S.holdE||2500)&&s.col<=(S.holdC||0)")
rep("S.hold?!flee&&t>=1050&&t<=2500","S.hold?!flee&&t>=(S.holdT||1050)&&t<=(S.holdE||2500)")
rep('<div class="ci-title"><span>${h.n}</span></div>','<div class="ci-title"><b>${h.zh}</b><span>${h.n}</span><small>${u.name}</small></div>')

# turning: no paper-squash. Snap through a front-facing idle frame mid-turn
rep("function TURN(t,ts){for(const t0 of ts)if(t>=t0&&t<t0+240){const k=(t-t0)/240;return Math.sign(k-.5)*Math.max(.12,Math.abs(2*k-1))}return 1}",
    "function TURN(t,ts){for(const t0 of ts)if(t>=t0&&t<t0+240){const k=(t-t0)/240;return (k<.5?-1:1)*(Math.abs(2*k-1)<.6?.999:1)}return 1}")
rep("  let dir=f.face*(f.turn??1);","  if(Math.abs(f.turn??1)===.999){row=0;fr=0}\n  let dir=f.face*Math.sign(f.turn??1);")

# ===== LM rules: general HP (soldiers die first), war-gap, sword-wave generals =====
rep("max:u.troops,","hpMax:HPM(u),troops:u.troops+HPM(u),max:u.troops+HPM(u),")
rep("const tf=u=>","const HPM=u=>u.id==='garrison'?300:Math.round(1000*clamp(.8+.4*((u.war||60)-60)/40,.6,1.3)),SOL=u=>Math.max(0,u.troops-(u.hpMax||0)),HP=u=>Math.min(u.hpMax||0,Math.max(0,u.troops));\nconst gapF=(a,d)=>d.hpMax&&d.troops<=d.hpMax?Math.max(.6,1+.15*((a.war||60)-(d.war||60))/10):1;\nconst tf=u=>")
rep("let dmg=Math.min(d.troops,Math.round(tf(a)*","let dmg=Math.min(d.troops,Math.round(gapF(a,d)*tf(a)*",2)
rep("for(const u of G.units)left[u.id]=Math.max(0,Math.round(u.troops));","for(const u of G.units)left[u.id]=Math.max(0,Math.round(SOL(u)));")
rep("const nB=Math.min(12,Math.ceil(before/100)),nA=Math.min(nB,Math.ceil(after/100))","const hm=u.hpMax||0,nB=Math.min(12,Math.ceil(Math.max(0,before-hm)/100)),nA=Math.min(nB,Math.ceil(Math.max(0,after-hm)/100))")
s=s.replace("S.nA===0","(S.after<=0)")
rep("else if(f.fight){row=2;","else if(f.fight){row=f.wave?3:2;")
rep("if(row===3&&sh.naturalHeight>800)row=4;","if(row===3&&sh.naturalHeight>800&&!f.wave)row=4;")
rep("officer:true,ch:S.u.ch,fem:femKey(S.u),run:orun,","officer:true,wave:S.wave,ch:S.u.ch,fem:femKey(S.u),run:S.wave?null:orun,")
rep("const both=SL.melee&&SR.melee;setTargets(SL,SR,both);setTargets(SR,SL,both);","const both=SL.melee&&SR.melee;setTargets(SL,SR,both);setTargets(SR,SL,both);for(const S of [SL,SR]){const fk=femKey(S.u),sh=fk&&sprSheet(fk,sprFac(S.u.side));if(S.melee&&!r.charge&&sh&&sh.naturalHeight>800&&Math.random()<.4){S.wave=1;S.off.tx=S.off.hx}}")
# Lü Bu (enemy heroes) use their skill on the enemy turn
rep("const plan=planEnemy(e);G.view=e;updateUI();","if(HERO.musou&&e.id==='lubu'&&!(e.cd&&e.cd.musou)&&G.units.filter(p=>p.side!==e.side&&manh(p,e)<=2).length>=2){G.view=e;updateUI();await heroAct('musou',e,e);e.cd=e.cd||{};e.cd.musou=3;if(checkEnd())return;await sleep(300);continue}\n    const plan=planEnemy(e);G.view=e;updateUI();")
rep("G.phase='player';for(const u of G.units.filter(u=>u.side==='shu')){","for(const u of enemies())for(const k in (u.cd||{}))if(u.cd[k]>0)u.cd[k]--;\n  G.phase='player';for(const u of G.units.filter(u=>u.side==='shu')){")
# turning: instant flip — one frame facing one way, the next facing the other
rep("function TURN(t,ts){for(const t0 of ts)if(t>=t0&&t<t0+240){const k=(t-t0)/240;return (k<.5?-1:1)*(Math.abs(2*k-1)<.6?.999:1)}return 1}","function TURN(t,ts){for(const t0 of ts)if(t>=t0&&t<t0+120)return -1;return 1}")
rep("function TURNK(t,ts){","function TURNK(t,ts){return null;")
# melee attacker closes right into the defender line (no gap); some push through
rep("A2.off.tx=D.off.hx-A2.face*150","A2.off.tx=D.off.hx-A2.face*110;{const bf=D.sol.filter(s=>s.col===0).map(s=>s.hx),fx=bf.length?(D.side==='R'?Math.min(...bf):Math.max(...bf)):D.off.hx;for(const s of A2.sol){const r=Math.random();s.tx=r<.3?fx+A2.face*(10+Math.random()*50):fx-A2.face*(s.col*24+Math.random()*30-8)}}")
# Lü Bu's still-image sheet is drawn small (tall plumes count in its height): scale up
rep("const cv=f.type==='cav'||f.officer,k=(f.officer?84:","const cv=f.type==='cav'||f.officer,k=((sh.src||'').includes('f_lubu')?1.3:1)*(f.officer?84:")

# ===== results screen, skip-all, Hu Lao polish =====
rep("dmg=ironSave(d,dmg);d.troops-=dmg;","dmg=ironSave(d,dmg);d.troops-=dmg;(G.dealt=G.dealt||{})[a.id]=(G.dealt[a.id]||0)+dmg;",2)
rep("a.troops-=ctr}","a.troops-=ctr;(G.dealt=G.dealt||{})[d.id]=(G.dealt[d.id]||0)+ctr}")
rep("const sc=deal-take*.7+","const sc=(G.cfg.hulao&&e.id==='lubu'?(1-p.troops/p.max)*900:0)+deal-take*.7+")
rep('<button class="primary" id="mBtn">','<img id="mImg" alt="" hidden><div id="mStats"></div><button class="primary" id="mBtn">')
rep("$('#mText').textContent=text;$('#modal').hidden=false;return true}","$('#mText').textContent=text;try{battleStats(win)}catch(e){console.error(e)}$('#modal').hidden=false;return true}")
s=s.replace("<span>Tap to skip</span>","<span>Tap to skip</span><span class=\"skipall\" onpointerdown=\"event.stopPropagation();speed=0;SC.dispatchEvent(new Event('pointerdown'));updateUI()\">Skip all ⏭</span>")
rep("setTimeout(end,vid?5600:","setTimeout(end,vid?7600:")
rep("hpMax:HPM(u),troops:u.troops+HPM(u),max:u.troops+HPM(u),","hpMax:HPM(u),troops:u.troops+HPM(u),max:u.troops+HPM(u),")
rep("G={units:cfg.units.map(","G={roster:cfg.units.map(u=>({id:u.id,name:u.name,side:u.side,hpMax:HPM(u),max:u.troops+HPM(u)})),dealt:{},units:cfg.units.map(")
# tapping empty ground after moving undoes the move and drops focus (no Cancel button)
rep("  if(G.mode==='moved')return;","  if(G.mode==='moved'){if(!u&&G.sel&&G.origin){const s=G.sel;s.x=s.px=G.origin.x;s.y=s.py=G.origin.y;G.sel=null;G.reach=null;G.mode='idle';G.targets=[];G.pv=null;updateUI()}return}")
# selecting a unit opens its action menu at once (no second tap); move tiles stay live
rep("G.sel=u;G.view=u;G.origin={x:u.x,y:u.y};G.reach=reach(u);G.mode='select';G.targets=[];","G.sel=u;G.view=u;G.origin={x:u.x,y:u.y};G.reach=reach(u);G.mode='moved';G.targets=[];")
rep("if(u&&u.side==='shu'&&!u.acted){G.sel=u;G.view=u;G.origin={x:u.x,y:u.y};G.reach=reach(u);G.mode='select'}","if(u&&u.side==='shu'&&!u.acted){G.sel=u;G.view=u;G.origin={x:u.x,y:u.y};G.reach=reach(u);G.mode='moved'}")
rep("if(!u)return;G.sel=u;G.view=u;G.origin={x:u.x,y:u.y};G.reach=reach(u);G.mode='select'}","if(!u)return;G.sel=u;G.view=u;G.origin={x:u.x,y:u.y};G.reach=reach(u);G.mode='moved'}")

# ===== animated duels for generals with full sprite sheets (idle / strike / wave-feint / fall) =====
rep("function drawDuelist(c,u,x,y,s,face,fac,fr){","function drawDuelist(c,u,x,y,s,face,fac,fr){if(duelSheet(c,u,x,y,s,face,fac))return true;")
rep("function renderDuel(now,dt){","""function duelSheet(c,u,x,y,s,face,fac){const fk=femKey(u),sh=fk&&sprSheet(fk,sprFac(fac));if(!sh||sh.naturalHeight<800||!D)return false;
  const nf=Math.max(4,Math.round(sh.naturalWidth/256)),now=performance.now(),me=u===D.P,A=D.anim,pp=(p,n)=>{p%=(2*n-2);return p<n?p:2*n-2-p};
  let row=0,fr=pp(Math.floor(now/110+(me?0:5)),nf),guard=0;
  if(D.result&&((D.result==='win'&&!me)||(D.result==='lose'&&me))){row=4;fr=nf-1}
  else if(A){const t=now-A.t0,mv=me?A.pc:A.ec,lost=A.win===(me?'E':'P');
    if(lost&&t>=470&&t<1000){row=4;fr=Math.min(nf-1,Math.floor((t-470)/530*nf*.45))}
    else if(t>=200&&t<1000){const k=clamp((t-200)/650);if(mv==='strike'||mv==='crit'){row=2;fr=Math.min(nf-1,Math.floor(k*nf))}else if(mv==='feint'){row=3;fr=Math.min(nf-1,Math.floor(k*nf))}else{row=0;fr=0;guard=Math.sin(k*Math.PI)}}}
  const kk=(sh.src.includes('f_lubu')?1.3:1)*84/150;c.save();c.translate(x,y);c.scale(s*face,s);c.fillStyle='rgba(0,0,0,.28)';c.beginPath();c.ellipse(0,1,22,3,0,0,Math.PI*2);c.fill();
  c.drawImage(sh,fr*256,row*176,256,176,-128*kk,-168*kk,256*kk,176*kk);
  if(guard>0){c.globalCompositeOperation='lighter';c.strokeStyle=`rgba(140,200,255,${.9*guard})`;c.lineWidth=5;c.shadowColor='#7cc8ff';c.shadowBlur=14;c.beginPath();c.arc(14,-40,46,-1.2,1.2);c.stroke();c.lineWidth=2;c.strokeStyle=`rgba(255,230,150,${guard})`;c.beginPath();c.arc(14,-40,38,-1,1);c.stroke()}
  c.restore();return true}
function renderDuel(now,dt){""")
# brighter LM-style range colours
rep("lmRegion(c,G.reach.tiles,'rgba(40,140,255,.40)','rgba(150,215,255,1)');","lmRegion(c,G.reach.tiles,'rgba(30,150,255,.5)','rgba(200,240,255,1)',1);")
rep("lmRegion(c,G.rangeTiles,'rgba(255,55,40,.24)','rgba(255,120,100,.95)');","lmRegion(c,G.rangeTiles,'rgba(255,35,25,.48)','rgba(255,200,180,1)',1);")
rep("lmRegion(c,G.enemyTiles,'rgba(255,60,40,.30)','rgba(255,140,120,1)');","lmRegion(c,G.enemyTiles,'rgba(255,35,25,.50)','rgba(255,200,180,1)',1);")
rep("lmRegion(c,threatTiles(),'rgba(255,50,30,.20)','rgba(255,110,90,.9)');","lmRegion(c,threatTiles(),'rgba(255,40,30,.38)','rgba(255,170,150,1)',1);")
# ===== LM-style special attack flow: yellow range, red markers, confirm, long-press info =====
rep("if(G.mode==='target'){for(const tg of G.targets)if(tg.u.area)","if(G.mode==='target'&&G.sel&&G.tmode!=='attack')lmRegion(c,skRange(),'rgba(255,205,30,.42)','rgba(255,240,150,1)',1);\n  if(G.mode==='target'){for(const tg of G.targets)if(tg.u.area)")
rep("function hitTarget(u){","function hitTarget(u){if(G.mode==='target'&&G.tmode!=='attack'&&G.skc!==u){G.skc=u;updateUI();return}G.skc=null;")
# lady generals commanding shield troops use the twin-sword heroine sheet
rep("const femKey=u=>!u?false:GSHEET[u.id]||(FEM.has(u.id)?'fgeneral':false);","const femKey=u=>!u?false:GSHEET[u.id]||(FEM.has(u.id)?(u.type==='shield'?'fshield':'fgeneral'):false);")
rep("['spear','shield','archer','cav','general','fgeneral',","['spear','shield','archer','cav','general','fgeneral','fshield',")
rep("(u.type==='shield'?'fshield':'fgeneral')","(u.type==='shield'?'fshield':u.type==='archer'?'farcher':'fgeneral')")
rep("'fgeneral','fshield',","'fgeneral','fshield','farcher',")
rep("u.type==='archer'?'farcher':'fgeneral'","u.type==='archer'?'farcher':u.type==='cav'?'fcav':'fgeneral'")
rep("'fshield','farcher',","'fshield','farcher','fcav',")
rep("u.type==='cav'?'fcav':'fgeneral'","u.type==='cav'?'fcav':u.type==='spear'?'fspear':'fgeneral'")
rep("'farcher','fcav',","'farcher','fcav','fspear',")

# ===== new troop type 武 Martial artists (special lady generals only) =====
rep("const TYPES={shield:{n:'Shield infantry',mv:3,rng:[1,1]},","const TYPES={wu:{n:'Martial artists',mv:4,rng:[1,2]},shield:{n:'Shield infantry',mv:3,rng:[1,1]},")
rep("function typeMult(a,d){","function typeMult(a,d){if(a==='wu'&&(d==='shield'||d==='spear'))return 1.3;if(a==='cav'&&d==='wu')return 1.3;if(a==='wu'&&d==='cav')return .8;")
rep("const TZH={spear:'槍',shield:'盾',archer:'弓',cav:'騎'},TSHORT={spear:'Spear',shield:'Shield',archer:'Archer',cav:'Cavalry'};","const TZH={spear:'槍',shield:'盾',archer:'弓',cav:'騎',wu:'武'},TSHORT={spear:'Spear',shield:'Shield',archer:'Archer',cav:'Cavalry',wu:'Martial'};const WU_GENS=new Set(['diaochan','huangyueying','huangwenjing']);")
rep("${['spear','shield','archer','cav'].map(t=>","${['spear','shield','archer','cav',...(WU_GENS.has(u.id)?['wu']:[])].map(t=>")
rep("const SPRITES={spear:1,shield:1,archer:1,cav:1}","const SPRITES={spear:1,shield:1,archer:1,cav:1,wu:1}")
rep("['spear','shield','archer','cav','general','fgeneral',","['spear','shield','archer','cav','wu','general','fgeneral',")
rep("order={archer:0,cav:1,spear:2,shield:3}","order={archer:0,wu:1,cav:1,spear:2,shield:3}",2)
rep("f.type==='archer'?62:58)/150","f.type==='archer'?62:f.type==='wu'?70:58)/150")

# ===== peasant levies (民) =====
rep("const TYPES={wu:","const TYPES={peasant:{n:'Peasant levy',mv:3,rng:[1,1]},wu:")
rep("function typeMult(a,d){","function typeMult(a,d){if(d==='peasant'&&a!=='peasant')return 1.3;if(a==='peasant'&&d!=='peasant')return .75;")
rep("TZH={spear:'槍',shield:'盾',archer:'弓',cav:'騎',wu:'武'},TSHORT={spear:'Spear',shield:'Shield',archer:'Archer',cav:'Cavalry',wu:'Martial'}","TZH={spear:'槍',shield:'盾',archer:'弓',cav:'騎',wu:'武',peasant:'民'},TSHORT={spear:'Spear',shield:'Shield',archer:'Archer',cav:'Cavalry',wu:'Martial',peasant:'Peasants'}")
rep("const SPRITES={spear:1,shield:1,archer:1,cav:1,wu:1}","const SPRITES={spear:1,shield:1,archer:1,cav:1,wu:1,peasant:1}")
rep("['spear','shield','archer','cav','wu','general',","['spear','shield','archer','cav','wu','peasant','general',")
rep("order={archer:0,wu:1,cav:1,spear:2,shield:3}","order={archer:0,wu:1,cav:1,spear:2,peasant:2,shield:3}",2)
rep("f.type==='wu'?70:58)/150","f.type==='wu'?70:f.type==='peasant'?62:58)/150")
rep("if(!enemies().length)return endGame(true,`Lü Bu","if(!enemies().length||!G.units.some(u=>u.id==='lubu'))return endGame(true,`Lü Bu")

# ===== undead (屍) =====
rep("const TYPES={peasant:","const TYPES={undead:{n:'Undead horde',mv:2,rng:[1,1]},peasant:")
rep("function typeMult(a,d){","function typeMult(a,d){if(a==='undead'&&d!=='undead')return 1.1;if(d==='undead'&&a==='archer')return .6;if(d==='undead'&&a==='wu')return 1.3;")
rep("peasant:'民'},TSHORT={","peasant:'民',undead:'屍'},TSHORT={")
rep("Martial',peasant:'Peasants'}","Martial',peasant:'Peasants',undead:'Undead'}")
rep("const SPRITES={spear:1,shield:1,archer:1,cav:1,wu:1,peasant:1}","const SPRITES={spear:1,shield:1,archer:1,cav:1,wu:1,peasant:1,undead:1}")
rep("'wu','peasant','general',","'wu','peasant','undead','general',")
rep("order={archer:0,wu:1,cav:1,spear:2,peasant:2,shield:3}","order={archer:0,wu:1,cav:1,spear:2,peasant:2,undead:2,shield:3}",2)
rep("f.type==='peasant'?62:58)/150","f.type==='peasant'?62:f.type==='undead'?60:58)/150")

# ===== tigers (虎): 1 tiger = 5 soldiers of HP and attack; counts shown in tigers =====
rep("const TYPES={undead:","const TYPES={tiger:{n:'Tigers',mv:4,rng:[1,1]},undead:")
rep("undead:'屍'},TSHORT={","undead:'屍',tiger:'虎'},TSHORT={")
rep("peasant:'Peasants',undead:'Undead'}","peasant:'Peasants',undead:'Undead',tiger:'Tigers'};const DSOL=(u,n)=>u&&u.type==='tiger'?Math.ceil(n/5):Math.round(n)")
rep("const SPRITES={spear:1,shield:1,archer:1,cav:1,wu:1,peasant:1,undead:1}","const SPRITES={spear:1,shield:1,archer:1,cav:1,wu:1,peasant:1,undead:1,tiger:1}")
rep("'peasant','undead','general',","'peasant','undead','tiger','general',")
rep("order={archer:0,wu:1,cav:1,spear:2,peasant:2,undead:2,shield:3}","order={archer:0,wu:1,cav:1,tiger:1,spear:2,peasant:2,undead:2,shield:3}",2)
rep("f.type==='undead'?60:58)/150","f.type==='undead'?60:f.type==='tiger'?108:58)/150")
rep("k=((sh.src||'').includes('f_lubu')?1.3:1)","k=((sh.src||'').includes('f_lubu')?1.3:(sh.src||'').includes('/tiger_')?1.9:1)")
rep("const kk=(sh.src.includes('f_lubu')?1.3:1)","const kk=(sh.src.includes('f_lubu')?1.3:sh.src.includes('/tiger_')?1.9:1)")
rep("const GSHEET={","const GSHEET={tigerking:'tiger',")
# ===== wolves (狼): 1 wolf = 2 soldiers =====
rep("const TYPES={tiger:","const TYPES={wolf:{n:'Wolf pack',mv:5,rng:[1,1]},tiger:")
rep("undead:'屍',tiger:'虎'},TSHORT={","undead:'屍',tiger:'虎',wolf:'狼'},TSHORT={")
rep("undead:'Undead',tiger:'Tigers'};const DSOL=(u,n)=>u&&u.type==='tiger'?Math.ceil(n/5):Math.round(n)","undead:'Undead',tiger:'Tigers',wolf:'Wolves'};const BEAST={tiger:5,wolf:2};const DSOL=(u,n)=>u&&BEAST[u.type]?Math.ceil(n/BEAST[u.type]):Math.round(n)")
rep("undead:1,tiger:1}","undead:1,tiger:1,wolf:1}")
rep("'undead','tiger','general',","'undead','tiger','wolf','general',")
rep("order={archer:0,wu:1,cav:1,tiger:1,","order={archer:0,wu:1,cav:1,tiger:1,wolf:1,",2)
rep("f.type==='tiger'?108:58)/150","f.type==='tiger'?108:f.type==='wolf'?90:58)/150")
rep("k=((sh.src||'').includes('f_lubu')?1.3:(sh.src||'').includes('/tiger_')?1.9:1)","k=((sh.src||'').includes('f_lubu')?1.3:(sh.src||'').includes('/tiger_')?1.9:(sh.src||'').includes('/wolf_')?1.6:1)")
rep("const GSHEET={tigerking:'tiger',","const GSHEET={tigerking:'tiger',wolfking:'wolf',")
# archers shooting a unit with no soldiers left: aim at the general
rep("for(let k=0;k<2;k++)arrows.push({src:s,S,tgt:O.sol[Math.floor(Math.random()*O.sol.length)],O,","for(let k=0;k<2;k++)arrows.push({src:s,S,tgt:O.sol[Math.floor(Math.random()*O.sol.length)]||O.off,O,")
rep("const GSHEET={tigerking:'tiger',","const GSHEET={xiaoming:'g_xiaoming',tigerking:'tiger',")
rep("const GSHEET={xiaoming:'g_xiaoming',","const GSHEET={xiaohei:'g_xiaohei',xiaoming:'g_xiaoming',")
# ===== beast packs (tiger, wolf) have no general =====
rep("const HPM=u=>u.id==='garrison'?300:","const HPM=u=>(u.type==='tiger'||u.type==='wolf')?0:u.id==='garrison'?300:")
rep("officer:true,wave:S.wave,","officer:true,nohero:!S.u.hpMax,wave:S.wave,")
rep("function drawFigure(c,f){","function drawFigure(c,f){if(f.nohero)return;")
rep("const duelTargets=s=>s.war<70?[]:enemies().filter(e=>manh(s,e)===1&&e.war>=70&&!e.dueled);","const duelTargets=s=>s.war<70?[]:enemies().filter(e=>manh(s,e)===1&&e.war>=70&&!e.dueled&&e.hpMax);")
rep("const GSHEET={xiaohei:'g_xiaohei',","const GSHEET={jiangchen:'g_jiangchen',xiaohei:'g_xiaohei',")
# martial artists: alternate palm-wave and side-kick fighters within the ranks
rep("else if(SPRITES[f.type]){const sh=sprSheet(f.type,sprFac(f.fac));","else if(SPRITES[f.type]){const sh=sprSheet(f.type==='wu'&&Math.floor((f.seed||0)*7)%2?'wu2':f.type,sprFac(f.fac));")
rep("'wu','peasant','undead',","'wu','wu2','peasant','undead',")
rep("const GSHEET={jiangchen:'g_jiangchen',","const GSHEET={ganning:'g_ganning',jiangchen:'g_jiangchen',")
rep("const FEM=new Set(['sunshangxiang'","const FEM=new Set(['renrui','huangyi','sunshangxiang'")

# 8-frame battlefield skill effects at 8 fps (skill_fx.jpg is now 8 cols x 6 rows)
rep("const fr=Math.min(3,Math.floor(p*4)),s=T*(f.s||1.8)","const fr=Math.min(7,Math.floor((now-f.t0)/125)),s=T*(f.s||1.8)")
rep("function mfx(k,x,y,dur,s){G.mfx=(G.mfx||[]);G.mfx.push({k,x,y,t0:performance.now(),dur:dur||900,s})}","function mfx(k,x,y,dur,s){G.mfx=(G.mfx||[]);G.mfx.push({k,x,y,t0:performance.now(),dur:Math.max(dur||900,1000),s})}")

# Lady Gan / Lady Mi own 8-frame sheets (idle, run, attack, fall)
rep("const GSHEET={ganning:'g_ganning',","const GSHEET={ladygan:'f_ladygan',ladymi:'f_ladymi',ganning:'g_ganning',")
rep("const GSHEET={ladygan:'f_ladygan',","const GSHEET={consortzhao:'f_consortzhao',ladygan:'f_ladygan',")

# 8-frame burning loop at 8 fps (fire_fx.jpg: row0 ignite x4, row1 burn x8, row2 die-out x4)
rep("if(it.burn)fx(c,1,Math.floor(t/90+it.bx)%4,","if(it.burn)fx(c,1,Math.floor(t/125+it.bx)%8,")
rep("if(t<burnEnd)fx(c,1,Math.floor(t/95+f.ph)%4,","if(t<burnEnd)fx(c,1,Math.floor(t/125+f.ph)%8,")
rep("const GSHEET={consortzhao:'f_consortzhao',","const GSHEET={consortyan:'f_consortyan',consortzhao:'f_consortzhao',")
rep("const GSHEET={consortyan:'f_consortyan',","const GSHEET={consortli:'f_consortli',consortyan:'f_consortyan',")

rep("const GSHEET={consortli:'f_consortli',","const GSHEET={huangyi:'f_huangyi',consortli:'f_consortli',")
rep("const FXROW={arc:0,ring:1,wind:2,smoke:3,heal:4,shield:5}","const FXROW={arc:0,ring:1,wind:2,smoke:3,heal:4,shield:5,speed:6,iron:7}")
# charge dust (cavalry melee) and rally aura (Roar)
rep("speed:6,iron:7}","speed:6,iron:7,dust:8,rally:9}")
rep("if(k==='roar'){mfx('ring',s.x,s.y,1100,3.2);","if(k==='roar'){mfx('rally',s.x,s.y,1100,3.2);")
rep("async function doAttack(a,d,o={}){if(!speed)SND.fx(manh(a,d)>1?'arrows':'hit');","async function doAttack(a,d,o={}){if(!speed)SND.fx(manh(a,d)>1?'arrows':'hit');if(a.type==='cav'&&manh(a,d)<=1)mfx('dust',a.x,a.y,1000,2);")

# New skills with the 8-frame lightning and flood art: Pang Tong's Heavenly Thunder, Guan Yu's Flood
rep("dust:8,rally:9}","dust:8,rally:9,thunder:12,flood:13}")
rep("HERO.palm={","HERO.thunder={who:'pangtong',zh:'天雷',n:'Heavenly Thunder',targets:s=>enemies().filter(e=>manh(s,e)<=3),desc:'Call lightning on an enemy up to 3 squares away: heavy damage based on Intelligence, no counter, and it loses its next turn'};\nHERO.flood={who:'guanyu',zh:'水淹七軍',n:'Flood the Seven Armies',once:1,targets:s=>enemies().filter(e=>manh(s,e)<=3),desc:'Once per battle: a great flood over the 3×3 around an enemy up to 3 squares away; every enemy caught takes heavy damage'};\nHERO.palm={")
rep("else if(k==='frost'){gfx('yueshuang'","else if(k==='thunder'){mfx('thunder',t.x,t.y,1000,2.6);SND.fx('crit');await sleep(450);if(G.units.includes(t)){let dmg=Math.min(t.troops,Math.round(fireDmg(s,t,true)*3*(t.iron?.5:1)));dmg=ironSave(t,dmg);t.troops-=dmg;if(t.troops<=0)t.fate=fateRoll(t,s);else t.stun=1;float(t,'-'+dmg,'#d6a8ff');log(`<b>Heavenly Thunder!</b> Lightning strikes ${nm(t)}: −${dmg}${t.troops>0?', and it is stunned':''}.`)}await sleep(700)}\n   else if(k==='flood'){const hit=enemies().filter(e=>Math.max(Math.abs(e.x-t.x),Math.abs(e.y-t.y))<=1);mfx('flood',t.x,t.y,1000,3.4);SND.fx('special');await sleep(450);let tot=0;for(const e of hit){tot+=quickHit(s,e,.9,{color:'#8fd0ff'});await sleep(120)}log(`<b>Flood the Seven Armies!</b> ${nm(s)} unleashes the river on ${hit.map(nm).join(', ')}: −${tot}.`);await sleep(700)}\n   else if(k==='frost'){gfx('yueshuang'")
rep("'melody','musou','chakram'].includes(k))delete HERO[k];","'melody','musou','chakram','thunder','flood'].includes(k))delete HERO[k];")
rep("const GSHEET={huangyi:'f_huangyi',","const GSHEET={zhurong:'f_zhurong',huangyi:'f_huangyi',")

# Brace (spear guard): 8-frame activation + looping guard ring on the unit and the 4 squares beside it
rep("thunder:12,flood:13}","thunder:12,flood:13,guard:14,guardloop:15}")
rep("function doGuard(s){s.guard=true;","function doGuard(s){s.guard=true;s.guardT0=performance.now();mfx('guard',s.x,s.y,1000,2.2);")
rep("""  c.setLineDash([]);
  if(G.pv&&G.pv.u)lmPvMark(c,now);""","""  c.setLineDash([]);
  if(SKFX.complete&&SKFX.naturalHeight>=4096)for(const g of G.units.filter(u=>u.guard&&now-(u.guardT0||0)>1000)){const fr=Math.floor(now/125)%8;c.save();c.globalCompositeOperation='lighter';
    for(const [dx,dy,sc,al] of [[0,0,2.2,1],[1,0,1.1,.5],[-1,0,1.1,.5],[0,1,1.1,.5],[0,-1,1.1,.5]]){if(!inb(g.x+dx,g.y+dy))continue;const s=T*sc,cx=(g.x+dx)*T+T/2,cy=(g.y+dy)*T+T/2;c.globalAlpha=al;c.drawImage(SKFX,fr*256,15*256,256,256,cx-s/2,cy-s/2,s,s)}c.restore()}
  if(G.pv&&G.pv.u)lmPvMark(c,now);""")

# Huang Yi: 流星劍 Shooting Star Sword — streak along 6 squares, hit every enemy, land beside the last one
rep("HERO.palm={","HERO.meteor={who:'huangyi',zh:'流星劍',n:'Shooting Star Sword',targets:s=>starDirs(s).filter(t=>t.area.some(p=>{const e=unitAt(p.x,p.y);return e&&e.side!==s.side})),desc:'Flash across 6 squares in a straight line like a shooting star, striking every enemy on the way (no counter), and land beside the last one. Pick a direction'};\nHERO.palm={")
rep("'melody','musou','chakram','thunder','flood'].includes(k))delete HERO[k];","'melody','musou','chakram','thunder','flood','meteor'].includes(k))delete HERO[k];")
rep("const FXS={};function fxSheet(k){","const METEOR=new Image();METEOR.src='sprites/fx_meteor.jpg';\nconst FXS={};function fxSheet(k){")
rep("if(f.k==='sheet'){const im=fxSheet","if(f.k==='streak'){if(METEOR.complete&&METEOR.naturalWidth){const fr=Math.min(7,Math.floor((now-f.t0)/110)),L=(f.n+.8)*T,h=T*1.5;c.save();c.globalCompositeOperation='lighter';c.translate(cx,cy);c.rotate(Math.atan2(f.dy,f.dx));c.drawImage(METEOR,(fr%2)*768,(fr>>1)*256,768,256,-T*.5,-h/2,L,h);c.restore()}continue}\n     if(f.k==='sheet'){const im=fxSheet")
rep("else if(k==='star'){","else if(k==='meteor'){const [dx,dy]=t.dir,line=t.area;log(`<b>Shooting Star Sword!</b> ${nm(s)} flashes across the field to the ${t.name.toLowerCase()}.`);\n    G.mfx=(G.mfx||[]);G.mfx.push({k:'streak',x:s.x,y:s.y,dx,dy,n:line.length,t0:performance.now(),dur:900});SND.fx('special');await sleep(380);\n    let last=null,tot=0;for(const p of line){const e=unitAt(p.x,p.y);if(e&&e.side!==s.side){SND.fx('hit');tot+=quickHit(s,e,1.0,{color:'#cfe4ff'});last=p;await sleep(70)}}\n    if(last){const li=line.indexOf(last),cand=[line[li+1],...line.slice(0,li).reverse()].filter(Boolean);const free=cand.find(p=>terAt(p.x,p.y)!=='w'&&!unitAt(p.x,p.y));if(free){s.x=s.px=free.x;s.y=s.py=free.y;mfx('speed',s.x,s.y,700)}}\n    log(`Her blade strikes everything in its path: −${tot}.`);await sleep(800)}\n  else if(k==='star'){")

rep("const GSHEET={zhurong:'f_zhurong',","const GSHEET={renrui:'f_renrui',zhurong:'f_zhurong',")

# ---- Goddesses removed: their four skills go to lady generals ----
rep("star:{who:'xuannu',zh:'九天劍陣',n:'Sword Array',targets:s=>starDirs(s),desc:'Starlight swords","star:{who:'renrui',zh:'千刃',n:'Thousand Blades',targets:s=>starDirs(s),desc:'A storm of thrown shadow blades")
rep("<b>Nine Heavens Sword Array!</b> ${nm(s)} calls down starlight to the","<b>Thousand Blades!</b> ${nm(s)} hurls a storm of blades to the")
rep("mend:{who:'nuwa',zh:'補天',n:'Mend the Sky',","mend:{who:'caiwenji',zh:'胡笳',n:'Song of Solace',")
rep("<b>Mend the Sky!</b> Rainbow light shields ${nm(s)} and the allies beside her.","<b>Song of Solace!</b> ${nm(s)}'s music heals and shields the allies beside her.")
rep("burn:{who:'fentian',zh:'焚天',n:'Burning Sky',","burn:{who:'zhurong',zh:'祝融烈火',n:'Fire God\\'s Wrath',")
rep("<b>Burning Sky!</b> ${nm(s)} turns the field to fire.","<b>Fire God\\'s Wrath!</b> ${nm(s)} calls down the fire of her ancestor Zhurong.")
rep("frost:{who:'yueshuang',zh:'月霜',n:'Moonfrost',","frost:{who:'zhenji',zh:'凌波',n:'Frost Lotus',")
rep("<b>Moonfrost!</b>","<b>Frost Lotus!</b>")
rep(",yueshuang:'g_yueshuang',fentian:'g_fentian',nuwa:'g_nuwa',xuannu:'g_xuannu'}","}")
rep("VIDS=new Set(['xuannu',","VIDS=new Set([")
# strategy scroll + hit spark (8-frame art, rows 10–11)
rep("speed:6,iron:7,dust:8,rally:9,","speed:6,iron:7,dust:8,rally:9,scroll:10,hit:11,")
rep("function quickHit(a,d,mult,o={}){if(!G.units.includes(d))return 0;","function quickHit(a,d,mult,o={}){if(!G.units.includes(d))return 0;mfx('hit',d.x,d.y,1000,1.5);")
rep("async function doAttack(a,d,o={}){","async function doAttack(a,d,o={}){mfx('hit',d.x,d.y,1000,1.5);")

# per-sheet scale so every general's head is about the same size (sheets with tall weapons/feathers were cut smaller)
rep("function drawToken(c,u,now){","const GSCALE={f_lubu:1.45,f_sunshangxiang:1.2,f_ladygan:1.12,f_ladymi:1.25,f_consortzhao:1.2,f_consortli:1.25,f_consortyan:1.15,f_huangyi:1.12,f_zhurong:1.12,f_renrui:1.25,tiger:1.9,wolf:1.6};\nfunction sprK(src){const m=/sprites\\/([a-z0-9_]+?)_(shu|wei|wu|ind)\\.png/.exec(src||'');return m&&GSCALE[m[1]]||1}\nfunction drawToken(c,u,now){")
rep("k=((sh.src||'').includes('f_lubu')?1.3:(sh.src||'').includes('/tiger_')?1.9:(sh.src||'').includes('/wolf_')?1.6:1)","k=sprK(sh.src)")
# defenders: every rank joins the melee (front rank first), not only the front column
rep("S.hold?alive&&t>=(S.holdT||1050)&&t<=(S.holdE||2500)&&s.col<=(S.holdC||0)","S.hold?alive&&t>=(S.holdT||1050)+s.col*110&&t<=(S.holdE||2500)")
rep("kk=(sh.src.includes('f_lubu')?1.3:sh.src.includes('/tiger_')?1.9:1)*84/150;","kk=sprK(sh.src)*84/150;")

# no turn-around frames anywhere (cavalry charge was still using them): always an instant flip
rep("if(f.tk&&!f.fall&&TURNSH[tkey]){","if(false&&f.tk&&!f.fall&&TURNSH[tkey]){")
rep("...Object.keys(TURNSH).map(t=>t+'_turn')]","]")

# Fire God's Wrath: aim at an enemy up to 3 squares away; the 3×3 around it burns
rep("if(!(d===2||(d>=1&&d<=2&&eh&&eh.side!==s.side)))continue;","if(!(d>=1&&d<=3&&eh&&eh.side!==s.side))continue;")
rep("desc:'A 3×3 firestorm centred on a square 2 away: heavy fire damage to every enemy in it'","desc:'Call down fire on an enemy up to 3 squares away: heavy fire damage to it and every enemy around it'")

# Huang Wenjing merged into Cai Wenji (same musician): Cai Wenji gets her art, 武 troops and Heaven-Shaking Melody
rep("HERO.melody={who:'huangwenjing',","HERO.melody={who:'caiwenji',")
rep("mend:{who:'caiwenji',","mend:{who:'',")
rep("huangwenjing:'f_huangwenjing',","caiwenji:'f_huangwenjing',")
rep("WU_GENS=new Set(['diaochan','huangyueying','huangwenjing'])","WU_GENS=new Set(['diaochan','huangyueying','caiwenji'])")
rep("const GSHEET={renrui:'f_renrui',","const GSHEET={zhenji:'f_consortzhao',daqiao:'f_consortli',xiaoqiao:'f_consortyan',renrui:'f_renrui',")

rep("consortli:'f_consortli',","")
rep("consortyan:'f_consortyan',","")
rep("consortzhao:'f_consortzhao',","")

# Jiutian Xuannü returns as a mortal free general; Thousand Blades goes back to her; Ren Rui gets Assassin's Blade
rep("star:{who:'renrui',","star:{who:'xuannu',")
rep("const GSHEET={zhenji:","const GSHEET={xuannu:'f_xuannu',zhenji:")
rep("VIDS=new Set([","VIDS=new Set(['xuannu',")
rep("HERO.palm={","HERO.assassin={who:'renrui',zh:'暗殺刃',n:'Assassin\\'s Blade',targets:s=>enemies().filter(e=>manh(s,e)<=3),desc:'Strike from the shadows at an enemy up to 3 squares away (×1.2, no counter)'};\nHERO.palm={")
rep("'thunder','flood','meteor'].includes(k))delete HERO[k];","'thunder','flood','meteor','assassin'].includes(k))delete HERO[k];")
rep("else if(k==='meteor'){","else if(k==='assassin'){mfx('smoke',s.x,s.y,700,1.4);SND.fx('hit');await sleep(250);mfx('arc',t.x,t.y,800,1.8);const dmg=quickHit(s,t,1.2,{color:'#c9a6ff'});log(`<b>Assassin\\'s Blade!</b> ${nm(s)} strikes ${nm(t)} from the shadows: −${dmg}.`);await sleep(700)}\n  else if(k==='meteor'){")

# Mi Ren: free general, 武 troops, Spring Blessing heals every allied unit 20% (cooldown 4)
rep("const FEM=new Set(['renrui',","const FEM=new Set(['miren','renrui',")
rep("const GSHEET={xuannu:'f_xuannu',","const GSHEET={miren:'f_miren',xuannu:'f_xuannu',")
rep("WU_GENS=new Set(['diaochan','huangyueying','caiwenji'])","WU_GENS=new Set(['diaochan','huangyueying','caiwenji','miren'])")
rep("HERO.palm={","HERO.bless={who:'miren',zh:'春華',n:'Spring Blessing',self:1,can:s=>G.units.some(u=>u.side===s.side&&u.troops<u.max),desc:'Restore 20% troops to every allied unit on the field. Ready again after 4 turns'};\nHERO.palm={")
rep("'thunder','flood','meteor','assassin'].includes(k))delete HERO[k];","'thunder','flood','meteor','assassin','bless'].includes(k))delete HERO[k];")
rep("else if(k==='assassin'){","else if(k==='bless'){s.cd.bless=4;SND.fx('chime');let tot=0;for(const u of G.units.filter(u=>u.side===s.side)){const add=Math.min(u.max-u.troops,Math.round(u.max*.2));mfx('heal',u.x,u.y,1100,1.8);if(add>0){u.troops+=add;tot+=add;float(u,'+'+add,'#b8ffc4')}}log(`<b>Spring Blessing!</b> ${nm(s)}\\'s light heals the whole army: +${tot} troops.`);await sleep(900)}\n  else if(k==='assassin'){")
rep("else if(k==='frost'){gfx('yueshuang',s.x,s.y,4.2,2000);","else if(k==='frost'){gfx('frostlotus',s.x,s.y,4.2,2000);")
# Sheet 1: petal storm (Diaochan) + bagua (Huang Yueying)
rep("thunder:12,flood:13,guard:14,guardloop:15}","thunder:12,flood:13,guard:14,guardloop:15,petal:16,bagua:17}")
rep("else if(k==='petal'){const hit=[t,...enemies().filter(e=>e!==t&&manh(e,t)===1).slice(0,2)];for(const e of hit)mfx('ring',e.x,e.y,900);","else if(k==='petal'){const hit=[t,...enemies().filter(e=>e!==t&&manh(e,t)===1).slice(0,2)];mfx('petal',t.x,t.y,1000,2.8);for(const e of hit)if(e!==t)mfx('petal',e.x,e.y,1000,1.6);")
rep("mfx('ring',t.x,t.y,1100,2.6);for(const e of hit)mfx('arc',e.x,e.y,900);","mfx('bagua',t.x,t.y,1000,3.4);")
# Sheet 2: sound waves (Cai Wenji) + halberd whirlwind (Lü Bu)
rep("petal:16,bagua:17}","petal:16,bagua:17,sound:18,whirl:19}")
rep("else if(k==='melody'){const hit=enemies().filter(e=>manh(s,e)<=2);mfx('ring',s.x,s.y,1100,3);for(const e of hit)mfx('arc',e.x,e.y,800);","else if(k==='melody'){const hit=enemies().filter(e=>manh(s,e)<=2);mfx('sound',s.x,s.y,1000,4.2);")
rep("else if(k==='musou'){const hit=G.units.filter(e=>e.side!==s.side&&manh(s,e)<=2);mfx('ring',s.x,s.y,1100,3);for(const e of hit)mfx('arc',e.x,e.y,800);","else if(k==='musou'){const hit=G.units.filter(e=>e.side!==s.side&&manh(s,e)<=2);mfx('whirl',s.x,s.y,1000,4.2);")
# Sheet 3: fire chakrams (Sun Shangxiang) + green dragon crescent (Guan Yinping)
rep("sound:18,whirl:19}","sound:18,whirl:19,chakram:20,dragon:21}")
rep("k==='chakram'){mfx('ring',t.x,t.y,800);SND.fx('crit');await sleep(400);let tot=quickHit(s,t,.7,{color:'#ffb060'});await sleep(350);if(G.units.includes(t)){mfx('ring',t.x,t.y,800);","k==='chakram'){mfx('chakram',t.x,t.y,1000,2.8);SND.fx('crit');await sleep(400);let tot=quickHit(s,t,.7,{color:'#ffb060'});await sleep(350);if(G.units.includes(t)){")
rep("if(bh&&bh.side!==s.side&&(dx||dy))hit.push(bh);for(const e of hit)mfx('arc',e.x,e.y,800);","if(bh&&bh.side!==s.side&&(dx||dy))hit.push(bh);mfx('dragon',(s.x+t.x)/2+dx*.5,(s.y+t.y)/2+dy*.5,1000,3.2);")
# Sheet 4: shadow slash (Ren Rui) + east wind (Zhuge Liang)
rep("chakram:20,dragon:21}","chakram:20,dragon:21,shadow:22,eastwind:23}")
rep("mfx('arc',t.x,t.y,800,1.8);const dmg=quickHit(s,t,1.2,{color:'#c9a6ff'});","mfx('shadow',t.x,t.y,1000,2.6);const dmg=quickHit(s,t,1.2,{color:'#c9a6ff'});")
rep("else if(k==='wind'){s.eastWind=true;mfx('wind',(COLS-1)/2,(ROWS-1)/2,1800,COLS*.9);","else if(k==='wind'){s.eastWind=true;mfx('eastwind',s.x,s.y,1000,3.6);")

# Mi Shao: Mi Ren's sister; 武 troops; Gentle Grace heals every allied unit 15% (cooldown 4)
rep("const FEM=new Set(['miren',","const FEM=new Set(['mishao','miren',")
rep("const GSHEET={miren:'f_miren',","const GSHEET={mishao:'f_mishao',miren:'f_miren',")
rep("WU_GENS=new Set(['diaochan','huangyueying','caiwenji','miren'])","WU_GENS=new Set(['diaochan','huangyueying','caiwenji','miren','mishao'])")
rep("HERO.palm={","HERO.grace={who:'mishao',zh:'韶光',n:'Gentle Grace',self:1,can:s=>G.units.some(u=>u.side===s.side&&u.troops<u.max),desc:'Restore 15% troops to every allied unit on the field. Ready again after 4 turns'};\nHERO.palm={")
rep("'meteor','assassin','bless'].includes(k))delete HERO[k];","'meteor','assassin','bless','grace'].includes(k))delete HERO[k];")
rep("else if(k==='bless'){s.cd.bless=4;","else if(k==='grace'){s.cd.grace=4;SND.fx('chime');let tot=0;for(const u of G.units.filter(u=>u.side===s.side)){const add=Math.min(u.max-u.troops,Math.round(u.max*.15));mfx('heal',u.x,u.y,1100,1.8);if(add>0){u.troops+=add;tot+=add;float(u,'+'+add,'#b8ffc4')}}log(`<b>Gentle Grace!</b> ${nm(s)}\\'s light heals the whole army: +${tot} troops.`);await sleep(900)}\n  else if(k==='bless'){s.cd.bless=4;")

# ---- archer specials for Lady Gan, Lady Mi, Da Qiao, Xiao Qiao ----
rep("*(d.iron?.5:1)","*(d.iron?.5:1)*(d.pierceT>G.turn?1.2:1)",2)
rep("HERO.palm={","HERO.linked={who:'ladygan',zh:'連珠箭',n:'Linked Arrows',targets:s=>enemies().filter(e=>manh(s,e)<=3),desc:'Three arrows in a row at an enemy up to 3 squares away (×0.5 each, no counter)'};\nHERO.rain={who:'ladymi',zh:'箭雨',n:'Arrow Rain',targets:s=>enemies().filter(e=>manh(s,e)<=4),desc:'Arrows rain on the 3×3 around an enemy up to 4 squares away (×0.6 to every enemy in it, no counter)'};\nHERO.pierce={who:'daqiao',zh:'破甲箭',n:'Armour-Piercing Shot',targets:s=>enemies().filter(e=>manh(s,e)<=4),desc:'One arrow at an enemy up to 4 squares away (×1.3, no counter); it takes 20% more damage for 2 turns'};\nHERO.firearrow={who:'xiaoqiao',zh:'火矢',n:'Fire Arrows',targets:s=>enemies().filter(e=>manh(s,e)<=4),desc:'A burning arrow at an enemy up to 4 squares away: fire damage based on Intelligence, and the square catches fire'};\nHERO.palm={")
rep("'meteor','assassin','bless','grace'].includes(k))delete HERO[k];","'meteor','assassin','bless','grace','linked','rain','pierce','firearrow'].includes(k))delete HERO[k];")
rep("else if(k==='grace'){","else if(k==='linked'){SND.fx('arrows');let tot=0;for(let i=0;i<3&&G.units.includes(t);i++){mfx('hit',t.x,t.y,1000,1.4);tot+=quickHit(s,t,.5,{color:'#ffe08a'});await sleep(260)}log(`<b>Linked Arrows!</b> ${nm(s)} looses three arrows at ${nm(t)}: −${tot}.`);await sleep(600)}\n  else if(k==='rain'){SND.fx('arrows');const hit=enemies().filter(e=>Math.max(Math.abs(e.x-t.x),Math.abs(e.y-t.y))<=1);for(const p of area3(t.x,t.y))mfx('hit',p.x,p.y,1000,1.1);await sleep(400);let tot=0;for(const e of hit){tot+=quickHit(s,e,.6,{color:'#ffe08a'});await sleep(90)}log(`<b>Arrow Rain!</b> ${nm(s)}\\'s arrows fall on ${hit.map(nm).join(', ')}: −${tot}.`);await sleep(600)}\n  else if(k==='pierce'){SND.fx('arrows');mfx('hit',t.x,t.y,1000,2);await sleep(300);const dmg=quickHit(s,t,1.3,{color:'#ffe08a'});if(G.units.includes(t)){t.pierceT=G.turn+2;setTimeout(()=>G.units.includes(t)&&float(t,'Armour broken','#ffb08a'),350)}log(`<b>Armour-Piercing Shot!</b> ${nm(s)} hits ${nm(t)}: −${dmg}. It takes 20% more damage for 2 turns.`);await sleep(700)}\n  else if(k==='firearrow'){SND.fx('arrows');await sleep(250);const dmg=fireHit(s,t,1.2);log(`<b>Fire Arrows!</b> ${nm(s)}\\'s burning arrow strikes ${nm(t)}: −${dmg}.`);await sleep(700)}\n  else if(k==='grace'){")
rep("const dmg=fireHit(s,t,1.2);log(`<b>Fire Arrows!","const dmg=fireHit(s,t,1.8);log(`<b>Fire Arrows!")
# balance pass
rep("const dmg=fireHit(s,t,1.8);log(`<b>Fire Arrows!","const dmg=fireHit(s,t,3);log(`<b>Fire Arrows!")
rep("const dmg=quickHit(s,t,1.3,{color:'#ffe08a'});if(G.units.includes(t)){t.pierceT","const dmg=quickHit(s,t,1.6,{color:'#ffe08a'});if(G.units.includes(t)){t.pierceT")
rep("desc:'One arrow at an enemy up to 4 squares away (×1.3, no counter)","desc:'One arrow at an enemy up to 4 squares away (×1.6, no counter)")
rep("if(e&&e.side!==s.side){fireHit(s,e,1.6)","if(e&&e.side!==s.side){fireHit(s,e,s.id==='zhurong'?2.6:1.6)")
rep("All five heroines have fallen.","All sixteen heroines have fallen.")

# user's archer revisions: Lady Mi line of 2, Da Qiao ×1.2 range 3, Xiao Qiao range 3
rep("HERO.rain={who:'ladymi',zh:'箭雨',n:'Arrow Rain',targets:s=>enemies().filter(e=>manh(s,e)<=4),desc:'Arrows rain on the 3×3 around an enemy up to 4 squares away (×0.6 to every enemy in it, no counter)'};","function lineDirs(s,n){return DIRS.map(([dx,dy])=>{const line=[];for(let i=1;i<=n;i++){const x=s.x+dx*i,y=s.y+dy*i;if(!inb(x,y))break;line.push({x,y})}const hit=line.map(p=>unitAt(p.x,p.y)).filter(u=>u&&u.side!==s.side);if(!hit.length)return null;const a=ARW[dx+','+dy];return{fake:1,x:line[0].x,y:line[0].y,dir:[dx,dy],area:line,label:`${a[0]} ${a[1]}`,name:a[1],type:'shield',note:`hits ${hit.map(u=>u.name).join(', ')}`}}).filter(Boolean)}\nHERO.rain={who:'ladymi',zh:'箭雨',n:'Arrow Rain',targets:s=>lineDirs(s,2),desc:'Arrows rain on a straight line of 2 squares: every enemy in it takes ×0.6 (no counter). Pick a direction'};")
rep("else if(k==='rain'){SND.fx('arrows');const hit=enemies().filter(e=>Math.max(Math.abs(e.x-t.x),Math.abs(e.y-t.y))<=1);for(const p of area3(t.x,t.y))mfx('hit',p.x,p.y,1000,1.1);","else if(k==='rain'){SND.fx('arrows');const hit=t.area.map(p=>unitAt(p.x,p.y)).filter(u=>u&&u.side!==s.side);for(const p of t.area)mfx('hit',p.x,p.y,1000,1.3);")
rep("HERO.pierce={who:'daqiao',zh:'破甲箭',n:'Armour-Piercing Shot',targets:s=>enemies().filter(e=>manh(s,e)<=4),desc:'One arrow at an enemy up to 4 squares away (×1.6, no counter)","HERO.pierce={who:'daqiao',zh:'破甲箭',n:'Armour-Piercing Shot',targets:s=>enemies().filter(e=>manh(s,e)<=3),desc:'One arrow at an enemy up to 3 squares away (×1.2, no counter)")
rep("const dmg=quickHit(s,t,1.6,{color:'#ffe08a'});if(G.units.includes(t)){t.pierceT","const dmg=quickHit(s,t,1.2,{color:'#ffe08a'});if(G.units.includes(t)){t.pierceT")
rep("HERO.firearrow={who:'xiaoqiao',zh:'火矢',n:'Fire Arrows',targets:s=>enemies().filter(e=>manh(s,e)<=4),desc:'A burning arrow at an enemy up to 4 squares away","HERO.firearrow={who:'xiaoqiao',zh:'火矢',n:'Fire Arrows',targets:s=>enemies().filter(e=>manh(s,e)<=3),desc:'A burning arrow at an enemy up to 3 squares away")
# equal heights for every general (head-size zoom removed); Lü Bu kept a bit larger as the boss
rep("const GSCALE={f_lubu:1.45,f_sunshangxiang:1.2,f_ladygan:1.12,f_ladymi:1.25,f_consortzhao:1.2,f_consortli:1.25,f_consortyan:1.15,f_huangyi:1.12,f_zhurong:1.12,f_renrui:1.25,tiger:1.9,wolf:1.6}","const GSCALE={f_lubu:1.2,tiger:1.9,wolf:1.6}")
rep("VIDS=new Set(['xuannu',","VIDS=new Set(['huang_yi','xuannu',")
# Ren Rui Grok cut-in video (25 Oct)
rep("VIDS=new Set(['huang_yi',","VIDS=new Set(['ren_rui','huang_yi',")
# Zhu Rong Grok cut-in video (25 Oct)
rep("VIDS=new Set(['ren_rui',","VIDS=new Set(['zhurong','ren_rui',")
