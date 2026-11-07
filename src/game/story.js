// ===================== STORY MODE (RPG, wuxia) — v458 =====================
(function(){
const SKEY='rtk3_story';
const $s=q=>document.querySelector(q);
const snd=(n)=>{try{SND.fx(n)}catch(e){}},mus=(n)=>{try{SND.music(n)}catch(e){}};
const rnd=(a,b)=>a+Math.random()*(b-a),clamp01=v=>Math.max(0,Math.min(1,v)),lerp2=(a,b,t)=>a+(b-a)*t,ease2=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
const st_wait=ms=>new Promise(r=>setTimeout(r,ms));

// ---------- data ----------
const ARTS={
 basic:{zh:'拳腳',n:'Basic Strike',shape:'adj',pow:.75,mp:0,anim:'melee',fx:'#ffe7a8',desc:'Plain punches and kicks, no 內力 needed.'},
 palm:{type:'atk',zh:'金龍掌',n:'Golden Dragon Palm',shape:'adj',pow:1.45,mp:5,anim:'dash',fx:'#ffd75a',maxLv:10,desc:'Dash-in palm strike on an adjacent enemy. One manual, three moves: 金龍有悔 unlocks at Lv 3, 金龍出海 at Lv 5. A golden dragon flies from the palm at Lv 5.'},
 wave:{zh:'金龍有悔',n:'Dragon Regret',shape:'wave',pow:1.1,mp:6,anim:'ranged',fx:'#ffd75a',sub:'palm',unlock:3,heavy:1,desc:'金龍掌 move (Lv 3+): 內力 pushed out from the palm hits every enemy in a straight line. Range 3 / 4 / 5 / 6 squares at palm Lv 3 / 5 / 7 / 10.'},
 sea:{zh:'金龍出海',n:'Dragon from the Sea',shape:'aoe',pow:1.1,mp:12,anim:'ranged',anim2:'twin',fx:'#ffd75a',sub:'palm',unlock:5,heavy:1,desc:'金龍掌 move (Lv 5+): both palms push a golden wave over a 3-wide area in front. Lv 5: 1 row · Lv 7: 2 rows + 2 golden dragons · Lv 10: 3 rows + 3 golden dragons.'},
 green:{hidden:1,zh:'青龍氣',n:'Green Dragon Qi',shape:'aoe',pow:1.1,mp:12,anim:'ranged',anim2:'twin',fx:'#5dff8a',desc:'HIDDEN'},
 tiger:{hidden:1,zh:'伏虎拳',n:'Tiger-Taming Fist',shape:'adj',pow:1.15,mp:4,anim:'punch',fx:'#ffb060',stun:.2,desc:'HIDDEN'},
 whirl:{zh:'旋風腿',n:'Whirlwind Kick',shape:'ring',pow:1.0,mp:8,anim:'kick',fx:'#ffe7a8',sub:'star',unlock:3,heavy:1,desc:'追星腿 move (Lv 3+): spin kick around him. Lv 3-4: the 4 adjacent squares · Lv 5+: all 8 · Lv 7: 40% push-back · Lv 10: 60% push-back.'},
 chain:{zh:'連環腿',n:'Chain Kick',shape:'adj',pow:.8,mp:7,anim:'kick',fx:'#ffe7a8',sub:'star',unlock:5,hits:2,desc:'追星腿 move (Lv 5+): two kicks in a row on one adjacent enemy. Each kick can miss on its own.'},
 star:{type:'atk',zh:'追星腿',n:'Shooting-Star Kick',shape:'kick',pow:1.35,mp:5,anim:'fly',fx:'#ffe7a8',maxLv:10,pass:1,desc:'Flying kick along a line; he lands behind the enemy (or beside it if that square is taken). Reach 1 / 2 / 3 / 4 / 5 at Lv 1 / 3 / 5 / 7 / 10. One manual, three moves: 旋風腿 at Lv 3, 連環腿 at Lv 5.'},
 douzhuan:{type:'guard',zh:'天轉星移',n:'Star Shift',shape:'passive',passive:1,pow:0,mp:8,anim:'shift',fx:'#9fd0ff',maxLv:10,desc:'以彼之道，還施彼身. When an enemy blow is about to land, he steps back and a turning solar system catches it: he takes only part of the damage and the rest flies back at the attacker. Chance 10% at Lv 1, +2% per level. Costs 8 內力. Damage taken 60% at Lv 1 down to 33% at Lv 10. From Lv 5 poison and stun bounce back too.'},
 xianglong:{type:'guard',zh:'降龍手',n:'Subdue Dragon Hand',shape:'passive',passive:1,pow:0,mp:0,anim:'xlong',fx:'#5ab0ff',maxLv:10,desc:'When an enemy blow is about to land, he steps back and a blue dragon rises to take the hit: he takes only part of the damage and the rest is lost. Chance 15% at Lv 1, +3% per level. Damage taken 40% at Lv 1 down to 18% at Lv 10. No 內力 cost.'},
 cloud:{type:'qg',passive:1,zh:'踏雲步',n:'Cloud Step',agi:2,maxLv:5,mp:0,desc:'輕功 manual. Each level completed: +2 agility (permanent). No use in battle.'},
 sky:{type:'qg',passive:1,zh:'凌天步',n:'Sky Step',agi:3,maxLv:5,mp:0,desc:'輕功 manual. Each level completed: +3 agility (permanent). No use in battle.'},
 caixing:{type:'qg',passive:1,zh:'踩星步',n:'Star-Treading Step',agi:4,maxLv:5,mp:0,desc:'輕功 manual. Each level completed: +4 agility (permanent). No use in battle.'},
 jiuyang:{type:'inner',passive:1,zh:'九陽功',n:'Nine-Sun Art',mp:0,maxLv:10,hp:30,def:4,desc:'內功. Learning it: +30 體力, +4 防衛 (kept forever). While active: cuts damage taken by 8% at Lv 1, +2% per level (26% at Lv 10).'},
 xiaowu:{type:'inner',passive:1,zh:'小无脉功',n:'Pulseless Art',mp:0,maxLv:10,hp:30,def:4,desc:'內功. Learning it: +30 體力, +4 防衛 (kept forever). While active: raises damage dealt by 8% at Lv 1, +2% per level (26% at Lv 10).'},
 beitian:{type:'inner',passive:1,zh:'北天神功',n:'Northern Sky Art',mp:0,maxLv:10,hp:30,def:4,desc:'內功. Learning it: +30 體力, +4 防衛 (kept forever). While active: every 3 times he is hit (every 2 from Lv 7) his max 內力 rises by 1 for good and he restores 10% of his 內力 (+1% per level).'},
 fork:{zh:'叉',n:'Pitchfork Jab',shape:'adj',pow:1,mp:0,anim:'melee',fx:'#ffe7a8'},
 slash:{zh:'刀',n:'Slash',shape:'adj',pow:1,mp:0,anim:'melee',fx:'#ffe7a8'},
 axe:{zh:'斧',n:'Axe Chop',shape:'adj',pow:1.2,mp:0,anim:'melee',fx:'#ffb060'},
 bell:{zh:'攝魂鈴',n:'Soul Bell',shape:'r2',pow:1.1,mp:0,anim:'ranged',fx:'#7dff9a',poison:.5},
 staff:{zh:'棍',n:'Staff Strike',shape:'adj',pow:.8,mp:0,anim:'melee',fx:'#ffe7a8'}};
const mvOf=agi=>agi>=100?6:agi>=80?5:agi>=60?4:3,dodgeOf=agi=>Math.min(.2,agi/1000),talRed=t=>t>=80?.3:t>=60?.2:.1;
const skillNeed=lv=>Math.max(5,Math.round(xpNeed(lv)*(1-talRed(P?P.talent:50))));
const KIND={atk:'武功 Attack',guard:'護身 Guard',inner:'內功 Inner art',qg:'輕功 Lightness'};
const MOVES={palm:['palm','wave','sea'],star:['star','whirl','chain']};
const PEOPLE={hero:{n:'You',port:'hero'},hermit:{n:'Hermit Master',zh:'隱',port:'p_xianglang'},elder:{n:'Village Elder',zh:'老',port:'p_hanfu'},xiaoming:{n:'Xiao Ming',port:'xiao_ming'},xiaohei:{n:'Black Wind Chief',port:'xiao_hei'},jiangchen:{n:'Jiang Chen',port:'jiang_chen'},chief:{n:'Yellow Turban Chief',zh:'黃',port:'p_yanbaihu'},narr:{n:''}};
const PLACES=[
 {id:'valley',zh:'隱仙谷',n:'Hermit Valley',x:.16,y:.22,need:null,pic:'bg_pass'},
 {id:'zhuo',zh:'涿縣',n:'Zhuo Village',x:.42,y:.55,need:'prologue',pic:'bg_road'},
 {id:'blackwind',zh:'黑風寨',n:'Black Wind Fort',x:.76,y:.27,need:'prologue',pic:'bg_forest'},
 {id:'temple',zh:'古寺',n:'Old Temple',x:.18,y:.80,need:'bw',pic:'bg_hill'},
 {id:'ytcamp',zh:'黃巾營',n:'Yellow Turban Camp',x:.78,y:.78,need:'temple',pic:'bg_plain'}];
const AGI={d1:35,d2:35,b1:40,b2:40,b3:40,y1:45,y2:45,y3:45,y4:45,jiangchen:50,xiaohei:55,chief:60};
const E=(id,name,sheet,lv,hp,atk,def,arts,xp,port)=>{const agi=AGI[id]||30+lv*5;return {id,name,sheet,lv,hp,hpMax:hp,mp:0,mpMax:0,atk,def,arts,xp,port,agi,mv:mvOf(agi),dodge:dodgeOf(agi),side:'E'}};
const BATTLES={
 spar:{theme:'pass',bg:'bg_pass',title:'Sparring · the two disciples',foes:()=>[E('d1','Disciple','peasant_shu',1,45,11,4,['staff'],12,'p_liuqi'),E('d2','Disciple','peasant_shu',1,45,11,4,['staff'],12,'p_liuqi')],pos:[[9,2],[9,5]]},
 bw:{theme:'forest',bg:'bg_forest',title:'Black Wind Fort',foes:()=>[E('xiaohei','Black Wind Chief','f_xiaohei_shu',4,115,18,7,['axe'],40,'xiao_hei'),E('b1','Bandit','peasant_wei',2,45,12,4,['slash'],14,'p_baolong'),E('b2','Bandit','peasant_wei',2,45,12,4,['slash'],14,'p_baolong'),E('b3','Bandit','peasant_wei',2,45,12,4,['slash'],14,'p_baolong')],pos:[[12,4],[10,2],[10,5],[11,6]]},
 temple:{theme:'hills',bg:'bg_hill',title:'Old Temple',foes:()=>[E('jiangchen','Jiang Chen','f_jiangchen_shu',5,130,22,6,['bell'],50,'jiang_chen'),E('y1','Yellow Turban','peasant_ind',3,62,16,6,['slash'],16,'p_liaohua'),E('y2','Yellow Turban','peasant_ind',3,62,16,6,['slash'],16,'p_liaohua')],pos:[[12,3],[10,2],[10,5]]},
 yt:{theme:'river',bg:'bg_plain',title:'Yellow Turban Camp',foes:()=>[E('chief','Yellow Turban Chief','general_ind',7,240,27,10,['slash'],90,'p_yanbaihu'),E('y1','Yellow Turban','peasant_ind',4,70,18,7,['slash'],18,'p_liaohua'),E('y2','Yellow Turban','peasant_ind',4,70,18,7,['slash'],18,'p_liaohua'),E('y3','Yellow Turban','peasant_ind',4,70,18,7,['slash'],18,'p_liaohua'),E('y4','Yellow Turban','peasant_ind',4,70,18,7,['slash'],18,'p_liaohua')],pos:[[12,4],[10,1],[10,3],[10,5],[11,6]]}};
const xpNeed=lv=>20+lv*15;
const aoeDepth=lv=>lv>=10?3:lv>=7?2:1,gDragons=lv=>lv>=10?3:lv>=7?2:0,kickReach=lv=>lv>=10?5:lv>=7?4:lv>=5?3:lv>=3?2:1;
const waveLen=lv=>lv>=10?6:lv>=7?5:lv>=5?4:lv>=3?3:0;

// ---------- state ----------
let P=null;
function st_roll(){const r=(a,b)=>a+Math.floor(Math.random()*(b-a+1));const hp=r(100,140),mp=r(25,40);return {hp,hpMax:hp,mp,mpMax:mp,atk:r(18,26),def:r(8,14),agi:r(40,60),talent:r(40,90)}}
function st_freshHero(st,ch){st=st||st_roll();ch=ch||{atk:'palm',guard:'xianglong',inner:'jiuyang'};const P0=Object.assign({v:2,name:'Hero',lv:1,xp:0,gold:30,herbs:1,antidote:0,arts:{},manuals:[],eq:ch.atk,inner:ch.inner,flags:{},party:[],day:1},st);
  for(const k of [ch.atk,ch.guard,'cloud',ch.inner])P0.arts[k]={lv:1,xp:0};P0.agi+=ARTS.cloud.agi;P0.hpMax+=ARTS[ch.inner].hp;P0.hp=P0.hpMax;P0.def+=ARTS[ch.inner].def;return P0}
function st_save(){try{localStorage.setItem(SKEY,JSON.stringify(P))}catch(e){}}
function st_load(){try{const s=localStorage.getItem(SKEY);return s?JSON.parse(s):null}catch(e){return null}}
window.storyHasSave=()=>!!st_load();

// ---------- DOM ----------
const CSS=`
#story{position:fixed;inset:0;z-index:7;background:#14110d;color:#f3e6c4;font-family:var(--f-body,system-ui);overflow:hidden;user-select:none}
#story{--sb:46px}
#story .stbar{position:absolute;left:0;right:0;top:0;height:var(--sb);display:grid;grid-template-columns:auto 1fr auto auto;grid-template-areas:"who bars res btns";align-items:center;gap:10px;padding:0 max(10px,env(safe-area-inset-right,0px)) 0 max(10px,env(safe-area-inset-left,0px));background:linear-gradient(180deg,#2a241b,#17130e);border-bottom:1px solid #6a5a3a;z-index:3;font-size:12px;box-shadow:0 2px 8px rgba(0,0,0,.4)}
#story .stbar .who{grid-area:who;display:flex;align-items:center;gap:6px;white-space:nowrap}
#story .stbar .who b{font:900 22px var(--f-zh,serif);color:#ffd77a;line-height:1}
#story .stbar .who .lv{background:#b8322c;color:#fff;border-radius:10px;padding:1px 8px;font-weight:700;font-size:12px}
#story .stbar .bars{grid-area:bars;display:flex;gap:10px;min-width:0}
#story .stbar .bx{flex:1;display:flex;align-items:center;gap:5px;min-width:0}
#story .stbar .bx>span{color:#c9b98f;font-size:11px;white-space:nowrap;width:24px}
#story .stbar .bar{position:relative;flex:1;height:15px;background:#0b0907;border:1px solid #4a4030;border-radius:8px;overflow:hidden;min-width:50px}
#story .stbar .bar i{position:absolute;left:0;top:0;bottom:0;border-radius:8px;transition:width .3s}
#story .stbar .bar em{position:absolute;inset:0;text-align:center;font:700 10.5px/15px var(--f-body,sans-serif);color:#fff;text-shadow:0 1px 2px #000;font-style:normal}
#story .stbar .bx.xp .bar{height:9px}#story .stbar .bx.xp .bar em{line-height:9px;font-size:8.5px}
#story .stbar .res{grid-area:res;display:flex;gap:10px;white-space:nowrap;font-weight:700}
#story .stbar .btns{grid-area:btns;display:flex;gap:6px}
#story .stbar .btns button{min-height:30px;padding:3px 12px}
@media (max-width:700px){#story{--sb:78px}#story .stbar{grid-template-columns:auto 1fr auto;grid-template-areas:"who res btns" "bars bars bars";row-gap:4px;padding-top:6px;padding-bottom:6px}#story .stbar .res{justify-content:flex-end}}
#story .sp{flex:1}
#story{--fr:#3ab4ff;--fo:#ff4b3a;--pn:linear-gradient(180deg,rgba(20,32,62,.94),rgba(6,10,24,.94));--pl:rgba(140,200,255,.5)}
:where(#story) button{font:inherit;color:#f3e6c4;background:#38332a;border:1px solid #5a4e38;border-radius:6px;padding:6px 12px;cursor:pointer;min-height:34px}
:where(#story) button:disabled{opacity:.45;cursor:default}
:where(#story) button.pri{background:#b8322c;border-color:#d4473f}
#stMap{position:absolute;inset:var(--sb) 0 0 0;background:#2b2a22 center/cover no-repeat}
#stMap .pl{position:absolute;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;gap:1px;background:rgba(20,17,13,.85);padding:5px 5px 6px;border-radius:10px;border:1px solid #6a5a3a;width:clamp(104px,min(22vw,32vh),170px);box-shadow:0 4px 12px rgba(0,0,0,.45)}
#stMap .pl .pic{display:block;width:100%;aspect-ratio:16/10;border-radius:7px;background:#333 center/cover no-repeat;margin-bottom:3px}
#stMap .pl .nm{font-size:12px;line-height:1.15;text-align:center}
#stMap .pl .z{font:900 18px var(--f-zh,serif);color:#ffd77a;line-height:1.1}
#stMap .pl.done .z::after{content:' ✓';color:#9be39b;font-size:14px}
#stMap .pl.lock{opacity:.4;pointer-events:none}
#stMap .pl.new{box-shadow:0 0 0 2px #ffd77a,0 0 14px #ffd77a}
#stCv{position:absolute;inset:var(--sb) 0 0 0;width:100%;height:calc(100% - var(--sb));touch-action:none}
#stTools{position:absolute;right:8px;top:calc(var(--sb) + 56px);z-index:4;display:flex;flex-direction:column;gap:5px}
#story .rail{top:calc(var(--sb) + 8px)}#story .rail .pill.on{border-color:#ff7060;color:#ffb0a0;box-shadow:0 0 10px rgba(255,90,60,.6)}#story .logpanel{top:calc(var(--sb) + 8px)}#story .logpanel ol{margin:0;padding-left:20px;font-size:13px;line-height:1.45}#story .logpanel li.t{list-style:none;margin:6px 0 2px -20px;color:#9fc4ff;font-weight:800}
#story .hud.tp{z-index:5}#story #stAct.fan{z-index:5;left:auto;top:auto;transform:none;right:calc(16px + env(safe-area-inset-right,0px));bottom:calc(14px + env(safe-area-inset-bottom,0px));width:74px;height:74px;padding:0;display:block;flex-wrap:nowrap;max-width:none}@media (max-width:600px),(max-height:440px){#story #stAct.fan{width:62px;height:62px;right:calc(12px + env(safe-area-inset-right,0px));bottom:calc(10px + env(safe-area-inset-bottom,0px))}}#story #stBl{z-index:4}#stAct.fan[hidden],#stBl[hidden],#stTp[hidden],#stRail[hidden]{display:none}
#stOrder{position:absolute;z-index:4;left:50%;transform:translateX(-50%);bottom:calc(10px + env(safe-area-inset-bottom,0px));display:flex;gap:4px;padding:4px 8px;border-radius:24px;background:rgba(10,8,6,.72);border:1px solid rgba(201,162,74,.6);pointer-events:none}#stOrder[hidden]{display:none}#stOrder i{position:relative;width:30px;height:30px;border-radius:50%;background-size:150% auto;background-position:50% 6%;border:2px solid #58a8ff;opacity:.9}#stOrder i.e{border-color:#e0574a}#stOrder i.now{width:38px;height:38px;border-width:3px;opacity:1;box-shadow:0 0 10px rgba(255,215,90,.8)}#stOrder i b{position:absolute;left:50%;bottom:-9px;transform:translateX(-50%);font:900 8px system-ui;color:#1a1208;background:#ffd77a;border-radius:4px;padding:0 3px;letter-spacing:.05em}
@media (max-width:760px){#stOrder i{width:24px;height:24px}#stOrder i.now{width:30px;height:30px}}
#stTip{position:absolute;z-index:7;left:50%;transform:translateX(-50%);bottom:calc(96px + env(safe-area-inset-bottom,0px));width:min(420px,92vw);padding:10px 14px 12px;border-radius:10px;background:linear-gradient(180deg,#f4e8cc,#e2cfa4);color:#3a2a14;border:2px solid #8a6a32;box-shadow:0 8px 24px rgba(0,0,0,.6)}#stTip[hidden]{display:none}#stTip .tth{display:flex;align-items:baseline;gap:10px;border-bottom:1px solid rgba(90,60,20,.35);padding-bottom:4px;margin-bottom:6px}#stTip .tth b{font:900 20px var(--f-zh,serif);color:#7a1a0a}#stTip .tth span{font:700 17px var(--f-display,serif)}#stTip .ttm{display:flex;gap:8px;flex-wrap:wrap;font-size:12px;margin-bottom:6px}#stTip .ttm span{padding:1px 8px;border-radius:9px;background:#6a4e22;color:#fff3d6}#stTip .ttm em{font-style:normal;padding:1px 8px;border-radius:9px;background:#3a2a14;color:#ffd27a}#stTip p{margin:0;font-size:13px;line-height:1.4}
#stTools button{min-height:34px!important;width:38px;padding:0!important;font-size:16px;background:rgba(30,26,20,.85)!important}
#stTools button.on{border-color:#ff7060!important;color:#ff9080}
#stInfo,#stEInfo{position:absolute;left:8px;top:calc(var(--sb) + 8px);z-index:4;width:min(320px,56vw);display:flex;gap:9px;align-items:stretch;background:rgba(20,17,13,.92);border:1px solid #6a5a3a;border-radius:8px;padding:7px 9px;font-size:12px;line-height:1.35}
#stEInfo{left:auto;right:58px;top:calc(var(--sb) + 58px);border-color:#8a3a2a}
#stInfo .ih,#stEInfo .ih{display:flex;gap:8px;align-items:center;margin-bottom:4px}#stInfo .ibody,#stEInfo .ibody{flex:1;min-width:0}#stInfo .ip,#stEInfo .ip{width:50px;height:50px;border-radius:9px;background:#2a241b;flex:none;border:2px solid #6a5a3a;display:flex;align-items:center;justify-content:center;font:900 22px var(--f-zh,serif);color:#ffd77a}
#stInfo b,#stEInfo b{color:#ffd77a}#stInfo .ib,#stEInfo .ib{position:relative;height:15px;background:#000;border-radius:8px;margin:3px 0;overflow:hidden}#stInfo .ib i,#stEInfo .ib i{display:block;height:100%;border-radius:8px}#stInfo .ib span,#stEInfo .ib span{position:absolute;inset:0;text-align:center;font:700 11px/15px system-ui;color:#fff;text-shadow:0 1px 2px #000}
#stInfo .ih,#stEInfo .ih{align-items:center;gap:0;margin-bottom:3px}#stInfo .ih .ip,#stEInfo .ih .ip{width:84px;height:84px;border-radius:13px;border:3px solid #c9a24a;position:relative;z-index:1}#stInfo .ir,#stEInfo .ir{flex:1;min-width:0;margin-left:-8px;display:flex;flex-direction:column;gap:3px}
#stInfo .inm,#stEInfo .inm{align-self:flex-start;margin-left:14px;padding:1px 12px 2px;border-radius:11px 11px 11px 0;background:linear-gradient(180deg,#2a2418,#120f0a);border:1.5px solid #c9a24a;font:700 15px/1.25 Georgia,serif;color:#ffd77a;white-space:nowrap;max-width:100%;overflow:hidden;text-overflow:ellipsis}#stInfo .inm small,#stEInfo .inm small{color:#e8dcc0;font:600 11px system-ui}
#stInfo .ibr,#stEInfo .ibr{display:flex;align-items:center;gap:4px}#stInfo .ibr>b,#stEInfo .ibr>b{position:relative;z-index:2;width:36px;text-align:right;font:italic 900 12px/1 Georgia,serif;color:#ffe08a;text-shadow:0 1px 0 #000,0 0 3px #000,0 0 3px #000;flex:none}
#stInfo .ibr .ib,#stEInfo .ibr .ib{flex:1;height:18px;margin:0;border-radius:4px 9px 9px 4px;border:1.5px solid #c9a24a}#stInfo .ibr .ib span,#stEInfo .ibr .ib span{font:800 12px/16px system-ui}#stInfo .ist,#stEInfo .ist{margin-left:40px;font-size:11px;color:#cfc4aa}
#stInfo .ftr,#stEInfo .ftr{display:flex!important;align-items:center;gap:6px;margin-top:4px;justify-content:flex-start!important}#stInfo .fc .fp,#stEInfo .fc .fp{display:block;width:44px;height:44px;flex:none;border-radius:9px;border:2px solid #e0574a}#stInfo .fc .fr2,#stEInfo .fc .fr2{display:block;flex:1;min-width:0}#stInfo .fn,#stEInfo .fn{display:flex;justify-content:space-between;font-size:12px}#stInfo .fn span:first-child,#stEInfo .fn span:first-child{color:#fff;font-weight:700}#stInfo .ftr .ib,#stEInfo .ftr .ib{position:relative;height:18px;margin:2px 0 0;border-radius:4px 9px 9px 4px;border:1.5px solid #c9a24a;overflow:hidden;background:#000}#stInfo .ftr .ib i,#stEInfo .ftr .ib i{position:absolute;top:0;bottom:0;left:0;border-radius:0}#stInfo .ftr .ib i.fl,#stEInfo .ftr .ib i.fl{background:#fff6c8;animation:lmBlink .55s steps(2) infinite}#stInfo .ftr .ib span,#stEInfo .ftr .ib span{position:absolute;inset:0;text-align:center;font:800 12px/15px system-ui;color:#fff;text-shadow:0 1px 2px #000}#stInfo .ftr em,#stEInfo .ftr em{font-style:normal;color:#ffe08a}
#stInfo .skc .skn,#stEInfo .skc .skn{font:700 16px Georgia,serif;color:#fff;margin-bottom:6px}#stInfo .skc .skn b,#stEInfo .skc .skn b{color:#ffd77a;font-size:19px}#stInfo .skb,#stEInfo .skb{display:flex;gap:6px}#stInfo .skb button,#stEInfo .skb button{flex:1;margin-top:0}
#stFc{position:absolute;left:50%;bottom:58px;transform:translateX(-50%);z-index:6;display:flex;align-items:center;gap:6px;padding:8px 10px;border-radius:16px;background:linear-gradient(180deg,rgba(24,20,14,.94),rgba(10,8,5,.94));border:1.5px solid #c9a24a;box-shadow:0 8px 24px rgba(0,0,0,.55);font:13px system-ui;color:#eee;white-space:nowrap}
#stFc[hidden]{display:none}#stFc .fs{display:flex;align-items:center;width:250px}#stFc .fs.fo{flex-direction:row-reverse}
#stFc .fp{width:76px;height:76px;flex:none;border-radius:12px;border:3px solid #58a8ff;position:relative;z-index:1}#stFc .fo .fp{border-color:#e0574a}
#stFc .fi{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px;margin-left:-6px}#stFc .fo .fi{margin-left:0;margin-right:-6px}
#stFc .fnm{align-self:flex-start;margin-left:12px;padding:1px 10px 2px;border-radius:10px 10px 10px 0;background:linear-gradient(180deg,#2a2418,#120f0a);border:1.5px solid #c9a24a;max-width:calc(100% - 12px);overflow:hidden;text-overflow:ellipsis}#stFc .fo .fnm{align-self:flex-end;margin-left:0;margin-right:12px;border-radius:10px 10px 0 10px}
#stFc .fnm span{font:700 14px Georgia,serif;color:#ffd77a}#stFc .fnm small{margin-left:6px;font-size:11px;color:#e8dcc0}
#stFc .fbr{display:flex;align-items:center;gap:4px}#stFc .fo .fbr{flex-direction:row-reverse}#stFc .fbr>b{position:relative;z-index:2;width:36px;text-align:right;font:italic 900 11.5px/1 Georgia,serif;color:#ffe08a;text-shadow:0 1px 0 #000,0 0 3px #000,0 0 3px #000;flex:none}#stFc .fo .fbr>b{text-align:left}
#stFc .fbar{position:relative;flex:1;height:19px;border-radius:4px 10px 10px 4px;border:1.5px solid #c9a24a;background:#000;overflow:hidden}#stFc .fo .fbar{border-radius:10px 4px 4px 10px}
#stFc .fbar i{position:absolute;top:0;bottom:0;left:0}#stFc .fbar i.fl{background:#fff6c8;animation:lmBlink .55s steps(2) infinite}
#stFc .fbar span{position:absolute;inset:0;text-align:center;font:800 12px/16px system-ui;color:#fff;text-shadow:0 1px 2px #000,0 0 3px #000}#stFc em{font-style:normal;color:#ffe08a}
#stFc .fvs{display:flex;flex-direction:column;align-items:center;font:900 italic 20px Georgia,serif;color:#ffd77a;text-shadow:0 2px 4px #000;padding:0 4px}#stFc .fvs i{font:700 13px Georgia,serif;color:#fff;font-style:normal;margin-bottom:2px}#stFc .fvs small{font:700 11px system-ui;color:#fff;font-style:normal}
#stFc .fbtn{display:flex;flex-direction:column;gap:6px;margin-left:6px}#stFc .fbtn button{padding:8px 14px;border-radius:12px;border:1.5px solid #6a5a3a;background:#2a241b;color:#fff;font:700 13px system-ui}#stFc .fbtn .go{background:linear-gradient(180deg,#e0574a,#a8180e);border-color:#ffb347}
@media (max-width:760px){#stFc{bottom:52px;padding:6px}#stFc .fs{width:190px}#stFc .fp{width:58px;height:58px}#stFc .fbar{height:16px}#stFc .fbar span{font-size:11px;line-height:13px}}
#stInfo .fc,#stEInfo .fc{margin-top:5px;padding-top:5px;border-top:1px solid #4a4030}#stInfo .fc div,#stEInfo .fc div{display:flex;justify-content:space-between}#stInfo button,#stEInfo button{margin-top:6px;width:100%}
#stBanner{position:absolute;z-index:6;left:0;right:0;top:calc(50% - 36px);height:72px;pointer-events:none;display:flex;align-items:center;justify-content:center;overflow:hidden;opacity:0;animation:lmBan 1.35s ease-out forwards}
#stBanner::before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(16,90,210,.9) 18%,rgba(16,90,210,.9) 82%,transparent);border-block:2px solid rgba(170,220,255,.95)}
#stBanner.en::before{background:linear-gradient(90deg,transparent,rgba(190,26,16,.9) 18%,rgba(190,26,16,.9) 82%,transparent);border-color:rgba(255,180,160,.95)}
#stBanner b{position:relative;font:900 italic 36px var(--f-display,serif);letter-spacing:.1em;text-transform:uppercase;color:#fff;text-shadow:0 2px 0 rgba(0,0,0,.45),0 0 18px rgba(255,255,255,.55);animation:lmBanT 1.35s cubic-bezier(.2,.8,.2,1) forwards}
#stBanner small{position:relative;margin-left:16px;font:800 14px var(--f-body,sans-serif);color:#e8f1ff;letter-spacing:.06em;animation:lmBanT 1.35s cubic-bezier(.2,.8,.2,1) forwards}
@media (max-width:760px){#stBanner b{font-size:26px}}
@keyframes stBan{0%{opacity:0;transform:translateX(-30%)}20%{opacity:1;transform:none}80%{opacity:1;transform:none}100%{opacity:0;transform:translateX(30%)}}
#stFight{position:absolute;inset:0;z-index:5;width:100%;height:100%;background:#000}
#stAct{position:absolute;left:50%;bottom:8px;transform:translateX(-50%);display:flex;flex-wrap:wrap;gap:6px;justify-content:center;z-index:4;max-width:96%}
#stAct button small{display:block;font-size:10.5px;opacity:.8}
#stMsg{position:absolute;left:50%;top:calc(var(--sb) + 10px);transform:translateX(-50%);z-index:6;background:rgba(20,17,13,.9);border:1px solid #d4ad55;border-radius:8px;padding:6px 14px;font-size:14px;pointer-events:none;transition:opacity .3s}
#stDlg{position:absolute;left:0;right:0;bottom:0;z-index:8;display:flex;gap:12px;align-items:flex-end;padding:10px max(14px,env(safe-area-inset-left,0px)) max(12px,env(safe-area-inset-bottom,0px));background:linear-gradient(0deg,rgba(10,8,6,.97) 70%,rgba(10,8,6,0));min-height:120px}
#stDlg .pt{width:96px;height:120px;flex:none;border-radius:6px;background:#2a241b center top/cover no-repeat;border:1px solid #5a4e38;display:flex;align-items:center;justify-content:center;font:900 48px var(--f-zh,serif);color:#ffd77a}
#stDlg .tx{flex:1;font-size:15px;line-height:1.45;padding-bottom:6px}
#stDlg .tx b{display:block;color:#ffd77a;font-family:var(--f-display,serif);margin-bottom:2px}
#stDlg .tx .ch{display:flex;gap:8px;margin-top:8px;flex-wrap:wrap}
#stPanel{position:absolute;inset:calc(var(--sb) + 6px) 8px 8px 8px;z-index:7;background:#18140f;border:1px solid #5a4e38;border-radius:8px;padding:12px 16px;overflow-y:auto;font-size:14px}
#stPanel .hpw{display:grid;grid-template-columns:minmax(150px,26%) minmax(170px,22%) 1fr;gap:14px;height:100%}
#stPanel .hpp{display:flex;align-items:flex-end;justify-content:center;background:radial-gradient(ellipse at 50% 70%,#3a2c1a,#18140f 70%);border-radius:8px;overflow:hidden}
#stPanel .hpp img{max-height:100%;max-width:100%;object-fit:contain}
#stPanel .hpc{display:flex;flex-direction:column;gap:3px;overflow-y:auto}
#stPanel .hs{display:flex;justify-content:space-between;gap:8px;border-bottom:1px solid #3a3226;padding:3px 0;font-size:13px}#stPanel .hs span{color:#c9b98f}
#stPanel .hpr{display:flex;flex-direction:column;min-height:0}#stPanel .tabs{display:flex;gap:6px;margin-bottom:6px}#stPanel .tabs .on{border-color:#ffd77a;color:#ffd77a}
#stPanel .hpl{overflow-y:auto;min-height:0;padding-right:4px}#stPanel .sec2{font:700 13px var(--f-display,serif);color:#ffd77a;margin:8px 0 4px}#stPanel .sec2 small{font-weight:400;color:#c9b98f}
#stPanel .ah{display:flex;justify-content:space-between;align-items:center;gap:8px}#stPanel .art button{min-height:26px;padding:2px 10px}#stPanel .art.eq{border-color:#d4ad55}#stPanel .art small{display:block;margin-top:2px}#stPanel .art>button{margin:3px 0}
#stPanel .xb{height:5px;background:#000;border-radius:3px;margin:4px 0 2px}#stPanel .xb i{display:block;height:100%;background:#ffd77a;border-radius:3px}
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
  d.innerHTML=`<div class="stbar"><div class="who"><b>俠</b><span class="lv" id="stLv">Lv 1</span></div><div class="bars"><div class="bx"><span>HP</span><div class="bar"><i id="stHp" style="background:linear-gradient(90deg,#3fae52,#7be08a)"></i><em id="stHpT"></em></div></div><div class="bx"><span>內力</span><div class="bar"><i id="stMp" style="background:linear-gradient(90deg,#3a7fd8,#7ab8ff)"></i><em id="stMpT"></em></div></div><div class="bx xp"><span>XP</span><div class="bar"><i id="stXp" style="background:linear-gradient(90deg,#c9962e,#ffd77a)"></i><em id="stXpT"></em></div></div></div><div class="res"><span id="stGold"></span><span id="stHerbs"></span></div><div class="btns"><button id="stFsBtn" title="Full screen" aria-label="Full screen">⛶</button><button id="stHeroBtn">Hero</button><button id="stMenuBtn">Menu</button></div></div>
  <div id="stMap"></div><canvas id="stCv" hidden></canvas><div id="stOrder" hidden></div><aside class="rail" id="stRail" hidden><div class="turnbox"><span class="lbl">Turn</span><b id="stTurn">1</b></div><div class="pills"><button class="pill ic" data-r="thr" title="Enemy range" aria-label="Show enemy range">👁</button><button class="pill" data-r="auto" title="Auto battle">AUTO</button><button class="pill" data-r="spd" title="Battle scene speed">▶ 1×</button><button class="pill ic" data-r="snd" aria-label="Sound">🔊</button><button class="pill ic" data-r="log" title="Battle log" aria-label="Battle log">☰</button><button class="pill ic" data-r="perf" title="Performance meter" aria-label="Performance meter">📊</button><button class="pill ic" data-r="ret" title="Retreat" aria-label="Retreat">⚑</button></div></aside><div id="stTools" hidden><button data-z="in" title="Zoom in">＋</button><button data-z="out" title="Zoom out">－</button><button data-z="fit" title="Fit board">⤢</button></div><div class="logpanel" id="stLog" hidden><div class="lph"><div><b>Battle log</b><small id="stLogSub"></small></div><button class="pill" data-r="logx">Close</button></div><ol id="stLogL"></ol></div><div class="hud tp" id="stTp" hidden></div><div id="stTip" hidden></div><div class="hud bl" id="stBl" hidden><button class="endbtn" id="stEndB">Wait</button></div><div id="stInfo" hidden></div><div id="stEInfo" hidden></div><div id="stBanner" hidden></div><div id="stAct" class="acts2 fan" hidden></div><canvas id="stFight" hidden></canvas><div id="stMsg" style="opacity:0"></div><div id="stDlg" hidden></div><div id="stPanel" hidden></div>`;
  document.body.appendChild(d);
  $s('#stMenuBtn').onclick=()=>{if(B)return st_toast('Finish the battle first');st_exitStory()};
  $s('#stHeroBtn').onclick=()=>st_heroPanel();
  $s('#stFsBtn').onclick=()=>{const d=document,el=d.documentElement;try{if(d.fullscreenElement||d.webkitFullscreenElement){(d.exitFullscreen||d.webkitExitFullscreen).call(d)}else{const r=(el.requestFullscreen||el.webkitRequestFullscreen);if(r){const pr=r.call(el,{navigationUI:'hide'});if(pr&&pr.then)pr.then(()=>{try{screen.orientation.lock('landscape').catch(()=>{})}catch(e){}}).catch(()=>{})}else st_toast('Full screen is not supported on this browser')}}catch(e){}};
}
function st_toast(t,ms){const m=$s('#stMsg');m.textContent=t;m.style.opacity=1;clearTimeout(st_toast.h);st_toast.h=setTimeout(()=>m.style.opacity=0,ms||1800)}
function st_hud(){const pct=(a,b)=>Math.round(100*clamp01(a/b))+'%';
  $s('#stLv').textContent='Lv '+P.lv;$s('#stHp').style.width=pct(P.hp,P.hpMax);$s('#stHpT').textContent=P.hp+' / '+P.hpMax;$s('#stMp').style.width=pct(P.mp,P.mpMax);$s('#stMpT').textContent=P.mp+' / '+P.mpMax;$s('#stXp').style.width=pct(P.xp,xpNeed(P.lv));$s('#stXpT').textContent=P.xp+' / '+xpNeed(P.lv);$s('#stGold').textContent='💰 '+P.gold;$s('#stHerbs').textContent='🌿 '+P.herbs}

// ---------- enter / exit ----------
function st_enter(){st_build();for(const s of ['title','campaign','battleView']){const e=$s('#'+s);if(e)e.hidden=true}$s('#story').hidden=false;document.body.classList.add('lock');st_hud();st_showMap()}
function st_exitStory(){st_save();$s('#story').hidden=true;try{showScreen('title');renderTitle()}catch(e){$s('#title').hidden=false}}
window.storyNew=async function(){if(st_load()&&!confirm('Start a new story? The current story save will be replaced.'))return;const r=await st_create();if(!r)return;P=st_freshHero(r.st,r.ch);P.name=r.name;st_save();st_enter();await st_prologue()};
// new hero: name, roll stats, pick one art per category (the ones not picked turn up as manuals from chapter 2)
async function st_create(){if(typeof dialog!=='function')return {name:'Hero',st:st_roll(),ch:{atk:'palm',guard:'xianglong',inner:'jiuyang'}};let name='';
  for(;;){const r=await dialog(`<h2>俠 The orphan of Hermit Valley</h2><p>Eighteen winters ago a hermit found a baby in the snow. What is the young man's name?</p><input id="heroName" class="hname" maxlength="12" autocomplete="off" placeholder="Up to 12 letters" value="${name.replace(/"/g,'')}">`,[['cancel','Cancel'],['ok','Next','primary']]);
    if(r!=='ok')return null;name=(document.getElementById('heroName').value||'').replace(/\s+/g,' ').trim().slice(0,12);if(name)break}
  let st=st_roll();const tierTxt=t=>'skills level '+Math.round(talRed(t)*100)+'% faster';
  for(;;){const row=(lab,v,lo,hi,extra)=>`<div class="hstat"><span>${lab}</span><b>${v}</b><i style="width:${Math.round(100*(v-lo+4)/(hi-lo+4))}%"></i>${extra?`<small class="muted" style="grid-column:1/-1">${extra}</small>`:''}</div>`;
    const r=await dialog(`<h2>${name}</h2><p class="muted">Roll his starting stats. Roll as often as you like.</p><div class="hstats">${row('體力 HP',st.hp,100,140)}${row('內力 Inner power',st.mp,25,40)}${row('攻擊 Attack',st.atk,18,26)}${row('防衛 Defence',st.def,8,14)}${row('輕功 Agility',st.agi,40,60,'Moves '+mvOf(st.agi+ARTS.cloud.agi)+' squares (with Cloud Step) · dodge '+Math.round(dodgeOf(st.agi+2)*100)+'%')}${row('悟性 Talent',st.talent,40,90,tierTxt(st.talent))}</div>`,[['cancel','Cancel'],['roll','🎲 Roll again'],['ok','Accept','primary']]);
    if(r==='cancel')return null;if(r==='roll'){st=st_roll();continue}break}
  const pick=async(title,txt,keys)=>{const r=await dialog(`<h2>${title}</h2><p class="muted">${txt}</p><div class="tlist slots">${keys.map(k=>`<button data-r="${k}"><span class="sl"><b>${ARTS[k].zh} ${ARTS[k].n}</b><small>${ARTS[k].desc}</small></span></button>`).join('')}</div>`,[['cancel','Back']]);return ARTS[r]?r:null};
  const atk=await pick('武功 · His fighting art','Years of training under the hermit. Which art did he master? The other can be found later.',['palm','star']);if(!atk)return null;
  const guard=await pick('護身 · His guarding art','How does he protect himself?',['douzhuan','xianglong']);if(!guard)return null;
  const inner=await pick('內功 · His inner art','Which inner art did he cultivate? Others can be learned later; their 體力 and 防衛 bonuses stay with him.',['jiuyang','xiaowu','beitian']);if(!inner)return null;
  return {name,st,ch:{atk,guard,inner}}}
