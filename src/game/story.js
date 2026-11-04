// ===================== STORY MODE (RPG, wuxia) — v458 =====================
(function(){
const SKEY='rtk3_story';
const $s=q=>document.querySelector(q);
const snd=(n)=>{try{SND.fx(n)}catch(e){}},mus=(n)=>{try{SND.music(n)}catch(e){}};
const rnd=(a,b)=>a+Math.random()*(b-a),clamp01=v=>Math.max(0,Math.min(1,v)),lerp2=(a,b,t)=>a+(b-a)*t,ease2=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
const st_wait=ms=>new Promise(r=>setTimeout(r,ms));

// ---------- data ----------
const ARTS={
 palm:{zh:'金龍掌',n:'Golden Dragon Palm',shape:'adj',pow:1.0,mp:0,anim:'dash',fx:'#ffd75a',desc:'Palm strike on an adjacent enemy.'},
 wave:{zh:'金龍氣',n:'Dragon Qi Wave',shape:'line3',pow:.85,mp:6,anim:'ranged',fx:'#ffd75a',desc:'Gold wave hits every enemy in a line of 3.'},
 thunder:{zh:'奔雷掌',n:'Rolling Thunder Palm',shape:'line2',pow:1.3,mp:10,anim:'dash',fx:'#9fd7ff',kb:1,desc:'Charges through 2 squares in a line, knocks back.'},
 tiger:{zh:'伏虎拳',n:'Tiger-Taming Fist',shape:'adj',pow:1.15,mp:4,anim:'punch',fx:'#ffb060',stun:.2,desc:'Heavy punch on an adjacent enemy; 20% chance to stun (they lose their next turn).'},
 whirl:{zh:'旋風腿',n:'Whirlwind Kick',shape:'ring',pow:.9,mp:8,anim:'kick',fx:'#ffe7a8',desc:'Spinning kick that hits every adjacent enemy.'},
 star:{zh:'追星腿',n:'Shooting-Star Kick',shape:'r2',pow:1.2,mp:8,anim:'kick',fx:'#ffe7a8',desc:'Flying kick that reaches an enemy 2 squares away.'},
 fork:{zh:'叉',n:'Pitchfork Jab',shape:'adj',pow:1,mp:0,anim:'melee',fx:'#ffe7a8'},
 slash:{zh:'刀',n:'Slash',shape:'adj',pow:1,mp:0,anim:'melee',fx:'#ffe7a8'},
 axe:{zh:'斧',n:'Axe Chop',shape:'adj',pow:1.2,mp:0,anim:'melee',fx:'#ffb060'},
 bell:{zh:'攝魂鈴',n:'Soul Bell',shape:'r2',pow:1.1,mp:0,anim:'ranged',fx:'#7dff9a'},
 staff:{zh:'棍',n:'Staff Strike',shape:'adj',pow:.8,mp:0,anim:'melee',fx:'#ffe7a8'}};
const INNER={hunyuan:{zh:'混元氣',n:'Primordial Breath',regen:4,def:4,dodge:.03,hp:0,desc:'Passive: +4 defence, +3% dodge, restores 4 內力 each turn.'},
 jinzhong:{zh:'金鐘罩',n:'Golden Bell Shield',regen:2,def:12,dodge:0,hp:30,desc:'Passive: +12 defence, +30 HP, restores 2 內力 each turn.'},
 jiuyang:{zh:'九陽功',n:'Nine-Yang Art',regen:6,def:6,dodge:.05,hp:60,desc:'Passive: +60 HP, +6 defence, +5% dodge, restores 6 內力 each turn.'}};
const QG=[{zh:'無',n:'None',mv:2,dodge:.05},{zh:'踏雲步',n:'Cloud Step',mv:3,dodge:.12},{zh:'燕回翔',n:'Swallow Glide',mv:4,dodge:.18}];
const PEOPLE={hero:{n:'You',port:'hero'},hermit:{n:'Hermit Master',zh:'隱'},elder:{n:'Village Elder',zh:'老'},xiaoming:{n:'Xiao Ming',port:'xiao_ming'},xiaohei:{n:'Black Wind Chief',port:'xiao_hei'},jiangchen:{n:'Jiang Chen',port:'jiang_chen'},chief:{n:'Yellow Turban Chief',zh:'黃'},narr:{n:''}};
const PLACES=[
 {id:'valley',zh:'隱仙谷',n:'Hermit Valley',x:.16,y:.22,need:null},
 {id:'zhuo',zh:'涿縣',n:'Zhuo Village',x:.40,y:.55,need:'prologue'},
 {id:'blackwind',zh:'黑風寨',n:'Black Wind Fort',x:.70,y:.30,need:'prologue'},
 {id:'temple',zh:'古寺',n:'Old Temple',x:.24,y:.78,need:'bw'},
 {id:'ytcamp',zh:'黃巾營',n:'Yellow Turban Camp',x:.80,y:.74,need:'temple'}];
const E=(id,name,sheet,lv,hp,atk,def,arts,xp,port,mv)=>({id,name,sheet,lv,hp,hpMax:hp,mp:0,mpMax:0,atk,def,arts,xp,port,mv:mv||2,dodge:.05,side:'E'});
const BATTLES={
 spar:{theme:'pass',bg:'bg_pass',title:'Sparring · the two disciples',foes:()=>[E('d1','Disciple','peasant_shu',1,45,11,4,['staff'],12),E('d2','Disciple','peasant_shu',1,45,11,4,['staff'],12)],pos:[[9,2],[9,5]]},
 bw:{theme:'forest',bg:'bg_forest',title:'Black Wind Fort',foes:()=>[E('xiaohei','Black Wind Chief','f_xiaohei_shu',4,115,18,7,['axe'],40,'xiao_hei'),E('b1','Bandit','peasant_wei',2,45,12,4,['slash'],14),E('b2','Bandit','peasant_wei',2,45,12,4,['slash'],14),E('b3','Bandit','peasant_wei',2,45,12,4,['slash'],14)],pos:[[12,4],[10,2],[10,5],[11,6]]},
 temple:{theme:'hills',bg:'bg_hill',title:'Old Temple',foes:()=>[E('jiangchen','Jiang Chen','f_jiangchen_shu',5,130,22,6,['bell'],50,'jiang_chen'),E('y1','Yellow Turban','peasant_ind',3,62,16,6,['slash'],16),E('y2','Yellow Turban','peasant_ind',3,62,16,6,['slash'],16)],pos:[[12,3],[10,2],[10,5]]},
 yt:{theme:'river',bg:'bg_plain',title:'Yellow Turban Camp',foes:()=>[E('chief','Yellow Turban Chief','general_ind',7,240,27,10,['slash'],90),E('y1','Yellow Turban','peasant_ind',4,70,18,7,['slash'],18),E('y2','Yellow Turban','peasant_ind',4,70,18,7,['slash'],18),E('y3','Yellow Turban','peasant_ind',4,70,18,7,['slash'],18),E('y4','Yellow Turban','peasant_ind',4,70,18,7,['slash'],18)],pos:[[12,4],[10,1],[10,3],[10,5],[11,6]]}};
const xpNeed=lv=>20+lv*15;

// ---------- state ----------
let P=null;
function st_freshHero(){return {lv:1,xp:0,hp:120,hpMax:120,mp:30,mpMax:30,atk:22,def:10,talent:70,gold:30,herbs:1,qg:0,inner:'hunyuan',arts:{palm:{lv:1,xp:0}},eq:'palm',flags:{},party:[],day:1}}
function st_save(){try{localStorage.setItem(SKEY,JSON.stringify(P))}catch(e){}}
function st_load(){try{const s=localStorage.getItem(SKEY);return s?JSON.parse(s):null}catch(e){return null}}
window.storyHasSave=()=>!!st_load();

// ---------- DOM ----------
const CSS=`
#story{position:fixed;inset:0;z-index:7;background:#14110d;color:#f3e6c4;font-family:var(--f-body,system-ui);overflow:hidden;user-select:none}
#story .stbar{position:absolute;left:0;right:0;top:0;height:40px;display:flex;align-items:center;gap:12px;padding:0 max(10px,env(safe-area-inset-left,0px));background:rgba(20,17,13,.86);border-bottom:1px solid #4a4030;z-index:3;font-size:13px}
#story .stbar b{font-family:var(--f-display,serif);font-size:15px}
#story .stbar .bar{width:70px;height:6px;background:#000;border-radius:3px;display:inline-block;vertical-align:middle;margin-left:4px}
#story .stbar .bar i{display:block;height:100%;border-radius:3px}
#story .sp{flex:1}
#story button{font:inherit;color:#f3e6c4;background:#38332a;border:1px solid #5a4e38;border-radius:6px;padding:6px 12px;cursor:pointer;min-height:34px}
#story button:disabled{opacity:.45;cursor:default}
#story button.pri{background:#b8322c;border-color:#d4473f}
#stMap{position:absolute;inset:40px 0 0 0;background:#2b2a22 center/cover no-repeat}
#stMap .pl{position:absolute;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;gap:2px;background:rgba(20,17,13,.72);padding:6px 10px;border-radius:8px}
#stMap .pl .z{font:900 20px var(--f-zh,serif);color:#ffd77a}
#stMap .pl.done .z::after{content:' ✓';color:#9be39b;font-size:14px}
#stMap .pl.lock{opacity:.4;pointer-events:none}
#stMap .pl.new{box-shadow:0 0 0 2px #ffd77a,0 0 14px #ffd77a}
#stCv{position:absolute;inset:40px 0 0 0;width:100%;height:calc(100% - 40px);touch-action:none}
#stFight{position:absolute;inset:0;z-index:5;width:100%;height:100%;background:#000}
#stAct{position:absolute;left:50%;bottom:8px;transform:translateX(-50%);display:flex;flex-wrap:wrap;gap:6px;justify-content:center;z-index:4;max-width:96%}
#stAct button small{display:block;font-size:10.5px;opacity:.8}
#stMsg{position:absolute;left:50%;top:52px;transform:translateX(-50%);z-index:6;background:rgba(20,17,13,.9);border:1px solid #d4ad55;border-radius:8px;padding:6px 14px;font-size:14px;pointer-events:none;transition:opacity .3s}
#stDlg{position:absolute;left:0;right:0;bottom:0;z-index:8;display:flex;gap:12px;align-items:flex-end;padding:10px max(14px,env(safe-area-inset-left,0px)) max(12px,env(safe-area-inset-bottom,0px));background:linear-gradient(0deg,rgba(10,8,6,.97) 70%,rgba(10,8,6,0));min-height:120px}
#stDlg .pt{width:96px;height:120px;flex:none;border-radius:6px;background:#2a241b center top/cover no-repeat;border:1px solid #5a4e38;display:flex;align-items:center;justify-content:center;font:900 48px var(--f-zh,serif);color:#ffd77a}
#stDlg .tx{flex:1;font-size:15px;line-height:1.45;padding-bottom:6px}
#stDlg .tx b{display:block;color:#ffd77a;font-family:var(--f-display,serif);margin-bottom:2px}
#stDlg .tx .ch{display:flex;gap:8px;margin-top:8px;flex-wrap:wrap}
#stPanel{position:absolute;inset:48px 10px 10px 10px;z-index:7;background:rgba(24,20,15,.97);border:1px solid #5a4e38;border-radius:8px;padding:12px 16px;overflow-y:auto;font-size:14px}
#stPanel h3{margin:0 0 6px;font-family:var(--f-display,serif);color:#ffd77a}
#stPanel .g{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:4px 14px;margin-bottom:10px}
#stPanel .art{padding:5px 8px;border:1px solid #4a4030;border-radius:6px;margin-bottom:5px}
#stPanel .art b{color:#ffd77a}
#stPanel .row{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
`;
function st_build(){
  if($s('#story'))return;
  const st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);
  const d=document.createElement('div');d.id='story';d.hidden=true;
  d.innerHTML=`<div class="stbar"><b id="stName">俠 Hero</b><span id="stLv"></span><span>HP<span class="bar"><i id="stHp" style="background:#5ad06a"></i></span></span><span>內力<span class="bar"><i id="stMp" style="background:#58a8ff"></i></span></span><span id="stGold"></span><span class="sp"></span><button id="stHeroBtn">Hero</button><button id="stMenuBtn">Menu</button></div>
  <div id="stMap"></div><canvas id="stCv" hidden></canvas><div id="stAct" hidden></div><canvas id="stFight" hidden></canvas><div id="stMsg" style="opacity:0"></div><div id="stDlg" hidden></div><div id="stPanel" hidden></div>`;
  document.body.appendChild(d);
  $s('#stMenuBtn').onclick=()=>{if(B)return st_toast('Finish the battle first');st_exitStory()};
  $s('#stHeroBtn').onclick=()=>st_heroPanel();
}
function st_toast(t,ms){const m=$s('#stMsg');m.textContent=t;m.style.opacity=1;clearTimeout(st_toast.h);st_toast.h=setTimeout(()=>m.style.opacity=0,ms||1800)}
function st_hud(){const pct=(a,b)=>Math.round(100*clamp01(a/b))+'%';
  $s('#stLv').textContent='Lv '+P.lv+' · XP '+P.xp+'/'+xpNeed(P.lv);$s('#stHp').style.width=pct(P.hp,P.hpMax);$s('#stMp').style.width=pct(P.mp,P.mpMax);$s('#stGold').textContent='Gold '+P.gold+' · Herbs '+P.herbs}

// ---------- enter / exit ----------
function st_enter(){st_build();for(const s of ['title','campaign','battleView']){const e=$s('#'+s);if(e)e.hidden=true}$s('#story').hidden=false;document.body.classList.add('lock');st_hud();st_showMap()}
function st_exitStory(){st_save();$s('#story').hidden=true;try{showScreen('title');renderTitle()}catch(e){$s('#title').hidden=false}}
window.storyNew=async function(){if(st_load()&&!confirm('Start a new story? The current story save will be replaced.'))return;P=st_freshHero();st_save();st_enter();await st_prologue()};
window.storyContinue=function(){P=st_load();if(!P)return;if(!P.eq)P.eq='palm';for(const a of Object.values(P.arts)){if(a.xp==null)a.xp=0}st_enter()};

// ---------- dialogue ----------
function st_say(who,text,choices){return new Promise(res=>{const d=$s('#stDlg');const pp=PEOPLE[who]||{n:who};
  d.innerHTML=`<div class="pt" style="${pp.port?`background-image:url(portraits/${pp.port}.webp)`:''}">${pp.port?'':(pp.zh||'')}</div><div class="tx">${pp.n?`<b>${pp.n}</b>`:''}${text}${choices?`<div class="ch">${choices.map((c,i)=>`<button data-i="${i}" class="${i===0?'pri':''}">${c}</button>`).join('')}</div>`:'<div style="opacity:.6;font-size:12px;margin-top:6px">tap to continue ▸</div>'}</div>`;
  d.hidden=false;if(who==='narr')d.querySelector('.pt').style.display='none';
  const done=v=>{d.hidden=true;d.onclick=null;res(v)};
  if(choices)d.querySelectorAll('button').forEach(b=>b.onclick=e=>{e.stopPropagation();done(+b.dataset.i)});else setTimeout(()=>d.onclick=()=>done(0),150)})}

// ---------- map ----------
function st_showMap(){if(B)return;const m=$s('#stMap');m.hidden=false;$s('#stCv').hidden=true;$s('#stAct').hidden=true;mus('map');
  m.style.backgroundImage='url(art/bg_hill.jpg)';
  m.innerHTML=PLACES.map(p=>{const open=!p.need||P.flags[p.need],done=st_doneAt(p.id),nw=open&&!done&&p.id!=='zhuo'&&p.id!=='valley'||(p.id==='zhuo'&&open&&!P.flags.zhuo1);
    return `<button class="pl ${open?'':'lock'} ${done?'done':''} ${nw?'new':''}" data-p="${p.id}" style="left:${p.x*100}%;top:${p.y*100}%"><span class="z">${p.zh}</span><span>${p.n}</span></button>`}).join('');
  m.querySelectorAll('.pl').forEach(b=>b.onclick=()=>st_visit(b.dataset.p));st_hud();st_save()}
const st_doneAt=id=>({valley:P.flags.prologue,blackwind:P.flags.bw,temple:P.flags.temple,ytcamp:P.flags.yt})[id];
async function st_visit(id){
  if(id==='valley'){const c=await st_say('hermit','You have come back. Train with my disciples if you wish — sweat in the valley saves blood on the battlefield.',['Train (sparring)','Leave']);
    if(c===0){await st_battle('spar');P.hp=P.hpMax;P.mp=P.mpMax;st_hud();st_save();st_showMap()}return}
  if(id==='zhuo')return st_zhuo();
  if(id==='blackwind'){if(P.flags.bw)return st_say('narr','Black Wind Fort lies empty. The villagers sleep safely now.');
    await st_say('xiaoming','There it is — Black Wind Fort. Their chief swings an axe as big as a door. Ready?');if(!P.flags.ming)P.flags.ming=1;
    if(await st_battle('bw'))await st_afterBW();return}
  if(id==='temple'){if(P.flags.temple)return st_say('narr','The old temple is quiet. Incense smoke rises again.');
    await st_say('narr','Chanting drifts from the ruined temple — but these are no monks. A Yellow Turban sorcerer rings a bronze bell.');
    await st_say('jiangchen','The Way of Great Peace rewards the faithful. And you, boy, will feed my bell!');
    if(await st_battle('temple'))await st_afterTemple();return}
  if(id==='ytcamp'){if(P.flags.yt)return st_say('narr','Only ashes remain of the Yellow Turban camp.');
    await st_say('narr','Hundreds of yellow headbands. At the centre, a towering chief roars orders.');
    await st_say('chief','The blue sky is dead! The yellow sky shall rise! Kill the meddler!');
    if(await st_battle('yt'))await st_afterYT();return}}
async function st_zhuo(){
  if(!P.flags.zhuo1){P.flags.zhuo1=1;
    await st_say('elder','A traveller from the mountains? Forgive us, young one. Bandits from Black Wind Fort raid us every month, and now Yellow Turbans burn the farms beyond the river.');
    await st_say('xiaoming','I am Xiao Ming! I can\'t sit here while they rob us. Teach me to fight — I\'ll follow you to Black Wind Fort!');
    if(!P.party.includes('xiaoming'))P.party.push('xiaoming');st_toast('Xiao Ming joins your party');st_save()}
  const c=await st_say('elder',`Zhuo Village. What do you need?<br><small>Inn: rest and save (10 gold) · Herb: heals 50 HP (15 gold)</small>`,['Rest at the inn (10)','Buy a herb (15)','Use a herb','Leave']);
  if(c===0){if(P.gold<10)return st_toast('Not enough gold');P.gold-=10;P.hp=P.hpMax;P.mp=P.mpMax;P.day++;st_save();st_hud();st_toast('Fully rested · game saved');return st_zhuo()}
  if(c===1){if(P.gold<15)return st_toast('Not enough gold');P.gold-=15;P.herbs++;st_hud();return st_zhuo()}
  if(c===2){if(!P.herbs)return st_toast('No herbs');P.herbs--;P.hp=Math.min(P.hpMax,P.hp+50);st_hud();return st_zhuo()}
  st_showMap()}

// ---------- story beats ----------
async function st_prologue(){
  await st_say('narr','AD 184. Deep in the mountains of You province, far from the dying Han court...');
  await st_say('hermit','Eighteen winters ago I found you in the snow below this valley, a baby wrapped in a soldier\'s cloak. Today you are a man.');
  await st_say('hero','Master... you taught me everything I know.');
  await st_say('hermit','Your Golden Dragon Palm 金龍掌 is ready, and the Primordial Breath 混元氣 flows in you. But the world below is drowning. Yellow Turbans burn the villages, bandits prey on the weak.');
  await st_say('hermit','Before you leave, show me. Defeat my two disciples — and do not hurt them too badly.');
  await st_tutorialTip();
  const won=await st_battle('spar');
  if(!won){P.hp=P.hpMax;P.mp=P.mpMax;await st_say('hermit','Again. Breathe, then strike.');return st_prologue()}
  await st_say('hermit','Good. Remember this: strength without virtue is the path of demons. Go down to Zhuo Village, and help those who suffer.');
  P.flags.prologue=1;P.hp=P.hpMax;P.mp=P.mpMax;st_save();st_showMap();st_toast('Visit Zhuo Village',2600)}
async function st_tutorialTip(){await st_say('narr','<b style="color:#9fd7ff">How to fight</b>Tap your hero, then a blue square to move (or tap him again to stay). Choose a martial art, then tap a red square. Each unit acts once per turn. 內力 powers your arts and recovers every turn.')}
async function st_afterBW(){P.flags.bw=1;P.gold+=80;
  await st_say('xiaohei','Ugh... that palm... who ARE you?');
  await st_say('narr','Among the stolen loot you find an old silk manual: <b>Rolling Thunder Palm 奔雷掌</b>.');
  st_learn('thunder');await st_say('xiaoming','We did it! The village is safe! But the elder says Yellow Turbans hold the old temple to the south...');st_save();st_showMap()}
async function st_afterTemple(){P.flags.temple=1;P.gold+=60;
  await st_say('jiangchen','My bell... broken... Great Teacher Zhang Jiao will avenge me...');
  await st_say('narr','Behind the altar, hidden in a hollow beam, is a scroll of 輕功: <b>Cloud Step 踏雲步</b>. Your body feels as light as mist.');
  P.qg=Math.max(P.qg,1);st_toast('輕功 learned: Cloud Step — move 3 squares, better dodge',3000);st_save();st_showMap()}
async function st_afterYT(){P.flags.yt=1;P.gold+=150;st_learn('tiger');
  await st_say('chief','How... can one man... stand against the Yellow Sky...');
  await st_say('narr','The camp scatters. By nightfall the whole county speaks of a young hero with a palm of gold.');
  await st_say('narr','In Zhuo, three men — Liu Bei, Guan Yu and Zhang Fei — are raising volunteers against the rebels. They want to meet you...<br><br><b style="color:#ffd77a">End of Chapter 1.</b> Chapter 2: the road to Hu Lao Gate — coming soon.');st_save();st_showMap()}
function st_learn(k){if(!P.arts[k]){P.arts[k]={lv:1,xp:0};st_toast('New martial art: '+ARTS[k].n+' '+ARTS[k].zh,3000)}}

// ---------- hero panel ----------
function st_heroPanel(){const p=$s('#stPanel');if(!p.hidden){p.hidden=true;return}
  const q=QG[P.qg],inn=INNER[P.inner];
  p.innerHTML=`<h3>俠 The Hero · Level ${P.lv}</h3><div class="g"><div>HP ${P.hp}/${P.hpMax}</div><div>內力 ${P.mp}/${P.mpMax}</div><div>Attack ${P.atk}</div><div>Defence ${P.def}</div><div>Talent 悟性 ${P.talent}</div><div>XP ${P.xp}/${xpNeed(P.lv)}</div><div>Gold ${P.gold}</div><div>Herbs ${P.herbs}</div></div>
  <h3>武功 Martial arts <small style="font-weight:400;color:#c9b98f">· the equipped manual gains half of your battle XP</small></h3>${Object.entries(P.arts).map(([k,a])=>`<div class="art"><b>${P.eq===k?'★ ':''}${ARTS[k].zh} ${ARTS[k].n}</b> · level ${a.lv}/10 · ${ARTS[k].mp} 內力${P.eq===k?` · manual XP ${a.xp||0}/${xpNeed(a.lv)}`:` <button data-eq="${k}" style="min-height:26px;padding:2px 10px;margin-left:6px">Equip</button>`}<br><small>${ARTS[k].desc||''}</small></div>`).join('')}
  <h3>內功 Inner art</h3><div class="art"><b>${inn.zh} ${inn.n}</b><br><small>${inn.desc}</small></div>
  <h3>輕功 Lightness skill</h3><div class="art"><b>${q.zh} ${q.n}</b><br><small>Move ${q.mv} squares · dodge ${Math.round(q.dodge*100)}%</small></div>
  <h3>Party</h3><div>${['You',...P.party.map(k=>PEOPLE[k].n)].join(', ')}</div>
  <div class="row"><button id="stHerb">Use a herb (+50 HP)</button><button id="stClose" class="pri">Close</button></div>`;
  p.hidden=false;$s('#stClose').onclick=()=>p.hidden=true;p.querySelectorAll('[data-eq]').forEach(b=>b.onclick=()=>{P.eq=b.dataset.eq;st_save();p.hidden=true;st_heroPanel();st_toast('Equipped: '+ARTS[P.eq].n)});$s('#stHerb').onclick=()=>{if(!P.herbs)return st_toast('No herbs');P.herbs--;P.hp=Math.min(P.hpMax,P.hp+50);st_hud();p.hidden=true;st_heroPanel()}}

// ---------- sprites ----------
const IMG={};function st_img(src){if(!IMG[src]){const i=new Image();i.src=src;IMG[src]=i}return IMG[src]}
const st_sheetOf=k=>st_img('sprites/'+k+'.png');
function st_rowsOf(sh){const n=Math.round(sh.naturalHeight/132);return n>=5?{idle:0,run:1,melee:2,ranged:3,fall:4,dash:n>5?5:null,punch:n>6?6:2,kick:n>7?7:2}:{idle:0,run:1,melee:2,ranged:2,fall:3,dash:null}}
// draw cell with feet anchor (90,126) at (x,y); scale k; face 1=right,-1=left
function st_drawCell(c,sh,row,fr,x,y,k,face,alpha){if(!sh.complete||!sh.naturalWidth)return;c.save();c.globalAlpha=alpha==null?1:alpha;c.translate(x,y);c.scale(face*k,k);c.drawImage(sh,fr*192,row*132,192,132,-90,-126,192,132);c.restore()}

// ---------- battle ----------
let B=null;const COLS=14,ROWS=8;
function st_heroUnit(){const q=QG[P.qg];const I=INNER[P.inner];return {id:'hero',name:'You',sheet:'f_hero_shu',port:'hero',side:'P',hp:P.hp+I.hp,hpMax:P.hpMax+I.hp,mp:P.mp,mpMax:P.mpMax,atk:P.atk,def:P.def+I.def,mv:q.mv,dodge:q.dodge+I.dodge,arts:Object.keys(P.arts),hero:true}}
function st_allyUnit(k){if(k==='xiaoming'){const L=P.lv;return {id:'xiaoming',name:'Xiao Ming',sheet:'f_xiaoming_shu',port:'xiao_ming',side:'P',hp:70+L*8,hpMax:70+L*8,mp:0,mpMax:0,atk:13+L*2,def:6+L,mv:3,dodge:.06,arts:['fork']}}}
function st_battle(key){return new Promise(res=>{const D=BATTLES[key];const us=[st_heroUnit(),...P.party.map(st_allyUnit).filter(Boolean)];
  const ppos=[[2,4],[2,3],[2,5],[1,4]];const fs=D.foes();
  let map=null;try{map=genBattleMap('N',D.theme==='river',1000+Math.floor(Math.random()*9000),D.theme)}catch(e){}if(!map||map.length!==ROWS)map=Array.from({length:ROWS},()=>'.'.repeat(COLS));
  B={key,D,map,units:[],turn:'P',sel:null,mode:'idle',res,bg:st_img('art/'+D.bg+'.jpg'),hl:[],t0:performance.now()};
  const place=(u,x,y)=>{let best=null,bd=1e9;for(let X=0;X<COLS;X++)for(let Y=0;Y<ROWS;Y++){if(!st_pass(X,Y)||B.units.some(v=>v.x===X&&v.y===Y))continue;const d=Math.abs(X-x)+Math.abs(Y-y);if(d<bd){bd=d;best=[X,Y]}}[u.x,u.y]=best;B.units.push(u)};
  us.forEach((u,i)=>place(u,...ppos[i]));fs.forEach((u,i)=>place(u,...D.pos[i]));
  $s('#stMap').hidden=true;const cv=$s('#stCv');cv.hidden=false;mus('battle');st_fit();cv.onpointerdown=st_onTap;
  st_toast(D.title,2000);for(const u of B.units)u.done=false;st_loop();st_actBar()})}
function st_fit(){const cv=$s('#stCv'),r=cv.getBoundingClientRect(),dp=Math.min(2,window.devicePixelRatio||1);cv.width=r.width*dp;cv.height=r.height*dp;B.dp=dp;
  const T=Math.min(cv.width/COLS,(cv.height-60*dp)/ROWS);B.T=T;B.ox=(cv.width-T*COLS)/2;B.oy=(cv.height-60*dp-T*ROWS)/2+8*dp;B.terr=null;st_terr()}
function st_terr(){if(!B||B.terr)return;try{if(typeof mapArtReady==='function'&&!mapArtReady())return;const pm=MAP,pt=window.BTHEME;MAP=B.map;window.BTHEME=B.D.theme;try{B.terr=renderTerrainArt(B.T/B.dp)}finally{MAP=pm;window.BTHEME=pt}}catch(e){B.terr=false}}
const st_ter=(x,y)=>B&&B.map&&B.map[y]?B.map[y][x]:'.';const st_pass=(x,y)=>st_ter(x,y)!=='w';const st_tdef=(x,y)=>{try{return (T_INFO[st_ter(x,y)]||{def:1}).def}catch(e){return 1}};
window.addEventListener('resize',()=>{if(B&&!$s('#stCv').hidden)st_fit()});
const st_at=(x,y)=>B.units.find(u=>u.hp>0&&u.x===x&&u.y===y);
const st_inb=(x,y)=>x>=0&&y>=0&&x<COLS&&y<ROWS;
function st_reach(u){const out=[[u.x,u.y]],seen=new Set([u.x+','+u.y]);let fr=[[u.x,u.y,0]];
  while(fr.length){const n=[];for(const [x,y,d] of fr){if(d>=u.mv)continue;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const X=x+dx,Y=y+dy,k=X+','+Y;if(!st_inb(X,Y)||seen.has(k)||!st_pass(X,Y))continue;const o=st_at(X,Y);if(o&&o.side!==u.side)continue;seen.add(k);n.push([X,Y,d+1]);if(!o)out.push([X,Y])}}fr=n}return out}
