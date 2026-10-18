"""Turn a painted grey/white checkerboard background into real transparency, keeping
white subjects (e.g. a white horse) intact: background = areas made ONLY of the two
checker tones, mixed together.  usage: python3 dechecker.py IN OUT"""
import sys, numpy as np
from PIL import Image
from scipy import ndimage
a = np.asarray(Image.open(sys.argv[1]).convert('RGB')).astype(np.int16)
mx, mn = a.max(2), a.min(2); neu = (mx - mn) < 9
B = np.concatenate([mx[:12].ravel(), mx[-12:].ravel(), mx[:, :12].ravel(), mx[:, -12:].ravel()])
Bn = np.concatenate([neu[:12].ravel(), neu[-12:].ravel(), neu[:, :12].ravel(), neu[:, -12:].ravel()])
GT = int(np.median(B[Bn & (B < 238) & (B > 150)]))
print('grey tone', GT)
like = neu & (mx >= GT - 11)
t1 = neu & (np.abs(mx - GT) <= 9); t2 = neu & (mx >= 244)
win = 21
f1 = ndimage.uniform_filter(t1.astype(float), win); f2 = ndimage.uniform_filter(t2.astype(float), win)
fl = ndimage.uniform_filter(like.astype(float), win)
bg = (fl > .97) & (f1 > .2) & (f2 > .2)
bg = ndimage.binary_dilation(bg, iterations=win // 2 + 1) & like
fg = ndimage.binary_opening(~bg, iterations=1)
# drop specks
lab, n = ndimage.label(fg); sz = ndimage.sum(fg, lab, range(1, n + 1))
fg = np.isin(lab, [i + 1 for i, s in enumerate(sz) if s > 80])
alpha = np.where(fg, 255, 0).astype(np.uint8)
Image.fromarray(np.dstack([a.astype(np.uint8), alpha]), 'RGBA').save(sys.argv[2])

# ---- pass 2: grow the background into neighbouring flat checker-toned pixels
lo = ndimage.minimum_filter(mx, 3); hi = ndimage.maximum_filter(mx, 3)
tone = neu & ((np.abs(mx - GT) <= 7) | (mx >= 246))
flat = tone & ((hi - lo <= 5) | ((hi - lo >= 22) & (hi - lo <= 40) & (lo >= GT - 11)))   # flat square, or a clean square edge
greysq = flat & (np.abs(mx - GT) <= 7) & (ndimage.uniform_filter(((np.abs(mx - GT) <= 7) & neu).astype(float), 5) > .8)
flat &= ndimage.binary_dilation(greysq, iterations=6)   # a white square always sits next to a grey one
# small enclosed checker pockets (between cape, banner and plume): flat two-tone patches
g9 = ndimage.uniform_filter(greysq.astype(float), 9); w9 = ndimage.uniform_filter((flat & (mx >= 246)).astype(float), 9)
l9 = ndimage.uniform_filter(flat.astype(float), 9)
pocket = (l9 > .9) & (g9 > .2) & (w9 > .2)
grow = bg | (ndimage.binary_dilation(pocket, iterations=4) & flat)
for _ in range(25):
    nb = ndimage.binary_dilation(grow) & flat & ~grow
    if not nb.any(): break
    grow |= nb
grow = ndimage.binary_dilation(grow) & (like | grow)   # blend pixels on the boundary
fg = ndimage.binary_opening(~grow, iterations=1)
lab, n = ndimage.label(fg); sz = ndimage.sum(fg, lab, range(1, n + 1))
fg = np.isin(lab, [i + 1 for i, s in enumerate(sz) if s > 80])
for _ in range(2):
    fg &= ~(ndimage.binary_dilation(~fg) & tone & ndimage.binary_dilation(greysq, iterations=6))
# thin pale slivers hugging the cut-out edge are leftover checker, not subject
pale = fg & neu & (mx >= GT - 16)
near = ndimage.binary_dilation(~fg, iterations=4)
keep = ndimage.binary_opening(pale, iterations=3)
fg &= ~(pale & near & ~keep)
lab, n = ndimage.label(fg); sz = ndimage.sum(fg, lab, range(1, n + 1))
fg = np.isin(lab, [i + 1 for i, s in enumerate(sz) if s > 80])
Image.fromarray(np.dstack([a.astype(np.uint8), np.where(fg, 255, 0).astype(np.uint8)]), 'RGBA').save(sys.argv[2])
