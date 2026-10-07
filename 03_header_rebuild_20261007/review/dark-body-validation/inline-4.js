
window.addEventListener('message',function(event){
  var frame=document.getElementById('headerFrame');
  if(event.origin!==location.origin||!frame||event.source!==frame.contentWindow)return;
  var data=event.data;
  if(!data||data.type!=='ai-connect:navigate'||!['program','guide'].includes(data.target))return;
  var target=document.getElementById(data.target);
  if(target)target.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'start'});
});