const DIRS=[[1,0],[-1,0],[0,1],[0,-1]];
function st_targetsFor(u,art,from){const A=ARTS[art],x=from?from[0]:u.x,y=from?from[1]:u.y,foe=o=>o&&o.side!==u.side;const opts=[];
  if(A.shape==='adj'){for(const [dx,dy] of DIRS){const o=st_at(x+dx,y+dy);if(foe(o))opts.push({tiles:[[x+dx,y+dy]],hit:[o],click:[[x+dx,y+dy]]})}}
  else if(A.shape==='ring'){const hit=[],tl=[];for(const [dx,dy] of DIRS){const o=st_at(x+dx,y+dy);tl.push([x+dx,y+dy]);if(foe(o))hit.push(o)}if(hit.length)opts.push({tiles:tl.filter(t=>st_inb(t[0],t[1])),hit,click:hit.map(o=>[o.x,o.y])})}
  else if(A.shape==='r2'){for(const o of B.units)if(foe(o)&&o.hp>0&&Math.abs(o.x-x)+Math.abs(o.y-y)<=2)opts.push({tiles:[[o.x,o.y]],hit:[o],click:[[o.x,o.y]]})}
  else{const L=A.shape==='line3'?3:2;for(const [dx,dy] of DIRS){const tl=[],hit=[];for(let i=1;i<=L;i++){const X=x+dx*i,Y=y+dy*i;if(!st_inb(X,Y))break;tl.push([X,Y]);const o=st_at(X,Y);if(foe(o))hit.push(o)}if(hit.length)opts.push({tiles:tl,hit,click:tl,dir:[dx,dy]})}}
  return opts}
