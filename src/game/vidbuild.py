import subprocess,numpy as np,json,sys
from PIL import Image,ImageFilter
S='/tmp/claude-0/-home-claude/3caa1e0b-7a90-56f6-b65a-93a3eae7fddc/scratchpad'
R=json.load(open(f'{S}/vre/map.json'))
def frames(path,w,h,vf='',fmt='rgb24',ch=3):
  cmd=['ffmpeg','-v','error','-i',path,'-vf',(vf+',' if vf else '')+f'scale={w}:{h}:flags=lanczos,format={fmt}','-f','rawvideo','-']
  b=subprocess.run(cmd,capture_output=True).stdout
  return np.frombuffer(b,np.uint8).reshape(-1,h,w,ch) if ch>1 else np.frombuffer(b,np.uint8).reshape(-1,h,w)
OW,OH=1280,720
for v in sys.argv[1:]:
  d=R[v];m=np.array(d['map'],float);err=np.array(d['err'])
  src=frames(d['src'],480,720)
  ns=len(src)
  good=err<150
  last=np.nonzero(good)[0].max()
  k=max(5,min(20,last))
  slope=max(0.4,(m[last]-m[last-k])/k)
  for i in range(last+1,len(m)):m[i]=min(ns-1,m[last]+slope*(i-last))
  # fade alpha from the old video's centre brightness vs the source
  old=frames(f'{S}/portraits/vid_{v}.mp4',40,60,'crop=240:360:200:0','gray',1).astype(float)
  smalls=frames(d['src'],40,60,'','gray',1).astype(float)
  alpha=np.zeros(len(m))
  for i in range(len(m)):
    if i>last:
      s=smalls[int(round(m[i]))];a=(old[i].mean()-s.mean())/max(1,255-s.mean());alpha[i]=float(np.clip(a,0,1))
  print(v,'frames',len(m),'fade from',last+1,'alpha',np.round(alpha[last+1:],2).tolist())
  enc=[]
  for ext,args in [('mp4',['-c:v','libx264','-preset','slow','-crf','22','-pix_fmt','yuv420p','-movflags','+faststart']),('webm',['-c:v','libvpx-vp9','-b:v','0','-crf','40','-row-mt','1'])]:
    enc.append(subprocess.Popen(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s',f'{OW}x{OH}','-r','24','-i','-',*args,f'{S}/vre/vid_{v}.{ext}'],stdin=subprocess.PIPE))
  for i in range(len(m)):
    f=Image.fromarray(src[int(round(m[i]))])
    bg=f.resize((160,240)).crop((0,(240-90)//2,160,(240-90)//2+90)).filter(ImageFilter.GaussianBlur(5)).resize((OW,OH),Image.BICUBIC)
    out=bg.copy();out.paste(f,((OW-480)//2,0))
    a=np.asarray(out).astype(float)
    if alpha[i]>0:a=a*(1-alpha[i])+255*alpha[i]
    b=a.clip(0,255).astype(np.uint8).tobytes()
    for e in enc:e.stdin.write(b)
  for e in enc:e.stdin.close();e.wait()
