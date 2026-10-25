// ===== v2: LM split-screen fight scene, ornate HUD, comic damage bursts, square range tiles =====
window.LM_NONUM=true;
const LM_G1='saturate(1.3) contrast(1.08) brightness(1.08)';
// each side fights on its own ground: left half = left unit's terrain, right half = right unit's
function makeBG(ter,defSide,duel){
  if(duel||!LMF)return lmGrade(makeBG0(ter,defSide,duel),LM_G1);
  const {att,def}=LMF,L=att.side==='shu'?att:def,R=L===att?def:att,tl=terAt(L.x,L.y),tr=terAt(R.x,R.y);
  const bR=makeBG0(tr,defSide,false);if(BGUSE[tl]===BGUSE[tr])return lmGrade(bR,LM_G1);
  const bL=makeBG0(tl,defSide,false),cv=document.createElement('canvas');cv.width=bR.width;cv.height=bR.height;const c=cv.getContext('2d');c.drawImage(bR,0,0);
  const tmp=document.createElement('canvas');tmp.width=cv.width;tmp.height=cv.height;const x=tmp.getContext('2d');x.drawImage(bL,0,0);x.globalCompositeOperation='destination-in';
  const g=x.createLinearGradient(0,0,tmp.width,0);g.addColorStop(0,'#000');g.addColorStop(.48,'#000');g.addColorStop(.52,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,tmp.width,tmp.height);
  c.drawImage(tmp,0,0);return lmGrade(cv,LM_G1)}
function lmDivider(c,a){if(a<=.01)return;c.save();c.globalAlpha=a;const x=W/2,bot=H-58;
  c.fillStyle='rgba(0,0,0,.4)';c.fillRect(x-15,0,30,bot);
  const g=c.createLinearGradient(x-9,0,x+9,0);g.addColorStop(0,'#5a4318');g.addColorStop(.22,'#f0d070');g.addColorStop(.5,'#2a2214');g.addColorStop(.78,'#f0d070');g.addColorStop(1,'#5a4318');c.fillStyle=g;c.fillRect(x-9,0,18,bot);
  c.fillStyle='#16110a';c.fillRect(x-4.5,0,9,bot);c.strokeStyle='rgba(240,208,112,.8)';c.lineWidth=1;c.beginPath();for(let y=0;y<bot;y+=12){c.moveTo(x-4.5,y);c.lineTo(x+4.5,y+12);c.moveTo(x+4.5,y);c.lineTo(x-4.5,y+12)}c.stroke();
  for(const [y,s] of [[12,1],[bot-10,1.4]]){c.fillStyle='#f0d070';c.beginPath();c.moveTo(x,y-14*s);c.lineTo(x+11*s,y);c.lineTo(x,y+14*s);c.lineTo(x-11*s,y);c.closePath();c.fill();
    c.fillStyle='#16110a';c.beginPath();c.moveTo(x,y-8*s);c.lineTo(x+6*s,y);c.lineTo(x,y+8*s);c.lineTo(x-6*s,y);c.closePath();c.fill();c.fillStyle='#4fb4ff';circ(c,x,y,2.6*s);c.fill()}
  c.restore()}
function lmDivAlpha(SL,SR,t){const CS=SL.ch||SR.ch,both=SL.melee&&SR.melee,one=SL.melee||SR.melee;if(!one)return 1;return 0;
  const a0=CS?850:both?1300:1400,a1=CS?3400:3050;if(t<a0)return 1;if(t<a0+220)return 1-(t-a0)/220;if(t<a1)return 0;return clamp((t-a1)/300)}
