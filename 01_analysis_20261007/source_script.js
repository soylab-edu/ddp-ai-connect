window.__EMBED=true;
(function(){
  var EMBED = window.__EMBED !== false;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* count-up on cover */
  if(!reduce){
    document.querySelectorAll('[data-count]').forEach(function(el){
      var end = parseFloat(el.getAttribute('data-count')), dec = (el.getAttribute('data-count').split('.')[1]||'').length;
      var suf = el.getAttribute('data-suf')||'', t0 = null, dur = 1400, delay = 2700;
      el.textContent = (0).toFixed(dec) + suf;
      setTimeout(function(){
        function step(t){ if(!t0) t0=t; var p=Math.min(1,(t-t0)/dur); p=1-Math.pow(1-p,3);
          el.textContent=(end*p).toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g,',')+suf; if(p<1) requestAnimationFrame(step); }
        requestAnimationFrame(step);
      }, delay);
    });
  }

  /* nav progress + active chapter + fab */
  var prog = document.querySelector('.prog'), fab = document.querySelector('.fab'), cover = document.getElementById('top');
  var links = [].slice.call(document.querySelectorAll('.navlinks a'));
  var secs = links.map(function(a){ return document.querySelector(a.getAttribute('href')); });
  var ticking=false;
  function onScroll(){
    var h = document.documentElement, max = h.scrollHeight - h.clientHeight, y = h.scrollTop || document.body.scrollTop;
    if(prog) prog.style.transform = 'scaleX(' + (max>0 ? y/max : 0) + ')';
    if(fab && cover) fab.classList.toggle('hide', y < cover.offsetHeight*0.7);
    var cur = -1;
    secs.forEach(function(s,i){ if(s && s.getBoundingClientRect().top < 120) cur = i; });
    links.forEach(function(a,i){ a.classList.toggle('on', i===cur); });
    if(cur>=0){ var a=links[cur], nl=a.parentNode; if(a.offsetLeft < nl.scrollLeft || a.offsetLeft+a.offsetWidth > nl.scrollLeft+nl.clientWidth) nl.scrollLeft = a.offsetLeft-24; }
    ticking=false;
  }
  window.addEventListener('scroll', function(){ if(!ticking){ ticking=true; requestAnimationFrame(onScroll);} }, {passive:true});
  onScroll();

  /* Threads filters */
  document.querySelectorAll('.filters').forEach(function(f){
    var target = document.querySelector(f.getAttribute('data-target'));
    f.addEventListener('click', function(e){
      var b = e.target.closest('button'); if(!b) return;
      f.querySelectorAll('button').forEach(function(x){ x.setAttribute('aria-pressed', x===b ? 'true':'false'); });
      var c = b.getAttribute('data-cat');
      target.querySelectorAll('[data-cat]').forEach(function(it){ it.hidden = !(c==='all' || it.getAttribute('data-cat')===c); });
    });
  });

  /* lightbox */
  var lb = document.getElementById('lb');
  if(!lb) return;
  var stage = lb.querySelector('.lb-stage'), ttl = lb.querySelector('.lb-top b'), open = lb.querySelector('.lb-open');
  function close(){ lb.hidden = true; stage.innerHTML=''; document.body.style.overflow=''; }
  lb.addEventListener('click', function(e){ if(e.target===lb || e.target.closest('.lb-x')) close(); });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape' && !lb.hidden) close(); });
  document.addEventListener('click', function(e){
    var a = e.target.closest('[data-kind]');
    if(!a) return;
    var k = a.getAttribute('data-kind'), src = a.getAttribute('data-src');
    if(k!=='img' && !EMBED) return;          /* artifact/viewer without embeds: follow the link */
    e.preventDefault();
    stage.className = 'lb-stage' + (k==='img' ? ' img':'');
    if(k==='yt') stage.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/'+src+'?autoplay=1&rel=0&playsinline=1" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
    else if(k==='drive') stage.innerHTML = '<iframe src="https://drive.google.com/file/d/'+src+'/preview" allow="autoplay; fullscreen" allowfullscreen></iframe>';
    else if(k==='mp4') stage.innerHTML = '<video src="'+src+'" controls autoplay playsinline'+(a.getAttribute('data-poster')?' poster="'+a.getAttribute('data-poster')+'"':'')+'></video>';
    else if(k==='img'){ var im = a.querySelector('img'); stage.innerHTML = '<img alt="" src="'+(im?im.src:src)+'">'; }
    ttl.textContent = a.getAttribute('data-title') || '';
    var href = a.getAttribute('href');
    if(href && href.charAt(0)!=='#' && k!=='img'){ open.href = href; open.hidden=false; } else open.hidden = true;
    lb.hidden = false; document.body.style.overflow='hidden';
  });
})();
