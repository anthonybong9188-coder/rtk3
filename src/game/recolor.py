import numpy as np,sys
from PIL import Image
def hsv(a):
    import colorsys
def run(n,mode,face):
    im=Image.open(f'originals/{n}.png').convert('RGB');a=np.asarray(im).astype(np.float32)/255
    h,s,v=np.asarray(im.convert('HSV')).astype(np.float32).transpose(2,0,1)/255;h*=360
    H,W=h.shape;yy,xx=np.mgrid[0:H,0:W]
    fx0,fy0,fx1,fy1=[int(t*W if i%2==0 else t*H) for i,t in enumerate(face)]
    inface=(xx>fx0)&(xx<fx1)&(yy>fy0)&(yy<fy1)
    m=np.zeros_like(h)
    if 'red' in mode:
        d=np.minimum(np.abs(h-355),360-np.abs(h-355));m=np.maximum(m,np.clip((22-d)/10,0,1)*np.clip((s-.38)/.15,0,1))
    if 'blue' in mode:
        d=np.abs(h-220);m=np.maximum(m,np.clip((38-d)/10,0,1)*np.clip((s-.07)/.08,0,1))
    m[inface]=0
    from scipy.ndimage import gaussian_filter
    m=gaussian_filter(m,1.2)
    nh=np.where(m>0,100.0,h);ns=np.where(m>0,np.clip(np.maximum(s,.4),0,.5),s);nv=np.where(m>0,v*0.85,v)
    hsvimg=np.stack([nh/360*255,ns*255,nv*255],2).clip(0,255).astype(np.uint8)
    g=np.asarray(Image.fromarray(hsvimg,'HSV').convert('RGB')).astype(np.float32)/255
    out=a*(1-m[...,None])+g*m[...,None]
    Image.fromarray((out*255).clip(0,255).astype(np.uint8)).save(f'recol/{n}.png')
import os;os.makedirs('recol',exist_ok=True)
J={'zhao_yun':('blue',(.3,.0,.85,.38)),'zhang_fei':('red',(.35,.05,.85,.42)),'zhuge_liang':('blue',(.2,.08,.6,.38)),'huang_zhong':('red',(.3,.05,.78,.36)),'liu_bei':('red',(.25,.0,.65,.36)),'guan_yu':('red',(.3,.1,.75,.38))}
for n,(m,f) in J.items():run(n,m,f)
cmp=Image.new('RGB',(6*200,2*300))
for i,n in enumerate(J):
    cmp.paste(Image.open(f'originals/{n}.png').resize((200,300)),(i*200,0));cmp.paste(Image.open(f'recol/{n}.png').resize((200,300)),(i*200,300))
cmp.save('recol_cmp3.png')
