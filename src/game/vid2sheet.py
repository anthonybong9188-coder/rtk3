"""vid2sheet.py VIDEO ID 'a-b,a-b,a-b,a-b,a-b' [N=12]  -> sprites/f_<ID>_{shu,wei,wu,ind}.png"""
import sys,os,subprocess
from PIL import Image
v,ID,segs=sys.argv[1],sys.argv[2],sys.argv[3];N=int(sys.argv[4]) if len(sys.argv)>4 else 12
d=f'vx/fr_{ID}';os.makedirs(d,exist_ok=True)
subprocess.run(['ffmpeg','-v','error','-y','-i',v,'-vsync','0',f'{d}/%04d.png'],check=True)
seg=[tuple(map(int,s.split('-'))) for s in segs.split(',')]
rows=[[int(round(a+(b-a)*i/(N-1))) for i in range(N)] for a,b in seg]
FW,FH=Image.open(f'{d}/0001.png').size;G=60
o=Image.new('RGB',(N*FW+(N+1)*G,len(rows)*FH+(len(rows)+1)*G),(255,255,255))
for r,row in enumerate(rows):
  for c,f in enumerate(row):o.paste(Image.open(f'{d}/{f+1:04d}.png').convert('RGB'),(G+c*(FW+G),G+r*(FH+G)))
o.save(f'sprites/vid_{ID}_grid.png')
env=dict(os.environ,BGTH='232',HOLEMIN='2500')
print(subprocess.run(['python3','game/cutsheet.py',f'sprites/vid_{ID}_grid.png','vtmp',str(len(rows)),str(N)],env=env,capture_output=True,text=True).stdout.strip().splitlines()[-1])
s=Image.open('vtmp_shu.png').convert('RGBA')
OUT=os.environ.get('OUT',f'sprites/f_{ID}')
for f in ['shu','wei','wu','ind']:
  src=Image.open(f'vtmp_{f}.png').convert('RGBA') if os.environ.get('RECOLOR') else s
  src.save(f'{OUT}_{f}.png')
g=Image.new('RGBA',s.size,(120,100,70,255));g.alpha_composite(s);g.resize((1536,int(1536*s.size[1]/s.size[0]))).save(f'{ID}_vview.png')
