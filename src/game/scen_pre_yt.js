// =====================================================================
// SCENARIOS · whole-China map (Anthony 1 Nov): AD 189, 194, 208; play as any ruler or the New Hero
// =====================================================================
// id, name, zh, x%, y% on art/map.jpg (whole China), tier (c=capital, l=large, s=small, f=frontier)
const CITY44=[
 ['xiliang','Xiliang','西涼',10.7,13.7,'f'],['tianshui','Tianshui','天水',6.2,37.4,'s'],['anding','Anding','安定',20.8,33.8,'s'],
 ['changan','Chang\'an','長安',25.8,49.6,'c'],['xiabian','Xiabian','下辨',11,53.5,'f'],['hanzhong','Hanzhong','漢中',22.1,56.3,'l'],
 ['zitong','Zitong','梓潼',9.7,60.9,'s'],['chengdu','Chengdu','成都',4.6,65.5,'c'],['jiangzhou','Jiangzhou','江州',11,77.5,'s'],
 ['yongan','Yong\'an','永安',16.2,69.1,'s'],['shangyong','Shangyong','上庸',31.7,62.3,'f'],['hongnong','Hongnong','弘農',34.8,46.8,'s'],
 ['luoyang','Luoyang','洛陽',44.4,48.9,'c'],['wancheng','Wancheng','宛城',35.9,53.9,'l'],['xinye','Xinye','新野',41.3,60.6,'s'],
 ['xiangyang','Xiangyang','襄陽',45.6,67.8,'l'],['jiangling','Jiangling','江陵',40.6,75.6,'l'],['wuling','Wuling','武陵',38.2,82.8,'f'],
 ['changsha','Changsha','長沙',53.4,85.2,'s'],['lingling','Lingling','零陵',42.3,90.8,'f'],['guiyang','Guiyang','桂陽',51.4,94.7,'f'],
 ['jiangxia','Jiangxia','江夏',60,70.4,'s'],['chaisang','Chaisang','柴桑',59.2,80.3,'l'],['lujiang','Lujiang','廬江',61.7,62,'s'],
 ['shouchun','Shouchun','壽春',65.4,55.2,'l'],['hefei','Hefei','合肥',69.6,60.2,'l'],['runan','Runan','汝南',52.4,59.8,'l'],
 ['xuchang','Xuchang','許昌',53.4,50.7,'c'],['chenliu','Chenliu','陳留',53.4,45,'l'],['qiao','Qiao','譙',61.5,46.5,'s'],
 ['puyang','Puyang','濮陽',59.7,39.4,'l'],['xiapi','Xiapi','下邳',74.1,45.8,'l'],['xuzhou','Xuzhou','徐州',67.9,39.4,'l'],
 ['beihai','Beihai','北海',72.9,31.7,'s'],['ye','Ye','鄴',51.4,31.7,'c'],['nanpi','Nanpi','南皮',61.2,21.1,'l'],
 ['pingyuan','Pingyuan','平原',54.7,24.3,'s'],['jinyang','Jinyang','晉陽',44.9,25.7,'s'],['daixian','Daixian','代縣',43.6,10.5,'f'],
 ['beiping','Beiping','北平',59.7,10.5,'l'],['xiangping','Xiangping','襄平',81.9,7.7,'f'],['jianye','Jianye','建業',77.2,66.5,'c'],
 ['wu','Wu','吳',81.9,72.9,'l'],['kuaiji','Kuaiji','會稽',76.3,81,'s']];
// a, b, months, river?
const ROUTES44=[
 ['xiliang','anding',2],['xiliang','tianshui',2],['tianshui','anding',1],['tianshui','xiabian',1],['anding','changan',1],['tianshui','changan',2],
 ['changan','hongnong',1],['changan','hanzhong',2],['xiabian','hanzhong',1],['xiabian','zitong',2],['hanzhong','zitong',2],['hanzhong','shangyong',1],
 ['zitong','chengdu',1],['chengdu','jiangzhou',2],['zitong','jiangzhou',2],['jiangzhou','yongan',1,1],['yongan','jiangling',2,1],['yongan','shangyong',2],
 ['shangyong','xiangyang',2],['shangyong','wancheng',2],['hongnong','luoyang',1],['hongnong','wancheng',2],['luoyang','wancheng',1],['luoyang','xuchang',1],
 ['luoyang','chenliu',1],['luoyang','jinyang',2],['luoyang','ye',2,1],['wancheng','xinye',1],['wancheng','xuchang',1],['xinye','xiangyang',1],['xinye','runan',2],
 ['xiangyang','jiangling',1],['xiangyang','jiangxia',2],['jiangling','wuling',1],['jiangling','jiangxia',2,1],['jiangling','changsha',2],
 ['wuling','lingling',1],['changsha','lingling',1],['changsha','guiyang',1],['lingling','guiyang',1],['changsha','chaisang',2],['jiangxia','chaisang',1,1],
 ['jiangxia','lujiang',1,1],['runan','jiangxia',2],['runan','xuchang',1],['runan','shouchun',1],['runan','lujiang',2],['xuchang','chenliu',1],['xuchang','qiao',1],
 ['chenliu','puyang',1],['chenliu','qiao',1],['puyang','ye',1],['puyang','xuzhou',1],['puyang','pingyuan',2],['qiao','xiapi',2],['qiao','shouchun',1],['qiao','xuzhou',1],
 ['xuzhou','xiapi',1],['xuzhou','beihai',1],['xiapi','jianye',2,1],['shouchun','hefei',1],['hefei','lujiang',1],['hefei','jianye',1,1],
 ['lujiang','chaisang',1,1],['chaisang','jianye',2,1],['jianye','wu',1],['wu','kuaiji',1],['ye','pingyuan',1],['ye','jinyang',1],
 ['pingyuan','nanpi',1],['pingyuan','beihai',2],['nanpi','beiping',1],['beiping','daixian',2],['jinyang','daixian',1],['beiping','xiangping',2],['nanpi','ye',1]];
