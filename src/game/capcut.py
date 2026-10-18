import numpy as np, re
from PIL import Image
from scipy import ndimage
S='/tmp/claude-0/-home-claude/3caa1e0b-7a90-56f6-b65a-93a3eae7fddc/scratchpad'
src=Image.open(f'{S}/sprites/shu_general_capture_src.png').convert('RGBA');a=np.asarray(src)
fg=a[...,3]>40;lab,n=ndimage.label(ndimage.binary_dilation(fg,iterations=3))
objs=[]
for i,sl in enumerate(ndimage.find_objects(lab)):
    if (lab[sl]==i+1).sum()>3000:objs.append((sl[1].start,i+1,sl))
objs.sort()
# frames: 0 rear, 1 fall (body + flying weapon), 2 riderless horse, 3 on knee, 4 kneeling with weapon
ids=[[objs[0][1]],[objs[1][1],objs[2][1]],[objs[3][1]],[objs[4][1]],[objs[5][1]]]
K=0.417; CW,CH,AX,AY=300,300,150,292
out=Image.new('RGBA',(CW*5,CH),(0,0,0,0))
for f,idl in enumerate(ids):
    m=np.isin(lab,idl)&fg;ys,xs=np.nonzero(m);y0,y1,x0,x1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
    cut=a[y0:y1,x0:x1].copy();cut[...,3]=np.where(m[y0:y1,x0:x1],cut[...,3],0)
    low=m[y0+int((y1-y0)*.7):y1,x0:x1];ax=np.median(np.nonzero(low)[1])
    im=Image.fromarray(cut,'RGBA');w,h=round(im.width*K),round(im.height*K);im=im.resize((w,h),Image.LANCZOS)
    x=f*CW+AX-round(ax*K);x=max(f*CW,min(x,f*CW+CW-w));out.alpha_composite(im,(x,max(0,AY-h)))
    print(f,w,h)
code=open(f'{S}/game/cutsheet.py').read()
exec(code[code.index('def recolor'):code.index("q(out).save")])
q(out).save(f'{S}/sprites/general_cap_shu.png',optimize=True)
q(recolor(out,218,1.0,1.0)).save(f'{S}/sprites/general_cap_wei.png',optimize=True)
q(recolor(out,2,1.05,1.0)).save(f'{S}/sprites/general_cap_wu.png',optimize=True)
q(recolor(out,32,.75,.9)).save(f'{S}/sprites/general_cap_ind.png',optimize=True)