function st_migrate(){if(P.v>=2)return;P.v=2;P.name=P.name||'Hero';P.agi=50+(P.lv-1);const A=P.arts||{};
  for(const k of ['green','tiger','wave','thunder','plum'])delete A[k];if(A.whirl){A.star=A.star||{lv:Math.max(1,A.whirl.lv),xp:0};delete A.whirl}
  A.cloud={lv:1,xp:0};P.agi+=2;
  A.jiuyang={lv:1,xp:0};P.inner='jiuyang';P.hpMax+=30;P.def+=4;delete P.qg;
  if(!A.palm&&!A.star)A.palm={lv:1,xp:0};if(!A.douzhuan&&!A.xianglong)A.xianglong={lv:1,xp:0};
  P.manuals=(P.manuals||[]).filter(k=>ARTS[k]&&!ARTS[k].hidden&&!A[k]&&k!=='whirl');if(!ARTS[P.eq]||!A[P.eq])P.eq=A.palm?'palm':'star';P.arts=A}
window.storyContinue=function(){P=st_load();if(!P)return;if(P.v>=2){P.manuals=P.manuals||[];st_enter();return}if(P.arts&&P.arts.plum){P.arts.xianglong=P.arts.plum;delete P.arts.plum}if(P.manuals)P.manuals=P.manuals.map(m=>m==='plum'?'xianglong':m);if(P.eq==='plum')P.eq='xianglong';if(P.flags&&P.flags.yt&&!(P.arts&&P.arts.douzhuan)&&!(P.manuals||[]).includes('douzhuan')){P.manuals=(P.manuals||[]).concat(['douzhuan'])}if(P.flags&&P.flags.temple&&!(P.arts&&P.arts.xianglong)&&!(P.manuals||[]).includes('xianglong')){P.manuals=(P.manuals||[]).concat(['xianglong'])}if(P.arts&&P.arts.thunder){P.arts.green=P.arts.thunder;delete P.arts.thunder}if(P.eq==='thunder')P.eq='green';if(P.manuals)P.manuals=P.manuals.map(k=>k==='thunder'?'green':k);if(P.arts&&P.arts.wave){delete P.arts.wave;if(P.eq==='wave')P.eq='palm'}P.manuals=P.manuals||[];P.antidote=P.antidote||0;if(!P.eq)P.eq='palm';for(const a of Object.values(P.arts)){if(a.xp==null)a.xp=0}st_migrate();st_save();st_enter()};

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
    return `<button class="pl ${open?'':'lock'} ${done?'done':''} ${nw?'new':''}" data-p="${p.id}" style="left:${p.x*100}%;top:${p.y*100}%"><span class="pic" style="background-image:url(art/place_${p.id}.jpg),url(art/${p.pic}.jpg)"></span><span class="z">${p.zh}</span><span class="nm">${p.n}</span></button>`}).join('');
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
  const c=await st_say('elder',`Zhuo Village. What do you need?<br><small>Inn: rest and save (10 gold) · Herb: heals 50 HP (15 gold)</small>`,['Rest at the inn (10)','Buy a herb (15)','Buy an antidote (12)','Leave']);
  if(c===0){if(P.gold<10)return st_toast('Not enough gold');P.gold-=10;P.hp=P.hpMax;P.mp=P.mpMax;P.poison=0;P.day++;st_save();st_hud();st_toast('Fully rested · game saved');return st_zhuo()}
  if(c===1){if(P.gold<15)return st_toast('Not enough gold');P.gold-=15;P.herbs++;st_hud();return st_zhuo()}
  if(c===2){if(P.gold<12)return st_toast('Not enough gold');P.gold-=12;P.antidote=(P.antidote||0)+1;st_hud();return st_zhuo()}
  st_showMap()}