function st_actBar(){const a=$s('#stAct');if(!B||B.turn!=='P'||B.busy){a.hidden=true;return}
  const u=B.sel;if(!u||B.mode==='idle'){a.innerHTML=`<button id="stEnd">End turn</button>`;a.hidden=false;$s('#stEnd').onclick=()=>st_endTurn();return}
  if(B.mode==='act'){a.innerHTML=u.arts.map(k=>{const A=ARTS[k],ok=u.mp>=A.mp&&st_targetsFor(u,k).length;return `<button data-a="${k}" ${ok?'':'disabled'}>${A.zh} ${A.n}<small>${A.mp?A.mp+' 內力':'free'}${u.hero?' · Lv '+P.arts[k].lv:''}</small></button>`}).join('')+(u.hero&&P.herbs?`<button data-a="herb">Herb<small>+50 HP · ${P.herbs} left</small></button>`:'')+`<button data-a="wait">Wait</button><button data-a="back">Back</button>`;
    a.hidden=false;a.querySelectorAll('button').forEach(b=>b.onclick=()=>st_chooseArt(b.dataset.a));return}
  if(B.mode==='target'){a.innerHTML=`<button data-a="cancel">Cancel</button>`;a.hidden=false;a.querySelector('button').onclick=()=>{B.mode='act';B.hl=[];st_actBar()};return}
  a.hidden=true}
