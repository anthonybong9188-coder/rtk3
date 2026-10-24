import numpy as np
from PIL import Image
from scipy import ndimage
S='/tmp/claude-0/-home-claude/3caa1e0b-7a90-56f6-b65a-93a3eae7fddc/scratchpad'
im=Image.open(f'{S}/sprites/zya_src.png').convert('RGB');a=np.asarray(im).astype(int)
sat=a.max(2)-a.min(2);bt=a[...,2]-a[...,0]
near=(a.min(2)>=238)&(sat<14)
lab0,n0=ndimage.label(near)
border=set(np.unique(np.r_[lab0[0],lab0[-1],lab0[:,0],lab0[:,-1]]))-{0}
bgids=set(border)
sl=ndimage.find_objects(lab0)
for i,s in enumerate(sl):
  k=i+1
  if k in border:continue
  m=lab0[s]==k
  if m.sum()<60:continue
  px=a[s][m]
  if px[:,2].mean()-px[:,0].mean()>1.0:bgids.add(k)
bgm=np.isin(lab0,list(bgids))
fg=~bgm
edge=fg&ndimage.binary_dilation(bgm,iterations=1)
alpha=np.where(fg,255,0).astype(float)
wh=np.clip((255-a.min(2))/40,0,1)
alpha[edge]=np.maximum(wh[edge],sat[edge]/40).clip(0,1)*255
blue=(bt>18)&bgm
alpha[blue]=np.clip(bt[blue]*5,0,255)
fg=alpha>20
lab,n=ndimage.label(ndimage.binary_dilation(fg,iterations=2))
lefts=[33,302,560,829,1099,1366,1646,1930];anc=[l+98 for l in lefts]
cent=ndimage.center_of_mass(fg,lab,range(1,n+1));sizes=ndimage.sum(fg,lab,range(1,n+1))
own=np.zeros(n+1,int)-1
for i,(cy,cx) in enumerate(cent):
  if sizes[i]<6:continue
  f=int(np.argmin([abs(cx-x) for x in anc]))
  if 1560<cx<1650:f=5
  own[i+1]=f
rgba=np.dstack([a.astype(np.uint8),alpha.astype(np.uint8)])
K=0.565
o=Image.open(f'{S}/old/zyc8_prev.png').convert('RGBA');o.paste((0,0,0,0),(0,352,2048,528))
for f in range(8):
  m=(own[lab]==f)&(lab>0)
  ys,xs=np.nonzero(m);y0,y1,x0,x1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
  c=rgba[y0:y1,x0:x1].copy();c[...,3]=np.where(m[y0:y1,x0:x1],c[...,3],0)
  b=fg[488-73:488-50,lefts[f]-20:lefts[f]+230];bx=np.nonzero(b.sum(0))[0];hc=(bx.min()+bx.max())/2+lefts[f]-20
  p=Image.fromarray(c,'RGBA');w,h=round(p.width*K),round(p.height*K);p=p.resize((w,h),Image.LANCZOS)
  x=round(130-(hc-x0)*K);y=round(167-(488-y0)*K)
  cell=Image.new('RGBA',(256,176),(0,0,0,0));cell.paste(p,(x,y),p)
  o.paste(cell,(f*256,352))
o.save(f'{S}/zyc8.png')
fr=[o.crop((i*256,352,i*256+256,528)) for i in range(8)]
bg=[Image.alpha_composite(Image.new('RGBA',(256,176),(60,110,60,255)),f) for f in fr]
bg[0].save(f'{S}/zy_attack.gif',save_all=True,append_images=bg[1:],duration=125,loop=0)
s=Image.new('RGBA',(2048,176));[s.paste(b,(i*256,0)) for i,b in enumerate(bg)];s.save(f'{S}/zy_row3.png')
