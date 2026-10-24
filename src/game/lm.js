// ===== Langrisser-style battle presentation: map sprites, regions, HUD, preview, phase banner, fight-scene FX =====
const LM_TZ={spear:'槍',shield:'盾',archer:'弓',cav:'騎',wu:'武',peasant:'民',undead:'屍',tiger:'虎',wolf:'狼'},LM_FR='#3ab4ff',LM_FO='#ff4b3a';
function lmHexA(h,a){const n=parseInt(h.slice(1),16);return `rgba(${n>>16},${n>>8&255},${n&255},${a})`}
function lmGrade(cv,flt){try{const o=document.createElement('canvas');o.width=cv.width;o.height=cv.height;const x=o.getContext('2d');if(!('filter' in x))return cv;x.filter=flt;x.drawImage(cv,0,0);return o}catch(e){return cv}}
function renderTerrain(T){return lmGrade(renderTerrain0(T),'saturate(1.45) contrast(1.1) brightness(1.1)')}
function makeBG(ter,defSide,duel){return lmGrade(makeBG0(ter,defSide,duel),'saturate(1.3) contrast(1.08) brightness(1.08)')}

// ---------- map: units as sprites on a friend/foe ring ----------
function drawToken(c,u,now){
  const fk=sprFac(u.side),osh=sprSheet(femKey(u)||'general',fk),ssh=sprSheet(u.type,fk);
  if(!osh||!ssh){drawToken0(c,u,now);return}
  const fr=u.side==='shu',ring=fr?LM_FR:LM_FO,X=u.px*T+T/2,Y=u.py*T+T/2;
  const moving=Math.abs(u.px-u.x)+Math.abs(u.py-u.y)>.001;
  if(u._lx!=null&&Math.abs(u.px-u._lx)>.001)u._face=u.px>u._lx?1:-1;u._lx=u.px;
  if(!moving&&G.phase!=='enemy'&&!fr)u._face=null;
  const face=u._face||(fr?1:-1),done=fr&&u.acted&&G.phase==='player',sel=G.sel===u,pulse=(Math.sin(now/180)+1)/2;
  if(sel){const tx=X-T/2,ty=Y-T/2;c.save();c.shadowColor='#ffd84a';c.shadowBlur=T*.5;c.lineWidth=T*.11;c.strokeStyle=`rgba(255,${200+40*pulse},40,1)`;c.fillStyle=`rgba(255,215,70,${.38+.17*pulse})`;
    c.beginPath();c.roundRect?c.roundRect(tx+T*.06,ty+T*.06,T*.88,T*.88,T*.14):c.rect(tx+T*.06,ty+T*.06,T*.88,T*.88);c.fill();c.stroke();c.shadowBlur=0;c.lineWidth=T*.03;c.strokeStyle='#fff6c8';c.stroke();c.restore();
    c.save();const lg=c.createLinearGradient(0,Y+T*.3,0,Y-T*1.1);lg.addColorStop(0,`rgba(255,225,110,${.45+.2*pulse})`);lg.addColorStop(1,'rgba(255,225,110,0)');c.fillStyle=lg;c.globalCompositeOperation='lighter';c.fillRect(X-T*.32,Y-T*1.1,T*.64,T*1.4);c.restore()}
  c.save();c.translate(X,Y+T*.30);c.scale(1,.42);
  const g=c.createRadialGradient(0,0,0,0,0,T*.5);g.addColorStop(0,lmHexA(ring,.04));g.addColorStop(.72,lmHexA(ring,done?.12:.45));g.addColorStop(1,lmHexA(ring,0));
  c.fillStyle=g;c.beginPath();c.arc(0,0,T*.5,0,7);c.fill();
  c.lineWidth=T*(sel?.075:.05);c.strokeStyle=done?'rgba(170,170,170,.55)':sel?`rgba(255,230,110,${.65+.35*pulse})`:lmHexA(ring,.95);c.beginPath();c.arc(0,0,T*.4,0,7);c.stroke();
  if(u.cmd){c.lineWidth=T*.022;c.strokeStyle='#ffd45a';c.beginPath();c.arc(0,0,T*.47,0,7);c.stroke()}
  c.restore();
  const n=u.troops<=0?0:u.hpMax===0?(u.troops/u.max>.5?4:u.troops/u.max>.2?3:2):u.troops/u.max>.66?3:u.troops/u.max>.33?2:1,offs=[[-.30,-.13],[-.36,.09],[-.08,-.22],[.12,.04]],run=moving?now*.03:G.sel===u?now*.012:null,items=[];
  for(let i=0;i<n;i++){const [ox,oy]=offs[i],y=Y+T*(.27+oy);items.push({y,f:{x:X+face*T*(ox+.03),y,s:T*.92/83,face,fac:u.side,type:u.type,run:run!=null?run+i*1.3:null,seed:(u.x*7+u.y*3+i*2)%6}})}
  if(u.hpMax!==0)items.push({y:Y+T*.31,f:{x:X+face*T*.08,y:Y+T*.31,s:T*1.5/98,face,fac:u.side,type:u.type,officer:true,ch:u.ch,fem:femKey(u),run,seed:1.7+u.x*.3}});
  items.sort((a,b)=>a.y-b.y);
  c.save();if(done){if('filter' in c)c.filter='grayscale(1) brightness(.75)';else c.globalAlpha=.6}
  for(const it of items)drawSprite(c,it.f,it.f.officer?osh:ssh);
  c.restore();
  // troop bar with a round face beside it
  const bw=T*.62,bh=Math.max(4,T*.085),bx=X-bw/2+T*.1,by=Y+T*.40,hm=u.hpMax||0,frac=clamp((u.troops-hm)/Math.max(1,u.max-hm)),hf=hm?clamp(u.troops/hm):0;
  if(hm){const hy=by-Math.max(3,T*.05)-2;c.fillStyle='rgba(0,0,0,.78)';rr(c,bx-1,hy-1,bw+2,Math.max(3,T*.05)+2,2);c.fill();c.fillStyle=fr?'#7dd8ff':'#ffb36a';rr(c,bx,hy,Math.max(2,bw*hf),Math.max(3,T*.05),2);c.fill()}
  c.fillStyle='rgba(0,0,0,.78)';rr(c,bx-1.5,by-1.5,bw+3,bh+3,bh);c.fill();
  const gg=c.createLinearGradient(0,by,0,by+bh);if(fr){gg.addColorStop(0,'#b4ff9e');gg.addColorStop(1,'#1fa636')}else{gg.addColorStop(0,'#ffa08c');gg.addColorStop(1,'#c8261a')}
  if(frac>0){c.fillStyle=gg;rr(c,bx,by,Math.max(bh,bw*frac),bh,bh/2);c.fill()}
  const pr=T*.15,px=bx-pr*.55,py=by+bh/2,pim=portImg(u.id);
  c.fillStyle='#0a0f1c';circ(c,px,py,pr+1.5);c.fill();
  if(pim){c.save();circ(c,px,py,pr);c.clip();const k=PK(pim);c.drawImage(pim,96*k,24*k,320*k,320*k,px-pr,py-pr,pr*2,pr*2);c.restore()}
  else{c.fillStyle=FAC[u.side].main;circ(c,px,py,pr);c.fill();c.fillStyle='#fff';c.font=`900 ${Math.round(pr*1.2)}px "Noto Serif TC",serif`;c.textAlign='center';c.textBaseline='middle';c.fillText(u.ch,px,py+1);c.textBaseline='alphabetic'}
  c.lineWidth=Math.max(1.5,T*.026);c.strokeStyle=u.cmd?'#ffd45a':ring;circ(c,px,py,pr);c.stroke();
  const tb=T*.115,tx=X+T*.36,ty=Y-T*.32;c.fillStyle=lmHexA(ring,.95);circ(c,tx,ty,tb);c.fill();c.strokeStyle='#fff3c4';c.lineWidth=Math.max(1.2,T*.02);c.stroke();
  c.fillStyle='#fff';c.font=`900 ${Math.round(tb*1.25)}px "Noto Serif TC",serif`;c.textAlign='center';c.textBaseline='middle';c.fillText(LM_TZ[u.type]||'兵',tx,ty+tb*.06);
  if(sel&&G.phase==='player'){const ay=Y-T*1.12-Math.abs(Math.sin(now/260))*T*.16,aw=T*.24;c.save();c.shadowColor='rgba(0,0,0,.6)';c.shadowBlur=4;c.fillStyle='#ffd23c';c.strokeStyle='#7a4a00';c.lineWidth=2;
    c.beginPath();c.moveTo(X-aw,ay-aw*.9);c.lineTo(X+aw,ay-aw*.9);c.lineTo(X,ay+aw*.5);c.closePath();c.fill();c.stroke();c.restore()}
  if(G.sel&&G.phase==='player'&&!fr&&(((G.mode==='select'||G.mode==='moved')&&G.atk&&G.atk.includes(u))||(G.mode==='target'&&G.targets.some(t=>t.u===u)))){const bs=T*.36,bx2=X-bs/2,by2=Y-T*.62-Math.sin(now/220)*T*.03,pv=(G.pv&&G.pv.u===u)||G.skc===u;
    c.save();c.shadowColor='#ff2a10';c.shadowBlur=pv?16:8;const gb=c.createLinearGradient(0,by2,0,by2+bs);gb.addColorStop(0,'#ff8a6a');gb.addColorStop(1,'#c4160a');c.fillStyle=gb;rr(c,bx2,by2,bs,bs,bs*.18);c.fill();c.shadowBlur=0;c.lineWidth=Math.max(1.5,T*.025);c.strokeStyle='#ffe3c8';c.stroke();
    c.translate(X,by2+bs/2);c.rotate(-Math.PI/4);c.fillStyle='#fff';c.beginPath();c.moveTo(0,-bs*.36);c.lineTo(bs*.07,-bs*.1);c.lineTo(bs*.07,bs*.16);c.lineTo(-bs*.07,bs*.16);c.lineTo(-bs*.07,-bs*.1);c.closePath();c.fill();c.fillRect(-bs*.17,bs*.16,bs*.34,bs*.05);c.fillRect(-bs*.04,bs*.21,bs*.08,bs*.14);c.restore()}
  if(u.stun){c.font=`900 ${Math.round(T*.26)}px sans-serif`;c.lineWidth=3;c.strokeStyle='#000';c.strokeText('✕',X-T*.3,Y-T*.3);c.fillStyle='#ff6a5a';c.fillText('✕',X-T*.3,Y-T*.3)}
  c.textBaseline='alphabetic'}