const TIER_STATS={c:[1000,1000,90,600],l:[850,850,75,400],s:[700,650,55,240],f:[600,500,45,160]}; // farmMax, comMax, walls, pop(k)
const CITY_TIER44={c:'capital',l:'large',s:'small',f:'small'};
// ---------- every faction that can appear; key 'lb' = Liu Bei (the player's chosen faction is renamed 'shu' at start)
const FAC_ALL={
 wei:{name:'Cao Cao',short:'Cao Cao',zh:'曹',main:'#4a78c0',dark:'#28457a',light:'#8fb2ea',ruler:'caocao',spr:'wei',ico:'wei',ai:'aggressive'},
 lb:{name:'Liu Bei',short:'Liu Bei',zh:'劉',main:'#4f9a5a',dark:'#2c5a34',light:'#86cc90',ruler:'liubei',spr:'shu',ico:'shu',ai:'defensive'},
 wu:{name:'Sun Jian',short:'Sun Jian',zh:'孫',main:'#c4473a',dark:'#7e2a21',light:'#e88b7f',ruler:'sunjian',spr:'wu',ico:'wu',ai:'defensive'},
 dong:{name:'Dong Zhuo',short:'Dong Zhuo',zh:'董',main:'#7b4fa8',dark:'#47295f',light:'#bb98dd',ruler:'dongzhuo',spr:'ind',ico:'dong',ai:'aggressive'},
 yuanshao:{name:'Yuan Shao',short:'Yuan Shao',zh:'袁',main:'#c9a227',dark:'#76600f',light:'#ecd27a',ruler:'yuanshao',spr:'ind',ico:'yuanshao',ai:'aggressive'},
 yuanshu:{name:'Yuan Shu',short:'Yuan Shu',zh:'術',main:'#d9822b',dark:'#7f4612',light:'#f2b77a',ruler:'yuanshu',spr:'ind',ico:'yuanshu',ai:'aggressive'},
 liubiao:{name:'Liu Biao',short:'Liu Biao',zh:'表',main:'#2f9c95',dark:'#185853',light:'#7fd4cd',ruler:'liubiao',spr:'ind',ico:'liubiao',ai:'defensive'},
 liuyan:{name:'Liu Yan',short:'Liu Yan',zh:'焉',main:'#8a9a3a',dark:'#4e5820',light:'#c4d27f',ruler:'liuyan',spr:'ind',ico:'liuyan',ai:'passive'},
 liuzhang:{name:'Liu Zhang',short:'Liu Zhang',zh:'璋',main:'#8a9a3a',dark:'#4e5820',light:'#c4d27f',ruler:'liuzhang',spr:'ind',ico:'liuzhang',ai:'passive'},
 zhanglu:{name:'Zhang Lu',short:'Zhang Lu',zh:'魯',main:'#b8a86a',dark:'#6a5f33',light:'#e2d6a6',ruler:'zhanglu',spr:'ind',ico:'zhanglu',ai:'passive'},
 mateng:{name:'Ma Teng',short:'Ma Teng',zh:'馬',main:'#8fa3b0',dark:'#4c5c66',light:'#cfdde6',ruler:'mateng',spr:'ind',ico:'mateng',ai:'aggressive'},
 hansui:{name:'Han Sui',short:'Han Sui',zh:'遂',main:'#9c8c5a',dark:'#5a5030',light:'#d4c69a',ruler:'hansui',spr:'ind',ico:'hansui',ai:'defensive'},
 gongsun:{name:'Gongsun Zan',short:'Gongsun Zan',zh:'瓚',main:'#a7b2b8',dark:'#5f686d',light:'#e2e8eb',ruler:'gongsunzan',spr:'ind',ico:'gongsun',ai:'aggressive'},
 gongsundu:{name:'Gongsun Du',short:'Gongsun Du',zh:'度',main:'#5e6b7a',dark:'#343c45',light:'#a3b0bf',ruler:'gongsundu',spr:'ind',ico:'gongsundu',ai:'passive'},
 gongsunkang:{name:'Gongsun Kang',short:'Gongsun Kang',zh:'康',main:'#5e6b7a',dark:'#343c45',light:'#a3b0bf',ruler:'gongsunkang',spr:'ind',ico:'gongsunkang',ai:'passive'},
 taoqian:{name:'Tao Qian',short:'Tao Qian',zh:'陶',main:'#c06c84',dark:'#6e3546',light:'#e7a9bb',ruler:'taoqian',spr:'ind',ico:'taoqian',ai:'passive'},
 kongrong:{name:'Kong Rong',short:'Kong Rong',zh:'孔',main:'#8d6e57',dark:'#54402f',light:'#d0b298',ruler:'kongrong',spr:'ind',ico:'kongrong',ai:'passive'},
 hanfu:{name:'Han Fu',short:'Han Fu',zh:'馥',main:'#a3824a',dark:'#5c4826',light:'#dcc08a',ruler:'hanfu',spr:'ind',ico:'hanfu',ai:'passive'},
 liuyao:{name:'Liu Yao',short:'Liu Yao',zh:'繇',main:'#9b2f4f',dark:'#581a2c',light:'#d97d99',ruler:'liuyao',spr:'ind',ico:'liuyao',ai:'defensive'},
 wanglang:{name:'Wang Lang',short:'Wang Lang',zh:'朗',main:'#3d6d8a',dark:'#213e50',light:'#89b5cf',ruler:'wanglang',spr:'ind',ico:'wanglang',ai:'passive'},
 yanbaihu:{name:'Yan Baihu',short:'Yan Baihu',zh:'虎',main:'#b5651d',dark:'#66370d',light:'#e3a56c',ruler:'yanbaihu',spr:'ind',ico:'yanbaihu',ai:'aggressive'},
 lubu:{name:'Lü Bu',short:'Lü Bu',zh:'呂',main:'#8b1e2d',dark:'#4e0f18',light:'#d97683',ruler:'lubu',spr:'ind',ico:'lubu',ai:'aggressive'},
 zhangxiu:{name:'Zhang Xiu',short:'Zhang Xiu',zh:'繡',main:'#c2a36b',dark:'#6e5a35',light:'#e8d3a8',ruler:'zhangxiu',spr:'ind',ico:'zhangxiu',ai:'defensive'},
 lijue:{name:'Li Jue',short:'Li Jue',zh:'傕',main:'#555c66',dark:'#2d3238',light:'#9aa2ad',ruler:'lijue',spr:'ind',ico:'lijue',ai:'aggressive'},
 han:{name:'Han Xuan',short:'Han Xuan',zh:'韓',main:'#a3824a',dark:'#5c4826',light:'#dcc08a',ruler:'hanxuan',spr:'ind',ico:'han',ai:'passive'},
 jin:{name:'Jin Xuan',short:'Jin Xuan',zh:'金',main:'#8d6e57',dark:'#54402f',light:'#d0b298',ruler:'jinxuan',spr:'ind',ico:'jin',ai:'passive'},
 liu:{name:'Liu Du',short:'Liu Du',zh:'度',main:'#93865a',dark:'#575031',light:'#d2c79a',ruler:'liudu',spr:'ind',ico:'liu',ai:'passive'},
 zhao:{name:'Zhao Fan',short:'Zhao Fan',zh:'範',main:'#9a7461',dark:'#5b4235',light:'#d8b4a3',ruler:'zhaofan',spr:'ind',ico:'zhao',ai:'passive'}};
// new rulers / generals not in GEN_DEF yet (portrait null until Grok's portrait is approved: a seal is shown)
// id, name, token, war, int, pol, cha, type, portrait
const GEN_NEW=[
 ['lubu','Lü Bu','呂',100,26,13,40,'cav','lu_bu'],['dongzhuo','Dong Zhuo','董',87,68,30,46,'cav','p_dongzhuo'],['yuanshao','Yuan Shao','袁',70,74,76,90,'cav','p_yuanshao'],
 ['yuanshu','Yuan Shu','術',62,62,64,66,'shield','p_yuanshu'],['sunjian','Sun Jian','堅',93,80,74,92,'cav','p_sunjian'],['sunce','Sun Ce','策',94,76,72,96,'cav','p_sunce'],
 ['mateng','Ma Teng','騰',86,50,58,84,'cav',null],['hansui','Han Sui','遂',80,72,54,72,'cav','p_hansui'],['gongsunzan','Gongsun Zan','瓚',84,70,62,76,'cav','p_gongsunzan'],
 ['gongsundu','Gongsun Du','度',78,62,60,66,'cav','p_gongsundu'],['gongsunkang','Gongsun Kang','康',72,60,62,60,'cav','p_gongsunkang'],['liubiao','Liu Biao','表',40,78,86,84,'shield','p_liubiao'],
 ['liuyan','Liu Yan','焉',32,72,76,70,'shield','p_liuyan'],['liuzhang','Liu Zhang','璋',30,56,64,62,'shield','p_liuzhang'],['zhanglu','Zhang Lu','魯',40,74,82,82,'shield','p_zhanglu'],
 ['taoqian','Tao Qian','陶',30,62,74,80,'shield','p_taoqian'],['kongrong','Kong Rong','孔',30,82,84,88,'archer','p_kongrong'],['hanfu','Han Fu','馥',40,56,60,52,'shield','p_hanfu'],
 ['liuyao','Liu Yao','繇',50,58,64,70,'shield','p_liuyao'],['wanglang','Wang Lang','朗',42,76,82,72,'shield','p_wanglang'],['yanbaihu','Yan Baihu','虎',74,30,22,46,'spear','p_yanbaihu'],
 ['zhangxiu','Zhang Xiu','繡',84,62,48,68,'spear','p_zhangxiu'],['lijue','Li Jue','傕',80,40,20,30,'cav','p_lijue'],
 ['machao','Ma Chao','超',97,44,30,82,'cav','p_machao'],['dianwei','Dian Wei','韋',97,35,20,58,'spear','p_dianwei'],['guojia','Guo Jia','嘉',15,98,82,86,'archer','p_guojia'],
 ['pangde','Pang De','德',94,70,44,68,'cav','p_pangde'],['wenchou','Wen Chou','醜',94,30,28,52,'cav','p_wenchou'],['huaxiong','Hua Xiong','雄',92,48,30,50,'cav','p_huaxiong'],['gaoshun','Gao Shun','順',87,65,50,72,'spear','p_gaoshun'],
 ['tianfeng','Tian Feng','豐',25,92,86,70,'archer','p_tianfeng'],['jushou','Ju Shou','授',40,92,85,78,'archer','p_jushou'],['chengong','Chen Gong','宮',48,90,78,70,'archer','p_chengong']];