function lmCircle(c,x,y,r,col){c.save();c.strokeStyle=col;c.globalAlpha=.85;c.lineWidth=3;c.beginPath();c.arc(x,y,r,0,7);c.stroke();c.lineWidth=1.4;c.beginPath();c.arc(x,y,r*.82,0,7);c.stroke();
  c.lineWidth=2;for(let i=0;i<28;i++){const a=i/28*Math.PI*2,r1=r*(i%2?1.02:1.0),r2=r*(i%2?1.12:1.2);c.beginPath();c.moveTo(x+Math.cos(a)*r1,y+Math.sin(a)*r1);c.lineTo(x+Math.cos(a+.05)*r2,y+Math.sin(a+.05)*r2);c.stroke()}
  c.lineWidth=1;c.beginPath();for(let i=0;i<6;i++){const a=i/6*Math.PI*2-Math.PI/2,b=(i+2)/6*Math.PI*2-Math.PI/2;c.moveTo(x+Math.cos(a)*r*.82,y+Math.sin(a)*r*.82);c.lineTo(x+Math.cos(b)*r*.82,y+Math.sin(b)*r*.82)}c.stroke();c.restore()}
// transparent cut-out portraits (background removed) for the fight scene
const LM_CUTS=new Set(['mo_nu','cao_cao','xu_chu','xiahou_dun','xiahou_yuan','zhang_liao','p_xuhuang','p_caozhang','xun_yu','p_simayi','p_jiaxu','p_chengyu','p_xunyou','p_xushu','liu_bei','guan_yu','zhang_fei','zhuge_liang','p_guanping','p_zhoucang','zhao_yun','mi_ren','mi_shao','xuannu','diaochan','guan_yinping','huang_yueying','huang_wenjing','lu_bu','sun_shangxiang','xiao_ming','xiao_hei','jiang_chen','lady_gan','lady_mi','consort_zhao','consort_li','consort_yan','huang_yi','zhurong','ren_rui']),LM_CI={};
function cutImg(id){const f=PORT[id];if(!f||!LM_CUTS.has(f))return null;let im=LM_CI[f];if(!im){im=new Image();im.src=`portraits/cut_${f}.webp`;LM_CI[f]=im}return im.complete&&im.naturalWidth?im:null}
function lmHalfPort(c,u,side){const im=portImg(u.id),h=157,w=h*360/540,x=side==='L'?-4:W-w+4,y=H-h+14;
  lmCircle(c,side==='L'?64:W-64,H-38,70,'#d9b75a');
  if(!im){c.fillStyle=FAC[u.side].main;circ(c,side==='L'?70:W-70,H-60,50);c.fill();c.fillStyle='#fff';c.font='900 52px "Noto Serif TC",serif';c.textAlign='center';c.textBaseline='middle';c.fillText(u.ch,side==='L'?70:W-70,H-58);c.textBaseline='alphabetic';return}
  const cut=cutImg(u.id);c.save();if(side==='R'){c.translate(2*x+w,0);c.scale(-1,1)}c.shadowColor='rgba(0,0,0,.75)';c.shadowBlur=14;
  if(cut)c.drawImage(cut,x,y,w,h);else c.drawImage(fadePort(im),x,y,w,h);c.restore()}
function lmBurstPath(c,x,y,rx,ry,n,seed){c.beginPath();for(let i=0;i<n*2;i++){const a=i/(n*2)*Math.PI*2,j=1+((Math.sin(i*12.9898+seed)*43758.5)%1)*.12,r=i%2?.72:1.0*j;c.lineTo(x+Math.cos(a)*rx*r,y+Math.sin(a)*ry*r)}c.closePath()}
function lmDmgBurst(c,x,y,n,crit,p){const sc=p<.12?.4+p/.12*.75:p<.2?1.15-(p-.12)/.08*.15:1;c.save();c.translate(x,y);c.scale(sc,sc);
  lmBurstPath(c,0,0,66,34,13,3);c.fillStyle=crit?'#ffd23a':'#fffef6';c.fill();c.lineWidth=5;c.strokeStyle='#ff7a14';c.stroke();c.lineWidth=2;c.strokeStyle='#c81e0a';c.stroke();
  lmBurstPath(c,0,0,52,25,13,7);c.fillStyle=crit?'#fff3a0':'#ffffff';c.fill();
  c.font='italic 900 27px "Alegreya Sans",sans-serif';c.textAlign='center';c.textBaseline='middle';c.lineJoin='round';c.lineWidth=4;c.strokeStyle=crit?'#7a3a00':'#0a3a5a';c.strokeText(String(n),0,1);
  const g=c.createLinearGradient(0,-12,0,12);if(crit){g.addColorStop(0,'#fff6b0');g.addColorStop(1,'#e08a00')}else{g.addColorStop(0,'#8ff0ff');g.addColorStop(1,'#1aa0c8')}c.fillStyle=g;c.fillText(String(n),0,1);
  if(crit){c.save();c.translate(-82,-6);c.rotate(-.06);c.fillStyle='#b8140a';c.beginPath();c.moveTo(-34,-14);c.lineTo(30,-14);c.lineTo(38,0);c.lineTo(30,14);c.lineTo(-34,14);c.closePath();c.fill();c.strokeStyle='#ffd27a';c.lineWidth=1.5;c.stroke();
    c.font='italic 900 22px "Alegreya SC",serif';c.lineWidth=4;c.strokeStyle='#3a0800';c.strokeText('Crit',0,1);const g2=c.createLinearGradient(0,-10,0,10);g2.addColorStop(0,'#fff6b0');g2.addColorStop(1,'#ffb020');c.fillStyle=g2;c.fillText('Crit',0,1);c.restore()}
  c.restore();c.textBaseline='alphabetic'}
