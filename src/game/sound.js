// ---------- sound: synthesized effects + optional music files (music/<name>.mp3) ----------
var SND=(()=>{
  let ctx=null,master,sfxG,musG,noiseBuf;const KEY='rtk3-audio';
  let set={sfx:.8,mus:.55,mute:false};try{Object.assign(set,JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){}
  const saveSet=()=>{try{localStorage.setItem(KEY,JSON.stringify(set))}catch(e){}};
  function init(){if(ctx)return ctx;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;
    ctx=new AC({latencyHint:'interactive'});master=ctx.createGain();sfxG=ctx.createGain();musG=ctx.createGain();sfxG.connect(master);musG.connect(master);master.connect(ctx.destination);
    noiseBuf=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate);const d=noiseBuf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;apply();return ctx}
  function apply(){if(!ctx)return;master.gain.value=set.mute?0:1;sfxG.gain.value=set.sfx;musG.gain.value=set.mus;if(cur)cur.el.volume=set.mute?0:set.mus}
  const unlock=()=>{init();if(ctx&&ctx.state==='suspended')ctx.resume();if(want&&!cur)music(want)};
  ['pointerdown','keydown'].forEach(ev=>addEventListener(ev,unlock,{capture:true,passive:true}));
  // building blocks
  const T=()=>ctx.currentTime;
  function env(g,t,a,peak,dec){g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(0.0001,t+a+dec)}
  function tone(type,f,t,a,peak,dec,f2,out){const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+a+dec);env(g,t,a,peak,dec);o.connect(g);g.connect(out||sfxG);o.start(t);o.stop(t+a+dec+.05);return o}
  function noise(t,dur,peak,ftype,f,q,f2,out){const s=ctx.createBufferSource(),fl=ctx.createBiquadFilter(),g=ctx.createGain();s.buffer=noiseBuf;s.loop=true;fl.type=ftype;fl.frequency.setValueAtTime(f,t);if(f2)fl.frequency.exponentialRampToValueAtTime(f2,t+dur);fl.Q.value=q||1;
    env(g,t,Math.min(.01,dur/4),peak,dur);s.connect(fl);fl.connect(g);g.connect(out||sfxG);s.start(t,Math.random());s.stop(t+dur+.1)}
  const R=(a,b)=>a+Math.random()*(b-a);
  // effects
  const FX={
    tap:t=>tone('sine',R(850,950),t,.004,.08,.05),
    confirm:t=>{tone('triangle',660,t,.005,.12,.08);tone('triangle',990,t+.07,.005,.12,.12)},
    cancel:t=>{tone('triangle',520,t,.005,.1,.07);tone('triangle',350,t+.06,.005,.1,.1)},
    chime:t=>{[784,988,1175].forEach((f,i)=>tone('sine',f,t+i*.07,.005,.14,.5))},
    dud:t=>{tone('triangle',300,t,.005,.12,.18,220)},
    gong:t=>{[1,2.76,5.4,8.93,1.5].forEach((m,i)=>tone('sine',98*m,t,.01,[.5,.22,.12,.06,.18][i],[3.2,2.2,1.4,.8,2.6][i],98*m*.985));noise(t,.25,.25,'lowpass',900,1)},
    drum:t=>{tone('sine',95,t,.004,.9,.45,42);noise(t,.08,.4,'lowpass',600,1)},
    march:t=>{[0,.32,.56,.9,1.22,1.46].forEach((d,i)=>{tone('sine',i%3===2?70:95,t+d,.004,i%3===2?.95:.7,.4,40);noise(t+d,.07,.3,'lowpass',500,1)})},
    hit:t=>{noise(t,.12,.5,'lowpass',R(500,800),1);tone('sine',120,t,.003,.4,.12,60)},
    clash:t=>{[2480,3710,5130,6390,7800].forEach(f=>tone('square',f*R(.97,1.03),t,.001,.05,R(.15,.32)));noise(t,.1,.45,'bandpass',R(3500,5000),2);noise(t,.05,.3,'highpass',6000,1)},
    melee:t=>{for(let i=0;i<5;i++){const d=i*R(.18,.3);if(Math.random()<.6)FX.clash(t+d);else FX.hit(t+d)}noise(t,1.2,.06,'bandpass',900,.8)},
    arrows:t=>{for(let i=0;i<9;i++){const d=R(0,.35);noise(t+d,.28,.18,'bandpass',R(2500,4000),3,R(700,1200))}for(let i=0;i<5;i++)noise(t+.55+R(0,.3),.06,.25,'lowpass',700,1)},
    gallop:t=>{for(let b=0;b<6;b++)for(const k of [0,.09,.18]){const d=b*.36+k;noise(t+d,.06,.35*(.5+b/10),'lowpass',380,1);tone('sine',70,t+d,.003,.25,.08,45)}},
    fire:t=>{noise(t,1.8,.35,'lowpass',300,.7,1400);noise(t+.2,1.5,.15,'bandpass',2500,1.5);for(let i=0;i<22;i++)noise(t+R(0,1.7),.015,.25,'highpass',3000,1)},
    crit:t=>{tone('sine',60,t,.005,1,.9,30);noise(t,.4,.5,'lowpass',1200,1,200);FX.clash(t+.03);[1320,1760,2640].forEach((f,i)=>tone('sine',f,t+.05+i*.04,.01,.08,.6))},
    special:t=>{noise(t,.7,.25,'bandpass',400,1.5,3000);tone('sawtooth',110,t,.05,.15,.9,220);FX.gong(t+.45)},
    capture:t=>{[392,330,262].forEach((f,i)=>tone('triangle',f,t+i*.16,.01,.18,.3));for(let i=0;i<3;i++)tone('square',R(3000,4200),t+.5+i*.07,.001,.03,.12)},
    shout:t=>{const g=ctx.createGain();g.connect(sfxG);for(let v=0;v<6;v++){const o=ctx.createOscillator(),f=ctx.createBiquadFilter(),gg=ctx.createGain();o.type='sawtooth';o.frequency.setValueAtTime(R(110,190),t);o.frequency.linearRampToValueAtTime(R(160,260),t+.35);
      f.type='bandpass';f.frequency.value=R(700,1100);f.Q.value=4;env(gg,t+R(0,.08),.08,.05,.7);o.connect(f);f.connect(gg);gg.connect(g);o.start(t);o.stop(t+1)}noise(t,.8,.08,'bandpass',900,1)},
    victory:t=>{const n=[523,587,659,784,880,1047];[[0,0],[.18,2],[.36,3],[.6,5]].forEach(([d,i])=>{tone('sawtooth',n[i],t+d,.02,.12,.45);tone('triangle',n[i]/2,t+d,.02,.1,.45)});FX.gong(t+.6);FX.shout(t+.3)},
    defeat:t=>{[440,392,330,294].forEach((f,i)=>{const o=tone('sawtooth',f,t+i*.38,.06,.08,.6,f*.99)});noise(t,2,.04,'lowpass',500,1)},
  };
  function fx(name,delay){if(set.mute||!init()||ctx.state!=='running'||!FX[name])return;try{FX[name](T()+(delay||0))}catch(e){}}
  // music: plays music/<name>.mp3 if it exists, cross-fading; silent otherwise
  // add a track name here once music/<name>.mp3 exists (title, map, battle, duel, victory, defeat)
  const TRACKS=new Set([]);
  let cur=null,want=null;const missing=new Set();
  function music(name){want=name;if(!ctx||ctx.state!=='running'||set.mute&&!cur)return;if(cur&&cur.name===name)return;
    const old=cur;cur=null;if(old)fade(old.el,0,700,()=>old.el.pause());
    if(!name||missing.has(name)||!TRACKS.has(name))return;const el=new Audio(`music/${name}.mp3`);el.loop=!/victory|defeat/.test(name);el.volume=0;
    el.onerror=()=>{missing.add(name);if(cur&&cur.el===el)cur=null};cur={name,el};el.play().then(()=>fade(el,set.mute?0:set.mus,900)).catch(()=>{})}
  function fade(el,to,ms,done){const from=el.volume,t0=performance.now();const st=()=>{const k=Math.min(1,(performance.now()-t0)/ms);el.volume=Math.max(0,Math.min(1,from+(to-from)*k));if(k<1)requestAnimationFrame(st);else done&&done()};st()}
  document.addEventListener('visibilitychange',()=>{if(!cur)return;if(document.hidden)cur.el.pause();else cur.el.play().catch(()=>{})});
  return {fx,music,init,get set(){return set},setVol(k,v){set[k]=v;saveSet();apply()},toggleMute(){set.mute=!set.mute;saveSet();init();apply();if(!set.mute&&want&&!cur)music(want);return set.mute}};
})();
function soundDlg(){const s=SND.set;const p=dialog(`<h2>Sound</h2>
  <div class="mrow"><label for="vSfx">Effects <b id="vSfxV">${Math.round(s.sfx*100)}%</b></label><input id="vSfx" type="range" min="0" max="100" value="${Math.round(s.sfx*100)}"></div>
  <div class="mrow"><label for="vMus">Music <b id="vMusV">${Math.round(s.mus*100)}%</b></label><input id="vMus" type="range" min="0" max="100" value="${Math.round(s.mus*100)}"></div>
  <p class="muted">Music plays once the track files are added. Effects are built into the game.</p>`,[['mute',s.mute?'🔊 Unmute':'🔇 Mute all'],['ok','Done','primary']]);
  setTimeout(()=>{const a=document.getElementById('vSfx'),b=document.getElementById('vMus');if(a)a.oninput=e=>{SND.setVol('sfx',e.target.value/100);document.getElementById('vSfxV').textContent=e.target.value+'%'};if(a)a.onchange=()=>SND.fx('clash');
    if(b)b.oninput=e=>{SND.setVol('mus',e.target.value/100);document.getElementById('vMusV').textContent=e.target.value+'%'}},0);
  return p.then(r=>{if(r==='mute'){SND.toggleMute();updSndBtns()}})}
function updSndBtns(){document.querySelectorAll('.sndbtn').forEach(b=>{b.textContent=SND.set.mute?'🔇':'🔊';b.setAttribute('aria-label',SND.set.mute?'Unmute sound':'Mute sound')})}
// UI clicks
document.addEventListener('pointerdown',e=>{if(e.button>0)return;const b=e.target.closest('button');if(!b||b.disabled||b.classList.contains('sndbtn'))return;
  const r=b.dataset.r;if(r==='cancel'||r==='no'||r==='stay'||b.dataset.pkx!=null)SND.fx('cancel');else if(b.classList.contains('primary'))SND.fx('confirm');else SND.fx('tap')},true);
