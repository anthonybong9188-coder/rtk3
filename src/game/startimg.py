import sys
from PIL import Image
import numpy as np
from scipy import ndimage
src,out=sys.argv[1],sys.argv[2];NR=int(sys.argv[3]) if len(sys.argv)>3 else 5
im=Image.open(src).convert('RGB');W,H=im.size
cell=im.crop((0,0,W//4,H//NR+20));a=np.asarray(cell).astype(int);m=~((a.min(2)>232)&(a.max(2)-a.min(2)<20))
lab,n=ndimage.label(ndimage.binary_dilation(m,iterations=3));sz=ndimage.sum(m,lab,range(1,n+1));keep=ndimage.binary_dilation(lab==(1+int(np.argmax(sz))),iterations=2)
ys,xs=np.nonzero(keep);x0,y0,x1,y1=xs.min(),ys.min(),xs.max()+1,ys.max()+1
c=cell.crop((x0,y0,x1,y1));mk=Image.fromarray((keep[y0:y1,x0:x1]*255).astype('uint8'))
s=620/c.height;c=c.resize((int(c.width*s),620),Image.LANCZOS);mk=mk.resize(c.size,Image.LANCZOS)
o=Image.new('RGB',(1024,1024),(255,255,255));o.paste(c,((1024-c.width)//2,(1024-c.height)//2+40),mk);o.save(out)
