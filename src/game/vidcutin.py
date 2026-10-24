# vidcutin.py SRC NAME : portrait Grok clip -> 1280x720 cut-in (blurred side fill, white fade at end)
import subprocess,numpy as np,sys
from PIL import Image,ImageFilter
src,name=sys.argv[1],sys.argv[2]
b=subprocess.run(['ffmpeg','-v','error','-i',src,'-vf','scale=480:720:flags=lanczos,format=rgb24','-f','rawvideo','-'],capture_output=True).stdout
F=np.frombuffer(b,np.uint8).reshape(-1,720,480,3);n=len(F);OW,OH=1280,720;FADE=8
enc=[subprocess.Popen(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s',f'{OW}x{OH}','-r','24','-i','-',*a,f'portraits/vid_{name}.{e}'],stdin=subprocess.PIPE) for e,a in [('mp4',['-c:v','libx264','-preset','slow','-crf','22','-pix_fmt','yuv420p','-movflags','+faststart']),('webm',['-c:v','libvpx-vp9','-b:v','0','-crf','48','-row-mt','1'])]]
for i in range(n):
  f=Image.fromarray(F[i]);bg=f.resize((160,240)).crop((0,75,160,165)).filter(ImageFilter.GaussianBlur(5)).resize((OW,OH),Image.BICUBIC)
  bg.paste(f,((OW-480)//2,0));a=np.asarray(bg).astype(float)
  k=i-(n-FADE)
  if k>=0:al=(k+1)/(FADE+1)*.85;a=a*(1-al)+255*al
  d=a.clip(0,255).astype(np.uint8).tobytes()
  for e in enc:e.stdin.write(d)
for e in enc:e.stdin.close();e.wait()
print(name,n,'frames')
