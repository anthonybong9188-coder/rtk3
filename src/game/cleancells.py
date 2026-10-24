"""cleancells.py IN OUT NC NR : drop stray fragments in each 256x176 cell (keep largest blob + big parts)"""
import sys,numpy as np
from PIL import Image
from scipy import ndimage
s=Image.open(sys.argv[1]).convert('RGBA');a=np.array(s);NC,NR=int(sys.argv[3]),int(sys.argv[4])
for r in range(NR):
  for c in range(NC):
    cell=a[r*176:(r+1)*176,c*256:(c+1)*256];m=cell[...,3]>20
    lab,n=ndimage.label(ndimage.binary_dilation(m,iterations=2))
    if n<2:continue
    sz=ndimage.sum(m,lab,range(1,n+1));big=sz.max()
    keep=np.isin(lab,[i+1 for i,v in enumerate(sz) if v>=big*.12])
    cell[...,3]=np.where(keep,cell[...,3],0)
Image.fromarray(a).save(sys.argv[2])
