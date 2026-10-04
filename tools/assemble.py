#!/usr/bin/env python3
"""Assemble src/data.json = src/words.json + the original example sentences in tools/sentences/out-*.json (방과 후).

Every sentence is checked: it must use its word (as Kiwi reads it, or the word/stem written in it), stay short, and
name nothing from after Pewter City (later names, Pokémon outside species_ok). Failures are listed and left out.
Usage: python3 tools/assemble.py
"""
import collections, glob, json, pathlib, re, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from kor import LATER, LATER_TOKENS, lemmatizer, eojeol_key

ROOT = pathlib.Path(__file__).resolve().parents[1]
WJ = json.loads((ROOT / 'src/words.json').read_text(encoding='utf-8'))
W = {d['w']: d for d in WJ['words']}
sent = {}
for p in sorted(glob.glob(str(ROOT / 'tools/sentences/out-*.json'))):
    sent.update(json.loads(pathlib.Path(p).read_text(encoding='utf-8')))

# Pokémon names that must not appear (every species Moneo knows, minus the ones met by Pewter)
MONEO = pathlib.Path('/nonexistent')  # no species list in this game
species = {e['korean'].strip() for e in json.loads(MONEO.read_text(encoding='utf-8'))['entries']} if MONEO.exists() else set()
later_species = {s for s in species - set(WJ['species_ok']) if len(s) >= 2}

lemmas = lemmatizer(W)

GRAM_HINT = {'-(으)시-': ['시', '셨', '세', '십'], '-대': ['대', '래'], '-아/어지다': ['져', '졌', '지']}
CONTRACT = {'주': ['줘', '줬', '줄', '준', '줍'], '하': ['해', '했', '할', '한'], '되': ['돼', '됐', '될', '된'], '보': ['봐', '봤', '볼', '본'],
            '오': ['와', '왔', '올', '온'], '가': ['갔', '갈', '간'], '두': ['둬', '뒀', '둘', '둔'], '있': ['있'], '않': ['않']}

def gram_core(w, s):
    """the part of sentence s that realises grammar pattern w (-잖아 → 잖아, -(으)ㄹ게 → 게, -아/어 주다 → 주), or None"""
    alts = re.sub(r'^[-~]|N|~', '', w).split('/')
    best = None
    for alt in alts:
        c = re.sub(r'\([^)]*\)', '', alt)            # drop optional bits: (으), (이)
        c = re.sub(r'[ㄱ-ㅎㅏ-ㅣ\s-]', '', c)          # drop bare jamo, spaces, dashes
        c = re.sub(r'다$', '', c) if w.startswith('-') and len(c) > 1 else c   # -아/어 주다 → 주; N보다 keeps 다
        for n in range(len(c), 0, -1):              # longest piece of the pattern that the sentence really contains
            for i in range(len(c) - n + 1):
                piece = c[i:i + n]
                for v in [piece] + [piece[:-1] + x for x in CONTRACT.get(piece[-1], [])]:   # 주 → 줘, 하 → 해 …
                    if re.search("[가-힣]", v) and v in s and (best is None or len(v) >= len(best)):   # ties: the later piece (the auxiliary)
                        best = v
            if best and len(best) >= n:
                break
    if best is None:   # patterns that are only a final consonant (-(으)ㅁ 없음, -(으)ㄹ 할, -(으)ㄴ 간): a syllable with that 받침
        JONG = {'ㄴ': 4, 'ㄹ': 8, 'ㅁ': 16}
        j = re.findall(r'\(으\)(ㄴ|ㄹ|ㅁ)$', w.split('/')[0].strip())
        if j:
            for ch in s:
                if '가' <= ch <= '힣' and (ord(ch) - 0xAC00) % 28 == JONG[j[0]]:
                    best = ch
    if best is None:
        for alt in GRAM_HINT.get(w, []):
            if alt in s:
                best = alt; break
    return best

problems, lines, seen = collections.defaultdict(list), [], set()
for w, d in W.items():
    for s in sent.get(w, []):
        s = s.strip()
        flat, hang = s.replace(' ', ''), len(re.findall('[가-힣]', s))
        lem = lemmas(s)
        stem = w[:-1] if w.endswith('다') else w
        # Kiwi misses some conjugations (아는 → 알다, 계세요 → 계시다): then a word starting like the stem will do
        gc = gram_core(w, s) if d['cat'] == 'gram' else None
        if d['cat'] == 'gram' and not gc:
            problems['grammar pattern not found'].append((w, s)); continue
        if d['cat'] != 'gram' and not (w in lem or stem in s or any(eojeol_key(e).startswith(stem[0]) for e in s.split())):
            problems['word not found'].append((w, s)); continue
        if not 5 <= hang <= 40 or re.search('[A-Za-z一-鿿]', s):
            problems['length / non-Hangul'].append((w, s)); continue
        bad = [x for x in LATER if x in flat and x != w] + sorted(LATER_TOKENS & lem) + [x for x in later_species if x != w and (x in lem or any(eojeol_key(e).startswith(x) for e in s.split()))]
        if bad:
            problems['later-game name ' + '/'.join(bad)].append((w, s)); continue
        if s in seen:
            continue
        seen.add(s)
        lines.append({'t': s, 'a': d['area'], 'for': w, **({'gc': gc} if gc else {})})
    if not sent.get(w):
        problems['no sentences'].append((w, ''))

# tap-a-word: every word as written → dictionary form(s); a line's own word is always findable in it
tap = {}
for l in lines:
    for eoj in l['t'].split():
        k = eojeol_key(eoj)
        if k and k not in tap:
            tap[k] = sorted(lemmas(k) | ({k} if k in W else set()), key=lambda x: -len(x))[:3]
for l in lines:
    if l.get('gc'):
        k = next((eojeol_key(e) for e in l['t'].split() if l['gc'] in e), None)
        if k:
            tap[k] = [l['for']] + [x for x in tap.get(k, []) if x != l['for']][:2]
        continue
    w = l['for']
    keys = [eojeol_key(e) for e in l['t'].split()]
    if not any(w in tap.get(k, []) for k in keys):
        stem = w[:-1] if w.endswith('다') else w
        k = next((k for k in keys if stem in k), None) or next((k for k in keys if k.startswith(stem[0])), None)
        if k:
            tap[k] = [w] + [x for x in tap[k] if x != w][:2]

# example lines per word: its own sentences first, then other sentences that use it
ex = collections.defaultdict(list)
for i, l in enumerate(lines):
    ex[l['for']].append(i)
for i, l in enumerate(lines):
    for k in {eojeol_key(e) for e in l['t'].split()}:
        for x in tap.get(k, []):
            if x in W and x != l['for'] and i not in ex[x]:
                ex[x].append(i)
words = []
for w, d in W.items():
    if ex.get(w):
        words.append({**d, 'ex': ex[w][:12]})

out = {'areas': WJ['areas'], 'words': words, 'lines': [{'t': l['t'], 'a': l['a'], **({'gc': l['gc'], 'g': l['for']} if l.get('gc') else {})} for l in lines],
       'hanja': WJ['hanja'], 'tap': tap}
(ROOT / 'src/data.json').write_text(json.dumps(out, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
print(f"{len(lines)} sentences for {len(words)}/{len(W)} words · per area", dict(sorted(collections.Counter(l['a'] for l in lines).items())))
for why, xs in problems.items():
    print(f'  {why}: {len(xs)}', '; '.join(f'{w}: {s}' for w, s in xs[:8]))
