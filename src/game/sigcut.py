import numpy as np
from PIL import Image
from scipy import ndimage
S='/tmp/claude-0/-home-claude/3caa1e0b-7a90-56f6-b65a-93a3eae7fddc/scratchpad'
a=np.asarray(Image.open(f'{S}/sprites/shu_general_signal_clean.png').convert('RGBA'));H,W,_=a.shape;fg=a[...,3]>40
proj=fg.sum(0);cuts=[0]
for k in range(1,4):
    c0=int(W*k/4);lo,hi=c0-90,c0+90;cuts.append(lo+int(np.argmin(proj[lo:hi])))
cuts.append(W)
K=0.383;CW,CH,AX,AY=300,300,150,292
out=Image.new('RGBA',(CW*4,CH),(0,0,0,0))
for f in range(4):
    reg=np.zeros_like(fg);reg[:,cuts[f]:cuts[f+1]]=True;m=fg&reg
    lab,n=ndimage.label(ndimage.binary_dilation(m,iterations=2)&m|m);lab,n=ndimage.label(ndimage.binary_dilation(m,iterations=2));sz=ndimage.sum(m,lab,range(1,n+1));big=1+int(np.argmax(sz));keep=[big]
    for j,sl in enumerate(ndimage.find_objects(lab)):
        if j+1==big or sz[j]<150:continue
        if sl[1].start<=cuts[f]+1 or sl[1].stop>=cuts[f+1]-1:continue
        keep.append(j+1)
    m=np.isin(lab,keep)&m
    ys,xs=np.nonzero(m);y0,y1,x0,x1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
    cut=a[y0:y1,x0:x1].copy();cut[...,3]=np.where(m[y0:y1,x0:x1],cut[...,3],0)
    low=m[y0+int((y1-y0)*.7):y1,x0:x1];ax=np.median(np.nonzero(low)[1])
    im=Image.fromarray(cut,'RGBA');w,h=round(im.width*K),round(im.height*K);im=im.resize((w,h),Image.LANCZOS)
    x=f*CW+AX-round(ax*K);x=max(f*CW,min(x,f*CW+CW-w));out.alpha_composite(im,(x,max(0,AY-h)));print(f,w,h)
code=open(f'{S}/game/cutsheet.py').read();exec(code[code.index('def recolor'):code.index("q(out).save")])
for fk,args in [('shu',None),('wei',(218,1,1)),('wu',(2,1.05,1)),('ind',(32,.75,.9))]:
    q(out if not args else recolor(out,*args)).save(f'{S}/sprites/general_sig_{fk}.png',optimize=True)