// ---------- story beats ----------
async function st_prologue(){
  await st_say('narr','AD 184. Deep in the mountains of You province, far from the dying Han court...');
  await st_say('hermit','Eighteen winters ago I found you in the snow below this valley, a baby wrapped in a soldier\'s cloak. Today you are a man.');
  await st_say('hero','Master... you taught me everything I know.');
  {const at=Object.keys(P.arts).find(k=>ARTS[k].type==='atk'),gd=Object.keys(P.arts).find(k=>ARTS[k].type==='guard');await st_say('hermit',`Your ${ARTS[at].zh} is ready, ${ARTS[gd].zh} guards you, and ${ARTS[P.inner].zh} flows in you. But the world below is drowning. Yellow Turbans burn the villages, bandits prey on the weak.`)}
  await st_say('hermit','Before you leave, show me. Defeat my two disciples — and do not hurt them too badly.');
  await st_tutorialTip();
  const won=await st_battle('spar');
  if(!won){P.hp=P.hpMax;P.mp=P.mpMax;await st_say('hermit','Again. Breathe, then strike.');return st_prologue()}
  await st_say('hermit','Good. Remember this: strength without virtue is the path of demons. Go down to Zhuo Village, and help those who suffer.');
  P.flags.prologue=1;P.hp=P.hpMax;P.mp=P.mpMax;st_save();st_showMap();st_toast('Visit Zhuo Village',2600)}
async function st_tutorialTip(){await st_say('narr','<b style="color:#9fd7ff">How to fight</b>Everyone has a 輕功 bar: the faster fighter acts more often — watch the order strip at the top. When it is your hero\'s move, tap a blue square to move (or tap him to stay), choose an art, then tap a red square. Waiting keeps half the bar; heavy arts cost extra time.')}
async function st_afterBW(){P.flags.bw=1;P.gold+=80;
  await st_say('xiaohei','Ugh... that palm... who ARE you?');
  await st_say('narr','Among the stolen loot you find 80 gold and three bundles of healing herbs.');P.herbs+=3;await st_say('xiaoming','We did it! The village is safe! But the elder says Yellow Turbans hold the old temple to the south...');st_save();st_showMap()}
async function st_afterTemple(){P.flags.temple=1;P.gold+=60;
  await st_say('jiangchen','My bell... broken... Great Teacher Zhang Jiao will avenge me...');
  await st_say('narr','Behind the altar, in a hollow beam, the monks hid their medicine chest: two antidotes and two herbs. The scroll shelves are empty — someone took the manuals long ago.');P.antidote=(P.antidote||0)+2;P.herbs+=2;st_save();st_showMap()}
async function st_afterYT(){P.flags.yt=1;P.gold+=150;P.herbs+=2;
  await st_say('chief','How... can one man... stand against the Yellow Sky...');
  await st_say('narr','In the chief\'s chest you find 150 gold — and a letter speaking of martial manuals carried to Luoyang. Perhaps they can still be found...');
  await st_say('narr','The camp scatters. By nightfall the whole county speaks of a young hero with a palm of gold.');
  await st_say('narr','In Zhuo, three men — Liu Bei, Guan Yu and Zhang Fei — are raising volunteers against the rebels. They want to meet you...<br><br><b style="color:#ffd77a">End of Chapter 1.</b> Chapter 2: the road to Hu Lao Gate — coming soon.');st_save();st_showMap()}
function st_learn(k,lv0){if(!P.arts[k]){P.arts[k]={lv:lv0?0:1,xp:0};const A=ARTS[k];if(A.type==='inner'){P.hpMax+=A.hp;P.hp+=A.hp;P.def+=A.def}if(lv0){st_toast('Learned '+ARTS[k].n+' at level 0 — equip it and win battles to reach level 1',3600);return}st_toast('New martial art: '+ARTS[k].n+' '+ARTS[k].zh,3000)}}

// ---------- hero panel ----------
function st_heroPanel(tab){const p=$s('#stPanel');if(!p.hidden&&!tab){p.hidden=true;return}tab=tab||'skills';P.manuals=P.manuals||[];P.antidote=P.antidote||0;
  const stat=(k,v)=>`<div class="hs"><span>${k}</span><b>${v}</b></div>`,red=Math.round(talRed(P.talent)*100);
  const artRow=(k,a)=>{const A=ARTS[k],eq=P.eq===k,act=A.type==='inner'&&P.inner===k,max=A.maxLv||10,need=skillNeed(a.lv);
    const moves=MOVES[k]?MOVES[k].map(m=>{const M=ARTS[m],un=!M.unlock||a.lv>=M.unlock;return `<span style="color:${un?'#ffd77a':'#8a7d62'}">${M.zh}${M.unlock?' (Lv '+M.unlock+')':''}${M.mp?' · '+M.mp+' 內力':''}</span>`}).join(' · '):'';
    return `<div class="art ${eq?'eq':''}"><div class="ah"><b>${eq?'★ ':''}${A.zh} ${A.n}${act?' <small style="color:#9fe39b">· active</small>':''}</b><span>Lv ${a.lv}/${max}${a.lv<1?' · <b style="color:#e0a050">not usable yet</b>':''}</span></div>
      ${a.lv<max?(eq?`<div class="xb"><i style="width:${Math.round(100*clamp01((a.xp||0)/need))}%"></i></div><small>Manual XP ${a.xp||0}/${need}</small>`:`<button data-eq="${k}">Equip to train</button>`):'<small style="color:#9fe39b">Mastered</small>'}
      ${A.type==='inner'&&!act&&a.lv>=1?`<button data-inner="${k}">Make active</button>`:''}${moves?`<small>${moves}</small>`:''}<small>${A.desc||''}</small></div>`};
  const groups=['atk','guard','inner','qg'].map(t=>{const ks=Object.keys(P.arts).filter(k=>ARTS[k]&&ARTS[k].type===t);return ks.length?`<div class="sec2">${KIND[t]}</div>${ks.map(k=>artRow(k,P.arts[k])).join('')}`:''}).join('');
  const skills=`<div class="sec2" style="margin-top:0">★ = the one manual in training · it gets half of each battle's XP · 悟性 cuts the XP it needs by ${red}%</div>${groups}`;
  const inv=`<div class="sec2">包裹 Inventory</div>
    <div class="art"><div class="ah"><b>🌿 Herb ×${P.herbs}</b><button data-use="herb" ${P.herbs?'':'disabled'}>Use</button></div><small>Restores 50 HP.</small></div>
    <div class="art"><div class="ah"><b>🧪 Antidote ×${P.antidote}</b><button data-use="anti" ${P.antidote&&P.poison?'':'disabled'}>Use</button></div><small>Cures poison.${P.poison?' <b style="color:#9be39b">You are poisoned.</b>':''}</small></div>
    <div class="sec2">秘籍 Manuals to study</div>${P.manuals.length?P.manuals.map(k=>{const A=ARTS[k];return `<div class="art"><div class="ah"><b>📜 ${A.zh} ${A.n}</b><button data-learn="${k}">Learn</button></div><small>${KIND[A.type]||''} · ${A.desc||''}</small></div>`}).join(''):'<p class="muted">No unread manuals.</p>'}`;
  p.innerHTML=`<div class="hpw"><div class="hpp"><img src="portraits/cut_hero.webp" alt="The hero"></div>
   <div class="hpc"><h3>俠 ${P.name||'The Hero'}</h3>${stat('Level',P.lv)}${stat('XP',P.xp+' / '+xpNeed(P.lv))}${stat('體力 HP',P.hp+' / '+P.hpMax)}${stat('內力',P.mp+' / '+P.mpMax)}${stat('攻擊 Attack',P.atk)}${stat('防衛 Defence',P.def)}${stat('輕功 Agility',P.agi)}${stat('Move',mvOf(P.agi)+' squares')}${stat('Dodge',Math.round(dodgeOf(P.agi)*100)+'%')}${stat('悟性 Talent',P.talent+' (−'+red+'% skill XP)')}${stat('Gold',P.gold)}${stat('Party',['You',...P.party.map(k=>PEOPLE[k].n)].join(', '))}</div>
   <div class="hpr"><div class="tabs"><button data-tab="skills" class="${tab==='skills'?'on':''}">武功 Skills</button><button data-tab="inv" class="${tab==='inv'?'on':''}">包裹 Inventory</button><span class="sp"></span><button id="stClose" class="pri">Close</button></div><div class="hpl">${tab==='skills'?skills:inv}</div></div></div>`;
  p.hidden=false;$s('#stClose').onclick=()=>p.hidden=true;
  p.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>st_heroPanel(b.dataset.tab));
  p.querySelectorAll('[data-eq]').forEach(b=>b.onclick=()=>{P.eq=b.dataset.eq;st_save();st_heroPanel('skills');st_toast('Training: '+ARTS[P.eq].n)});
  p.querySelectorAll('[data-inner]').forEach(b=>b.onclick=()=>{P.inner=b.dataset.inner;st_save();st_heroPanel('skills');st_toast('Active 內功: '+ARTS[P.inner].zh)});
  p.querySelectorAll('[data-use]').forEach(b=>b.onclick=()=>{if(b.dataset.use==='herb'){P.herbs--;P.hp=Math.min(P.hpMax,P.hp+50)}else{P.antidote--;P.poison=0;st_toast('Poison cured')}st_hud();st_save();st_heroPanel('inv')});
  p.querySelectorAll('[data-learn]').forEach(b=>b.onclick=()=>{const k=b.dataset.learn;P.manuals=P.manuals.filter(x=>x!==k);st_learn(k,1);st_save();st_heroPanel('inv')})}
