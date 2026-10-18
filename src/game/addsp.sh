#!/bin/bash
# usage: addsp.sh <upload.png> <portrait_name>   -> portraits/sp_<name>.png (hero special cut-in pose)
set -e
S=/tmp/claude-0/-home-claude/3caa1e0b-7a90-56f6-b65a-93a3eae7fddc/scratchpad; cd $S
python3 -c "
from PIL import Image;import numpy as np
im=Image.open('$1').convert('RGBA');im.save('originals/sp_$2.png')
a=np.asarray(im);print('transparent',round((a[...,3]<10).mean(),2))
r=im.resize((683,1024),Image.LANCZOS);r.quantize(colors=256,method=Image.Quantize.FASTOCTREE).save('portraits/sp_$2.png',optimize=True)"
for d in /home/claude/rtk3 site RTK3/app/src/main/assets/www; do cp portraits/sp_$2.png $d/portraits/; done