function st_onTap(e){if(!B||B.turn!=='P'||B.busy)return;const r=e.currentTarget.getBoundingClientRect(),px=(e.clientX-r.left)*B.dp,py=(e.clientY-r.top)*B.dp;
  const x=Math.floor((px-B.ox)/B.T),y=Math.floor((py-B.oy)/B.T);if(!st_inb(x,y))return;const o=st_at(x,y);
  if((B.mode==='idle'||B.mode==='move'||B.mode==='act')&&o&&o.side==='E'){st_quickHit(o);return}
  if(B.mode==='idle'||B.mode==='move'){
    if(o&&o.side==='P'&&!o.done&&(B.mode==='idle'||o!==B.sel)){B.sel=o;B.mode='move';B.orig=[o.x,o.y];B.hl=st_reach(o).map(t=>({t,c:'mv'}));st_actBar();return}
    if(B.mode==='move'&&B.hl.some(h=>h.t[0]===x&&h.t[1]===y)){const u=B.sel;st_moveTo(u,x,y).then(()=>{B.mode='act';B.hl=[];st_actBar()});return}
    if(B.mode==='move'){B.mode='idle';B.sel=null;B.hl=[];st_actBar()}return}
  if(B.mode==='target'){const opt=B.opts.find(op=>op.click.some(t=>t[0]===x&&t[1]===y));if(opt)st_doAttack(B.sel,B.art,opt)}}
