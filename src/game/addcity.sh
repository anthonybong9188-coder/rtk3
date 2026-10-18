#!/bin/bash
# usage: game/addcity.sh <upload> <city_id>
set -e;cd "$(dirname "$0")/.."
python3 -c "
from PIL import Image;im=Image.open('$1').convert('RGB');im.resize((1280,round(im.height*1280/im.width)),Image.LANCZOS).save('art/$2.jpg',quality=82,optimize=True,progressive=True)"
python3 - "$2" <<'PY'
import sys,re;id=sys.argv[1];p='game/camp.js';s=open(p).read()
m=re.search(r"const CITY_ART=Object\.fromEntries\(\[([^\]]*)\]",s);ids=[x.strip("'") for x in m.group(1).split(',')]
if id not in ids:ids.append(id);s=s.replace(m.group(0),"const CITY_ART=Object.fromEntries(["+','.join(f"'{x}'" for x in ids)+"]");open(p,'w').write(s)
print(ids)
PY
