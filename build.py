#!/usr/bin/env python3
"""Assemble index.html from src/: shell + chapter registry + chapters (in order) + engine."""
import pathlib,re,sys
root=pathlib.Path(__file__).parent
shell=(root/'src/shell.html').read_text(encoding='utf-8')
chs=sorted((root/'src/chapters').glob('ch*.js'),key=lambda p:int(re.search(r'\d+',p.stem).group()))
if '--chapters' in sys.argv: # publish only finished chapters: --chapters ch1,ch3
    keep=sys.argv[sys.argv.index('--chapters')+1].split(',');chs=[p for p in chs if p.stem in keep]
import json
lexmap=json.loads((root/'src/lexicon-map.json').read_text(encoding='utf-8')) if (root/'src/lexicon-map.json').exists() else {}
defs_p=root/'lexicon/defs.json'
alldefs=json.loads(defs_p.read_text(encoding='utf-8')) if defs_p.exists() else {}
used={l for ls in lexmap.values() for l in ls}
lex={'map':{k:v for k,v in lexmap.items() if any(l in alldefs and alldefs[l] for l in v)},'defs':{l:d for l,d in alldefs.items() if l in used and d}}
parts=['<script>\n/* Tap-a-word dictionary: word as written → dictionary forms, and learner definitions (lexicon/). */\nwindow.LEX='+json.dumps(lex,ensure_ascii=False,separators=(',',':'))+';\n</script>',
 '<script>\n/* Chapters register themselves here; each keeps its own save. */\nconst CHAPTERS=[];\n</script>']
parts+=[f'<script>\n{p.read_text(encoding="utf-8")}</script>' for p in chs]
parts.append(f'<script>\n{(root/"src/engine.js").read_text(encoding="utf-8")}</script>')
out=pathlib.Path(sys.argv[sys.argv.index('--out')+1]) if '--out' in sys.argv else root/'index.html'
out.write_text(shell.replace('<!--SCRIPTS-->','\n'.join(parts)),encoding='utf-8')
print('built',out.name,'with',len(chs),'chapter(s)')