// ---------- map: filled regions with one outline around the edge ----------
function lmRegion(c,tiles,fill,edge){if(!tiles||!tiles.length)return;const S=new Set(tiles.map(t=>t.x+','+t.y));c.save();
  c.fillStyle=fill;for(const t of tiles)c.fillRect(t.x*T,t.y*T,T,T);
  c.strokeStyle='rgba(255,255,255,.16)';c.lineWidth=1;for(const t of tiles)c.strokeRect(t.x*T+1.5,t.y*T+1.5,T-3,T-3);
  c.strokeStyle=edge;c.lineWidth=Math.max(2,T*.04);c.lineCap='round';c.shadowColor=edge;c.shadowBlur=8;c.beginPath();
  for(const t of tiles){const x=t.x*T,y=t.y*T;
    if(!S.has(t.x+','+(t.y-1))){c.moveTo(x,y);c.lineTo(x+T,y)}if(!S.has(t.x+','+(t.y+1))){c.moveTo(x,y+T);c.lineTo(x+T,y+T)}
    if(!S.has((t.x-1)+','+t.y)){c.moveTo(x,y);c.lineTo(x,y+T)}if(!S.has((t.x+1)+','+t.y)){c.moveTo(x+T,y);c.lineTo(x+T,y+T)}}
  c.stroke();c.restore()}
