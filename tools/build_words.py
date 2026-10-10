#!/usr/bin/env python3
"""Build src/words.json for 점심 방송 from the per-episode vocabulary lists (source/epNN.vocab.tsv, gitignored).

Only words, glosses and counts leave source/ — never dialogue. A word belongs to the first episode ("교시") that uses it;
f = its count there, and the most frequent become that period's 핵심 (key) words. Names are excluded twice: the
extractors were told to leave them out, and NAMES below catches any that slipped through.
"""
import csv, json, pathlib, re, collections
ROOT = pathlib.Path(__file__).resolve().parents[1]
NAMES = {'소라', '해나', '재인', '태람', '이슬', '아영', '제일여고', '제일여자고등학교', '미래학원', '소라해나', '작불', '봉원고', '우해나'}
SKIP = {'다음 화에 계속'}
eps = sorted(ROOT.glob('source/ep*.vocab.tsv'))
words = {}
for ai, p in enumerate(eps):
    for r in csv.DictReader(open(p, encoding='utf-8'), delimiter='\t'):
        w = (r.get('lemma') or '').strip()
        if not w or w in NAMES or w in SKIP or not re.search('[가-힣]', w) or 'song lyric' in (r.get('note') or ''):  # lyrics may quote a real song
            continue
        n = int(re.sub(r'\D', '', r.get('count') or '') or 1)
        if w in words:
            continue          # first episode wins
        pos = (r.get('pos') or '').strip()
        g = re.sub(r'\s*\([^)]*[가-힣][^)]*\)', '', r.get('gloss') or '')             # English only: Korean cues can quote the episode
        g = '; '.join(x.strip() for x in g.split(';') if x.strip() and not re.search('[가-힣]', x))
        words[w] = {'w': w, 'g': g, 'pos': pos, 'cat': 'gram' if pos == 'grammar' else 'word',
                    'deck': 'webtoon', 'note': '', 'area': ai, 'f': n}   # notes can quote the episode: they stay in source/
out = {'areas': [{'id': f'p{i+1}', 'ko': f'{i+1}교시', 'en': f'Period {i+1}'} for i in range(len(eps))],
       'words': sorted(words.values(), key=lambda d: (d['area'], -d['f'], d['w'])), 'hanja': {}, 'species_ok': []}
(ROOT / 'src/words.json').write_text(json.dumps(out, ensure_ascii=False, indent=0), encoding='utf-8')
c = collections.Counter((d['area'], d['cat']) for d in words.values())
print(f"{len(words)} words from {len(eps)} episodes:", dict(sorted(c.items())))
