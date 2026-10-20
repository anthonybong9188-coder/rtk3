import sys,numpy as np
from PIL import Image
from scipy import ndimage
src,out,th=sys.argv[1],sys.argv[2],int(sys.argv[3]) if len(sys.argv)>3 else 246
im=np.asarray(Image.open(src).convert('RGB')).astype(int);mx,mn=im.max(2),im.min(2)
neu=(mx-mn<14)&(mn>=th);lab,n=ndimage.label(neu)
b=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
bg=np.isin(lab,list(b))
neu2=(mx-mn<10)&(mn>=251);l2,n2=ndimage.label(neu2);sz=ndimage.sum(np.ones_like(l2),l2,index=np.arange(n2+1));bg|=np.isin(l2,[i for i in range(1,n2+1) if sz[i]>300])
a=np.where(bg,0,255).astype(np.uint8)
a=ndimage.gaussian_filter(a.astype(float),0.8).clip(0,255).astype(np.uint8)
rgba=np.dstack([im.astype(np.uint8),a]);Image.fromarray(rgba,'RGBA').save(out)
print('bg%',round(bg.mean()*100,1))