function st_quickHit(o){let u=B.sel&&!B.sel.done?B.sel:null;if(!u){u=B.units.find(v=>v.hero&&v.hp>0&&!v.done)||B.units.find(v=>v.side==='P'&&v.hp>0&&!v.done)}if(!u)return;
  const hits=(from)=>{for(const k of u.arts){const A=ARTS[k];if(u.mp<A.mp)continue;const op=st_targetsFor(u,k,from).find(op=>op.hit.includes(o));if(op)return {k,op}}return null};
  if(B.mode==='act'){const h=hits();if(h){B.sel=u;st_doAttack(u,h.k,h.op)}else st_toast('Out of reach');return}
  let best=null;for(const t of st_reach(u)){const h=hits(t);if(h){const d=Math.abs(t[0]-u.x)+Math.abs(t[1]-u.y);if(!best||d<best.d)best={t,d}}}
  if(!best)return st_toast(u.name+' cannot reach '+o.name+' this turn');B.sel=u;B.hl=[];$s('#stAct').hidden=true;B.busy=true;
  st_moveTo(u,best.t[0],best.t[1]).then(()=>{B.busy=false;const h=hits();if(h)st_doAttack(u,h.k,h.op);else{B.mode='act';st_actBar()}})}
function st_moveTo(u,x,y){return new Promise(res=>{if(u.x===x&&u.y===y)return res();const fx=u.x,fy=u.y;u.anim={k:'run',t0:performance.now(),dur:260,fx,fy};u.face=x<fx?-1:x>fx?1:u.face;u.x=x;u.y=y;setTimeout(()=>{u.anim=null;res()},270)})}
function st_chooseArt(k){const u=B.sel;
  if(k==='back'){if(B.orig){u.x=B.orig[0];u.y=B.orig[1]}B.mode='move';B.hl=st_reach(u).map(t=>({t,c:'mv'}));st_actBar();return}
  if(k==='wait'){st_finish(u);return}
  if(k==='herb'){P.herbs--;u.hp=Math.min(u.hpMax,u.hp+50);st_toast('+50 HP');st_finish(u);return}
  B.art=k;B.opts=st_targetsFor(u,k);B.mode='target';B.hl=[];for(const op of B.opts)for(const t of op.tiles)B.hl.push({t,c:'tg'});st_actBar()}
