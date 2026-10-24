"""Cut a white-background ChatGPT sheet with irregular frames into 256x176 cells by
assigning blobs to per-frame anchors. usage: rowcut.py SRC OUT K"""
import sys,numpy as np
from PIL import Image
from scipy import ndimage
src,out,K=sys.argv[1],sys.argv[2],float(sys.argv[3])
a=np.asarray(Image.open(src).convert('RGB')).astype(int)
sat=a.max(2)-a.min(2)
near=(a.min(2)>=236)&(sat<16)
lab0,_=ndimage.label(near)
border=set(np.unique(np.r_[lab0[0],lab0[-1],lab0[:,0],lab0[:,-1]]))-{0}
bg=set(border)
for i,s in enumerate(ndimage.find_objects(lab0)):
  k=i+1
  if k in border or s is None:continue
  m=lab0[s]==k
  if m.sum()>=int(__import__('os').environ.get('HOLEMIN','150')) and a[s][m].min(1).mean()>=float(__import__('os').environ.get('HOLETH','250.5')):bg.add(k)
bgm=np.isin(lab0,list(bg));fg=~bgm
edge=fg&ndimage.binary_dilation(bgm)
alpha=np.where(fg,255.,0.)
alpha[edge]=np.maximum(np.clip((255-a.min(2))/40,0,1),sat/40).clip(0,1)[edge]*255
fg=alpha>20
lab,n=ndimage.label(ndimage.binary_dilation(fg,iterations=2))
cent=ndimage.center_of_mass(fg,lab,range(1,n+1));sz=ndimage.sum(fg,lab,range(1,n+1))
import json
CFG=json.loads(sys.argv[4])  # [{"y0":..,"y1":..,"anchors":[...],"bias":0}]
rgba=np.dstack([a.astype(np.uint8),alpha.astype(np.uint8)])
NC=max(8,max(len(r['anchors']) for r in CFG))
o=Image.new('RGBA',(256*NC,176*len(CFG)))
for r,R in enumerate(CFG):
  own={}
  for i,(cy,cx) in enumerate(cent):
    if sz[i]<5 or not(R['y0']<=cy<R['y1']):continue
    own[i+1]=int(np.argmin([abs(cx-R.get('bias',0)-x) for x in R['anchors']]))
  A=np.array(R['anchors'],float);mids=np.array(R['mids'],float) if 'mids' in R else (A[1:]+A[:-1])/2+R.get('bias',0)
  objs=ndimage.find_objects(lab)
  big=[k for k in own if (objs[k-1][1].stop-objs[k-1][1].start)>(A[1]-A[0])*1.15]
  xs_=np.arange(lab.shape[1]);zone=np.searchsorted(mids,xs_)
  bigm=np.isin(lab,big)
  for f,ax in enumerate(R['anchors']):
    ids=[k for k,v in own.items() if v==f and k not in big]
    m=np.isin(lab,ids)|(bigm&(zone[None,:]==f))
    m[:R['y0']]=False;m[R['y1']:]=False
    if R.get('lclip') is not None:
      lc=int(ax-R['lclip']);gr=(a[...,1]-a[...,0]>35)&(a[...,1]-a[...,2]>10);bb2=gr.copy();bb2[:,lc:]=False;m&=~bb2
    if not m.any():
      print('empty',r,f,file=sys.stderr);continue
    ys,xs=np.nonzero(m);y0,y1,x0,x1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
    c=rgba[y0:y1,x0:x1].copy();c[...,3]=np.where(m[y0:y1,x0:x1],c[...,3],0)
    FE=R.get('feather',0)
    if FE:
      xx=np.arange(x0,x1,dtype=float);d=np.full_like(xx,1e9)
      if f<len(mids):d=np.minimum(d,mids[f]-xx)
      if f>0 and R.get('lfeather'):d=np.minimum(d,xx-mids[f-1])
      ramp=np.clip(d/FE,0,1);bb=bigm[y0:y1,x0:x1]
      c[...,3]=np.where(bb,c[...,3]*ramp[None,:],c[...,3]).astype(np.uint8)
    p=Image.fromarray(c,'RGBA');p=p.resize((max(1,round(p.width*K)),max(1,round(p.height*K))),Image.LANCZOS)
    x=round(128-(ax-x0)*K);y=round(168-(R['y1']-y0)*K)
    cell=Image.new('RGBA',(256,176));cell.paste(p,(x,y),p);o.paste(cell,(f*256,r*176))
  for f in range(len(R['anchors']),NC):o.paste(o.crop(((len(R['anchors'])-1)*256,r*176,len(R['anchors'])*256,r*176+176)),(f*256,r*176))
o.save(out)