// fictional characters made for this game: only in New Hero games, and only the hero's own Search finds them
// Anthony 2 Nov: minor rulers use shared common-general faces and are not playable
const NOPLAY=['gongsunzan','liubiao','liuzhang','zhanglu','taoqian','kongrong','liuyao','hanfu','liuyan','wanglang','yanbaihu','gongsundu','gongsunkang','hansui','lijue','zhangxiu','jinxuan','hanxuan','liudu','zhaofan'];
const FICTIONAL=['xuannu','monu','xishi','huangyi','renrui','miren','mishao'];
// ---------- scenarios: start date, goal, factions with their cities and troops, alliance, intro
const SCENS={
 189:{y:189,m:1,end:214,win:30,zh:'董卓亂政',t:'AD 189 · Dong Zhuo seizes the capital',
  p:'The emperor is a puppet of the tyrant Dong Zhuo. Lords across the realm raise their banners against him, and against each other.',
  f:{dong:['luoyang','changan','hongnong','xuchang','anding','jinyang'],yuanshao:['nanpi','puyang'],hanfu:['ye'],wei:['chenliu','qiao'],yuanshu:['wancheng','runan','shouchun','hefei'],
   wu:['changsha'],liubiao:['xiangyang','jiangling','xinye','jiangxia','wuling','lingling','guiyang'],liuyan:['chengdu','zitong','jiangzhou','yongan'],zhanglu:['hanzhong','shangyong'],
   mateng:['xiliang','tianshui','xiabian'],gongsun:['beiping','daixian'],gongsundu:['xiangping'],taoqian:['xuzhou','xiapi'],kongrong:['beihai'],lb:['pingyuan'],
   liuyao:['jianye','lujiang','chaisang'],wanglang:['kuaiji'],yanbaihu:['wu']},
  big:{dong:48000,yuanshao:22000,yuanshu:16000,liubiao:15000,wei:9000,wu:12000,lb:6000},
  intro:['189. Emperor Ling is dead. The tyrant Dong Zhuo marches into Luoyang, deposes the young emperor and rules the court by terror.','The lords of the east swear an oath against him. Whoever takes the realm will be decided by the sword.']},
 194:{y:194,m:1,end:219,win:30,zh:'群雄割據',t:'AD 194 · The warlords carve up the realm',
  p:'Dong Zhuo is dead. Lü Bu wanders with his cavalry, Cao Cao rises in Yanzhou, and Liu Bei is offered Xu province.',
  f:{wei:['chenliu','qiao','xuchang'],lubu:['puyang'],lb:['xuzhou','xiapi'],yuanshao:['ye','nanpi','pingyuan','jinyang'],gongsun:['beiping','daixian'],gongsundu:['xiangping'],kongrong:['beihai'],
   yuanshu:['shouchun','runan','hefei'],zhangxiu:['wancheng'],wu:['lujiang'],liuyao:['jianye','chaisang'],yanbaihu:['wu'],wanglang:['kuaiji'],
   liubiao:['xiangyang','jiangling','xinye','jiangxia','changsha','wuling','lingling','guiyang'],liuzhang:['chengdu','zitong','jiangzhou','yongan'],zhanglu:['hanzhong','shangyong'],
   mateng:['xiliang','tianshui','xiabian'],hansui:['anding'],lijue:['changan','hongnong','luoyang']},
  big:{yuanshao:38000,wei:18000,lubu:14000,yuanshu:20000,liubiao:18000,lijue:20000,lb:10000,wu:8000},
  rulers:{wu:'sunce'},names:{wu:'Sun Ce'},
  intro:['194. Dong Zhuo has fallen to Lü Bu\'s halberd, and his generals Li Jue and Guo Si hold the emperor at Chang\'an.','Tao Qian of Xu province is dying and offers his land to Liu Bei. Lü Bu seizes Puyang while Cao Cao is away. Every lord is for himself.']},
 208:{y:208,m:9,end:228,win:30,zh:'赤壁之戰',t:'AD 208 · The Battle of Red Cliffs',
  p:'Cao Cao has taken Jing province and sails his fleet down the Yangtze. Liu Bei holds Jiangxia, allied with Sun Quan of Wu.',
  f:{wei:['xuchang','wancheng','runan','hefei','xiangyang','jiangling','luoyang','changan','hongnong','xinye','shouchun','lujiang','chenliu','qiao','puyang','xuzhou','xiapi','beihai','ye','nanpi','pingyuan','jinyang','daixian','beiping'],
   lb:['jiangxia'],wu:['chaisang','jianye','kuaiji','wu'],jin:['wuling'],han:['changsha'],liu:['lingling'],zhao:['guiyang'],
   mateng:['xiliang','tianshui','anding'],zhanglu:['hanzhong','xiabian','shangyong'],liuzhang:['chengdu','zitong','jiangzhou','yongan'],gongsunkang:['xiangping']},
  big:{wei:30000,wu:18000,lb:15000,mateng:12000,liuzhang:12000},
  rulers:{wu:'sunquan'},names:{wu:'Sun Quan'},ally:[['lb','wu',210*12+12]],
  intro:['Cao Cao has taken Jing province. His fleet gathers at Jiangling. Liu Bei holds Jiangxia, allied with Sun Quan of Wu.','The Shu–Wu alliance lasts until the end of 210.']}};
// ---------- where each general is in 189 and 194 ('fac@city', 'free@city' = hidden, waiting to be found). d = year he enters the game.
// Generals not listed for a scenario: if d <= start year they wait, hidden, in their 208 city; otherwise they appear in year d.
const GSC={
 pangde:{x:219,d:189,189:'mateng@xiliang',194:'mateng@xiliang',208:'mateng@xiliang'},wenchou:{x:200,d:189,189:'yuanshao@nanpi',194:'yuanshao@ye'},huaxiong:{x:191,d:189,189:'dong@luoyang'},gaoshun:{x:198,d:189,189:'dong@luoyang',194:'lubu@puyang'},
 tianfeng:{x:200,d:189,189:'hanfu@ye',194:'yuanshao@ye'},jushou:{x:200,d:189,189:'hanfu@ye',194:'yuanshao@ye'},chengong:{x:198,d:190,home:'chenliu',194:'lubu@puyang'},
 machao:{d:192,home:'xiliang',194:'mateng@xiliang',208:'mateng@xiliang'},dianwei:{x:197,d:189,189:'wei@chenliu',194:'wei@chenliu'},guojia:{x:207,d:191,home:'xuchang',194:'wei@xuchang'},
 liubei:{d:184,189:'lb@pingyuan',194:'lb@xuzhou'},guanyu:{d:184,189:'lb@pingyuan',194:'lb@xiapi'},zhangfei:{d:184,189:'lb@pingyuan',194:'lb@xuzhou'},
 zhaoyun:{d:189,189:'gongsun@beiping',194:'gongsun@beiping'},zhugeliang:{d:207,home:'xiangyang'},mizhu:{d:189,189:'taoqian@xuzhou',194:'lb@xuzhou'},
 sunqian:{d:189,189:'lb@pingyuan',194:'lb@xuzhou'},jianyong:{d:184,189:'lb@pingyuan',194:'lb@xiapi'},guanyinping:{d:206},huangyueying:{d:205,home:'xiangyang'},
 ladygan:{d:194,194:'lb@xuzhou'},ladymi:{d:196},diaochan:{d:189,189:'dong@luoyang',194:'lubu@puyang'},huangzhong:{d:189,189:'liubiao@changsha',194:'liubiao@changsha'},
 weiyan:{d:200,home:'changsha'},maliang:{d:207},pangtong:{d:205},jiangwan:{d:208},liufeng:{d:205},guanping:{d:200,home:'runan'},chendao:{d:194,194:'lb@xiapi'},
 zhoucang:{d:200,home:'runan'},liaohua:{d:200,home:'xiangyang'},huojun:{d:205},liuqi:{d:194,194:'liubiao@xiangyang'},yiji:{d:194,194:'liubiao@xiangyang'},
 mifang:{d:189,189:'taoqian@xuzhou',194:'lb@xuzhou'},hanxuan:{d:205},jinxuan:{d:205},gongzhi:{d:205},liudu:{d:205},xingdaorong:{d:205},zhaofan:{d:205},chenying:{d:205},
 yangling:{d:205},liuxian:{d:205},baolong:{d:205},liuba:{d:205},xianglang:{d:205},menghuo:{d:200},zhurong:{d:200},
 caocao:{d:184,189:'wei@chenliu',194:'wei@chenliu'},xuchu:{d:189,189:'free@qiao',194:'wei@xuchang'},caoren:{d:189,189:'wei@qiao',194:'wei@chenliu'},
 xiahoudun:{d:189,189:'wei@chenliu',194:'wei@xuchang'},xiahouyuan:{d:189,189:'wei@chenliu',194:'wei@qiao'},xunyu:{d:189,189:'hanfu@ye',194:'wei@chenliu'},
 manchong:{d:192},zhangliao:{d:189,189:'dong@luoyang',194:'lubu@puyang'},lidian:{d:192},yujin:{d:192},yuejin:{d:189,189:'wei@chenliu',194:'wei@chenliu'},
 sunquan:{d:198,home:'lujiang'},zhangzhao:{d:189,189:'free@xiapi',194:'wu@lujiang'},zhouyu:{d:189,189:'free@lujiang',194:'wu@lujiang'},ganning:{d:189,189:'free@jiangzhou',194:'liubiao@jiangxia'},
 taishici:{d:189,189:'free@beihai',194:'liuyao@jianye'},zhoutai:{d:192,194:'wu@lujiang'},lusu:{d:189,189:'free@xiapi',194:'free@xiapi'},huanggai:{d:184,189:'wu@changsha',194:'wu@lujiang'},
 lumeng:{d:196,home:'runan'},sunshangxiang:{d:205,home:'jianye'},daqiao:{d:198,home:'lujiang'},xiaoqiao:{d:198,home:'lujiang'},caiwenji:{d:207,home:'chenliu'},
 zhenji:{d:200,home:'ye'},caopi:{d:204},caozhang:{d:207},caohong:{d:189,189:'wei@chenliu',194:'wei@xuchang'},caochun:{d:194,194:'wei@chenliu'},simayi:{d:201,home:'luoyang'},
 jiaxu:{d:189,189:'dong@changan',194:'lijue@changan'},chengyu:{d:192},xunyou:{d:196,home:'xuchang'},wenpin:{d:194,194:'liubiao@xiangyang'},litong:{d:196,home:'runan'},
 caimao:{d:189,189:'liubiao@xiangyang',194:'liubiao@jiangling'},zhangyun:{d:189,189:'liubiao@jiangling',194:'liubiao@jiangling'},zangba:{d:189,189:'taoqian@xiapi',194:'free@xuzhou'},
 zhuling:{d:194,194:'yuanshao@ye'},kuaiyue:{d:189,189:'liubiao@xiangyang',194:'liubiao@xiangyang'},wangcan:{d:194,194:'liubiao@xiangyang'},xushu:{d:200,home:'xinye'},
 zhanghe:{d:189,189:'hanfu@ye',194:'yuanshao@ye'},xuhuang:{d:189,189:'dong@hongnong',194:'lijue@hongnong'},lingtong:{d:204},handang:{d:184,189:'wu@changsha',194:'wu@lujiang'},
 chengpu:{d:184,189:'wu@changsha',194:'wu@lujiang'},jiangqin:{d:194,194:'wu@lujiang'},zhuzhi:{d:189,189:'wu@changsha',194:'wu@lujiang'},zhugejin:{d:200},kanze:{d:200},
 xusheng:{d:196},panzhang:{d:196},dongxi:{d:196},zhuran:{d:200},luxun:{d:203},shamoke:{d:210},
 lubu:{x:198,d:184,189:'dong@luoyang',194:'lubu@puyang'},dongzhuo:{x:192,d:184,189:'dong@luoyang'},yuanshao:{x:202,d:184,189:'yuanshao@nanpi',194:'yuanshao@ye'},yuanshu:{x:199,d:184,189:'yuanshu@wancheng',194:'yuanshu@shouchun'},
 sunjian:{x:191,d:184,189:'wu@changsha'},sunce:{x:200,d:192,194:'wu@lujiang',home:'lujiang'},mateng:{d:184,189:'mateng@xiliang',194:'mateng@xiliang',208:'mateng@xiliang'},hansui:{d:184,194:'hansui@anding',208:'mateng@anding'},
 gongsunzan:{x:199,d:184,189:'gongsun@beiping',194:'gongsun@beiping'},gongsundu:{x:204,d:189,189:'gongsundu@xiangping',194:'gongsundu@xiangping'},gongsunkang:{d:204,208:'gongsunkang@xiangping'},
 liubiao:{x:208,d:189,189:'liubiao@xiangyang',194:'liubiao@xiangyang'},liuyan:{x:194,d:184,189:'liuyan@chengdu'},liuzhang:{d:189,194:'liuzhang@chengdu',208:'liuzhang@chengdu'},
 zhanglu:{d:189,189:'zhanglu@hanzhong',194:'zhanglu@hanzhong',208:'zhanglu@hanzhong'},taoqian:{x:194,d:184,189:'taoqian@xuzhou'},kongrong:{x:208,d:184,189:'kongrong@beihai',194:'kongrong@beihai'},
 hanfu:{x:191,d:184,189:'hanfu@ye'},liuyao:{x:197,d:189,189:'liuyao@jianye',194:'liuyao@jianye'},wanglang:{d:189,189:'wanglang@kuaiji',194:'wanglang@kuaiji',208:'wei@xuchang'},yanbaihu:{x:196,d:189,189:'yanbaihu@wu',194:'yanbaihu@wu'},
 zhangxiu:{x:207,d:192,194:'zhangxiu@wancheng'},lijue:{x:198,d:189,189:'dong@changan',194:'lijue@changan'}};

