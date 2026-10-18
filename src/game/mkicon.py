import sys
from PIL import Image,ImageDraw,ImageFont,ImageFilter
import numpy as np
CH=sys.argv[1]; SZ=float(sys.argv[2]) if len(sys.argv)>2 else .46
F='/usr/share/fonts/opentype/noto/NotoSerifCJK-Bold.ttc'
def font(sz):
    for i in range(10):
        f=ImageFont.truetype(F,sz,index=i)
        if 'TC' in f.getname()[0]:return f
N=1024;yy,xx=np.mgrid[0:N,0:N]
r=np.clip(np.hypot(xx-N/2,yy-N*.45)/(N*.75),0,1)[...,None]
bg=np.array([62,30,18])*(1-r)+np.array([14,10,8])*r
rng=np.random.default_rng(4)
m=int(N*.15)
d=np.minimum.reduce([xx-m,yy-m,N-m-xx,N-m-yy]).astype(float)
noise=Image.fromarray((rng.random((N//8,N//8))*255).astype(np.uint8)).resize((N,N),Image.BICUBIC)
noise=np.asarray(noise.filter(ImageFilter.GaussianBlur(2)))/255
seal=(d+(noise-.5)*28>0)
R=40;cs=[(m+R,m+R),(N-m-R,m+R),(m+R,N-m-R),(N-m-R,N-m-R)]
dc=np.min([np.hypot(xx-a,yy-b) for a,b in cs],axis=0)
seal&=~(((xx<m+R)|(xx>N-m-R))&((yy<m+R)|(yy>N-m-R))&(dc>R))
red=np.array([176,30,26])+rng.normal(0,7,(N,N,1))
L=Image.new('L',(N,N),0);dr=ImageDraw.Draw(L);k=int(N*.205)
dr.rounded_rectangle((k,k,N-k,N-k),radius=26,outline=255,width=16)
f=font(int(N*SZ));bb=dr.textbbox((0,0),CH,font=f);w,h=bb[2]-bb[0],bb[3]-bb[1]
dr.text(((N-w)/2-bb[0],(N-h)/2-bb[1]),CH,font=f,fill=255)
carve=np.asarray(L.filter(ImageFilter.GaussianBlur(.8)))/255
wear=(np.asarray(Image.fromarray((rng.random((N//3,N//3))*255).astype(np.uint8)).resize((N,N),Image.BICUBIC))/255>.86)
carve=carve*(1-wear*.55)
gold=np.array([244,212,136])
s=seal[...,None].astype(float);c=carve[...,None]*s
out=bg*(1-s)+red*s;out=out*(1-c)+gold*c
o=Image.fromarray(np.clip(out,0,255).astype(np.uint8))
o.save('icons/icon-1024.png')
for sz in (512,192,180,32):o.resize((sz,sz),Image.LANCZOS).save(f'art/icon-{sz}.png')
for k2,s2 in dict(mdpi=48,hdpi=72,xhdpi=96,xxhdpi=144,xxxhdpi=192).items():o.resize((s2,s2),Image.LANCZOS).save(f'RTK3/app/src/main/res/mipmap-{k2}/ic_launcher.png')
