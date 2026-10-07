from pathlib import Path
p=Path(__file__).parent
s=(p/'layout.template').read_text(encoding='utf-8').replace('../assets/','assets/').replace('<div class="clip" data-start=', '<div id="kinetic-stage" class="clip" data-start=')
s=s.replace('<script src="motion.js"></script>', '<script>\n'+(p/'motion.js').read_text(encoding='utf-8')+'\n</script>')
(p/'index.html').write_text(s,encoding='utf-8')