let lmThK='',lmThT=[];
function threatTiles(){const k=G.turn+'|'+G.units.map(u=>u.id+':'+u.x+','+u.y).join(';');if(k===lmThK)return lmThT;lmThK=k;const out=new Map();
  for(const e of enemies()){if(e.stun)continue;const R=reach(e),[r0,r1]=TYPES[e.type].rng;
    for(const t of R.tiles)for(let dx=-r1;dx<=r1;dx++)for(let dy=-r1;dy<=r1;dy++){const d=Math.abs(dx)+Math.abs(dy);if(d>r1||(d>0&&d<r0))continue;const x=t.x+dx,y=t.y+dy;if(inb(x,y))out.set(x+','+y,{x,y})}}
  lmThT=[...out.values()];return lmThT}
function lmPvMark(c,now){const u=G.pv.u,p=(Math.sin(now/160)+1)/2,x=u.px*T+T/2,y=u.py*T+T/2,r=T*(.44+p*.05);c.save();c.strokeStyle=`rgba(255,80,60,${.75+.25*p})`;c.lineWidth=T*.05;c.shadowColor='#ff3a2a';c.shadowBlur=12;
  for(let i=0;i<4;i++){const a=i*Math.PI/2+Math.PI/4;c.beginPath();c.arc(x,y,r,a-.42,a+.42);c.stroke()}c.restore()}