function lmSilver(c,txt,x,y,size,gold,a){c.save();c.font=`italic 900 ${size}px "Alegreya Sans",sans-serif`;c.textAlign='center';c.lineJoin='round';
  for(let k=2;k>=0;k--){c.globalAlpha=a*(k?.22:1);const ox=k*5,oy=-k*3;c.lineWidth=5;c.strokeStyle='#1a1a22';c.strokeText(txt,x+ox,y+oy);
    const g=c.createLinearGradient(0,y-size*.8,0,y+2);if(gold){g.addColorStop(0,'#fffbe0');g.addColorStop(.5,'#ffd84a');g.addColorStop(1,'#c88a10')}else{g.addColorStop(0,'#ffffff');g.addColorStop(.45,'#e4e8ee');g.addColorStop(.55,'#9aa2ae');g.addColorStop(1,'#f4f6f8')}c.fillStyle=g;c.fillText(txt,x+ox,y+oy)}
  c.restore()}
function drawFightHud(c,SL,SR,sl,sr,t,main){
  const now=performance.now();
  if(main&&t!=null){lmFightFx(c,SL,SR,t,now);lmDivider(c,lmDivAlpha(SL,SR,t))}
  lmHalfPort(c,SL.u,'L');lmHalfPort(c,SR.u,'R');
  const x0=128,x1=W-128,cxm=W/2,y=H-60;
  c.save();c.fillStyle='rgba(0,0,0,.5)';c.fillRect(x0-6,y-2,x1-x0+12,64);
  const pg=c.createLinearGradient(0,y,0,H);pg.addColorStop(0,'#2a2418');pg.addColorStop(1,'#0e0b07');c.fillStyle=pg;
  c.beginPath();c.moveTo(x0,y+6);c.lineTo(x0+14,y);c.lineTo(x1-14,y);c.lineTo(x1,y+6);c.lineTo(x1,H);c.lineTo(x0,H);c.closePath();c.fill();c.strokeStyle='#c9a24a';c.lineWidth=2;c.stroke();
  c.fillStyle='#c9a24a';c.beginPath();c.moveTo(cxm-90,y);c.quadraticCurveTo(cxm-40,y-10,cxm-14,y-14);c.lineTo(cxm,y-22);c.lineTo(cxm+14,y-14);c.quadraticCurveTo(cxm+40,y-10,cxm+90,y);c.closePath();c.fill();
  c.fillStyle='#16110a';c.beginPath();c.moveTo(cxm,y-17);c.lineTo(cxm+9,y-6);c.lineTo(cxm,y+5);c.lineTo(cxm-9,y-6);c.closePath();c.fill();c.fillStyle='#4fb4ff';circ(c,cxm,y-6,3.5);c.fill();
  
  c.font='700 11px "Alegreya SC",Georgia,serif';c.textAlign='center';c.fillStyle='#e6cf8e';c.fillText('Hero',cxm,y+19);c.fillText('Soldier',cxm,y+37);
  for(const [S,v,side] of [[SL,sl,'L'],[SR,sr,'R']]){const L=side==='L',fr=S.u.side==='shu',hm=S.u.hpMax||0,smax=Math.max(1,(S.u.max||S.before)-hm),sol=Math.max(0,v-hm),hero=Math.min(hm,Math.max(0,v)),frac=clamp(sol/smax);
    const dtm=S._gt?Math.min(60,now-S._gt):0;S._gt=now;if(S._g==null||(t!=null&&t<40))S._g=frac;if(frac<S._g&&(S._hold=(S._hold||0)+dtm)>260)S._g=Math.max(frac,S._g-dtm*.0004);if(frac>=S._g){S._g=frac;S._hold=0}
    if(S._pf!=null&&frac<S._pf-.002)S._fl=1;S._pf=frac;S._fl=Math.max(0,(S._fl||0)-dtm/240);
    const nx=L?cxm-62:cxm+62,bw=cxm-130-x0,bx=L?x0+10:cxm+120;
    for(const yy of [y+5,y+23]){c.fillStyle='#0b0907';c.beginPath();c.moveTo(nx-40,yy);c.lineTo(nx+40,yy);c.lineTo(nx+35,yy+17);c.lineTo(nx-35,yy+17);c.closePath();c.fill();c.strokeStyle='#8a6d2e';c.lineWidth=1.1;c.stroke()}
    c.font='900 16px "Alegreya SC",Georgia,serif';c.textAlign='center';c.lineWidth=3;c.lineJoin='round';c.strokeStyle='#000';{const ht=hm?String(Math.round(hero)):'—';c.strokeText(ht,nx,y+19);c.fillStyle='#fff';c.fillText(ht,nx,y+19)}c.strokeText(String(DSOL(S.u,sol)),nx,y+37);
    const ng=c.createLinearGradient(0,y+12,0,y+32);ng.addColorStop(0,'#fff6c8');ng.addColorStop(.5,'#f2c84a');ng.addColorStop(1,'#a8740e');c.fillStyle=S._fl>.2?'#fff':ng;c.fillText(String(DSOL(S.u,sol)),nx,y+37);
    lmBar(c,bx,y+7,bw,10,hm?hero/hm:0,hm?hero/hm:0,fr,!L,0);lmBar(c,bx,y+25,bw,11,frac,S._g,fr,!L,S._fl);
    const O=L?SR:SL,m=typeMult(S.u.type,O.u.type);c.font='600 11.5px "Alegreya Sans",sans-serif';c.textAlign=L?'left':'right';c.fillStyle='#d8c9a0';
    const lab=`${S.u.name} · ${TYPES[S.u.type].n}`;c.fillText(lab,L?bx:bx+bw,y+52);if(m!==1){const w=c.measureText(lab).width;c.font='900 12px sans-serif';c.fillStyle=m>1?'#6dff7a':'#ff6a5a';c.fillText(m>1?'▲':'▼',L?bx+w+6:bx+bw-w-6,y+52)}
    // damage burst
    if(main&&t!=null){const loss=Math.round(S.before-v);if(loss>0){if(S._bt==null)S._bt=now;const p=clamp((now-S._bt)/700),crit=(S.before-S.after)/Math.max(1,S.before)>=.3;lmDmgBurst(c,L?cxm-150:cxm+150,y-36,loss,crit,p)}}}
  c.restore();
  if(main&&t!=null&&t<900)lmIntro(c,SL,SR,t)}
