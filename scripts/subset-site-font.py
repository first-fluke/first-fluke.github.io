"""Generate a licensed, renamed variable font for the site's public copy.

Run from the repository root after installing fonttools[woff].
System fonts provide fallback for characters not present in the original font.
"""

import json
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont


ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2"
DESTINATION = ROOT / "public/fonts/first-fluke-sans.woff2"

characters = set(chr(code) for code in range(0x20, 0x7F))
for directory in ("lib", "components/site"):
    for path in (ROOT / directory).rglob("*.ts*"):
        characters.update(path.read_text())

font = TTFont(SOURCE)
original_codepoints = set(font.getBestCmap())
options = subset.Options()
options.flavor = "woff2"
options.hinting = False
options.layout_features = ["*"]
options.name_IDs = ["*"]
subsetter = subset.Subsetter(options=options)
subsetter.populate(unicodes={ord(character) for character in characters})
subsetter.subset(font)

# Modified OFL fonts must not use the reserved original font family name.
names = {1: "First Fluke Sans", 3: "FirstFlukeSans-Variable", 4: "First Fluke Sans",
         6: "FirstFlukeSans-Variable", 16: "First Fluke Sans", 25: "FirstFlukeSans"}
for record in font["name"].names:
    if record.nameID in names:
        record.string = names[record.nameID].encode(record.getEncoding())

font.flavor = "woff2"
font.save(DESTINATION)
coverage = {
    "included": sorted(font.getBestCmap()),
    "unsupported": sorted({ord(character) for character in characters} - original_codepoints),
}
(ROOT / "lib/site-font-codepoints.json").write_text(json.dumps(coverage, separators=(",", ":")) + "\n")
print(f"{DESTINATION.relative_to(ROOT)}: {DESTINATION.stat().st_size:,} bytes")
