#!/bin/bash
# usage: addport.sh <upload.png> <img_name> <gen_id>
set -e
S=/tmp/claude-0/-home-claude/3caa1e0b-7a90-56f6-b65a-93a3eae7fddc/scratchpad; cd $S
python3 -c "
from PIL import Image
im=Image.open('$1').convert('RGB');im.save('originals/$2.png')
im.resize((360,540),Image.LANCZOS).save('portraits/$2.webp','WEBP',quality=62,method=6)"
python3 - <<PY
import re
p='game/camp.js';s=open(p).read()
pat=re.compile(r"(\['$3','[^']*','[^']*','[a-z]*','[a-z]*',(?:\d+,){4}'[a-z]*',)null(,)")
s2,n=pat.subn(r"\1'$2'\2",s);assert n==1 or "'$2'" in s, 'gen not found';open(p,'w').write(s2)
PY
for d in /home/claude/rtk3 site RTK3/app/src/main/assets/www; do mkdir -p $d/portraits; cp portraits/$2.webp $d/portraits/; done
grep -o "\['$3'[^]]*\]" game/camp.js