// ---------- HUD ----------
function updateUI(){updateUI0();try{lmPost()}catch(e){console.error(e)}}
function lmPortHTML(u){return PORT[u.id]?`<img src="portraits/${PORT[u.id]}.webp" alt="">`:`<div class="useal" style="background:${FAC[u.side].main}">${u.ch}</div>`}
function lmPost(){if(!G)return;
  $('#hint').hidden=G.phase!=='prep';
  const u=G.view,box=$('#info');box.classList.toggle('fo',!!u&&u.side!=='shu');
  if(u){const fr=u.side==='shu',chips=[];
    if(u.guard)chips.push('<span>Bracing</span>');if(u.stun)chips.push('<span class="bad">Rallying · misses a turn</span>');if(fr&&u.acted&&G.phase==='player')chips.push('<span>Done this turn</span>');if(u.dueled)chips.push('<span>Already dueled</span>');
    box.innerHTML=`<div class="ustrip"><div class="uav">${lmPortHTML(u)}<i class="ut">${LM_TZ[u.type]||'兵'}</i></div><div class="ubody"><div class="un">${u.name}${u.cmd?'<span class="ucm">♛ Commander</span>':''}</div><div class="ust">${TYPES[u.type].n} · War <b>${u.war}</b> · Int <b>${u.int}</b> · Mv <b>${TYPES[u.type].mv}</b> · ${T_INFO[terAt(u.x,u.y)].n}</div>${u.hpMax?`<div class="ubar hb"><i style="width:${100*clamp(HP(u)/(u.hpMax||1))}%"></i><span>Hero ${HP(u)} / ${u.hpMax||0}</span></div>`:'<div class="ubar hb"><span>No general · beast pack</span></div>'}<div class="ubar"><i style="width:${100*clamp(SOL(u)/Math.max(1,u.max-(u.hpMax||0)))}%"></i><span>${u.type==='tiger'?'Tigers':u.type==='wolf'?'Wolves':'Soldiers'} ${DSOL(u,SOL(u))} / ${DSOL(u,u.max-(u.hpMax||0))}</span></div>${chips.length?`<div class="uchips">${chips.join('')}</div>`:''}</div></div>`}
  const acts=$('#acts');
  if(G.pv&&!(G.sel===G.pv.s&&(G.mode==='select'||G.mode==='moved')&&G.units.includes(G.pv.u)&&G.phase==='player'&&!G.busy))G.pv=null;
  const pv=$('#pv');if(G.pv){pv.innerHTML=lmPvHTML(G.pv.s,G.pv.u);pv.hidden=false}else{pv.hidden=true;pv.innerHTML=''}
  $('.hud.bl').hidden=!!acts.innerHTML||!$('#tpanel').hidden||!!G.pv||G.phase==='prep';
  $('#speedBtn').textContent=speed===0?'Scenes off':`▶ ${speed}×`;
  const rb=$('#retreatBtn');rb.textContent='⚑';rb.title='Retreat';rb.classList.remove('autoon');
  const ab=$('#autoBtn');ab.classList.toggle('on',!!G.auto);ab.disabled=!!G.over||(!G.auto&&(G.phase!=='player'||G.busy));
  $('#threatBtn').classList.toggle('on',!!G.threat);
  if(G.phase!==G._lph){G._lph=G.phase;if(!G.over&&G.phase==='player')lmBanner('Player Phase',`Turn ${G.turn} / ${G.maxTurn}${G.maxTurn-G.turn<3?` · ${G.maxTurn-G.turn+1} turn${G.maxTurn-G.turn?'s':''} left!`:''}`,G.maxTurn-G.turn<3?'warn':'');else if(!G.over&&G.phase==='enemy')lmBanner('Enemy Phase',FAC.wei.name,'fo')}}
