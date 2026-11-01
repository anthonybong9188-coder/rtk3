#!/bin/bash
# usage: deploy.sh "commit message"
set -e
S=/tmp/claude-0/-home-claude/3caa1e0b-7a90-56f6-b65a-93a3eae7fddc/scratchpad; cd $S
python3 game/assemble.py && node --check game/chk.js
W=RTK3/app/src/main/assets/www; { printf '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">\n<meta name="apple-mobile-web-app-capable" content="yes">\n<meta name="mobile-web-app-capable" content="yes">\n<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">\n<meta name="apple-mobile-web-app-title" content="RTK3">\n<meta name="theme-color" content="#14110d">\n<link rel="apple-touch-icon" href="art/icon-180.png">\n<style>html,body{margin:0;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none}[hidden]{display:none!important}</style>\n'; cat rtk3-game.html; printf '\n</html>\n'; } > $W/index.html
python3 - <<'PYCLEAN'
import shutil,os
for base in ['/tmp/claude-0/-home-claude/3caa1e0b-7a90-56f6-b65a-93a3eae7fddc/scratchpad/RTK3/app/src/main/assets/www','/tmp/claude-0/-home-claude/3caa1e0b-7a90-56f6-b65a-93a3eae7fddc/scratchpad/site','/home/claude/rtk3']:
  for d in ['art','sprites','portraits','sfx','music','maptiles']:
    p=os.path.join(base,d)
    if os.path.isdir(p): shutil.rmtree(p)
PYCLEAN
for d in $W site /home/claude/rtk3; do mkdir -p $d/art $d/sprites $d/maptiles $d/music $d/sfx; cp sfx/*.mp3 $d/sfx/; cp music/*.mp3 $d/music/; cp maptiles/* $d/maptiles/; cp art/* $d/art/; cp sprites/*.jpg $d/sprites/; mkdir -p $d/portraits; cp portraits/*.webp portraits/vid_*.mp4 $d/portraits/; cp sprites/*_shu.png sprites/*_wei.png sprites/*_wu.png sprites/*_ind.png $d/sprites/; done; cp $W/index.html site/index.html; cp $W/index.html /home/claude/rtk3/index.html
mkdir -p /home/claude/rtk3/src/game /home/claude/rtk3/src/android && cp game/*.py game/*.js game/*.sh rtk3-battle.html /home/claude/rtk3/src/game/ 2>/dev/null; cp -r RTK3/app/src/main/res RTK3/app/src/main/AndroidManifest.xml /home/claude/rtk3/src/android/ 2>/dev/null; rm -f /home/claude/rtk3/src/game/chk.js
rm -f RTK3-android.zip && zip -qr RTK3-android.zip RTK3 -x '*/build/*' '*/.gradle/*'
cd /home/claude/rtk3 && git add -A && git commit -qm "$1

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_0111XNMMrJnBfRdJHxiYc5DP" && if [ "$PUSH" = "1" ]; then git pull -q --rebase && git push -q; else echo "(committed locally, not pushed: run with PUSH=1 when asked)"; fi && git log --oneline -1 && git status -sb | head -1
