from pathlib import Path
from html.parser import HTMLParser
from collections import Counter
import hashlib, json, re, sys
import tinycss2

ROOT = Path(__file__).resolve().parent
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
SOURCE = next(ROOT.parent.glob('01*.html'))
raw = SOURCE.read_text(encoding='utf-8')

class Node:
    def __init__(self, tag='', attrs=None, parent=None, line=0):
        self.tag, self.attrs, self.parent, self.line = tag, dict(attrs or []), parent, line
        self.children = []
    def has(self, cls): return cls in self.attrs.get('class', '').split()
    def descendants(self):
        for child in self.children:
            if isinstance(child, Node):
                yield child
                yield from child.descendants()
    def text(self):
        return re.sub(r'\s+', ' ', ''.join(c.text() if isinstance(c, Node) else c for c in self.children)).strip()
    def find(self, tag): return next((n for n in self.descendants() if n.tag == tag), None)

class Parser(HTMLParser):
    VOID = set('area base br col embed hr img input link meta param source track wbr'.split())
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node('root')
        self.stack = [self.root]
        self.nodes = []
    def handle_starttag(self, tag, attrs):
        n = Node(tag, attrs, self.stack[-1], self.getpos()[0])
        self.stack[-1].children.append(n)
        self.nodes.append(n)
        if tag not in self.VOID: self.stack.append(n)
    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in self.VOID: self.handle_endtag(tag)
    def handle_endtag(self, tag):
        for i in range(len(self.stack)-1, 0, -1):
            if self.stack[i].tag == tag:
                del self.stack[i:]
                break
    def handle_data(self, data): self.stack[-1].children.append(data)

p = Parser(); p.feed(raw)
nodes = p.nodes
byid = {n.attrs['id']:n for n in nodes if 'id' in n.attrs}
css = '\n'.join(n.text() for n in nodes if n.tag == 'style')
scripts = [n.text() for n in nodes if n.tag == 'script']
imgs = [n for n in nodes if n.tag == 'img']
links = [n for n in nodes if n.tag == 'a']
data_images = re.findall(r'data:image/[^;"\']+;base64,[A-Za-z0-9+/=]+',raw)
ids = Counter(n.attrs['id'] for n in nodes if 'id' in n.attrs)
all_external = [n.attrs.get('href','') for n in links if n.attrs.get('href','').startswith(('https://','http://'))]
appendix = [n for n in byid['links'].descendants() if n.tag == 'a' and n.attrs.get('href','').startswith('http')]
sections = []
for n in nodes:
    if n.tag == 'section' and (n.has('chap') or n.has('toc') or n.has('cover')):
        h = n.find('h2') or n.find('h1') or n.find('h3')
        ds = list(n.descendants())
        sections.append({'id':n.attrs.get('id'), 'title':h.text() if h else '', 'line':n.line,
            'nodes':len(ds), 'images':sum(x.tag=='img' for x in ds), 'articles':sum(x.tag=='article' for x in ds),
            'tables':sum(x.tag=='table' for x in ds), 'links':sum(x.tag=='a' for x in ds),
            'details':[{'summary':(x.find('summary').text() if x.find('summary') else ''),'line':x.line,'open':'open' in x.attrs} for x in ds if x.tag=='details'],
            'subheads':[{'tag':x.tag,'text':x.text(),'id':x.attrs.get('id'),'line':x.line} for x in ds if x.tag=='h3'],
            'classes':dict(Counter(c for x in ds for c in x.attrs.get('class','').split()).most_common(12))})

filters=[]
for n in nodes:
    if n.has('filters'):
        target=n.attrs.get('data-target','').lstrip('#'); t=byid.get(target)
        filters.append({'line':n.line,'target':target,
            'buttons':[{'text':x.text(),'category':x.attrs.get('data-cat'),'pressed':x.attrs.get('aria-pressed')} for x in n.descendants() if x.tag=='button'],
            'items':dict(Counter(x.attrs['data-cat'] for x in t.descendants() if 'data-cat' in x.attrs)) if t else {},
            'target_tags':dict(Counter((x.tag+':'+x.attrs.get('class','')) for x in t.descendants() if 'data-cat' in x.attrs)) if t else {}})

