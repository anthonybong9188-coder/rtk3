import numpy as np,sys,json
from PIL import Image,ImageEnhance
S='/tmp/claude-0/-home-claude/3caa1e0b-7a90-56f6-b65a-93a3eae7fddc/scratchpad'
SRC={'lady_gan':'src_lady_gan3','lady_mi':'src_lady_mi2','consort_zhao':'src_consort_zhao3','consort_li':'src_consort_li3','consort_yan':'src_consort_yan2','huang_yi':'src_huang_yi2','ren_rui':'src_ren_rui2','mi_ren':'src_mi_ren','mi_shao':'src_mi_shao','zhurong':'src_zhurong4'}
Z=float(sys.argv[1]) if len(sys.argv)>1 else 1.3
out={}
for n,src in SRC.items():
  im=Image.open(f'{S}/portraits/{src}.png').convert('RGB');W,H=im.size
  cut=np.asarray(Image.open(f'{S}/portraits/cut_{n}.webp').convert('RGBA'))[...,3]>128
  sx,sy=W/cut.shape[1],H/cut.shape[0]
  ys=np.nonzero(cut.sum(1)>cut.shape[1]*.02)[0];top=ys.min()*sy
  band=cut[ys.min():ys.min()+int(cut.shape[0]*.22)];xs=np.nonzero(band.sum(0))[0];cx=(xs.min()+xs.max())/2*sx
  cw,chh=W/Z,H/Z
  x0=min(max(0,cx-cw/2),W-cw);y0=min(max(0,top-chh*.04),H-chh)
  c=im.crop((round(x0),round(y0),round(x0+cw),round(y0+chh))).resize((1024,1536),Image.LANCZOS)
  c=ImageEnhance.Color(c).enhance(1.08);c=ImageEnhance.Contrast(c).enhance(1.05)
  c.save(f'{S}/portraits/z_{n}.png');out[n]=[round(x0),round(y0)]
print(out)
