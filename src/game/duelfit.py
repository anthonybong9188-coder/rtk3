import sys,subprocess,json,numpy as np
from PIL import Image
S='/tmp/claude-0/-home-claude/3caa1e0b-7a90-56f6-b65a-93a3eae7fddc/scratchpad'
w=sys.argv[1];src=f'{S}/sprites/shu_duel_{w}_src.png';out=f'{S}/sprites/duel_{w}'
def run(*k):return json.loads(subprocess.run(['python3',f'{S}/game/cutsheet.py',src,out,*map(str,k)],capture_output=True,text=True,check=True).stdout.strip().splitlines()[-1])
def lw(f,r,c):
  a=np.asarray(Image.open(f).convert('RGBA'))[r*176:(r+1)*176,c*256:(c+1)*256,3]>60
  sub=a[150:166];xs=np.nonzero(sub.any(0))[0];return xs.max()-xs.min()
k0=run()['k'];g=np.mean([lw(f'{S}/sprites/general_shu.png',0,c) for c in range(4)])
d=np.mean([lw(f'{out}_shu.png',0,c) for c in range(4)]);k=k0*g/d;r=run(4,4,k)
print(w,round(k0,3),'->',round(k,3),'frames',r['frames'],'now',np.mean([lw(f'{out}_shu.png',0,c) for c in range(4)]),'target',g)
