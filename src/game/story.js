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
 palm:{zh:'金龍掌',n:'Golden Dragon Palm',shape:'adj',pow:1.45,mp:5,anim:'dash',fx:'#ffd75a',desc:'Powerful palm strike driven by 內力 on an adjacent enemy.'},
 wave:{zh:'金龍掌勁',n:'Palm Force',shape:'wave',pow:1.1,mp:6,anim:'ranged',fx:'#ffd75a',sub:'palm',desc:'Golden Dragon Palm technique: 內力 pushed out from the palm, hits every enemy in a line.'},
 green:{talent:60,zh:'青龍氣',n:'Green Dragon Qi',shape:'aoe',pow:1.1,mp:12,anim:'ranged',anim2:'twin',fx:'#5dff8a',desc:'Both palms push a wave of green qi: hits every enemy in a 3-wide area in front. Lv 1-4: 1 row · Lv 5: 2 rows + 2 dragons · Lv 7: 3 rows + 3 dragons · Lv 10: 4 rows + 4 dragons.'},
 tiger:{talent:65,zh:'伏虎拳',n:'Tiger-Taming Fist',shape:'adj',pow:1.15,mp:4,anim:'punch',fx:'#ffb060',stun:.2,desc:'Heavy punch on an adjacent enemy; 20% chance to stun (they lose their next turn).'},
 whirl:{talent:75,zh:'旋風腿',n:'Whirlwind Kick',shape:'ring',pow:.9,mp:8,anim:'kick',fx:'#ffe7a8',maxLv:5,desc:'Spinning kick around him. Lv 1-2: the 4 adjacent squares · Lv 3-4: all 8 squares including diagonals · Lv 5: all 8 + 40% chance to push each enemy back 1 square. Max level 5.'},
 star:{talent:80,zh:'追星腿',n:'Shooting-Star Kick',shape:'kick',pow:.9,mp:8,anim:'fly',fx:'#ffe7a8',maxLv:5,pass:1,desc:'Light flying kick in a straight line, then he lands behind the enemy (or beside it if that square is taken). Reach = its level: Lv 1 adjacent, Lv 2 two squares ... Lv 5 five squares. Max level 5.'},
 douzhuan:{talent:85,zh:'斗轉星移',n:'Star Shift',shape:'passive',passive:1,pow:0,mp:8,anim:'shift',fx:'#9fd0ff',maxLv:10,desc:'Murong family inner art: 以彼之道，還施彼身. When any enemy attack (close, ranged or area) reaches him, he may catch it in a turning solar system and send it back. Chance 10% at Lv 1, +2% per level (28% at Lv 10). Costs 8 內力 when it triggers. He takes no damage; the attacker takes 50% of its own damage at Lv 1, +5% per level (95% at Lv 10). From Lv 5 poison and stun bounce back too. Checked before 梅花手.'},
 plum:{talent:70,zh:'天下梅花手',n:'Plum Blossom Hand',shape:'passive',passive:1,pow:.9,mp:0,anim:'plum',fx:'#ffb7c9',maxLv:10,desc:'Passive counter art. When an enemy attacks him at close range, he may answer at once with a storm of palms, fists and elbows, plum blossoms filling the air. Counter chance 15% at Lv 1, +3% per level (42% at Lv 10). Costs no 內力.'},
 fork:{zh:'叉',n:'Pitchfork Jab',shape:'adj',pow:1,mp:0,anim:'melee',fx:'#ffe7a8'},
 slash:{zh:'刀',n:'Slash',shape:'adj',pow:1,mp:0,anim:'melee',fx:'#ffe7a8'},
 axe:{zh:'斧',n:'Axe Chop',shape:'adj',pow:1.2,mp:0,anim:'melee',fx:'#ffb060'},
 bell:{zh:'攝魂鈴',n:'Soul Bell',shape:'r2',pow:1.1,mp:0,anim:'ranged',fx:'#7dff9a',poison:.5},
 staff:{zh:'棍',n:'Staff Strike',shape:'adj',pow:.8,mp:0,anim:'melee',fx:'#ffe7a8'}};
const INNER={hunyuan:{zh:'混元氣',n:'Primordial Breath',regen:4,def:4,dodge:.03,hp:0,desc:'Passive: +4 defence, +3% dodge, restores 4 內力 each turn.'},
 jinzhong:{zh:'金鐘罩',n:'Golden Bell Shield',regen:2,def:12,dodge:0,hp:30,desc:'Passive: +12 defence, +30 HP, restores 2 內力 each turn.'},
 jiuyang:{zh:'九陽功',n:'Nine-Yang Art',regen:6,def:6,dodge:.05,hp:60,desc:'Passive: +60 HP, +6 defence, +5% dodge, restores 6 內力 each turn.'}};
const QG=[{zh:'無',n:'None',mv:2,dodge:.05},{zh:'踏雲步',n:'Cloud Step',mv:3,dodge:.12},{zh:'燕回翔',n:'Swallow Glide',mv:4,dodge:.18}];
const PEOPLE={hero:{n:'You',port:'hero'},hermit:{n:'Hermit Master',zh:'隱'},elder:{n:'Village Elder',zh:'老'},xiaoming:{n:'Xiao Ming',port:'xiao_ming'},xiaohei:{n:'Black Wind Chief',port:'xiao_hei'},jiangchen:{n:'Jiang Chen',port:'jiang_chen'},chief:{n:'Yellow Turban Chief',zh:'黃'},narr:{n:''}};
const PLACES=[
 {id:'valley',zh:'隱仙谷',n:'Hermit Valley',x:.16,y:.22,need:null,pic:'bg_pass'},
 {id:'zhuo',zh:'涿縣',n:'Zhuo Village',x:.42,y:.55,need:'prologue',pic:'bg_road'},
 {id:'blackwind',zh:'黑風寨',n:'Black Wind Fort',x:.76,y:.27,need:'prologue',pic:'bg_forest'},
 {id:'temple',zh:'古寺',n:'Old Temple',x:.18,y:.80,need:'bw',pic:'bg_hill'},
 {id:'ytcamp',zh:'黃巾營',n:'Yellow Turban Camp',x:.78,y:.78,need:'temple',pic:'bg_plain'}];
const E=(id,name,sheet,lv,hp,atk,def,arts,xp,port,mv)=>({id,name,sheet,lv,hp,hpMax:hp,mp:0,mpMax:0,atk,def,arts,xp,port,mv:mv||2,dodge:.05,side:'E'});
const BATTLES={
 spar:{theme:'pass',bg:'bg_pass',title:'Sparring · the two disciples',foes:()=>[E('d1','Disciple','peasant_shu',1,45,11,4,['staff'],12),E('d2','Disciple','peasant_shu',1,45,11,4,['staff'],12)],pos:[[9,2],[9,5]]},
 bw:{theme:'forest',bg:'bg_forest',title:'Black Wind Fort',foes:()=>[E('xiaohei','Black Wind Chief','f_xiaohei_shu',4,115,18,7,['axe'],40,'xiao_hei'),E('b1','Bandit','peasant_wei',2,45,12,4,['slash'],14),E('b2','Bandit','peasant_wei',2,45,12,4,['slash'],14),E('b3','Bandit','peasant_wei',2,45,12,4,['slash'],14)],pos:[[12,4],[10,2],[10,5],[11,6]]},
 temple:{theme:'hills',bg:'bg_hill',title:'Old Temple',foes:()=>[E('jiangchen','Jiang Chen','f_jiangchen_shu',5,130,22,6,['bell'],50,'jiang_chen'),E('y1','Yellow Turban','peasant_ind',3,62,16,6,['slash'],16),E('y2','Yellow Turban','peasant_ind',3,62,16,6,['slash'],16)],pos:[[12,3],[10,2],[10,5]]},
 yt:{theme:'river',bg:'bg_plain',title:'Yellow Turban Camp',foes:()=>[E('chief','Yellow Turban Chief','general_ind',7,240,27,10,['slash'],90),E('y1','Yellow Turban','peasant_ind',4,70,18,7,['slash'],18),E('y2','Yellow Turban','peasant_ind',4,70,18,7,['slash'],18),E('y3','Yellow Turban','peasant_ind',4,70,18,7,['slash'],18),E('y4','Yellow Turban','peasant_ind',4,70,18,7,['slash'],18)],pos:[[12,4],[10,1],[10,3],[10,5],[11,6]]}};
const xpNeed=lv=>20+lv*15;
const aoeDepth=lv=>lv>=10?4:lv>=7?3:lv>=5?2:1,gDragons=lv=>lv>=10?4:lv>=7?3:lv>=5?2:1;
const waveLen=lv=>lv>=10?6:lv>=7?5:lv>=5?4:lv>=3?3:0;

