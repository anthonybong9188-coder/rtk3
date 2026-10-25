"""Cut a ChatGPT sprite sheet (painted checkerboard background) into a clean,
baseline-aligned atlas with real transparency, plus recoloured faction copies.

usage: python3 cutsheet.py SRC.png OUT_PREFIX
writes OUT_PREFIX_<fac>.png (4 rows x 4 cols, cell CW x CH) and prints anchor info
"""
import sys, json, colorsys
import numpy as np
from PIL import Image
from scipy import ndimage

src, prefix = sys.argv[1], sys.argv[2]
NR = int(sys.argv[3]) if len(sys.argv) > 3 else 4
NC = int(sys.argv[4]) if len(sys.argv) > 4 else 4
KFIX = float(sys.argv[5]) if len(sys.argv) > 5 else None
_src = Image.open(src)
HAS_A = _src.mode == 'RGBA' and np.asarray(_src)[..., 3].min() < 10
im = np.asarray(_src.convert('RGB')).astype(np.int16)
ALPHA = np.asarray(_src.convert('RGBA'))[..., 3]
H, W, _ = im.shape
mx, mn = im.max(2), im.min(2)
import os
TH = int(os.environ.get('BGTH', '185'))
neutral = (mx - mn < 18) & (mn > TH)                  # checkerboard greys and whites
# background = neutral pixels connected to the image border
lab, n = ndimage.label(neutral)
border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
bg = np.isin(lab, list(border))
# enclosed checkerboard holes (between legs, under arms): large neutral patches
sizes = ndimage.sum(np.ones_like(lab), lab, index=np.arange(n + 1))
HOLEMIN = int(os.environ.get('HOLEMIN', '60'))
holes = [i for i in range(1, n + 1) if i not in border and sizes[i] > HOLEMIN]
bg |= np.isin(lab, holes)
if os.environ.get('DARKHOLE'):
    # white gaps inside dark hair/clothing: enclosed bright regions whose surrounding ring is dark
    DM=int(os.environ.get('DARKHOLE_MIN','100'));lum=mx
    for i,sl in enumerate(ndimage.find_objects(lab)):
        j=i+1
        if j in border or j in holes or sizes[j]<DM: continue
        y0,y1=max(0,sl[0].start-3),min(H,sl[0].stop+3);x0,x1=max(0,sl[1].start-3),min(W,sl[1].stop+3)
        reg=lab[y0:y1,x0:x1]==j;ring=ndimage.binary_dilation(reg,iterations=2)&~reg
        if ring.any() and lum[y0:y1,x0:x1][ring].mean()<110: bg[y0:y1,x0:x1]|=reg
fg = ~bg
if HAS_A:
    fg = ALPHA > 24
    bg = ~fg
fg = ndimage.binary_opening(fg, iterations=1)
# soften: drop isolated fringe of light-grey pixels touching background
edge = fg & ndimage.binary_dilation(bg, iterations=1) & (mn > 170) & (mx - mn < 30)
fg &= ~edge

# blobs -> frames
lab, n = ndimage.label(ndimage.binary_dilation(fg, iterations=2))
objs = ndimage.find_objects(lab)
blobs = []
for i, sl in enumerate(objs):
    area = int((lab[sl] == i + 1).sum())
    blobs.append(dict(i=i + 1, sl=sl, area=area, cy=(sl[0].start + sl[0].stop) / 2, cx=(sl[1].start + sl[1].stop) / 2))
big = [b for b in blobs if b['area'] > 4000]
small = [b for b in blobs if b['area'] <= 4000]
GRID = len(big) != NR * NC
if GRID:   # frames touch each other: split at the emptiest rows/columns near the grid lines
    def cut_at(proj, n, length):
        cuts = [0]
        for k in range(1, n):
            c0 = int(length * k / n); lo, hi = max(1, c0 - 90), min(length - 1, c0 + 90)
            cuts.append(lo + int(np.argmin(proj[lo:hi])))
        return cuts + [length]
    ys = cut_at(fg.sum(1), NR, H)
    lab = np.zeros((H, W), int)
    for rr_ in range(NR):
        band = fg[ys[rr_]:ys[rr_ + 1]]
        xs_ = cut_at(band.sum(0), NC, W)
        for cc_ in range(NC):
            reg = np.zeros((H, W), bool); reg[ys[rr_]:ys[rr_ + 1], xs_[cc_]:xs_[cc_ + 1]] = True
            m = fg & reg
            cl, cn = ndimage.label(m)
            if cn > 1:
                sizes_ = ndimage.sum(m, cl, index=np.arange(1, cn + 1))
                keep = np.zeros(cn + 1, bool); keep[1 + int(np.argmax(sizes_))] = True
                for j, sl in enumerate(ndimage.find_objects(cl)):
                    touches = sl[1].start == xs_[cc_] or sl[1].stop == xs_[cc_ + 1] or sl[0].start == ys[rr_] or sl[0].stop == ys[rr_ + 1]
                    if not touches: keep[j + 1] = True
                m = keep[cl] & m
            lab[m] = rr_ * NC + cc_ + 1
    rows = [[dict(i=rr_ * NC + cc_ + 1) for cc_ in range(NC)] for rr_ in range(NR)]
    small = []