// =====================================================================
// logic (this file is included after camp.js, so its function declarations replace camp.js ones of the same name)
// =====================================================================
for(const d of CITY_DEF){const n=CITY44.find(c=>c[0]===d[0]);if(n){d[3]=n[3];d[4]=n[4]}}
HERO_CITY[3]=64.5;HERO_CITY[4]=90;HERO_ROUTES.length=0;HERO_ROUTES.push(['luling','chaisang',1],['luling','changsha',2]);
const HERO_ROUTES44=[['luling','chaisang',1],['luling','changsha',2],['luling','guiyang',2]];
for(const c of CITY44)if(!CITY_TIER[c[0]]&&CITY_TIER44[c[5]]!=='small')CITY_TIER[c[0]]=CITY_TIER44[c[5]];
const FACS0=JSON.parse(JSON.stringify(FACS)),ROUTES0=ROUTES.map(r=>r.slice());
function setFacs(o){for(const k of Object.keys(FACS))delete FACS[k];Object.assign(FACS,JSON.parse(JSON.stringify(o)))}
function setRoutes(l){ROUTES.length=0;ROUTES.push(...l.map(r=>r.slice()))}
const bigFac=f=>S&&S.scen?citiesOf(f).length>=5:(f==='wei'||f==='wu');
function heroBio(){BIO.hero={zh:'俠',st:'',y:'born c.170',bg:`Heir to a great merchant fortune of the south. When his family died, ${S.hero.name} inherited their gold, their granaries and their name.`,
  h:`While warlords carve up the Han, ${S.hero.name} has spent his fortune on soldiers rather than silk, and swears to unite the realm under his own banner. Legend says he mastered the Eighteen Dragon-Subduing Palms from a wandering beggar.`,
  f:['Inherited a merchant fortune','Master of the Eighteen Dragon-Subduing Palms','Swore to rule all under heaven'],fic:true}}
function applyScen(){setFacs(S.facs);setRoutes(ROUTES44.filter(r=>S.cities[r[0]]&&S.cities[r[1]]));
  if(S.cities.luling){ROUTES.push(...HERO_ROUTES44.filter(r=>S.cities[r[1]]).map(r=>r.slice()));CITY_ART.luling='art/luling.jpg'}else delete CITY_ART.luling;
  if(isHeroMode()){heroBio();if(S.gens.hero&&!S.gens.hero.img)S.gens.hero.img='hero'}
  for(const r of GEN_NEW)if(S.gens[r[0]]&&r[8])S.gens[r[0]].img=r[8]}