// ---------- state ----------
let P=null;
function st_freshHero(){return {lv:1,xp:0,hp:120,hpMax:120,mp:30,mpMax:30,atk:22,def:10,talent:70,gold:30,herbs:1,qg:0,inner:'hunyuan',arts:{palm:{lv:1,xp:0}},eq:'palm',flags:{},party:[],day:1}}
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
#stTip{position:absolute;z-index:7;left:50%;transform:translateX(-50%);bottom:calc(96px + env(safe-area-inset-bottom,0px));width:min(420px,92vw);padding:10px 14px 12px;border-radius:10px;background:linear-gradient(180deg,#f4e8cc,#e2cfa4);color:#3a2a14;border:2px solid #8a6a32;box-shadow:0 8px 24px rgba(0,0,0,.6)}#stTip[hidden]{display:none}#stTip .tth{display:flex;align-items:baseline;gap:10px;border-bottom:1px solid rgba(90,60,20,.35);padding-bottom:4px;margin-bottom:6px}#stTip .tth b{font:900 20px var(--f-zh,serif);color:#7a1a0a}#stTip .tth span{font:700 17px var(--f-display,serif)}#stTip .ttm{display:flex;gap:8px;flex-wrap:wrap;font-size:12px;margin-bottom:6px}#stTip .ttm span{padding:1px 8px;border-radius:9px;background:#6a4e22;color:#fff3d6}#stTip .ttm em{font-style:normal;padding:1px 8px;border-radius:9px;background:#3a2a14;color:#ffd27a}#stTip p{margin:0;font-size:13px;line-height:1.4}
#stTools button{min-height:34px!important;width:38px;padding:0!important;font-size:16px;background:rgba(30,26,20,.85)!important}
#stTools button.on{border-color:#ff7060!important;color:#ff9080}
#stInfo{position:absolute;left:8px;top:calc(var(--sb) + 8px);z-index:4;width:min(320px,56vw);display:flex;gap:9px;align-items:stretch;background:rgba(20,17,13,.92);border:1px solid #6a5a3a;border-radius:8px;padding:7px 9px;font-size:12px;line-height:1.35}
#stInfo .ih{display:flex;gap:8px;align-items:center;margin-bottom:4px}#stInfo .ibody{flex:1;min-width:0}#stInfo .ip{width:50px;height:50px;border-radius:9px;background:#2a241b;flex:none;border:2px solid #6a5a3a;display:flex;align-items:center;justify-content:center;font:900 22px var(--f-zh,serif);color:#ffd77a}
#stInfo b{color:#ffd77a}#stInfo .ib{position:relative;height:15px;background:#000;border-radius:8px;margin:3px 0;overflow:hidden}#stInfo .ib i{display:block;height:100%;border-radius:8px}#stInfo .ib span{position:absolute;inset:0;text-align:center;font:700 11px/15px system-ui;color:#fff;text-shadow:0 1px 2px #000}
#stInfo .ih{align-items:center;gap:0;margin-bottom:3px}#stInfo .ih .ip{width:84px;height:84px;border-radius:13px;border:3px solid #c9a24a;position:relative;z-index:1}#stInfo .ir{flex:1;min-width:0;margin-left:-8px;display:flex;flex-direction:column;gap:3px}
#stInfo .inm{align-self:flex-start;margin-left:14px;padding:1px 12px 2px;border-radius:11px 11px 11px 0;background:linear-gradient(180deg,#2a2418,#120f0a);border:1.5px solid #c9a24a;font:700 15px/1.25 Georgia,serif;color:#ffd77a;white-space:nowrap;max-width:100%;overflow:hidden;text-overflow:ellipsis}#stInfo .inm small{color:#e8dcc0;font:600 11px system-ui}
#stInfo .ibr{display:flex;align-items:center;gap:4px}#stInfo .ibr>b{position:relative;z-index:2;width:36px;text-align:right;font:italic 900 12px/1 Georgia,serif;color:#ffe08a;text-shadow:0 1px 0 #000,0 0 3px #000,0 0 3px #000;flex:none}
#stInfo .ibr .ib{flex:1;height:18px;margin:0;border-radius:4px 9px 9px 4px;border:1.5px solid #c9a24a}#stInfo .ibr .ib span{font:800 12px/16px system-ui}#stInfo .ist{margin-left:40px;font-size:11px;color:#cfc4aa}
#stInfo .ftr{display:flex!important;align-items:center;gap:6px;margin-top:4px;justify-content:flex-start!important}#stInfo .fc .fp{display:block;width:44px;height:44px;flex:none;border-radius:9px;border:2px solid #e0574a}#stInfo .fc .fr2{display:block;flex:1;min-width:0}#stInfo .fn{display:flex;justify-content:space-between;font-size:12px}#stInfo .fn span:first-child{color:#fff;font-weight:700}#stInfo .ftr .ib{position:relative;height:18px;margin:2px 0 0;border-radius:4px 9px 9px 4px;border:1.5px solid #c9a24a;overflow:hidden;background:#000}#stInfo .ftr .ib i{position:absolute;top:0;bottom:0;left:0;border-radius:0}#stInfo .ftr .ib i.fl{background:#fff6c8;animation:lmBlink .55s steps(2) infinite}#stInfo .ftr .ib span{position:absolute;inset:0;text-align:center;font:800 12px/15px system-ui;color:#fff;text-shadow:0 1px 2px #000}#stInfo .ftr em{font-style:normal;color:#ffe08a}
#stInfo .skc .skn{font:700 16px Georgia,serif;color:#fff;margin-bottom:6px}#stInfo .skc .skn b{color:#ffd77a;font-size:19px}#stInfo .skb{display:flex;gap:6px}#stInfo .skb button{flex:1;margin-top:0}
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
#stInfo .fc{margin-top:5px;padding-top:5px;border-top:1px solid #4a4030}#stInfo .fc div{display:flex;justify-content:space-between}#stInfo button{margin-top:6px;width:100%}
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
  <div id="stMap"></div><canvas id="stCv" hidden></canvas><aside class="rail" id="stRail" hidden><div class="turnbox"><span class="lbl">Turn</span><b id="stTurn">1</b></div><div class="pills"><button class="pill ic" data-r="thr" title="Enemy range" aria-label="Show enemy range">👁</button><button class="pill" data-r="auto" title="Auto battle">AUTO</button><button class="pill" data-r="spd" title="Battle scene speed">▶ 1×</button><button class="pill ic" data-r="snd" aria-label="Sound">🔊</button><button class="pill ic" data-r="log" title="Battle log" aria-label="Battle log">☰</button><button class="pill ic" data-r="perf" title="Performance meter" aria-label="Performance meter">📊</button><button class="pill ic" data-r="ret" title="Retreat" aria-label="Retreat">⚑</button></div></aside><div id="stTools" hidden><button data-z="in" title="Zoom in">＋</button><button data-z="out" title="Zoom out">－</button><button data-z="fit" title="Fit board">⤢</button></div><div class="logpanel" id="stLog" hidden><div class="lph"><div><b>Battle log</b><small id="stLogSub"></small></div><button class="pill" data-r="logx">Close</button></div><ol id="stLogL"></ol></div><div class="hud tp" id="stTp" hidden></div><div id="stTip" hidden></div><div class="hud bl" id="stBl" hidden><button class="endbtn" id="stEndB">End turn</button></div><div id="stInfo" hidden></div><div id="stBanner" hidden></div><div id="stAct" class="acts2 fan" hidden></div><canvas id="stFight" hidden></canvas><div id="stMsg" style="opacity:0"></div><div id="stDlg" hidden></div><div id="stPanel" hidden></div>`;
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
window.storyNew=async function(){if(st_load()&&!confirm('Start a new story? The current story save will be replaced.'))return;P=st_freshHero();st_save();st_enter();await st_prologue()};
window.storyContinue=function(){P=st_load();if(!P)return;if(P.flags&&P.flags.yt&&!(P.arts&&P.arts.douzhuan)&&!(P.manuals||[]).includes('douzhuan')){P.manuals=(P.manuals||[]).concat(['douzhuan'])}if(P.flags&&P.flags.temple&&!(P.arts&&P.arts.plum)&&!(P.manuals||[]).includes('plum')){P.manuals=(P.manuals||[]).concat(['plum'])}if(P.arts&&P.arts.thunder){P.arts.green=P.arts.thunder;delete P.arts.thunder}if(P.eq==='thunder')P.eq='green';if(P.manuals)P.manuals=P.manuals.map(k=>k==='thunder'?'green':k);if(P.arts&&P.arts.wave){delete P.arts.wave;if(P.eq==='wave')P.eq='palm'}P.manuals=P.manuals||[];P.antidote=P.antidote||0;if(!P.eq)P.eq='palm';for(const a of Object.values(P.arts)){if(a.xp==null)a.xp=0}st_enter()};

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
  st_gainManual('green');await st_say('xiaoming','We did it! The village is safe! But the elder says Yellow Turbans hold the old temple to the south...');st_save();st_showMap()}
async function st_afterTemple(){P.flags.temple=1;P.gold+=60;
  await st_say('jiangchen','My bell... broken... Great Teacher Zhang Jiao will avenge me...');
  await st_say('narr','Behind the altar, hidden in a hollow beam, is a scroll of 輕功: <b>Cloud Step 踏雲步</b>. Your body feels as light as mist.');
  P.qg=Math.max(P.qg,1);st_toast('輕功 learned: Cloud Step — move 3 squares, better dodge',3000);await st_wait(3200);
  await st_say('narr','Rolled inside the same beam is a second, older scroll, its silk printed with plum blossoms: <b>天下梅花手 Plum Blossom Hand</b>.');st_gainManual('plum');st_save();st_showMap()}
async function st_afterYT(){P.flags.yt=1;P.gold+=150;st_gainManual('tiger');st_gainManual('douzhuan');
  await st_say('chief','How... can one man... stand against the Yellow Sky...');
  await st_say('narr','In the chief\'s chest, among stolen silver, lies a scroll sealed with a single character — 慕容, the Murong family of Gusu: <b>斗轉星移 Star Shift</b>. Whoever it was taken from will want it back...');
  await st_say('narr','The camp scatters. By nightfall the whole county speaks of a young hero with a palm of gold.');
  await st_say('narr','In Zhuo, three men — Liu Bei, Guan Yu and Zhang Fei — are raising volunteers against the rebels. They want to meet you...<br><br><b style="color:#ffd77a">End of Chapter 1.</b> Chapter 2: the road to Hu Lao Gate — coming soon.');st_save();st_showMap()}
function st_learn(k,lv0){if(!P.arts[k]){P.arts[k]={lv:lv0?0:1,xp:0};if(lv0){st_toast('Learned '+ARTS[k].n+' at level 0 — equip it and win battles to reach level 1',3600);return}st_toast('New martial art: '+ARTS[k].n+' '+ARTS[k].zh,3000)}}

// ---------- hero panel ----------
function st_heroPanel(tab){const p=$s('#stPanel');if(!p.hidden&&!tab){p.hidden=true;return}tab=tab||'skills';
  const q=QG[P.qg],I=INNER[P.inner];P.manuals=P.manuals||[];P.antidote=P.antidote||0;
  const stat=(k,v)=>`<div class="hs"><span>${k}</span><b>${v}</b></div>`;
  const skills=`<div class="sec2">武功 Martial arts <small>★ = equipped manual, gains half your battle XP</small></div>${Object.entries(P.arts).map(([k,a])=>{const A=ARTS[k],eq=P.eq===k;return `<div class="art ${eq?'eq':''}"><div class="ah"><b>${eq?'★ ':''}${A.zh} ${A.n}</b><span>Lv ${a.lv}/${A.maxLv||10} · ${a.lv<1?'<b style="color:#e0a050">not usable yet</b>':A.mp?A.mp+' 內力':'free'}</span></div>${eq?`<div class="xb"><i style="width:${Math.round(100*clamp01((a.xp||0)/xpNeed(a.lv)))}%"></i></div><small>Manual XP ${a.xp||0}/${xpNeed(a.lv)}</small>`:`<button data-eq="${k}">Equip</button>`}<small>${A.desc||''}</small>${k==='palm'?`<small style="color:#c9b98f">Lv 3: Palm Force 金龍掌勁, range 3 · Lv 5: range 4 + golden dragon · Lv 7: range 5 · Lv 10: range 6${waveLen(a.lv)?` <b style="color:#ffd77a">(now ${waveLen(a.lv)} squares)</b>`:''}</small>`:''}</div>`}).join('')}
    <div class="sec2">內功 Inner art <small>passive</small></div><div class="art"><div class="ah"><b>${I.zh} ${I.n}</b></div><small>${I.desc}</small></div>
    <div class="sec2">輕功 Lightness skill</div><div class="art"><div class="ah"><b>${q.zh} ${q.n}</b></div><small>Move ${q.mv} squares · dodge ${Math.round(q.dodge*100)}%</small></div>`;
  const inv=`<div class="sec2">包裹 Inventory</div>
    <div class="art"><div class="ah"><b>🌿 Herb ×${P.herbs}</b><button data-use="herb" ${P.herbs?'':'disabled'}>Use</button></div><small>Restores 50 HP.</small></div>
    <div class="art"><div class="ah"><b>🧪 Antidote ×${P.antidote}</b><button data-use="anti" ${P.antidote&&P.poison?'':'disabled'}>Use</button></div><small>Cures poison.${P.poison?' <b style="color:#9be39b">You are poisoned.</b>':''}</small></div>
    <div class="sec2">秘籍 Manuals to study</div>${P.manuals.length?P.manuals.map(k=>{const A=ARTS[k],need=A.talent||0,ok=P.talent>=need;return `<div class="art"><div class="ah"><b>📜 ${A.zh} ${A.n}</b><button data-learn="${k}" ${ok?'':'disabled'}>Learn</button></div><small>${A.desc||''} Needs talent 悟性 ${need}.</small></div>`}).join(''):'<p class="muted">No unread manuals.</p>'}`;
  p.innerHTML=`<div class="hpw"><div class="hpp"><img src="portraits/cut_hero.webp" alt="The hero"></div>
   <div class="hpc"><h3>俠 The Hero</h3>${stat('Level',P.lv)}${stat('XP',P.xp+' / '+xpNeed(P.lv))}${stat('HP',P.hp+' / '+P.hpMax)}${stat('內力',P.mp+' / '+P.mpMax)}${stat('Attack',P.atk)}${stat('Defence',P.def+(I.def?' +'+I.def:''))}${stat('Agility',Math.round((q.dodge+I.dodge)*100)+'%')}${stat('Move',q.mv)}${stat('悟性 Talent',P.talent)}${stat('Gold',P.gold)}${stat('Party',['You',...P.party.map(k=>PEOPLE[k].n)].join(', '))}</div>
   <div class="hpr"><div class="tabs"><button data-tab="skills" class="${tab==='skills'?'on':''}">武功 Skills</button><button data-tab="inv" class="${tab==='inv'?'on':''}">包裹 Inventory</button><span class="sp"></span><button id="stClose" class="pri">Close</button></div><div class="hpl">${tab==='skills'?skills:inv}</div></div></div>`;
  p.hidden=false;$s('#stClose').onclick=()=>p.hidden=true;
  p.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>st_heroPanel(b.dataset.tab));
  p.querySelectorAll('[data-eq]').forEach(b=>b.onclick=()=>{P.eq=b.dataset.eq;st_save();st_heroPanel('skills');st_toast('Equipped: '+ARTS[P.eq].n)});
  p.querySelectorAll('[data-use]').forEach(b=>b.onclick=()=>{if(b.dataset.use==='herb'){P.herbs--;P.hp=Math.min(P.hpMax,P.hp+50)}else{P.antidote--;P.poison=0;st_toast('Poison cured')}st_hud();st_save();st_heroPanel('inv')});
  p.querySelectorAll('[data-learn]').forEach(b=>b.onclick=()=>{const k=b.dataset.learn;P.manuals=P.manuals.filter(x=>x!==k);st_learn(k,1);st_save();st_heroPanel('inv')})}
function st_gainManual(k){P.manuals=P.manuals||[];if(!P.arts[k]&&!P.manuals.includes(k)){P.manuals.push(k);st_toast('Manual obtained: '+ARTS[k].n+' — study it in the Hero screen',3200)}}
// ---------- sprites ----------
const IMG={};function st_img(src){if(!IMG[src]){const i=new Image();i.src=src;IMG[src]=i}return IMG[src]}
const st_sheetOf=k=>st_img('sprites/'+k+'.png');
function st_rowsOf(sh){const n=Math.round(sh.naturalHeight/132);return n>=5?{idle:0,run:1,melee:2,ranged:3,fall:4,dash:n>5?5:null,punch:n>6?6:2,kick:n>7?7:2,fly:n>8?8:2,twin:n>9?9:null,plum:n>10?10:null,shift:n>11?11:null}:{idle:0,run:1,melee:2,ranged:2,fall:3,dash:null}}
// draw cell with feet anchor (90,126) at (x,y); scale k; face 1=right,-1=left
function st_drawCell(c,sh,row,fr,x,y,k,face,alpha){if(!sh.complete||!sh.naturalWidth)return;c.save();c.globalAlpha=alpha==null?1:alpha;c.translate(x,y);c.scale(face*k,k);c.drawImage(sh,fr*192,row*132,192,132,-90,-126,192,132);c.restore()}

// ---------- battle ----------
let B=null;const COLS=14,ROWS=8;let SPD=1;try{SPD=+localStorage.getItem('rtk3_story_spd')||1}catch(e){}
function st_heroUnit(){const q=QG[P.qg];const I=INNER[P.inner];return {id:'hero',name:'You',sheet:'f_hero_shu',port:'hero',side:'P',hp:P.hp+I.hp,hpMax:P.hpMax+I.hp,mp:P.mp,mpMax:P.mpMax,atk:P.atk,def:P.def+I.def,mv:q.mv,dodge:q.dodge+I.dodge,poison:P.poison||0,arts:Object.keys(P.arts).filter(k=>k!=='wave'&&P.arts[k].lv>=1&&!ARTS[k].passive).concat(['basic']).concat(P.arts.palm&&waveLen(P.arts.palm.lv)?['wave']:[]),hero:true}}
function st_allyUnit(k){if(k==='xiaoming'){const L=P.lv;return {id:'xiaoming',name:'Xiao Ming',sheet:'f_xiaoming_shu',port:'xiao_ming',side:'P',hp:70+L*8,hpMax:70+L*8,mp:0,mpMax:0,atk:13+L*2,def:6+L,mv:3,dodge:.06,arts:['fork']}}}
function st_battle(key){return new Promise(res=>{const D=BATTLES[key];const us=[st_heroUnit(),...P.party.map(st_allyUnit).filter(Boolean)];
  const ppos=[[2,4],[2,3],[2,5],[1,4]];const fs=D.foes();
  let map=null;try{map=genBattleMap('N',D.theme==='river',1000+Math.floor(Math.random()*9000),D.theme)}catch(e){}if(!map||map.length!==ROWS)map=Array.from({length:ROWS},()=>'.'.repeat(COLS));
  B={key,D,map,units:[],turn:'P',sel:null,mode:'idle',res,bg:st_img('art/'+D.bg+'.jpg'),hl:[],t0:performance.now()};
  const place=(u,x,y)=>{let best=null,bd=1e9;for(let X=0;X<COLS;X++)for(let Y=0;Y<ROWS;Y++){if(!st_pass(X,Y)||B.units.some(v=>v.x===X&&v.y===Y))continue;const d=Math.abs(X-x)+Math.abs(Y-y);if(d<bd){bd=d;best=[X,Y]}}[u.x,u.y]=best;B.units.push(u)};
  us.forEach((u,i)=>place(u,...ppos[i]));fs.forEach((u,i)=>place(u,...D.pos[i]));
  $s('#stMap').hidden=true;const cv=$s('#stCv');cv.hidden=false;mus('battle');B.zoom=1;B.panX=0;B.panY=0;B.turnN=1;B.log=[];st_log('Turn 1',1);st_fit();st_gestures(cv);st_tools(true);
  st_toast(D.title,2000);for(const u of B.units)u.done=false;st_loop();st_actBar();setTimeout(()=>st_banner('Your turn',0,'Turn 1'),400)})}
function st_banner(t,en,sub){const b=$s('#stBanner');if(!b)return;b.hidden=true;b.className=en?'en':'';b.innerHTML='<b>'+t+'</b>'+(sub?'<small>'+sub+'</small>':'');void b.offsetWidth;b.hidden=false;clearTimeout(st_banner.h);st_banner.h=setTimeout(()=>b.hidden=true,1400)}
function st_tools(on){const tb=$s('#stTools'),rl=$s('#stRail');tb.hidden=!on;rl.hidden=!on;if(!on){for(const id of ['#stInfo','#stBl','#stTp','#stTip','#stLog'])$s(id).hidden=true;return}
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
async function st_retreat(){if(!B||B.busy||B.turn!=='P')return st_toast('Wait for your turn');const c=await st_say('narr','Retreat from this battle? It counts as a defeat (you lose 20% of your gold).',['Retreat','Keep fighting']);if(c===0&&B){st_log('<b>You retreat.</b>');st_endBattle(false)}}
// AUTO: your side fights by itself (same thinking as the enemy, but picks its best art)
function st_autoGo(){if(!B||!B.auto||B.turn!=='P'||B.busy||B.autoRun)return;B.autoRun=true;(async()=>{try{for(const u of B.units.filter(v=>v.side==='P'&&v.hp>0&&!v.done)){if(!B||!B.auto||B.turn!=='P')break;await st_autoAct(u);if(!B)return}}finally{if(B)B.autoRun=false}if(B&&B.auto&&B.turn==='P'&&B.units.some(v=>v.side==='P'&&v.hp>0&&!v.done))st_endTurn()})()}
async function st_autoAct(u){B.sel=u;B.mode='idle';st_fcHide();$s('#stInfo').hidden=true;$s('#stTp').hidden=true;
  const arts=u.arts.filter(k=>u.mp>=ARTS[k].mp).sort((a,b)=>ARTS[b].pow-ARTS[a].pow);let best=null;
  for(const t of st_reach(u))for(const k of arts){const op=st_targetsFor(u,k,t);for(const o of op){const sc=o.hit.length*ARTS[k].pow*100-o.hit.reduce((a,h)=>a+h.hp,0)*.2-(ARTS[k].mp||0);if(!best||sc>best.sc)best={t,k,o,sc}}}
  if(best){await st_moveTo(u,best.t[0],best.t[1]);await st_wait(120);const op=st_targetsFor(u,best.k).find(o=>o.hit[0]===best.o.hit[0])||st_targetsFor(u,best.k)[0];if(op){await st_doAttack(u,best.k,op);return}}
  const foes=B.units.filter(v=>v.side!==u.side&&v.hp>0);if(foes.length){const n=foes.sort((a,b)=>(Math.abs(a.x-u.x)+Math.abs(a.y-u.y))-(Math.abs(b.x-u.x)+Math.abs(b.y-u.y)))[0];let bt=null,bd=1e9;for(const t of st_reach(u)){const d=Math.abs(t[0]-n.x)+Math.abs(t[1]-n.y);if(d<bd){bd=d;bt=t}}if(bt)await st_moveTo(u,bt[0],bt[1])}
  await st_wait(120);if(B)st_finish(u)}
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
  else if(A.shape==='kick'){const L=u.hero&&P.arts.star?Math.max(1,P.arts.star.lv):1;for(const [dx,dy] of DIRS){const tl=[];for(let i=1;i<=L;i++){const X=x+dx*i,Y=y+dy*i;if(!st_inb(X,Y))break;tl.push([X,Y]);const o=st_at(X,Y);if(foe(o)){opts.push({tiles:tl.slice(),hit:[o],click:[[X,Y]],dir:[dx,dy]});break}if(o)break}}}
  else if(A.shape==='aoe'){const N=aoeDepth(u.hero&&P.arts[A.sub||'green']?P.arts.green.lv:1);for(const [dx,dy] of DIRS){const tl=[],hit=[];for(let i=1;i<=N;i++)for(const w of [-1,0,1]){const X=x+dx*i+(dy?w:0),Y=y+dy*i+(dx?w:0);if(!st_inb(X,Y))continue;tl.push([X,Y]);const o=st_at(X,Y);if(foe(o))hit.push(o)}if(hit.length)opts.push({tiles:tl,hit,click:tl,dir:[dx,dy]})}}
  else if(A.shape==='ring'){const wl=u.hero&&P.arts.whirl?P.arts.whirl.lv:1,RD=wl>=3?DIRS.concat([[1,1],[1,-1],[-1,1],[-1,-1]]):DIRS;const hit=[],tl=[];for(const [dx,dy] of RD){const o=st_at(x+dx,y+dy);tl.push([x+dx,y+dy]);if(foe(o))hit.push(o)}if(hit.length)opts.push({tiles:tl.filter(t=>st_inb(t[0],t[1])),hit,click:hit.map(o=>[o.x,o.y])})}
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
const SHORT={basic:['攻','Attack'],palm:['掌','Dragon Palm'],wave:['勁','Palm Force'],green:['青','Green Qi'],tiger:['虎','Tiger Fist'],whirl:['旋','Whirlwind'],star:['星','Star Kick']};
function st_actBar(){const a=$s('#stAct'),bl=$s('#stBl'),tp=$s('#stTp');$s('#stTip').hidden=true;
  if(!B||B.turn!=='P'||B.busy){a.hidden=true;bl.hidden=true;tp.hidden=true;return}
  const u=B.sel;
  if(B.mode==='target'){a.hidden=true;bl.hidden=true;tp.innerHTML=`<div class="skhint"><span>${B.opts&&B.opts.some(o=>o.dir)?'Pick a direction.':'Select a target in range.'}</span><button data-a="cancel">Cancel</button></div>`;tp.hidden=false;
    tp.querySelector('button').onclick=()=>{B.mode='act';B.hl=[];B.pendOpt=null;$s('#stInfo').hidden=true;st_actBar()};return}
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
  const x=Math.floor((px-B.ox)/B.T),y=Math.floor((py-B.oy)/B.T);if(!st_inb(x,y))return;const o=st_at(x,y);if(!(o&&o.side==='E')){if(B.pendFor){B.pendFor=null;B.pend=null;if(B.mode==='idle')B.hl=[]}st_fcHide()}
  if(o&&o.side==='P')st_info(o);else if(!o&&B.mode!=='target'){$s('#stInfo').hidden=true;if(B.mode==='idle'){const tt=st_ter(x,y),td=st_tdef(x,y);st_toast((TNAME[tt]||'Plain')+(tt==='w'?' · impassable':td!==1?' · damage taken ×'+(1/td).toFixed(2):''),1200)}}
  if((B.mode==='idle'||B.mode==='move'||B.mode==='act')&&o&&o.side==='E'){st_quickHit(o);return}
  if(B.mode==='idle'||B.mode==='move'){
    if(o&&o.side==='P'&&!o.done&&(B.mode==='idle'||o!==B.sel)){B.sel=o;B.mode='move';B.orig=[o.x,o.y];B.hl=st_reach(o).map(t=>({t,c:'mv'}));st_actBar();return}
    if(B.mode==='move'&&B.hl.some(h=>h.t[0]===x&&h.t[1]===y)){const u=B.sel;st_moveTo(u,x,y).then(()=>{B.mode='act';B.hl=[];st_actBar()});return}
    if(B.mode==='move'){B.mode='idle';B.sel=null;B.hl=[];st_actBar()}return}
  if(B.mode==='target'){const opt=B.opts.find(op=>op.dir&&B.sel&&B.sel.x+op.dir[0]===x&&B.sel.y+op.dir[1]===y)||B.opts.find(op=>op.click.some(t=>t[0]===x&&t[1]===y));if(!opt)return;if(B.pendOpt===opt){B.pendOpt=null;$s('#stInfo').hidden=true;st_doAttack(B.sel,B.art,opt);return}
    B.pendOpt=opt;B.hl=opt.tiles.map(t=>({t,c:'tg'}));const A=ARTS[B.art],el=$s('#stInfo');el.innerHTML=`<div class="ibody skc"><div class="skn"><b>${A.zh}</b> <span>${A.n}</span></div><div class="skb"><button class="pri" data-go>Use</button><button data-no>Cancel</button></div></div>`;el.hidden=false;el.querySelector('[data-go]').onclick=()=>{B.pendOpt=null;el.hidden=true;st_doAttack(B.sel,B.art,opt)};el.querySelector('[data-no]').onclick=()=>{B.pendOpt=null;st_tgView()}}}
function st_est(u,k,t){const A=ARTS[k],lv=u.hero?(P.arts[A.sub||k]||{lv:1}).lv:1,base=Math.max(1,(u.atk*A.pow*(1+.08*(lv-1))-t.def*.6)/st_tdef(t.x,t.y));return {lo:Math.max(1,Math.round(base*.9)),hi:Math.max(1,Math.round(base*1.1)),hit:Math.round((1-t.dodge)*100)}}
const TNAME={'.':'Plain','f':'Forest','h':'Hill','w':'River','=':'Bridge','p':'Road','c':'Fort'};
function st_face(k,sz){const z=1.7*(sz||84)/84;return k?`background:#3a2c1c url(sprites/${k}.png) ${-72*z}px ${-8*z}px/${4608*z}px auto no-repeat`:''}
function st_info(u,fc){const el=$s('#stInfo');if(!u){el.hidden=true;return}const td=st_tdef(u.x,u.y);
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
  el.hidden=false;el.querySelector('[data-go]').onclick=()=>{const f=B.pend;B.pend=null;B.pendFor=null;el.hidden=true;if(f)f()};
  el.querySelector('[data-no]').onclick=()=>{B.pend=null;B.pendFor=null;el.hidden=true;if(B.mode==='idle')B.hl=[]}}