function st_gainManual(k){P.manuals=P.manuals||[];if(ARTS[k].hidden)return;if(!P.arts[k]&&!P.manuals.includes(k)){P.manuals.push(k);st_toast('Manual obtained: '+ARTS[k].n+' — study it in the Hero screen',3200)}}
// ---------- sprites ----------
const IMG={};function st_img(src){if(!IMG[src]){const i=new Image();i.src=src;IMG[src]=i}return IMG[src]}
const st_sheetOf=k=>st_img('sprites/'+k+'.png');
function st_rowsOf(sh){const n=Math.round(sh.naturalHeight/132);return n>=5?{idle:0,run:1,melee:2,ranged:3,fall:4,dash:n>5?5:null,punch:n>6?6:2,kick:n>7?7:2,fly:n>8?8:2,twin:n>9?9:null,xlong:n>10?10:null,shift:n>11?11:null}:{idle:0,run:1,melee:2,ranged:2,fall:3,dash:null}}
// draw cell with feet anchor (90,126) at (x,y); scale k; face 1=right,-1=left
function st_drawCell(c,sh,row,fr,x,y,k,face,alpha){if(!sh.complete||!sh.naturalWidth)return;c.save();c.globalAlpha=alpha==null?1:alpha;c.translate(x,y);c.scale(face*k,k);c.drawImage(sh,fr*192,row*132,192,132,-90,-126,192,132);c.restore()}

// ---------- battle ----------
let B=null;const COLS=14,ROWS=8;let SPD=1;try{SPD=+localStorage.getItem('rtk3_story_spd')||1}catch(e){}
function st_heroArts(){const out=[];for(const k of Object.keys(P.arts)){const A=ARTS[k],a=P.arts[k];if(!A||A.type!=='atk'||a.lv<1)continue;for(const m of MOVES[k]||[k]){const M=ARTS[m];if(!M.unlock||a.lv>=M.unlock)out.push(m)}}return out.concat(['basic'])}
function st_heroUnit(){return {id:'hero',name:P.name||'You',sheet:'f_hero_shu',port:'hero',side:'P',hp:P.hp,hpMax:P.hpMax,mp:P.mp,mpMax:P.mpMax,atk:P.atk,def:P.def,agi:P.agi,mv:mvOf(P.agi),dodge:dodgeOf(P.agi),poison:P.poison||0,arts:st_heroArts(),hero:true,hits:0}}
function st_allyUnit(k){if(k==='xiaoming'){const L=P.lv,agi=44+L;return {id:'xiaoming',name:'Xiao Ming',sheet:'f_xiaoming_shu',port:'xiao_ming',side:'P',hp:70+L*8,hpMax:70+L*8,mp:0,mpMax:0,atk:13+L*2,def:6+L,agi,mv:mvOf(agi),dodge:dodgeOf(agi),arts:['fork']}}}
function st_battle(key){return new Promise(res=>{const D=BATTLES[key];const us=[st_heroUnit(),...P.party.map(st_allyUnit).filter(Boolean)];
  const ppos=[[2,4],[2,3],[2,5],[1,4]];const fs=D.foes();
  let map=null;try{map=genBattleMap('N',D.theme==='river',1000+Math.floor(Math.random()*9000),D.theme)}catch(e){}if(!map||map.length!==ROWS)map=Array.from({length:ROWS},()=>'.'.repeat(COLS));
  B={key,D,map,units:[],turn:'P',sel:null,mode:'idle',res,bg:st_img('art/'+D.bg+'.jpg'),hl:[],t0:performance.now()};
  const place=(u,x,y)=>{let best=null,bd=1e9;for(let X=0;X<COLS;X++)for(let Y=0;Y<ROWS;Y++){if(!st_pass(X,Y)||B.units.some(v=>v.x===X&&v.y===Y))continue;const d=Math.abs(X-x)+Math.abs(Y-y);if(d<bd){bd=d;best=[X,Y]}}[u.x,u.y]=best;B.units.push(u)};
  us.forEach((u,i)=>place(u,...ppos[i]));fs.forEach((u,i)=>place(u,...D.pos[i]));
  $s('#stMap').hidden=true;const cv=$s('#stCv');cv.hidden=false;mus('battle');B.zoom=1;B.panX=0;B.panY=0;B.turnN=1;B.log=[];st_log('Turn 1',1);st_fit();st_gestures(cv);st_tools(true);
  st_toast(D.title,2000);for(const u of B.units){u.done=false;u.ct=Math.random()*25}B.clock=0;B.nextRound=ROUND;st_loop();st_actBar();setTimeout(()=>{st_banner('Battle!',0,'The fastest acts first');setTimeout(st_advance,900)},300)})}
function st_banner(t,en,sub){const b=$s('#stBanner');if(!b)return;b.hidden=true;b.className=en?'en':'';b.innerHTML='<b>'+t+'</b>'+(sub?'<small>'+sub+'</small>':'');void b.offsetWidth;b.hidden=false;clearTimeout(st_banner.h);st_banner.h=setTimeout(()=>b.hidden=true,1400)}
function st_tools(on){const tb=$s('#stTools'),rl=$s('#stRail');tb.hidden=!on;rl.hidden=!on;if(!on){for(const id of ['#stInfo','#stEInfo','#stBl','#stTp','#stTip','#stLog'])$s(id).hidden=true;return}
  $s('#stTurn').textContent=B?B.turnN||1:1;rl.querySelector('[data-r=spd]').textContent='▶ '+SPD+'×';rl.querySelector('[data-r=thr]').classList.toggle('on',!!(B&&B.threat));rl.querySelector('[data-r=auto]').classList.toggle('on',!!(B&&B.auto));
  tb.querySelectorAll('button').forEach(b=>b.onclick=()=>{const z=b.dataset.z;if(!B)return;if(z==='in')st_zoom(B.zoom*1.25);else if(z==='out')st_zoom(B.zoom/1.25);else if(z==='fit'){B.zoom=1;B.panX=0;B.panY=0;st_view()}});
  rl.querySelectorAll('button').forEach(b=>b.onclick=()=>{const r=b.dataset.r;if(!B)return;
    if(r==='thr'){B.threat=!B.threat}else if(r==='spd'){SPD=SPD===1?2:1;try{localStorage.setItem('rtk3_story_spd',SPD)}catch(e){}}
    else if(r==='auto'){B.auto=!B.auto;st_toast(B.auto?'Auto battle on':'Auto battle off');st_autoGo()}
    else if(r==='snd'){try{soundDlg()}catch(e){}}else if(r==='perf'){try{perfSet(!PERF.on)}catch(e){}}
    else if(r==='log'){st_logShow(true)}else if(r==='ret'){st_retreat()}st_tools(true)});
  $s('#stLog [data-r=logx]').onclick=()=>st_logShow(false);$s('#stEndB').onclick=()=>{if(B&&B.turn==='P'&&!B.busy)st_endTurn()}}
function st_log(h,turn){if(!B)return;(B.log=B.log||[]).push({h,turn});if(!$s('#stLog').hidden)st_logShow(true)}
function st_logShow(on){const el=$s('#stLog');el.hidden=!on;if(!on||!B)return;$s('#stLogSub').textContent=(B.D&&B.D.title||'')+' · Turn '+(B.turnN||1);const L=$s('#stLogL');L.innerHTML=(B.log||[]).map(e=>e.turn?`<li class="t">${e.h}</li>`:`<li>${e.h}</li>`).join('');el.scrollTop=el.scrollHeight}
async function st_retreat(){if(!B||B.busy||B.turn!=='P')return st_toast('Wait for your move');const c=await st_say('narr','Retreat from this battle? It counts as a defeat (you lose 20% of your gold).',['Retreat','Keep fighting']);if(c===0&&B){st_log('<b>You retreat.</b>');st_endBattle(false)}}
// AUTO: your side fights by itself (same thinking as the enemy, but picks its best art)
function st_autoGo(){if(!B||!B.auto||B.turn!=='P'||B.busy||!B.act||B.act.side!=='P')return;B.hl=[];st_autoAct(B.act)}
async function st_autoAct(u){if(!B||B.autoBusy===u)return;B.autoBusy=u;B.sel=u;B.mode='idle';st_fcHide();$s('#stInfo').hidden=true;$s('#stTp').hidden=true;
  const arts=u.arts.filter(k=>u.mp>=ARTS[k].mp).sort((a,b)=>ARTS[b].pow-ARTS[a].pow);let best=null;
  for(const t of st_reach(u))for(const k of arts){const op=st_targetsFor(u,k,t);for(const o of op){const sc=o.hit.length*ARTS[k].pow*100-o.hit.reduce((a,h)=>a+h.hp,0)*.2-(ARTS[k].mp||0);if(!best||sc>best.sc)best={t,k,o,sc}}}
  if(best){await st_moveTo(u,best.t[0],best.t[1]);await st_wait(120);const op=st_targetsFor(u,best.k).find(o=>o.hit[0]===best.o.hit[0])||st_targetsFor(u,best.k)[0];if(op){await st_doAttack(u,best.k,op);return}}
  const foes=B.units.filter(v=>v.side!==u.side&&v.hp>0);if(foes.length){const n=foes.sort((a,b)=>(Math.abs(a.x-u.x)+Math.abs(a.y-u.y))-(Math.abs(b.x-u.x)+Math.abs(b.y-u.y)))[0];let bt=null,bd=1e9;for(const t of st_reach(u)){const d=Math.abs(t[0]-n.x)+Math.abs(t[1]-n.y);if(d<bd){bd=d;bt=t}}if(bt)await st_moveTo(u,bt[0],bt[1])}
  await st_wait(120);if(B){u.ctNext=20;st_finish(u)}}
function st_view(){B.T=B.T0*B.zoom;const W=B.cw,H=B.ch,bw=B.T*COLS,bh=B.T*ROWS;let ox=(W-bw)/2+B.panX,oy=(H-bh)/2+B.panY;if(bw>W){ox=Math.min(0+20*B.dp,Math.max(W-bw-20*B.dp,ox))}else ox=(W-bw)/2;if(bh>H){oy=Math.min(8*B.dp,Math.max(H-bh-8*B.dp,oy))}else oy=(H-bh)/2;B.panX=ox-(W-bw)/2;B.panY=oy-(H-bh)/2;B.ox=ox;B.oy=oy}
function st_zoom(z,cx,cy){const oz=B.zoom;z=Math.max(1,Math.min(2.6,z));if(z===oz)return;cx=cx==null?B.cw/2:cx;cy=cy==null?B.ch/2:cy;const bx=(cx-B.ox)/B.T,by=(cy-B.oy)/B.T;B.zoom=z;B.T=B.T0*z;const bw=B.T*COLS,bh=B.T*ROWS;B.panX=(cx-bx*B.T)-(B.cw-bw)/2;B.panY=(cy-by*B.T)-(B.ch-bh)/2;st_view()}
function st_gestures(cv){const pts=new Map();let st=null;
  cv.onpointerdown=e=>{cv.setPointerCapture&&cv.setPointerCapture(e.pointerId);pts.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pts.size===1)st={x:e.clientX,y:e.clientY,px:B.panX,py:B.panY,moved:false,e};else if(pts.size===2){const [a,b]=[...pts.values()];st={pinch:true,d:Math.hypot(a.x-b.x,a.y-b.y),z:B.zoom,moved:true}}};
  cv.onpointermove=e=>{if(!pts.has(e.pointerId)||!st||!B)return;pts.set(e.pointerId,{x:e.clientX,y:e.clientY});const r=cv.getBoundingClientRect();
    if(st.pinch&&pts.size===2){const [a,b]=[...pts.values()],d=Math.hypot(a.x-b.x,a.y-b.y);st_zoom(st.z*d/st.d,((a.x+b.x)/2-r.left)*B.dp,((a.y+b.y)/2-r.top)*B.dp);return}
    const dx=e.clientX-st.x,dy=e.clientY-st.y;if(!st.moved&&Math.hypot(dx,dy)>8)st.moved=true;if(st.moved&&B.zoom>1){B.panX=st.px+dx*B.dp;B.panY=st.py+dy*B.dp;st_view()}};
  const up=e=>{const had=pts.has(e.pointerId);pts.delete(e.pointerId);if(!had||!st)return;if(!st.moved&&!st.pinch&&pts.size===0)st_onTap({clientX:e.clientX,clientY:e.clientY,currentTarget:cv});if(pts.size===0)st=null};
  cv.onpointerup=up;cv.onpointercancel=e=>{pts.delete(e.pointerId);if(!pts.size)st=null};
  cv.onwheel=e=>{e.preventDefault();if(!B)return;const r=cv.getBoundingClientRect();st_zoom(B.zoom*(e.deltaY<0?1.15:1/1.15),(e.clientX-r.left)*B.dp,(e.clientY-r.top)*B.dp)}}
function st_fit(){const cv=$s('#stCv'),r=cv.getBoundingClientRect(),dp=Math.min(2,window.devicePixelRatio||1);cv.width=r.width*dp;cv.height=r.height*dp;B.dp=dp;
  B.cw=cv.width;B.ch=cv.height-56*dp;B.T0=Math.min(B.cw/COLS,(B.ch-8*dp)/ROWS);B.zoom=B.zoom||1;st_view();B.terr=null;st_terr()}
function st_terr(){if(!B||B.terr)return;try{if(typeof mapArtReady==='function'&&!mapArtReady())return;const pm=MAP,pt=window.BTHEME;MAP=B.map;window.BTHEME=B.D.theme;try{B.terr=renderTerrainArt(B.T0*1.6/B.dp)}finally{MAP=pm;window.BTHEME=pt}}catch(e){B.terr=false}}
const st_ter=(x,y)=>B&&B.map&&B.map[y]?B.map[y][x]:'.';const st_pass=(x,y)=>st_ter(x,y)!=='w';const st_tdef=(x,y)=>{try{return (T_INFO[st_ter(x,y)]||{def:1}).def}catch(e){return 1}};
window.addEventListener('resize',()=>{if(B&&!$s('#stCv').hidden)st_fit()});
const st_at=(x,y)=>B.units.find(u=>u.hp>0&&u.x===x&&u.y===y);
const st_inb=(x,y)=>x>=0&&y>=0&&x<COLS&&y<ROWS;
function st_reach(u){const out=[[u.x,u.y]],seen=new Set([u.x+','+u.y]);let fr=[[u.x,u.y,0]];
  while(fr.length){const n=[];for(const [x,y,d] of fr){if(d>=u.mv)continue;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const X=x+dx,Y=y+dy,k=X+','+Y;if(!st_inb(X,Y)||seen.has(k)||!st_pass(X,Y))continue;const o=st_at(X,Y);if(o&&o.side!==u.side)continue;seen.add(k);n.push([X,Y,d+1]);if(!o)out.push([X,Y])}}fr=n}return out}
const DIRS=[[1,0],[-1,0],[0,1],[0,-1]];
function st_targetsFor(u,art,from){const A=ARTS[art],x=from?from[0]:u.x,y=from?from[1]:u.y,foe=o=>o&&o.side!==u.side;const opts=[];
  if(A.shape==='adj'){for(const [dx,dy] of DIRS){const o=st_at(x+dx,y+dy);if(foe(o))opts.push({tiles:[[x+dx,y+dy]],hit:[o],click:[[x+dx,y+dy]]})}}
  else if(A.shape==='kick'){const L=u.hero&&P.arts.star?kickReach(P.arts.star.lv):1;for(const [dx,dy] of DIRS){const tl=[];for(let i=1;i<=L;i++){const X=x+dx*i,Y=y+dy*i;if(!st_inb(X,Y))break;tl.push([X,Y]);const o=st_at(X,Y);if(foe(o)){opts.push({tiles:tl.slice(),hit:[o],click:[[X,Y]],dir:[dx,dy]});break}if(o)break}}}
  else if(A.shape==='aoe'){const N=aoeDepth(u.hero&&P.arts.palm?P.arts.palm.lv:5);for(const [dx,dy] of DIRS){const tl=[],hit=[];for(let i=1;i<=N;i++)for(const w of [-1,0,1]){const X=x+dx*i+(dy?w:0),Y=y+dy*i+(dx?w:0);if(!st_inb(X,Y))continue;tl.push([X,Y]);const o=st_at(X,Y);if(foe(o))hit.push(o)}if(hit.length)opts.push({tiles:tl,hit,click:tl,dir:[dx,dy]})}}
  else if(A.shape==='ring'){const wl=u.hero&&P.arts.star?P.arts.star.lv:3,RD=wl>=5?DIRS.concat([[1,1],[1,-1],[-1,1],[-1,-1]]):DIRS;const hit=[],tl=[];for(const [dx,dy] of RD){const o=st_at(x+dx,y+dy);tl.push([x+dx,y+dy]);if(foe(o))hit.push(o)}if(hit.length)opts.push({tiles:tl.filter(t=>st_inb(t[0],t[1])),hit,click:hit.map(o=>[o.x,o.y])})}
  else if(A.shape==='r2'){for(const o of B.units)if(foe(o)&&o.hp>0&&Math.abs(o.x-x)+Math.abs(o.y-y)<=2)opts.push({tiles:[[o.x,o.y]],hit:[o],click:[[o.x,o.y]]})}
  else{const L=A.shape==='wave'?waveLen(u.hero&&P.arts.palm?P.arts.palm.lv:3):A.shape==='line3'?3:2;for(const [dx,dy] of DIRS){const tl=[],hit=[];for(let i=1;i<=L;i++){const X=x+dx*i,Y=y+dy*i;if(!st_inb(X,Y))break;tl.push([X,Y]);const o=st_at(X,Y);if(foe(o))hit.push(o)}if(hit.length)opts.push({tiles:tl,hit,click:tl,dir:[dx,dy]})}}
  return opts}
