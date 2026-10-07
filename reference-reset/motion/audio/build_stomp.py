from pathlib import Path
import subprocess,numpy as np,json
P=Path(__file__).parent
src=P/'stomp-percussion-5733-original.mp3'
x=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(src),'-f','f32le','-ar','12000','-ac','1','-']),dtype='<f4')
h=120;e=np.sqrt(np.mean(x[:len(x)//h*h].reshape(-1,h)**2,axis=1));o=np.maximum(0,np.diff(e));o=np.convolve(o,[.2,.6,1,.6,.2],mode='same')
times=np.array([1.4,2.7,5.2,7.3,8.8,9.2,9.6,10,10.4,10.8,11.2,11.7,12.2]);weights=np.array([1,1,1,1,2,2,2,2,2,2,3,2,3])
best=(-1,0,1)
for speed in np.linspace(.94,1.06,49):
 for start in np.arange(0,24,.02):
  idx=np.rint((start+times*speed)*100).astype(int)
  score=float(np.sum(o[idx]*weights))
  if score>best[0]:best=(score,float(start),float(speed))
_,start,speed=best
# Preserve pitch; create a gentle intensity arc without adding any effects.
f=f"atrim=start={start}:duration={16*speed},asetpts=PTS-STARTPTS,atempo={speed},volume='if(lt(t,1.4),0.35,if(lt(t,5.2),0.45,if(lt(t,8.8),0.53,if(lt(t,11.2),0.65,0.48))))':eval=frame,afade=t=in:d=0.08,afade=t=out:st=12.6:d=3.4,alimiter=limit=0.85:level=false,apad,atrim=duration=16"
for ext,codec in [('wav',['-c:a','pcm_s24le']),('mp3',['-c:a','libmp3lame','-b:a','320k'])]:
 subprocess.run(['ffmpeg','-v','error','-y','-i',str(src),'-af',f,'-ar','48000',*codec,str(P/f'AI-CONNECT-stomp-match-16s.{ext}')],check=True)
(P/'STOMP-EDIT.json').write_text(json.dumps({'source_start':start,'speed_pitch_preserved':speed,'duration':16,'source':'https://pixabay.com/music/introoutro-stomp-percussion-5733/','method':'weighted transient alignment; volume arc; final fade'},indent=2))
print(start,speed)