function st_finish(u){u.done=true;B.sel=null;B.mode='idle';B.hl=[];st_actBar();st_checkEnd();if(B&&B.units.filter(v=>v.side==='P'&&v.hp>0).every(v=>v.done))st_endTurn()}
async function st_doAttack(u,k,opt){B.busy=true;$s('#stAct').hidden=true;B.hl=[];const A=ARTS[k];u.mp-=A.mp;
  const res=opt.hit.map(t=>{const lv=u.hero?P.arts[k].lv:1;const dodge=Math.random()<t.dodge;let dmg=0,crit=false;
    if(!dodge){crit=Math.random()<.08;dmg=Math.max(1,Math.round((u.atk*A.pow*(1+.08*(lv-1))-t.def*.6)*rnd(.9,1.1)*(crit?1.5:1)/st_tdef(t.x,t.y)))}return {t,dodge,dmg,crit}});
  await st_fightScene(u,A,res);
  for(const r of res){if(!r.dodge){r.t.hp=Math.max(0,r.t.hp-r.dmg);if(r.t.hp<=0&&r.t.side==='E'&&u.side==='P'){B.xp=(B.xp||0)+r.t.xp}}}
  if(A.stun){for(const r of res)if(r.t.hp>0&&!r.dodge&&Math.random()<A.stun){r.t.stun=1;st_toast(r.t.name+' is stunned!')}}
  if(A.kb&&opt.dir){for(const r of res)if(r.t.hp>0&&!r.dodge){const X=r.t.x+opt.dir[0],Y=r.t.y+opt.dir[1];if(st_inb(X,Y)&&!st_at(X,Y)){r.t.x=X;r.t.y=Y}}}
  B.busy=false;st_finish(u)}
function st_checkEnd(){if(!B)return;const pe=B.units.filter(v=>v.side==='P'&&v.hp>0),ee=B.units.filter(v=>v.side==='E'&&v.hp>0),hero=B.units.find(v=>v.hero);
  if(!ee.length)return st_endBattle(true);if(hero.hp<=0||!pe.length)return st_endBattle(false)}
async function st_endTurn(){if(!B)return;B.turn='E';B.sel=null;B.mode='idle';B.hl=[];st_actBar();
  for(const e of B.units.filter(v=>v.side==='E'&&v.hp>0)){if(!B)return;await st_enemyAct(e);st_checkEnd();if(!B)return}
  B.turn='P';for(const u of B.units){u.done=false;if(u.hero)u.mp=Math.min(u.mpMax,u.mp+INNER[P.inner].regen)}st_toast('Your turn',900);st_actBar()}
async function st_enemyAct(e){if(e.stun){e.stun=0;await st_wait(250);return}const k=e.arts[0],ps=B.units.filter(v=>v.side==='P'&&v.hp>0);if(!ps.length)return;
  let best=null;for(const t of st_reach(e)){const op=st_targetsFor(e,k,t);if(op.length){const sc=-(op[0].hit[0].hp)+(op[0].hit[0].hero?15:0);if(!best||sc>best.sc)best={t,sc}}}
  if(best){await st_moveTo(e,best.t[0],best.t[1]);await st_wait(150);const op=st_targetsFor(e,k)[0];if(op){B.busy=true;await st_doAttackE(e,k,op);B.busy=false}return}
  // approach nearest
  const near=ps.sort((a,b)=>(Math.abs(a.x-e.x)+Math.abs(a.y-e.y))-(Math.abs(b.x-e.x)+Math.abs(b.y-e.y)))[0];
  let bt=null,bd=1e9;for(const t of st_reach(e)){const d=Math.abs(t[0]-near.x)+Math.abs(t[1]-near.y);if(d<bd){bd=d;bt=t}}if(bt)await st_moveTo(e,bt[0],bt[1]);await st_wait(120)}
async function st_doAttackE(e,k,opt){const A=ARTS[k];const res=opt.hit.map(t=>{const dodge=Math.random()<t.dodge;const dmg=dodge?0:Math.max(1,Math.round((e.atk*A.pow-t.def*.6)*rnd(.9,1.1)/st_tdef(t.x,t.y)));return {t,dodge,dmg}});
  await st_fightScene(e,A,res);for(const r of res)if(!r.dodge)r.t.hp=Math.max(0,r.t.hp-r.dmg)}
async function st_endBattle(win){const b=B;if(b.ended)return;b.ended=true;await st_wait(500);
  const hero=b.units.find(v=>v.hero);P.hp=Math.max(1,Math.min(P.hpMax,hero.hp-INNER[P.inner].hp));P.mp=hero.mp;
  if(win){const xp=(b.xp||0);P.xp+=xp;st_toast('Victory! +'+xp+' XP',2200);
    {const a=P.arts[P.eq];if(a){if(a.xp==null)a.xp=0;a.xp+=Math.floor(xp/2);while(a.lv<10&&a.xp>=xpNeed(a.lv)){a.xp-=xpNeed(a.lv);a.lv++;await st_wait(400);st_toast(ARTS[P.eq].n+' rises to level '+a.lv,2400)}}}
    while(P.lv<30&&P.xp>=xpNeed(P.lv)){P.xp-=xpNeed(P.lv);P.lv++;P.hpMax+=14;P.mpMax+=6;P.atk+=3;P.def+=2;P.hp=P.hpMax;P.mp=P.mpMax;await st_wait(300);st_toast('Level up! Level '+P.lv,2400);snd('victory');
      if(P.lv>=3&&!P.arts.wave){await st_wait(900);st_learn('wave')}}}
  else{P.gold=Math.floor(P.gold*.8);P.hp=P.hpMax;P.mp=P.mpMax;}
  B=null;$s('#stCv').hidden=true;$s('#stAct').hidden=true;st_hud();st_save();
  if(!win&&b.key!=='spar'){await st_say('narr','Everything goes dark... You wake at the inn in Zhuo Village, bandaged and lighter of purse.');st_showMap()}
  b.res(win)}