function lmPvHTML(s,e){const f=forecast(s,e),m=f.m,up='<span class="pup">▲</span>',dn='<span class="pdn">▼</span>';
  const side=(u,loss,fr,arrow)=>{loss=Math.min(loss,u.troops);const nw=clamp((u.troops-loss)/u.max),ls=clamp(loss/u.max);
    const hm=u.hpMax||0,s0=Math.max(0,u.troops-hm),s1=Math.max(0,u.troops-loss-hm),h1=Math.min(hm,Math.max(0,u.troops-loss));return `<div class="pvs ${fr?'fr':'fo'}">${lmPortHTML(u)}<div class="pi"><b>${u.name}</b><small>${TYPES[u.type].n} ${arrow}</small><div class="pvbar"><i class="now" style="width:${nw*100}%"></i><i class="loss" style="${fr?'left':'right'}:${nw*100}%;width:${ls*100}%"></i></div><span class="pvn">${u.type==='tiger'?'Tigers':u.type==='wolf'?'Wolves':'Soldiers'} ${DSOL(u,s0)} → <em>${DSOL(u,s1)}</em>${h1<Math.min(hm,u.troops)?` · Hero → <em>${h1}</em>`:''}</span></div></div>`};
  return side(s,f.take,true,m>1?up:m<1?dn:'')+`<div class="pvvs">VS</div>`+side(e,f.deal,false,m<1?up:m>1?dn:'')+`<div class="pvbtns"><button data-pv="go" class="go">攻 Attack</button><button data-pv="no">Cancel</button></div>`}
function lmBanner(t,sub,cls){const b=$('#phaseBan');b.className='';b.querySelector('b').textContent=t;b.querySelector('small').textContent=sub||'';void b.offsetWidth;b.className='show '+(cls||'')}
$('#pv').addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!G||!G.pv||G.busy)return;const {s,u}=G.pv;G.pv=null;if(b.dataset.pv!=='go'){updateUI();return}
  G.tmode='attack';if(inRange(s.type,manh(s,u))){execTarget(u);return}const t=bestAttackTile(s,u);if(t)moveThenAttack(s,u,t);else updateUI()});
$('#threatBtn').onclick=()=>{if(!G)return;G.threat=!G.threat;updateUI()};
$('#autoBtn').onclick=()=>{if(!G||G.over)return;if(G.auto){G.auto=false;speed=G.autoSpeed??speed;log('You take back command.');updateUI();return}
  if(G.phase!=='player'||G.busy)return;G.auto=true;G.autoSpeed=speed;if(speed===1)speed=2;G.pv=null;log('<b>Auto battle.</b> Your officers fight on. Tap AUTO again to take back command.');updateUI();autoTurn()};

// ---------- fight scene ----------
function playBattle0(att,def,r){LMF={att,def,r};return playBattle0_(att,def,r)}
let LMF=null;
function lmBar(c,x,y,w,h,frac,ghost,fr,right,flash){
  c.fillStyle='rgba(0,0,0,.8)';rr(c,x-2,y-2,w+4,h+4,(h+4)/2);c.fill();c.fillStyle='#1a1d26';rr(c,x,y,w,h,h/2);c.fill();
  const seg=(f,col)=>{const ww=w*clamp(f);if(ww<1)return;c.fillStyle=col;rr(c,right?x+w-ww:x,y,Math.max(ww,h),h,h/2);c.fill()};
  seg(ghost,'#fff1b8');
  const g=c.createLinearGradient(0,y,0,y+h);if(fr){g.addColorStop(0,'#c4ffae');g.addColorStop(.5,'#4fdc4f');g.addColorStop(1,'#169a2c')}else{g.addColorStop(0,'#ffb8a6');g.addColorStop(.5,'#ff4a36');g.addColorStop(1,'#a8180e')}
  seg(frac,g);const ww=w*clamp(frac);if(ww>8){c.fillStyle='rgba(255,255,255,.4)';rr(c,right?x+w-ww+3:x+3,y+1.5,ww-6,h*.3,h*.15);c.fill()}
  if(flash>0){c.fillStyle=`rgba(255,255,255,${flash*.7})`;rr(c,x,y,w,h,h/2);c.fill()}}
