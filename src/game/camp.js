// =====================================================================
// CAMPAIGN · grand strategy layer
// =====================================================================
const FACS={
  shu:{name:'Liu Bei',short:'Shu',zh:'蜀',main:'#4f9a5a',dark:'#2c5a34',light:'#86cc90',ruler:'liubei',gold:1500,rice:30000,ai:null},
  wei:{name:'Cao Cao',short:'Wei',zh:'魏',main:'#4a78c0',dark:'#28457a',light:'#8fb2ea',ruler:'caocao',gold:4000,rice:150000,ai:'aggressive'},
  wu:{name:'Sun Quan',short:'Wu',zh:'吳',main:'#c4473a',dark:'#7e2a21',light:'#e88b7f',ruler:'sunquan',gold:2500,rice:80000,ai:'defensive'},
  han:{name:'Han Xuan',short:'Han Xuan',zh:'韓',main:'#a3824a',dark:'#5c4826',light:'#dcc08a',ruler:'hanxuan',gold:500,rice:9000,ai:'passive'},
  jin:{name:'Jin Xuan',short:'Jin Xuan',zh:'金',main:'#8d6e57',dark:'#54402f',light:'#d0b298',ruler:'jinxuan',gold:400,rice:7000,ai:'passive'},
  liu:{name:'Liu Du',short:'Liu Du',zh:'度',main:'#93865a',dark:'#575031',light:'#d2c79a',ruler:'liudu',gold:400,rice:7000,ai:'passive'},
  zhao:{name:'Zhao Fan',short:'Zhao Fan',zh:'範',main:'#9a7461',dark:'#5b4235',light:'#d8b4a3',ruler:'zhaofan',gold:400,rice:6000,ai:'passive'}
};
// id, name, zh, x%, y%, owner, troops, farm, farmMax, com, comMax, walls, order, pop(k), training
const CITY_DEF=[
  ['xuchang','Xuchang','許昌',52,14,'wei',25000,900,1000,800,1000,90,85,600,70],
  ['wancheng','Wancheng','宛城',34.1,29.5,'wei',8000,500,700,400,600,70,75,250,70],
  ['runan','Runan','汝南',60.5,35,'wei',7000,600,800,350,600,60,70,300,65],
  ['hefei','Hefei','合肥',69.7,52.3,'wei',10000,450,700,350,600,80,75,200,75],
  ['xiangyang','Xiangyang','襄陽',34.1,46.6,'wei',12000,600,800,600,800,85,65,400,70],
  ['jiangling','Jiangling','江陵',31.1,72.7,'wei',35000,650,900,500,800,80,60,350,70],
  ['jiangxia','Jiangxia','江夏',46.2,63.6,'shu',15000,450,800,300,600,65,75,180,65],
  ['chaisang','Chaisang','柴桑',62.1,72.7,'wu',18000,500,800,450,700,70,80,200,70],
  ['jianye','Jianye','建業',85.6,62.5,'wu',20000,700,900,700,900,85,85,400,65],
  ['kuaiji','Kuaiji','會稽',86.4,86.5,'wu',8000,550,800,400,700,60,75,250,60],
  ['wuling','Wuling','武陵',18.9,84.0,'jin',5000,350,700,200,500,45,60,150,50],
  ['changsha','Changsha','長沙',47.7,82.0,'han',8000,500,800,350,600,60,65,250,60],
  ['lingling','Lingling','零陵',31.0,90.5,'liu',5000,380,700,220,500,45,60,150,50],
  ['guiyang','Guiyang','桂陽',57.0,91.0,'zhao',4000,360,700,200,500,40,60,130,50]];
const ROUTES=[['xuchang','wancheng',1],['xuchang','runan',1],['runan','hefei',1],['wancheng','xiangyang',1],['xiangyang','jiangling',1],
  ['xiangyang','jiangxia',2],['runan','jiangxia',2],['jiangling','jiangxia',2,1],['jiangling','wuling',1],['jiangling','changsha',2],
  ['jiangxia','chaisang',1,1],['jiangxia','changsha',2],['chaisang','jianye',2,1],['hefei','jianye',1,1],['jianye','kuaiji',2],
  ['chaisang','changsha',2],['wuling','lingling',1],['changsha','lingling',1],['changsha','guiyang',1],['lingling','guiyang',1]];
// id, name, token char, faction, city, war, int, pol, cha, troop type, portrait, loyalty, hidden
const GEN_DEF=[
  ['liubei','Liu Bei','劉','shu','jiangxia',72,78,80,99,'shield','liu_bei',100],
  ['guanyu','Guan Yu','關','shu','jiangxia',97,75,62,93,'cav','guan_yu',100],
  ['zhangfei','Zhang Fei','張','shu','jiangxia',98,30,22,44,'spear','zhang_fei',100],
  ['zhaoyun','Zhao Yun','趙','shu','jiangxia',96,76,65,81,'cav','zhao_yun',100],
  ['zhugeliang','Zhuge Liang','諸','shu','jiangxia',38,100,95,92,'archer','zhuge_liang',100],
  ['mizhu','Mi Zhu','糜','shu','jiangxia',30,58,82,78,'shield','mi_zhu',98],
  ['sunqian','Sun Qian','乾','shu','jiangxia',32,66,74,80,'shield','sun_qian',95],
  ['jianyong','Jian Yong','簡','shu','jiangxia',28,64,70,86,'shield','jian_yong',95],
  ['caocao','Cao Cao','操','wei','jiangling',72,91,94,96,'cav','cao_cao',100],
  ['xuchu','Xu Chu','許','wei','jiangling',96,36,20,58,'spear','xu_chu',98],
  ['caoren','Cao Ren','仁','wei','jiangling',85,70,60,72,'shield','cao_ren',100],
  ['xiahoudun','Xiahou Dun','惇','wei','xuchang',90,58,70,80,'cav','xiahou_dun',100],
  ['xunyu','Xun Yu','荀','wei','xuchang',30,95,96,90,'shield','xun_yu',85],
  ['xiahouyuan','Xiahou Yuan','淵','wei','wancheng',91,54,60,72,'archer','xiahou_yuan',100],
  ['manchong','Man Chong','滿','wei','runan',66,82,80,70,'shield','man_chong',88],
  ['zhangliao','Zhang Liao','遼','wei','hefei',92,78,58,76,'cav','zhang_liao',90],
  ['lidian','Li Dian','典','wei','hefei',74,76,66,68,'archer','li_dian',88],
  ['yujin','Yu Jin','于','wei','xiangyang',78,70,62,60,'shield','yu_jin',85],
  ['yuejin','Yue Jin','樂','wei','xiangyang',80,50,45,55,'archer','yue_jin',88],
  ['sunquan','Sun Quan','權','wu','jianye',67,80,86,95,'shield','sun_quan',100],
  ['zhangzhao','Zhang Zhao','昭','wu','jianye',20,88,95,84,'shield','zhang_zhao',90],
  ['zhouyu','Zhou Yu','瑜','wu','chaisang',80,96,86,93,'archer','zhou_yu',100],
  ['ganning','Gan Ning','甘','wu','chaisang',94,76,32,60,'cav','gan_ning',90],
  ['taishici','Taishi Ci','慈','wu','chaisang',93,66,50,74,'cav','taishi_ci',95],
  ['zhoutai','Zhou Tai','泰','wu','jianye',91,40,30,62,'shield','zhou_tai',100],
  ['lusu','Lu Su','肅','wu','chaisang',56,92,90,88,'shield','lu_su',95],
  ['huanggai','Huang Gai','蓋','wu','kuaiji',83,68,60,70,'spear','huang_gai',100],
  ['lumeng','Lü Meng','蒙','wu','kuaiji',81,89,78,76,'cav','lu_meng',95],
  ['hanxuan','Han Xuan','韓','han','changsha',48,40,40,32,'shield','han_xuan',100],
  ['huangzhong','Huang Zhong','忠','han','changsha',93,60,52,68,'archer','huang_zhong',60],
  ['weiyan','Wei Yan','延','han','changsha',92,70,44,50,'spear','wei_yan',50],
  ['jinxuan','Jin Xuan','金','jin','wuling',52,38,42,30,'shield','jin_xuan',100],
  ['gongzhi','Gong Zhi','鞏','jin','wuling',40,60,66,58,'shield','gong_zhi',55],
  ['liudu','Liu Du','度','liu','lingling',45,46,50,48,'shield','liu_du',100],
  ['xingdaorong','Xing Daorong','邢','liu','lingling',78,22,18,30,'spear','xing_daorong',80],
  ['zhaofan','Zhao Fan','範','zhao','guiyang',42,58,62,50,'shield','zhao_fan',100],
  ['chenying','Chen Ying','陳','zhao','guiyang',70,30,28,40,'cav','chen_ying',75],
  ['maliang','Ma Liang','良',null,'jiangxia',36,78,86,80,'shield',null,85,1],
  ['pangtong','Pang Tong','龐',null,'changsha',34,97,80,62,'archer',null,80,1],
  ['jiangwan','Jiang Wan','琬',null,'lingling',30,82,88,74,'shield',null,85,1]];
const CMDS={
  farm:{n:'Farm',zh:'農',stat:'pol',cost:{gold:50},tip:'Raise farming, so the 7th-month harvest brings more rice'},
  com:{n:'Commerce',zh:'商',stat:'pol',cost:{gold:50},tip:'Raise commerce, so the city earns more gold each month'},
  walls:{n:'Walls',zh:'城',stat:'war',cost:{gold:50},tip:'Repair walls, so the fort is stronger in sieges'},
  recruit:{n:'Recruit',zh:'徵',stat:'cha',cost:{gold:300},tip:'Raise new troops. Lowers order and population, and new troops are untrained'},
  train:{n:'Train',zh:'訓',stat:'war',cost:{},tip:'Drill the troops. Fully trained troops hit 30% harder'},
  patrol:{n:'Patrol',zh:'巡',stat:'cha',cost:{rice:100},tip:'Keep the peace and raise public order'},
  search:{n:'Search',zh:'探',stat:'int',cost:{},tip:'Look for hidden talent, gold or rice'},
  reward:{n:'Reward',zh:'賞',stat:'loy',cost:{gold:100},tip:'Give gold to raise a general\'s loyalty. Does not use his action'}};
const CITY_ART=Object.fromEntries(['jiangxia','xuchang','wancheng','runan','hefei','jiangling','chaisang','jianye','kuaiji','wuling','changsha','lingling','xiangyang','guiyang'].map(id=>[id,`art/${id}.jpg`]));
const SALARY=5, RICE_CITY=0.1, RICE_MARCH=0.2, END_YEAR=215, WIN_CITIES=10;

let S=null;           // campaign state (saved)
let UI={mode:'city',cmd:null,busy:false};
const C=id=>S.cities[id], GN=id=>S.gens[id];
const routeOf=(a,b)=>ROUTES.find(r=>(r[0]===a&&r[1]===b)||(r[0]===b&&r[1]===a));
const neighbours=id=>ROUTES.filter(r=>r[0]===id||r[1]===id).map(r=>r[0]===id?r[1]:r[0]);
const citiesOf=f=>Object.values(S.cities).filter(c=>c.owner===f);
const gensIn=id=>Object.values(S.gens).filter(g=>g.city===id&&g.fac&&!g.army);
const gensOf=f=>Object.values(S.gens).filter(g=>g.fac===f);
const fmt=n=>Math.round(n).toLocaleString('en-US');
const rnd=(a,b)=>a+Math.random()*(b-a);
const ri=(a,b)=>Math.floor(rnd(a,b+1));
const dateStr=()=>`${S.month<=3?'Spring':S.month<=6?'Summer':S.month<=9?'Autumn':'Winter'} ${S.year} · ${S.month}${({1:'st',2:'nd',3:'rd'})[S.month]||'th'} month`;
const dateNum=()=>S.year*12+S.month;
const allied=(a,b)=>((a==='shu'&&b==='wu')||(a==='wu'&&b==='shu'))&&dateNum()<=210*12+12;
const isRuler=g=>!!(g.fac&&S.rulers&&S.rulers[g.fac]===g.id);
// the faction's original lord never changes sides; an officer who only inherited the command can
const isFounder=g=>!!(g.fac&&FACS[g.fac]&&FACS[g.fac].ruler===g.id);
const alive=f=>citiesOf(f).length>0||S.armies.some(a=>a.fac===f);
const facName=f=>f?FACS[f].short:'Free';
const portraitSrc=g=>g.img?`portraits/${g.img}.png`:null;
function gseal(g,size){const F=FACS[g.fac]||{main:'#5a5040'};const src=portraitSrc(g);
  return src?`<img class="gport" style="width:${size}px;height:${Math.round(size*1.15)}px" src="${src}" alt="">`:`<span class="gseal" style="width:${size}px;height:${Math.round(size*1.15)}px;background:${F.main};font-size:${Math.round(size*.55)}px">${g.ch}</span>`}
function addLog(h,f){S.logN=(S.logN||0)+1;S.log.unshift({d:`${S.year}/${S.month}`,h,f:f||null,n:S.logN});if(S.log.length>60)S.log.pop()}
const fs=f=>`<b style="color:${FACS[f].light}">${FACS[f].short}</b>`;
const gnm=g=>`<b style="color:${(FACS[g.fac]||{light:'#ece2c9'}).light}">${g.name}</b>`;

// difficulty: inc = your gold income, wall = how much enemy walls help them when YOU attack,
// aiRec = enemy recruiting, aiBar = how much stronger the enemy must be before it attacks
const DIFF={easy:{n:'Easy',zh:'易',inc:1.6,gold:3000,rice:45000,wall:.45,aiRec:.45,aiBar:.45,pRec:1.5,cap:1.4,d:'Your treasury grows faster, enemy walls are weaker, and rivals attack only with a big advantage.'},
  normal:{n:'Normal',zh:'中',inc:1.25,gold:2000,rice:35000,wall:.7,aiRec:.75,aiBar:.15,pRec:1.25,cap:1.2,d:'The intended challenge. Strike Wei after Red Cliffs while Jiangling is weak.'},
  hard:{n:'Hard',zh:'難',inc:1,gold:1500,rice:30000,wall:1,aiRec:1.3,aiBar:-.1,pRec:1,cap:1,d:'Rivals recruit faster and attack sooner. Walls are at full strength.'}};