function st_fanLayout(a){const bs=[...a.children];if(!bs.length)return;
  const W=Math.min(innerWidth,innerHeight)<440?1:0,BIG=W?62:74,SM=W?48:56,R1=W?78:94,R2=W?132:158,R3=W?184:220,C=BIG/2;
  const wait=bs.find(b=>b.dataset.a==='wait'),rest=bs.filter(b=>b!==wait);const sig=bs.map(b=>b.dataset.a+(b.disabled?0:1)).join()+'|'+(B&&B.sel&&B.sel.id);const same=a._sig===sig;a._sig=sig;if(same)bs.forEach(b=>b.style.animation='none');
  if(wait){wait.classList.add('big');Object.assign(wait.style,{left:'0px',top:'0px',width:BIG+'px',height:BIG+'px'})}
  const rings=[[R1,[45,0,90]],[R2,null],[R3,null]];let i=0,d=0;
  for(const [R,fixed] of rings){if(i>=rest.length)break;const cap=fixed?3:R===R2?4:5,n=Math.min(cap,rest.length-i);
    const angs=fixed?fixed.slice(0,n):Array.from({length:n},(_,j)=>n===1?45:(cap===4?11.25+22.5*j+(4-n)*11.25:9+18*j+(5-n)*9));
    for(const ang of angs){const b=rest[i++],t=ang*Math.PI/180,x=C-R*Math.cos(t),y=C-R*Math.sin(t);
      Object.assign(b.style,{left:(x-SM/2)+'px',top:(y-SM/2)+'px',width:SM+'px',height:SM+'px',animationDelay:(d++*25)+'ms'})}}}
const SHORT={basic:['攻','Attack'],palm:['掌','Dragon Palm'],wave:['悔','Dragon Regret'],sea:['海','From the Sea'],chain:['連','Chain Kick'],green:['青','Green Qi'],tiger:['虎','Tiger Fist'],whirl:['旋','Whirlwind'],star:['星','Star Kick']};
function st_actBar(){const a=$s('#stAct'),bl=$s('#stBl'),tp=$s('#stTp');$s('#stTip').hidden=true;
  if(!B||B.turn!=='P'||B.busy){a.hidden=true;bl.hidden=true;tp.hidden=true;return}
  const u=B.sel;
  if(B.mode==='target'){a.hidden=true;bl.hidden=true;tp.innerHTML=`<div class="skhint"><span>${B.opts&&B.opts.some(o=>o.dir)?'Pick a direction.':'Select a target in range.'}</span><button data-a="cancel">Cancel</button></div>`;tp.hidden=false;
    tp.querySelector('button').onclick=()=>{B.mode='act';B.hl=[];B.pendOpt=null;$s('#stInfo').hidden=true;$s('#stEInfo').hidden=true;st_actBar()};return}
  tp.hidden=true;
  if(!u||B.mode==='idle'||B.mode==='move'){a.hidden=true;a.innerHTML='';bl.hidden=!!(u&&B.mode==='move'&&false);bl.hidden=false;return}
  if(B.mode==='act'){bl.hidden=true;
    const btn=(k,zh,l,cls,dis,badge)=>`<button class="rbtn ${cls}" data-a="${k}" ${dis?'disabled':''}><span class="rzh">${zh}</span><span class="rl">${l}</span>${badge!=null?`<i class="cdb">${badge}</i>`:''}</button>`;
    let h=u.arts.map(k=>{const A=ARTS[k],ok=u.mp>=A.mp&&st_targetsFor(u,k).length,sh=SHORT[k]||[A.zh[0],A.n];return btn(k,sh[0],sh[1],k==='basic'||!u.hero?'atk':'sk hero',!ok,A.mp||null)}).join('');
    if(u.hero&&P.herbs)h+=btn('herb','藥','Herb','sk',u.hp>=u.hpMax,P.herbs);
    if(u.poison&&P.antidote)h+=btn('anti','解','Antidote','sk',false,P.antidote);
    h+=btn('back','返','Undo','cancel',false)+btn('wait','待','Wait','',false);
    a.innerHTML=h;a.hidden=false;st_fanLayout(a);a.querySelectorAll('button').forEach(b=>b.onclick=e=>{if(a._lp){a._lp=0;return}st_chooseArt(b.dataset.a)});st_tipWire(a);return}
  a.hidden=true;bl.hidden=true}
function st_tipWire(a){const tip=$s('#stTip');let lt=null;a.onpointerdown=e=>{const b=e.target.closest('[data-a]');if(!b||!ARTS[b.dataset.a]&&!['herb','anti'].includes(b.dataset.a))return;clearTimeout(lt);lt=setTimeout(()=>{a._lp=1;const k=b.dataset.a,A=ARTS[k],u=B&&B.sel;
    if(A){const lv=u&&u.hero?(P.arts[A.sub||k]||{lv:1}).lv:1;tip.innerHTML=`<div class="tth"><b>${A.zh}</b><span>${A.n}</span></div><div class="ttm"><span>內力</span><em>${A.mp?A.mp+' (you have '+(u?u.mp:0)+')':'free'}</em>${u&&u.hero?`<span>Level</span><em>${lv}${A.maxLv?' / '+A.maxLv:''}</em>`:''}</div><p>${A.desc||''}</p>`}
    else tip.innerHTML=k==='herb'?`<div class="tth"><b>草藥</b><span>Herb</span></div><div class="ttm"><span>Left</span><em>${P.herbs}</em></div><p>Restores 50 HP. Uses his action.</p>`:`<div class="tth"><b>解毒丹</b><span>Antidote</span></div><div class="ttm"><span>Left</span><em>${P.antidote}</em></div><p>Cures poison. Uses his action.</p>`;
    tip.hidden=false},450)};
  const end=()=>{clearTimeout(lt);if(a._lp)setTimeout(()=>{tip.hidden=true;a._lp=0},1800)};a.onpointerup=end;a.onpointercancel=end;a.onpointerleave=end;a.oncontextmenu=e=>e.preventDefault()}
function st_onTap(e){if(!B||B.turn!=='P'||B.busy)return;const r=e.currentTarget.getBoundingClientRect(),px=(e.clientX-r.left)*B.dp,py=(e.clientY-r.top)*B.dp;
  const x=Math.floor((px-B.ox)/B.T),y=Math.floor((py-B.oy)/B.T);if(!st_inb(x,y))return;const o=st_at(x,y);if(!(o&&o.side==='E')){if(B.pendFor){B.pendFor=null;B.pend=null;if(B.mode==='idle')B.hl=[]}st_fcHide();$s('#stEInfo').hidden=true}else{st_info(o,null,1);if(B.sel&&B.mode!=='idle')st_info(B.sel)}
  if(o&&o.side==='P')st_info(o);else if(!o&&B.mode!=='target'){$s('#stInfo').hidden=true;if(B.mode==='idle'){const tt=st_ter(x,y),td=st_tdef(x,y);st_toast((TNAME[tt]||'Plain')+(tt==='w'?' · impassable':td!==1?' · damage taken ×'+(1/td).toFixed(2):''),1200)}}
  if((B.mode==='idle'||B.mode==='move'||B.mode==='act')&&o&&o.side==='E'){st_quickHit(o);return}
  if(B.mode==='idle'||B.mode==='move'){
    if(o&&o===B.act&&(B.mode==='idle'||o!==B.sel)){B.sel=o;B.mode='move';B.orig=[o.x,o.y];B.hl=st_reach(o).map(t=>({t,c:'mv'}));st_actBar();return}
    if(B.mode==='move'&&B.hl.some(h=>h.t[0]===x&&h.t[1]===y)){const u=B.sel;st_moveTo(u,x,y).then(()=>{B.mode='act';B.hl=[];st_actBar()});return}
    return}
  if(B.mode==='target'){const opt=B.opts.find(op=>op.dir&&B.sel&&B.sel.x+op.dir[0]===x&&B.sel.y+op.dir[1]===y)||B.opts.find(op=>op.click.some(t=>t[0]===x&&t[1]===y));if(!opt)return;if(B.pendOpt===opt){B.pendOpt=null;$s('#stInfo').hidden=true;st_doAttack(B.sel,B.art,opt);return}
    B.pendOpt=opt;B.hl=opt.tiles.map(t=>({t,c:'tg'}));if(opt.hit[0])st_info(opt.hit[0],null,1);const A=ARTS[B.art],el=$s('#stInfo');el.innerHTML=`<div class="ibody skc"><div class="skn"><b>${A.zh}</b> <span>${A.n}</span></div><div class="skb"><button class="pri" data-go>Use</button><button data-no>Cancel</button></div></div>`;el.hidden=false;el.querySelector('[data-go]').onclick=()=>{B.pendOpt=null;el.hidden=true;st_doAttack(B.sel,B.art,opt)};el.querySelector('[data-no]').onclick=()=>{B.pendOpt=null;st_tgView()}}}
const st_innerLv=k=>P&&P.inner===k&&P.arts[k]?P.arts[k].lv:0;
const st_dealMul=u=>u.hero&&st_innerLv('xiaowu')?1.08+.02*(st_innerLv('xiaowu')-1):1,st_takeMul=t=>t.hero&&st_innerLv('jiuyang')?1-(.08+.02*(st_innerLv('jiuyang')-1)):1;
function st_est(u,k,t){const A=ARTS[k],lv=u.hero?(P.arts[A.sub||k]||{lv:1}).lv:1,hn=A.hits||1,base=Math.max(1,(u.atk*A.pow*(1+.08*(lv-1))*st_dealMul(u)-t.def*.6)/st_tdef(t.x,t.y))*hn;return {lo:Math.max(1,Math.round(base*.9)),hi:Math.max(1,Math.round(base*1.1)),hit:Math.round((1-t.dodge)*100)}}
const TNAME={'.':'Plain','f':'Forest','h':'Hill','w':'River','=':'Bridge','p':'Road','c':'Fort'};
function st_face(k,sz){const z=1.7*(sz||84)/84;return k?`background:#3a2c1c url(sprites/${k}.png) ${-72*z}px ${-8*z}px/${4608*z}px auto no-repeat`:''}
function st_info(u,fc,side){const el=$s(side?'#stEInfo':'#stInfo');if(!u){el.hidden=true;if(!side)$s('#stEInfo').hidden=true;return}const td=st_tdef(u.x,u.y);
  const fu=u.port?'background:#2a241b url(portraits/'+u.port+'.webp) 50% 4%/150% auto no-repeat':st_face(u.sheet);const pt=fu?`<div class="ip" style="${fu}"></div>`:`<div class="ip">${(u.name||'?')[0]}</div>`;
  const bar=(v,m,c,t)=>`<div class="ibr"><b>${t}</b><div class="ib"><i style="width:${Math.round(100*clamp01(v/m))}%;background:${c}"></i><span>${v} / ${m}</span></div></div>`;
  let h=`<div class="ih">${pt}<div class="ir"><div class="inm">${u.name} <small>Lv ${u.lv||1}</small></div>${bar(u.hp,u.hpMax,u.side==='P'?'linear-gradient(180deg,#c4ffae,#4fdc4f 50%,#169a2c)':'linear-gradient(180deg,#ffb8a6,#ff4a36 50%,#a8180e)','HP')}${u.mpMax?bar(u.mp,u.mpMax,'linear-gradient(180deg,#bfe3ff,#3fa0ff 50%,#1a5fc0)','內力'):''}<div class="ist">Atk ${u.atk} · Def ${u.def} · Mv ${u.mv} · Dodge ${Math.round(u.dodge*100)}%${u.stun?' · stunned':''}${u.poison?' · poisoned':''}${td!==1?' · dmg ×'+(1/td).toFixed(2):''}</div></div></div><small>${u.arts.map(k=>ARTS[k].n).join(', ')}</small>`;
  if(fc)h+=fc;el.innerHTML='<div class="ibody">'+h+'</div>';el.hidden=false;const cb=el.querySelector('[data-go]');if(cb)cb.onclick=()=>{const f=B.pend;B.pend=null;el.hidden=true;if(f)f()}}
function st_fcHtml(u,k,hits){return `<div class="fc"><b>${ARTS[k].zh} ${ARTS[k].n}</b>${ARTS[k].mp?' · '+ARTS[k].mp+' 內力':''}${hits.map(t=>{const e=st_est(u,k,t),a=Math.max(0,t.hp-e.hi),b=Math.max(0,t.hp-e.lo),m=t.hpMax||1,fu=t.port?'background:#2a241b url(portraits/'+t.port+'.webp) 50% 4%/150% auto no-repeat':st_face(t.sheet,44);return `<div class="ftr"><div class="fp" style="${fu}"></div><div class="fr2"><div class="fn"><span>${t.name}</span><span>${e.hit}% hit</span></div><div class="ib"><i style="width:${Math.round(100*clamp01(a/m))}%;background:linear-gradient(180deg,#ffb8a6,#ff4a36 50%,#a8180e)"></i><i class="fl" style="left:${Math.round(100*clamp01(a/m))}%;width:${Math.round(100*clamp01((t.hp-a)/m))}%"></i><span>HP ${t.hp} → <em>${a===b?a:a+'-'+b}</em></span></div></div></div>`}).join('')}<button class="pri" data-go>Attack</button></div>`}
function st_fcShow(u,k,hits){let el=$s('#stFc');if(!el){el=document.createElement('div');el.id='stFc';$s('#stCv').parentNode.appendChild(el)}
  const A=ARTS[k],t=hits[0],e=st_est(u,k,t),a=Math.max(0,t.hp-e.hi),b=Math.max(0,t.hp-e.lo);
  const face=v=>`<div class="fp" style="${v.port?'background:#2a241b url(portraits/'+v.port+'.webp) 50% 4%/150% auto no-repeat':st_face(v.sheet,76)}"></div>`;
  const row=(lab,v0,v1,m,c,txt)=>`<div class="fbr"><b>${lab}</b><div class="fbar"><i style="width:${Math.round(100*clamp01(v1/m))}%;background:${c}"></i>${v1<v0?`<i class="fl" style="left:${Math.round(100*clamp01(v1/m))}%;width:${Math.round(100*clamp01((v0-v1)/m))}%"></i>`:''}<span>${txt}</span></div></div>`;
  const G='linear-gradient(180deg,#c4ffae,#4fdc4f 50%,#169a2c)',Rd='linear-gradient(180deg,#ffb8a6,#ff4a36 50%,#a8180e)',Bl='linear-gradient(180deg,#bfe3ff,#3fa0ff 50%,#1a5fc0)';
  el.innerHTML=`<div class="fs fr">${face(u)}<div class="fi"><div class="fnm"><span>${u.name}</span></div>${row('HP',u.hp,u.hp,u.hpMax,G,u.hp+' / '+u.hpMax)}${u.mpMax?row('內力',u.mp,u.mp-A.mp,u.mpMax,Bl,A.mp?`${u.mp} → <em>${u.mp-A.mp}</em>`:u.mp+' / '+u.mpMax):''}</div></div>
  <div class="fvs"><i>${A.zh}</i>VS<small>${e.hit}% hit</small></div>
  <div class="fs fo">${face(t)}<div class="fi"><div class="fnm"><span>${t.name}${hits.length>1?` <small>+${hits.length-1}</small>`:''}</span></div>${row('HP',t.hp,a,t.hpMax,Rd,`${t.hp} → <em>${a===b?a:a+'-'+b}</em>`)}</div></div>
  <div class="fbtn"><button class="go" data-go>攻 Attack</button><button data-no>Cancel</button></div>`;
  el.hidden=false;$s('#stAct').hidden=true;$s('#stBl').hidden=true;el.querySelector('[data-go]').onclick=()=>{const f=B.pend;B.pend=null;B.pendFor=null;el.hidden=true;if(f)f()};
  el.querySelector('[data-no]').onclick=()=>{B.pend=null;B.pendFor=null;el.hidden=true;$s('#stEInfo').hidden=true;if(B.mode==='idle')B.hl=[];st_actBar()}}
function st_fcHide(){const el=$s('#stFc');if(el&&!el.hidden){el.hidden=true;if(B&&!B.busy)st_actBar()}}
function st_quickHit(o){const u=B.act&&B.act.side==='P'?B.act:null;if(!u)return;
  const hits=(from)=>{for(const k of u.arts){const A=ARTS[k];if(u.mp<A.mp)continue;const op=st_targetsFor(u,k,from).find(op=>op.hit.includes(o));if(op)return {k,op}}return null};
  if(B.pendFor===o&&B.pend){const f=B.pend;B.pend=null;B.pendFor=null;st_fcHide();f();return}
  if(B.mode==='act'){const h=hits();if(h){B.pendFor=o;B.pend=()=>{B.sel=u;st_doAttack(u,h.k,h.op)};st_info(u);st_info(o,null,1);st_fcShow(u,h.k,h.op.hit)}else{st_info(o);st_toast('Out of reach')}return}
  let best=null;for(const t of st_reach(u)){const h=hits(t);if(h){const d=Math.abs(t[0]-u.x)+Math.abs(t[1]-u.y);if(!best||d<best.d)best={t,d,h}}}
  if(!best){st_info(o);return st_toast(u.name+' cannot reach '+o.name+' this turn')}
  B.pendFor=o;B.hl=[{t:best.t,c:'mv'},{t:[o.x,o.y],c:'tg'}];B.pend=()=>{B.pendFor=null;B.sel=u;B.hl=[];$s('#stAct').hidden=true;B.busy=true;st_moveTo(u,best.t[0],best.t[1]).then(()=>{B.busy=false;const h=hits();if(h)st_doAttack(u,h.k,h.op);else{B.mode='act';st_actBar()}})};
  st_info(u);st_info(o,null,1);st_fcShow(u,best.h.k,best.h.op.hit)}