function lmFightFx(c,SL,SR,t,now){
  const X=SL._fx||(SL._fx={sl:[],imp:[],last:now});const dt=Math.min(50,now-X.last);X.last=now;
  const CS=SL.ch?SL:SR.ch?SR:null,cam=chCam(CS,t);
  for(const S of [SL,SR]){const k=S.nB-S.nA,per=k>0?Math.max(1,Math.round((S.before-S.after)/k)):0,crit=(S.before-S.after)/Math.max(1,S.before)>=.3;
    for(const s of S.sol)if(s.deathT<=t&&!s._lm){s._lm=1;X.imp.push({x:sX(s,S,s.deathT)-cam,y:s.hy-22*s.s,t0:now,n:per,crit})}}
  const melee=SL.melee||SR.melee,w0=CS?1050:1500,w1=CS?3400:2700;
  if(melee&&t>w0&&t<w1&&Math.random()<dt/45){const xs=a=>a.sol.filter(s=>t<s.deathT).map(s=>sX(s,a,t)-cam),l=xs(SL),r=xs(SR);let cx=W/2;if(l.length&&r.length)cx=(Math.max(...l)+Math.min(...r))/2;
    X.sl.push({x:clamp(cx+(Math.random()-.5)*160,40,W-40),y:GROUND+10+Math.random()*120,a:Math.random()*Math.PI*2,r:20+Math.random()*28,t0:now,col:Math.random()<.5?'255,255,255':'255,214,120'})}
  c.save();c.globalCompositeOperation='lighter';c.lineCap='round';
  X.sl=X.sl.filter(o=>now-o.t0<230);for(const o of X.sl){const p=(now-o.t0)/230;c.strokeStyle=`rgba(${o.col},${1-p})`;c.lineWidth=6*(1-p)+1;c.beginPath();c.arc(o.x,o.y,o.r,o.a,o.a+1.5+p*1.3);c.stroke();c.strokeStyle=`rgba(255,255,255,${1-p})`;c.lineWidth=1.6;c.beginPath();c.arc(o.x,o.y,o.r-4,o.a+.25,o.a+1.4+p);c.stroke()}
  for(const o of X.imp){const p=(now-o.t0)/280;if(p>1)continue;const r=10+p*32,g=c.createRadialGradient(o.x,o.y,0,o.x,o.y,r);g.addColorStop(0,`rgba(255,255,235,${.95*(1-p)})`);g.addColorStop(.4,`rgba(255,190,90,${.6*(1-p)})`);g.addColorStop(1,'rgba(255,120,40,0)');c.fillStyle=g;c.beginPath();c.arc(o.x,o.y,r,0,7);c.fill()}
  c.restore();
  // stacked metallic numbers over the ranks that fall, like LM
  for(const o of X.imp){const p=(now-o.t0)/1000;if(p>1||!o.n)continue;lmSilver(c,String(o.n),o.x+14,o.y-16-p*22,p<.08?20+p*120:30,o.crit,p>.75?(1-p)/.25:1)}
  X.imp=X.imp.filter(o=>now-o.t0<1000);
  for(const S of [SL,SR]){const loss=S.before-S.after;if(loss<=0)continue;const ww0=(S===SL?SR:SL).shoot?1290:w0;if(t<ww0||t>w1)continue;
    if(Math.random()<dt/110){const al=S.sol.filter(s=>t<s.deathT);const s0=al.length?al[Math.floor(Math.random()*al.length)]:S.off;
      X.imp.push({x:sX(s0,S,t)-cam+(Math.random()-.5)*30,y:(s0.hy||s0.y)-20*(s0.s||1)-Math.random()*20,t0:now,n:Math.max(1,Math.round(loss/(16+Math.random()*10))),crit:false,q:1})}}
  const fc=(SL.shoot||SR.shoot)&&!(SL.melee&&SR.melee)?1290:CS?1060:1520;
  if(t>fc&&t<fc+120){c.fillStyle=`rgba(255,255,255,${.32*(1-(t-fc)/120)})`;c.fillRect(0,0,W,H)}}
