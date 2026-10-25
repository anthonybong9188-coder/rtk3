// ===== Hu Lao Gate: test battlefield — five heroes vs Lü Bu =====
async function startHulao(){
  const sv=save;save=()=>{};try{newCampaign('easy')}finally{save=sv}
  S.hulao=true;PORT.lubu='lu_bu';PORT.xiaoming='xiao_ming';PORT.xiaohei='xiao_hei';PORT.jiangchen='jiang_chen';
  const W5=['hero','monu','xuannu','huangyi','renrui'];PORT.hero='hero';PORT.monu='mo_nu';PORT.xuannu='xuannu';PORT.huangyi='huang_yi';PORT.renrui='ren_rui';
  const HX={hero:{name:'The Hero',ch:'俠',type:'cav',war:95,int:85}};
  const mid=Math.floor(ROWS/2),pos=[[1,mid],[1,mid-1],[1,mid+1],[1,mid-2],[1,mid+2]];
  const units=W5.map((id,i)=>{const d=GEN_DEF.find(x=>x[0]===id),g=HX[id]||{name:d[1],ch:d[2],type:d[9],war:d[5],int:d[6]};return {id,name:g.name,ch:g.ch,side:'shu',type:g.type,war:g.war,int:g.int,troops:12000,x:pos[i][0],y:pos[i][1],cmd:i===0,train:90}});
  units.push({id:'xiaoming',name:'Xiao Ming',ch:'明',side:'wei',type:'peasant',war:42,int:35,troops:2000,x:COLS-2,y:1,train:40},{id:'xiaohei',name:'Xiao Hei',ch:'黑',side:'wei',type:'peasant',war:48,int:28,troops:2000,x:COLS-2,y:ROWS-2,train:40});
  units.push({id:'jiangchen',name:'Jiang Chen',ch:'屍',side:'wei',type:'undead',war:66,int:88,troops:2000,x:COLS-1,y:3,train:90});
  units.push({id:'tigerking',name:'Tiger pack',ch:'虎',side:'wei',type:'tiger',war:85,int:20,troops:2000,x:COLS-3,y:6,train:90});
  units.push({id:'wolfking',name:'Wolf pack',ch:'狼',side:'wei',type:'wolf',war:75,int:25,troops:1600,x:COLS-3,y:2,train:85});
  units.push({id:'lubu',name:'Lü Bu',ch:'呂',side:'wei',type:'cav',war:100,int:30,troops:20000,x:COLS-3,y:4,cmd:true,train:90});
  window.BTHEME='pass';
  const r=await startBattle({units,foe:'han',walls:0,hulao:true,map:genBattleMap('N',false,Math.floor(Math.random()*1e6),'pass'),playerAttacks:true,
    title:'Battle of Hu Lao Gate',sub:'The Hero, Mo Nü, Jiutian Xuannü, Huang Yi and Ren Rui stand against the unrivalled Lü Bu with peasant levies and Jiang Chen’s undead horde · easy mode'});
  S=null;showScreen('title');renderTitle();
}
function battleStats(win){
  if(!G.roster)return;const box=$('#mStats'),img=$('#mImg'),D=G.dealt||{};
  const row=r=>{const ds=n=>r.id==='tigerking'?Math.ceil(n/5):r.id==='wolfking'?Math.ceil(n/2):n;const u=G.units.find(x=>x.id===r.id),t=u?u.troops:0,hm=r.hpMax||0,sol=Math.max(0,t-hm),hp=Math.min(hm,Math.max(0,t));
    return `<tr class="${r.side==='shu'?'fr':'fo'}${u?'':' dead'}"><td>${PORT[r.id]?`<img src="portraits/${PORT[r.id]}.webp" alt="">`:''}<b>${r.name}</b></td><td>${u?`${hp}/${hm}`:'—'}</td><td>${u?`${ds(sol)}/${ds(r.max-hm)}`:'fallen'}</td><td>${(D[r.id]||0).toLocaleString()}</td></tr>`};
  const mine=G.roster.filter(r=>r.side==='shu'),mvp=mine.slice().sort((a,b)=>(D[b.id]||0)-(D[a.id]||0))[0];
  box.innerHTML=`<table class="rstat"><tr><th></th><th>Hero</th><th>Soldiers</th><th>Damage</th></tr>${G.roster.map(row).join('')}</table>${mvp&&D[mvp.id]?`<p class="mvp">★ MVP · <b>${mvp.name}</b> · ${D[mvp.id].toLocaleString()} damage</p>`:''}`;
  const pick=G.cfg.hulao?(win?(mvp&&mvp.id):'lubu'):(win?(mvp&&mvp.id):null),p=pick&&PORT[pick];
  if(p){img.src=`portraits/${p}.webp`;img.hidden=false}else img.hidden=true}