// a new game from a scenario. pick = faction key to play, or null with hero = {name, stats} for the New Hero
function newScenario(sid,pick,diff,hero){const sc=SCENS[sid];
  S={year:sc.y,month:sc.m,scen:sid,armies:[],log:[],grudge:{},sel:null,over:false,nextArmy:1,cities:{},gens:{},fac:{},rulers:{},diff:diff||'normal',future:{}};
  S.t0=sc.y*12+sc.m;if(hero){S.mode='hero';S.hero={name:hero.name}}
  const own={};for(const [f,cs] of Object.entries(sc.f))for(const c of cs)own[c]=f;
  const facs={};for(const f of Object.keys(sc.f)){const F={...FAC_ALL[f]};if(sc.names&&sc.names[f])F.name=F.short=sc.names[f];F.ruler=(sc.rulers&&sc.rulers[f])||F.ruler;
    const n=sc.f[f].length;F.gold=600+500*n;F.rice=6000+8000*n;facs[f]=F}
  for(const [id,name,zh,x,y,t] of CITY44){const o=own[id];if(!o)continue;const d=sid==208&&CITY_DEF.find(r=>r[0]===id);let c;
    if(d){const [,,,,,,troops,farm,farmMax,com,comMax,walls,order,pop,train]=d;c={troops,farm,farmMax,com,comMax,walls,order,pop,train}}
    else{const [fm,cm,w,p]=TIER_STATS[t],big=sc.big&&sc.big[o]&&sc.f[o][0]===id;
      c={troops:big?sc.big[o]:{c:12000,l:9000,s:6000,f:4000}[t],farm:Math.round(fm*.6),farmMax:fm,com:Math.round(cm*.55),comMax:cm,walls:w,order:70,pop:p,train:60}}
    S.cities[id]={id,name,zh,x,y,owner:o,...c,gold:0,rice:0}}
  const rows=[...GEN_DEF.map(r=>({id:r[0],name:r[1],ch:r[2],fac:r[3]==='shu'?'lb':r[3],city:r[4],war:r[5],int:r[6],pol:r[7],cha:r[8],type:r[9],img:r[10],loy:r[11],hid:!!r[12],old:1})),
    ...GEN_NEW.map(r=>({id:r[0],name:r[1],ch:r[2],fac:null,city:null,war:r[3],int:r[4],pol:r[5],cha:r[6],type:r[7],img:r[8],loy:90,hid:true}))];
  for(const r of rows){const g=GSC[r.id]||{},d=g.d??0,x=g.x??999;
    if(FICTIONAL.includes(r.id)&&!hero)continue;if(sc.y>=x)continue;
    let fac=null,city=null,hidden=true;const p=g[sid];
    if(p){[fac,city]=p.split('@');if(fac==='free')fac=null;hidden=!fac}
    else if(sid==208&&r.old){fac=r.fac;city=r.city;hidden=r.hid}
    else{city=g.home||(r.old?r.city:null);if(!city)continue;
      if(d>sc.y){S.future[r.id]={id:r.id,name:r.name,ch:r.ch,war:r.war,int:r.int,pol:r.pol,cha:r.cha,type:r.type,img:r.img,loy:r.loy,y:d,city};continue}}
    if(fac&&!facs[fac]){fac=null;hidden=true}
    if(!S.cities[city])continue;
    if(fac&&S.cities[city].owner!==fac)city=sc.f[fac][0];
    S.gens[r.id]={id:r.id,name:r.name,ch:r.ch,fac,city,war:r.war,int:r.int,pol:r.pol,cha:r.cha,type:r.type,img:r.img,loy:fac?Math.max(r.loy,80):r.loy,hidden,acted:false,army:null}}
  for(const f of Object.keys(facs)){let rid=facs[f].ruler,g=S.gens[rid];
    if(g){if(g.fac!==f||!sc.f[f].includes(g.city)){g.fac=f;g.city=sc.f[f][0];g.hidden=false}}
    else{const b=Object.values(S.gens).filter(x=>x.fac===f).sort((a,b)=>b.cha-a.cha)[0];rid=b?b.id:null}
    if(rid){S.rulers[f]=rid;S.gens[rid].loy=100}}
  const P=hero?null:pick,ren=(a,b)=>{facs[b]=facs[a];delete facs[a];for(const c of Object.values(S.cities))if(c.owner===a)c.owner=b;
    for(const g of Object.values(S.gens))if(g.fac===a)g.fac=b;S.rulers[b]=S.rulers[a];delete S.rulers[a]};
  if(P)ren(P,'shu');
  if(hero){if(facs.shu)ren('shu','lb');
    facs.shu={name:hero.name,short:hero.name,zh:'俠',main:'#b98a2e',dark:'#6b4c16',light:'#ecc874',ruler:'hero',spr:'shu',ico:'hero',gold:5000,rice:30000};
    const hc=hero.city&&hero.city!=='luling'&&S.cities[hero.city]?hero.city:'luling';S.heroCity=hc;
    if(hc==='luling')S.cities.luling={id:'luling',name:'Luling',zh:'廬陵',x:HERO_CITY[3],y:HERO_CITY[4],owner:'shu',troops:4000,farm:320,farmMax:700,com:260,comMax:550,walls:40,order:70,pop:110,train:50,gold:0,rice:0};
    else{const c=S.cities[hc],o=c.owner,to=Object.values(S.cities).find(x=>x.owner===o&&x.id!==hc);
      for(const g of Object.values(S.gens))if(g.city===hc&&g.fac){if(g.fac===o&&to)g.city=to.id;else if(g.fac===o){g.fac=null;g.hidden=true}}
      if(to)to.troops+=Math.round(c.troops/2);c.owner='shu';c.troops=4000;c.train=50;c.order=70}
    // the five heroines of this game wait, hidden, in the hero's home town: one turns up every time he searches it
    for(const id of HEROINES)if(S.gens[id]){S.gens[id].city=hc;S.gens[id].hidden=true;S.gens[id].fac=null}
    S.gens.hero={id:'hero',name:hero.name,ch:'俠',fac:'shu',city:hc,...hero.stats,type:'cav',img:'hero',loy:100,hidden:false,acted:false,army:null};S.rulers.shu='hero'}
  facs.shu.ruler=S.rulers.shu;facs.shu.ai=null;S.facs=facs;
  S.ally=(sc.ally||[]).map(([a,b,t])=>[a===P?'shu':a,b===P?'shu':b,t]);
  applyScen();
  for(const f in FACS)spreadStores(f,f==='shu'&&!hero?Math.max(DF().gold,FACS[f].gold):FACS[f].gold,f==='shu'&&!hero?Math.max(DF().rice,FACS[f].rice):FACS[f].rice);
  S.sel=hero?S.heroCity:(citiesOf('shu')[0]||{}).id;
  for(const l of sc.intro)addLog(l);
  if(hero)addLog(`${S.heroCity==='luling'?'Far to the south, in the little town of Luling':'In '+S.cities[S.heroCity].name}, ${hero.name} buries his family and opens their vaults: five thousand gold, thirty thousand measures of rice and four thousand men loyal to his name.`);
  addLog(`Your goal: hold ${sc.win} of the ${Object.keys(S.cities).length} cities by the end of ${sc.end}.`);
  save()}
// generals who come of age join the world, hidden in their home city until someone finds them
function debutTick(){if(!S||!S.future)return;for(const [id,f] of Object.entries(S.future))if(f.y<=S.year&&!S.gens[id]&&S.cities[f.city]){
  const {y,...g}=f;S.gens[id]={...g,fac:null,hidden:true,acted:false,army:null};delete S.future[id]}}
checkCampaignEnd=function(){
  if(S.over)return;const sc=S.scen?SCENS[S.scen]:null,W=sc?sc.win:WIN_CITIES,E=sc?sc.end:END_YEAR;
  const n=citiesOf('shu').length,N=Object.keys(S.cities).length;
  if(n>=W){S.over=true;finale(true,`You hold ${n} of the ${N} cities. The realm answers to ${LN()}.`);return}
  if(!alive('shu')){S.over=true;finale(false,`You have no cities and no army left. ${LN()}'s cause is lost.`);return}
  if(S.year>E){S.over=true;finale(false,`The year ${E} ends with ${LN()} holding ${n} of ${N} cities. You needed ${W}.`)}}
cityIcon=function(c,F){const t=CITY_TIER[c.id]||'small',st=underSiege(c)?'siege':'ok',w=CITY_W[t][st==='ok'?0:1];
  const ico=c.owner==='lb'&&!(F&&F.ico)?'shu':isHeroMode()&&c.owner==='shu'?'hero':(F&&F.ico)||c.owner;
  const fl='';
  return `<span class="cic" style="width:${w}px;--fc:${F?F.main:'#888'}"><span${fl}>${cicImg(`${t}_${st}_${ico}`,w)}</span></span>`}
// ---------------------------------------------------------------- title: 雄霸天下, one main screen, scenario + ruler picker
setTitleMode=function(){const im=document.getElementById('tbg');if(im&&!im.src.endsWith('art/title_hero.jpg'))im.src='art/title_hero.jpg';
  $('#tlogo').textContent='雄霸天下';$('#tlogo').classList.add('hero');document.getElementById('title').classList.add('tm-hero');
  $('#tscenT').textContent='Rise of the Warlords';$('#tscenP').textContent='Three eras of the Three Kingdoms on the whole map of China. Play a great lord of AD 189, 194 or 208, or a hero of your own making.';
  document.querySelectorAll('[data-tm]').forEach(b=>b.hidden=true);$('#heroBtn').hidden=true;$('#newBtn').hidden=false;$('#newBtn').textContent='New game'}
renderTitle=function(){const sv=loadSave(),has=!!(sv&&!sv.over);setTitleMode();$('#loadBtn').hidden=![...SLOTS,PRE].some(k=>{const x=readKey(k);return x&&!x.over});
  $('#contBtn').hidden=!has;$('#contBtn').classList.toggle('primary',has);$('#newBtn').classList.toggle('primary',!has);$('#tbtns').prepend(has?$('#contBtn'):$('#newBtn'));
  if(has)$('#contInfo').textContent=`${sv.year}, ${sv.month}${({1:'st',2:'nd',3:'rd'})[sv.month]||'th'} month`}
function rulerFace(id,size){const g=GEN_DEF.find(r=>r[0]===id),n=GEN_NEW.find(r=>r[0]===id),img=g?g[10]:n?n[8]:null;
  return img?`<img class="gport" style="width:${size}px;height:${Math.round(size*1.15)}px" src="portraits/${img}.webp" alt="">`:null}