// ---------- board render ----------
function st_loop(){if(!B)return;const cv=$s('#stCv');if(cv.hidden){requestAnimationFrame(st_loop);return}const c=cv.getContext('2d'),now=performance.now(),T=B.T;
  c.fillStyle='#1d1a14';c.fillRect(0,0,cv.width,cv.height);if(!B.terr&&B.terr!==false)st_terr();
  if(B.terr)c.drawImage(B.terr,B.ox,B.oy,T*COLS,T*ROWS);else{c.fillStyle='#5a7a3a';c.fillRect(B.ox,B.oy,T*COLS,T*ROWS);for(let x=0;x<COLS;x++)for(let y=0;y<ROWS;y++){const tt=st_ter(x,y);if(tt!=='.'){c.fillStyle=tt==='w'?'#3a6a9a':tt==='f'?'#2f5a2a':tt==='h'?'#7a6a4a':'#a08a60';c.fillRect(B.ox+x*T,B.oy+y*T,T,T)}c.strokeStyle='rgba(0,0,0,.2)';c.strokeRect(B.ox+x*T,B.oy+y*T,T,T)}}
  for(const h of B.hl){c.fillStyle=h.c==='mv'?'rgba(80,150,255,.35)':'rgba(255,70,60,.42)';c.fillRect(B.ox+h.t[0]*T+1,B.oy+h.t[1]*T+1,T-2,T-2)}
  const us=B.units.filter(u=>u.hp>0).sort((a,b)=>a.y-b.y);
  for(const u of us){const sh=st_sheetOf(u.sheet);if(!sh.complete||!sh.naturalWidth)continue;const R=st_rowsOf(sh);let px=B.ox+(u.x+.5)*T,py=B.oy+(u.y+.88)*T;
    let row=R.idle,fr=Math.floor((now/80+(u.id.length*3))%24);
    if(u.anim&&u.anim.k==='run'){const q=clamp01((now-u.anim.t0)/u.anim.dur);px=lerp2(B.ox+(u.anim.fx+.5)*T,px,q);py=lerp2(B.oy+(u.anim.fy+.88)*T,py,q);row=R.run;fr=Math.floor(now/40)%24}
    const face=u.face||(u.side==='P'?1:-1),k=1.45*T/114;
    if(B.sel===u){c.strokeStyle='#ffd77a';c.lineWidth=3*B.dp;c.strokeRect(B.ox+u.x*T+2,B.oy+u.y*T+2,T-4,T-4)}
    c.fillStyle='rgba(0,0,0,.3)';c.beginPath();c.ellipse(px,py,T*.28,T*.08,0,0,7);c.fill();
    st_drawCell(c,sh,row,fr,px,py,k,face,u.done&&u.side==='P'&&B.turn==='P'?.6:1);
    const bw=T*.7,bx=px-bw/2,by=B.oy+u.y*T+3*B.dp;c.fillStyle='#000';c.fillRect(bx,by,bw,5*B.dp);c.fillStyle=u.side==='P'?'#5ad06a':'#e0574a';c.fillRect(bx,by,bw*clamp01(u.hp/u.hpMax),5*B.dp);
    if(u.mpMax){c.fillStyle='#58a8ff';c.fillRect(bx,by+5*B.dp,bw*clamp01(u.mp/u.mpMax),3*B.dp)}}
  requestAnimationFrame(st_loop)}

// ---------- side-view fight scene ----------
function st_fightScene(att,A,res){return new Promise(done=>{const cv=$s('#stFight');cv.hidden=false;const r=cv.getBoundingClientRect(),dp=Math.min(2,window.devicePixelRatio||1);cv.width=r.width*dp;cv.height=r.height*dp;
  const W=cv.width,H=cv.height,c=cv.getContext('2d'),n=res.length,mir=att.side==='E'?-1:1,X=v=>mir>0?v*W:W-v*W;
  const k=(n>1?.34:.42)*H/114,gy=H*.86,ax0=.24,tx=res.map((_,i)=>n>1?.58+i*.12:.66),ty=res.map((_,i)=>gy-(n>1?(i%2)*H*.05:0));
  const sh=st_sheetOf(att.sheet),R=st_rowsOf(sh),bg=B.bg,parts=[],pops=[];let t0=performance.now();
  const anim=A.anim==='dash'&&R.dash!=null?'dash':A.anim==='ranged'?'ranged':'melee',mrow=(A.anim==='punch'||A.anim==='kick')&&R[A.anim]!=null?R[A.anim]:R.melee;
  const dur=anim==='dash'?2300:anim==='ranged'?2000:2200;const pierce=n>1&&anim!=='ranged';
  const GD=st_img('art/gdragon.jpg'),dragon=att.hero&&A===ARTS.palm&&P.arts.palm&&P.arts.palm.lv>=5;
  const hitT=res.map((_,i)=>anim==='dash'?1100+i*120:anim==='ranged'?950+i*110:1150+i*140);const hitDone=res.map(()=>false);
  snd(anim==='ranged'?'fx':'swing');
  function frame(){const now=performance.now(),t=now-t0;c.clearRect(0,0,W,H);
    if(bg.complete&&bg.naturalWidth){const s=Math.max(W/bg.naturalWidth,H/bg.naturalHeight);c.drawImage(bg,(W-bg.naturalWidth*s)/2,(H-bg.naturalHeight*s)/2,bg.naturalWidth*s,bg.naturalHeight*s)}
    c.fillStyle='rgba(0,0,0,.18)';c.fillRect(0,0,W,H);
    // banner
    c.fillStyle='rgba(10,8,6,.75)';c.fillRect(0,H*.04,W,H*.11);c.fillStyle='#ffd77a';c.font=`900 ${Math.round(H*.07)}px serif`;c.textAlign='center';c.fillText((A.zh||'')+'  '+A.n,W/2,H*.12);
    // targets
    res.forEach((r2,i)=>{const t2=r2.t,ts=st_sheetOf(t2.sheet),TR=st_rowsOf(ts);let x=X(tx[i]),y=ty[i],row=TR.idle,fr=Math.floor(now/80)%24,al=1;const ht=hitT[i];
      if(t>ht&&r2.dodge){const q=clamp01((t-ht)/200);x+=mir*W*.06*Math.sin(q*Math.PI/2);}
      if(t>ht&&!r2.dodge){if(t2.hp-r2.dmg<=0){row=TR.fall;fr=Math.min(23,Math.floor((t-ht)/30))}else if(t<ht+260){x+=mir*W*.015*Math.sin((t-ht)/20)}}
      c.fillStyle='rgba(0,0,0,.3)';c.beginPath();c.ellipse(x,y,k*40,k*9,0,0,7);c.fill();
      st_drawCell(c,ts,row,fr,x,y,k,-mir,al);
      if(t>ht&&!r2.dodge&&t<ht+120){c.save();c.globalCompositeOperation='lighter';c.fillStyle='rgba(255,240,200,.22)';c.beginPath();c.arc(x,y-k*60,k*32,0,7);c.fill();c.restore()}
      if(t>ht&&!hitDone[i]){hitDone[i]=true;pops.push({x,y:y-k*120,t:now,txt:r2.dodge?'Dodge!':(r2.crit?'Critical '+r2.dmg:''+r2.dmg),col:r2.dodge?'#9fd7ff':r2.crit?'#ffd23a':'#fff'});if(!r2.dodge){snd('hit');for(let j=0;j<18;j++){const a=Math.random()*6.28,v=rnd(2,7)*dp;parts.push({x,y:y-k*60,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:1,col:A.fx})}}else snd('swing')}});
    // attacker
    let ax=X(ax0),row=R.idle,fr=Math.floor(now/80)%24;const last=X(tx[n-1]),first=X(tx[0]);
    if(anim==='dash'){const a0=400,a1=1900;if(t>=a0&&t<a1){const q=(t-a0)/(a1-a0);row=R.dash;fr=Math.min(23,Math.floor(q*24));const dest=pierce?last+mir*W*.08:first-mir*W*.1;if(q<.2)ax=X(ax0);else if(q<.6)ax=lerp2(X(ax0),dest,ease2((q-.2)/.4));else ax=dest}
      else if(t>=a1){const q=clamp01((t-a1)/350),dest=pierce?last+mir*W*.08:first-mir*W*.1;ax=lerp2(dest,X(ax0),ease2(q));row=R.run;fr=Math.floor(now/40)%24}}
    else if(anim==='melee'){const dest=pierce?last+mir*W*.08:first-mir*W*.11;if(t>=300&&t<800){row=R.run;fr=Math.floor(now/40)%24;ax=lerp2(X(ax0),dest,ease2((t-300)/500))}else if(t>=800&&t<1700){row=mrow;fr=Math.min(23,Math.floor((t-800)/900*24));ax=pierce?lerp2(dest-mir*W*.2,dest,clamp01((t-800)/600)):dest}else if(t>=1700){row=R.run;fr=Math.floor(now/40)%24;ax=lerp2(dest,X(ax0),ease2(clamp01((t-1700)/350)))}}
    else{if(t>=350&&t<1500){row=R.ranged;fr=Math.min(23,Math.floor((t-350)/1150*24))}
      if(t>800&&t<800+170*n+300){const q=clamp01((t-800)/(150*n+200));const px=lerp2(X(ax0)+mir*W*.06,last+mir*W*.05,q),py=gy-k*62;c.save();c.globalCompositeOperation='lighter';for(let j=0;j<5;j++){c.fillStyle=A.fx;c.globalAlpha=.25-j*.04;c.beginPath();c.arc(px-mir*j*k*10,py,k*(22-j*2),0,7);c.fill()}c.restore()}}
    c.fillStyle='rgba(0,0,0,.3)';c.beginPath();c.ellipse(ax,gy,k*40,k*9,0,0,7);c.fill();
    if(R.dash==null&&anim==='melee'&&row===R.melee)row=R.melee;
    const face=(anim!=='ranged'&&t>=(anim==='dash'?1900:1700))?-mir:mir;st_drawCell(c,sh,row,fr,ax,gy,k,face);
    if(dragon&&GD.complete&&GD.naturalWidth){const h0=hitT[0],a=h0-380,b=h0+700;if(t>=a&&t<b){const dt=t-a,f=Math.min(35,Math.floor(dt/(b-a)*36)),q=clamp01(dt/380),tx0=X(tx[0]),sx=ax+mir*k*55,px=lerp2(sx,tx0,ease2(q)),py=gy-k*64,dw=k*300,dh=dw/2;
      c.save();c.globalCompositeOperation='lighter';c.globalAlpha=t>b-200?(b-t)/200:1;if(mir<0){c.translate(px,0);c.scale(-1,1);c.translate(-px,0)}c.drawImage(GD,(f%6)*240,Math.floor(f/6)*120,240,120,px-dw*.55,py-dh/2,dw,dh);c.restore()}}
    // particles + popups
    for(const p of parts){p.x+=p.vx;p.y+=p.vy;p.vy+=.2*dp;p.l-=.03;if(p.l>0){c.globalAlpha=p.l;c.fillStyle=p.col;c.fillRect(p.x,p.y,4*dp,4*dp)}}c.globalAlpha=1;
    for(const p of pops){const q=(now-p.t)/900;if(q>1)continue;c.globalAlpha=1-q;c.fillStyle=p.col;c.strokeStyle='#000';c.lineWidth=4*dp;c.font=`900 ${Math.round(H*.075)}px sans-serif`;c.textAlign='center';c.strokeText(p.txt,p.x,p.y-q*40*dp);c.fillText(p.txt,p.x,p.y-q*40*dp)}c.globalAlpha=1;
    // name plates
    c.font=`700 ${Math.round(H*.04)}px sans-serif`;c.textAlign='left';c.fillStyle='#fff';c.fillText(att.name,mir>0?W*.03:W*.6,H*.95);
    if(t<dur&&!skip)requestAnimationFrame(frame);else{cv.hidden=true;cv.onpointerdown=null;done()}}
  let skip=false;cv.onpointerdown=()=>{if(performance.now()-t0>300)skip=true};requestAnimationFrame(frame)})}

