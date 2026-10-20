# usage: addclip.py <sheet.png> <portrait_name>  -> portraits/clip_<name>.webp (4x4 frames of 256x384, transparent bg)
import sys,numpy as np
from PIL import Image
from scipy import ndimage
src,name=sys.argv[1],sys.argv[2]
im=Image.open(src).convert('RGB');W,H=im.size;out=Image.new('RGBA',(1024,1536),(0,0,0,0))
for r in range(4):
  for c in range(4):
    f=im.crop((round(c*W/4)+2,round(r*H/4)+2,round((c+1)*W/4)-2,round((r+1)*H/4)-2)).resize((256,384),Image.LANCZOS)
    a=np.asarray(f).astype(int);mx,mn=a.max(2),a.min(2);neu=(mx-mn<14)&(mn>=244)
    lab,n=ndimage.label(neu);b=set(np.unique(np.concatenate([lab[0],lab[:,0],lab[:,-1]])))-{0};bg=np.isin(lab,list(b))
    n2=(mx-mn<10)&(mn>=250);l2,k2=ndimage.label(n2);sz=ndimage.sum(np.ones_like(l2),l2,index=np.arange(k2+1));bg|=np.isin(l2,[i for i in range(1,k2+1) if sz[i]>120])
    al=ndimage.gaussian_filter(np.where(bg,0,255).astype(float),.7).clip(0,255).astype(np.uint8)
    out.paste(Image.fromarray(np.dstack([a.astype(np.uint8),al]),'RGBA'),(c*256,r*384))
out.save(f'portraits/clip_{name}.webp','WEBP',quality=50,method=6,alpha_quality=55)
import os;print('clip',name,os.path.getsize(f'portraits/clip_{name}.webp')//1024,'KB')
g=Image.new('RGBA',out.size,(40,90,40,255));g.alpha_composite(out);g.resize((512,768)).save('clip_chk.png')