function st_fcHide(){const el=$s('#stFc');if(el)el.hidden=true}
function st_quickHit(o){let u=B.sel&&!B.sel.done?B.sel:null;if(!u){u=B.units.find(v=>v.hero&&v.hp>0&&!v.done)||B.units.find(v=>v.side==='P'&&v.hp>0&&!v.done)}if(!u)return;
  const hits=(from)=>{for(const k of u.arts){const A=ARTS[k];if(u.mp<A.mp)continue;const op=st_targetsFor(u,k,from).find(op=>op.hit.includes(o));if(op)return {k,op}}return null};
  if(B.pendFor===o&&B.pend){const f=B.pend;B.pend=null;B.pendFor=null;st_fcHide();f();return}
  if(B.mode==='act'){const h=hits();if(h){B.pendFor=o;B.pend=()=>{B.sel=u;st_doAttack(u,h.k,h.op)};$s('#stInfo').hidden=true;st_fcShow(u,h.k,h.op.hit)}else{st_info(o);st_toast('Out of reach')}return}
  let best=null;for(const t of st_reach(u)){const h=hits(t);if(h){const d=Math.abs(t[0]-u.x)+Math.abs(t[1]-u.y);if(!best||d<best.d)best={t,d,h}}}
  if(!best){st_info(o);return st_toast(u.name+' cannot reach '+o.name+' this turn')}
  B.pendFor=o;B.hl=[{t:best.t,c:'mv'},{t:[o.x,o.y],c:'tg'}];B.pend=()=>{B.pendFor=null;B.sel=u;B.hl=[];$s('#stAct').hidden=true;B.busy=true;st_moveTo(u,best.t[0],best.t[1]).then(()=>{B.busy=false;const h=hits();if(h)st_doAttack(u,h.k,h.op);else{B.mode='act';st_actBar()}})};
  $s('#stInfo').hidden=true;st_fcShow(u,best.h.k,best.h.op.hit)}