function lmPort(c,u,side){const im=portImg(u.id),fr=u.side==='shu',col=fr?LM_FR:LM_FO,s=80,x=side==='L'?8:W-s-8,y=H-s-6;
  c.save();c.shadowColor=col;c.shadowBlur=16;c.fillStyle='#0a0f1c';rr(c,x-3,y-3,s+6,s+6,12);c.fill();c.restore();
  if(im){c.save();rr(c,x,y,s,s,10);c.clip();const k=PK(im);if(side==='R'){c.translate(2*x+s,0);c.scale(-1,1)}c.drawImage(im,86*k,24*k,340*k,340*k,x,y,s,s);c.restore()}
  else{c.fillStyle=FAC[u.side].main;rr(c,x,y,s,s,10);c.fill();c.fillStyle='#fff';c.font='900 44px "Noto Serif TC",serif';c.textAlign='center';c.textBaseline='middle';c.fillText(u.ch,x+s/2,y+s/2+2);c.textBaseline='alphabetic'}
  c.lineWidth=3;c.strokeStyle=col;rr(c,x,y,s,s,10);c.stroke();c.lineWidth=1.2;c.strokeStyle='#ffe9a8';rr(c,x-3,y-3,s+6,s+6,12);c.stroke();
  const bx=side==='L'?x+s-4:x+4,by=y+4;c.fillStyle='#14203c';circ(c,bx,by,12);c.fill();c.strokeStyle='#ffd45a';c.lineWidth=1.6;c.stroke();
  c.fillStyle='#ffe9a8';c.font='900 13px "Noto Serif TC",serif';c.textAlign='center';c.textBaseline='middle';c.fillText(LM_TZ[u.type]||'兵',bx,by+1);c.textBaseline='alphabetic'}
function drawFightHud(c,SL,SR,sl,sr,t,main){
  const now=performance.now();if(main&&t!=null)lmFightFx(c,SL,SR,t,now);
  const y=H-58,x0=96,x1=W-96,cxm=W/2;
  const pg=c.createLinearGradient(0,y-4,0,H);pg.addColorStop(0,'rgba(16,26,52,.93)');pg.addColorStop(1,'rgba(4,8,18,.97)');
  c.fillStyle=pg;rr(c,x0-22,y-4,x1-x0+44,58,10);c.fill();c.strokeStyle='rgba(150,205,255,.6)';c.lineWidth=1.5;c.stroke();
  for(const [S,v,side] of [[SL,sl,'L'],[SR,sr,'R']]){const L=side==='L',fr=S.u.side==='shu',frac=clamp(v/Math.max(1,S.u.max||S.before));
    const dtm=S._gt?Math.min(60,now-S._gt):0;S._gt=now;if(S._g==null||(t!=null&&t<40))S._g=frac;if(frac<S._g&&(S._hold=(S._hold||0)+dtm)>260)S._g=Math.max(frac,S._g-dtm*.0004);if(frac>=S._g){S._g=frac;S._hold=0}
    if(S._pf!=null&&frac<S._pf-.002)S._fl=1;S._pf=frac;S._fl=Math.max(0,(S._fl||0)-dtm/240);
    const bw=cxm-58-(x0+8),bx=L?x0+8:cxm+58,O=L?SR:SL,m=typeMult(S.u.type,O.u.type),arrow=m>1?'▲':m<1?'▼':'';
    c.textBaseline='alphabetic';c.textAlign=L?'left':'right';c.font='700 15px "Alegreya SC", Georgia, serif';c.fillStyle='#fff';c.fillText(S.u.name,L?bx:bx+bw,y+16);
    const nw=c.measureText(S.u.name).width,tl=TYPES[S.u.type].n;c.font='600 11px "Alegreya Sans", sans-serif';c.fillStyle='#b9c8e6';c.fillText(tl,L?bx+nw+8:bx+bw-nw-8,y+16);
    if(arrow){const tw=c.measureText(tl).width;c.font='900 13px sans-serif';c.fillStyle=m>1?'#6dff7a':'#ff6a5a';c.fillText(arrow,L?bx+nw+14+tw:bx+bw-nw-14-tw,y+16)}
    lmBar(c,bx,y+23,bw,13,frac,S._g,fr,!L,S._fl);
    c.font='900 19px "Alegreya Sans", sans-serif';c.lineWidth=4;c.lineJoin='round';c.strokeStyle='#000';c.fillStyle=S._fl>.2?'#ffe08a':'#fff';c.textAlign=L?'right':'left';
    const tx=L?bx+bw:bx;c.strokeText(String(Math.round(v)),tx,y+53);c.fillText(String(Math.round(v)),tx,y+53)}
  c.save();c.translate(cxm,y+25);c.rotate(Math.PI/4);c.fillStyle='#ffd45a';c.fillRect(-15,-15,30,30);c.fillStyle='#14203c';c.fillRect(-11.5,-11.5,23,23);c.restore();
  c.font='900 14px "Alegreya SC",serif';c.textAlign='center';c.fillStyle='#ffe08a';c.fillText('VS',cxm,y+30);
  lmPort(c,SL.u,'L');lmPort(c,SR.u,'R');c.textAlign='left';
  if(main&&t!=null&&t<900)lmIntro(c,SL,SR,t)}