async function heroSetup(){let name='';for(;;){const r=await dialog(`<h2>俠 A new hero</h2><p>Heir to a family fortune in the far south, he means to rule all under heaven. What is his name?</p>
    <input id="heroName" class="hname" maxlength="15" autocomplete="off" placeholder="Up to 15 letters" value="${name.replace(/"/g,'')}">`,[['cancel','Cancel'],['ok','Next','primary']]);
    if(r!=='ok')return null;name=(document.getElementById('heroName').value||'').replace(/\s+/g,' ').trim().slice(0,15);if(name)break;toast('Give him a name first.')}
  let st=rollHero();for(;;){const row=(k,n)=>`<div class="hstat"><span>${n}</span><b>${st[k]}</b><i style="width:${st[k]}%"></i></div>`;
    const r=await dialog(`<h2>${name}</h2><p class="muted">Roll his talents. Every stat lands between 75 and 95. Roll as often as you like.</p>
      <div class="hstats">${row('war','War')}${row('int','Int')}${row('pol','Pol')}${row('cha','Cha')}</div><p class="muted">Total ${st.war+st.int+st.pol+st.cha} of 380</p>`,[['cancel','Cancel'],['roll','🎲 Roll again'],['ok','Accept','primary']]);
    if(r==='cancel')return null;if(r==='roll'){st=rollHero();continue}return {name,stats:st}}}
const HEROINES=['xuannu','monu','huangyi','renrui','xishi'];
// where the New Hero starts: his family town of Luling, or a city taken from one of the minor lords (never a lord's last city or seat)
function heroCityOpts(sc){const o=[['luling','Luling','廬陵','Your family town in the far south. Safe, small, out of the way.']];
  for(const [f,cs] of Object.entries(sc.f)){const rid=(sc.rulers&&sc.rulers[f])||FAC_ALL[f].ruler;if(!NOPLAY.includes(rid)||cs.length<2)continue;
    const nm=(sc.names&&sc.names[f])||FAC_ALL[f].name;for(const id of cs.slice(1)){const c=CITY44.find(x=>x[0]===id);if(c)o.push([id,c[1],c[2],`Now held by ${nm}. His men there leave for his other cities.`])}}
  return o}
async function heroCityPick(sc){const o=heroCityOpts(sc);
  const r=await dialog(`<h2>俠 Where does he begin?</h2><p class="muted">Pick an empty city to make his own. He starts there with 4,000 men, and the five heroines are hidden there waiting to be found.</p><div class="tlist slots hcity">${o.map(([id,n,zh,d])=>`<button data-r="c:${id}"><span class="sl"><b><span class="szh">${zh}</span> ${n}</b><small>${d}</small></span></button>`).join('')}</div>`,[['back','Back']]);
  return r&&r.startsWith('c:')?r.slice(2):null}
async function newGameFlow(){const sv=loadSave();if(sv&&!sv.over&&await dialog(`<h2>Start a new game?</h2><p>Your current game (${sv.year}, month ${sv.month}) will be replaced.</p>`,[['no','Keep my game'],['yes','Start over','primary']])!=='yes')return;
  for(;;){const sid=await dialog(`<h2>Choose a year</h2><div class="tlist slots scenl">${Object.entries(SCENS).map(([k,v])=>`<button data-r="${k}"><span class="sl"><b><span class="szh">${v.zh}</span> ${v.t}</b><small>${v.p}</small></span><em>${Object.keys(v.f).length} lords</em></button>`).join('')}</div>`,[['cancel','Cancel']]);
    if(!SCENS[sid])return;const sc=SCENS[sid];
    const fl=Object.keys(sc.f).filter(f=>!NOPLAY.includes((sc.rulers&&sc.rulers[f])||FAC_ALL[f].ruler)).sort((a,b)=>sc.f[b].length-sc.f[a].length);
    const row=f=>{const F=FAC_ALL[f],nm=(sc.names&&sc.names[f])||F.name,rid=(sc.rulers&&sc.rulers[f])||F.ruler,face=rulerFace(rid,40)||`<span class="gseal" style="width:40px;height:46px;background:${F.main};font-size:22px">${F.zh}</span>`;
      return `<button data-r="f:${f}" class="rulb"><span class="rface">${face}</span><span class="sl"><b style="color:${F.light}">${nm}</b><small>${sc.f[f].length} cit${sc.f[f].length>1?'ies':'y'}: ${sc.f[f].map(id=>(CITY44.find(c=>c[0]===id)||[0,id])[1]).join(', ')}</small></span></button>`};
    const r=await dialog(`<h2>${sc.zh} ${sc.y} · choose your ruler</h2><div class="tlist slots rull"><button data-r="hero" class="rulb"><span class="rface"><img class="gport" style="width:40px;height:46px" src="portraits/hero.webp" alt=""></span><span class="sl"><b style="color:#ecc874">俠 New Hero</b><small>Your own hero with a family fortune, starting in Luling or an empty city you choose. The only way to meet the legendary heroines of this game.</small></span></button>${fl.map(row).join('')}</div>`,[['back','Back'],['cancel','Cancel']]);
    if(r==='back')continue;if(r==='cancel'||!r)return;
    let hero=null,pick=null;if(r==='hero'){hero=await heroSetup();if(!hero)continue;const hc=await heroCityPick(sc);if(!hc)continue;hero.city=hc}else pick=r.slice(2);
    const dr=await dialog(`<h2>Choose difficulty</h2><div class="tlist slots">${Object.entries(DIFF).map(([k,v])=>`<button data-r="${k}" class="${k==='normal'?'on':''}"><span class="sl"><b>${v.zh} ${v.n}</b><small>${v.d}</small></span><em>${k==='normal'?'Recommended':''}</em></button>`).join('')}</div>`,[['cancel','Cancel']]);
    if(!DIFF[dr])return;newScenario(+sid,pick,dr,hero);UI={mode:'city',cmd:null,busy:false};showScreen('campaign');renderCampaign();return}}
$('#newBtn').onclick=newGameFlow;