function st_moveTo(u,x,y){return new Promise(res=>{if(u.x===x&&u.y===y)return res();const fx=u.x,fy=u.y;u.anim={k:'run',t0:performance.now(),dur:260,fx,fy};u.face=x<fx?-1:x>fx?1:u.face;u.x=x;u.y=y;setTimeout(()=>{u.anim=null;res()},270)})}
function st_chooseArt(k){const u=B.sel;
  if(k==='back'){if(B.orig){u.x=B.orig[0];u.y=B.orig[1]}B.mode='move';B.hl=st_reach(u).map(t=>({t,c:'mv'}));st_actBar();return}
  if(k==='wait'){st_finish(u);return}
  if(k==='anti'){P.antidote--;u.poison=0;st_toast('Poison cured');st_finish(u);return}
  if(k==='herb'){P.herbs--;u.hp=Math.min(u.hpMax,u.hp+50);st_toast('+50 HP');st_finish(u);return}
  B.art=k;B.pendOpt=null;B.opts=st_targetsFor(u,k);B.mode='target';st_tgView();st_actBar()}
function st_tgView(){B.hl=[];for(const op of B.opts)if(!op.dir)for(const t of op.hit.length?op.hit.map(o=>[o.x,o.y]):op.tiles)B.hl.push({t,c:'tg2'});$s('#stInfo').hidden=true}
function st_finish(u){u.done=true;B.sel=null;B.mode='idle';B.hl=[];st_actBar();st_checkEnd();if(B&&B.units.filter(v=>v.side==='P'&&v.hp>0).every(v=>v.done))st_endTurn()}
async function st_doAttack(u,k,opt){B.busy=true;$s('#stAct').hidden=true;B.hl=[];const A=ARTS[k];u.mp-=A.mp;
  const res=opt.hit.map(t=>{const lv=u.hero?(P.arts[A.sub||k]||{lv:1}).lv:1;const dodge=Math.random()<t.dodge;let dmg=0,crit=false;
    if(!dodge){crit=Math.random()<.08;dmg=Math.max(1,Math.round((u.atk*A.pow*(1+.08*(lv-1))-t.def*.6)*rnd(.9,1.1)*(crit?1.5:1)/st_tdef(t.x,t.y)))}return {t,dodge,dmg,crit}});
  if(A.shape==='ring'&&u.hero&&P.arts.whirl&&P.arts.whirl.lv>=5)for(const r of res){const dx=Math.sign(r.t.x-u.x),dy=Math.sign(r.t.y-u.y),X=r.t.x+dx,Y=r.t.y+dy;if(!r.dodge&&r.t.hp-r.dmg>0&&Math.random()<.4&&st_inb(X,Y)&&st_pass(X,Y)&&!st_at(X,Y))r.push=[X,Y]}
  await st_fightScene(u,A,res);st_log(`<b>${u.name}</b> · ${A.zh} ${A.n}: `+res.map(r=>`${r.t.name} ${r.dodge?'dodges':'−'+r.dmg+(r.crit?' (critical)':'')+(r.t.hp-r.dmg<=0?' — defeated':'')}`).join(', '));
  for(const r of res){if(!r.dodge){r.t.hp=Math.max(0,r.t.hp-r.dmg);if(r.t.hp<=0&&r.t.side==='E'&&u.side==='P'){B.xp=(B.xp||0)+r.t.xp}}}
  if(A.pass&&opt.dir){const t0=opt.hit[0],bx=t0.x+opt.dir[0],by=t0.y+opt.dir[1];const free=(X,Y)=>st_inb(X,Y)&&st_pass(X,Y)&&!st_at(X,Y);let land=null;if(free(bx,by))land=[bx,by];else{let bd=1e9;for(const [dx,dy] of DIRS){const X=t0.x+dx,Y=t0.y+dy;if(!free(X,Y))continue;const d=Math.abs(X-bx)+Math.abs(Y-by)+(dx===-opt.dir[0]&&dy===-opt.dir[1]?.5:0);if(d<bd){bd=d;land=[X,Y]}}}if(land){u.x=land[0];u.y=land[1];u.face=opt.dir[0]?opt.dir[0]:u.face}}
  for(const r of res)if(r.push&&r.t.hp>0&&!st_at(r.push[0],r.push[1])){r.t.x=r.push[0];r.t.y=r.push[1]}
  if(A.stun){for(const r of res)if(r.t.hp>0&&!r.dodge&&Math.random()<A.stun){r.t.stun=1;st_toast(r.t.name+' is stunned!')}}
  if(A.kb&&opt.dir){for(const r of res)if(r.t.hp>0&&!r.dodge){const X=r.t.x+opt.dir[0],Y=r.t.y+opt.dir[1];if(st_inb(X,Y)&&!st_at(X,Y)){r.t.x=X;r.t.y=Y}}}
  B.busy=false;st_finish(u)}
