"""Arrange licensed recorded music/SFX. No oscillators or synthesized bed."""
from pathlib import Path
import json
import numpy as np
from scipy import signal
import soundfile as sf

ROOT=Path(__file__).parent
SR=48000
N=16*SR
def load(name):
    y,sr=sf.read(ROOT/'sources'/name)
    assert sr==SR
    if y.ndim==1:y=np.column_stack((y,y))
    return y
def ramps(y,seconds=.008):
    y=y.copy(); n=min(round(seconds*SR),len(y)//2)
    y[:n]*=np.linspace(0,1,n)[:,None]; y[-n:]*=np.linspace(1,0,n)[:,None]
    return y
def add(dest,clip,start,gain=1):
    offset=round(start*SR); count=min(len(clip),len(dest)-offset)
    if count>0:dest[offset:offset+count]+=clip[:count]*gain

fast=load('music-150bpm.wav'); original=load('music-original.wav')
bed=np.zeros((N,2)); add(bed,ramps(fast[:round(11.2*SR)],.004),0)
add(bed,ramps(original[4*SR:round(8.8*SR)],.004),11.2)
t=np.arange(N)/SR
envelope=np.interp(t,[0,.15,.6,.82,1.4,2.7,5.2,7.3,8.8,11.17,11.2,12.2,13.0,14.8,15.4,16],
                     [.16,.42,.54,.62,.87,.74,.9,.86,.94,.94,.82,.9,.77,.67,.44,0])
bed*=envelope[:,None]*.66

kick=load('kick.wav')
energy=np.max(np.abs(kick),axis=1)
onset=int(np.argmax(energy>.015))
kick=ramps(kick[onset:],.002)
kick/=max(.001,float(np.max(np.abs(kick))))
whoosh=load('whoosh.wav')
whoosh/=max(.001,float(np.max(np.abs(whoosh))))
sfx=np.zeros((N,2)); cues=[]
def cue_kick(time,label,gain):
    add(sfx,kick,time,gain)
    # Give the edited transient its own 40 ms of space in the recorded bed.
    a=round(time*SR); count=min(round(.065*SR),N-a)
    bed[a:a+count]*=np.linspace(.78,1,count)[:,None]
    cues.append({'time':time,'frame':round(time*30),'label':label,'type':'recorded kick accent','gain':gain})
def cue_swish(start,end,label,gain):
    clip=signal.resample(whoosh,round((end-start)*SR),axis=0)
    clip=ramps(clip,.025)
    add(sfx,clip,start,gain)
    cues.append({'time':start,'end':end,'frame':round(start*30),'label':label,'type':'recorded whoosh retime','gain':gain})
cue_swish(.82,1.4,'Dot spread into date',.21)
cue_swish(5.03,5.28,'Diagonal wave entry',.105)
cue_swish(7.12,7.48,'SOYLAB reveal',.13)
for time,label,gain in [(1.4,'12 / date',.27),(2.7,'People message',.20),(5.2,'Text wave',.27),(7.3,'SOYLAB',.25)]:cue_kick(time,label,gain)
for i,word in enumerate(['AI CONNECT.','DDP.','AI.','SOYLAB.','CREATORS.','ONE.']):cue_kick(round(8.8+i*.4,3),word,.20 if i%2 else .24)
for time,label,gain in [(11.2,'Final 12',.31),(11.7,'Final DEC',.22),(12.2,'Final AI CONNECT.',.34)]:cue_kick(time,label,gain)
mix=bed+sfx
mix[-round(.025*SR):]*=np.linspace(1,0,round(.025*SR))[:,None]
sf.write(ROOT/'music-bed-edited-16s.wav',bed,SR,subtype='PCM_24')
sf.write(ROOT/'sync-accents-16s.wav',sfx,SR,subtype='PCM_24')
sf.write(ROOT/'mix-premaster-16s.wav',mix,SR,subtype='FLOAT')
report={'duration':16,'sampleRate':SR,'channels':2,'premasterPeak':float(np.max(np.abs(mix))),
        'bed':{'title':'Magnetic particles','author':'lovescotch','sourceBpmMeasured':120,'sections':[{'start':0,'end':11.2,'bpm':150,'sourceStart':0,'pitchPreservingTempo':1.25},{'start':11.2,'end':16,'bpm':120,'sourceStart':4,'pitchPreservingTempo':1}]},
        'cues':sorted(cues,key=lambda a:a['time'])}
(ROOT/'cue-sheet.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps({'premasterPeak':report['premasterPeak'],'cues':len(cues),'duration':16}))
