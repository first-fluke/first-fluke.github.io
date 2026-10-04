First Fluke Sans is a variable font derived from Pretendard 1.3.9 under the
SIL Open Font License. Its name is changed to respect Pretendard's reserved
font name. See OFL.txt for the original copyright and license.

The subset covers the public site copy in lib/ and components/site/. The
system fonts provide fallback for other characters and user-entered text.
Next.js fingerprints and preloads the primary font in production.

After changing site copy, regenerate the font and coverage file:

```sh
python3 -m venv /tmp/firstfluke-font-tools
/tmp/firstfluke-font-tools/bin/pip install 'fonttools[woff]==4.66.1'
/tmp/firstfluke-font-tools/bin/python scripts/subset-site-font.py
bun run build
bun run test:performance
```