function st_checkEnd(){if(!B)return;const pe=B.units.filter(v=>v.side==='P'&&v.hp>0),ee=B.units.filter(v=>v.side==='E'&&v.hp>0),hero=B.units.find(v=>v.hero);
  if(!ee.length)return st_endBattle(true);if(hero.hp<=0||!pe.length)return st_endBattle(false)}
async function st_endTurn(){if(!B)return;st_fcHide();B.turn='E';B.sel=null;B.mode='idle';B.hl=[];B.pend=null;B.pendFor=null;$s('#stInfo').hidden=true;st_actBar();st_banner('Enemy turn',1,'Turn '+B.turnN);await st_wait(900/SPD);if(!B)return;
  for(const e of B.units.filter(v=>v.side==='E'&&v.hp>0)){if(!B)return;await st_enemyAct(e);st_checkEnd();if(!B)return}
  B.turn='P';for(const u of B.units){if(u.poison&&u.hp>0&&u.side==='P'){u.hp=Math.max(1,u.hp-6);u.poison--}u.done=false;if(u.hero)u.mp=Math.min(u.mpMax,u.mp+INNER[P.inner].regen)}B.turnN=(B.turnN||1)+1;st_log('Turn '+B.turnN,1);st_banner('Your turn',0,'Turn '+B.turnN);st_actBar();st_tools(true);st_autoGo()}
async function st_enemyAct(e){if(e.stun){e.stun=0;await st_wait(250);return}const k=e.arts[0],ps=B.units.filter(v=>v.side==='P'&&v.hp>0);if(!ps.length)return;
  let best=null;for(const t of st_reach(e)){const op=st_targetsFor(e,k,t);if(op.length){const sc=-(op[0].hit[0].hp)+(op[0].hit[0].hero?15:0);if(!best||sc>best.sc)best={t,sc}}}
  if(best){await st_moveTo(e,best.t[0],best.t[1]);await st_wait(150);const op=st_targetsFor(e,k)[0];if(op){B.busy=true;await st_doAttackE(e,k,op);B.busy=false}return}
  // approach nearest
  const near=ps.sort((a,b)=>(Math.abs(a.x-e.x)+Math.abs(a.y-e.y))-(Math.abs(b.x-e.x)+Math.abs(b.y-e.y)))[0];
  let bt=null,bd=1e9;for(const t of st_reach(e)){const d=Math.abs(t[0]-near.x)+Math.abs(t[1]-near.y);if(d<bd){bd=d;bt=t}}if(bt)await st_moveTo(e,bt[0],bt[1]);await st_wait(120)}