// map: LM-style rounded squares with a gap between them
function lmRegion(c,tiles,fill,edge,bright){if(!tiles||!tiles.length)return;c.save();const m=T*.045,r=T*.16,s=T-2*m;
  for(const t of tiles){const x=t.x*T+m,y=t.y*T+m;rr(c,x,y,s,s,r);if(bright){const g=c.createRadialGradient(x+s/2,y+s/2,s*.15,x+s/2,y+s/2,s*.72);g.addColorStop(0,fill.replace(/[\d.]+\)$/,'.3)'));g.addColorStop(1,fill);c.fillStyle=g}else c.fillStyle=fill;c.fill();c.lineWidth=Math.max(2,T*.04);c.strokeStyle=edge;if(bright){c.shadowColor=edge;c.shadowBlur=6}c.stroke();c.shadowBlur=0;
    rr(c,x+T*.07,y+T*.07,s-T*.14,s-T*.14,r*.7);c.strokeStyle='rgba(255,255,255,.22)';c.lineWidth=1;c.stroke()}
  c.restore()}

if(typeof PORT!=='undefined'&&!PORT.lubu)PORT.lubu='lu_bu';
// skill range: every tile the caster can reach with this skill (distance of farthest legal target, min 1)
function skRange(){const s=G.sel;if(!s)return[];const tg=G.targets.map(t=>t.u);let R=1;
  for(const u of tg){if(u.area)for(const p of u.area)R=Math.max(R,Math.abs(p.x-s.x)+Math.abs(p.y-s.y));else R=Math.max(R,Math.abs(u.x-s.x)+Math.abs(u.y-s.y))}
  R=Math.min(R,6);const out=[];for(let dx=-R;dx<=R;dx++)for(let dy=-R;dy<=R;dy++){const d=Math.abs(dx)+Math.abs(dy);if(!d||d>R)continue;const x=s.x+dx,y=s.y+dy;if(inb(x,y))out.push({x,y})}return out}