const DF=()=>DIFF[(S&&S.diff)||'normal'];
// how much a city's walls multiply its defence; enemy walls are softened by difficulty when Shu attacks
function wallF(c,attacker){const k=c.owner!=='shu'&&attacker==='shu'?DF().wall:1;return 1+(.15+c.walls/250)*k}
function newCampaign(diff){
  S={year:208,month:9,armies:[],log:[],grudge:{},sel:'jiangxia',over:false,nextArmy:1,cities:{},gens:{},fac:{},rulers:{}};
  for(const f in FACS)S.rulers[f]=FACS[f].ruler;
  S.diff=diff||'normal';
  for(const d of CITY_DEF){const [id,name,zh,x,y,owner,troops,farm,farmMax,com,comMax,walls,order,pop,train]=d;
    S.cities[id]={id,name,zh,x,y,owner,troops,farm,farmMax,com,comMax,walls,order,pop,train,gold:0,rice:0}}
  for(const f in FACS)spreadStores(f,f==='shu'?DF().gold:FACS[f].gold,f==='shu'?DF().rice:FACS[f].rice);
  for(const d of GEN_DEF){const [id,name,ch,fac,city,war,int,pol,cha,type,img,loy,hidden]=d;
    S.gens[id]={id,name,ch,fac,city,war,int,pol,cha,type,img,loy,hidden:!!hidden,acted:false,army:null}}
  addLog('Cao Cao has taken Jing province. His fleet gathers at Jiangling. Liu Bei holds Jiangxia, allied with Sun Quan of Wu.');
  addLog('Your goal: hold 10 of the 14 cities by the end of 215. The Shu–Wu alliance lasts until the end of 210.');
  save();
}
function save(){try{if(S.over)localStorage.removeItem('rtk3-save');else localStorage.setItem('rtk3-save',JSON.stringify(S))}catch(e){}}
const SLOTS=['rtk3-slot1','rtk3-slot2','rtk3-slot3'],PRE='rtk3-prebattle';
function readKey(k){try{const t=localStorage.getItem(k);return t?JSON.parse(t):null}catch(e){return null}}
function slotLabel(sv){if(!sv)return 'Empty';const n=Object.values(sv.cities).filter(c=>c.owner==='shu').length;return `${sv.year}, ${sv.month}${({1:'st',2:'nd',3:'rd'})[sv.month]||'th'} month · ${n} cit${n>1?'ies':'y'}${sv.savedAt?' · saved '+new Date(sv.savedAt).toLocaleDateString(undefined,{month:'short',day:'numeric'})+' '+new Date(sv.savedAt).toLocaleTimeString(undefined,{hour:'2-digit',minute:'2-digit'}):''}`}
function writeSlot(k){try{localStorage.setItem(k,JSON.stringify({...S,savedAt:Date.now()}));return true}catch(e){toast('Could not save: storage is full or blocked.');return false}}
function startFrom(sv){S=sv;if(!S)return;delete S.savedAt;migrateStores();for(const d of CITY_DEF)if(S.cities[d[0]]){S.cities[d[0]].x=d[3];S.cities[d[0]].y=d[4]}for(const d of GEN_DEF)if(S.gens[d[0]]&&d[10])S.gens[d[0]].img=d[10];for(const d of GEN_DEF)if(!S.gens[d[0]]){const [id,name,ch,fac,city,war,int,pol,cha,type,img,loy,hidden]=d;const c=S.cities[city];if(c&&c.owner===fac)S.gens[id]={id,name,ch,fac,city,war,int,pol,cha,type,img,loy,hidden:!!hidden,acted:false,army:null}}UI={mode:'city',cmd:null,busy:false};save();showScreen('campaign');renderCampaign()}
async function saveLoadDlg(mode){
  const rows=[['rtk3-save','Autosave'],...SLOTS.map((k,i)=>[k,'Slot '+(i+1)]),[PRE,'Before last battle']].filter(([k])=>mode==='load'||SLOTS.includes(k));
  const r=await dialog(`<h2>${mode==='save'?'Save game':'Load game'}</h2><p class="muted">${mode==='save'?'Pick a slot. Saving over a slot replaces it.':'The autosave updates as you play. “Before last battle” is the start of the month your last battle was fought, so you can replay it.'}</p>
    <div class="tlist slots">${rows.map(([k,n])=>{const sv=readKey(k);return `<button data-r="${k}" ${mode==='load'&&(!sv||sv.over)?'disabled':''}><span class="sl"><b>${n}</b><small>${slotLabel(sv)}</small></span><em>${mode==='save'?(sv?'Overwrite':'Save'):'Load'}</em></button>`}).join('')}</div>`,[['cancel','Cancel']]);
  if(r==='cancel')return false;
  if(mode==='save'){if(readKey(r)&&await dialog(`<h2>Overwrite ${rows.find(x=>x[0]===r)[1]}?</h2><p>${slotLabel(readKey(r))}</p>`,[['no','Cancel'],['yes','Overwrite','primary']])!=='yes')return false;if(writeSlot(r))toast('Game saved.');return true}
  const sv=readKey(r);if(!sv)return false;if(S&&!S.over&&!$('#campaign').hidden&&await dialog(`<h2>Load this game?</h2><p>${slotLabel(sv)}</p><p class="muted">Anything since that save will be lost.</p>`,[['no','Cancel'],['yes','Load','primary']])!=='yes')return false;
  startFrom(sv);toast('Game loaded.');return true}
function loadSave(){try{const t=localStorage.getItem('rtk3-save');return t?JSON.parse(t):null}catch(e){return null}}

// ------------------------------------------------------------ rendering
function showScreen(id){SND.music(id==='title'?'title':id==='campaign'?'map':'battle');for(const s of ['title','campaign','battleView'])$('#'+s).hidden=s!==id;document.body.classList.toggle('lock',id!=='battleView');if(id==='battleView')window.scrollTo(0,0)}
function renderTitle(){const sv=loadSave(),has=!!(sv&&!sv.over);$('#loadBtn').hidden=![...SLOTS,PRE].some(k=>{const x=readKey(k);return x&&!x.over});$('#contBtn').hidden=!has;$('#contBtn').classList.toggle('primary',has);$('#newBtn').classList.toggle('primary',!has);$('#tbtns').prepend(has?$('#contBtn'):$('#newBtn'));if(sv&&!sv.over)$('#contInfo').textContent=`${sv.year}, ${sv.month}${({1:'st',2:'nd',3:'rd'})[sv.month]||'th'} month`}
function threats(){return S.armies.filter(a=>a.fac!=='shu'&&C(a.to).owner==='shu'&&!allied('shu',a.fac)).sort((x,y)=>x.left-y.left)}
function renderThreats(){let el=$('#threatBar');if(!el){el=document.createElement('div');el.id='threatBar';el.setAttribute('role','alert');$('#campaign .ctop').after(el)}
  const T=threats();el.hidden=!T.length;
  el.innerHTML=T.map(a=>`<button data-city="${a.to}" class="${a.left<=1?'soon':''}"><b>⚠</b> ${FACS[a.fac].short} army of <b>${fmt(a.troops)}</b>${a.gens.length?` (${a.gens.map(id=>GN(id).name).slice(0,2).join(', ')}${a.gens.length>2?'…':''})`:''} reaches <b>${C(a.to).name}</b> ${a.left<=1?'next month':`in ${a.left} months`}</button>`).join('')}
// ===== long-term assignments (farm / commerce / train for N months)
const ASSIGNABLE=['farm','com','train'];
const assignLbl=g=>g.assign?`${CMDS[g.assign.k].n} · ${g.assign.left} mo`:'';
const govOf=c=>c&&c.gov?GN(c.gov):null;
const isDelegated=c=>!!(c&&c.owner==='shu'&&c.gov);
// each city keeps its own gold and rice; a faction's wealth is the sum of its cities
const facGold=f=>Math.round(citiesOf(f).reduce((s,c)=>s+(c.gold||0),0)),facRice=f=>Math.round(citiesOf(f).reduce((s,c)=>s+(c.rice||0),0));
const canPay=(c,cost)=>Object.entries(cost).every(([r,n])=>(c[r]||0)>=n);
// spread a faction's stores over its cities by population (new game and old saves)
function spreadStores(f,gold,rice){const cs=citiesOf(f);const P=cs.reduce((s,c)=>s+c.pop,0)||1;for(const c of cs){c.gold=(c.gold||0)+Math.round(gold*c.pop/P);c.rice=(c.rice||0)+Math.round(rice*c.pop/P)}}
function migrateStores(){if(Object.values(S.cities).every(c=>typeof c.gold==='number'))return;
  for(const c of Object.values(S.cities)){c.gold=c.purse?Math.round(c.purse.gold):0;c.rice=c.purse?Math.round(c.purse.rice):0;delete c.purse}
  for(const f in FACS){const F=S.fac&&S.fac[f];if(F)spreadStores(f,F.gold||0,F.rice||0)}
  for(const a of S.armies)a.gold=a.gold||0}
async function confirmBreakAssign(g){if(!g.assign)return true;
  const r=await dialog(`<h2>${g.name} has an assignment</h2><p>He is assigned to <b>${CMDS[g.assign.k].n}</b> for ${g.assign.left} more month${g.assign.left>1?'s':''}.</p><p class="muted">Giving him this order ends the assignment.</p>`,[['no','Keep the assignment'],['yes','End it and continue','primary']]);
  if(r!=='yes')return false;addLog(`${g.name}'s ${CMDS[g.assign.k].n.toLowerCase()} assignment is ended.`,'shu');g.assign=null;return true}
// run every month before the economy: assigned officers, then governed cities
function runAssignments(){
  for(const g of gensOf('shu')){if(!g.assign||g.army||g.acted)continue;const c=C(g.city);if(!c||c.owner!=='shu'||isDelegated(c)){g.assign=null;continue}
    const k=g.assign.k,afford=canPay(c,CMDS[k].cost);
    if(!afford){addLog(`${g.name} cannot carry out his ${CMDS[k].n.toLowerCase()} assignment: ${c.name} is short of gold.`,'shu');continue}
    const m=doCmd(k,g,c,'shu');g.assign.left--;addLog(`${m} <i>(assigned${g.assign.left?`, ${g.assign.left} month${g.assign.left>1?'s':''} left`:', finished'})</i>`,'shu');if(!g.assign.left)g.assign=null}}
const GOV_MODES={auto:'Auto',internal:'Internal',military:'Military'};
function govTick(){
  for(const c of citiesOf('shu')){if(!c.gov)continue;
    if(gensIn(c.id).some(g=>g.id==='liubei')){endDelegation(c,'Liu Bei arrives and takes charge of '+c.name+' again.');continue}
    let gv=govOf(c);if(!gv||gv.fac!=='shu'||gv.city!==c.id){const nx=gensIn(c.id).sort((a,b)=>b.pol-a.pol)[0];
      if(!nx){endDelegation(c,`${c.name} has no officer left to govern it and returns to your direct rule.`);continue}c.gov=nx.id;gv=nx;addLog(`${nx.name} takes over as governor of ${c.name}.`,'shu')}
    const P=c;const did=[];
    const gs=gensIn(c.id).filter(g=>!g.acted).sort((a,b)=>b.pol-a.pol);
    for(const g of gs){let k=null;const md=c.mode||'auto',room=troopCap(c)-c.troops;
      const threat=neighbours(c.id).map(C).filter(n=>n.owner!=='shu'&&!allied('shu',n.owner)).reduce((x,n)=>Math.max(x,n.troops),0);
      if(c.order<45&&P.rice>500)k='patrol';
      else if(md==='military'){if(room>1000&&P.gold>=400&&g.cha>=50&&c.order>55)k='recruit';else if(c.train<100&&g.war>=50)k='train';else if(c.walls<100&&P.gold>=150)k='walls';else if(c.train<100)k='train'}
      else if(md==='internal'){if(c.farm<c.farmMax&&P.gold>=150&&g.pol>=45)k='farm';else if(c.com<c.comMax&&P.gold>=150&&g.pol>=45)k='com';else if(c.order<80)k='patrol';else if(c.walls<100&&P.gold>=150)k='walls'}
      else{if(threat>c.troops&&room>1000&&P.gold>=400&&g.cha>=50&&c.order>55)k='recruit';else if(c.train<70&&g.war>=60)k='train';else if(c.com<c.comMax&&P.gold>=150&&g.pol>=55)k='com';else if(c.farm<c.farmMax&&P.gold>=150&&g.pol>=50)k='farm';else if(c.walls<100&&P.gold>=150)k='walls';else if(c.train<100)k='train'}
      if(!k||!canPay(c,CMDS[k].cost))continue;doCmd(k,g,c,'shu');did.push(CMDS[k].n.toLowerCase())}
    if(did.length)addLog(`Governor ${gv.name} (${GOV_MODES[c.mode||'auto']}) runs ${c.name}: ${[...new Set(did)].join(', ')}.`,'shu')}}
function endDelegation(c,msg){c.gov=null;c.mode=null;if(msg)addLog(msg,'shu')}
async function delegateDlg(c){
  const gs=gensIn(c.id).filter(g=>g.id!=='liubei').sort((a,b)=>b.pol-a.pol);let gid=c.gov||(gs[0]&&gs[0].id),mode=c.mode||'auto';
  for(;;){const first=!c.gov;
    const r=await dialog(`<div class="dzh">守</div><h2>${first?'Delegate':'Governor of'} ${c.name}</h2>
      <p class="muted">A governor runs the city every month, paying for his orders from the city's own gold and rice. You can still order him to send gold, rice, troops or officers to your other cities.</p>
      <div class="sec">Governor</div><div class="envrow">${gs.map(g=>`<button data-r="g:${g.id}" class="${gid===g.id?'on':''}">${g.name} <i>Pol ${g.pol} · War ${g.war}</i></button>`).join('')}</div>
      <div class="sec">Policy</div><div class="envrow">${Object.entries(GOV_MODES).map(([k,n])=>`<button data-r="m:${k}" class="${mode===k?'on':''}">${n}</button>`).join('')}</div>
      <p class="muted">${{auto:'Balanced: keeps order, answers threats with recruits, then builds.',internal:'Farming and commerce first, then order and walls.',military:'Recruits troops and drills them, then repairs walls.'}[mode]}</p>
      <p>${c.name} holds <b>${fmt(c.gold)}</b> gold · <b>${fmt(c.rice)}</b> rice.</p>`,
      [['cancel','Cancel'],...(first?[]:[['end','Take back direct rule']]),['go',first?'Appoint governor':'Save','primary']]);
    if(r.startsWith('g:')){gid=r.slice(2);continue}if(r.startsWith('m:')){mode=r.slice(2);continue}
    if(r==='end'){endDelegation(c,`You take back direct rule of ${c.name}.`);save();return}
    if(r!=='go'||!gid)return;
    if(first){for(const g of gensIn(c.id))g.assign=null}
    c.gov=gid;c.mode=mode;addLog(`${GN(gid).name} governs ${c.name} (${GOV_MODES[mode]}).`,'shu');save();return}}
// the sliders in delegateDlg re-render on change; keep their values between redraws
document.addEventListener('input',e=>{if(e.target.id==='dG'||e.target.id==='dR'){const b=e.target.previousElementSibling.querySelector('b');b.textContent=fmt(+e.target.value)}});
async function requestDlg(c){openMarch(c.id,null,'transfer')}
// ===== tooltips (long-press on phones, hover on desktop)
const TIPS={Troops:'Soldiers stationed here. A city can hold about 12% of its population.',Training:'How well drilled the troops are. Fully trained troops hit about 30% harder.',
  Farming:'Sets the rice harvest in the 7th month (40 rice per point).',Commerce:'Sets the gold the city earns each month, scaled by order.',Walls:'Fortifications. Higher walls make defenders much stronger in sieges.',
  Order:'Public order. Low order cuts income; below 30 troops start to desert.',Population:'People living here. Limits recruiting and grows when order is 60 or more.',Harvest:'Months until the next harvest (7th month).',
  War:'War: strength in battle and duels.',Int:'Intelligence: fire attacks, searching, persuading and envoys.',Pol:'Politics: farming, commerce and walls.',Cha:'Charisma: recruiting and how loyal your officers stay.',Loy:'Loyalty: below 75 rivals can lure him away; below 60 he may leave on his own. Reward raises it.',
  Gold:'Total gold in all your cities. Each city pays for its own orders and officers (5 gold each a month); move gold with Transfer.',Rice:'Total rice in all your cities. Troops eat from their own city: 0.1 a month per soldier, 0.2 on the march.','City gold':'Gold kept in this city. Its orders, rewards and officer salaries are paid from here.','City rice':'Rice kept in this city. Its troops eat from here and its harvest lands here.',Cities:'Cities you hold. Hold 10 of the 14 by the end of 215 to win.',
  Status:'Ready: can act this month. Done: has acted. Assigned: on a long-term task.'};
(()=>{let t=null,tipEl=null;const show=(el,x,y)=>{hide();const k=el.dataset.tip;if(!TIPS[k])return;tipEl=document.createElement('div');tipEl.className='tipbox';tipEl.innerHTML=`<b>${k}</b> ${TIPS[k]}`;document.body.appendChild(tipEl);
    const r=tipEl.getBoundingClientRect();tipEl.style.left=Math.max(8,Math.min(innerWidth-r.width-8,x-r.width/2))+'px';tipEl.style.top=(y-r.height-14<8?y+20:y-r.height-14)+'px';SND.fx('tap')};
  const hide=()=>{if(tipEl){tipEl.remove();tipEl=null}};
  addEventListener('pointerdown',e=>{const el=e.target.closest('[data-tip]');hide();if(!el)return;clearTimeout(t);t=setTimeout(()=>{show(el,e.clientX,e.clientY);el.dataset.tipped='1'},450)},{passive:true});
  ['pointerup','pointercancel','pointermove'].forEach(ev=>addEventListener(ev,e=>{if(ev==='pointermove'&&e.pointerType==='mouse')return;clearTimeout(t)},{passive:true}));
  addEventListener('click',e=>{const el=e.target.closest('[data-tipped]');if(el){delete el.dataset.tipped;e.stopPropagation();e.preventDefault()}},true);
  addEventListener('scroll',hide,{capture:true,passive:true});addEventListener('pointerup',()=>setTimeout(hide,2200),{passive:true});
  addEventListener('mouseover',e=>{const el=e.target.closest('[data-tip]');if(el&&!el.title)el.title=TIPS[el.dataset.tip]||''},{passive:true})})();
