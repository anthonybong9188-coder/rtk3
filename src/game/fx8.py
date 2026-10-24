# build sprites/skill_fx.jpg (8 cols x 6 rows) from 4x4 ChatGPT sheets; rows lacking a new sheet use old 4-frame art doubled
import os
from PIL import Image
S='/tmp/claude-0/-home-claude/3caa1e0b-7a90-56f6-b65a-93a3eae7fddc/scratchpad'
old=Image.open(f'{S}/old/skill_fx4.jpg').convert('RGB')
import glob
NR=max(6,2*(1+max(i for i,n in enumerate('abcdefgh') if os.path.exists(f'{S}/sprites/fx8_{n}_src.png'))))
o=Image.new('RGB',(2048,256*NR))
for r in range(6):
  for f in range(8):o.paste(old.crop(((f//2)*256,r*256,(f//2)*256+256,r*256+256)),(f*256,r*256))
for i,name in enumerate('abcdefgh'):
  p=f'{S}/sprites/fx8_{name}_src.png'
  if not os.path.exists(p):continue
  src=Image.open(p).convert('RGB');W,H=src.size;cw,ch=W/4,H/4
  for half in range(2):
    for f in range(8):
      rr=half*2+f//4;cc=f%4
      c=src.crop((round(cc*cw),round(rr*ch),round(cc*cw+cw),round(rr*ch+ch))).resize((256,256),Image.LANCZOS)
      o.paste(c,(f*256,(i*2+half)*256))
o.save(f'{S}/sprites/skill_fx.jpg',quality=90);o.resize((1024,128*NR)).save(f'{S}/fx8_view.png')