function skPost(){const tp=$('#tpanel'),pv=$('#pv');
  if(G.mode!=='target'||G.tmode==='attack'||!G.sel){G.skc=null;return}
  const k=G.tmode,h=HERO[k]||SKILLS[k]||{},nm=h.n||k,zh=h.zh||'';
  const self=G.targets.some(t=>t.u.fake);
  if(!self)tp.innerHTML=`<div class="skhint"><span>Select a unit in range.</span><button data-a="back">Cancel</button></div>`;
  const u=G.skc;if(u&&G.targets.some(t=>t.u===u)){const tg=G.targets.find(t=>t.u===u);
    pv.innerHTML=`<div class="skc"><div class="skn"><b>${zh}</b><span>${nm}</span></div>${u.fake?`<div class="skt">Cast here · ${tg.note}</div>`:`<div class="skt">${lmPortHTML(u)}<div><b>${u.name}</b><small>${tg.note||''}</small></div></div>`}</div><div class="pvbtns"><button data-sk="go" class="go">Use</button><button data-sk="no">Cancel</button></div>`;pv.hidden=false;tp.hidden=true}
  else G.skc=null}
$('#pv').addEventListener('click',e=>{const b=e.target.closest('[data-sk]');if(!b||!G||!G.skc||G.busy)return;e.stopPropagation();const u=G.skc;if(b.dataset.sk==='go')hitTarget(u);else{G.skc=null;updateUI()}},true);
{const _u=updateUI;updateUI=function(){_u();try{skPost()}catch(e){console.error(e)}}}
// long-press a skill button for its description
{let lt=null,fired=false;const tip=document.createElement('div');tip.id='skTip';tip.hidden=true;document.querySelector('.bv').appendChild(tip);
  const hide=()=>{tip.hidden=true};
  $('#acts').addEventListener('pointerdown',e=>{const b=e.target.closest('[data-sk]');if(!b)return;fired=false;clearTimeout(lt);lt=setTimeout(()=>{fired=true;const k=b.dataset.sk,h=HERO[k]||{},S=SKILLS[k]||{},s=G.sel,cd=s&&s.cd&&s.cd[k];
    tip.innerHTML=`<div class="tth"><b>${h.zh||S.zh||''}</b><span>${h.n||S.n||k}</span></div><div class="ttm"><span>Cooldown</span><em>${cd?`ready in ${cd} turn${cd>1?'s':''}`:'Ready'}</em>${h.once?'<span>Once per battle</span>':''}</div><p>${h.desc||S.desc||''}</p>`;tip.hidden=false},450)});
  ['pointerup','pointercancel','pointerleave'].forEach(ev=>$('#acts').addEventListener(ev,()=>{clearTimeout(lt);if(fired)setTimeout(hide,1800)}));
  $('#acts').addEventListener('click',e=>{if(fired){e.stopImmediatePropagation();e.preventDefault();fired=false}},true);
  $('#acts').addEventListener('contextmenu',e=>e.preventDefault());}