function renderCampaign(){
  if(!S)return;document.querySelectorAll('.cres>div').forEach(d=>{const k=(d.querySelector('span')||{}).textContent;if(TIPS[k])d.dataset.tip=k});renderThreats();
  const my=citiesOf('shu');
  $('#cDate').textContent=dateStr();
  $('#cGold').textContent=fmt(facGold('shu'));$('#cRice').textContent=fmt(facRice('shu'));
  $('#cCities').textContent=`${my.length} / 14`;
  $('#cTroops').textContent=fmt(my.reduce((s,c)=>s+c.troops,0)+S.armies.filter(a=>a.fac==='shu').reduce((s,a)=>s+a.troops,0));
  $('#endMonth').disabled=UI.busy||S.over;
  const inc=S.armies.filter(a=>a.fac!=='shu'&&C(a.to).owner==='shu').length;
  $('#mapBadge').hidden=!inc;$('#mapBadge').textContent=inc;
  if(!$('#mapView').hidden)renderMap();
  renderCity();
}
function openMap(){$('#mapView').hidden=false;renderMap()}
function closeMap(){$('#mapView').hidden=true}
const CITY_TIER={xuchang:'capital',jianye:'capital',jiangling:'large',xiangyang:'large',chaisang:'large',runan:'large',hefei:'large'};
const CITY_W={small:[40,43],large:[52,53],capital:[64,64]};
function underSiege(c){return S.armies.some(a=>a.to===c.id&&a.fac!==c.owner&&!allied(a.fac,c.owner))}
function cityIcon(c,F){const t=CITY_TIER[c.id]||'small',st=underSiege(c)?'siege':'ok',src=`art/city_${t}_${st}`;
  return `<span class="cic" style="width:${CITY_W[t][st==='ok'?0:1]}px;--fc:${F.main}"><img src="${src}_${c.owner}.png" alt=""></span>`}
function renderMap(){
  const svg=$('#routes');let h='';
  for(const r of ROUTES){const a=C(r[0]),b=C(r[1]);h+=`<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" class="${r[2]>1?'long':''}"/>`}
  for(const a of S.armies){const f=C(a.from),t=C(a.to);h+=`<line x1="${f.x}" y1="${f.y}" x2="${t.x}" y2="${t.y}" class="march" style="stroke:${FACS[a.fac].light}"/>`}
  svg.innerHTML=h;
  let cl='';
  for(const c of Object.values(S.cities)){const F=FACS[c.owner];
    cl+=`<button class="city${S.sel===c.id?' sel':''}${c.owner==='shu'?' mine':''}" data-city="${c.id}" style="left:${c.x}%;top:${c.y}%">${cityIcon(c,F)}<span class="cn">${c.name}</span><small>${(c.troops/1000).toFixed(1)}k</small></button>`}
  $('#cityLayer').innerHTML=cl;
  let al='';
  for(const a of S.armies){const f=C(a.from),t=C(a.to),p=.25+.5*(a.total-a.left)/Math.max(1,a.total);const F=FACS[a.fac];
    al+=`<div class="army" style="left:${lerp(f.x,t.x,p)}%;top:${lerp(f.y,t.y,p)}%;background:${F.dark};border-color:${F.light}"><span>${F.zh}</span>${(a.troops/1000).toFixed(1)}k</div>`}
  $('#armyLayer').innerHTML=al;
  const fl=[...new Set(Object.values(S.cities).map(c=>c.owner))];
  $('#mapLegend').innerHTML=fl.map(f=>`<span style="border-color:${FACS[f].main}">${FACS[f].short} · ${citiesOf(f).length}</span>`).join('');
}
function statRow(label,val,max){return `<div class="srow" data-tip="${label}"><span>${label}</span><b>${val}${max!=null?` <i>/ ${max}</i>`:''}</b>${max!=null?`<div class="sbar"><i style="width:${Math.round(100*clamp(parseFloat(String(val).replace(/,/g,''))/max))}%"></i></div>`:''}</div>`}
function sceneStyle(c){return CITY_ART[c.id]?`background-image:url(${CITY_ART[c.id]});background-size:cover;background-position:50% 55%`:`background-image:url(art/map.jpg);background-size:420% auto;background-position:${c.x}% ${c.y}%`}
function renderCity(){
  const c=C(S.sel),F=FACS[c.owner],mine=c.owner==='shu';
  const my=citiesOf('shu');const idx=my.findIndex(x=>x.id===c.id);
  // ---- column A: the city itself
  let a=`<div class="cscene" style="${sceneStyle(c)}">
    ${mine&&my.length>1?`<button class="cnav prev" data-act="prevCity" aria-label="Previous city">‹</button><button class="cnav next" data-act="nextCity" aria-label="Next city">›</button>`:''}
    <div class="cscap"><span class="phzh" style="color:${F.light}">${c.zh}</span><div><div class="phn">${c.name}</div><div class="phs" style="color:${F.light}">${mine?`Your city${my.length>1?` · ${idx+1} of ${my.length}`:''}`:`${F.short} · ruled by ${F.name}`}${!mine&&allied('shu',c.owner)?' · ally':''}</div></div></div></div>`;
  a+=`<div class="sgrid">${mine?statRow('City gold',fmt(c.gold))+statRow('City rice',fmt(c.rice)):''}${statRow('Troops',fmt(c.troops))}${statRow('Training',c.train,100)}${mine?statRow('Farming',c.farm,c.farmMax):''}${mine?statRow('Commerce',c.com,c.comMax):''}${statRow('Walls',c.walls,100)}${statRow('Order',c.order,100)}${mine?statRow('Population',fmt(c.pop*1000)):''}${mine?statRow('Harvest',S.month===7?'This month':`${((7-S.month+12)%12)||12} months`):''}</div>`;
  $('#cA').innerHTML=a;
  // ---- column B: officers
  const gs=gensIn(c.id).sort((x,y)=>(isRuler(y)-isRuler(x))||y.war-x.war);
  let b='';
  if(UI.mode==='cmd'&&mine&&!isDelegated(c)){
    const k=UI.cmd,v=CMDS[k],cost=Object.entries(v.cost).map(([r,n])=>`${n} ${r}`).join(', ')||'free';
    const afford=canPay(c,v.cost);
    let list=gs.filter(g=>k==='reward'?g.loy<100&&!isRuler(g)&&!g.rewarded:!g.acted);
    list.sort((x,y)=>k==='reward'?x.loy-y.loy:y[v.stat]-x[v.stat]);
    b+=`<div class="chead"><div><div class="sec">${v.zh} ${v.n} · ${cost}${ASSIGNABLE.includes(k)&&(UI.dur||1)>1?' a month':''}</div><p class="muted">Choose who will do it. ${v.tip}.</p></div><button data-act="back">Cancel</button></div>`;
    if(ASSIGNABLE.includes(k))b+=`<div class="durrow"><span>For</span>${[1,3,6,12].map(n=>`<button data-act="dur" data-n="${n}" class="${(UI.dur||1)===n?'on':''}">${n===1?'This month':n+' months'}</button>`).join('')}</div>${(UI.dur||1)>1?`<p class="muted">Starting this month, he repeats it at the end of every month, paying ${cost} each time. Total ${Object.entries(v.cost).map(([r,n])=>`${n*(UI.dur)} ${r}`).join(', ')||'free'}.</p>`:''}`;
    if(!afford)b+=`<p class="bad">${c.name} does not have enough ${Object.keys(v.cost).join(' and ')} (${fmt(c.gold)} gold). Transfer some from another city.</p>`;
    if(!list.length)b+=`<p class="muted">${k==='reward'?'Everyone here is fully loyal or has already been rewarded this month.':'Every officer here has already acted this month.'}</p>`;
    b+=`<div class="olist">${list.map(g=>`<button class="orow pick" data-gen="${g.id}" ${afford?'':'disabled'}>${gseal(g,36)}<span class="oname"><b>${g.name}</b><small>${g.assign?`<span class="asgt">Assigned: ${assignLbl(g)}</span>`:isRuler(g)?'Ruler':TYPES[g.type].n}</small></span><span class="opick"><b>${v.stat==='loy'?'Loyalty':v.stat==='pol'?'Politics':v.stat==='cha'?'Charisma':v.stat==='int'?'Intelligence':'War'} ${g[v.stat]}</b><small>${cmdPreview(k,g,c)}</small></span></button>`).join('')}</div>`;
  } else {
    const away=Object.values(S.gens).filter(g=>g.fac==='shu'&&g.army&&mine&&S.armies.some(x=>x.id===g.army&&x.from===c.id));
    b+=`<div class="chead"><div class="sec">Officers in city · ${gs.length}</div>${away.length?`<span class="muted">${away.length} away marching</span>`:''}</div>`;
    b+=`<div class="ohead"><span></span><span>Name</span><span data-tip="War">War</span><span data-tip="Int">Int</span><span data-tip="Pol">Pol</span><span data-tip="Cha">Cha</span><span data-tip="Loy">Loy</span><span data-tip="Status">${mine?'Status':''}</span></div>`;
    b+=`<div class="olist">${gs.map(g=>`<div class="orow">${gseal(g,36)}<span class="oname"><b>${g.name}</b><small>${isRuler(g)?'Ruler':TYPES[g.type].n}</small></span><span class="on">${g.war}</span><span class="on">${g.int}</span><span class="on">${g.pol}</span><span class="on">${g.cha}</span><span class="on loy ${isFounder(g)?'':g.loy<60?'risk':g.loy<75?'warn':''}" title="Loyalty${g.loy<60?': may leave':g.loy<75?': can be lured':''}">${isFounder(g)?'—':g.loy}</span>${mine?`<span class="gst ${g.acted?'done':g.assign?'asg':''}" title="${g.assign?assignLbl(g):''}">${c.gov===g.id?'Governor':g.acted?'Done':g.assign?'Assigned':'Ready'}</span>`:'<span></span>'}</div>`).join('')||'<p class="muted">No officers here.</p>'}</div>`;
  }
  $('#cB').innerHTML=b;
  // ---- column C: commands and reports
  let cc='';
  if(mine&&isDelegated(c)){const gv=govOf(c);
    cc+=`<div class="sec">Governed city</div><div class="govcard"><b>${gv?gv.name:'—'}</b><small>Governor · ${GOV_MODES[c.mode||'auto']} policy</small><div><b>${fmt(c.gold)}</b> gold · <b>${fmt(c.rice)}</b> rice</div></div>
      <button class="primary wide" data-act="request"><span class="czh">運</span> Order a transfer</button><button class="wide" data-act="delegate"><span class="czh">守</span> Governor & policy</button>`;
  } else if(mine){
    cc+=`<div class="sec">Commands</div><div class="cmdgrid">${Object.entries(CMDS).map(([k,v])=>`<button data-cmd="${k}" class="${UI.mode==='cmd'&&UI.cmd===k?'on':''}" title="${v.tip}"><span class="czh">${v.zh}</span>${v.n}</button>`).join('')}</div>`;
    cc+=`<div class="mvrow"><button class="primary" data-act="march"><span class="czh">征</span> March</button><button data-act="transfer"><span class="czh">運</span> Transfer</button></div>`;
    if(!gensIn(c.id).some(g=>g.id==='liubei')&&gensIn(c.id).length)cc+=`<button class="wide" data-act="delegate"><span class="czh">守</span> Delegate to a governor</button>`;
  } else {
    const src=neighbours(c.id).map(C).filter(x=>x.owner==='shu');
    cc+=`<div class="sec">${F.short}</div>`;
    if(allied('shu',c.owner))cc+=`<p class="muted">Allied with you until the end of 210. You cannot attack Wu before then.</p>`;
    else if(src.length){cc+=`<button class="primary wide" data-act="attack"><span class="czh">征</span> March on ${c.name}</button><p class="muted">From ${src.map(x=>x.name).join(' or ')}.</p>`;
      const ne=envoysFor(c.id).length;
      cc+=`<div class="dipl"><button data-act="persuade" ${ne&&gensIn(c.id).some(g=>!isFounder(g))?'':'disabled'}><span class="czh">說</span>Persuade<small>lure an officer</small></button>${c.owner!=='wei'&&c.owner!=='wu'?`<button data-act="surrender" ${ne?'':'disabled'}><span class="czh">降</span>Surrender<small>demand it</small></button>`:''}</div>${ne?'':'<p class="muted">Diplomacy needs a free officer in a neighbouring city.</p>'}`}
    else cc+=`<p class="muted">Not next to any of your cities.</p>`;
    cc+=`<button class="wide" data-act="home">Back to my city</button>`;
  }
  for(const ar of S.armies.filter(x=>x.to===c.id||x.from===c.id))cc+=`<div class="note" style="border-color:${FACS[ar.fac].main}">${FACS[ar.fac].short} army of ${fmt(ar.troops)} · ${C(ar.from).name} → ${C(ar.to).name} · ${ar.left} month${ar.left>1?'s':''}</div>`;
  const tab=UI.rtab||'log',thr=Object.values(S.intel||{}).flat().some(e=>e.k==='march'&&C(e.to).owner==='shu');
  cc+=`<div class="rtabs" role="tablist"><button role="tab" aria-selected="${tab==='log'}" class="${tab==='log'?'on':''}" data-act="rtab" data-t="log">Reports</button><button role="tab" aria-selected="${tab==='foe'}" class="${tab==='foe'?'on':''}" data-act="rtab" data-t="foe">Enemies${thr?' <em class="dot" aria-label="threat">!</em>':''}</button></div>`;
  cc+=tab==='log'?`<ol class="clog">${S.log.slice(0,8).map(l=>`<li><span>${l.d}</span> ${l.h}</li>`).join('')}</ol>`:`<div class="foes">${foeReport()}</div>`;
  $('#cC').innerHTML=cc;
}
function cmdPreview(k,g,c){
  const s=g[CMDS[k].stat];
  if(k==='farm')return `+${Math.round(s/10)}–${Math.round(s/10)+4} farming`;
  if(k==='com')return `+${Math.round(s/10)}–${Math.round(s/10)+4} commerce`;
  if(k==='walls')return `+${Math.round(s/15)}–${Math.round(s/15)+3} walls`;
  if(k==='recruit'){const room=troopCap(c)-c.troops;return room<=0?`city is full (${fmt(troopCap(c))} max)`:`about +${fmt(Math.min(Math.round(s*10*DF().pRec),room))} troops`}
  if(k==='train')return `+${Math.round(s/12)}–${Math.round(s/12)+3} training`;
  if(k==='patrol')return `+${Math.round(s/15)}–${Math.round(s/15)+3} order`;
  if(k==='search')return `${Math.round(Math.min(90,s*.6+10))}% chance to find something`;
  if(k==='reward')return `loyalty ${g.loy} → ${Math.min(100,g.loy+8)}`;
  return ''}
