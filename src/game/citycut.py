# cut the 3x2 city sheet off a magenta key; writes art/city_<tier>_<state>.png + flag mask
import sys,numpy as np
from PIL import Image
from scipy import ndimage
src=sys.argv[1]
im=np.asarray(Image.open(src).convert('RGB')).astype(float)
R,G,B=im[...,0],im[...,1],im[...,2]
# magenta-ness: how far R and B rise above G
mg=np.minimum(R,B)-G
a=1-np.clip((mg-40)/(200-40),0,1)          # 0 at pure key, 1 for normal colours
a[mg<40]=1
# unmix magenta from semi-transparent pixels (smoke, edges)
K=np.array([250,2,251.])
al=np.maximum(a,1e-3)[...,None]
fg=np.clip((im-(1-al)*K)/al,0,255)
# despill: pull leftover purple toward grey
sp=np.clip(np.minimum(fg[...,0],fg[...,2])-fg[...,1],0,None)*(a<.98)
fg[...,0]-=sp*.9;fg[...,2]-=sp*1.0
fg=np.clip(fg,0,255)
H,W=a.shape;names=['small','large','capital'];states=['ok','siege']
for r in range(2):
  for c in range(3):
    y0,y1=r*H//2,(r+1)*H//2;x0,x1=c*W//3,(c+1)*W//3
    sa=a[y0:y1,x0:x1].copy();sa[sa<.04]=0
    lab,n=ndimage.label(sa>.3);
    if n>1:
      sz=ndimage.sum(np.ones_like(sa),lab,range(1,n+1));big=np.argmax(sz)+1
      # keep the main city plus smoke/fire blobs sitting directly above it
      ys0,xs0=np.nonzero(lab==big);cx0,cx1=xs0.min()-10,xs0.max()+10
      keep=lab==big
      for i in range(1,n+1):
        if i==big:continue
        yy,xx=np.nonzero(lab==i)
        if xx.min()>=cx0 and xx.max()<=cx1 and yy.max()<ys0.min()+60:keep|=lab==i
      sa*=ndimage.binary_dilation(keep,iterations=8)
    ys,xs=np.nonzero(sa>.02);by0,by1,bx0,bx1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
    rgb=fg[y0:y1,x0:x1][by0:by1,bx0:bx1];aa=sa[by0:by1,bx0:bx1]
    # white flag: bright, unsaturated, opaque
    mx,mn=rgb.max(2),rgb.min(2)
    flag=(mn>185)&(mx-mn<38)&(aa>.9)
    lab2,n2=ndimage.label(ndimage.binary_closing(flag,iterations=2))
    if n2:
      sz=ndimage.sum(np.ones_like(aa),lab2,range(1,n2+1));big=np.argmax(sz)+1;flag=ndimage.binary_dilation(lab2==big,iterations=1)&(mn>140)
    img=np.dstack([rgb,aa*255]).astype(np.uint8)
    o=Image.fromarray(img,'RGBA');w=320;h=round(o.height*w/o.width)
    nm=f'art/city_{names[c]}_{states[r]}'
    o.resize((w,h),Image.LANCZOS).save(nm+'.png',optimize=True)
    m=Image.fromarray((flag*255).astype(np.uint8)).resize((w,h),Image.LANCZOS)
    mk=np.dstack([np.zeros((h,w,3),np.uint8),np.asarray(m)])
    Image.fromarray(mk,'RGBA').save(nm+'_flag.png',optimize=True)
    print(nm,o.size,'flag px',int(flag.sum()))
