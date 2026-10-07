from pathlib import Path
import numpy as np
from scipy import signal
import soundfile as sf
import json
root=Path(__file__).parent
y,sr=sf.read(root/'sources/music-original.wav')
mono=y.mean(axis=1)
hop=240
f,t,z=signal.stft(mono,sr,nperseg=1024,noverlap=1024-hop)
mag=np.abs(z)
flux=np.maximum(0,np.diff(mag,axis=1)).sum(axis=0)
flux=np.r_[0,flux]
low=np.sqrt(np.mean(signal.sosfilt(signal.butter(4,180,fs=sr,btype='low',output='sos'),mono)[:len(mono)//hop*hop].reshape(-1,hop)**2,axis=1))
corr=signal.correlate(flux-flux.mean(),flux-flux.mean(),mode='full')[len(flux)-1:]
bpms=np.arange(90,181,.1)
scores=np.array([corr[round(60/b*sr/hop)] for b in bpms])
top=signal.find_peaks(scores,distance=50)[0]
rank=top[np.argsort(scores[top])[::-1]][:8]
peaks,_=signal.find_peaks(flux,distance=int(.18*sr/hop),prominence=flux.max()*.06)
report={'duration':len(y)/sr,'sr':sr,'peak':float(np.max(np.abs(y))),'bpm_candidates':[{'bpm':round(float(bpms[i]),2),'score':round(float(scores[i]),4)} for i in rank],'onsets':[round(float(t[i]),3) for i in peaks],'lowband_peak_times':[]}
lp,_=signal.find_peaks(low,distance=int(.25*sr/hop),prominence=low.max()*.12)
report['lowband_peak_times']=[round(float(i*hop/sr),3) for i in lp]
(root/'source-analysis.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