const CICON2={"capital_ok_dong":[0,4,192,146,2],"capital_siege_dong":[0,164,192,147,2],"large_ok_dong":[0,324,192,143,2],"large_siege_dong":[0,484,192,144,2],"small_ok_dong":[0,644,192,148,2],"small_siege_dong":[0,804,192,152,2],"capital_ok_yuanshao":[200,4,192,146,2],"capital_siege_yuanshao":[200,164,192,147,2],"large_ok_yuanshao":[200,324,192,143,2],"large_siege_yuanshao":[200,484,192,144,2],"small_ok_yuanshao":[200,644,192,148,2],"small_siege_yuanshao":[200,804,192,152,2],"capital_ok_yuanshu":[400,4,192,146,2],"capital_siege_yuanshu":[400,164,192,147,2],"large_ok_yuanshu":[400,324,192,143,2],"large_siege_yuanshu":[400,484,192,144,2],"small_ok_yuanshu":[400,644,192,148,2],"small_siege_yuanshu":[400,804,192,152,2],"capital_ok_liubiao":[600,4,192,146,2],"capital_siege_liubiao":[600,164,192,147,2],"large_ok_liubiao":[600,324,192,143,2],"large_siege_liubiao":[600,484,192,144,2],"small_ok_liubiao":[600,644,192,148,2],"small_siege_liubiao":[600,804,192,152,2],"capital_ok_liuyan":[800,4,192,146,2],"capital_siege_liuyan":[800,164,192,147,2],"large_ok_liuyan":[800,324,192,143,2],"large_siege_liuyan":[800,484,192,144,2],"small_ok_liuyan":[800,644,192,148,2],"small_siege_liuyan":[800,804,192,152,2],"capital_ok_liuzhang":[1000,4,192,146,2],"capital_siege_liuzhang":[1000,164,192,147,2],"large_ok_liuzhang":[1000,324,192,143,2],"large_siege_liuzhang":[1000,484,192,144,2],"small_ok_liuzhang":[1000,644,192,148,2],"small_siege_liuzhang":[1000,804,192,152,2],"capital_ok_zhanglu":[1200,4,192,146,2],"capital_siege_zhanglu":[1200,164,192,147,2],"large_ok_zhanglu":[1200,324,192,143,2],"large_siege_zhanglu":[1200,484,192,144,2],"small_ok_zhanglu":[1200,644,192,148,2],"small_siege_zhanglu":[1200,804,192,152,2],"capital_ok_mateng":[1400,4,192,146,2],"capital_siege_mateng":[1400,164,192,147,2],"large_ok_mateng":[1400,324,192,143,2],"large_siege_mateng":[1400,484,192,144,2],"small_ok_mateng":[1400,644,192,148,2],"small_siege_mateng":[1400,804,192,152,2],"capital_ok_hansui":[1600,4,192,146,2],"capital_siege_hansui":[1600,164,192,147,2],"large_ok_hansui":[1600,324,192,143,2],"large_siege_hansui":[1600,484,192,144,2],"small_ok_hansui":[1600,644,192,148,2],"small_siege_hansui":[1600,804,192,152,2],"capital_ok_gongsun":[1800,4,192,146,2],"capital_siege_gongsun":[1800,164,192,147,2],"large_ok_gongsun":[1800,324,192,143,2],"large_siege_gongsun":[1800,484,192,144,2],"small_ok_gongsun":[1800,644,192,148,2],"small_siege_gongsun":[1800,804,192,152,2],"capital_ok_gongsundu":[2000,4,192,146,2],"capital_siege_gongsundu":[2000,164,192,147,2],"large_ok_gongsundu":[2000,324,192,143,2],"large_siege_gongsundu":[2000,484,192,144,2],"small_ok_gongsundu":[2000,644,192,148,2],"small_siege_gongsundu":[2000,804,192,152,2],"capital_ok_gongsunkang":[2200,4,192,146,2],"capital_siege_gongsunkang":[2200,164,192,147,2],"large_ok_gongsunkang":[2200,324,192,143,2],"large_siege_gongsunkang":[2200,484,192,144,2],"small_ok_gongsunkang":[2200,644,192,148,2],"small_siege_gongsunkang":[2200,804,192,152,2],"capital_ok_taoqian":[2400,4,192,146,2],"capital_siege_taoqian":[2400,164,192,147,2],"large_ok_taoqian":[2400,324,192,143,2],"large_siege_taoqian":[2400,484,192,144,2],"small_ok_taoqian":[2400,644,192,148,2],"small_siege_taoqian":[2400,804,192,152,2],"capital_ok_kongrong":[2600,4,192,146,2],"capital_siege_kongrong":[2600,164,192,147,2],"large_ok_kongrong":[2600,324,192,143,2],"large_siege_kongrong":[2600,484,192,144,2],"small_ok_kongrong":[2600,644,192,148,2],"small_siege_kongrong":[2600,804,192,152,2],"capital_ok_hanfu":[2800,4,192,146,2],"capital_siege_hanfu":[2800,164,192,147,2],"large_ok_hanfu":[2800,324,192,143,2],"large_siege_hanfu":[2800,484,192,144,2],"small_ok_hanfu":[2800,644,192,148,2],"small_siege_hanfu":[2800,804,192,152,2],"capital_ok_liuyao":[3000,4,192,146,2],"capital_siege_liuyao":[3000,164,192,147,2],"large_ok_liuyao":[3000,324,192,143,2],"large_siege_liuyao":[3000,484,192,144,2],"small_ok_liuyao":[3000,644,192,148,2],"small_siege_liuyao":[3000,804,192,152,2],"capital_ok_wanglang":[3200,4,192,146,2],"capital_siege_wanglang":[3200,164,192,147,2],"large_ok_wanglang":[3200,324,192,143,2],"large_siege_wanglang":[3200,484,192,144,2],"small_ok_wanglang":[3200,644,192,148,2],"small_siege_wanglang":[3200,804,192,152,2],"capital_ok_yanbaihu":[3400,4,192,146,2],"capital_siege_yanbaihu":[3400,164,192,147,2],"large_ok_yanbaihu":[3400,324,192,143,2],"large_siege_yanbaihu":[3400,484,192,144,2],"small_ok_yanbaihu":[3400,644,192,148,2],"small_siege_yanbaihu":[3400,804,192,152,2],"capital_ok_lubu":[3600,4,192,146,2],"capital_siege_lubu":[3600,164,192,147,2],"large_ok_lubu":[3600,324,192,143,2],"large_siege_lubu":[3600,484,192,144,2],"small_ok_lubu":[3600,644,192,148,2],"small_siege_lubu":[3600,804,192,152,2],"capital_ok_zhangxiu":[3800,4,192,146,2],"capital_siege_zhangxiu":[3800,164,192,147,2],"large_ok_zhangxiu":[3800,324,192,143,2],"large_siege_zhangxiu":[3800,484,192,144,2],"small_ok_zhangxiu":[3800,644,192,148,2],"small_siege_zhangxiu":[3800,804,192,152,2],"capital_ok_lijue":[4000,4,192,146,2],"capital_siege_lijue":[4000,164,192,147,2],"large_ok_lijue":[4000,324,192,143,2],"large_siege_lijue":[4000,484,192,144,2],"small_ok_lijue":[4000,644,192,148,2],"small_siege_lijue":[4000,804,192,152,2]},CICW2=4200;
cicImg=function(key,w){const q=CICON[key]||CICON2[key];if(!q)return `<img src="art/city_${key}.png" alt="">`;const s2=q[4]===2,s=w/q[2];
  return `<i class="cimg" style="width:${w}px;height:${(q[3]*s).toFixed(1)}px;background:url(art/city_icons${s2?'2':''}.png) ${-(q[0]*s).toFixed(2)}px ${-(q[1]*s).toFixed(2)}px/${((s2?CICW2:CICW)*s).toFixed(2)}px auto no-repeat"></i>`};