const troopCap=c=>Math.round(c.pop*120*(c.owner==='shu'&&typeof DF==='function'&&S?DF().cap:1)/500)*500;
function intel(f,o){if(!S.intel)S.intel={};(S.intel[f]=S.intel[f]||[]).push(o)}
function doCmd(k,g,c,f){
  const F=c,v=CMDS[k];for(const [r,n] of Object.entries(v.cost))F[r]-=n;
  if(k!=='reward')g.acted=true;
  const s=g[v.stat];let m='';
  if(k==='farm'){const n=Math.min(c.farmMax-c.farm,Math.round(s/10)+ri(0,4));c.farm+=n;m=`${g.name} works the fields: farming +${n}.`}
  if(k==='com'){const n=Math.min(c.comMax-c.com,Math.round(s/10)+ri(0,4));c.com+=n;m=`${g.name} develops the markets: commerce +${n}.`}
  if(k==='walls'){const n=Math.min(100-c.walls,Math.round(s/15)+ri(0,3));c.walls+=n;m=`${g.name} repairs the walls: +${n}.`}
  if(k==='recruit'){const n=Math.max(0,Math.min(Math.round(s*10*rnd(.8,1.2)*(f!=='shu'?DF().aiRec:DF().pRec)),troopCap(c)-c.troops));c.train=Math.round((c.train*c.troops+30*n)/Math.max(1,c.troops+n));c.troops+=n;c.pop=Math.max(20,c.pop-n/1000);c.order=Math.max(0,c.order-(n?3:0));m=n?`${g.name} raises ${fmt(n)} new troops. Order −3.`:`${g.name} finds no more men to raise: ${c.name} can support ${fmt(troopCap(c))} troops (+0).`}
  if(k==='train'){const n=Math.min(100-c.train,Math.round(s/12)+ri(0,3));c.train+=n;m=`${g.name} drills the troops: training +${n}.`}
  if(k==='patrol'){const n=Math.min(100-c.order,Math.round(s/15)+ri(0,3));c.order+=n;m=`${g.name} patrols the streets: order +${n}.`}
  if(k==='reward'){g.rewarded=true;g.loy=Math.min(100,g.loy+8);m=`${g.name} is rewarded. Loyalty ${g.loy}.`}
  if(k==='search'){const ch=Math.min(.9,(s*.6+10)/100);const hid=Object.values(S.gens).find(x=>x.hidden&&x.city===c.id);
    if(Math.random()>ch)m=`${g.name} searches ${c.name} but finds nothing.`;
    else if(hid&&Math.random()<.6){hid.hidden=false;hid.fac=f;hid.acted=true;if(f==='shu'){hid.city=c.id;UI.found=hid.id}m=`${g.name} finds ${hid.name}, who agrees to serve ${FACS[f].name}!`}
    else if(Math.random()<.5){const n=ri(100,300);F.gold+=n;m=`${g.name} finds ${n} gold.`}
    else{const n=ri(5,15)*100;F.rice+=n;m=`${g.name} finds ${fmt(n)} rice.`}}
  return m}

// ------------------------------------------------------------ input
document.addEventListener('click',async e=>{
  if(!S||$('#campaign').hidden)return;
  const cb=e.target.closest('[data-city]');if(cb){S.sel=cb.dataset.city;UI.mode='city';closeMap();renderCampaign();return}
  const b=e.target.closest('.cbody button');if(!b||UI.busy)return;
  const c=C(S.sel);
  if(b.dataset.cmd){if(UI.mode==='cmd'&&UI.cmd===b.dataset.cmd)UI.mode='city';else{UI.mode='cmd';UI.cmd=b.dataset.cmd;UI.dur=1}renderCity();return}
  if(b.dataset.gen){const g=GN(b.dataset.gen),k=UI.cmd;
    if(k!=='reward'&&g.assign){UI.busy=true;const ok=await confirmBreakAssign(g);UI.busy=false;if(!ok){renderCampaign();return}}
    const dur=ASSIGNABLE.includes(k)?(UI.dur||1):1;
    UI.busy=true;const m=doCmd(k,g,c,'shu');if(dur>1){g.assign={k,left:dur-1};addLog(`${m} <i>(assigned for ${dur} months)</i>`,'shu')}else addLog(m,'shu');save();
    try{await actFx(g,k,m,c)}catch(err){console.error(err)}
    if(UI.found){const ng=GN(UI.found);UI.found=null;try{await welcomeGen(ng,c,'search')}catch(err){console.error(err)}}
    UI.busy=false;if(k!=='reward')UI.mode='city';renderCampaign();return}
  const a=b.dataset.act;
  if(a==='rtab'){UI.rtab=b.dataset.t;renderCity();return}
  if(a==='dur'){UI.dur=+b.dataset.n;renderCity();return}
  if(a==='transfer'){openMarch(c.id,null,'transfer');return}
  if(a==='delegate'){UI.busy=true;try{await delegateDlg(c)}finally{UI.busy=false;renderCampaign()}return}
  if(a==='request'){UI.busy=true;try{await requestDlg(c)}finally{UI.busy=false;renderCampaign()}return}
  if(a==='back'){UI.mode='city';renderCity()}
  if(a==='prevCity'||a==='nextCity'){const my=citiesOf('shu'),i=my.findIndex(x=>x.id===c.id);S.sel=my[(i+(a==='nextCity'?1:my.length-1))%my.length].id;UI.mode='city';renderCity()}
  if(a==='home'){const my=citiesOf('shu');if(my.length){S.sel=my[0].id;UI.mode='city';renderCity()}}
  if(a==='march')openMarch(c.id,null);
  if(a==='persuade'){UI.busy=true;try{await doPersuade(c)}finally{UI.busy=false;renderCampaign()}}
  if(a==='surrender'){UI.busy=true;try{await doSurrender(c)}finally{UI.busy=false;renderCampaign()}}
  if(a==='attack'){const src=neighbours(c.id).map(C).filter(x=>x.owner==='shu').sort((x,y)=>y.troops-x.troops)[0];openMarch(src.id,c.id)}
});
$('#mapBtn').onclick=()=>openMap();
$('#mapClose').onclick=()=>closeMap();
$('#endMonth').onclick=()=>endMonth();
$('#newBtn').onclick=async()=>{const sv=loadSave();if(sv&&!sv.over&&await dialog(`<h2>Start a new game?</h2><p>Your current game (${sv.year}, month ${sv.month}) will be replaced.</p>`,[['no','Keep my game'],['yes','Start over','primary']])!=='yes')return;const dr=await dialog(`<h2>Choose difficulty</h2><div class="tlist slots">${Object.entries(DIFF).map(([k,v])=>`<button data-r="${k}" class="${k==='normal'?'on':''}"><span class="sl"><b>${v.zh} ${v.n}</b><small>${v.d}</small></span><em>${k==='normal'?'Recommended':''}</em></button>`).join('')}</div>`,[['cancel','Cancel']]);if(!DIFF[dr])return;newCampaign(dr);UI={mode:'city',cmd:null,busy:false};showScreen('campaign');renderCampaign()};
$('#contBtn').onclick=()=>startFrom(loadSave());
$('#loadBtn').onclick=()=>saveLoadDlg('load');
const _oldCont=()=>{S=loadSave();if(!S)return;for(const d of CITY_DEF)if(S.cities[d[0]]){S.cities[d[0]].x=d[3];S.cities[d[0]].y=d[4]}for(const d of GEN_DEF)if(S.gens[d[0]]&&d[10])S.gens[d[0]].img=d[10];for(const d of GEN_DEF)if(!S.gens[d[0]]){const [id,name,ch,fac,city,war,int,pol,cha,type,img,loy,hidden]=d;const c=S.cities[city];if(c&&c.owner===fac)S.gens[id]={id,name,ch,fac,city,war,int,pol,cha,type,img,loy,hidden:!!hidden,acted:false,army:null}}UI={mode:'city',cmd:null,busy:false};showScreen('campaign');renderCampaign()};
$('#menuBtn').onclick=async()=>{const fs=!!document.fullscreenElement;const r=await dialog(`<h2>Menu</h2><p class="muted">The game autosaves as you play. You also have 3 save slots, plus a save from before your last battle.</p>`,[['diff',`${DF().zh} Difficulty: ${DF().n}`],['sound','🔊 Sound'],['save','💾 Save game'],['load','📂 Load game'],['full',fs?'⛶ Exit fullscreen':'⛶ Fullscreen'],['title','Back to title'],['close','Keep playing','primary']]);if(r==='diff'){const dr=await dialog(`<h2>Difficulty</h2><p class="muted">You can change this at any time. Gold already in your treasury stays as it is.</p><div class="tlist slots">${Object.entries(DIFF).map(([k,v])=>`<button data-r="${k}" ${S.diff===k?'disabled':''}><span class="sl"><b>${v.zh} ${v.n}${(S.diff||'normal')===k?' · current':''}</b><small>${v.d}</small></span></button>`).join('')}</div>`,[['cancel','Cancel']]);if(DIFF[dr]){S.diff=dr;addLog(`Difficulty set to ${DIFF[dr].n}.`,'shu');save();renderCampaign()}}
    if(r==='sound')await soundDlg();if(r==='save')await saveLoadDlg('save');if(r==='load')await saveLoadDlg('load');if(r==='full')toggleFull();if(r==='title'){showScreen('title');renderTitle()}};
// ---- a new officer joins: portrait, his words, and an offer to reward him at once
const WELCOME={search:['I have waited long for a lord worthy of my talents. I am honoured to serve you, Lord Liu Bei.','Your name for benevolence reached even my humble door. Command me, my lord.','I am honoured to serve. My life is yours to spend for the Han.'],
  capture:['You spared me when you could have taken my head. I will repay that kindness, my lord.','I fought you as an enemy; I will serve you as a loyal officer.'],
  persuade:['Your envoy spoke truly. I am honoured to join your cause, Lord Liu Bei.','I have served the wrong master long enough. Command me.']};
async function welcomeGen(g,c,why){
  for(;;){const gc=C(g.city)||c,can=g.loy<100&&!g.rewarded&&gc.gold>=100,img=portraitSrc(g);
    const r=await dialog(`<div class="welc">${img?`<img src="${img}" alt="" class="welcp">`:gseal(g,120)}<div class="welct"><span class="welck">新 New officer</span><h2>${g.name}</h2>
      <p class="muted">War ${g.war} · Int ${g.int} · Pol ${g.pol} · Cha ${g.cha} · ${TYPES[g.type].n}</p>
      <blockquote>“${pick(WELCOME[why]||WELCOME.search)}”</blockquote>
      <p>Loyalty <b class="${g.loy<60?'bad':g.loy<75?'warnc':''}">${g.loy}</b>${g.loy<75?' · <span class="warnc">low; rivals may lure him away</span>':''}</p></div></div>`,
      [...(g.loy<100&&!g.rewarded?[['rew',`賞 Reward · 100 gold, +8 loyalty`]]:[]),['ok','Welcome','primary']]);
    if(r==='rew'){if(!can){toast(`${gc.name} does not have 100 gold.`);continue}const m=doCmd('reward',g,gc,'shu');addLog(m,'shu');save();SND.fx('chime');renderCampaign();continue}
    return}}
// ---- city command cut-in: 1s order, 1s result
const ACT_LINES={
  farm:[['To the fields! A good harvest feeds an army.','Turn the soil; the granaries must be full.'],['The fields will feed us well.','The farmers bless your name, my lord.']],
  com:[['Open the markets and lower the tolls!','Merchants bring gold to a well-run city.'],['Trade flows again.','The coffers will thank us.']],
  walls:[['Bring stone and timber to the walls!','No enemy will breach these walls.'],['The walls stand stronger.','Let them come now.']],
  recruit:[['Who will take up the spear for the Han?','Raise the banners, call for volunteers!'],['Fresh men stand ready.','Our ranks grow, my lord.']],
  train:[['Form ranks! Again!','Sweat in the drill, or bleed in battle.'],['They move as one now.','The troops are sharper.']],
  patrol:[['Keep the peace in the streets.','Bandits will find no shelter here.'],['The people sleep easier.','Order is restored.']],
  search:[['I will search every tavern and village.','Talent hides in humble places.'],['A fine find, my lord!','Heaven smiles on us.']],
  reward:[['You honour me, my lord.','I am unworthy of such a gift.'],['I will repay this with my life.','My loyalty is yours.']]};
const ACT_FAIL=['Nothing… perhaps next month.','The search turned up nothing.'];
const XCMDS={persuade:{n:'Persuade',zh:'說'},surrender:{n:'Demand surrender',zh:'降'}};
ACT_LINES.persuade=[['I will speak with him over wine.','Every man serves a cause. Let me offer him ours.'],['He will join us, my lord!','He accepts. A fine officer for our cause.']];
ACT_LINES.surrender=[['I go to their hall with your letter, my lord.','Let them see the strength behind our words.'],['They open the gates to us!','The lord has submitted to your rule.']];
const ACT_NO={persuade:['He would not listen.','His loyalty held firm.'],surrender:['They sent me away.','They will not yield without a fight.']};
const ACT_DONE=['There is nothing more to do here.','It is already at its best, my lord.'];
const pick=a=>a[Math.floor(Math.random()*a.length)];
function actFx(g,k,m,c,ok){return new Promise(res=>{
  const v=CMDS[k]||XCMDS[k],img=portraitSrc(g),fail=ok===false||(k==='search'&&/finds nothing/.test(m)),none=/\+0\b/.test(m);
  let line1=pick(ACT_LINES[k][0]);if(g.id==='zhangfei'&&k!=='reward')line1=pick(['Hah! Leave it to me!','Out of my way, I\'ll handle it!']);
  const line2=fail?pick(ACT_NO[k]||ACT_FAIL):none?pick(ACT_DONE):pick(ACT_LINES[k][1]);
  const res2=m.replace(g.name+' ','').replace(/^./,x=>x.toUpperCase());
  const d=document.createElement('div');d.id='actFx';d.setAttribute('role','status');
  d.innerHTML=`<div class="afx">${img?`<img class="afp" src="${img}" alt="">`:`<div class="afp afx0">${g.ch}</div>`}
    <div class="afr"><div class="afh"><span class="afk">${v.zh}</span><b>${g.name}</b><small>${v.n} · ${c.name}</small></div>
    <div class="afb"><span class="aft">“${line1}”</span></div><div class="afres" hidden></div><small class="afskip">Tap to continue</small></div></div>`;
  document.body.appendChild(d);
  let ph=0,t=null;const go=()=>{clearTimeout(t);ph++;
    if(ph===1){SND.fx(fail||none?'dud':'chime');const b=d.querySelector('.aft');b.classList.add('out');setTimeout(()=>{b.textContent=`“${line2}”`;b.classList.remove('out')},120);
      const r=d.querySelector('.afres');r.textContent=res2;r.hidden=false;r.classList.toggle('bad',fail||none);d.classList.add('ph2');t=setTimeout(go,1100)}
    else{d.classList.add('leave');setTimeout(()=>{d.remove();res()},180)}};
  d.onclick=go;t=setTimeout(go,1000)})}
let toastT=null;function toast(m){const t=$('#toast');t.innerHTML=m;t.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>t.hidden=true,2600)}

// ------------------------------------------------------------ dialogs
function dialog(html,buttons){return new Promise(res=>{
  const box=$('#dlgbox'),again=!$('#dlg').hidden||dialog.last===html.slice(0,60),keepT=box.querySelector('.tlist')?box.querySelector('.tlist').scrollTop:0,keepB=box.scrollTop;dialog.last=html.slice(0,60);box.classList.remove('dwide');box.innerHTML=html+`<div class="dbtns">${buttons.map(([v,l,cls])=>`<button data-r="${v}" class="${cls||''}">${l}</button>`).join('')}</div>`;
  $('#dlg').hidden=false;if(again){const t=box.querySelector('.tlist');if(t)t.scrollTop=keepT;box.scrollTop=keepB}
  box.onclick=e=>{const b=e.target.closest('[data-r]');if(!b||b.disabled)return;$('#dlg').hidden=true;box.onclick=null;res(b.dataset.r)}})}