function st_path(u,x,y){const key=(a,b)=>a+','+b,prev=new Map([[key(u.x,u.y),null]]);let fr=[[u.x,u.y]];
  while(fr.length&&!prev.has(key(x,y))){const n=[];for(const [cx,cy] of fr)for(const [dx,dy] of DIRS){const X=cx+dx,Y=cy+dy,k=key(X,Y);if(!st_inb(X,Y)||prev.has(k)||!st_pass(X,Y))continue;const o=st_at(X,Y);if(o&&o.side!==u.side)continue;prev.set(k,[cx,cy]);n.push([X,Y])}fr=n}
  if(!prev.has(key(x,y)))return [[x,y]];const out=[];let c=[x,y];while(c&&!(c[0]===u.x&&c[1]===u.y)){out.unshift(c);c=prev.get(key(c[0],c[1]))}return out}
async function st_moveTo(u,x,y){if(u.x===x&&u.y===y)return;const steps=st_path(u,x,y);
  for(const [X,Y] of steps){const fx=u.x,fy=u.y;await new Promise(res=>{u.anim={k:'run',t0:performance.now(),dur:150,fx,fy};u.face=X<fx?-1:X>fx?1:u.face;u.x=X;u.y=Y;setTimeout(res,150)})}u.anim=null}
function st_chooseArt(k){const u=B.sel;
  if(k==='back'){if(B.orig){u.x=B.orig[0];u.y=B.orig[1]}B.mode='move';B.hl=st_reach(u).map(t=>({t,c:'mv'}));st_actBar();return}
  if(k==='wait'){u.ctNext=ctAfter('wait',(B.orig&&(u.x!==B.orig[0]||u.y!==B.orig[1])));st_finish(u);return}
  if(k==='anti'){P.antidote--;u.poison=0;st_toast('Poison cured');st_finish(u);return}
  if(k==='herb'){P.herbs--;u.hp=Math.min(u.hpMax,u.hp+50);st_toast('+50 HP');st_finish(u);return}
  B.art=k;B.pendOpt=null;B.opts=st_targetsFor(u,k);B.mode='target';st_tgView();st_actBar()}
function st_tgView(){B.hl=[];for(const op of B.opts)if(!op.dir)for(const t of op.hit.length?op.hit.map(o=>[o.x,o.y]):op.tiles)B.hl.push({t,c:'tg2'});$s('#stInfo').hidden=true}
function st_beitian(t){if(!st_innerLv('beitian'))return 0;const bl=st_innerLv('beitian');t.hits=(t.hits||0)+1;if(t.hits<(bl>=7?2:3))return 0;t.hits=0;P.mpMax+=1;t.mpMax+=1;const g=Math.round(t.mpMax*(.10+.01*(bl-1)));t.mp=Math.min(t.mpMax,t.mp+g);st_log(`<b>You</b> · 北天神功 draws in power: max 內力 +1, +${g} 內力`);st_toast('北天神功: max 內力 +1, +'+g+' 內力',1800);return g}
function st_finish(u){if(!B)return;if(B.autoBusy===u)B.autoBusy=null;u.done=true;B.sel=null;B.mode='idle';B.hl=[];B.act=null;u.ct=u.ctNext!=null?u.ctNext:0;u.ctNext=null;st_actBar();st_checkEnd();if(B&&!B.ended)st_advance()}
// ---------- ATB: every unit's 輕功 bar fills; full bar = that unit acts ----------
const ROUND=100/60,CT={atk:0,move:20,wait:50,heavy:-20,basic:10},ctAfter=(k,moved)=>k==='wait'?(moved?CT.move:CT.wait):CT[k],enemyCt=(r,moved)=>r==='atk'?ctAfter('atk'):ctAfter('wait',moved);
function st_fill(u,us){const mn=Math.min(...us.map(v=>10+v.agi));return Math.min(10+u.agi,3*mn)}
function st_predict(n){const us=B.units.filter(u=>u.hp>0);const ct=new Map(us.map(u=>[u,u===B.act?0:u.ct]));const out=B.act?[B.act]:[];
  for(let g=0;g<64&&out.length<n;g++){let dt=1e9;for(const u of us)dt=Math.min(dt,Math.max(0,(100-ct.get(u))/st_fill(u,us)));for(const u of us)ct.set(u,ct.get(u)+st_fill(u,us)*dt);
    const nx=us.filter(u=>ct.get(u)>=100-1e-6).sort((a,b)=>ct.get(b)-ct.get(a)||(a.side==='P'?-1:1))[0];if(!nx)break;out.push(nx);ct.set(nx,0)}return out}
function st_order(){const el=$s('#stOrder');if(!el)return;if(!B){el.hidden=true;return}const L=st_predict(8);
  el.innerHTML=L.map((u,i)=>{const f=u.port?`background-image:url(portraits/${u.port}.webp)`:st_face(u.sheet,34);return `<i class="${u.side==='P'?'p':'e'}${i===0?' now':''}" style="${f}" title="${u.name}">${i===0?'<b>NOW</b>':''}</i>`}).join('');el.hidden=false}
async function st_advance(){if(!B||B.ended)return;const us=B.units.filter(u=>u.hp>0);if(!us.length)return;
  let dt=Math.min(...us.map(u=>Math.max(0,(100-u.ct)/st_fill(u,us))));for(const u of us)u.ct+=st_fill(u,us)*dt;B.clock+=dt;
  while(B.clock>=B.nextRound){B.nextRound+=ROUND;B.turnN=(B.turnN||1)+1;$s('#stTurn').textContent=B.turnN;st_log('Turn '+B.turnN,1);
    for(const u of us){if(u.poison&&u.hp>0){u.hp=Math.max(1,u.hp-6);u.poison--}if(u.hero)u.mp=Math.min(u.mpMax,u.mp+4)}}
  const u=us.filter(v=>v.ct>=100-1e-6).sort((a,b)=>b.ct-a.ct||(a.side==='P'?-1:1))[0];if(!u)return st_advance();
  B.act=u;u.done=false;st_order();
  if(u.stun){u.stun=0;st_log(`${u.name} is stunned and loses the move`);st_toast(u.name+' is stunned',1000);await st_wait(500/SPD);u.ctNext=0;return st_finish(u)}
  if(u.side==='E'){B.turn='E';B.lastSide='E';st_actBar();await st_wait(350/SPD);if(!B)return;const ox=u.x,oy=u.y,r=await st_enemyAct(u);if(!B)return;u.ctNext=enemyCt(r,u.x!==ox||u.y!==oy);st_checkEnd();if(B&&!B.ended)st_finish(u);return}
  B.turn='P';if(B.lastSide!=='P')st_banner(u.hero?'Your move':u.name,0,'Turn '+(B.turnN||1));B.lastSide='P';
  if(B.auto){st_autoAct(u);return}
  B.sel=u;B.mode='move';B.orig=[u.x,u.y];B.hl=st_reach(u).map(t=>({t,c:'mv'}));st_info(u);st_actBar();st_tools(true)}
async function st_doAttack(u,k,opt){B.busy=true;$s('#stTp').hidden=true;$s('#stTip').hidden=true;if(u.hero&&k!=='basic'&&typeof cutIn==='function'){try{await cutIn({id:'hero',name:u.name},{zh:ARTS[k].zh,n:ARTS[k].n})}catch(e){}}$s('#stAct').hidden=true;$s('#stEInfo').hidden=true;B.hl=[];const A=ARTS[k];u.mp-=A.mp;
  const res=opt.hit.map(t=>{const lv=u.hero?(P.arts[A.sub||k]||{lv:1}).lv:1,hs=[];let crit=false;
    for(let h=0;h<(A.hits||1);h++){if(Math.random()<t.dodge){hs.push(0);continue}const c1=Math.random()<.08;crit=crit||c1;hs.push(Math.max(1,Math.round((u.atk*A.pow*(1+.08*(lv-1))*st_dealMul(u)-t.def*.6)*rnd(.9,1.1)*(c1?1.5:1)/st_tdef(t.x,t.y))))}
    const dmg=hs.reduce((a,b)=>a+b,0);return {t,dodge:dmg===0,dmg,crit,hits:A.hits?hs:null}});
  const pushP=A.shape==='ring'&&u.hero&&P.arts.star?(P.arts.star.lv>=10?.6:P.arts.star.lv>=7?.4:0):0;
  if(pushP)for(const r of res){const dx=Math.sign(r.t.x-u.x),dy=Math.sign(r.t.y-u.y),X=r.t.x+dx,Y=r.t.y+dy;if(!r.dodge&&r.t.hp-r.dmg>0&&Math.random()<pushP&&st_inb(X,Y)&&st_pass(X,Y)&&!st_at(X,Y))r.push=[X,Y]}
  await st_fightScene(u,A,res);if(!B)return;st_log(`<b>${u.name}</b> · ${A.zh} ${A.n}: `+res.map(r=>`${r.t.name} ${r.dodge?'dodges':'−'+r.dmg+(r.crit?' (critical)':'')+(r.t.hp-r.dmg<=0?' — defeated':'')}`).join(', '));
  for(const r of res){if(!r.dodge){r.t.hp=Math.max(0,r.t.hp-r.dmg);if(r.t.hp<=0&&r.t.side==='E'&&u.side==='P'){B.xp=(B.xp||0)+r.t.xp}}}
  if(A.pass&&opt.dir){const t0=opt.hit[0],bx=t0.x+opt.dir[0],by=t0.y+opt.dir[1];const free=(X,Y)=>st_inb(X,Y)&&st_pass(X,Y)&&!st_at(X,Y);let land=null;if(free(bx,by))land=[bx,by];else{let bd=1e9;for(const [dx,dy] of DIRS){const X=t0.x+dx,Y=t0.y+dy;if(!free(X,Y))continue;const d=Math.abs(X-bx)+Math.abs(Y-by)+(dx===-opt.dir[0]&&dy===-opt.dir[1]?.5:0);if(d<bd){bd=d;land=[X,Y]}}}if(land){u.x=land[0];u.y=land[1];u.face=opt.dir[0]?opt.dir[0]:u.face}}
  for(const r of res)if(r.push&&r.t.hp>0&&!st_at(r.push[0],r.push[1])){r.t.x=r.push[0];r.t.y=r.push[1]}
  if(A.stun){for(const r of res)if(r.t.hp>0&&!r.dodge&&Math.random()<A.stun){r.t.stun=1;st_toast(r.t.name+' is stunned!')}}
  if(A.kb&&opt.dir){for(const r of res)if(r.t.hp>0&&!r.dodge){const X=r.t.x+opt.dir[0],Y=r.t.y+opt.dir[1];if(st_inb(X,Y)&&!st_at(X,Y)){r.t.x=X;r.t.y=Y}}}
  u.ctNext=ctAfter(A.heavy?'heavy':k==='basic'?'basic':'atk');B.busy=false;st_finish(u)}
function st_checkEnd(){if(!B)return;const pe=B.units.filter(v=>v.side==='P'&&v.hp>0),ee=B.units.filter(v=>v.side==='E'&&v.hp>0),hero=B.units.find(v=>v.hero);
  if(!ee.length)return st_endBattle(true);if(hero.hp<=0||!pe.length)return st_endBattle(false)}
async function st_endTurn(){if(!B||!B.act||B.act.side!=='P'||B.busy)return;st_fcHide();$s('#stEInfo').hidden=true;const u=B.act;u.ctNext=ctAfter('wait',(B.orig&&(u.x!==B.orig[0]||u.y!==B.orig[1])));B.pend=null;B.pendFor=null;st_finish(u)}
async function st_enemyAct(e){const k=e.arts[0],ps=B.units.filter(v=>v.side==='P'&&v.hp>0);if(!ps.length)return;
  let best=null;for(const t of st_reach(e)){const op=st_targetsFor(e,k,t);if(op.length){const sc=-(op[0].hit[0].hp)+(op[0].hit[0].hero?15:0);if(!best||sc>best.sc)best={t,sc}}}
  if(best){await st_moveTo(e,best.t[0],best.t[1]);await st_wait(150);const op=st_targetsFor(e,k)[0];if(op){B.busy=true;await st_doAttackE(e,k,op);B.busy=false;return 'atk'}return 'move'}
  // approach nearest
  const near=ps.sort((a,b)=>(Math.abs(a.x-e.x)+Math.abs(a.y-e.y))-(Math.abs(b.x-e.x)+Math.abs(b.y-e.y)))[0];
  let bt=null,bd=1e9;for(const t of st_reach(e)){const d=Math.abs(t[0]-near.x)+Math.abs(t[1]-near.y);if(d<bd){bd=d;bt=t}}if(bt)await st_moveTo(e,bt[0],bt[1]);await st_wait(120)}
async function st_doAttackE(e,k,opt){const A=ARTS[k];const dz=P.arts.douzhuan,xl=P.arts.xianglong;const res=opt.hit.map(t=>{const base=Math.max(1,Math.round((e.atk*A.pow-t.def*.6)*rnd(.9,1.1)/st_tdef(t.x,t.y)));
    if(t.hero&&dz&&dz.lv>=1&&t.mp>=ARTS.douzhuan.mp&&Math.random()<.10+.02*(dz.lv-1)){t.mp-=ARTS.douzhuan.mp;const dmg=Math.max(0,Math.round(base*(.60-.03*(dz.lv-1))));return {t,dodge:false,dmg,guard:'shift',ret:Math.max(1,base-dmg),base}}
    if(t.hero&&xl&&xl.lv>=1&&Math.random()<.15+.03*(xl.lv-1)){const dmg=Math.max(0,Math.round(base*(.40-.025*(xl.lv-1))));return {t,dodge:false,dmg,guard:'dragon',drop:base-dmg,base}}
    const dodge=Math.random()<t.dodge;return {t,dodge,dmg:dodge?0:base}});
  await st_fightScene(e,A,res);if(!B)return;st_log(`<b style="color:#ff9a8a">${e.name}</b> · ${A.zh} ${A.n}: `+res.map(r=>`${r.t.name} ${r.dodge?'dodges':'−'+r.dmg+(r.guard==='dragon'?` (降龍手 stops ${r.drop})`:r.guard==='shift'?` (天轉星移 returns ${r.ret})`:'')+(r.t.hp-r.dmg<=0?' — falls':'')}`).join(', '));
  for(const r of res)if(!r.dodge){r.dmg=Math.round(r.dmg*st_takeMul(r.t));r.t.hp=Math.max(0,r.t.hp-r.dmg);if(r.t.hero&&r.dmg>0)st_beitian(r.t);if(!r.guard&&A.poison&&r.t.hp>0&&Math.random()<A.poison){r.t.poison=3;st_toast(r.t.name+' is poisoned!')}}
  for(const r of res){if(r.guard!=='shift')continue;e.hp=Math.max(0,e.hp-r.ret);let ex='';if(dz.lv>=5&&e.hp>0){if(A.poison){e.poison=3;ex=' · poisoned by its own bell'}if(A.stun&&Math.random()<A.stun){e.stun=1;ex+=' · stunned'}}
    st_log(`<b>You</b> · 天轉星移: ${e.name} takes back −${r.ret}${ex}${e.hp<=0?' — defeated':''}`);if(e.hp<=0)B.xp=(B.xp||0)+(e.xp||0)}}
async function st_endBattle(win){const b=B;if(b.ended)return;b.ended=true;await st_wait(500);
  const hero=b.units.find(v=>v.hero);P.hp=Math.max(1,Math.min(P.hpMax,hero.hp));P.mp=Math.min(P.mpMax,hero.mp);P.poison=hero.poison||0;
  if(win){const xp=(b.xp||0);P.xp+=xp;st_toast('Victory! +'+xp+' XP',2200);
    {const a=P.arts[P.eq];if(a){if(a.xp==null)a.xp=0;a.xp+=Math.floor(xp/2);const A=ARTS[P.eq];while(a.lv<(A.maxLv||10)&&a.xp>=skillNeed(a.lv)){a.xp-=skillNeed(a.lv);a.lv++;if(A.agi)P.agi+=A.agi;await st_wait(400);st_toast(A.zh+' '+A.n+' rises to level '+a.lv+(A.agi?' · 輕功 +'+A.agi:''),2400);const un=(MOVES[P.eq]||[]).find(m=>ARTS[m].unlock===a.lv);if(un){await st_wait(2500);st_toast('New move: '+ARTS[un].zh+' '+ARTS[un].n,3000)}}if(a.lv>=(A.maxLv||10))a.xp=0}}
    while(P.lv<30&&P.xp>=xpNeed(P.lv)){P.xp-=xpNeed(P.lv);P.lv++;P.hpMax+=14;P.mpMax+=6;P.atk+=3;P.def+=2;P.agi+=1;P.hp=P.hpMax;P.mp=P.mpMax;await st_wait(300);st_toast('Level up! Level '+P.lv,2400);snd('victory');
    }}
  else{P.gold=Math.floor(P.gold*.8);P.hp=P.hpMax;P.mp=P.mpMax;}
  B=null;$s('#stCv').hidden=true;$s('#stAct').hidden=true;st_tools(false);$s('#stOrder').hidden=true;st_hud();st_save();
  if(!win&&b.key!=='spar'){await st_say('narr','Everything goes dark... You wake at the inn in Zhuo Village, bandaged and lighter of purse.');st_showMap()}
  b.res(win)}

