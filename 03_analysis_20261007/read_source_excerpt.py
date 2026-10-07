from pathlib import Path
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
path = Path(sys.argv[1])
start, end = int(sys.argv[2]), int(sys.argv[3])
lines = path.read_text(encoding='utf-8').splitlines()
for n in range(start-1, min(end, len(lines))):
    text = re.sub(r'data:image/[^\s"\'<>]+', '[IMAGE]', lines[n])
    print(f'{n+1}: {text}')