function lmFightFx(c,SL,SR,t,now){
  const X=SL._fx||(SL._fx={sl:[],imp:[],last:now});const dt=Math.min(50,now-X.last);X.last=now;
  const CS=SL.ch?SL:SR.ch?SR:null,cam=chCam(CS,t);
  for(const S of [SL,SR]){const k=S.nB-S.nA,per=k>0?Math.max(1,Math.round((S.before-S.after)/k)):0;
    for(const s of S.sol)if(s.deathT<=t&&!s._lm){s._lm=1;X.imp.push({x:sX(s,S,s.deathT)-cam,y:s.hy-22*s.s,t0:now,n:per,fr:S.u.side==='shu'})}}
  const melee=SL.melee||SR.melee,w0=CS?1050:1500,w1=CS?3400:2700;
  if(melee&&t>w0&&t<w1&&Math.random()<dt/45){const xs=a=>a.sol.filter(s=>t<s.deathT).map(s=>sX(s,a,t)-cam),l=xs(SL),r=xs(SR);let cx=W/2;if(l.length&&r.length)cx=(Math.max(...l)+Math.min(...r))/2;
    X.sl.push({x:clamp(cx+(Math.random()-.5)*160,40,W-40),y:GROUND+10+Math.random()*120,a:Math.random()*Math.PI*2,r:20+Math.random()*28,t0:now,col:Math.random()<.5?'255,255,255':'255,214,120'})}
  c.save();c.globalCompositeOperation='lighter';c.lineCap='round';
  X.sl=X.sl.filter(o=>now-o.t0<230);for(const o of X.sl){const p=(now-o.t0)/230;c.strokeStyle=`rgba(${o.col},${1-p})`;c.lineWidth=6*(1-p)+1;c.beginPath();c.arc(o.x,o.y,o.r,o.a,o.a+1.5+p*1.3);c.stroke();c.strokeStyle=`rgba(255,255,255,${1-p})`;c.lineWidth=1.6;c.beginPath();c.arc(o.x,o.y,o.r-4,o.a+.25,o.a+1.4+p);c.stroke()}
  for(const o of X.imp){const p=(now-o.t0)/280;if(p>1)continue;const r=10+p*32,g=c.createRadialGradient(o.x,o.y,0,o.x,o.y,r);g.addColorStop(0,`rgba(255,255,235,${.95*(1-p)})`);g.addColorStop(.4,`rgba(255,190,90,${.6*(1-p)})`);g.addColorStop(1,'rgba(255,120,40,0)');c.fillStyle=g;c.beginPath();c.arc(o.x,o.y,r,0,7);c.fill();
    c.strokeStyle=`rgba(255,255,255,${1-p})`;c.lineWidth=2.2;for(let i=0;i<4;i++){const a=i*Math.PI/2+o.x*.1;c.beginPath();c.moveTo(o.x+Math.cos(a)*r*.25,o.y+Math.sin(a)*r*.25);c.lineTo(o.x+Math.cos(a)*r*1.25,o.y+Math.sin(a)*r*1.25);c.stroke()}}
  c.restore();
  for(const o of X.imp){const p=(now-o.t0)/900;if(p>1||!o.n)continue;c.save();c.globalAlpha=p>.7?(1-p)/.3:1;c.font='900 17px "Alegreya Sans",sans-serif';c.textAlign='center';c.lineWidth=4;c.lineJoin='round';c.strokeStyle='#000';const yy=o.y-14-p*28,sc=p<.1?.6+p*4:1;c.translate(o.x,yy);c.scale(sc,sc);c.strokeText('−'+o.n,0,0);c.fillStyle=o.fr?'#ffb4a6':'#fff';c.fillText('−'+o.n,0,0);c.restore()}
  X.imp=X.imp.filter(o=>now-o.t0<900);
  const fc=(SL.shoot||SR.shoot)&&!(SL.melee&&SR.melee)?1290:CS?1060:1520;
  if(t>fc&&t<fc+120){c.fillStyle=`rgba(255,255,255,${.3*(1-(t-fc)/120)})`;c.fillRect(0,0,W,H)}
  for(const S of [SL,SR]){const lr=(S.before-S.after)/Math.max(1,S.before);if(lr<.3||S.nA===0)continue;const t0=1800;if(t<t0||t>3300)continue;const p=clamp((t-t0)/180),a=t>3000?1-(t-3000)/300:1;
    c.save();c.globalAlpha=a;c.translate(S.side==='L'?W/2-120:W/2+120,GROUND-86);c.rotate(-.12);const sc=1.7-.7*ease(p);c.scale(sc,sc);c.font='900 italic 26px "Alegreya Sans",sans-serif';c.textAlign='center';c.lineJoin='round';c.lineWidth=6;c.strokeStyle='#3a0a00';c.strokeText('CRITICAL!',0,0);
    const g=c.createLinearGradient(0,-22,0,4);g.addColorStop(0,'#fff6b0');g.addColorStop(1,'#ff8a1a');c.fillStyle=g;c.fillText('CRITICAL!',0,0);c.restore()}}
