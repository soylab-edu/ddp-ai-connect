from pathlib import Path
p=Path('D:/DDP/03_header_rebuild_20261007/page-review-v7.html');s=p.read_text(encoding='utf-8')
bridge='''<script id="header-navigation-bridge">
window.addEventListener('message',function(event){
  var frame=document.getElementById('headerFrame');
  if(event.origin!==location.origin||!frame||event.source!==frame.contentWindow)return;
  var data=event.data;
  if(!data||data.type!=='ai-connect:navigate'||!['program','guide'].includes(data.target))return;
  var target=document.getElementById(data.target);
  if(target)target.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'start'});
});
</script>'''
s=s.replace('</body>',bridge+'\n</body>');p.write_text(s,encoding='utf-8')
print('Added origin/source-checked header navigation bridge.')
