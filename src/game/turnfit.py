"""Cut a 2x4 turn strip and scale it so its final ready frame matches the unit's
battle sheet (helmet-top to feet).  usage: python3 turnfit.py TYPE"""
import sys, subprocess, json, numpy as np
from PIL import Image
S = '/tmp/claude-0/-home-claude/3caa1e0b-7a90-56f6-b65a-93a3eae7fddc/scratchpad'
t = sys.argv[1]
src, sheet, out = (f'{S}/sprites/shu_{t}_turn_clean.png' if t == 'general' else f'{S}/sprites/shu_{t}_turn_src.png'), f'{S}/sprites/{t}_shu.png', f'{S}/sprites/{t}_turn'
def run(*k):
    r = subprocess.run(['python3', f'{S}/game/cutsheet.py', src, out, '2', '4', *map(str, k)], capture_output=True, text=True, check=True)
    return json.loads(r.stdout.strip().splitlines()[-1])
def body(f, r, c):
    a = np.asarray(Image.open(f).convert('RGBA'))[r*176:(r+1)*176, c*256:(c+1)*256].astype(float) / 255
    op = a[..., 3] > .5; mx = a[..., :3].max(-1); mn = a[..., :3].min(-1)
    grey = op & ((mx - mn) < .15) & (mx > .35)
    rows = np.nonzero(grey.sum(1) >= 4)[0]; ys = np.nonzero(op.any(1))[0]
    return ys.max() - rows.min()
k0 = run()['k']
want = np.mean([body(sheet, 0, c) for c in range(4)])
k = k0 * want / body(f'{out}_shu.png', 1, 3)
run(k)
print(t, 'k', round(k0, 4), '->', round(k, 4), 'target', want, 'now', body(f'{out}_shu.png', 1, 3))
