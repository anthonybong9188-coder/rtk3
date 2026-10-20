#!/bin/bash
# usage: addpool.sh <grid.png> <batch_no>   -> slices a 2x2 grid into portraits/pool/pool_bNN_1..4.webp and pushes
set -e
S=/tmp/claude-0/-home-claude/3caa1e0b-7a90-56f6-b65a-93a3eae7fddc/scratchpad; cd $S
B=$(printf "%02d" $2)
python3 -c "
from PIL import Image
import os
im=Image.open('$1').convert('RGB');W,H=im.size;cw,ch=W//2,H//2
th=Image.new('RGB',(800,200))
for i in range(4):
  c=im.crop(((i%2)*cw,(i//2)*ch,(i%2)*cw+cw,(i//2)*ch+ch));n='pool_b${B}_%d'%(i+1)
  c.save('originals/pool/'+n+'.png');s=c.resize((360,540),Image.LANCZOS);s.save('portraits/pool/'+n+'.webp','WEBP',quality=62,method=6)
  k=360/512;th.paste(s.crop((int(86*k),int(30*k),int(426*k),int(370*k))).resize((200,200)),(i*200,0))
  print(n,os.path.getsize('portraits/pool/'+n+'.webp')//1024,'KB')
th.save('pool_faces.png')"
cp portraits/pool/pool_b${B}_*.webp /home/claude/rtk3/portraits/pool/; cp originals/pool/pool_b${B}_*.png /home/claude/rtk3/src/pool_src/; cp game/addpool.sh /home/claude/rtk3/src/game/
cd /home/claude/rtk3 && git add -A && git commit -qm "Portrait pool: batch $2

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_0111XNMMrJnBfRdJHxiYc5DP" && git pull -q --rebase && git push -q && git log --oneline -1 && ls portraits/pool | wc -l
