"""Rebuild an uneven Grok sheet (rows with 3-4 frames) into a clean 4x4 grid on white.
usage: regrid.py SRC OUT  [pattern e.g. '0123,0121,0122,0122']"""
import sys, numpy as np
from PIL import Image
from scipy import ndimage
src,out=sys.argv[1],sys.argv[2];pat=(sys.argv[3] if len(sys.argv)>3 else '0123,0121,0122,0122').split(',')
im=Image.open(src).convert('RGB');a=np.asarray(im).astype(int)
fg=~((a.min(2)>225)&(a.max(2)-a.min(2)<20))
fg=ndimage.binary_opening(fg,iterations=1)
lab,n=ndimage.label(ndimage.binary_dilation(fg,iterations=2))
objs=[(sl,(lab[sl]==i+1).sum()) for i,sl in enumerate(ndimage.find_objects(lab))]
objs=[sl for sl,ar in objs if ar>3000]
objs.sort(key=lambda s:(s[0].start+s[0].stop)/2)
rows=[];
for sl in objs:
    cy=(sl[0].start+sl[0].stop)/2
    if rows and abs(cy-rows[-1][0])<120: rows[-1][1].append(sl)
    else: rows.append([cy,[sl]])
rows=[sorted(r[1],key=lambda s:s[1].start) for r in rows]
print('frames per row',[len(r) for r in rows])
CW=max(s[1].stop-s[1].start for r in rows for s in r)+40;CH=max(s[0].stop-s[0].start for r in rows for s in r)+40
o=Image.new('RGB',(CW*4,CH*4),(255,255,255))
for r,(row,p) in enumerate(zip(rows,pat)):
    for c,ch in enumerate(p):
        k=min(int(ch),len(row)-1);sl=row[k];crop=im.crop((sl[1].start,sl[0].start,sl[1].stop,sl[0].stop))
        o.paste(crop,(c*CW+(CW-crop.width)//2,r*CH+CH-20-crop.height))
o.save(out)