async function st_doAttackE(e,k,opt){const A=ARTS[k];const dz=P.arts.douzhuan;const res=opt.hit.map(t=>{const base=Math.max(1,Math.round((e.atk*A.pow-t.def*.6)*rnd(.9,1.1)/st_tdef(t.x,t.y)));
    if(t.hero&&dz&&dz.lv>=1&&t.mp>=ARTS.douzhuan.mp&&Math.random()<.10+.02*(dz.lv-1)){t.mp-=ARTS.douzhuan.mp;return {t,dodge:false,dmg:0,reflect:Math.max(1,Math.round(base*(.5+.05*(dz.lv-1))))}}
    const dodge=Math.random()<t.dodge;return {t,dodge,dmg:dodge?0:base}});
  await st_fightScene(e,A,res);const ctr=[];st_log(`<b style="color:#ff9a8a">${e.name}</b> · ${A.zh} ${A.n}: `+res.map(r=>`${r.t.name} ${r.reflect?'turns it back (斗轉星移)':r.dodge?'dodges':'−'+r.dmg+(r.t.hp-r.dmg<=0?' — falls':'')}`).join(', '));for(const r of res)if(!r.dodge&&!r.reflect){r.t.hp=Math.max(0,r.t.hp-r.dmg);if(A.poison&&r.t.hp>0&&Math.random()<A.poison){r.t.poison=3;st_toast(r.t.name+' is poisoned!')}}
  for(const r of res){if(!r.reflect||e.hp<=0)continue;await st_shiftScene(r.t,e,A,r.reflect);e.hp=Math.max(0,e.hp-r.reflect);let ex='';
    if(dz.lv>=5&&e.hp>0){if(A.poison){e.poison=3;ex=' · poisoned by its own bell'}if(A.stun&&Math.random()<A.stun){e.stun=1;ex+=' · stunned'}}
    st_log(`<b>You</b> · 斗轉星移: ${e.name} takes its own ${A.zh} −${r.reflect}${ex}${e.hp<=0?' — defeated':''}`);if(e.hp<=0)B.xp=(B.xp||0)+(e.xp||0)}
  const pl=P.arts.plum;for(const r of res){const h=r.t;if(r.reflect||!h.hero||h.hp<=0||e.hp<=0||!pl||pl.lv<1||A.shape==='r2'||Math.abs(h.x-e.x)+Math.abs(h.y-e.y)!==1)continue;if(Math.random()>=.15+.03*(pl.lv-1))continue;
    const dmg=Math.max(1,Math.round((h.atk*ARTS.plum.pow*(1+.08*(pl.lv-1))-e.def*.6)*rnd(.9,1.1)/st_tdef(e.x,e.y)));await st_counterScene(h,e,dmg);e.hp=Math.max(0,e.hp-dmg);
    st_log(`<b>You</b> · 天下梅花手 counter: ${e.name} −${dmg}${e.hp<=0?' — defeated':''}`);if(e.hp<=0)B.xp=(B.xp||0)+(e.xp||0)}}
async function st_endBattle(win){const b=B;if(b.ended)return;b.ended=true;await st_wait(500);
  const hero=b.units.find(v=>v.hero);P.hp=Math.max(1,Math.min(P.hpMax,hero.hp-INNER[P.inner].hp));P.mp=hero.mp;P.poison=hero.poison||0;
  if(win){const xp=(b.xp||0);P.xp+=xp;st_toast('Victory! +'+xp+' XP',2200);
    {const a=P.arts[P.eq];if(a){if(a.xp==null)a.xp=0;a.xp+=Math.floor(xp/2);while(a.lv<(ARTS[P.eq].maxLv||10)&&a.xp>=xpNeed(a.lv)){a.xp-=xpNeed(a.lv);a.lv++;await st_wait(400);st_toast(ARTS[P.eq].n+' rises to level '+a.lv,2400);if(P.eq==='palm'&&[3,5,7,10].includes(a.lv)){await st_wait(2500);st_toast('Palm Force 金龍掌勁: range '+waveLen(a.lv)+' squares',3000)}}}}
    while(P.lv<30&&P.xp>=xpNeed(P.lv)){P.xp-=xpNeed(P.lv);P.lv++;P.hpMax+=14;P.mpMax+=6;P.atk+=3;P.def+=2;P.hp=P.hpMax;P.mp=P.mpMax;await st_wait(300);st_toast('Level up! Level '+P.lv,2400);snd('victory');
    }}
  else{P.gold=Math.floor(P.gold*.8);P.hp=P.hpMax;P.mp=P.mpMax;}
  B=null;$s('#stCv').hidden=true;$s('#stAct').hidden=true;st_tools(false);st_hud();st_save();
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
    if(B.sel===u){c.strokeStyle='#ffd77a';c.lineWidth=3*B.dp;c.strokeRect(B.ox+u.x*T+2,B.oy+u.y*T+2,T-4,T-4)}
    c.fillStyle='rgba(0,0,0,.3)';c.beginPath();c.ellipse(px,py,T*.28,T*.08,0,0,7);c.fill();
    st_drawCell(c,sh,row,fr,px,py,k,face,u.done&&u.side==='P'&&B.turn==='P'?.6:1);
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
  const GD=st_img('art/gdragon.jpg'),GG=st_img('art/gdragon_g.jpg');let DR=null;if(att.hero&&A===ARTS.palm&&P.arts.palm&&P.arts.palm.lv>=5)DR={im:GD,n:1};if(att.hero&&A===ARTS.green&&P.arts.green)DR={im:GG,n:gDragons(P.arts.green.lv)};
  const hitT=res.map((_,i)=>anim==='dash'?1100+i*120:anim==='ranged'?950+i*110:1150+i*140);const hitDone=res.map(()=>false);
  snd(anim==='ranged'?'fx':'swing');
  function frame(){const now=performance.now(),t=(now-t0)*SPD;c.clearRect(0,0,W,H);
    if(bg.complete&&bg.naturalWidth){const s=Math.max(W/bg.naturalWidth,H/bg.naturalHeight);c.drawImage(bg,(W-bg.naturalWidth*s)/2,(H-bg.naturalHeight*s)/2,bg.naturalWidth*s,bg.naturalHeight*s)}
    c.fillStyle='rgba(0,0,0,.18)';c.fillRect(0,0,W,H);
    // banner
    c.fillStyle='rgba(10,8,6,.75)';c.fillRect(0,H*.04,W,H*.11);c.fillStyle='#ffd77a';c.font=`900 ${Math.round(H*.07)}px serif`;c.textAlign='center';c.fillText((A.zh||'')+'  '+A.n,W/2,H*.12);
    // targets
    res.forEach((r2,i)=>{const t2=r2.t,ts=st_sheetOf(t2.sheet),TR=st_rowsOf(ts);let x=X(tx[i]),y=ty[i],row=TR.idle,fr=Math.floor(now/80)%24,al=1;const ht=hitT[i];
      let rot=0,oy=0;const dead=!r2.dodge&&!r2.reflect&&t2.hp-r2.dmg<=0;
      if(r2.reflect){}else if(t>ht&&dead){row=TR.fall;fr=Math.min(23,Math.floor((t-ht)/30))}else{const rc=st_react(t,ht,r2.dodge,TR,W,H,mir);if(rc){x+=rc.ox;oy=rc.oy;rot=rc.rot;if(rc.row!=null){row=rc.row;fr=rc.fr}}}
      c.fillStyle='rgba(0,0,0,.3)';c.beginPath();c.ellipse(x,y,k*40*(1+oy/(H*.2)),k*9,0,0,7);c.fill();
      st_drawRot(c,ts,row,fr,x,y+oy,k,-mir,al,rot);
      if(t>ht&&!r2.dodge&&!r2.reflect&&t<ht+120){c.save();c.globalCompositeOperation='lighter';c.fillStyle='rgba(255,240,200,.22)';c.beginPath();c.arc(x,y-k*60,k*32,0,7);c.fill();c.restore()}
      if(t>ht&&!hitDone[i]){hitDone[i]=true;pops.push({x,y:y-k*120,t:now,txt:r2.reflect?'斗轉星移!':r2.dodge?'Dodge!':(r2.crit?'Critical '+r2.dmg:''+r2.dmg),col:r2.reflect?'#9fd0ff':r2.dodge?'#9fd7ff':r2.crit?'#ffd23a':'#fff'});if(r2.reflect){snd('fx')}else if(!r2.dodge){snd('hit');for(let j=0;j<18;j++){const a=Math.random()*6.28,v=rnd(2,7)*dp;parts.push({x,y:y-k*60,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:1,col:A.fx})}}else snd('swing')}});
    // attacker
    let ax=X(ax0),row=R.idle,fr=Math.floor(now/80)%24;const last=X(tx[n-1]),first=X(tx[0]);
    if(anim==='dash'){const a0=400,a1=1900;if(t>=a0&&t<a1){const q=(t-a0)/(a1-a0);row=R.dash;fr=Math.min(23,Math.floor(q*24));const dest=pierce?last+mir*W*.08:first-mir*W*.1;if(q<.2)ax=X(ax0);else if(q<.6)ax=lerp2(X(ax0),dest,ease2((q-.2)/.4));else ax=dest}
      else if(t>=a1){const q=clamp01((t-a1)/350),dest=pierce?last+mir*W*.08:first-mir*W*.1;ax=lerp2(dest,X(ax0),ease2(q));row=R.run;fr=Math.floor(now/40*(typeof RM==='function'?RM(sh)/2:1))%24}}
    else if(anim==='melee'){const dest=pierce?last+mir*W*.08:first-mir*W*.11;if(t>=300&&t<800){row=R.run;fr=Math.floor(now/40)%24;ax=lerp2(X(ax0),dest,ease2((t-300)/500))}else if(t>=800&&t<1700){row=mrow;fr=Math.min(23,Math.floor((t-800)/900*24));ax=pierce?lerp2(dest-mir*W*.2,dest,clamp01((t-800)/600)):dest}else if(t>=1700){if(stay){ax=dest}else{row=R.run;fr=Math.floor(now/40)%24;ax=lerp2(dest,X(ax0),ease2(clamp01((t-1700)/350)))}}}
    else{if(t>=350&&t<1500){row=A.anim2&&R[A.anim2]!=null?R[A.anim2]:R.ranged;fr=Math.min(23,Math.floor((t-350)/1150*24))}
      if(t>800&&t<800+170*n+300){const q=clamp01((t-800)/(150*n+200));const px=lerp2(X(ax0)+mir*W*.06,last+mir*W*.05,q),py=gy-k*62;c.save();c.globalCompositeOperation='lighter';for(let j=0;j<5;j++){c.fillStyle=A.fx;c.globalAlpha=.25-j*.04;c.beginPath();c.arc(px-mir*j*k*10,py,k*(22-j*2),0,7);c.fill()}c.restore()}}
    c.fillStyle='rgba(0,0,0,.3)';c.beginPath();c.ellipse(ax,gy,k*40,k*9,0,0,7);c.fill();
    if(R.dash==null&&anim==='melee'&&row===R.melee)row=R.melee;
    const face=(!stay&&anim!=='ranged'&&t>=(anim==='dash'?1900:1700))?-mir:stay&&t>=1700?-mir:mir;st_drawCell(c,sh,row,fr,ax,gy,k,face);
    if(DR&&DR.im.complete&&DR.im.naturalWidth){for(let j=0;j<DR.n;j++){const ti=j%n,h0=hitT[ti]+j*60,a=h0-380,b=h0+700;if(t>=a&&t<b){const dt=t-a,f=Math.min(35,Math.floor(dt/(b-a)*36)),q=clamp01(dt/380),tx0=X(tx[ti]),sx=ax+mir*k*55,px=lerp2(sx,tx0,ease2(q)),oy=(j-(DR.n-1)/2)*k*38,py=ty[ti]-k*64+oy*(1-q*.6),dw=k*(DR.n>1?240:300),dh=dw/2;
      c.save();c.globalCompositeOperation='lighter';c.globalAlpha=t>b-200?(b-t)/200:1;if(mir<0){c.translate(px,0);c.scale(-1,1);c.translate(-px,0)}st_softDraw(c,DR.im,(f%6)*240,Math.floor(f/6)*120,240,120,px-dw*.55,py-dh/2,dw,dh);c.restore()}}}
    // particles + popups
    for(const p of parts){p.x+=p.vx;p.y+=p.vy;p.vy+=.2*dp;p.l-=.03;if(p.l>0){c.globalAlpha=p.l;c.fillStyle=p.col;c.fillRect(p.x,p.y,4*dp,4*dp)}}c.globalAlpha=1;
    for(const p of pops){const q=(now-p.t)/900;if(q>1)continue;c.globalAlpha=1-q;c.fillStyle=p.col;c.strokeStyle='#000';c.lineWidth=4*dp;c.font=`900 ${Math.round(H*.075)}px sans-serif`;c.textAlign='center';c.strokeText(p.txt,p.x,p.y-q*40*dp);c.fillText(p.txt,p.x,p.y-q*40*dp)}c.globalAlpha=1;
    // name plates
    c.font=`700 ${Math.round(H*.04)}px sans-serif`;c.textAlign='left';c.fillStyle='#fff';c.fillText(att.name,mir>0?W*.03:W*.6,H*.95);
    if(t<dur&&!skip)requestAnimationFrame(frame);else{cv.hidden=true;cv.onpointerdown=null;done()}}
  let skip=false;cv.onpointerdown=()=>{if(performance.now()-t0>300)skip=true};requestAnimationFrame(frame)})}