else:
    big.sort(key=lambda b: b['cy'])
    rows = [sorted(big[r * NC:(r + 1) * NC], key=lambda b: b['cx']) for r in range(NR)]
# attach small bits (blood, plume tips) to the nearest frame
for sb in small:
    best = min(big, key=lambda b: (b['cx'] - sb['cx']) ** 2 + (b['cy'] - sb['cy']) ** 2)
    best.setdefault('extra', []).append(sb['i'])

rgba = np.dstack([im.astype(np.uint8), (np.where(fg, ALPHA if HAS_A else 255, 0)).astype(np.uint8)])
frames = []
for r, row in enumerate(rows):
    for c, b in enumerate(row):
        ids = [b['i']] + b.get('extra', [])
        mask = np.isin(lab, ids) & fg
        ys, xs = np.nonzero(mask)
        y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
        cut = rgba[y0:y1, x0:x1].copy()
        cut[..., 3] = np.where(mask[y0:y1, x0:x1], cut[..., 3], 0)
        # anchor x: centre of mass of the lower body (bottom 45% of the figure height)
        lower = mask[y0 + int((y1 - y0) * .55):y1, x0:x1]
        lx = np.nonzero(lower)[1]
        ax = float(np.median(lx)) if len(lx) else (x1 - x0) / 2
        frames.append(dict(r=r, c=c, img=cut, ax=ax, h=y1 - y0, w=x1 - x0))

# scale so a standing (row 0) figure is STAND_H px tall
STAND_H = 150
ref = np.median([f['h'] for f in frames if f['r'] == 0])
k = KFIX if KFIX else STAND_H / ref
CW, CH, AX, AY = 256, 176, 128, 168          # cell size and anchor (feet) inside cell
out = Image.new('RGBA', (CW * NC, CH * NR), (0, 0, 0, 0))
for f in frames:
    p = Image.fromarray(f['img'], 'RGBA')
    w, h = max(1, round(f['w'] * k)), max(1, round(f['h'] * k))
    p = p.resize((w, h), Image.LANCZOS)
    x = f['c'] * CW + AX - round(f['ax'] * k)
    y = f['r'] * CH + AY - h
    # keep inside its cell
    x = max(f['c'] * CW, min(x, f['c'] * CW + CW - w))
    out.alpha_composite(p, (x, max(f['r'] * CH, y)))

def recolor(img, hue_deg, sat_mul=1.0, val_mul=1.0):
    a = np.asarray(img).astype(np.float32) / 255
    rgb, al = a[..., :3], a[..., 3]
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    mxv, mnv = rgb.max(-1), rgb.min(-1)
    d = mxv - mnv + 1e-6
    hue = np.where(mxv == r, ((g - b) / d) % 6, np.where(mxv == g, (b - r) / d + 2, (r - g) / d + 4)) * 60
    sat = np.where(mxv > 0, d / (mxv + 1e-6), 0)
    green = (hue > 75) & (hue < 165) & (sat > .28) & (al > 0)
    nh = np.full_like(hue, hue_deg)
    ns = np.clip(sat * sat_mul, 0, 1)
    nv = np.clip(mxv * val_mul, 0, 1)
    # hsv -> rgb
    hh = (nh / 60) % 6
    C = nv * ns
    X = C * (1 - np.abs(hh % 2 - 1))
    m = nv - C
    z = np.zeros_like(C)
    seg = np.floor(hh).astype(int)
    lut = [(C, X, z), (X, C, z), (z, C, X), (z, X, C), (X, z, C), (C, z, X)]
    nr = np.choose(seg, [l[0] for l in lut]) + m
    ng = np.choose(seg, [l[1] for l in lut]) + m
    nb = np.choose(seg, [l[2] for l in lut]) + m
    res = a.copy()
    res[..., 0] = np.where(green, nr, r)
    res[..., 1] = np.where(green, ng, g)
    res[..., 2] = np.where(green, nb, b)
    return Image.fromarray((res * 255).astype(np.uint8), 'RGBA')

def q(img):
    return img.quantize(colors=255, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.NONE)
q(out).save(f'{prefix}_shu.png', optimize=True)
q(recolor(out, 218, 1.0, 1.0)).save(f'{prefix}_wei.png', optimize=True)
q(recolor(out, 2, 1.05, 1.0)).save(f'{prefix}_wu.png', optimize=True)
q(recolor(out, 32, .75, .9)).save(f'{prefix}_ind.png', optimize=True)
print(json.dumps(dict(k=k,grid=GRID, cw=CW, ch=CH, ax=AX, ay=AY, stand=STAND_H, frames=len(frames), small=len(small))))
