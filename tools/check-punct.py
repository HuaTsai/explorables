#!/usr/bin/env python3
"""Find (or fix) half-width punctuation inside Chinese prose in the site's HTML.

Usage:
  python3 tools/check-punct.py          # list findings, exit 1 if any
  python3 tools/check-punct.py --fix    # rewrite files in place, then list what is left

What counts as prose: text nodes, the content / aria-label / alt / title /
placeholder attributes, and string literals inside <script>. Code is left alone:
<pre>, <style>, the inside of <code>, and anything that is not directly touching a Chinese
character (so "x, y", "1.1.1.1", ".L2", "{key: row}", "rbx(callee-saved)" and
dig-style ";;" lines stay as they are).

Rules (A = a CJK character or full-width punctuation):
  A,  or  ,A   -> ，        A:  or  :A  -> ：
  A;           -> ；        A?          -> ？        A!  -> ！
  A(...)  or  (...)A       -> （...）   (the pair moves together; a pair whose
                                        content holds a quote, or that looks like a
                                        call or expression such as rbx(...) or
                                        if (a < b), is left alone)
  a single ASCII space between A and the new full-width mark is dropped
  "." is never touched: too many code names (.L2, .eh_frame) sit next to Chinese.
"""
import re, sys, glob, os

CJK = '一-鿿㐀-䶿　-〿＀-￯'
A = f'[{CJK}]'
TRANS = {',': '，', ':': '：', ';': '；', '?': '？', '!': '！'}

SKIP = re.compile(r'<pre\b[^>]*>[\s\S]*?</pre>|<style\b[^>]*>[\s\S]*?</style>', re.I)
CODE = re.compile(r'<code\b[^>]*>[\s\S]*?</code>', re.I)
TAG = re.compile(r'<[^>]+>')
ATTR = re.compile(r'\b(content|aria-label|alt|title|placeholder)="([^"]*)"')
SCRIPT = re.compile(r'(<script\b[^>]*>)([\s\S]*?)(</script>)', re.I)


def fix_text(t):
    # Two-sided marks: comma and colon.
    t = re.sub(f'({A}) ?([,:]) ?', lambda m: m.group(1) + TRANS[m.group(2)], t)
    t = re.sub(f' ?([,:]) ?({A})', lambda m: TRANS[m.group(1)] + m.group(2), t)
    # One-sided marks: only after a Chinese character.
    t = re.sub(f'({A})([;?!]) ?', lambda m: m.group(1) + TRANS[m.group(2)], t)
    # Parentheses move as a pair, on one line, when either side touches Chinese
    # or (prose only) the content itself is Chinese.
    def paren(m):
        before, inner, after = m.group(1), m.group(2), m.group(3)
        if re.search(r'[\'"`]', inner):          # a string boundary inside: code, not prose
            return m.group(0)
        after_cjk = re.match(f' ?{A}', after)
        before_cjk = re.search(f'{A} ?$', before)
        looks_like_code = re.search(r'[\w$\])] ?$|[-+*/%<>=&|^!~] ?$', before)
        if before_cjk or (after_cjk and not looks_like_code):
            before = re.sub(r' $', '', before)
            after = re.sub(r'^ ', '', after)
            return f'{before}（{inner}）{after}'
        return m.group(0)
    t = re.sub(r'([^\n(]{0,12})\(((?:[^()\n]|\([^()\n]*\))*)\)([^\n)]{0,1})', paren, t)
    return t


def with_code_hidden(chunk, fn):
    # Inline <code>…</code> is replaced by an opaque placeholder while fn runs, so a
    # pair of parentheses that wraps a code span, like 物件(<code>xmm</code> spill),
    # is still seen as one pair touching Chinese. The code itself is never touched.
    codes = []
    def stash(m):
        codes.append(m.group(0))
        return f'\x01{len(codes) - 1}\x02'
    fixed = fn(CODE.sub(stash, chunk))
    return re.sub(r'\x01(\d+)\x02', lambda m: codes[int(m.group(1))], fixed)


def fix_prose(html):
    out, pos = [], 0
    for m in SKIP.finditer(html):
        out.append(with_code_hidden(html[pos:m.start()], fix_markup)); out.append(m.group(0)); pos = m.end()
    out.append(with_code_hidden(html[pos:], fix_markup))
    return ''.join(out)


def fix_markup(chunk):
    out, pos = [], 0
    for m in TAG.finditer(chunk):
        out.append(fix_text(chunk[pos:m.start()]))
        out.append(ATTR.sub(lambda a: f'{a.group(1)}="{fix_text(a.group(2))}"', m.group(0)))
        pos = m.end()
    out.append(fix_text(chunk[pos:]))
    return ''.join(out)


def fix_script(js):
    # Inside scripts, only the parts of string literals that touch Chinese are
    # prose. Embedded <code>…</code> markup is hidden the same way as in HTML.
    return with_code_hidden(js, fix_text)


def fix_html(html):
    out, pos = [], 0
    for m in SCRIPT.finditer(html):
        out.append(fix_prose(html[pos:m.start()]))
        out.append(m.group(1) + fix_script(m.group(2)) + m.group(3))
        pos = m.end()
    out.append(fix_prose(html[pos:]))
    return ''.join(out)


def findings(path, html):
    fixed = fix_html(html)
    if fixed == html:
        return []
    hits = []
    for n, (a, b) in enumerate(zip(html.split('\n'), fixed.split('\n')), 1):
        if a != b:
            hits.append((n, a.strip()[:110]))
    return hits


def main():
    fix = '--fix' in sys.argv
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    files = sorted(glob.glob(os.path.join(root, '**', '*.html'), recursive=True))
    total = 0
    for f in files:
        html = open(f, encoding='utf-8').read()
        if fix:
            fixed = fix_html(html)
            if fixed != html:
                open(f, 'w', encoding='utf-8').write(fixed)
                print(f'fixed {os.path.relpath(f, root)}')
            continue
        hits = findings(f, html)
        total += len(hits)
        for n, line in hits:
            print(f'{os.path.relpath(f, root)}:{n}: {line}')
    if fix:
        return main_check_after_fix(root)
    print(f'{total} line(s) with half-width punctuation in Chinese prose' if total else 'ok: no half-width punctuation in Chinese prose')
    return 1 if total else 0


def main_check_after_fix(root):
    sys.argv = [sys.argv[0]]
    return main()


if __name__ == '__main__':
    sys.exit(main())
