#!/bin/bash
# usage: addgod.sh <sheet.png> <id>   -> sprites/g_<id>_{shu,wei,wu,ind}.png and registers it in GSHEET
set -e
S=/tmp/claude-0/-home-claude/3caa1e0b-7a90-56f6-b65a-93a3eae7fddc/scratchpad; cd $S
cp "$1" sprites/god_$2_src.png
BGTH=238 python3 game/cutsheet.py sprites/god_$2_src.png $S/gtmp 4 4 0.52 | tail -1
for f in shu wei wu ind; do cp gtmp_shu.png sprites/g_$2_$f.png; done
grep -q "$2:'g_$2'" game/hud.py || sed -i "s/const GSHEET={/const GSHEET={$2:'g_$2',/" game/hud.py
python3 game/assemble.py | tail -1
python3 -c "
from PIL import Image
g=Image.new('RGBA',(1024,704),(120,100,70,255));g.alpha_composite(Image.open('sprites/g_$2_shu.png').convert('RGBA'));g.save('gx_view.png')"