// ---------- title menu (left column) ----------
const TCSS=`@media (orientation:landscape){
#title .tcontent{position:absolute;left:0;top:0;bottom:0;margin:0;width:236px;max-width:none;box-sizing:border-box;background:#2a2a2d;border-right:1px solid #3d3d42;padding:10px 14px max(10px,env(safe-area-inset-bottom,0px)) max(14px,env(safe-area-inset-left,0px));display:flex;flex-direction:column;justify-content:flex-start;gap:6px;overflow-y:auto}
#title .tbg{left:236px!important;width:calc(100% - 236px)!important}
#title .tshade,#title .tbig,#title .tscen,#title .tmode,#title .tlogo,#title .tbrand{display:none!important}
#title .tcolLogo{display:block!important}
#title #tbtns{flex-direction:column;flex-wrap:nowrap;gap:4px}
#title #tbtns button{min-height:30px;padding:3px 12px;font-size:13px;text-align:left;width:100%}
#title #tbtns .tsep{border:0;border-top:1px solid #47474d;margin:2px 0;width:100%}}
#title .tcolLogo{display:none;font:900 22px var(--f-zh,serif);color:#f0c454;letter-spacing:2px}
#title .tcolLogo small{display:block;font:400 11px var(--f-body,sans-serif);color:#9a9aa2;letter-spacing:0;margin-top:2px}`;
function st_titleLayout(){const tb=$s('#tbtns');if(!tb)return;
  if(!$s('#stNewBtn')){const st=document.createElement('style');st.textContent=TCSS;document.head.appendChild(st);
    const lg=document.createElement('div');lg.className='tcolLogo';lg.innerHTML='雄霸天下<small>RTK3 · Rise of the Warlords</small>';tb.parentNode.insertBefore(lg,tb);
    const mk=(id,t)=>{const b=document.createElement('button');b.id=id;b.textContent=t;return b};
    tb.append(mk('stContBtn','Story Continue'),mk('stNewBtn','New Story'));
    $s('#stNewBtn').onclick=()=>window.storyNew();$s('#stContBtn').onclick=()=>window.storyContinue()}
  tb.querySelectorAll('.tsep').forEach(s=>s.remove());const sep=()=>{const h=document.createElement('hr');h.className='tsep';return h};
  const order=['contBtn','newBtn','loadBtn','|','stContBtn','stNewBtn','|','hulaoBtn','spBtn','|','galBtn','heroBtn'];
  for(const id of order){if(id==='|'){tb.appendChild(sep());continue}const b=$s('#'+id);if(b)tb.appendChild(b)}
  $s('#stContBtn').hidden=!window.storyHasSave();
  const c=$s('#contBtn'),nb=$s('#newBtn');if(c&&nb){const has=!c.hidden;c.classList.toggle('primary',has);nb.classList.toggle('primary',!has)}}
if(typeof renderTitle==='function'){const _rt=renderTitle;renderTitle=function(){_rt.apply(this,arguments);st_titleLayout()}}
window.addEventListener('load',()=>setTimeout(st_titleLayout,50));
window.storyTitleLayout=st_titleLayout;
window.__ST={B:()=>B,P:()=>P,tap(x,y){const cv=document.querySelector('#stCv'),r=cv.getBoundingClientRect();cv.dispatchEvent(new PointerEvent('pointerdown',{clientX:r.left+(B.ox+(x+.5)*B.T)/B.dp,clientY:r.top+(B.oy+(y+.5)*B.T)/B.dp,bubbles:true}))},targets:(u,k)=>st_targetsFor(u,k),reach:u=>st_reach(u)};
})();