function lmIntro(c,SL,SR,t){const a=t<110?t/110:t>620?Math.max(0,1-(t-620)/260):1;if(a<=0)return;const e=ease(clamp(t/300));
  c.save();c.globalAlpha=a;c.fillStyle='rgba(0,0,0,.5)';c.fillRect(0,0,W,H);
  for(const [S,L] of [[SL,true],[SR,false]]){const fr=S.u.side==='shu',c1=fr?'rgba(20,95,215,.94)':'rgba(190,30,20,.94)',c2=fr?'#9fd6ff':'#ffb09e';
    c.save();c.translate((1-e)*(L?-W:W),0);c.beginPath();if(L){c.moveTo(0,64);c.lineTo(W*.60,64);c.lineTo(W*.50,214);c.lineTo(0,214)}else{c.moveTo(W,216);c.lineTo(W*.50,216);c.lineTo(W*.40,366);c.lineTo(W,366)}c.closePath();
    const g=c.createLinearGradient(L?0:W,0,L?W*.6:W*.4,0);g.addColorStop(0,c1);g.addColorStop(1,lmHexA(fr?'#0a3c8c':'#7a0e08',.9));c.fillStyle=g;c.fill();c.strokeStyle=c2;c.lineWidth=3;c.stroke();
    const im=portImg(S.u.id);if(im){const fp=(typeof cutImg==='function'&&cutImg(S.u.id))||fadePort(im),ph=250,pw=ph*256/384;c.save();c.clip();if(L)c.drawImage(fp,24,20,pw,ph);else{c.translate(W-24,0);c.scale(-1,1);c.drawImage(fp,0,172,pw,ph)}c.restore()}
    c.textAlign=L?'left':'right';c.lineJoin='round';const tx=L?210:W-210,ty=L?132:284;
    c.font='900 34px "Alegreya SC", Georgia, serif';c.lineWidth=6;c.strokeStyle='rgba(0,0,0,.7)';c.strokeText(S.u.name,tx,ty);c.fillStyle='#fff';c.fillText(S.u.name,tx,ty);
    const O=L?SR:SL,m=typeMult(S.u.type,O.u.type),sub=`${TYPES[S.u.type].n} · War ${S.u.war}  ${m>1?'▲':m<1?'▼':''}`;c.font='700 16px "Alegreya Sans", sans-serif';c.lineWidth=4;c.strokeText(sub,tx,ty+26);c.fillStyle=m>1?'#8dff8a':m<1?'#ffb0a0':c2;c.fillText(sub,tx,ty+26);
    c.restore()}
  const vs=t<200?0:ease(clamp((t-200)/200));if(vs>0){c.save();c.translate(W/2,H/2-10);const sc=2.6-1.6*vs;c.scale(sc,sc);c.globalAlpha=a*vs;c.font='900 italic 60px "Alegreya SC",serif';c.textAlign='center';c.textBaseline='middle';c.lineJoin='round';c.lineWidth=9;c.strokeStyle='#2a1400';c.strokeText('VS',0,0);
    const g=c.createLinearGradient(0,-28,0,28);g.addColorStop(0,'#fff7c2');g.addColorStop(1,'#ffa316');c.fillStyle=g;c.fillText('VS',0,0);c.restore()}
  c.restore()}
