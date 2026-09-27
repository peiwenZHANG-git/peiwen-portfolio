"""
The Chinese web font for 中 / EN (components/lang.tsx), 2026-09-25.

Source: design-assets/fonts/LXGWWenKaiGB-Regular.ttf — LXGW WenKai GB by lxgw,
SIL Open Font License 1.1 (https://github.com/lxgw/LxgwWenkaiGB). The full font is
~25 MB, so this cuts it down to exactly the characters the site's Chinese text uses:
every CJK character / full-width punctuation found in app/, components/ and lib/,
plus basic Latin, digits and common punctuation for the English words and numbers
inside Chinese sentences. Output: public/fonts/lxgw-wenkai-subset.woff.

Re-run after adding or changing Chinese text (a missing character would fall back to
the system font):   python scripts/prepare-zh-font.py      (needs fonttools)
"""
import pathlib
import re
from fontTools import subset

SRC = "design-assets/fonts/LXGWWenKaiGB-Regular.ttf"
OUT = "public/fonts/lxgw-wenkai-subset.woff"

cjk = re.compile(r"[　-〿㐀-䶿一-鿿＀-￯‘-”—…·]")
chars = set()
for folder in ("app", "components", "lib"):
    for path in pathlib.Path(folder).rglob("*"):
        if path.suffix in {".ts", ".tsx"}:
            chars.update(cjk.findall(path.read_text(encoding="utf-8")))
chars.update(chr(c) for c in range(0x20, 0x7F))  # Latin, digits, punctuation
chars.update("–—‘’“”…·→←↑↓↗↳×")

opts = subset.Options()
opts.flavor = "woff"
opts.layout_features = ["*"]
opts.name_IDs = ["*"]
opts.notdef_outline = True
font = subset.load_font(SRC, opts)
sub = subset.Subsetter(opts)
sub.populate(text="".join(sorted(chars)))
sub.subset(font)
pathlib.Path(OUT).parent.mkdir(parents=True, exist_ok=True)
subset.save_font(font, OUT, opts)
print(f"{len(chars)} characters -> {OUT} ({pathlib.Path(OUT).stat().st_size // 1024} KB)")
