#!/bin/bash
# usage: addfx.sh <sheet.png> <id> -> sprites/fx_<id>.jpg (4x4 frames of 256, black bg for additive blending)
set -e
S=/tmp/claude-0/-home-claude/3caa1e0b-7a90-56f6-b65a-93a3eae7fddc/scratchpad; cd $S
python3 -c "
from PIL import Image
im=Image.open('$1').convert('RGB');W,H=im.size;out=Image.new('RGB',(1024,1024))
for r in range(4):
  for c in range(4):
    f=im.crop((round(c*W/4)+3,round(r*H/4)+3,round((c+1)*W/4)-3,round((r+1)*H/4)-3)).resize((256,256),Image.LANCZOS);out.paste(f,(c*256,r*256))
out.save('sprites/fx_$2.jpg',quality=82);import os;print('fx_$2',os.path.getsize('sprites/fx_$2.jpg')//1024,'KB')"
for d in RTK3/app/src/main/assets/www/sprites site/sprites /home/claude/rtk3/sprites; do cp sprites/fx_$2.jpg $d/; done
cp "$1" /home/claude/rtk3/src/pool_src/fx_$2_src.png; cp game/addfx.sh /home/claude/rtk3/src/game/
cd /home/claude/rtk3 && git add -A && git commit -qm "Skill effect sheet: $2

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_0111XNMMrJnBfRdJHxiYc5DP" && git pull -q --rebase && git push -q && git log --oneline -1
