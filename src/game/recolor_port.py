# usage: recolor_port.py SRC OUT hue_lo hue_hi target_hue
import sys,numpy as np
from PIL import Image
src,out,lo,hi,th=sys.argv[1],sys.argv[2],float(sys.argv[3]),float(sys.argv[4]),float(sys.argv[5])
a=np.asarray(Image.open(src).convert('RGB')).astype(np.float32)/255
r,g,b=a[...,0],a[...,1],a[...,2];mx=a.max(-1);mn=a.min(-1);d=mx-mn+1e-6
h=np.where(mx==r,((g-b)/d)%6,np.where(mx==g,(b-r)/d+2,(r-g)/d+4))*60;s=np.where(mx>0,d/(mx+1e-6),0)
w=np.clip((s-.05)/.08,0,1)*((h>lo)&(h<hi))*np.clip((.85-mx)/.2,0,1)
nh=np.full_like(h,th);ns=np.clip(.5+s*.6,0,.9);nv=np.clip(mx*1.45+.04,0,1)
hh=(nh/60)%6;C=nv*ns;X=C*(1-np.abs(hh%2-1));m=nv-C;z=np.zeros_like(C);seg=np.floor(hh).astype(int)
lut=[(C,X,z),(X,C,z),(z,C,X),(z,X,C),(X,z,C),(C,z,X)]
o=np.stack([np.choose(seg,[l[i] for l in lut])+m for i in range(3)],-1)
res=(np.clip(a*(1-w[...,None])+o*w[...,None],0,1)*255).astype(np.uint8)
Image.fromarray(res).save(out);Image.fromarray(res).resize((340,510)).save(out.replace('.png','_chk.png'))
