import subprocess,numpy as np,glob,json,os,sys
S='/tmp/claude-0/-home-claude/3caa1e0b-7a90-56f6-b65a-93a3eae7fddc/scratchpad'
ATT='/mnt/user-data/attachments/3caa1e0b-7a90-56f6-b65a-93a3eae7fddc'
def frames(path,w,h,vf=''):
  cmd=['ffmpeg','-v','error','-i',path,'-vf',(vf+',' if vf else '')+f'scale={w}:{h},format=gray','-f','rawvideo','-']
  b=subprocess.run(cmd,capture_output=True).stdout
  return np.frombuffer(b,np.uint8).reshape(-1,h,w).astype(np.float32)
def info(p):
  o=subprocess.run(['ffprobe','-v','error','-select_streams','v','-show_entries','stream=width,height','-of','csv=p=0',p],capture_output=True,text=True).stdout.strip().split('\n')[0].split(',')
  return int(o[0]),int(o[1])
srcs={}
for p in sorted(glob.glob(ATT+'/*.mp4')):
  w,h=info(p)
  if h<=w:continue  # portrait sources only
  srcs[p]=frames(p,40,60)
vids=sys.argv[1:]
res={}
for v in vids:
  vf=frames(f'{S}/portraits/vid_{v}.mp4',40,60,'crop=240:360:200:0')
  best=None
  for p,F in srcs.items():
    d=((vf[:,None]-F[None])**2).mean((2,3))  # nv x ns
    sc=np.median(d.min(1))
    if best is None or sc<best[0]:best=(sc,p,d.argmin(1).tolist(),d.min(1).tolist())
  res[v]={'src':best[1],'score':float(best[0]),'map':best[2],'err':best[3]}
  print(v,os.path.basename(best[1]),round(best[0],1),len(best[2]),best[2][:6],best[2][-6:])
json.dump(res,open(f'{S}/vre/map.json','w'))
