# usage: lightcheck.py SRC OUT  -- remove a pale painted checkerboard behind a darker figure
import sys,numpy as np
from PIL import Image
from scipy import ndimage
a=np.asarray(Image.open(sys.argv[1]).convert('RGB')).astype(int);mx,mn=a.max(2),a.min(2)
light=((mx-mn)<14)&(mn>=205)
lab,n=ndimage.label(light);border=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
bg=np.isin(lab,list(border));sz=ndimage.sum(light,lab,range(n+1))
bg|=np.isin(lab,[i for i in range(1,n+1) if i not in border and sz[i]>400])
fg=ndimage.binary_opening(~bg,iterations=1)
l2,n2=ndimage.label(fg);s2=ndimage.sum(fg,l2,range(1,n2+1));fg=np.isin(l2,[i+1 for i,s in enumerate(s2) if s>500])
for _ in range(2):fg&=~(ndimage.binary_dilation(~fg)&((mx-mn)<20)&(mn>190))
al=ndimage.gaussian_filter(fg.astype(float),.7)
im=Image.fromarray(np.dstack([a.astype(np.uint8),(al*255).astype(np.uint8)]),'RGBA');im.save(sys.argv[2])
b=Image.new('RGBA',im.size,(30,90,160,255));b.alpha_composite(im);b.resize((341,512)).save(sys.argv[2].replace('.png','_chk.png'))