keyframes=[]
for rule in tinycss2.parse_stylesheet(css,skip_whitespace=True,skip_comments=True):
    if rule.type=='at-rule' and rule.lower_at_keyword=='keyframes':
        name=tinycss2.serialize(rule.prelude).strip()
        steps=[]
        for sub in tinycss2.parse_rule_list(rule.content,skip_whitespace=True,skip_comments=True):
            if sub.type!='qualified-rule': continue
            declarations={d.lower_name:tinycss2.serialize(d.value).strip() for d in tinycss2.parse_declaration_list(sub.content,skip_whitespace=True,skip_comments=True) if d.type=='declaration'}
            steps.append({'offset':tinycss2.serialize(sub.prelude).strip(),'declarations':declarations})
        keyframes.append({'name':name,'steps':steps})

classes=lambda name:[n for n in nodes if n.has(name)]
inventory={
    'source':str(SOURCE), 'sha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
    'bytes':SOURCE.stat().st_size, 'lines':len(raw.splitlines()), 'nodes':len(nodes),
    'tags':dict(Counter(n.tag for n in nodes)),
    'css_bytes':len(re.search(r'<style>(.*?)</style>',raw,re.S).group(1).encode('utf-8')),
    'js_bytes':sum(len(s.encode('utf-8')) for s in re.findall(r'<script[^>]*>(.*?)</script>',raw,re.S)),
    'image_data_uri_bytes':sum(len(x.encode('ascii')) for x in data_images),
    'images':{'total':len(imgs),'inline':sum(n.attrs.get('src','').startswith('data:') for n in imgs),'lazy':sum(n.attrs.get('loading')=='lazy' for n in imgs),'async':sum(n.attrs.get('decoding')=='async' for n in imgs),'missing_alt':sum('alt' not in n.attrs for n in imgs)},
    'links':{'all':len(links),'external_occurrences':len(all_external),'unique_external':len(set(all_external)), 'appendix_entries':len(appendix),'appendix_unique':len({n.attrs['href'] for n in appendix}),
        'broken_fragments':[{'href':n.attrs['href'],'text':n.text(),'line':n.line} for n in links if n.attrs.get('href','').startswith('#') and n.attrs['href']!='#' and n.attrs['href'][1:] not in byid]},
    'duplicate_ids':{k:v for k,v in ids.items() if v>1},
    'stylesheets':[n.attrs for n in nodes if n.tag=='link'],
    'external_scripts':[n.attrs for n in nodes if n.tag=='script' and 'src' in n.attrs],
    'sections':sections, 'filters':filters,
    'media_kinds':dict(Counter(n.attrs['data-kind'] for n in nodes if 'data-kind' in n.attrs)),
    'role_buttons':[{'tag':n.tag,'line':n.line,'label':n.attrs.get('data-title')} for n in nodes if n.attrs.get('role')=='button'],
    'count_targets':len([n for n in nodes if 'data-count' in n.attrs]),
    'keyframe_count':len(keyframes),'keyframes':keyframes,
    'reel':{'scenes':[{'class':n.attrs.get('class'),'text':n.text(),'nodes':len(list(n.descendants()))} for n in classes('sc') if n.parent and n.parent.has('reel')],
        's5_cells':sum(isinstance(n,Node) for n in classes('s5-grid')[0].children),
        's6_points':sum(n.tag=='i' for n in classes('s6-sph')[0].descendants()),
        's4_orbit_points':sum(n.has('pt') for n in classes('s4-orb')[0].descendants()),
        's3_rows':[n.text() for n in classes('s3-row')]},
    'checks':{'no_focus_method':'.focus(' not in raw,'keydown_lines':[i for i,l in enumerate(raw.splitlines(),1) if 'keydown' in l],
        'hidden_css_lines':[i for i,l in enumerate(raw.splitlines(),1) if '[hidden]' in l],
        'uses_intersection_observer':'IntersectionObserver' in raw,
        'has_theme_control':bool(re.search(r'(setAttribute\([\'\"]data-theme|dataset\.theme)',raw))}
}
(ROOT/'source_inventory.json').write_text(json.dumps(inventory,ensure_ascii=False,indent=2),encoding='utf-8')
compact={k:v for k,v in inventory.items() if k not in ['keyframes','role_buttons','stylesheets']}
print(json.dumps(compact,ensure_ascii=False,indent=2))
