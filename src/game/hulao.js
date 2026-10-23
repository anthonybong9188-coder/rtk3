// ===== Hu Lao Gate: test battlefield — five heroines vs Lü Bu =====
async function startHulao(){
  const sv=save;save=()=>{};try{newCampaign('easy')}finally{save=sv}
  S.hulao=true;PORT.lubu='lu_bu';
  const W5=['diaochan','guanyinping','huangyueying','huangwenjing','sunshangxiang'],pos=[[2,1],[2,3],[1,4],[2,5],[2,7]];
  const units=W5.map((id,i)=>{const g=S.gens[id];return {id,name:g.name,ch:g.ch,side:'shu',type:g.type,war:g.war,int:g.int,troops:5000,x:pos[i][0],y:pos[i][1],cmd:i===0,train:80}});
  units.push({id:'lubu',name:'Lü Bu',ch:'呂',side:'wei',type:'cav',war:100,int:30,troops:20000,x:COLS-3,y:4,cmd:true,train:90});
  window.BTHEME='pass';
  const r=await startBattle({units,foe:'han',walls:0,hulao:true,map:genBattleMap('N',false,Math.floor(Math.random()*1e6),'pass'),playerAttacks:true,
    title:'Battle of Hu Lao Gate',sub:'Five heroines stand against the unrivalled Lü Bu · easy mode'});
  S=null;showScreen('title');renderTitle();
}