// ------------------------------------------------------------ march
function openMarch(from,to,mode){
  const m={from,to,sel:new Set(),troops:0,rice:0,gold:0,cmd:null,al:{}},xfer=mode==='transfer',purse=C(from).gov?C(from):null,RS=C(from);
  const cmdOf=()=>m.sel.has(m.cmd)?m.cmd:(cmdOrder([...m.sel].map(GN))[0]||{}).id;
  const srcCity=C(from);
  const targets=()=>neighbours(m.from).map(C).filter(t=>xfer?t.owner==='shu':(!allied('shu',t.owner)||t.owner==='shu'));
  if(m.to&&!targets().some(t=>t.id===m.to))m.to=null;
  const avail=()=>gensIn(m.from).filter(g=>!g.acted&&!(purse&&C(from).gov===g.id));
  // default: best 3 by war (ruler stays unless alone)
  avail().filter(g=>!isRuler(g)).sort((a,b)=>b.war-a.war).slice(0,3).forEach(g=>m.sel.add(g.id));
  if(!m.sel.size&&avail().length)m.sel.add(avail()[0].id);
  const STEP=1000,tot=()=>[...m.sel].reduce((s,id)=>s+(m.al[id]||0),0),left=()=>C(m.from).troops-tot();
  {const ids=[...m.sel].sort((a,b)=>GN(b).war-GN(a).war),goal=Math.max(ids.length*STEP,Math.floor(C(m.from).troops*.7/STEP)*STEP);let i=0;
   while(ids.length&&tot()<goal&&left()>0){const id=ids[i%ids.length];m.al[id]=(m.al[id]||0)+Math.min(STEP,left());i++}}
  m.troops=tot();
  const need=()=>Math.ceil(m.troops*RICE_MARCH*travel()/100)*100;
  const reRice=()=>{m.rice=Math.min(RS.rice,xfer||(m.to&&C(m.to).owner==='shu')?need():Math.round(m.troops*RICE_MARCH*(travel()+3)/100)*100)};
  const travel=()=>routeOf(m.from,m.to)?routeOf(m.from,m.to)[2]:1;
  reRice();
  const box=$('#dlgbox');
  function draw(){
    const src=C(m.from),tgt=C(m.to),tr=travel(),own=tgt&&tgt.owner==='shu';
    const maxT=src.troops,maxR=Math.round(RS.rice),maxG=Math.round(RS.gold);m.gold=Math.min(m.gold,maxG);const short=own&&m.troops>0&&m.rice<need();m.troops=tot();m.rice=Math.min(m.rice,maxR);const empty=!own&&[...m.sel].some(id=>!(m.al[id]>0));const tgtOwnTroopsOnly=own&&!m.sel.size;
    const lasts=m.troops?Math.floor(m.rice/(m.troops*RICE_MARCH)):0;
    const gl=avail();const sel=[...m.sel].map(GN);
    const myP=sel.length?sel.reduce((s,g)=>s+(m.al[g.id]||0)*(60+g.war*.6)*(1+Math.max(0,g.war-80)/100),0)*(.7+.3*src.train/100):0;
    const meet=tgt?S.armies.find(a=>a.from===tgt.id&&a.to===m.from&&a.fac!=='shu'&&!allied('shu',a.fac)):null;const reinf=tgt?S.armies.filter(a=>a.to===tgt.id&&a.fac===tgt.owner&&a.left<=tr).reduce((s,a)=>s+a.troops,0):0;const dg=tgt?gensIn(tgt.id).sort((a,b)=>b.war-a.war).slice(0,4):[];const dT=tgt?tgt.troops+reinf:0;
    const thP=dg.length?dg.reduce((s,g)=>s+(dT/dg.length)*(60+g.war*.6)*(1+Math.max(0,g.war-80)/100),0):dT*85;
    const ratio=thP?myP/(thP*(.7+.3*tgt.train/100)*wallF(tgt,'shu')):9;
    const out=!tgt?['Pick a destination','#a6977a']:own?['Reinforce','#86cc90']:!sel.length?['Choose generals','#a6977a']:ratio>1.4?['Favourable','#86cc90']:ratio>.9?['Even','#d4ad55']:ratio>.6?['Risky','#e8a05f']:['Very risky','#e88b7f'];
    const keepL=(box.querySelector('.glist.mg')||{}).scrollTop||0,keepB=box.scrollTop,keepF=document.activeElement&&document.activeElement.closest&&document.activeElement.closest('#dlgbox')?[document.activeElement.dataset.sp,document.activeElement.dataset.id]:null;
    queueMicrotask(()=>{const l=box.querySelector('.glist.mg');if(l)l.scrollTop=keepL;box.scrollTop=keepB;if(keepF&&keepF[0]){const f=box.querySelector(`[data-sp="${keepF[0]}"][data-id="${keepF[1]}"]`);if(f)f.focus({preventScroll:true})}});
    box.innerHTML=`<h2>${xfer?'Transfer from':'March from'} ${src.name}${purse?' <small class="muted">· governed city</small>':''}</h2>
      <div class="mrow"><span class="lbl">Destination</span><button type="button" class="destbtn${tgt?'':' empty'}" data-pickdest="1">${tgt?`<i style="background:${FACS[tgt.owner].main}"></i><b>${tgt.name}</b><small>${own?'your city':FACS[tgt.owner].short+' · '+fmt(tgt.troops)+' troops'+(reinf?` (+${fmt(reinf)} coming)`:'')} · ${tr} month${tr>1?'s':''}</small><em>Change</em>`:'<span class="dmap" aria-hidden="true">🗺</span><b>Choose on the map</b><small>Tap to see which cities you can reach</small>'}</button></div>
      <div class="mcols"><div class="mcol"><div class="sec">Generals · ${m.sel.size} / 4 · <b class="zhb">帥</b> = commander</div>
      <div class="glist mg">${gl.map(g=>`<label class="grow pick ${m.sel.has(g.id)?'on':''}"><input type="checkbox" data-g="${g.id}" ${m.sel.has(g.id)?'checked':''} ${!m.sel.has(g.id)&&m.sel.size>=4?'disabled':''}>${gseal(g,28)}<div class="gmid"><b>${g.name}</b><small>${g.assign?`<span class="asgt">${assignLbl(g)} · leaving ends it</span>`:`W${g.war} I${g.int} · ${TYPES[g.type].n}`}</small></div>${m.sel.has(g.id)?`<span class="spin"><button type="button" data-sp="-" data-id="${g.id}" aria-label="Fewer troops for ${g.name}" ${!(m.al[g.id]>0)?'disabled':''}>−</button><b>${fmt(m.al[g.id]||0)}</b><button type="button" data-sp="+" data-id="${g.id}" aria-label="More troops for ${g.name}" ${maxT-m.troops<=0?'disabled':''}>+</button></span>`:''}${m.sel.has(g.id)?`<button type="button" class="cmdpick ${cmdOf()===g.id?'on':''}" data-c="${g.id}" aria-label="Make ${g.name} commander">帥</button>`:''}</label>`).join('')||'<p class="muted">No generals are free in this city this month.</p>'}</div>
      <p class="mnote">If the 帥 commander falls in battle, the whole army retreats.</p>
      </div><div class="mcol"><div class="mrow mtot"><span>Troops marching <b>${fmt(m.troops)}</b> of ${fmt(maxT)}</span><small>${fmt(maxT-m.troops)} stay to defend ${src.name}</small></div>${meet?`<p class="meet">⚔ ${FACS[meet.fac].short}'s army of ${fmt(meet.troops)} is marching the other way on this road. You will meet it in a field battle.</p>`:''}${empty?'<p class="bad">Give every general at least some troops with the + button.</p>':''}
      ${own||xfer?`<div class="mrow"><label for="mGold">Gold to send <b>${fmt(m.gold)}</b> of ${fmt(maxG)}</label><input id="mGold" type="range" min="0" max="${maxG}" step="50" value="${m.gold}"></div>`:''}
      <div class="mrow"><label for="mRice">Rice${own?' to send':''} <b>${fmt(m.rice)}</b> of ${fmt(maxR)}${own?(m.troops?` · ${fmt(Math.max(0,m.rice-need()))} arrives`:''):` · lasts ${lasts} month${lasts===1?'':'s'}`}</label><input id="mRice" type="range" min="0" max="${maxR}" step="100" value="${m.rice}"></div>
      <div class="msum"><div><span>Travel</span><b>${tgt?`${tr} month${tr>1?'s':''}`:'—'}</b></div><div><span>${own?'Arriving at':'Their army'}</span><b>${!tgt?'—':own?tgt.name:fmt(dT)+' · walls '+tgt.walls}</b>${!own&&reinf?`<small class="reinf">+${fmt(reinf)} on the way</small>`:''}</div><div><span>Outlook</span><b style="color:${out[1]}">${out[0]}</b></div></div>
      ${own?`<p class="${short?'bad':'muted'}">${m.troops?`Troops eat ${fmt(need())} rice on the way${short?' — not enough rice.':'.'} `:''}Gold and rice arrive with the convoy in ${tr} month${tr>1?'s':''}.</p>`:''}
      ${tgt&&lasts<tr+1&&!own?'<p class="bad">Not enough rice to reach the city and fight. Troops will desert.</p>':''}</div></div>
      <div class="dbtns"><button data-r="cancel">Cancel</button><button data-r="go" class="primary" ${(!m.sel.size&&!m.troops&&!(own&&(m.gold||m.rice)))||(!m.troops&&!own)||!m.to||empty||short?'disabled':''}>${own?'Transfer':'March out'}</button></div>`;
    $('#mRice').oninput=e=>{m.rice=+e.target.value;e.target.previousElementSibling.querySelector('b').textContent=fmt(m.rice)};
    $('#mRice').onchange=()=>draw();
    const gi=$('#mGold');if(gi){gi.oninput=e=>{m.gold=+e.target.value;e.target.previousElementSibling.querySelector('b').textContent=fmt(m.gold)};gi.onchange=()=>draw()}
    box.querySelectorAll('[data-g]').forEach(i=>i.onchange=()=>{const id=i.dataset.g;if(i.checked){if(m.sel.size<4){m.sel.add(id);m.al[id]=Math.min(STEP,left())}}else{m.sel.delete(id);delete m.al[id]}m.troops=tot();reRice();draw()});
  }
  box.onclick=e=>{const pk=e.target.closest('[data-pickdest]');if(pk){e.preventDefault();pickDest(m.from,m.to,targets().map(t=>t.id)).then(id=>{if(id){m.to=id;reRice();draw()}});return}
    const sp=e.target.closest('[data-sp]');if(sp){e.preventDefault();if(sp.disabled)return;const id=sp.dataset.id,v=m.al[id]||0;
      if(sp.dataset.sp==='+')m.al[id]=v+Math.min(STEP,left());else m.al[id]=v%STEP?v-v%STEP:Math.max(0,v-STEP);
      m.troops=tot();reRice();draw();return}
    const cb=e.target.closest('[data-c]');if(cb){e.preventDefault();m.cmd=cb.dataset.c;draw();return}
    const b=e.target.closest('[data-r]');if(!b||b.disabled)return;
    if(b.dataset.r==='go'){const own=C(m.to).owner==='shu',ci=cmdOf(),order=m.sel.size?[GN(ci),...cmdOrder([...m.sel].filter(id=>id!==ci).map(GN))]:[];for(const g of order)g.assign=null;launchArmy('shu',m.from,m.to,order,m.troops,m.rice,Object.fromEntries(order.map(g=>[g.id,m.al[g.id]||0])),own?m.gold:0);addLog(own?`${order.length?order.map(gnm).join(', '):'A convoy'} ${order.length?'set':'sets'} out from ${C(m.from).name} to ${C(m.to).name}${[m.troops?fmt(m.troops)+' troops':'',m.gold?fmt(m.gold)+' gold':'',m.rice?fmt(m.rice)+' rice':''].filter(Boolean).length?' with '+[m.troops?fmt(m.troops)+' troops':'',m.gold?fmt(m.gold)+' gold':'',m.rice?fmt(m.rice)+' rice':''].filter(Boolean).join(', '):''}.`:`${order.map(gnm).join(', ')} march from ${C(m.from).name} to ${C(m.to).name} with ${fmt(m.troops)} troops.`,'shu');save()}
    $('#dlg').hidden=true;box.onclick=null;renderCampaign()};
  box.classList.add('dwide');draw();$('#dlg').hidden=false;
}
// ---- destination picker on the China map
function pickDest(from,cur,ok){return new Promise(res=>{
  const src=C(from),okS=new Set(ok);let sel=cur&&okS.has(cur)?cur:null;
  const d=document.createElement('div');d.id='destPick';d.setAttribute('role','dialog');d.setAttribute('aria-label','Choose a destination');
  const lines=ok.map(id=>{const t=C(id),r=routeOf(from,id);return `<line x1="${src.x}" y1="${src.y}" x2="${t.x}" y2="${t.y}" class="${t.owner==='shu'?'own':'foe'}${r&&r[2]>1?' long':''}"/>`}).join('');
  const cities=()=>Object.values(S.cities).map(c=>{const F=FACS[c.owner],k=c.id===from?'src':okS.has(c.id)?'pickable':'dim';
    return `<button type="button" class="city ${k}${sel===c.id?' sel':''}" data-pk="${c.id}" style="left:${c.x}%;top:${c.y}%" aria-label="${c.name}">${cityIcon(c,F)}<span class="cn">${c.name}</span><small>${(c.troops/1000).toFixed(1)}k</small>${k==='src'?'<em class="here">You are here</em>':''}</button>`}).join('');
  const info=()=>{if(!sel)return `<p class="muted pkhint">Glowing cities are in reach of ${src.name}. Tap one to see its details.</p>`;
    const c=C(sel),F=FACS[c.owner],own=c.owner==='shu',r=routeOf(from,sel),tr=r?r[2]:0,inc=S.armies.filter(a=>a.to===c.id&&a.fac===c.owner).reduce((s,a)=>s+a.troops,0);
    const gs=gensIn(c.id).sort((a,b)=>b.war-a.war),can=okS.has(sel);
    const why=c.id===from?'Your army sets out from here.':allied('shu',c.owner)&&!own?'Allied with you until the end of 210.':!can?`Not next to ${src.name}.`:'';
    return `<div class="pkhead"><span class="pkzh" style="color:${F.light}">${c.zh}</span><div><b>${c.name}</b><small style="color:${F.light}">${own?'Your city':F.short}</small></div></div>
      <div class="pkstats"><div><span>Troops</span><b>${fmt(c.troops)}</b>${inc?`<small class="reinf">+${fmt(inc)} on the way</small>`:''}</div><div><span>Walls</span><b>${c.walls}</b></div><div><span>Training</span><b>${c.train}</b></div><div><span>Travel</span><b>${tr?`${tr} month${tr>1?'s':''}`:'—'}</b>${r&&r[3]?'<small>across the river</small>':''}</div></div>
      <div class="pkgens">${gs.length?gs.slice(0,6).map(g=>`<span>${g.name} <i>W${g.war}</i></span>`).join(''):'<span class="muted">No generals · garrison only</span>'}${gs.length>6?`<span class="muted">+${gs.length-6} more</span>`:''}</div>
      ${(x=>x?`<p class="meet">⚔ ${FACS[x.fac].short}'s army of ${fmt(x.troops)} is on this road heading for ${src.name}. March here to intercept it.</p>`:'')(S.armies.find(a=>a.from===sel&&a.to===from&&a.fac!=='shu'&&!allied('shu',a.fac)))}
      ${why?`<p class="muted">${why}</p>`:''}
      <div class="pkbtns"><button type="button" data-pkx="1">Back</button><button type="button" class="primary" data-pkgo="1" ${can?'':'disabled'}>${own?'Move here':'March on '+c.name}</button></div>`};
  const draw=()=>{d.innerHTML=`<div class="pkbar"><b>Choose a destination</b><span class="muted">from ${src.name}</span><button type="button" class="iconbtn" data-pkx="1" aria-label="Close">✕</button></div>
    <div class="pkbody"><div class="mapbox pkmap"><img src="art/map.jpg" alt="" class="mapimg"><div class="mapshade"></div><svg class="pkroutes" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${lines}</svg><div class="pkcities">${cities()}</div></div>
    <div class="pkinfo">${info()}</div></div>`};
  draw();document.body.appendChild(d);
  d.onclick=e=>{const c=e.target.closest('[data-pk]');if(c){sel=c.dataset.pk;draw();return}
    if(e.target.closest('[data-pkgo]')){d.remove();res(sel);return}
    if(e.target.closest('[data-pkx]')){if(sel&&e.target.closest('.pkinfo')){sel=null;draw();return}d.remove();res(null)}};
})}
function launchArmy(f,from,to,gens,troops,rice,split,gold){
  const src=C(from),tr=routeOf(from,to)[2];
  gold=Math.max(0,Math.min(gold||0,src.gold||0));rice=Math.max(0,Math.min(rice,src.rice||0));src.troops-=troops;src.rice-=rice;src.gold-=gold;
  const a={id:S.nextArmy++,fac:f,from,to,gens:gens.map(g=>g.id),troops,rice,gold,left:tr,total:tr,train:src.train};if(split)a.split=split;
  for(const g of gens){g.army=a.id;g.city=null;g.acted=true}
  S.armies.push(a);if(f==='shu')SND.fx('march');return a}

// ------------------------------------------------------------ month
async function endMonth(){
  if(UI.busy||S.over)return;
  if(!UI.noConfirm){const idle=gensOf('shu').filter(g=>!g.acted&&!g.army&&!g.assign&&!isDelegated(C(g.city))).length,asg=gensOf('shu').filter(g=>g.assign&&!g.acted).length;
    const r=await dialog(`<h2>End ${dateStr().split(' · ')[1]}?</h2><p>${idle?`<b>${idle} general${idle>1?'s have':' has'} not acted</b> this month.`:'All your generals have acted.'}${asg?` ${asg} assigned officer${asg>1?'s':''} will carry out ${asg>1?'their':'his'} task.`:''} The enemy will move next.</p>`,[['no','Keep playing'],['yes','End month','primary']]);
    if(r!=='yes')return}
  UI.busy=true;UI.mode='city';renderCampaign();
  try{
    try{UI.snap=JSON.stringify(S)}catch(e){}
    S.intel={};S.intelD=dateStr();
    UI.logStart=S.logN||0;
    runAssignments();govTick();
    for(const f of Object.keys(FACS))if(f!=='shu'&&alive(f))aiTurn(f);
    renderMap();
    await fieldBattles();
    // armies march and eat
    for(const a of S.armies){const need=a.troops*RICE_MARCH;if(a.rice>=need)a.rice-=need;else{a.rice=0;const l=Math.round(a.troops*.1);a.troops-=l;if(a.fac==='shu')addLog(`Your army bound for ${C(a.to).name} runs out of rice. ${fmt(l)} troops desert.`,'shu')}a.left--}
    const arrived=S.armies.filter(a=>a.left<=0).sort((x,y)=>(x.fac==='shu'||C(x.to).owner==='shu')-(y.fac==='shu'||C(y.to).owner==='shu'));
    for(const a of arrived){S.armies=S.armies.filter(x=>x!==a);await resolveArrival(a);if(S.over)break}
    if(!S.over){economy();loyaltyTick();await events();
      S.month++;if(S.month>12){S.month=1;S.year++}
      for(const g of Object.values(S.gens)){g.acted=false;g.rewarded=false}
      if(S.month===7)addLog('Harvest month: every city brings in its rice.');
      checkCampaignEnd()}
    save();
  }catch(err){console.error(err)}
  UI.busy=false;renderCampaign();if(!S.over){monthFx();const seen=new Set(S.seenThreat||[]),nw=threats().filter(a=>!seen.has(a.id));S.seenThreat=threats().map(a=>a.id);
    setTimeout(()=>monthSummary(nw),1150)}
}
const MZH=['','正月','二月','三月','四月','五月','六月','七月','八月','九月','十月','冬月','臘月'];
async function monthSummary(nw){if(S.over||!$('#dlg').hidden)return;
  const L=S.log.filter(l=>l.n>(UI.logStart||0)).reverse();const mine=L.filter(l=>l.f==='shu'),other=L.filter(l=>l.f!=='shu');const T=threats();
  if(!L.length&&!T.length)return;
  const ic=h=>/takes|defeats|holds|falls|Battle|battle/.test(h)?'⚔':/harvest/.test(h)?'🌾':/goes over|leaves|lured|deserted|slips|defect|joins|agrees to serve|persuades/.test(h)?'🔀':/run out|Riots|empty|desert/.test(h)?'⚠':/Governor|governs|assigned/.test(h)?'守':'·';
  const li=l=>`<li><span class="smi">${ic(l.h)}</span><span>${l.h}</span></li>`;
  UI.busy=true;await dialog(`<div class="dzh">報</div><h2>Report · ${S.intelD||dateStr()}</h2><p class="muted">What happened last month. It is now ${dateStr()}.</p>
    ${T.length?`<div class="sec">Threats</div><ul class="sumlist thr">${T.map(a=>`<li><span class="smi">⚠</span><span>${FACS[a.fac].short} army of <b>${fmt(a.troops)}</b> reaches <b>${C(a.to).name}</b> ${a.left<=1?'next month':`in ${a.left} months`}${nw.includes(a)?' <em class="newb">new</em>':''}</span></li>`).join('')}</ul>`:''}
    ${mine.length?`<div class="sec">Your realm</div><ul class="sumlist">${mine.map(li).join('')}</ul>`:''}
    ${other.length?`<div class="sec">Across the land</div><ul class="sumlist">${other.map(li).join('')}</ul>`:''}
    <p class="muted">Rivals' domestic work is in the Enemies tab.</p>`,[['ok','Continue','primary']]);UI.busy=false;renderCampaign()}
function monthFx(){SND.fx('gong');const old=$('#monthFx');if(old)old.remove();const se=S.month<=3?['春','#86cc90']:S.month<=6?['夏','#e8a05f']:S.month<=9?['秋','#d4ad55']:['冬','#9cc4e8'];
  const d=document.createElement('div');d.id='monthFx';d.setAttribute('aria-live','polite');
  d.innerHTML=`<div class="mfx"><b style="color:${se[1]}">${se[0]}</b><div><i>${MZH[S.month]}</i><span>${dateStr()}</span></div></div>`;
  document.body.appendChild(d);setTimeout(()=>d.remove(),1100)}
function foeReport(){const I=S.intel||{};const fs2=Object.keys(FACS).filter(f=>f!=='shu'&&alive(f));
  const nm=id=>C(id).name,list=a=>[...new Set(a)].map(nm).join(', ');
  let h=`<p class="muted fsub">What every rival did in ${S.intelD||'the last month'}.</p>`;
  for(const f of fs2){const E=I[f]||[],F=FACS[f],by=k=>E.filter(e=>e.k===k);const L=[];
    for(const e of by('march'))L.push(`<li class="${C(e.to).owner==='shu'?'threat':''}">⚔ Marches on <b>${nm(e.to)}</b> from ${nm(e.c)} with ${fmt(e.n)} troops${e.gs&&e.gs.length?' · '+e.gs.map(id=>GN(id).name).join(', '):''}</li>`);
    for(const e of by('move'))L.push(`<li>➜ Moves ${fmt(e.n)} troops from ${nm(e.c)} to ${nm(e.to)}</li>`);
    const rc=by('recruit');if(rc.length)L.push(`<li>徵 Recruits <b>+${fmt(rc.reduce((s,e)=>s+e.n,0))}</b> troops · ${list(rc.map(e=>e.c))}</li>`);
    const lab={train:'訓 Drills troops',walls:'城 Repairs walls',farm:'農 Works the fields',com:'商 Builds markets',patrol:'巡 Patrols the streets'};
    for(const k in lab){const x=by(k);if(x.length)L.push(`<li>${lab[k]} · ${list(x.map(e=>e.c))}</li>`)}
    for(const e of by('search'))if(/agrees to serve/.test(e.m))L.push(`<li>探 ${e.m}</li>`);
    h+=`<div class="foe"><div class="foeh"><i style="background:${F.main}"></i><b>${F.short}</b><small>${citiesOf(f).length} cit${citiesOf(f).length>1?'ies':'y'} · ${fmt(citiesOf(f).reduce((s,c)=>s+c.troops,0))} troops</small></div><ul>${L.join('')||'<li class="muted">Nothing seen.</li>'}</ul></div>`}
  return h}
// ---- loyalty: drifts toward what the ruler inspires; low loyalty may walk away
function loyTarget(f){const r=S.rulers&&GN(S.rulers[f]);return 50+Math.round((r?r.cha:60)/3)}
function hostileNear(cityId,f){return [...new Set(neighbours(cityId).map(n=>C(n).owner))].filter(o=>o&&o!==f&&!allied(f,o)&&alive(o))}
function moveGen(g,f,city,loy){const was=isRuler(g)&&g.fac,from=g.fac;if(g.army){const a=S.armies.find(x=>x.id===g.army);if(a)a.gens=a.gens.filter(id=>id!==g.id)}g.fac=f;g.city=city;g.army=null;g.loy=loy;g.acted=true;g.assign=null;if(was&&from!==f&&!S['gone_'+from])succession(from)}
function loyaltyTick(){
  for(const g of Object.values(S.gens)){if(!g.fac||g.hidden||isRuler(g))continue;const t=loyTarget(g.fac);
    if(g.loy<t&&Math.random()<.3)g.loy++;else if(g.loy>t&&g.loy<75&&Math.random()<.3)g.loy--;
    if(g.army||g.loy>=60||Math.random()>=(60-g.loy)/250)continue;
    const from=g.fac,opts=hostileNear(g.city,from).sort((x,y)=>loyTarget(y)-loyTarget(x)),to=opts[0];
    if(to){const dest=neighbours(g.city).map(C).find(c=>c.owner===to);moveGen(g,to,dest.id,70);
      if(from==='shu'||to==='shu'){addLog(`<b>${g.name}</b> leaves ${fs(from)} and goes over to ${fs(to)}.`,to);toast(to==='shu'?`${g.name} defects to you!`:`${g.name} has deserted you!`)}}
    else{g.fac=null;g.assign=null;g.hidden=true;if(from==='shu')addLog(`<b>${g.name}</b> slips away from your service.`,'shu')}}}
function persuadeChance(env,t){if(isFounder(t))return 0;const heir=isRuler(t)?.6:1;const lb=GN('liubei');
  return heir*Math.max(t.loy>=95?0:.01,Math.min(.85,((100-t.loy)/100)*(.2+env.int/300)+((env.fac==='shu'?lb.cha:loyTarget(env.fac)*1.2)-80)/400))}
function surrenderChance(env,f){const mine=citiesOf('shu').reduce((s,c)=>s+c.troops,0)+S.armies.filter(a=>a.fac==='shu').reduce((s,a)=>s+a.troops,0);
  const theirs=Math.max(1,citiesOf(f).reduce((s,c)=>s+c.troops,0)+S.armies.filter(a=>a.fac===f).reduce((s,a)=>s+a.troops,0));
  const R=mine/theirs,r=GN(S.rulers[f]);if(R<1.2)return .02;
  return Math.max(.02,Math.min(.8,(R-1.2)*.15+(env.int-60)/300+(70-(r?r.cha:60))/300-.1))}
function envoysFor(cid){return [...new Set(neighbours(cid).filter(n=>C(n).owner==='shu'))].flatMap(n=>gensIn(n).filter(g=>!g.acted)).sort((a,b)=>b.int-a.int)}
async function doPersuade(c){
  const envs=envoysFor(c.id);if(!envs.length){toast('No free officer in a neighbouring city.');return}
  let env=envs[0];
  for(;;){const ts=gensIn(c.id).filter(g=>!isFounder(g)).sort((a,b)=>a.loy-b.loy);
    const r=await dialog(`<div class="dzh">說</div><h2>Persuade an officer in ${c.name}</h2><p class="muted">Costs 100 gold from the envoy's city and uses his action. Officers with low loyalty listen more readily.</p>
      <div class="envrow"><span>Envoy</span>${envs.map(g=>`<button data-r="env:${g.id}" class="${g===env?'on':''}">${g.name} <i>Int ${g.int}</i></button>`).join('')}</div>
      <div class="tlist">${ts.map(g=>{const p=persuadeChance(env,g);return `<button data-r="t:${g.id}" ${p<=0||C(env.city).gold<100?'disabled':''}>${gseal(g,30)}<b>${g.name}</b><small>War ${g.war} · Int ${g.int} · Loyalty ${g.loy}</small><em>${Math.round(p*100)}%</em></button>`}).join('')||'<p class="muted">No officer here can be approached; the ruler will never betray his own cause.</p>'}</div>`,
      [['cancel','Cancel']]);
    if(r.startsWith('env:')){env=GN(r.slice(4));continue}
    if(!r.startsWith('t:'))return;
    const t=GN(r.slice(2)),p=persuadeChance(env,t);C(env.city).gold-=100;env.acted=true;UI.busy=true;const ok=Math.random()<p;
    let m;if(ok){moveGen(t,'shu',env.city,70);m=`${env.name} persuades ${t.name} to leave ${fs(c.owner)} and serve Liu Bei.`}else m=`${env.name} fails to sway ${t.name}.`;
    addLog(m,'shu');save();try{await actFx(env,'persuade',m.replace(env.name+' ',''),C(env.city),ok)}catch(e){}if(ok)await welcomeGen(t,C(env.city),'persuade');UI.busy=false;renderCampaign();return}}
async function doSurrender(c){
  const f=c.owner,envs=envoysFor(c.id);if(!envs.length){toast('No free officer in a neighbouring city.');return}
  let env=envs[0];
  for(;;){const p=surrenderChance(env,f),done=S.surTry&&S.surTry[f]===dateNum();
    const r=await dialog(`<div class="dzh">降</div><h2>Demand that ${FACS[f].name} surrender</h2>
      <p>If he accepts, ${citiesOf(f).length>1?`all ${citiesOf(f).length} of his cities`:'his city'}, its troops and his officers join you without a fight.</p>
      <p class="muted">Costs 200 gold from the envoy's city and uses his action. One attempt per month. The odds grow when your army far outnumbers his (yours ${fmt(citiesOf('shu').reduce((s,x)=>s+x.troops,0))} vs his ${fmt(citiesOf(f).reduce((s,x)=>s+x.troops,0))}).</p>
      <div class="envrow"><span>Envoy</span>${envs.map(g=>`<button data-r="env:${g.id}" class="${g===env?'on':''}">${g.name} <i>Int ${g.int}</i></button>`).join('')}</div>
      <p class="bigp">Chance: <b>${Math.round(p*100)}%</b></p>${done?'<p class="bad">You have already sent an envoy this month.</p>':''}`,
      [['cancel','Cancel'],...(done||C(env.city).gold<200?[]:[['go','Send the envoy','primary']])]);
    if(r.startsWith('env:')){env=GN(r.slice(4));continue}
    if(r!=='go')return;
    (S.surTry=S.surTry||{})[f]=dateNum();C(env.city).gold-=200;env.acted=true;UI.busy=true;const ok=Math.random()<p;let m;
    if(ok){S['gone_'+f]=1;const cs=citiesOf(f);for(const x of cs){x.owner='shu';x.troops=Math.round(x.troops*.9);x.order=Math.max(20,x.order-10)}
      for(const g of gensOf(f))moveGen(g,'shu',g.city||cs[0].id,isRuler(g)?55:62);
      for(const a of S.armies.filter(a=>a.fac===f))a.fac='shu';
      S['gone_'+f]=1;
      m=`${FACS[f].name} surrenders! ${cs.map(x=>x.name).join(', ')} and his officers join Liu Bei.`}
    else{(S.grudge[f]=S.grudge[f]||{}).shu=true;m=`${FACS[f].name} refuses to surrender.`}
    addLog(`<b>${m}</b>`,'shu');save();try{await actFx(env,'surrender',m,c,ok)}catch(e){}UI.busy=false;
    if(ok){renderCampaign();checkCampaignEnd()}else renderCampaign();return}}
function economy(){
  for(const f of Object.keys(FACS)){if(!alive(f))continue;const cs=citiesOf(f);let starve=0,broke=0;
    for(const c of cs){c.gold=Math.round(c.gold+c.com*.5*c.order/100*(f==='shu'?DF().inc:1)-gensIn(c.id).length*SALARY);
      c.rice=Math.round(c.rice-c.troops*RICE_CITY);
      if(S.month===7){const h=c.farm*40;c.rice+=h;if(f==='shu')addLog(`${c.name}'s harvest brings in ${fmt(h)} rice.`,'shu')}
      if(c.rice<0){c.rice=0;c.troops=Math.round(c.troops*.9);c.order=Math.max(0,c.order-5);starve++;if(f==='shu')addLog(`<b>${c.name} has run out of rice.</b> 10% of its troops desert and order falls.`,'shu')}
      if(c.gold<0){c.gold=0;c.order=Math.max(0,c.order-2);broke++;if(f==='shu')addLog(`${c.name} cannot pay its officials. Order slips.`,'shu')}
      if(c.order>=60)c.pop=Math.round((c.pop*1.004)*10)/10;
      if(c.order<30){const l=Math.round(c.troops*.05);c.troops-=l;if(f==='shu')addLog(`Riots in ${c.name}: ${fmt(l)} troops desert.`,'shu')}}}
}
async function events(){
  if(S.year===208&&S.month===11&&!S.flagRC){S.flagRC=1;const j=C('jiangling');
    if(j.owner==='wei'){const lost=Math.round(j.troops*.6);j.troops-=lost;j.walls=Math.max(40,j.walls-30);j.train=Math.min(j.train,50);j.order=Math.max(30,j.order-25);
      for(const id of ['caocao','xuchu']){const g=GN(id);if(g.fac==='wei'&&g.city==='jiangling'&&C('xuchang').owner==='wei')g.city='xuchang'}
      addLog(`<b>Fire at Red Cliffs.</b> Zhou Yu's fire ships burn Cao Cao's fleet. Jiangling loses ${fmt(lost)} troops and Cao Cao withdraws to Xuchang.`);
      await dialog(`<div class="dzh">赤壁</div><h2>Fire at Red Cliffs</h2><p>Huang Gai's fire ships drift into Cao Cao's chained fleet on a south-east wind. The Wei army at Jiangling loses ${fmt(lost)} troops, and Cao Cao retreats north to Xuchang.</p><p class="muted">Jiangling is shaken: its walls are damaged and its troops demoralised. Strike now and it can be yours. Wei will not march south again until 210.</p>`,[['ok','Continue','primary']])}}
  if(S.year===210&&S.month===12&&!S.flagAl){S.flagAl=1;addLog('<b>The Shu–Wu alliance ends</b> at the close of the year.');
    await dialog(`<h2>The alliance ends</h2><p>From the 1st month of 211, Shu and Wu are no longer allied. Wu will defend itself, and will march on anyone who attacks it.</p>`,[['ok','Continue','primary']])}
}
function checkCampaignEnd(){
  if(S.over)return;
  const n=citiesOf('shu').length;
  if(n>=WIN_CITIES){S.over=true;finale(true,`You hold ${n} of the 14 cities. The south and centre of the realm answer to Liu Bei.`);return}
  if(!alive('shu')){S.over=true;finale(false,'You have no cities and no army left. Liu Bei\'s cause is lost.');return}
  if(S.year>END_YEAR){S.over=true;finale(false,`The year 215 ends with Shu holding ${n} of 14 cities. You needed ${WIN_CITIES}.`)}
}
async function finale(win,text){save();renderCampaign();
  await dialog(`<div class="dzh" style="color:${win?'var(--gold)':'#e88b7f'}">${win?'勝':'敗'}</div><h2>${win?'Victory':'Defeat'}</h2><p>${text}</p>`,[['t','Back to title','primary']]);
  showScreen('title');renderTitle()}

// ------------------------------------------------------------ AI
// fighting strength of an army: troops weighted by who leads them (same formula as the march Outlook)
function armyPower(gs,troops,train){const L=gs.length?gs:[{war:45}];const per=troops/L.length;
  return L.reduce((s,g)=>s+per*(60+g.war*.6)*(1+Math.max(0,g.war-80)/100),0)*(.7+.3*(train??60)/100)}
function aiTurn(f){
  const A=FACS[f].ai;
  const allTroops=citiesOf(f).reduce((s,c)=>s+c.troops,0);
  const domestic=()=>{
  for(const c of citiesOf(f)){
    const gs=gensIn(c.id).filter(g=>!g.acted).sort((a,b)=>b.pol-a.pol),F=c;
    for(const g of gs){let k=null;
      if(c.order<60&&F.rice>2000)k='patrol';
      else if(F.gold>500&&F.rice>(c.troops+1000)*RICE_CITY*8&&c.troops<troopCap(c)-500&&c.order>50&&g.cha>=55)k='recruit';
      else if(c.train<75&&g.war>=65)k='train';
      else if(c.farm<c.farmMax&&F.gold>=50&&g.pol>=50)k='farm';
      else if(c.com<c.comMax&&F.gold>=50&&g.pol>=50)k='com';
      else if(c.walls<100&&F.gold>=50)k='walls';
      else if(c.train<100)k='train';
      if(!k)continue;if(!canPay(c,CMDS[k].cost))continue;const t0=c.troops,msg=doCmd(k,g,c,f);intel(f,{k,c:c.id,g:g.id,n:c.troops-t0,m:msg})}}
  };
  // supply: a city short of rice or gold is fed by its richest neighbour
  for(const c of citiesOf(f)){const lowR=c.rice<c.troops*RICE_CITY*4,lowG=c.gold<300;if(!lowR&&!lowG)continue;
    const d=neighbours(c.id).map(C).filter(x=>x.owner===f&&!S.armies.some(a=>a.fac===f&&a.from===x.id&&a.to===c.id)).sort((x,y)=>(y.rice-y.troops*RICE_CITY*10)-(x.rice-x.troops*RICE_CITY*10))[0];if(!d)continue;
    const sr=lowR?Math.max(0,Math.round((d.rice-d.troops*RICE_CITY*10)*.5)):0,sg=lowG?Math.max(0,Math.round((d.gold-800)*.5)):0;
    if(sr>=1000||sg>=200)launchArmy(f,d.id,c.id,[],0,sr,null,sg)}
  if(A==='passive'){domestic();return}
  if(!allied(f,'shu')&&Math.random()<.35){const envs=citiesOf(f).flatMap(c=>gensIn(c.id).filter(g=>!g.acted&&!isRuler(g))).sort((a,b)=>b.int-a.int),env=envs[0];
    const prey=env&&citiesOf(f).flatMap(c=>neighbours(c.id)).map(C).filter(c=>c.owner==='shu').flatMap(c=>gensIn(c.id)).filter(g=>!isRuler(g)&&g.loy<70)
      .sort((a,b)=>a.loy-b.loy)[0];
    if(prey){env.acted=true;const p=persuadeChance(env,prey)*.5;
      if(Math.random()<p){const dest=neighbours(prey.city).map(C).find(c=>c.owner===f);moveGen(prey,f,dest.id,62);addLog(`<b>${prey.name}</b> is lured away by ${env.name} and joins ${fs(f)}.`,f);toast(`${prey.name} has gone over to ${FACS[f].short}!`)}
      else addLog(`${env.name} of ${fs(f)} tries to lure ${prey.name} away, but he stays loyal.`,'shu')}}
  // move troops and spare generals from safe rear cities toward the border
  const mine=citiesOf(f),front=mine.filter(c=>neighbours(c.id).some(n=>{const o=C(n).owner;return o!==f&&!allied(f,o)}));
  if(front.length){const dist={},q=[];for(const c of front){dist[c.id]=0;q.push(c.id)}
    while(q.length){const id=q.shift();for(const n of neighbours(id)){if(C(n).owner!==f||dist[n]!=null)continue;dist[n]=dist[id]+1;q.push(n)}}
    // a border city wants enough troops to face what sits next to it (and anything marching on it)
    const hostile=o=>o!==f&&!allied(f,o);
    const incoming=id=>S.armies.filter(a=>a.fac===f&&a.to===id).reduce((s,a)=>s+a.troops,0);
    const want=id=>{const t=neighbours(id).map(C).filter(n=>hostile(n.owner)).reduce((s,n)=>s+n.troops*.6,0)+S.armies.filter(a=>a.to===id&&hostile(a.fac)).reduce((s,a)=>s+a.troops,0);return Math.max(6000,Math.round(t*1.1))};
    const gap=id=>dist[id]===0?want(id)-C(id).troops-incoming(id):Math.max(0,8000-C(id).troops-incoming(id))+neighbours(id).filter(n=>dist[n]!=null&&dist[n]<dist[id]).reduce((s,n)=>s+Math.max(0,gap(n)),0)*.5;
    for(const c of mine){if(!dist[c.id]||c.troops<9000||S.armies.some(a=>a.fac===f&&a.from===c.id))continue;
      const opts=neighbours(c.id).filter(n=>dist[n]!=null&&dist[n]<dist[c.id]).map(n=>[n,gap(n)]).sort((x,y)=>y[1]-x[1]);if(!opts.length||opts[0][1]<2000)continue;
      const to=opts[0][0],amt=Math.round(Math.min(c.troops-7000,opts[0][1],(c.troops-7000)*.6)/500)*500;if(amt<2000)continue;
      const gs=gensIn(c.id).filter(g=>!g.acted).sort((a,b)=>b.war-a.war),spare=gs.filter(g=>!isRuler(g)).slice(0,Math.min(amt>=8000?2:1,gensIn(c.id).length-1));
      const tr=routeOf(c.id,to)[2];launchArmy(f,c.id,to,spare,amt,Math.round(amt*RICE_MARCH*tr+Math.max(0,c.rice-c.troops*RICE_CITY*8)*.5),null,Math.max(0,c.gold-600)*.5);intel(f,{k:'move',c:c.id,to,n:amt,gs:spare.map(g=>g.id)})}}
  if((A==='aggressive'&&dateNum()<210*12+1)||(S.armies.some(a=>a.fac===f&&C(a.to).owner!==f)&&Math.random()<.5)){domestic();return}
  let best=null;
  for(const c of citiesOf(f)){const gs=gensIn(c.id).filter(g=>!g.acted);if(!gs.length||c.troops<6000)continue;
    for(const nid of neighbours(c.id)){const t=C(nid);if(t.owner===f||allied(f,t.owner))continue;
      const grudge=S.grudge[f]&&S.grudge[f][t.owner];
      if(S.armies.some(a=>a.fac===f&&a.to===nid))continue;
      const tr=routeOf(c.id,nid)[2],send=c.troops*.65,need=send*RICE_MARCH*(tr+3);
      const go=gs.filter(g=>!isRuler(g)).slice(0,3);if(!go.length)continue;
      const inc=S.armies.filter(a=>a.to===nid&&a.fac===t.owner&&a.left<=tr).reduce((s,a)=>s+a.troops,0);
      const ratio=armyPower(go,send,c.train)/Math.max(1,armyPower(gensIn(nid).sort((a,b)=>b.war-a.war).slice(0,4),t.troops+inc,t.train)*wallF(t,f));
      const bar=(A==='aggressive'?1.25:A==='defensive'?(grudge?1.3:1.8):9)+(t.owner==='shu'?DF().aiBar:0);
      if(ratio>bar&&c.rice>need+(c.troops-send)*RICE_CITY*4&&(!best||ratio>best.score))best={score:ratio,c,t,send,need}}}
  if(!best){domestic();return}
  const gs=gensIn(best.c.id).filter(g=>!g.acted).sort((a,b)=>b.war-a.war);const keep=gs.find(g=>isRuler(g))||(gensIn(best.c.id).length>1?gs[gs.length-1]:null);
  const go=gs.filter(g=>g!==keep).slice(0,3);if(!go.length){domestic();return}
  const a=launchArmy(f,best.c.id,best.t.id,go,Math.round(best.send),Math.round(best.need));
  addLog(`${fs(f)} marches on ${best.t.name} from ${best.c.name} with ${fmt(a.troops)} troops.`,f);intel(f,{k:'march',c:best.c.id,to:best.t.id,n:a.troops,gs:go.map(g=>g.id)});
  if(best.t.owner==='shu')toast(`${FACS[f].short} army of ${fmt(a.troops)} marches on ${best.t.name}!`);
  domestic();
}

// ------------------------------------------------------------ battles
function cmdOrder(gs){return [...gs].sort((a,b)=>(isRuler(b)-isRuler(a))||b.war-a.war)}
async function resolveArrival(a){
  const c=C(a.to),gens=a.gens.map(GN).filter(g=>g&&g.fac===a.fac);
  if(c.owner===a.fac){c.gold+=Math.round(a.gold||0);a.gold=0}
  if(!gens.length&&a.troops<=0){if(c.owner===a.fac)c.rice+=Math.round(a.rice);else returnHome(a,[],0);return}
  if(c.owner===a.fac){
    c.troops+=a.troops;c.rice+=Math.round(a.rice);for(const g of gens){g.army=null;g.city=c.id}
    if(a.fac==='shu')addLog(`Your army reaches ${c.name}: ${fmt(a.troops)} troops join the garrison.`,'shu');return}
  if(allied(a.fac,c.owner)){returnHome(a,gens,a.troops);return}
  (S.grudge[c.owner]=S.grudge[c.owner]||{})[a.fac]=true;
  let defG=cmdOrder(gensIn(c.id)).slice(0,4);
  const playerIn=a.fac==='shu'||c.owner==='shu';
  if(c.troops<=0&&!defG.length){takeCity(a,c,gens,a.troops,[]);if(playerIn)addLog(`${c.name} falls without a fight.`);return}
  let res;
  if(playerIn&&UI.snap){try{localStorage.setItem(PRE,UI.snap)}catch(e){}}
  if(playerIn&&c.owner==='shu'&&gensIn(c.id).length){defG=await pickDefenders(a,c,gens,defG);if(!defG)defG=cmdOrder(gensIn(c.id)).slice(0,4)}
  if(playerIn){
    const me=a.fac==='shu',foe=me?c.owner:a.fac;
    const html=`<div class="dzh">戰</div><h2>Battle at ${c.name}</h2>
      <div class="vs"><div><b style="color:${FACS[a.fac].light}">${FACS[a.fac].short} · attacking</b><span>${fmt(a.troops)} troops</span><small>${gens.map(g=>g.name).join(', ')}</small></div>
      <div><b style="color:${FACS[c.owner].light}">${FACS[c.owner].short} · defending</b><span>${fmt(c.troops)} troops · walls ${c.walls}</span><small>${defG.map(g=>g.name).join(', ')||'Garrison only'}</small></div></div>
      <p class="muted">Fight it yourself on the battlefield, or let your officers settle it.</p>`;
    const r=await dialog(html,[['auto','Auto-resolve'],['fight','Fight the battle','primary']]);
    res=r==='fight'?await playCampaignBattle(a,c,gens,defG):autoBattle(a,c,gens,defG);
    if(r!=='fight'){const w=(res.attWin&&me)||(!res.attWin&&!me);
      await dialog(`<div class="dzh" style="color:${w?'var(--gold)':'#e88b7f'}">${w?'勝':'敗'}</div><h2>${w?'Victory':'Defeat'} at ${c.name}</h2><p>${res.summary}</p>`,[['ok','Continue','primary']])}
  } else res=autoBattle(a,c,gens,defG);
  await applyBattle(a,c,gens,defG,res);
}
async function fieldBattles(){
  for(const a of [...S.armies]){if(!S.armies.includes(a))continue;
    const b=S.armies.find(x=>x!==a&&x.from===a.to&&x.to===a.from&&x.fac!==a.fac&&!allied(a.fac,x.fac));if(!b)continue;
    let A=a,B=b;if(b.fac==='shu'){A=b;B=a}
    const gA=A.gens.map(GN).filter(g=>g&&g.fac===A.fac),gB=B.gens.map(GN).filter(g=>g&&g.fac===B.fac);
    if((!gA.length&&A.troops<=0)||(!gB.length&&B.troops<=0))continue;
    const road={id:'field',field:true,name:`the road between ${C(A.from).name} and ${C(A.to).name}`,owner:B.fac,troops:B.troops,train:B.train,walls:0,order:50};
    const playerIn=A.fac==='shu';let res;
    if(playerIn){const r=await dialog(`<div class="dzh">遭</div><h2>Armies meet on the road</h2><p>Your army marching to ${C(A.to).name} runs into ${fs(B.fac)}'s army heading for ${C(B.to).name}. There are no walls here: a straight fight in the open.</p>
        <div class="vs"><div><b style="color:${FACS.shu.light}">Shu</b><span>${fmt(A.troops)} troops</span><small>${gA.map(g=>g.name).join(', ')}</small></div><div><b style="color:${FACS[B.fac].light}">${FACS[B.fac].short}</b><span>${fmt(B.troops)} troops</span><small>${gB.map(g=>g.name).join(', ')||'No general'}</small></div></div>`,
        [['auto','Auto-resolve'],['fight','Fight the battle','primary']]);
      res=r==='fight'?await playCampaignBattle(A,road,gA,gB):autoBattle(A,road,gA,gB);res.fromField=r==='fight'}
    else res=autoBattle(A,road,gA,gB);
    const aS=Object.values(res.att).reduce((s,x)=>s+x,0),bS=Object.values(res.def).reduce((s,x)=>s+x,0);
    const W=res.attWin?A:B,L=res.attWin?B:A,lostG=res.attWin?gB:gA,lostBrk=res.attWin?res.defBroken:res.attBroken;
    A.troops=aS;B.troops=bS;
    const caps=lostG.filter(g=>res.captured&&res.captured.length?res.captured.includes(g.id):lostBrk.includes(g.id)&&Math.random()<capAdj(g,.4));
    for(const g of caps){L.gens=L.gens.filter(id=>id!==g.id);g.army=null}
    S.armies=S.armies.filter(x=>x!==L);returnHome(L,lostG.filter(g=>!caps.includes(g)),L.troops);
    if(W.troops<=0&&!W.gens.length)S.armies=S.armies.filter(x=>x!==W);
    addLog(`${fs(W.fac)} defeats ${fs(L.fac)} on ${road.name}. The beaten army falls back to ${C(L.from).owner===L.fac?C(L.from).name:'its lands'}.`,W.fac);
    if(playerIn&&!res.fromField){const w=W.fac==='shu';await dialog(`<div class="dzh" style="color:${w?'var(--gold)':'#e88b7f'}">${w?'勝':'敗'}</div><h2>${w?'The road is yours':'Your army is driven back'}</h2><p>${w?`${fs(L.fac)}'s army falls back. Your army marches on to ${C(W.to).name} with ${fmt(W.troops)} troops.`:`Your army retreats toward ${C(L.from).name} with ${fmt(L.troops)} troops.`}</p>`,[['ok','Continue','primary']])}
    const home=C(W.from).owner===W.fac?C(W.from):C(W.to);
    for(const g of caps)await handleCapture(g,W.fac,home);
    if(S.over)return}}
async function pickDefenders(a,c,gens,def0){
  const all=cmdOrder(gensIn(c.id));const sel=new Set(def0.map(g=>g.id));let cmd=def0[0]&&def0[0].id;
  for(;;){if(!sel.has(cmd))cmd=[...sel][0];
    const r=await dialog(`<div class="dzh">守</div><h2>${FACS[a.fac].short} attacks ${c.name}</h2>
      <p>${fmt(a.troops)} troops led by ${gens.map(g=>g.name).join(', ')||'no general'} are at the gates. Your ${fmt(c.troops)} troops are split evenly between the officers you send out.</p>
      <p class="muted">Pick up to 4 officers to defend, then choose the 帥 commander. If he falls, the defence collapses.</p>
      <div class="tlist dpick">${all.map(g=>`<button data-r="tog:${g.id}" class="${sel.has(g.id)?'on':''}" ${!sel.has(g.id)&&sel.size>=4?'disabled':''}>${gseal(g,30)}<b>${sel.has(g.id)?'✓ ':''}${g.name}</b><small>War ${g.war} · Int ${g.int} · ${TYPES[g.type].n}</small><em>${cmd===g.id?'帥':''}</em></button>`).join('')}</div>
      <div class="envrow"><span>Commander</span>${[...sel].map(id=>`<button data-r="cmd:${id}" class="${cmd===id?'on':''}">帥 ${GN(id).name}</button>`).join('')}</div>`,
      [['go',`Defend with ${sel.size} officer${sel.size>1?'s':''}`,'primary']]);
    if(r.startsWith('tog:')){const id=r.slice(4);if(sel.has(id)){if(sel.size>1)sel.delete(id)}else if(sel.size<4)sel.add(id);continue}
    if(r.startsWith('cmd:')){cmd=r.slice(4);continue}
    const rest=cmdOrder([...sel].filter(id=>id!==cmd).map(GN));return [GN(cmd),...rest]}}
function unitSplit(gs,total){const n=gs.length||1;return gs.map(()=>Math.floor(total/n))}
// player armies carry a per-general split; scale it to what is left after desertion
function armySplit(a,gs){if(!a.split)return unitSplit(gs,a.troops);const w=gs.map(g=>a.split[g.id]||0),t=w.reduce((x,y)=>x+y,0);
  if(!t)return unitSplit(gs,a.troops);return w.map(v=>Math.floor(a.troops*v/t))}
function autoBattle(a,c,gens,defG){
  const pw=(gs,tr,train)=>gs.reduce((s,g,i)=>s+tr[i]*(60+g.war*.6)*(1+Math.max(0,g.war-80)/100),0)*(.7+.3*train/100);
  const aT=armySplit(a,gens),dGs=defG.length?defG:[{id:'garrison',war:45}],dT=unitSplit(dGs,c.troops);
  const PA=pw(gens,aT,a.train)*rnd(.85,1.15),PD=pw(dGs,dT,c.train)*(c.field?1:wallF(c,a.fac))*rnd(.85,1.15);
  const attWin=PA>PD,ratio=Math.min(PA,PD)/Math.max(PA,PD||1);
  const lL=rnd(.55,.8),wL=.45*ratio*rnd(.8,1.2);
  const att={},def={},attBroken=[],defBroken=[];
  gens.forEach((g,i)=>{const t=Math.round(aT[i]*(1-(attWin?wL:lL)));if(!attWin&&Math.random()<.35){attBroken.push(g.id);att[g.id]=0}else att[g.id]=t});
  dGs.forEach((g,i)=>{const t=Math.round(dT[i]*(1-(attWin?lL:wL)));if(attWin&&Math.random()<.35){defBroken.push(g.id);def[g.id]=0}else def[g.id]=t});
  const aS=Object.values(att).reduce((s,x)=>s+x,0),dS=Object.values(def).reduce((s,x)=>s+x,0);
  return {attWin,att,def,attBroken,defBroken,reserve:0,
    summary:`${FACS[a.fac].short} ${attWin?'takes':'fails to take'} ${c.name}. Attackers ${fmt(a.troops)} → ${fmt(aS)}, defenders ${fmt(c.troops)} → ${fmt(dS)}.`}}
function nearestOwn(f,from){const cs=citiesOf(f).filter(x=>x.id!==from);if(!cs.length)return null;const o=C(from);
  const adj=cs.filter(x=>neighbours(from).includes(x.id));const pool=adj.length?adj:cs;
  return pool.sort((p,q)=>Math.hypot(p.x-o.x,p.y-o.y)-Math.hypot(q.x-o.x,q.y-o.y))[0]}
function returnHome(a,gens,troops){const home=C(a.from).owner===a.fac?C(a.from):nearestOwn(a.fac,a.to);
  if(!home){for(const g of gens)g.army=null;gens.forEach(g=>{g.fac=null;g.assign=null;g.city=a.from;g.hidden=true});return}
  home.troops+=troops;home.rice+=Math.round(a.rice*.5);home.gold+=Math.round(a.gold||0);for(const g of gens){g.army=null;g.city=home.id}}
async function applyBattle(a,c,gens,defG,res){
  const caps=[];const oldOwner=c.owner;
  const aS=Object.values(res.att).reduce((s,x)=>s+x,0),dS=Object.values(res.def).reduce((s,x)=>s+x,0);
  if(res.attWin){
    const flee=nearestOwn(oldOwner,c.id);
    for(const g of gensIn(c.id)){const inBattle=defG.includes(g),broken=res.defBroken.includes(g.id);
      const capP=res.captured?(res.captured.includes(g.id)?1:broken?0:capAdj(g,inBattle?.25:.3)):capAdj(g,broken?.55:inBattle?.25:.3);
      if(Math.random()<capP||(!flee&&g.war<95)){caps.push(g);g.city=null}else if(flee)g.city=flee.id;else{g.fac=null;g.assign=null;g.hidden=true;g.city=c.id}}
    if(flee)flee.troops+=Math.round(dS*.5);
    takeCity(a,c,gens,aS,res.attBroken);
    addLog(`${fs(a.fac)} takes <b>${c.name}</b> from ${fs(oldOwner)}.`,a.fac);
  } else {
    c.troops=dS+(res.reserve||0);c.order=Math.min(100,c.order+3);
    const back=[];for(const g of gens){const cap=res.captured?res.captured.includes(g.id):res.attBroken.includes(g.id)&&Math.random()<capAdj(g,.4);if(cap){caps.push(g);g.army=null;g.city=null}else back.push(g)}
    returnHome(a,back,aS);
    addLog(`${fs(oldOwner)} holds <b>${c.name}</b> against ${fs(a.fac)}.`,oldOwner);
  }
  const captor=res.attWin?a.fac:oldOwner;
  for(const g of caps)await handleCapture(g,captor,c);
  for(const f of Object.keys(FACS))if(f!=='shu'&&!alive(f)&&!S['gone_'+f]){S['gone_'+f]=1;
    for(const g of gensOf(f)){g.fac=null;g.assign=null;g.hidden=true;g.army=null;g.city=g.city||c.id}
    addLog(`<b>${FACS[f].name}'s rule is ended.</b> His officers scatter.`)}
  checkCampaignEnd();
}
function capAdj(g,p){return g.war>=95?0:g.war>=90?p/2:p}
function takeCity(a,c,gens,troops,broken){if(c.gov){c.gov=null;c.mode=null}
  c.owner=a.fac;c.troops=troops;c.train=Math.round(a.train*.85);c.order=Math.max(20,c.order-25);c.walls=Math.max(20,c.walls-25);
  c.farm=Math.round(c.farm*.9);c.com=Math.round(c.com*.85);c.pop=Math.round(c.pop*.95*10)/10;
  c.gold=Math.round((c.gold||0)*.5+300+(a.gold||0));c.rice=Math.round((c.rice||0)*.5+a.rice*.8);
  for(const g of gens){g.army=null;g.city=c.id;g.acted=true}
  if(c.owner==='shu')S.sel=c.id;
}
async function handleCapture(g,captor,c){
  if(g.id==='liubei'){S.over=true;await finale(false,`Liu Bei is captured at ${c.name}. Without him, Shu falls apart.`);return}
  const from=g.fac;
  if(captor==='shu'){
    const ruler=isRuler(g),founder=isFounder(g);const p=Math.min(.95,(.25+(100-g.loy)/150+.15)*(ruler&&!founder?.8:1));
    const r=await dialog(`<div class="cap1">${gseal(g,72)}<div><h2>${g.name} is captured</h2><p class="muted">${FACS[from].short} · War ${g.war} · Int ${g.int} · Loyalty ${g.loy}${founder?' · ruler of '+FACS[from].short:ruler?' · took command of '+FACS[from].short+'\'s men after his lord fell':''}</p></div></div>
      <p>${founder?'A ruler will never serve you.':`About ${Math.round(p*100)}% chance he agrees to serve Liu Bei.`}</p>`,
      [...(founder?[]:[['rec','Recruit','primary']]),['rel','Release'],['exe','Execute']]);
    if(r==='rec'){if(Math.random()<p){g.fac='shu';g.city=c.id;g.loy=70;g.acted=true;addLog(`${g.name} agrees to serve Liu Bei.`,'shu');if(ruler)succession(from);await welcomeGen(g,c,'capture')}
      else{const h=nearestOwn(from,c.id);if(h){g.city=h.id}else{g.fac=null;g.assign=null;g.hidden=true;g.city=c.id}addLog(`${g.name} refuses and is released.`,'shu');toast(`${g.name} refuses to serve.`)}}
    else if(r==='rel'){const h=nearestOwn(from,c.id);if(h)g.city=h.id;else{g.fac=null;g.assign=null;g.hidden=true;g.city=c.id}addLog(`${g.name} is released.`,'shu')}
    else{delete S.gens[g.id];addLog(`${g.name} is executed.`,'shu');if(ruler)succession(from)}
  } else {
    if(!isRuler(g)&&Math.random()<(100-g.loy)/100*.8){g.fac=captor;g.city=c.id;g.loy=60;addLog(`${gnm({...g,fac:from})} goes over to ${fs(captor)}.`,captor)}
    else{const h=nearestOwn(from,c.id);if(h)g.city=h.id;else{g.fac=null;g.assign=null;g.hidden=true;g.city=c.id}addLog(`${g.name} is captured by ${FACS[captor].short} and released.`)}
  }
}
function succession(f){const heir=gensOf(f).sort((a,b)=>b.cha-a.cha)[0];
  if(heir){S.rulers[f]=heir.id;addLog(`${heir.name} takes command of ${FACS[f].short}'s men.`)}}

// ---------- hand-off to the tactical battle
function genBattleMap(fortSide,river,seed){
  const r=rng(seed),rows=[];
  for(let y=0;y<ROWS;y++){const row=[];for(let x=0;x<COLS;x++){const v=r();row.push(v<.09?'f':v<.15?'h':'.')}rows.push(row)}
  for(let k=0;k<5;k++){const x=2+Math.floor(r()*(COLS-4)),y=Math.floor(r()*ROWS);for(const [dx,dy] of [[0,0],[1,0],[0,1],[-1,0],[0,-1],[1,1]])if(r()<.7&&x+dx>=0&&x+dx<COLS&&y+dy>=0&&y+dy<ROWS)rows[y+dy][x+dx]='f'}
  const rc=Math.floor(COLS/2)-(r()<.5?1:0);
  if(river)for(let y=0;y<ROWS;y++)rows[y][rc]='w';
  for(const x of [0,1,2,3,COLS-4,COLS-3,COLS-2,COLS-1])for(let y=1;y<ROWS-1;y++)if(rows[y][x]!=='w')rows[y][x]='.';
  let y=3+Math.floor(r()*2);
  for(let x=0;x<COLS;x++){
    if(x>1&&x<COLS-2&&x!==rc&&x!==rc+1&&r()<.3){const ny=Math.max(2,Math.min(5,y+(r()<.5?-1:1)));rows[y][x]='p';y=ny}
    rows[y][x]=rows[y][x]==='w'?'=':'p'}
  if(river){for(const yy of [1,6])if(r()<.75)rows[yy][rc]='='}
  if(fortSide!=='N'){const fc=fortSide==='R'?COLS-2:1;for(const yy of [2,4,6])rows[yy][fc]='c'}
  return rows.map(r=>r.join(''))}
function toUnit(g,troops,side,spot,cmd,train){return {id:g.id,name:g.name,ch:g.ch,side,type:g.type,war:g.war,int:g.int,troops:Math.max(1,troops),x:spot[0],y:spot[1],cmd,train,
  pers:g.war>=90?{strike:.45,guard:.27,feint:.28}:g.int>=80?{strike:.28,guard:.32,feint:.4}:{strike:.33,guard:.37,feint:.3}}}
function playCampaignBattle(a,c,gens,defG){
  const me=a.fac==='shu',foe=me?c.owner:a.fac,fortSide=c.field?'N':me?'R':'L';
  const route=routeOf(a.from,a.to),river=route&&route[3]?true:Math.random()<.25;
  const SPA=sd=>sd==='L'?[[3,4],[3,2],[3,6],[2,3]]:[[COLS-4,4],[COLS-4,2],[COLS-4,6],[COLS-3,3]];
  const SPD=sd=>sd==='L'?[[1,4],[1,2],[1,6],[0,3]]:[[COLS-2,4],[COLS-2,2],[COLS-2,6],[COLS-1,3]];
  const dGs=defG.length?defG:[{id:'garrison',name:'Garrison captain',ch:'守',type:'shield',war:50,int:40}];
  const aT=armySplit(a,gens),dT=unitSplit(dGs,c.troops);
  const attU=gens.map((g,i)=>toUnit(g,aT[i],me?'shu':'wei',SPA(me?'L':'R')[i],i===0,a.train));
  const defU=dGs.map((g,i)=>toUnit(g,dT[i],me?'wei':'shu',SPD(me?'R':'L')[i],i===0,c.train));
  return startBattle({units:[...attU,...defU],foe,walls:c.walls,map:genBattleMap(fortSide,river,Math.floor(Math.random()*1e6)),
    playerAttacks:me,title:c.field?`Battle on ${c.name}`:`Battle of ${c.name}`,sub:c.field?`Field battle · ${FACS[a.fac].short} meets ${FACS[c.owner].short} in the open, no walls`:`${FACS[a.fac].short} attacks · ${FACS[c.owner].short} defends behind walls ${c.walls}`})
    .then(r=>{const att={},def={},attBroken=[],defBroken=[];
      const read=(gs,tr,side,out,brk)=>gs.forEach((g,i)=>{if(r.left[g.id]!=null)out[g.id]=r.left[g.id];else{out[g.id]=0;brk.push(g.id)}});
      read(gens,aT,'',att,attBroken);read(dGs,dT,'',def,defBroken);
      if(r.retreat&&me){gens.forEach(g=>{if(att[g.id]===0&&!attBroken.includes(g.id))att[g.id]=0})}
      const attWin=me?r.win:!r.win;
      return {attWin,att,def,attBroken:attBroken.filter(id=>id!=='garrison'),defBroken:defBroken.filter(id=>id!=='garrison'),captured:r.captured||[],reserve:0,summary:''}})
}