// 斗轉星移: a solar system turns in front of him, swallows the blow and flings it back at its owner
function st_solar(c,x,y,R,a,al){c.save();c.globalAlpha=al;c.translate(x,y);
  const g=c.createRadialGradient(0,0,0,0,0,R*1.15);g.addColorStop(0,'rgba(120,170,255,.28)');g.addColorStop(.6,'rgba(40,60,160,.18)');g.addColorStop(1,'rgba(10,10,40,0)');c.fillStyle=g;c.beginPath();c.arc(0,0,R*1.15,0,7);c.fill();
  for(let i=0;i<40;i++){const sa=i*2.4+a*.05,sr=R*(.15+((i*37)%100)/100*.95);c.fillStyle=`rgba(255,255,255,${.35+.4*Math.sin(a*3+i)})`;c.fillRect(Math.cos(sa)*sr,Math.sin(sa)*sr*.42,2,2)}
  const PL=[[.30,.09,'#c9b6a0',4.1],[.44,.12,'#f0c070',2.9],[.58,.13,'#4aa0ff',2.2],[.70,.11,'#ff6a40',1.8],[.86,.2,'#e8b070',1.1],[1.0,.17,'#f3e0a0',.8]];
  const draw=front=>{for(const [o,s,col,sp] of PL){const an=a*sp+o*9,px=Math.cos(an)*R*o,py=Math.sin(an)*R*o*.38;if((py>0)!==front)continue;const pr=R*s*.32;const pg=c.createRadialGradient(px-pr*.4,py-pr*.4,pr*.1,px,py,pr);pg.addColorStop(0,'#fff');pg.addColorStop(.35,col);pg.addColorStop(1,'rgba(0,0,0,.85)');c.fillStyle=pg;c.beginPath();c.arc(px,py,pr,0,7);c.fill();if(o===.86){c.strokeStyle='rgba(240,210,150,.8)';c.lineWidth=2;c.beginPath();c.ellipse(px,py,pr*1.9,pr*.55,-.3,0,7);c.stroke()}}};
  c.lineWidth=1.2;for(const [o] of PL){c.strokeStyle='rgba(170,210,255,.35)';c.beginPath();c.ellipse(0,0,R*o,R*o*.38,0,0,7);c.stroke()}
  draw(false);const sg=c.createRadialGradient(0,0,0,0,0,R*.2);sg.addColorStop(0,'#fff8d0');sg.addColorStop(.4,'#ffd040');sg.addColorStop(1,'rgba(255,120,0,0)');c.globalCompositeOperation='lighter';c.fillStyle=sg;c.beginPath();c.arc(0,0,R*.2,0,7);c.fill();c.globalCompositeOperation='source-over';draw(true);c.restore()}
function st_shiftScene(h,e,A,dmg){return new Promise(done=>{const cv=$s('#stFight');cv.hidden=false;const r=cv.getBoundingClientRect(),dp=Math.min(2,window.devicePixelRatio||1);cv.width=r.width*dp;cv.height=r.height*dp;
  const W=cv.width,H=cv.height,c=cv.getContext('2d'),k=.4*H/114,gy=H*.86,bg=B.bg,sh=st_sheetOf(h.sheet),R=st_rowsOf(sh),es=st_sheetOf(e.sheet),ER=st_rowsOf(es),dur=3000,pops=[],parts=[];
  const hx=W*.3,ex=W*.74,sx=W*.47,sy=gy-k*70,SR=Math.min(W*.2,H*.42),ranged=A.shape==='r2'||A.anim==='ranged';const t0=performance.now();let skip=false,hitDone=false;
  snd('fx');cv.onpointerdown=()=>{if(performance.now()-t0>300)skip=true};
  function frame(){const now=performance.now(),t=(now-t0)*SPD;c.clearRect(0,0,W,H);
    if(bg.complete&&bg.naturalWidth){const s=Math.max(W/bg.naturalWidth,H/bg.naturalHeight);c.drawImage(bg,(W-bg.naturalWidth*s)/2,(H-bg.naturalHeight*s)/2,bg.naturalWidth*s,bg.naturalHeight*s)}
    c.fillStyle=`rgba(6,10,40,${.25+.35*clamp01(t/400)*(t<2500?1:clamp01((3000-t)/500))})`;c.fillRect(0,0,W,H);
    c.fillStyle='rgba(10,8,6,.75)';c.fillRect(0,H*.04,W,H*.11);c.fillStyle='#bfe0ff';c.font=`900 ${Math.round(H*.065)}px serif`;c.textAlign='center';c.fillText('斗轉星移  —  以彼之道，還施彼身',W/2,H*.12);
    // solar system: grows, spins (fast while it swallows the blow), then fades
    const g=t<350?ease2(t/350):t<2300?1:clamp01(1-(t-2300)/500),spin=t/1000*(t>700&&t<1500?3.2:1.1);if(g>0)st_solar(c,sx,sy,SR*(.4+.6*g),spin,g);
    // hero: palms out, guiding the system (two-palm row until the Grok clip arrives)
    const hr=R.shift!=null?R.shift:R.twin!=null?R.twin:R.ranged;st_drawCell(c,sh,t<2400?hr:R.idle,t<2400?Math.min(23,Math.floor(t/2400*24)):Math.floor(now/80)%24,hx,gy,k,1);
    // the stolen blow: an orb of the enemy's own power orbits the sun, then flies back
    const fx=A.fx||'#ffd27a';if(t>500&&t<1900){let ox,oy;if(t<800){const q=(t-500)/300;ox=lerp2(ex-W*.06,sx,ease2(q));oy=lerp2(gy-k*60,sy,q)}else if(t<1500){const an=(t-800)/700*Math.PI*4;ox=sx+Math.cos(an)*SR*.55;oy=sy+Math.sin(an)*SR*.2}else{const q=(t-1500)/400;ox=lerp2(sx+SR*.55,ex,ease2(q));oy=lerp2(sy,gy-k*60,q)}
      c.save();c.globalCompositeOperation='lighter';for(let j=0;j<5;j++){c.globalAlpha=.5-j*.08;c.fillStyle=fx;c.beginPath();c.arc(ox,oy,k*(16-j*2.5)*(1+j*.4),0,7);c.fill()}c.restore();parts.push({x:ox,y:oy,vx:rnd(-1,1)*dp,vy:rnd(-1,1)*dp,l:.8,col:fx})}
    // the ghost of his own move hits the enemy (close-range attacks)
    const ht=1880;if(!ranged&&t>1500&&t<2300){const q=clamp01((t-1500)/380),gx=lerp2(ex-W*.28,ex-W*.1,ease2(q));c.save();c.globalAlpha=.32*(t<2100?1:clamp01((2300-t)/200));st_drawCell(c,es,ER.melee!=null?ER.melee:ER.idle,Math.min(23,Math.floor(q*20)),gx,gy,k,1);c.restore()}
    // enemy: hit by its own attack
    let erow=ER.idle,efr=Math.floor(now/80)%24,eox=0,erot=0;const dead=e.hp-dmg<=0;
    if(t>ht){if(dead){erow=ER.fall;efr=Math.min(23,Math.floor((t-ht)/30))}else{const rc=st_react(t,ht,false,ER,W,H,1);if(rc){eox=rc.ox;erot=rc.rot;if(rc.row!=null){erow=rc.row;efr=rc.fr}}}}
    if(t>ht&&!hitDone){hitDone=true;snd('hit');pops.push({x:ex,y:gy-k*125,t:now,txt:'Reflected '+dmg});for(let j=0;j<20;j++){const a=Math.random()*6.28,v=rnd(2,7)*dp;parts.push({x:ex,y:gy-k*60,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:1,col:fx})}}
    c.fillStyle='rgba(0,0,0,.3)';c.beginPath();c.ellipse(ex+eox,gy,k*40,k*9,0,0,7);c.fill();st_drawRot(c,es,erow,efr,ex+eox,gy,k,-1,1,erot);
    for(const p of parts){p.x+=p.vx;p.y+=p.vy;p.l-=.035;if(p.l>0){c.globalAlpha=p.l;c.fillStyle=p.col;c.fillRect(p.x,p.y,3*dp,3*dp)}}c.globalAlpha=1;if(parts.length>400)parts.splice(0,parts.length-400);
    for(const p of pops){const q=(now-p.t)/1000;if(q>1)continue;c.globalAlpha=1-q;c.fillStyle='#bfe0ff';c.strokeStyle='#000';c.lineWidth=4*dp;c.font=`900 ${Math.round(H*.075)}px sans-serif`;c.textAlign='center';c.strokeText(p.txt,p.x,p.y-q*40*dp);c.fillText(p.txt,p.x,p.y-q*40*dp)}c.globalAlpha=1;
    c.font=`700 ${Math.round(H*.04)}px sans-serif`;c.textAlign='left';c.fillStyle='#fff';c.fillText(h.name,W*.03,H*.95);
    if(t<dur&&!skip)requestAnimationFrame(frame);else{cv.hidden=true;cv.onpointerdown=null;done()}}
  requestAnimationFrame(frame)})}

