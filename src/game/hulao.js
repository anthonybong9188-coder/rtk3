// ===== Hu Lao Gate: test battlefield — five heroines vs Lü Bu =====
async function startHulao(){
  const sv=save;save=()=>{};try{newCampaign('easy')}finally{save=sv}
  S.hulao=true;PORT.lubu='lu_bu';PORT.xiaoming='xiao_ming';PORT.xiaohei='xiao_hei';PORT.jiangchen='jiang_chen';
  const W5=['diaochan','guanyinping','huangyueying','caiwenji','sunshangxiang'],pos=[[2,1],[2,3],[1,4],[2,5],[2,7]];
  const units=W5.map((id,i)=>{const g=S.gens[id];return {id,name:g.name,ch:g.ch,side:'shu',type:g.type,war:g.war,int:g.int,troops:5000,x:pos[i][0],y:pos[i][1],cmd:i===0,train:80}});
  units.push({id:'xiaoming',name:'Xiao Ming',ch:'明',side:'wei',type:'peasant',war:42,int:35,troops:500,x:COLS-2,y:1,train:40},{id:'xiaohei',name:'Xiao Hei',ch:'黑',side:'wei',type:'peasant',war:48,int:28,troops:500,x:COLS-2,y:ROWS-2,train:40});
  units.push({id:'jiangchen',name:'Jiang Chen',ch:'屍',side:'wei',type:'undead',war:66,int:88,troops:500,x:COLS-1,y:3,train:90});
  units.push({id:'tigerking',name:'Tiger pack',ch:'虎',side:'wei',type:'tiger',war:85,int:20,troops:500,x:COLS-3,y:6,train:90});
  units.push({id:'wolfking',name:'Wolf pack',ch:'狼',side:'wei',type:'wolf',war:75,int:25,troops:400,x:COLS-3,y:2,train:85});
  units.push({id:'lubu',name:'Lü Bu',ch:'呂',side:'wei',type:'cav',war:100,int:30,troops:20000,x:COLS-3,y:4,cmd:true,train:90});
  window.BTHEME='pass';
  const r=await startBattle({units,foe:'han',walls:0,hulao:true,map:genBattleMap('N',false,Math.floor(Math.random()*1e6),'pass'),playerAttacks:true,
    title:'Battle of Hu Lao Gate',sub:'Five heroines stand against the unrivalled Lü Bu with peasant levies and Jiang Chen’s undead horde · easy mode'});
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
