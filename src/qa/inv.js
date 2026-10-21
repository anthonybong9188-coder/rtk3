// injected: returns array of invariant violations for current S
window.__inv=function(tag){const v=[];const add=m=>v.push(`[${tag}] ${S.year}/${S.month} ${m}`);
  const num=(x,n)=>{if(typeof x!=='number'||!isFinite(x))add(`${n} not a finite number: ${x}`)};
  
  for(const c of Object.values(S.cities)){for(const k of ['troops','farm','com','walls','order','pop','train','gold','rice'])num(c[k],c.id+'.'+k);if(c.gold<0||c.rice<0)add(c.id+' stores<0');if(c.purse)add(c.id+' old purse');
    if(c.troops<0)add(c.id+' troops<0');if(c.order<0||c.order>100)add(c.id+' order '+c.order);if(c.walls<0||c.walls>100)add(c.id+' walls '+c.walls);if(c.train<0||c.train>100)add(c.id+' train '+c.train);
    if(c.farm>c.farmMax)add(c.id+' farm>max');if(c.com>c.comMax)add(c.id+' com>max');if(!FACS[c.owner])add(c.id+' bad owner '+c.owner);
    if(c.gov&&c.owner!=='shu')add(c.id+' gov on non-shu');}
  const armyIds=new Set(S.armies.map(a=>a.id));
  for(const a of S.armies){num(a.troops,'army'+a.id+'.troops');num(a.rice,'army'+a.id+'.rice');num(a.gold||0,'army'+a.id+'.gold');if(a.troops<0)add('army troops<0');if(!S.cities[a.from]||!S.cities[a.to])add('army bad city');if(!routeOf(a.from,a.to))add(`army ${a.id} no route ${a.from}->${a.to}`);
    if(a.left<0)add('army left<0');for(const id of a.gens){const g=GN(id);if(!g)add(`army ${a.id} missing gen ${id}`);else if(g.army!==a.id&&g.fac===a.fac)add(`gen ${id} in army list but g.army=${g.army}`)}}
  for(const g of Object.values(S.gens)){for(const k of ['war','int','pol','cha','loy'])num(g[k],g.id+'.'+k);if(g.loy<0||g.loy>100)add(g.id+' loy '+g.loy);
    if(g.fac&&!FACS[g.fac])add(g.id+' bad fac');
    if(g.army!=null&&!armyIds.has(g.army)&&document.querySelector('#battleView').hidden&&document.querySelector('#dlg').hidden)add(`${g.id} army ${g.army} missing`);
    if(g.army!=null&&g.city)add(`${g.id} has city and army`);
    if(g.fac&&!g.army&&!g.hidden&&!S.cities[g.city])add(`${g.id} fac ${g.fac} no city ${g.city}`);
    if(g.fac&&g.army!=null){const a=S.armies.find(x=>x.id===g.army);if(a&&!a.gens.includes(g.id))add(`${g.id} thinks in army ${a.id} but not listed`);if(a&&a.fac!==g.fac)add(`${g.id} fac ${g.fac} in army of ${a.fac}`)}
    if(g.assign&&(g.fac!=='shu'))add(g.id+' assign on non-shu')}
  for(const f in FACS){if(!S['gone_'+f]&&alive(f)){const r=S.rulers[f];if(r&&GN(r)&&GN(r).fac&&GN(r).fac!==f)add(`ruler of ${f} (${r}) serves ${GN(r).fac}`)}}
  try{const j=JSON.parse(JSON.stringify(S));if(Object.keys(j.cities).length!==Object.keys(S.cities).length)add('save roundtrip lost cities')}catch(e){add('save not serializable '+e)}
  return v};
