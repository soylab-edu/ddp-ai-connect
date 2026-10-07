from pathlib import Path
import subprocess, json
import numpy as np
P=Path(__file__).parent
SR=48000
mix=np.zeros((SR*16,2),dtype=np.float64)
cues=[]
def read(name):
    raw=subprocess.check_output(['ffmpeg','-v','error','-i',str(P/'foley'/f'{name}.mp3'),'-f','f32le','-ar',str(SR),'-ac','1','-'])
    return np.frombuffer(raw,dtype='<f4').astype(float)
def sample(name,duration):
    x=read(name); n=int(duration*SR)
    # Select the strongest short natural gesture, retain its attack.
    energy=np.convolve(x*x,np.ones(480)/480,mode='same')
    peak=int(np.argmax(energy)); start=max(0,peak-int(.07*SR))
    x=x[start:start+n].copy()
    if len(x)<n:x=np.pad(x,(0,n-len(x)))
    x-=np.mean(x); x/=max(np.max(np.abs(x)),1e-8)
    f=int(.012*SR); tail=min(int(.09*SR),n//3)
    x[:f]*=np.linspace(0,1,f);x[-tail:]*=np.linspace(1,0,tail)
    return x
paper=sample('paper',.29); wood=sample('wood',.19); cloth=sample('cloth',.64)
def put(x,t,gain,pan,label):
    i=round(t*SR); n=min(len(x),len(mix)-i)
    mix[i:i+n,0]+=x[:n]*gain*np.sqrt((1-pan)/2)
    mix[i:i+n,1]+=x[:n]*gain*np.sqrt((1+pan)/2)
    cues.append({'time':t,'duration':len(x)/SR,'event':label})
put(paper,.12,.12,-.25,'dot gathering / paper')
put(cloth,.84,.24,0,'radial burst / cloth')
put(wood,1.4,.22,0,'date lands / wood')
put(paper,2.7,.16,-.15,'message line one')
put(paper,3.0,.13,.15,'message line two')
put(cloth,5.2,.18,-.3,'wave enters')
put(cloth,6.35,.11,.3,'wave sweeps')
put(paper,7.3,.15,0,'logo reveal')
for j in range(6):put(paper,8.8+.4*j,.14+(j%2)*.015,(-.15 if j%2==0 else .15),'word '+str(j+1))
for t,g in [(11.2,.27),(11.7,.19),(12.2,.23)]:put(wood,t,g,0,'final typography lands')
# No oscillators, synthesized tones, music bed, delay or artificial reverb.
pcm=mix.astype('<f4').tobytes()
for ext,args in [('wav',['-c:a','pcm_s24le']),('mp3',['-c:a','libmp3lame','-b:a','320k'])]:
    subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(SR),'-ac','2','-i','pipe:0',*args,str(P/f'AI-CONNECT-natural-foley-16s.{ext}')],input=pcm,check=True)
(P/'FOLEY-CUES.json').write_text(json.dumps(cues,indent=2),encoding='utf-8')
print(json.dumps({'duration':16,'events':len(cues),'peak_dbfs':float(20*np.log10(np.max(np.abs(mix))))}))
