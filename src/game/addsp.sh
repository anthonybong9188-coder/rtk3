#!/bin/bash
# usage: addsp.sh <upload.png> <portrait_name>   -> portraits/sp_<name>.webp (hero special cut-in pose)
set -e
S=/tmp/claude-0/-home-claude/3caa1e0b-7a90-56f6-b65a-93a3eae7fddc/scratchpad; cd $S
python3 -c "
from PIL import Image;import numpy as np
im=Image.open('$1').convert('RGBA');im.save('originals/sp_$2.png')
a=np.asarray(im);print('transparent',round((a[...,3]<10).mean(),2))
r=im.convert('RGBA').resize((280,420),Image.LANCZOS);r.save('portraits/sp_$2.webp','WEBP',quality=55,method=6,alpha_quality=60)"
for d in /home/claude/rtk3 site RTK3/app/src/main/assets/www; do cp portraits/sp_$2.webp $d/portraits/; done
