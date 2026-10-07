from pathlib import Path
import re
p=Path(__file__).parent
h=(p/'index.html').read_text(encoding='utf-8')
start=h.index('      <div class="hero-main">')
end=h.index('      <div class="hero-bottom">',start)
h=h[:start]+'''      <h1 id="hero-title" class="sr-only">NEXT K-CORE AI CONNECT</h1>
      <div class="motion-stage"><iframe id="heroMotion" src="hero-motion/index.html?play=1" title="AI CONNECT: 타이포그래피와 앞으로 걷는 사람들" tabindex="-1"></iframe></div>
      <div class="hero-caption"><h2 data-subtitle>AI로 이어진 사람들</h2><p>작품을 보고, 만드는 과정을 배우고,<br>함께할 사람을 만나는 이틀.</p><a class="hero-link" href="#program">우리의 이틀 살펴보기 ↓</a></div>
      <div class="motion-chapters" role="group" aria-label="헤더 장면 선택"><button data-motion-time="1.8">01 CONNECT</button><button data-motion-time="6.5">02 AI × HUMAN</button><button data-motion-time="11.5">03 BETWEEN</button><button data-motion-time="17.5">04 TOGETHER</button><button data-motion-time="22.5">05 NEXT</button></div>
'''+h[end:]
h=re.sub(r'    <section class="type-lab".*?</section>\s*','',h,flags=re.S)
(p/'index.html').write_text(h,encoding='utf-8')
a=(p/'app.js').read_text(encoding='utf-8')
a=a.replace("if (EVENT.subtitle === 'AI로 이어진 사람들') subtitle.innerHTML = 'AI로 이어진<br>사람들';\n  else subtitle.textContent = EVENT.subtitle;", "subtitle.textContent = EVENT.subtitle;")
a=a.replace("const paused=document.body.classList.toggle('motion-paused');", "const paused=document.body.classList.toggle('motion-paused');$('#heroMotion').contentWindow.postMessage({type:'motion-pause',paused},'*');")
a=a.replace("  const navLinks=", "  $$('[data-motion-time]').forEach(button=>button.addEventListener('click',()=>$('#heroMotion').contentWindow.postMessage({type:'motion-seek',time:Number(button.dataset.motionTime)},'*')));\n  if(matchMedia('(prefers-reduced-motion: reduce)').matches){document.body.classList.add('motion-paused');motionButton.setAttribute('aria-pressed','true');motionButton.setAttribute('aria-label','애니메이션 재생');motionButton.innerHTML='▶ <span>모션 재생</span>';}\n  const navLinks=")
(p/'app.js').write_text(a,encoding='utf-8')