// short biographies for the new lords (portraits follow from Grok)
Object.assign(BIO,{
 lubu:BIO.lubu||{zh:'呂布',st:'Fengxian',y:'?–198',bg:'A peerless warrior of the northern frontier, armed with the Sky Piercer halberd and riding Red Hare.',h:'He killed two masters, Ding Yuan and Dong Zhuo, and was called the greatest fighter of his age. Brave beyond measure but faithless, he seized Puyang and Xu province before Cao Cao besieged him at Xiapi.',f:['Mightiest warrior of the age','Sky Piercer and Red Hare','Killed Dong Zhuo']},
 pangde:{zh:'龐德',st:'Lingming',y:'?–219',bg:'A fierce general of Liang province who served Ma Teng and Ma Chao.',h:'He later joined Cao Cao and marched to Fan castle carrying his own coffin, vowing to kill Guan Yu or die. Captured when the flood destroyed his army, he refused to surrender and was executed.',f:['Carried his own coffin','Fought Guan Yu at Fan','Refused to surrender']},
 wenchou:{zh:'文醜',st:'',y:'?–200',bg:'One of Yuan Shao\'s two great champions, famed across Hebei.',h:'Together with Yan Liang he was the pride of Yuan Shao\'s army. He fell in the fighting at Yan ford in the Guandu campaign, soon after Yan Liang.',f:['Champion of Hebei','Partner of Yan Liang','Fell at Yan ford']},
 huaxiong:{zh:'華雄',st:'',y:'?–191',bg:'A towering commander of Dong Zhuo\'s Xiliang army.',h:'He held Sishui Gate against the coalition and cut down several of its officers. In the novel Guan Yu slew him before his cup of wine grew cold.',f:['Held Sishui Gate','Terror of the coalition','Slain by Guan Yu in the novel']},
 gaoshun:{zh:'高順',st:'',y:'?–198',bg:'Lü Bu\'s most loyal and disciplined general, commander of the Trap Camp.',h:'His few hundred men of the Trap Camp never lost a fight. Stern and incorruptible, he stayed loyal to Lü Bu to the end and died with him at Xiapi.',f:['Commander of the Trap Camp','Never took a bribe','Died loyal at Xiapi']},
 tianfeng:{zh:'田豐',st:'Yuanhao',y:'?–200',bg:'An upright and brilliant advisor of Yuan Shao.',h:'He urged Yuan Shao to strike Cao Cao while he was busy in the south, and later warned against attacking at Guandu. Jailed for his honesty, he was put to death after the defeat.',f:['Honest to a fault','Warned against Guandu','Executed by Yuan Shao']},
 jushou:{zh:'沮授',st:'',y:'?–200',bg:'Chief strategist of Yuan Shao, a master of long-range plans.',h:'He planned Yuan Shao\'s conquest of the north and urged patience before Guandu. Captured by Cao Cao, he refused to serve him and was killed trying to escape back to Yuan Shao.',f:['Planned the conquest of Hebei','Urged patience at Guandu','Loyal to the end']},
 chengong:{zh:'陳宮',st:'Gongtai',y:'?–198',bg:'A sharp and proud strategist who first served Cao Cao.',h:'He turned against Cao Cao and brought Lü Bu into Yan province. He served Lü Bu as his chief advisor, and was executed with him after the fall of Xiapi.',f:['Brought Lü Bu to Yan','Chief advisor of Lü Bu','Died at Xiapi']},
 machao:{zh:'馬超',st:'Mengqi',y:'176–222',bg:'Eldest son of Ma Teng of Xiliang, famed as Splendid Ma Chao for his looks and his spear.',h:'He rose against Cao Cao to avenge his family at Tong Pass and nearly captured him. Later he joined Liu Bei and became one of the Five Tiger Generals.',f:['Splendid Ma Chao','Battle of Tong Pass','One of the Five Tigers']},
 dianwei:{zh:'典韋',st:'',y:'?–197',bg:'A giant of enormous strength who fought with a pair of great halberds.',h:'Cao Cao\'s personal bodyguard, called the Evil-Coming. When Zhang Xiu revolted at Wancheng he held the camp gate alone so his lord could escape, and died there.',f:['Twin great halberds','Cao Cao\'s bodyguard','Died holding the gate at Wancheng']},
 guojia:{zh:'郭嘉',st:'Fengxiao',y:'170–207',bg:'A brilliant young strategist from Yingchuan, recommended to Cao Cao by Xun Yu.',h:'His plans won Cao Cao the wars against Lü Bu and Yuan Shao, and he foresaw the deaths and quarrels of his enemies. He died young on the northern campaign, and Cao Cao said he would not have lost at Red Cliffs had Guo Jia lived.',f:['Cao Cao\'s favourite strategist','Ten victories and ten defeats','Died young in 207']},
 dongzhuo:{zh:'董卓',st:'Zhongying',y:'?–192',bg:'A frontier general of Liang province who marched on Luoyang when the court collapsed in 189.',h:'He deposed the young emperor, burned Luoyang and dragged the court to Chang\'an, ruling by terror until Wang Yun and Lü Bu murdered him.',f:['Seized the Han court','Burned Luoyang','Slain by Lü Bu']},
 yuanshao:{zh:'袁紹',st:'Benchu',y:'?–202',bg:'Heir of the Yuan clan, four generations of the highest ministers.',h:'Leader of the coalition against Dong Zhuo, he became master of the four northern provinces, the strongest lord of his day, until Cao Cao crushed him at Guandu in 200.',f:['Leader of the coalition','Lord of Hebei','Defeated at Guandu']},
 yuanshu:{zh:'袁術',st:'Gonglu',y:'?–199',bg:'Yuan Shao\'s proud younger cousin, lord of Nanyang and later of Shouchun.',h:'Holding the imperial seal, he declared himself emperor in 197. Lavish and cruel, he lost his allies, and died of hunger and despair two years later.',f:['Held the imperial seal','Called himself emperor','Brother-rival of Yuan Shao']},
 sunjian:{zh:'孫堅',st:'Wentai',y:'155–191',bg:'Governor of Changsha, the Tiger of Jiangdong, known for his red head-wrap.',h:'The bravest of the coalition generals, he drove Dong Zhuo\'s army from Luoyang and found the imperial seal in a well. He was killed in an ambush while fighting Liu Biao.',f:['Tiger of Jiangdong','Recovered the imperial seal','Founder of the Sun family']},
 sunce:{zh:'孫策',st:'Bofu',y:'175–200',bg:'Eldest son of Sun Jian, called the Little Conqueror.',h:'With a thousand men borrowed from Yuan Shu he conquered all of Jiangdong in a few years, with his sworn brother Zhou Yu at his side. He died young, wounded by assassins, and left Wu to Sun Quan.',f:['Little Conqueror','Conquered Jiangdong','Sworn brother of Zhou Yu']},
 mateng:{zh:'馬騰',st:'Shoucheng',y:'?–212',bg:'Lord of Xiliang, of mixed Han and Qiang blood, father of Ma Chao.',h:'For twenty years he held the western frontier with his cavalry, sometimes ally and sometimes rival of Han Sui, until Cao Cao summoned him to the capital and executed him.',f:['Lord of Xiliang','Father of Ma Chao','Western cavalry']},
 hansui:{zh:'韓遂',st:'Wenyue',y:'?–215',bg:'A cunning warlord of Liang province, sworn brother and rival of Ma Teng.',h:'He rebelled against the Han for thirty years. Cao Cao split him from Ma Chao at Tong Pass with a single smudged letter.',f:['Warlord of Liang','Rival of Ma Teng']},
 gongsunzan:{zh:'公孫瓚',st:'Bogui',y:'?–199',bg:'Lord of Youzhou, famous for his White Horse Volunteers.',h:'He fought the northern tribes and then Yuan Shao for control of Hebei. Besieged in his tower fortress at Yijing, he burned himself with his family.',f:['White Horse Volunteers','Lord of Youzhou','Rival of Yuan Shao']},
 gongsundu:{zh:'公孫度',st:'Shengji',y:'?–204',bg:'Governor of Liaodong, far beyond the reach of the court.',h:'He made Xiangping a small kingdom of his own, raiding Korea and the Shandong coast while the warlords fought in the south.',f:['King of Liaodong']},
 gongsunkang:{zh:'公孫康',st:'',y:'?–221',bg:'Son of Gongsun Du, lord of Liaodong.',h:'He sent the heads of the fleeing Yuan brothers to Cao Cao and so kept his northern realm in peace.',f:['Lord of Liaodong']},
 liubiao:{zh:'劉表',st:'Jingsheng',y:'142–208',bg:'A scholar of the imperial clan, governor of Jing province.',h:'He made Jing province a peaceful refuge for scholars for nearly twenty years, but never marched out to take the realm. He died as Cao Cao invaded in 208.',f:['Governor of Jing province','Patron of scholars']},
 liuyan:{zh:'劉焉',st:'Junlang',y:'?–194',bg:'A member of the imperial clan who asked to govern Yi province.',h:'Cut off behind the mountains of Shu, he ruled almost as an emperor and passed his land to his son Liu Zhang.',f:['Governor of Yi province']},
 liuzhang:{zh:'劉璋',st:'Jiyu',y:'?–219',bg:'Son of Liu Yan, the gentle lord of Yi province.',h:'Weak and kind, he invited Liu Bei to defend him against Zhang Lu, and lost Shu to him in 214.',f:['Lord of Yi province','Gave Shu to Liu Bei']},
 zhanglu:{zh:'張魯',st:'Gongqi',y:'?–216',bg:'Master of the Five Pecks of Rice sect, ruler of Hanzhong.',h:'He governed Hanzhong as a theocracy for nearly thirty years and surrendered to Cao Cao in 215.',f:['Five Pecks of Rice sect','Lord of Hanzhong']},
 taoqian:{zh:'陶謙',st:'Gongzu',y:'132–194',bg:'Governor of Xu province.',h:'When his men killed Cao Cao\'s father, Cao Cao ravaged Xu province in revenge. Dying, Tao Qian offered his province to Liu Bei.',f:['Governor of Xu province','Offered Xu to Liu Bei']},
 kongrong:{zh:'孔融',st:'Wenju',y:'153–208',bg:'A descendant of Confucius and chancellor of Beihai.',h:'Famous for his wit since childhood, when he gave the larger pears to his brothers. His sharp tongue later cost him his life at Cao Cao\'s court.',f:['Descendant of Confucius','Chancellor of Beihai']},
 hanfu:{zh:'韓馥',st:'Wenjie',y:'?–191',bg:'Governor of Ji province at Ye.',h:'Timid and indecisive, he handed his province to Yuan Shao in 191 and later took his own life in fear.',f:['Governor of Ji province']},
 liuyao:{zh:'劉繇',st:'Zhengli',y:'156–197',bg:'Imperial governor of Yang province.',h:'He held the lower Yangtze with Taishi Ci among his officers until Sun Ce drove him out.',f:['Governor of Yang province']},
 wanglang:{zh:'王朗',st:'Jingxing',y:'?–228',bg:'Grand administrator of Kuaiji and a classical scholar.',h:'Defeated by Sun Ce, he later served Cao Cao and rose to the highest offices of Wei.',f:['Administrator of Kuaiji','Scholar of the classics']},
 yanbaihu:{zh:'嚴白虎',st:'',y:'?–196',bg:'A bandit chief who called himself the Virtuous King of the East.',h:'He ruled Wu commandery with his rough followers until Sun Ce swept him away.',f:['Bandit king of Wu']},
 zhangxiu:{zh:'張繡',st:'',y:'?–207',bg:'Nephew of Zhang Ji, lord of Wancheng.',h:'In 197 his surprise attack nearly killed Cao Cao and cost the lives of Dian Wei and Cao Ang; he later surrendered to Cao Cao.',f:['Lord of Wancheng','Ambushed Cao Cao']},
 lijue:{zh:'李傕',st:'Zhiran',y:'?–198',bg:'One of Dong Zhuo\'s generals.',h:'After Dong Zhuo\'s death he and Guo Si seized Chang\'an and held the emperor hostage, until their own quarrels let him escape.',f:['Held the emperor at Chang\'an']}});

// Anthony 1 Nov: one general, one special. Guan Yu keeps Dragon Sweep only.
delete HERO.flood;

// Anthony 2 Nov: Gao Shun (W87) and Chen Gong (I90) are not above 90 -> no special
delete HERO.trapcamp;delete HERO.counterplot;
