# Audio verification

## Delivered files

- MP3: `AI-CONNECT-v7-beat-sync-16s.mp3`, stereo 320 kbps.
- WAV: `AI-CONNECT-v7-beat-sync-16s.wav`, exactly 16.000 seconds, 48,000 Hz, two channels, PCM 24-bit.
- Synced MP4: `../renders/AI-CONNECT-v7-beat-sync-3360x1440.mp4`, exactly 16.000 seconds, 3360×1440 H.264 at 30fps plus stereo 48 kHz AAC at 320 kbps.

## Measured values

| Measurement | WAV master | Encoded MP4 audio |
| --- | --- | --- |
| Integrated loudness | −14.29 LUFS | −14.32 LUFS |
| True peak | −1.50 dBTP | −1.48 dBTP |
| Loudness range | 3.60 LU | 3.70 LU |

Measured using FFmpeg loudnorm analysis. The master contains headroom below full scale. Exact logs are `loudness-final.txt` and `loudness-encoded.txt`; the measured input fields describe the delivered audio, not the proposed output fields from the analysis filter.

The original and synced MP4 video streams have the identical SHA-256 hash:

`45b0e597fc3c66aa7ae06ed0e110d6035054379aaab8addc0a7224c13cf66acb`

Video was copied without re-encoding or timing changes. Audio cue placement is authored at sample precision, using the video cut timestamps; the six word accents are spaced at exactly 19,200 samples (0.4 seconds), and the final three accents at 24,000 samples (0.5 seconds).

## Scope of verification

Duration, stream metadata, source tempo, cue times, levels, true peaks and unchanged picture stream are verified by analysis. No subjective listening approval is claimed by this worker. The source is a creator-described electronic music loop made with virtual instruments; no speech, vocal or sung stem was added. The parent reviews playback and the web player separately.