// 天下梅花手 counter: a storm of palms, fists and elbows with plum blossoms in the air
function st_plum(c,x,y,r,rot,al){c.save();c.globalAlpha=al;c.translate(x,y);c.rotate(rot);for(let i=0;i<5;i++){c.rotate(Math.PI*2/5);c.beginPath();c.ellipse(0,-r*.62,r*.42,r*.55,0,0,7);c.fillStyle='#ffc2d4';c.fill();c.lineWidth=Math.max(1,r*.08);c.strokeStyle='#ff7fa6';c.stroke()}c.beginPath();c.arc(0,0,r*.24,0,7);c.fillStyle='#ffe28a';c.fill();c.restore()}
function st_counterScene(h,e,dmg){return new Promise(done=>{const cv=$s('#stFight');cv.hidden=false;const r=cv.getBoundingClientRect(),dp=Math.min(2,window.devicePixelRatio||1);cv.width=r.width*dp;cv.height=r.height*dp;
  const W=cv.width,H=cv.height,c=cv.getContext('2d'),k=.42*H/114,gy=H*.86,bg=B.bg,sh=st_sheetOf(h.sheet),R=st_rowsOf(sh),es=st_sheetOf(e.sheet),ER=st_rowsOf(es),dur=2600,petals=[],pops=[];
  const hx=W*.4,ex0=W*.6,N=6,hits=Array.from({length:N},(_,i)=>650+i*170),parts=[];const t0=performance.now();let skip=false,hd=0;
  for(let i=0;i<34;i++)petals.push({x:Math.random()*W*1.1,y:rnd(-.25,.75)*H,vx:rnd(-1.4,-.3)*dp,vy:rnd(.6,1.5)*dp,r:rnd(9,17)*dp,rot:Math.random()*6,vr:rnd(-.05,.05),born:200+Math.random()*900});
  snd('swing');cv.onpointerdown=()=>{if(performance.now()-t0>300)skip=true};
  function frame(){const now=performance.now(),t=(now-t0)*SPD;c.clearRect(0,0,W,H);
    if(bg.complete&&bg.naturalWidth){const s=Math.max(W/bg.naturalWidth,H/bg.naturalHeight);c.drawImage(bg,(W-bg.naturalWidth*s)/2,(H-bg.naturalHeight*s)/2,bg.naturalWidth*s,bg.naturalHeight*s)}
    c.fillStyle='rgba(40,0,20,.22)';c.fillRect(0,0,W,H);
    c.fillStyle='rgba(10,8,6,.75)';c.fillRect(0,H*.04,W,H*.11);c.fillStyle='#ffc2d4';c.font=`900 ${Math.round(H*.07)}px serif`;c.textAlign='center';c.fillText('天下梅花手  Plum Blossom Hand — Counter!',W/2,H*.12);
    // enemy: staggers with every blow, knocked back by the last
    let ex=ex0,erow=ER.idle,efr=Math.floor(now/80)%24,erot=0;const lastH=hits[N-1];
    if(t>hits[0]){const q=(t-hits[0])/(lastH-hits[0]+500);ex=ex0+W*.012*Math.sin(t/25)*(t<lastH?1:0)+(t>lastH?W*.07*ease2(clamp01((t-lastH)/300)):0);
      if(ER.fall===4){erow=4;efr=t<lastH+500?2+Math.floor((t/60)%6):Math.max(0,7-Math.floor((t-lastH-500)/40))}else erot=.18*Math.sin(Math.min(1,q)*Math.PI)}
    c.fillStyle='rgba(0,0,0,.3)';c.beginPath();c.ellipse(ex,gy,k*40,k*9,0,0,7);c.fill();st_drawRot(c,es,erow,efr,ex,gy,k,-1,1,erot);
    // hero: steps in, flurry, steps back
    let hx2=hx,row=R.idle,fr=Math.floor(now/80)%24;const pr=R.plum!=null?R.plum:null;
    if(t>=350&&t<lastH+350){hx2=lerp2(hx,ex0-W*.1,ease2(clamp01((t-350)/250)));if(pr!=null){row=pr;fr=Math.min(23,Math.floor((t-450)/(lastH-100)*24))}else{const seg=Math.floor((t-500)/170)%3;row=seg===2?R.melee:R.punch;fr=Math.min(23,8+Math.floor(((t-500)%170)/170*12))}}
    else if(t>=lastH+350){hx2=lerp2(ex0-W*.1,hx,ease2(clamp01((t-lastH-350)/300)))}
    c.fillStyle='rgba(0,0,0,.3)';c.beginPath();c.ellipse(hx2,gy,k*40,k*9,0,0,7);c.fill();st_drawCell(c,sh,row,fr,hx2,gy,k,1);
    // blows: flashes + petals burst
    hits.forEach((ht,i)=>{if(t>ht&&i>=hd){hd=i+1;snd('hit');const px=ex-W*.03,py=gy-k*(50+((i*37)%40));for(let j=0;j<7;j++){const a=Math.random()*6.28,v=rnd(3,8)*dp;petals.push({x:px,y:py,vx:Math.cos(a)*v,vy:Math.sin(a)*v-2.5*dp,r:rnd(8,14)*dp,rot:Math.random()*6,vr:rnd(-.15,.15),born:0,burst:1,t0:t})}
        for(let j=0;j<8;j++){const a=Math.random()*6.28,v=rnd(2,6)*dp;parts.push({x:px,y:py,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:1})}
        if(i===N-1)pops.push({x:ex,y:gy-k*125,t:now,txt:''+dmg})}});
    hits.forEach(ht=>{if(t>ht&&t<ht+90){c.save();c.globalCompositeOperation='lighter';c.fillStyle='rgba(255,200,220,.18)';c.beginPath();c.arc(ex-W*.03,gy-k*65,k*24,0,7);c.fill();c.restore()}});
    for(const p of petals){if(t<p.born)continue;p.x+=p.vx;p.y+=p.vy;if(p.burst){p.vx*=.97;p.vy=p.vy*.97+.06*dp}p.rot+=p.vr;const al=p.burst?clamp01(1-(t-p.t0)/900):clamp01((t-p.born)/400);if(al<=0)continue;st_plum(c,p.x,p.y,p.r,p.rot,al*.95)}
    for(const p of parts){p.x+=p.vx;p.y+=p.vy;p.vy+=.2*dp;p.l-=.04;if(p.l>0){c.globalAlpha=p.l;c.fillStyle='#ffe3ec';c.fillRect(p.x,p.y,4*dp,4*dp)}}c.globalAlpha=1;
    for(const p of pops){const q=(now-p.t)/900;if(q>1)continue;c.globalAlpha=1-q;c.fillStyle='#ffc2d4';c.strokeStyle='#000';c.lineWidth=4*dp;c.font=`900 ${Math.round(H*.08)}px sans-serif`;c.textAlign='center';c.strokeText(p.txt,p.x,p.y-q*40*dp);c.fillText(p.txt,p.x,p.y-q*40*dp)}c.globalAlpha=1;
    c.font=`700 ${Math.round(H*.04)}px sans-serif`;c.textAlign='left';c.fillStyle='#fff';c.fillText(h.name,W*.03,H*.95);
    if(t<dur&&!skip)requestAnimationFrame(frame);else{cv.hidden=true;cv.onpointerdown=null;done()}}
  requestAnimationFrame(frame)})}

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
window.__ST={B:()=>B,P:()=>P,tap(x,y){const cv=document.querySelector('#stCv'),r=cv.getBoundingClientRect();st_onTap({clientX:r.left+(B.ox+(x+.5)*B.T)/B.dp,clientY:r.top+(B.oy+(y+.5)*B.T)/B.dp,currentTarget:cv})},targets:(u,k)=>st_targetsFor(u,k),reach:u=>st_reach(u)};
})();
