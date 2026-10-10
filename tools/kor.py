"""Shared Korean helpers for the build scripts: dictionary forms of the words in a text (Kiwi), and the later-game names
that must not appear before Pewter City."""
import re
from kiwipiepy import Kiwi

# Things from later in the game (names as they appear in the 2024 Korean translation)
LATER = []          # (점심 방송 has no later-content names to block: only free episodes are used)
LATER_TOKENS = set()          # single-syllable names: only as whole tokens


def lemmatizer(user_words):
    """→ lemmas(text): the dictionary forms in text. user_words are kept whole (Kiwi otherwise splits names)."""
    kiwi = Kiwi()
    for w in user_words:
        if re.fullmatch('[가-힣]{2,}', w):
            kiwi.add_user_word(w, 'NNP', score=3)

    def lemmas(text):
        out, toks, i = set(), kiwi.tokenize(text), 0
        while i < len(toks):
            t, n = toks[i], toks[i + 1] if i + 1 < len(toks) else None
            if t.tag in ('NNG', 'XR', 'NNP') and n is not None and n.tag in ('XSV', 'XSA'):
                out.add(t.form + n.form + '다'); i += 2; continue
            if t.tag.startswith(('VV', 'VA', 'VX')):
                out.add(t.form + '다')
            elif t.tag in ('NNG', 'NNP', 'NNB', 'NR', 'NP', 'MAG', 'MAJ', 'MM', 'XR', 'IC'):
                out.add(t.form)
            i += 1
        return out
    return lemmas


def eojeol_key(eoj):
    """a space-separated word as written, without surrounding punctuation"""
    return re.sub(r'^[^가-힣]+|[^가-힣]+$', '', eoj)