function st_threat(){const S=new Set();for(const e of B.units){if(e.side!=='E'||e.hp<=0)continue;const A=ARTS[e.arts[0]],r=A.shape==='r2'?2:1;for(const [x,y] of st_reach(e)){for(let dx=-r;dx<=r;dx++)for(let dy=-r;dy<=r;dy++){if(Math.abs(dx)+Math.abs(dy)>r||(!dx&&!dy))continue;const X=x+dx,Y=y+dy;if(st_inb(X,Y))S.add(X+','+Y)}}}return S}
// ---------- board render ----------
function st_loop(){if(!B)return;const cv=$s('#stCv');if(cv.hidden){requestAnimationFrame(st_loop);return}const c=cv.getContext('2d'),now=performance.now(),T=B.T;
  c.fillStyle='#1d1a14';c.fillRect(0,0,cv.width,cv.height);if(!B.terr&&B.terr!==false)st_terr();
  if(B.terr)c.drawImage(B.terr,B.ox,B.oy,T*COLS,T*ROWS);else{c.fillStyle='#5a7a3a';c.fillRect(B.ox,B.oy,T*COLS,T*ROWS);for(let x=0;x<COLS;x++)for(let y=0;y<ROWS;y++){const tt=st_ter(x,y);if(tt!=='.'){c.fillStyle=tt==='w'?'#3a6a9a':tt==='f'?'#2f5a2a':tt==='h'?'#7a6a4a':'#a08a60';c.fillRect(B.ox+x*T,B.oy+y*T,T,T)}c.strokeStyle='rgba(0,0,0,.2)';c.strokeRect(B.ox+x*T,B.oy+y*T,T,T)}}
  if(B.threat&&B.turn==='P'){if(!B.thrT||now-B.thrT>400){B.thrT=now;B.thr=st_threat()}c.fillStyle='rgba(255,40,30,.22)';for(const k of B.thr){const [x,y]=k.split(',').map(Number);c.fillRect(B.ox+x*T,B.oy+y*T,T,T)}}
  for(const h of B.hl){c.fillStyle=h.c==='mv'?'rgba(80,150,255,.35)':h.c==='tg2'?'rgba(255,70,60,.18)':'rgba(255,70,60,.45)';c.fillRect(B.ox+h.t[0]*T+1,B.oy+h.t[1]*T+1,T-2,T-2)}
  const us=B.units.filter(u=>u.hp>0).sort((a,b)=>a.y-b.y);
  for(const u of us){const sh=st_sheetOf(u.sheet);if(!sh.complete||!sh.naturalWidth)continue;const R=st_rowsOf(sh);let px=B.ox+(u.x+.5)*T,py=B.oy+(u.y+.88)*T;
    let row=R.idle,fr=Math.floor((now/80+(u.id.length*3))%24);
    if(u.anim&&u.anim.k==='run'){const q=clamp01((now-u.anim.t0)/u.anim.dur);px=lerp2(B.ox+(u.anim.fx+.5)*T,px,q);py=lerp2(B.oy+(u.anim.fy+.88)*T,py,q);row=R.run;fr=Math.floor(now/40*(typeof RM==='function'?RM(sh)/2:1))%24}
    const face=u.face||(u.side==='P'?1:-1),k=1.45*T/114;
    if(B.act===u){const pu=(Math.sin(now/180)+1)/2;c.save();c.strokeStyle=u.side==='P'?`rgba(255,215,90,${.6+.4*pu})`:`rgba(255,90,70,${.6+.4*pu})`;c.lineWidth=3*B.dp;c.beginPath();c.ellipse(px,py,T*(.36+.04*pu),T*(.12+.015*pu),0,0,7);c.stroke();c.restore()}
    if(B.sel===u){c.strokeStyle='#ffd77a';c.lineWidth=3*B.dp;c.strokeRect(B.ox+u.x*T+2,B.oy+u.y*T+2,T-4,T-4)}
    c.fillStyle='rgba(0,0,0,.3)';c.beginPath();c.ellipse(px,py,T*.28,T*.08,0,0,7);c.fill();
    st_drawCell(c,sh,row,fr,px,py,k,face,1);
    st_chip(c,u,px,B.oy+(u.y+.5)*T,T)}
  if(B.mode==='target'&&B.opts)for(const op of B.opts){if(!op.dir)continue;const on=B.pendOpt===op;if(B.pendOpt&&!on)continue;const [dx,dy]=op.dir,X=B.sel.x+dx,Y=B.sel.y+dy,p=(Math.sin(now/200)+1)/2,L=T*(.36+(on?.06:.03*p));c.save();c.translate(B.ox+(X+.5)*T+dx*T*.06*p,B.oy+(Y+.5)*T+dy*T*.06*p);c.rotate(Math.atan2(dy,dx));c.beginPath();c.moveTo(L,0);c.lineTo(-L*.15,-L*.75);c.lineTo(-L*.15,-L*.32);c.lineTo(-L*.9,-L*.32);c.lineTo(-L*.9,L*.32);c.lineTo(-L*.15,L*.32);c.lineTo(-L*.15,L*.75);c.closePath();c.fillStyle=on?'#ff8a2a':'#ffd23c';c.fill();c.lineWidth=Math.max(2,T*.05);c.strokeStyle=on?'#fff3c0':'#5a3a00';c.stroke();c.restore()}
  requestAnimationFrame(st_loop)}

