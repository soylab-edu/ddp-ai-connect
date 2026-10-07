from pathlib import Path
import re,base64,mimetypes,json
R=Path(__file__).resolve().parents[1];M=R/'reference-reset/motion';O=R/'FINAL_AI_CONNECT'
def data(p):
 return 'data:'+(mimetypes.guess_type(p.name)[0] or 'application/octet-stream')+';base64,'+base64.b64encode(p.read_bytes()).decode()
def css(s,root):
 def sub(m):
  u=m[1].strip('"\' ')
  if u.startswith(('data:','http','#')):return m[0]
  p=(root/u.split('?')[0]).resolve()
  return 'url("'+data(p)+'")' if p.is_file() else m[0]
 return re.sub(r'url\(([^)]+)\)',sub,s)
h=(M/'header.html').read_text(encoding='utf-8')
h=h.replace('<html lang="ko">','<html lang="ko" class="embedded">')
h=re.sub(r'<link rel="stylesheet" href="([^"]+)">',lambda m:'<style>'+css((M/m[1].split('?')[0]).read_text(encoding='utf-8'),M)+'</style>',h)
h=re.sub(r'<script src="([^"]+)"></script>',lambda m:'<script>'+(M/m[1].split('?')[0]).read_text(encoding='utf-8').replace('</script','<\\/script')+'</script>',h)
scenes=(M/'live-scenes.html').read_text(encoding='utf-8')
scenes=re.sub(r'src="(assets/[^"]+)"',lambda m:'src="'+data(M/m[1])+'"',scenes)
player=(M/'player.js').read_text(encoding='utf-8')
start=player.index('  const response = await fetch(');end=player.index('  const firstWord=',start)
player=player[:start]+'  stage.innerHTML = '+json.dumps(scenes,ensure_ascii=False)+';\n'+player[end:]
player=player.replace("parent.postMessage({type:'ai-connect:navigate',target},location.origin)","parent.postMessage({type:'ai-connect:navigate',target},'*')")
player=re.sub(r'link.href=`http://127\.0\.0\.1:[^`]+`;',"link.href='#'+target;",player)
h=re.sub(r'<script type="module" src="[^"]+"></script>',lambda m:'<script>(async()=>{'+player.replace('</script','<\\/script')+'})();</script>',h)
h=h.replace('audio/AI-CONNECT-final-mix-16s.mp3',data(M/'audio/AI-CONNECT-final-mix-16s.mp3'))
credits='data:text/plain;charset=utf-8;base64,'+base64.b64encode((M/'audio/STOMP-CREDITS.md').read_bytes()).decode()
h=h.replace('audio/STOMP-CREDITS.md',credits)
body=(R/'03_header_rebuild_20261007/page-review-v7.html').read_text(encoding='utf-8')
body=re.sub(r'<link[^>]+(?:fonts.googleapis.com|fonts.gstatic.com)[^>]*>','',body)
body=body.replace('<link rel="stylesheet" href="dark-body.css">','<style>'+css((R/'03_header_rebuild_20261007/dark-body.css').read_text(encoding='utf-8'),R/'03_header_rebuild_20261007')+'</style>')
body=body.replace('src="/reference-reset/motion/header.html?embed=1"','src="about:blank"')
# srcdoc inherits the parent origin; source-window validation also works on file://.
body=body.replace("if(event.origin!==location.origin||!frame||event.source!==frame.contentWindow)return;","if(!frame||event.source!==frame.contentWindow)return;")
payload=base64.b64encode(h.encode()).decode()
script='<script>document.getElementById("headerFrame").srcdoc=new TextDecoder().decode(Uint8Array.from(atob("'+payload+'"),c=>c.charCodeAt(0)));</script>'
body=body.replace('</head>','<style>@font-face{font-family:Outfit;src:url('+data(M/'assets/Outfit.ttf')+');font-weight:100 900;font-display:swap}</style></head>')
body=body.replace('</body>',script+'</body>')
(O/'AI_CONNECT_FINAL.html').write_text(body,encoding='utf-8')
print('Standalone HTML:',len(body.encode()),'bytes')