function st_rr(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
function st_chip(c,u,X,Y,T){const fr=u.side==='P',bw=T*.62,bh=Math.max(4,T*.085),bx=X-bw/2+T*.1,by=Y+T*.40,mh=Math.max(3,T*.05);
  if(u.mpMax){const hy=by-mh-2;c.fillStyle='rgba(0,0,0,.78)';st_rr(c,bx-1,hy-1,bw+2,mh+2,2);c.fill();c.fillStyle='#7dc8ff';st_rr(c,bx,hy,Math.max(2,bw*clamp01(u.mp/u.mpMax)),mh,2);c.fill()}
  c.fillStyle='rgba(0,0,0,.78)';st_rr(c,bx-1.5,by-1.5,bw+3,bh+3,bh);c.fill();const f=clamp01(u.hp/u.hpMax);
  const gg=c.createLinearGradient(0,by,0,by+bh);if(fr){gg.addColorStop(0,'#b4ff9e');gg.addColorStop(1,'#1fa636')}else{gg.addColorStop(0,'#ffa08c');gg.addColorStop(1,'#c8261a')}
  if(f>0){c.fillStyle=gg;st_rr(c,bx,by,Math.max(bh,bw*f),bh,bh/2);c.fill()}
  const pr=T*.15,px=bx-pr*.55,py=by+bh/2;c.fillStyle='#0a0f1c';c.beginPath();c.arc(px,py,pr+1.5,0,7);c.fill();
  c.save();c.beginPath();c.arc(px,py,pr,0,7);c.clip();
  if(u.port){const im=st_img('portraits/'+u.port+'.webp');if(im.complete&&im.naturalWidth){const k=im.naturalWidth/512;c.drawImage(im,96*k,24*k,320*k,320*k,px-pr,py-pr,pr*2,pr*2)}}
  else{const sh=st_sheetOf(u.sheet);if(sh&&sh.complete&&sh.naturalWidth){c.fillStyle='#3a2c1c';c.fillRect(px-pr,py-pr,pr*2,pr*2);c.drawImage(sh,70,6,48,48,px-pr,py-pr,pr*2,pr*2)}}
  c.restore();c.lineWidth=Math.max(1.5,T*.026);c.strokeStyle=fr?'#7dd8ff':'#ff8a6a';c.beginPath();c.arc(px,py,pr,0,7);c.stroke()}
// ---------- side-view fight scene ----------
const SOFT=document.createElement('canvas');
function st_softDraw(c,im,sx,sy,sw,sh,dx,dy,dw,dh){const W=Math.max(2,Math.round(dw)),H=Math.max(2,Math.round(dh));if(SOFT.width!==W||SOFT.height!==H){SOFT.width=W;SOFT.height=H}const g=SOFT.getContext('2d');g.globalCompositeOperation='source-over';g.clearRect(0,0,W,H);g.drawImage(im,sx,sy,sw,sh,0,0,W,H);
  g.globalCompositeOperation='destination-in';const fx=g.createLinearGradient(0,0,W,0);fx.addColorStop(0,'rgba(0,0,0,0)');fx.addColorStop(.18,'#000');fx.addColorStop(.82,'#000');fx.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=fx;g.fillRect(0,0,W,H);
  const fy=g.createLinearGradient(0,0,0,H);fy.addColorStop(0,'rgba(0,0,0,0)');fy.addColorStop(.2,'#000');fy.addColorStop(.8,'#000');fy.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=fy;g.fillRect(0,0,W,H);c.drawImage(SOFT,dx,dy,dw,dh)}

// defender reactions: stagger back on a hit, hop back on a dodge
function st_react(t,ht,dodge,TR,W,H,dir){if(t<=ht)return null;
  if(dodge){const q=(t-ht)/620;if(q>=1)return null;const D=W*.13;let ox,oy=0;if(q<.3){ox=D*ease2(q/.3);oy=-H*.11*Math.sin(q/.3*Math.PI)}else if(q<.72)ox=D;else ox=D*(1-ease2((q-.72)/.28));return{ox:dir*ox,oy,row:null,rot:0}}
  const q=(t-ht)/520;if(q>=1)return null;const ox=dir*W*.04*Math.sin(Math.min(1,q*2.2)*Math.PI/2)*(q<.6?1:(1-q)/.4);
  if(TR.fall===4){const fr=q<.3?2+Math.floor(q/.3*5):q<.65?7:Math.max(0,7-Math.floor((q-.65)/.35*8));return{ox,oy:0,row:fr>1?4:null,fr,rot:0}}
  return{ox,oy:0,row:null,rot:-dir*.2*Math.sin(Math.min(1,q*1.6)*Math.PI)}}
function st_drawRot(c,sh,row,fr,x,y,k,m,al,rot){if(!rot)return st_drawCell(c,sh,row,fr,x,y,k,m,al);c.save();c.translate(x,y);c.rotate(rot);st_drawCell(c,sh,row,fr,0,0,k,m,al);c.restore()}
function st_fightScene(att,A,res){return new Promise(done=>{const cv=$s('#stFight');cv.hidden=false;const r=cv.getBoundingClientRect(),dp=Math.min(2,window.devicePixelRatio||1);cv.width=r.width*dp;cv.height=r.height*dp;
  const W=cv.width,H=cv.height,c=cv.getContext('2d'),n=res.length,mir=att.side==='E'?-1:1,X=v=>mir>0?v*W:W-v*W;
  const k=(n>1?.34:.42)*H/114,gy=H*.86,ax0=.24,tx=res.map((_,i)=>n>1?(n>3?.56+Math.floor(i/3)*.13+(i%3)*.03:.58+i*.12):.66),ty=res.map((_,i)=>gy-(n>3?(i%3)*H*.07:n>1?(i%2)*H*.05:0));
  const sh=st_sheetOf(att.sheet),R=st_rowsOf(sh),bg=B.bg,parts=[],pops=[];let t0=performance.now();
  const anim=A.anim==='dash'&&R.dash!=null?'dash':A.anim==='ranged'?'ranged':'melee',mrow=(A.anim==='punch'||A.anim==='kick'||A.anim==='fly')&&R[A.anim]!=null?R[A.anim]:R.melee;
  if(A.shape==='ring'&&R.kick!==2)return st_spinScene(cv,att,A,res,sh,R,done);
  const dur=anim==='dash'?2300:anim==='ranged'?2000:2200;const pierce=(n>1||A.pass)&&anim!=='ranged',stay=!!A.pass;
  const GD=st_img('art/gdragon.jpg'),GG=st_img('art/gdragon_g.jpg');let DR=null;if(att.hero&&A===ARTS.palm&&P.arts.palm&&P.arts.palm.lv>=5)DR={im:GD,n:1};if(att.hero&&A===ARTS.sea&&P.arts.palm&&gDragons(P.arts.palm.lv))DR={im:GD,n:gDragons(P.arts.palm.lv)};
  const hitT=res.map((_,i)=>anim==='dash'?1100+i*120:anim==='ranged'?950+i*110:A.hits?1600:1150+i*140);const hitDone=res.map(()=>false);
  const GRD=res.map((r2,i)=>r2.guard?i:-1).filter(i=>i>=0),retR=res.find(r2=>r2.guard==='shift'),retT=retR?hitT[res.indexOf(retR)]+650:1e9,attDead=retR&&att.hp-retR.ret<=0;let retDone=false;const GSTOP=res[0]&&res[0].guard&&!pierce?.24:0;const DUR=GRD.length?Math.max(dur,...GRD.map(i=>hitT[i]+1350)):dur;
  snd(anim==='ranged'?'fx':'swing');
  function frame(){const now=performance.now(),t=(now-t0)*SPD;c.clearRect(0,0,W,H);
    if(bg.complete&&bg.naturalWidth){const s=Math.max(W/bg.naturalWidth,H/bg.naturalHeight);c.drawImage(bg,(W-bg.naturalWidth*s)/2,(H-bg.naturalHeight*s)/2,bg.naturalWidth*s,bg.naturalHeight*s)}
    c.fillStyle='rgba(0,0,0,.18)';c.fillRect(0,0,W,H);
    // banner
    c.fillStyle='rgba(10,8,6,.75)';c.fillRect(0,H*.04,W,H*.11);c.fillStyle='#ffd77a';c.font=`900 ${Math.round(H*.07)}px serif`;c.textAlign='center';c.fillText((A.zh||'')+'  '+A.n,W/2,H*.12);
    // solar system sits BEHIND the fighters
    for(const gi of GRD){const r2=res[gi];if(r2.guard!=='shift')continue;const ht=hitT[gi],gs=ht-460;if(t<gs||t>ht+1100)continue;const g=t<gs+140?(t-gs)/140:t<ht+750?1:clamp01(1-(t-ht-750)/350),bx=X(tx[gi])-mir*W*.085,by=ty[gi]-k*88;st_solar(c,bx,by,k*135*(.45+.55*Math.min(1,g)),(t-gs)/1000*(t>ht-100&&t<ht+500?3:1.1),g)}
    // targets
    res.forEach((r2,i)=>{const t2=r2.t,ts=st_sheetOf(t2.sheet),TR=st_rowsOf(ts);let x=X(tx[i]),y=ty[i],row=TR.idle,fr=Math.floor(now/80)%24,al=1;const ht=hitT[i];
      let rot=0,oy=0;const dead=!r2.dodge&&t2.hp-r2.dmg<=0,gd=r2.guard,gs=ht-460;
      if(gd&&t>gs){const q=t<ht+900?ease2(clamp01((t-gs)/180)):1-ease2(clamp01((t-ht-900)/300));x+=mir*W*.075*q;
        if(t<ht+950){const gr=gd==='shift'?(TR.shift!=null?TR.shift:TR.twin):(TR.xlong!=null?TR.xlong:TR.twin);if(gr!=null){row=gr;fr=Math.min(23,Math.floor((t-gs)/1230*24))}}
        if(t>ht&&dead){row=TR.fall;fr=Math.min(23,Math.floor((t-ht)/30))}}
      else if(t>ht&&dead){row=TR.fall;fr=Math.min(23,Math.floor((t-ht)/30))}else{const rc=st_react(t,ht,r2.dodge,TR,W,H,mir);if(rc){x+=rc.ox;oy=rc.oy;rot=rc.rot;if(rc.row!=null){row=rc.row;fr=rc.fr}}}
      c.fillStyle='rgba(0,0,0,.3)';c.beginPath();c.ellipse(x,y,k*40*(1+oy/(H*.2)),k*9,0,0,7);c.fill();
      st_drawRot(c,ts,row,fr,x,y+oy,k,-mir,al,rot);
      if(t>ht&&!r2.dodge&&!gd&&t<ht+120){c.save();c.globalCompositeOperation='lighter';c.fillStyle='rgba(255,240,200,.22)';c.beginPath();c.arc(x,y-k*60,k*32,0,7);c.fill();c.restore()}
      if(r2.hits&&t>ht-450&&!r2.h1){r2.h1=1;pops.push({x,y:y-k*140,t:now,txt:r2.hits[0]?''+r2.hits[0]:'Dodge!',col:r2.hits[0]?'#fff':'#9fd7ff'});if(r2.hits[0])snd('hit')}
      if(t>ht&&!hitDone[i]){hitDone[i]=true;if(r2.hits){pops.push({x,y:y-k*120,t:now,txt:(r2.hits[1]?''+r2.hits[1]:'Dodge!')+(r2.dmg?'  (total '+r2.dmg+')':''),col:r2.hits[1]?'#ffd23a':'#9fd7ff'});if(r2.hits[1]){snd('hit')}}else pops.push({x,y:y-k*120,t:now,txt:gd?(gd==='dragon'?'降龍手  −':'天轉星移  −')+r2.dmg:r2.dodge?'Dodge!':(r2.crit?'Critical '+r2.dmg:''+r2.dmg),col:gd?'#9fd0ff':r2.dodge?'#9fd7ff':r2.crit?'#ffd23a':'#fff'});if(gd){snd('fx');snd('hit')}else if(!r2.dodge){snd('hit');for(let j=0;j<18;j++){const a=Math.random()*6.28,v=rnd(2,7)*dp;parts.push({x,y:y-k*60,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:1,col:A.fx})}}else snd('swing')}});
    // attacker
    let ax=X(ax0),row=R.idle,fr=Math.floor(now/80)%24;const last=X(tx[n-1]),first=X(tx[0]);
    if(anim==='dash'){const a0=400,a1=1900;if(t>=a0&&t<a1){const q=(t-a0)/(a1-a0);row=R.dash;fr=Math.min(23,Math.floor(q*24));const dest=pierce?last+mir*W*.08:first-mir*W*(GSTOP||.1);if(q<.2)ax=X(ax0);else if(q<.6)ax=lerp2(X(ax0),dest,ease2((q-.2)/.4));else ax=dest}
      else if(t>=a1){const q=clamp01((t-a1)/350),dest=pierce?last+mir*W*.08:first-mir*W*(GSTOP||.1);ax=lerp2(dest,X(ax0),ease2(q));row=R.run;fr=Math.floor(now/40*(typeof RM==='function'?RM(sh)/2:1))%24}}
    else if(anim==='melee'){const dest=pierce?last+mir*W*.08:first-mir*W*(GSTOP||.11);if(t>=300&&t<800){row=R.run;fr=Math.floor(now/40)%24;ax=lerp2(X(ax0),dest,ease2((t-300)/500))}else if(t>=800&&t<1700){row=mrow;fr=A.hits?Math.floor((t-800)/450*24)%24:Math.min(23,Math.floor((t-800)/900*24));ax=pierce?lerp2(dest-mir*W*.2,dest,clamp01((t-800)/600)):dest}else if(t>=1700){if(stay){ax=dest}else{row=R.run;fr=Math.floor(now/40)%24;ax=lerp2(dest,X(ax0),ease2(clamp01((t-1700)/350)))}}}
    else{if(t>=350&&t<1500){row=A.anim2&&R[A.anim2]!=null?R[A.anim2]:R.ranged;fr=Math.min(23,Math.floor((t-350)/1150*24))}
      if(t>800&&t<800+170*n+300){const q=clamp01((t-800)/(150*n+200));const px=lerp2(X(ax0)+mir*W*.06,last+mir*W*.05,q),py=gy-k*62;c.save();c.globalCompositeOperation='lighter';for(let j=0;j<5;j++){c.fillStyle=A.fx;c.globalAlpha=.25-j*.04;c.beginPath();c.arc(px-mir*j*k*10,py,k*(22-j*2),0,7);c.fill()}c.restore()}}
    c.fillStyle='rgba(0,0,0,.3)';c.beginPath();c.ellipse(ax,gy,k*40,k*9,0,0,7);c.fill();
    if(R.dash==null&&anim==='melee'&&row===R.melee)row=R.melee;
    let arot=0,aox=0;if(t>retT){if(attDead){row=R.fall;fr=Math.min(23,Math.floor((t-retT)/30))}else{const rc=st_react(t,retT,false,R,W,H,-mir);if(rc){aox=rc.ox;arot=rc.rot;if(rc.row!=null){row=rc.row;fr=rc.fr}}}}
    if(attDead&&t>retT){ax=st_fightScene.lastAx??ax}else st_fightScene.lastAx=ax;
    if(t>retT&&!retDone){retDone=true;snd('hit');pops.push({x:ax,y:gy-k*120,t:now,txt:'−'+retR.ret,col:'#9fd0ff'});for(let j=0;j<18;j++){const a=Math.random()*6.28,v=rnd(2,7)*dp;parts.push({x:ax,y:gy-k*60,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:1,col:'#9fd0ff'})}}
    const face=(!stay&&anim!=='ranged'&&t>=(anim==='dash'?1900:1700))?-mir:stay&&t>=1700?-mir:mir;st_drawRot(c,sh,row,fr,ax+aox,gy,k,face,1,arot);
    // guards: blue dragon / solar system between the hero and the blow
    for(const gi of GRD){const r2=res[gi],ht=hitT[gi],gs=ht-460,x0=X(tx[gi]),bx=x0-mir*W*.085,by=ty[gi]-k*68;if(t<gs||t>ht+1100)continue;const g=t<gs+140?(t-gs)/140:t<ht+750?1:clamp01(1-(t-ht-750)/350);
      if(r2.guard==='dragon'){if(GG.complete&&GG.naturalWidth){const pp=Math.floor((t-gs)/70)%12,f=t<ht?(pp<7?pp:12-pp):Math.min(15,7+Math.floor((t-ht)/60)),dw=k*240,dh=dw/2,rise=(1-ease2(clamp01((t-gs)/260)))*k*40;c.save();c.globalCompositeOperation='screen';c.globalAlpha=g;c.filter='hue-rotate(100deg) saturate(1.6)';if(mir>0){c.translate(bx,0);c.scale(-1,1);c.translate(-bx,0)}st_softDraw(c,GG,(f%6)*240,Math.floor(f/6)*120,240,120,bx-dw*.5,by-dh*.55+rise,dw,dh);c.restore()}
        const sg=c.createRadialGradient(bx,by,0,bx,by,k*70);sg.addColorStop(0,`rgba(140,200,255,${.35*g})`);sg.addColorStop(1,'rgba(40,90,220,0)');c.save();c.globalCompositeOperation='lighter';c.fillStyle=sg;c.beginPath();c.ellipse(bx,by,k*45,k*80,0,0,7);c.fill();c.restore()}
      
      if(t>ht&&!(r2.burst)){r2.burst=1;const col=r2.guard==='dragon'?['#bfe6ff','#5ab0ff','#ffffff']:['#fff3c0','#9fd0ff','#ffd27a','#ffffff'];for(let j=0;j<46;j++){const a=Math.random()*6.28,v=rnd(1.5,7)*dp;parts.push({x:bx+rnd(-k*10,k*10),y:by+rnd(-k*20,k*20),vx:Math.cos(a)*v,vy:Math.sin(a)*v*.7,l:1,col:col[j%col.length],star:1})}}
      if(r2.guard==='shift'&&t>ht+120&&t<retT){const P=q=>({x:lerp2(bx,ax,ease2(q)),y:lerp2(by,gy-k*60,q)-Math.sin(q*Math.PI)*k*55}),q=clamp01((t-ht-120)/(retT-ht-120)),h=P(q);c.save();c.globalCompositeOperation='lighter';
        for(let j=14;j>=1;j--){const pt=P(Math.max(0,q-j*.018)),al=(1-j/15)*.5;c.fillStyle=`rgba(150,200,255,${al})`;c.beginPath();c.arc(pt.x,pt.y,k*(13-j*.7),0,7);c.fill()}
        const hg=c.createRadialGradient(h.x,h.y,0,h.x,h.y,k*26);hg.addColorStop(0,'#ffffff');hg.addColorStop(.3,'#fff0b0');hg.addColorStop(.6,'rgba(255,200,90,.6)');hg.addColorStop(1,'rgba(255,150,40,0)');c.fillStyle=hg;c.beginPath();c.arc(h.x,h.y,k*26,0,7);c.fill();
        if(Math.random()<.7)parts.push({x:h.x,y:h.y,vx:rnd(-1,1)*dp,vy:rnd(-1,1)*dp,l:.8,col:'#cfe6ff',star:1});c.restore()}}
    if(DR&&DR.im.complete&&DR.im.naturalWidth){for(let j=0;j<DR.n;j++){const ti=j%n,h0=hitT[ti]+j*60,a=h0-380,b=h0+700;if(t>=a&&t<b){const dt=t-a,f=Math.min(35,Math.floor(dt/(b-a)*36)),q=clamp01(dt/380),tx0=X(tx[ti]),sx=ax+mir*k*55,px=lerp2(sx,tx0,ease2(q)),oy=(j-(DR.n-1)/2)*k*38,py=ty[ti]-k*64+oy*(1-q*.6),dw=k*(DR.n>1?240:300),dh=dw/2;
      c.save();c.globalCompositeOperation='lighter';c.globalAlpha=t>b-200?(b-t)/200:1;if(mir<0){c.translate(px,0);c.scale(-1,1);c.translate(-px,0)}st_softDraw(c,DR.im,(f%6)*240,Math.floor(f/6)*120,240,120,px-dw*.55,py-dh/2,dw,dh);c.restore()}}}
    // particles + popups
    for(const p of parts){p.x+=p.vx;p.y+=p.vy;if(p.star){p.vx*=.95;p.vy*=.95;p.l-=.018}else{p.vy+=.2*dp;p.l-=.03}if(p.l>0){c.globalAlpha=p.l;c.fillStyle=p.col;if(p.star){const r=2.2*dp*(.6+p.l);c.fillRect(p.x-r*2,p.y-r*.3,r*4,r*.6);c.fillRect(p.x-r*.3,p.y-r*2,r*.6,r*4)}else c.fillRect(p.x,p.y,4*dp,4*dp)}}c.globalAlpha=1;
    for(const p of pops){const q=(now-p.t)/900;if(q>1)continue;c.globalAlpha=1-q;c.fillStyle=p.col;c.strokeStyle='#000';c.lineWidth=4*dp;c.font=`900 ${Math.round(H*.075)}px sans-serif`;c.textAlign='center';c.strokeText(p.txt,p.x,p.y-q*40*dp);c.fillText(p.txt,p.x,p.y-q*40*dp)}c.globalAlpha=1;
    // name plates
    c.font=`700 ${Math.round(H*.04)}px sans-serif`;c.textAlign='left';c.fillStyle='#fff';c.fillText(att.name,mir>0?W*.03:W*.6,H*.95);
    if(t<DUR&&!skip)requestAnimationFrame(frame);else{cv.hidden=true;cv.onpointerdown=null;done()}}
  let skip=false;cv.onpointerdown=()=>{if(performance.now()-t0>300)skip=true};requestAnimationFrame(frame)})}

// 天轉星移: a solar system turns in front of him, swallows the blow and flings it back at its owner
function st_solar(c,x,y,R,a,al){c.save();c.globalAlpha=al;c.translate(x,y);
  const g=c.createRadialGradient(0,0,0,0,0,R*1.2);g.addColorStop(0,'rgba(30,50,120,.8)');g.addColorStop(.55,'rgba(10,16,52,.62)');g.addColorStop(.85,'rgba(6,8,30,.3)');g.addColorStop(1,'rgba(4,6,20,0)');c.fillStyle=g;c.beginPath();c.ellipse(0,0,R*1.2,R*.9,0,0,7);c.fill();
  for(let i=0;i<40;i++){const sa=i*2.4+a*.05,sr=R*(.15+((i*37)%100)/100*.95);c.fillStyle=`rgba(255,255,255,${.35+.4*Math.sin(a*3+i)})`;c.fillRect(Math.cos(sa)*sr,Math.sin(sa)*sr*.6,2.5,2.5)}
  const PL=[[.30,.09,'#c9b6a0',4.1],[.44,.12,'#f0c070',2.9],[.58,.13,'#4aa0ff',2.2],[.70,.11,'#ff6a40',1.8],[.86,.2,'#e8b070',1.1],[1.0,.17,'#f3e0a0',.8]];
  const draw=front=>{for(const [o,s,col,sp] of PL){const an=a*sp+o*9,px=Math.cos(an)*R*o,py=Math.sin(an)*R*o*.5;if((py>0)!==front)continue;const pr=R*s*.42;const pg=c.createRadialGradient(px-pr*.4,py-pr*.4,pr*.1,px,py,pr);pg.addColorStop(0,'#fff');pg.addColorStop(.35,col);pg.addColorStop(1,'rgba(0,0,0,.85)');c.fillStyle=pg;c.beginPath();c.arc(px,py,pr,0,7);c.fill();if(o===.86){c.strokeStyle='rgba(240,210,150,.8)';c.lineWidth=2;c.beginPath();c.ellipse(px,py,pr*1.9,pr*.55,-.3,0,7);c.stroke()}}};
  c.lineWidth=1.6;for(const [o] of PL){c.strokeStyle='rgba(170,210,255,.5)';c.beginPath();c.ellipse(0,0,R*o,R*o*.5,0,0,7);c.stroke()}
  draw(false);const sg=c.createRadialGradient(0,0,0,0,0,R*.26);sg.addColorStop(0,'#fff8d0');sg.addColorStop(.4,'#ffd040');sg.addColorStop(1,'rgba(255,120,0,0)');c.globalCompositeOperation='lighter';c.fillStyle=sg;c.beginPath();c.arc(0,0,R*.26,0,7);c.fill();c.globalCompositeOperation='source-over';draw(true);c.restore()}
// whirlwind kick: hero spins in the middle, foes stand where they are on the board (E right, W left, N behind, S in front)
function st_spinScene(cv,att,A,res,sh,R,done){const W=cv.width,H=cv.height,c=cv.getContext('2d'),dp=W/cv.getBoundingClientRect().width,mir=att.side==='E'?-1:1,bg=B.bg,parts=[],pops=[];
  const k0=.34*H/114,gy0=H*.72,cx=W*.5,dur=2400;const t0=performance.now();
  const P2=res.map(r=>{const dx=Math.sign(r.t.x-att.x)*mir,dy=Math.sign(r.t.y-att.y),ang=(Math.atan2(dy,dx)+Math.PI*2)%(Math.PI*2);const ox=dx?dx*W*.22:-dy*W*.09;return {r,dx:dx||Math.sign(ox),dy,ang,x:cx+ox,y:gy0+(dy>0?dy*H*.13:dy*H*.17),k:k0*(1+dy*.14),hit:430+ang/(Math.PI*2)*640}});
  snd('swing');let skip=false;cv.onpointerdown=()=>{if(performance.now()-t0>300)skip=true};
  function frame(){const now=performance.now(),t=(now-t0)*SPD;c.clearRect(0,0,W,H);
    if(bg.complete&&bg.naturalWidth){const s2=Math.max(W/bg.naturalWidth,H/bg.naturalHeight);c.drawImage(bg,(W-bg.naturalWidth*s2)/2,(H-bg.naturalHeight*s2)/2,bg.naturalWidth*s2,bg.naturalHeight*s2)}
    c.fillStyle='rgba(0,0,0,.18)';c.fillRect(0,0,W,H);
    c.fillStyle='rgba(10,8,6,.75)';c.fillRect(0,H*.04,W,H*.11);c.fillStyle='#ffd77a';c.font=`900 ${Math.round(H*.07)}px serif`;c.textAlign='center';c.fillText((A.zh||'')+'  '+A.n,W/2,H*.12);
    const krow=R.kick,kf=t<200?-1:Math.min(23,Math.floor((t-200)/1250*24));
    const ents=P2.map(p=>({y:p.y,draw:()=>{const t2=p.r.t,ts=st_sheetOf(t2.sheet),TR=st_rowsOf(ts);let x=p.x,y=p.y,row=TR.idle,fr=Math.floor(now/80)%24;const ht=p.hit;
        let rot=0,oy=0;const dead=!p.r.dodge&&t2.hp-p.r.dmg<=0,away=Math.sign(p.dx||1);
        if(t>ht&&dead){row=TR.fall;fr=Math.min(23,Math.floor((t-ht)/30))}else{if(t>ht&&p.r.push){const q=ease2(clamp01((t-ht)/350));x+=p.dx*W*.12*q;y+=p.dy*H*.06*q}const rc=st_react(t,ht,p.r.dodge,TR,W,H,away);if(rc){x+=rc.ox;oy=rc.oy;rot=rc.rot;if(rc.row!=null){row=rc.row;fr=rc.fr}}}
        c.fillStyle='rgba(0,0,0,.3)';c.beginPath();c.ellipse(x,y,p.k*40,p.k*9,0,0,7);c.fill();
        st_drawRot(c,ts,row,fr,x,y+oy,p.k,p.dx>0?-1:p.dx<0?1:-mir,1,rot);
        if(t>ht&&!p.r.dodge&&t<ht+120){c.save();c.globalCompositeOperation='lighter';c.fillStyle='rgba(255,240,200,.25)';c.beginPath();c.arc(x,y-p.k*60,p.k*32,0,7);c.fill();c.restore()}
        if(t>ht&&!p.done){p.done=1;pops.push({x,y:y-p.k*120,t:now,txt:p.r.dodge?'Dodge!':(p.r.crit?'Critical '+p.r.dmg:''+p.r.dmg)+(p.r.push?' · pushed!':''),col:p.r.dodge?'#9fd7ff':p.r.crit?'#ffd23a':'#fff'});if(!p.r.dodge){snd('hit');for(let j=0;j<16;j++){const a=Math.random()*6.28,v=rnd(2,7)*dp;parts.push({x,y:y-p.k*60,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:1,col:A.fx})}}}}}));
    ents.push({y:gy0,draw:()=>{c.fillStyle='rgba(0,0,0,.3)';c.beginPath();c.ellipse(cx,gy0,k0*40,k0*9,0,0,7);c.fill();
      if(t>420&&t<1150){const q=(t-420)/730,rot=q*Math.PI*2.4;c.save();c.globalCompositeOperation='lighter';c.lineCap='round';for(let j=0;j<3;j++){c.strokeStyle=j?'rgba(255,215,120,.35)':'rgba(255,240,190,.75)';c.lineWidth=(6-j*1.5)*dp;c.beginPath();c.ellipse(cx,gy0-k0*55,k0*(95+j*10),k0*(24+j*4),0,rot+j*.6,rot+j*.6+2.2);c.stroke()}c.restore()}
      st_drawCell(c,sh,kf<0?R.idle:krow,kf<0?Math.floor(now/80)%24:kf,cx,gy0,k0,mir)}});
    ents.sort((a,b)=>a.y-b.y).forEach(e=>e.draw());
    for(const p of parts){p.x+=p.vx;p.y+=p.vy;p.vy+=.2*dp;p.l-=.03;if(p.l>0){c.globalAlpha=p.l;c.fillStyle=p.col;c.fillRect(p.x,p.y,4*dp,4*dp)}}c.globalAlpha=1;
    for(const p of pops){const q=(now-p.t)/900;if(q>1)continue;c.globalAlpha=1-q;c.fillStyle=p.col;c.strokeStyle='#000';c.lineWidth=4*dp;c.font=`900 ${Math.round(H*.065)}px sans-serif`;c.textAlign='center';c.strokeText(p.txt,p.x,p.y-q*40*dp);c.fillText(p.txt,p.x,p.y-q*40*dp)}c.globalAlpha=1;
    c.font=`700 ${Math.round(H*.04)}px sans-serif`;c.textAlign='left';c.fillStyle='#fff';c.fillText(att.name,W*.03,H*.95);
    if(t<dur&&!skip)requestAnimationFrame(frame);else{cv.hidden=true;cv.onpointerdown=null;done()}}
  requestAnimationFrame(frame)}

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
window.__ST={B:()=>B,P:()=>P,tap(x,y){const cv=document.querySelector('#stCv'),r=cv.getBoundingClientRect();st_onTap({clientX:r.left+(B.ox+(x+.5)*B.T)/B.dp,clientY:r.top+(B.oy+(y+.5)*B.T)/B.dp,currentTarget:cv})},targets:(u,k)=>st_targetsFor(u,k),reach:u=>st_reach(u),fn:{skillNeed,CT,ctAfter,enemyCt,beitian:t=>st_beitian(t),gainManual:k=>st_gainManual(k),learn:(k,l)=>st_learn(k,l),mvOf,dodgeOf,talRed,kickReach,aoeDepth,gDragons,waveLen,heroArts:()=>st_heroArts(),fill:(u,us)=>st_fill(u,us),predict:n=>st_predict(n),est:(u,k,t)=>st_est(u,k,t),dealMul:u=>st_dealMul(u),takeMul:t=>st_takeMul(t),heroUnit:()=>st_heroUnit(),ARTS}};
})();
