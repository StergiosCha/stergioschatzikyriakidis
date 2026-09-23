"""Publish a curated, static edition of the existing CLARIN workshop document.

Usage: python scripts/prepare_clarin_materials.py /path/to/clarin_summer_school_2026
Only the listed teaching files are copied. No app or provider requests are made.
"""
from pathlib import Path
import hashlib
import json
import re
import shutil
import sys
import zipfile

SITE = Path(__file__).resolve().parents[1]
WORKSHOP = Path(sys.argv[1]).expanduser().resolve()
OUT = SITE / 'app/public/teaching/clarin-2026'
OUT.mkdir(parents=True, exist_ok=True)
# Editable slide sources stay in the local workshop folder.
for path in list(OUT.rglob('*.tex')) + [OUT / 'slide_sources.zip']:
    path.unlink(missing_ok=True)

original = (WORKSHOP / 'hands_on_live.html').read_text()
pattern = r'(<script id="workshop-data" type="application/json">)(.*?)(</script>)'
match = re.search(pattern, original, re.S)
assert match, 'The workshop data block is missing.'
data = json.loads(match[2])
assert len(data['modules']) == 11 and len(data['dialect']) == 4

public_notes = (WORKSHOP / 'worked_examples.md').read_text()
assert 'US$15' not in public_notes and 'preparation_guide' not in public_notes
(OUT / 'worked_examples.md').write_text(public_notes)

# The day-of checklist, private overview and presenter cue sheet stay local.
data.pop('preparation', None)
data['notes'] = {m['id']: data['notes'][m['id']] for m in data['modules']}
for name in ['preparation_guide.md', 'hands_on_notes.md']:
    data['assets'].pop(name, None)
# These internal templates were removed from the workshop library on request.
for name in ['05_zero_shot_algorithm.txt', '06_mosaic_enhanced.txt',
             '07_verification_correction.txt', '08_rag_generic_examples.txt',
             '09_mosaic_phonetic_insertion.txt']:
    data['assets'].pop('rhyme_identification_prompts/' + name, None)
data['assets']['worked_examples.md'] = public_notes
# Retain source file/line citations without publishing machine-local hyperlinks.
data['assets']['rhyme_identification_prompts.md'] = re.sub(
    r'\[([^\]]+)\]\(/Users/[^/]+/Dropbox/([^)]+)\)',
    lambda m: m[1] + ' (source: `' + m[2] + '`)',
    data['assets']['rhyme_identification_prompts.md'])
data['publicEdition'] = True
pdf_versions = {name: hashlib.sha256((WORKSHOP / name).read_bytes()).hexdigest()[:12]
                for name in ['clarin_talk.pdf', 'hands_on_slides.pdf', 'detector_visuals.pdf']}

script = re.search(r'<script>(.*?)</script>', original, re.S)[1]
script = re.sub(r'<button[^>]+data-action="(?:preparation|cues)"[^>]*>.*?</button>', '', script)
script = re.sub(r'^  if\(a===\'(?:preparation|cues)\'\).*?\n', '', script, flags=re.M)
script = script.replace('Complete instructor chapter, including', 'Complete worked example, including')
script = script.replace(' / complete instructor chapter', ' / complete worked example')
script = script.replace('<p class="funding">', '<p><a class="text-button" href="index.html">Workshop overview, slides and downloads ↗</a></p><p class="funding">')
library = '''function library(){modal('The complete material library',`<p>Read, copy or download the complete texts, prompts, saved outputs and explanations. Source credits and unresolved checks are retained.</p><div class="actions"><a class="button secondary small" href="index.html#downloads">Slides and downloads ↗</a></div><label for="asset-filter" class="eyebrow">Find a file</label><input id="asset-filter" class="search-input" placeholder="Prompt, query, graph, response…"><div id="asset-list" class="library-list">${Object.keys(D.assets).sort().map(libraryRow).join('')}</div><details><summary>Download the teaching material</summary>${[['clarin_talk.pdf','Talk slides (PDF)'],['hands_on_slides.pdf','Hands-on slides (PDF)'],['detector_visuals.pdf','Detector diagrams (PDF)'],['worked_examples.md','Complete worked examples (Markdown)'],['workshop_bundle.zip','Offline workshop bundle']].map(([f,label])=>`<p>${external(f,label,'text-button')}</p>`).join('')}</details>`);}
'''
script = re.sub(r'function library\(\)\{.*?\n(?=function normalize)', lambda _: library, script, flags=re.S)
for name, version in pdf_versions.items():
    script = script.replace("['" + name + "',", "['" + name + '?v=' + version + "',")

encoded = json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('<', '\\u003c').replace('&', '\\u0026')
result = re.sub(pattern, lambda m: m[1] + encoded + m[3], original, flags=re.S)
result = re.sub(r'<script>.*?</script>', lambda _: '<script>' + script + '</script>', result, count=1, flags=re.S)
result = result.replace('<title>Read. Propose. Verify. | CLARIN:EL</title>', '<title>Interactive workshop | AI Applications for Language Analysis | CLARIN:EL</title>')
result = result.replace('<span>Language Technology &amp; AI for Digital Humanities</span>', '<a href="index.html">Workshop materials</a>')
result = result.replace('<span>Language Technology & AI for Digital Humanities</span>', '<a href="index.html">Workshop materials</a>')
result = result.replace('The PDF and Markdown notes in the workshop folder provide the same source material.', 'Download the slides and worked examples from the workshop materials page.')
assert 'preparation_guide' not in result and 'data-action="preparation"' not in result
assert 'data-action="cues"' not in result and 'US$15' not in result
assert '\u2014' not in result and '/Users/' not in result
assert not re.search(r'(?:sk-(?:proj-|ant-)?[A-Za-z0-9_-]{24,}|AIza[A-Za-z0-9_-]{30,}|AQ\.[A-Za-z0-9_-]{30,})', result)
(OUT / 'demo.html').write_text(result)
versions = {**pdf_versions, 'demo.html': hashlib.sha256(result.encode()).hexdigest()[:12]}
# Version the archive link from its teaching inputs, avoiding a self-hash cycle.
versions['workshop_bundle.zip'] = hashlib.sha256(''.join(versions.values()).encode()).hexdigest()[:12]
landing = (OUT / 'index.html').read_text()
for name, version in versions.items():
    landing = re.sub(r'href="' + re.escape(name) + r'(?:\?v=[^"#]*)?(#[^"]*)?"',
                     lambda m: 'href="' + name + '?v=' + version + (m[1] or '') + '"', landing)
(OUT / 'index.html').write_text(landing)

files = ['clarin_talk.pdf', 'hands_on_slides.pdf', 'detector_visuals.pdf', 'funding_acknowledgment.md', 'references.bib']
files += [str(p.relative_to(WORKSHOP)) for p in sorted((WORKSHOP / 'fonts').iterdir()) if p.suffix in ['.ttf', '.otf'] or 'LICENSE' in p.name]
files += ['zeugma_materials/' + kind + '_graph.pdf' for kind in ['short', 'focus', 'full']]
files += re.findall(r'!\[[^\]]*\]\(([^)]+)\)', public_notes)
for name in sorted(set(files)):
    source = (WORKSHOP / name).resolve()
    assert source.is_relative_to(WORKSHOP) and source.is_file(), name
    destination = OUT / name
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(source, destination)

readme = '''# AI Applications for Language Analysis

Stergios Chatzikyriakidis, ILSP. CLARIN:EL Summer School, 24 September 2026.

Open index.html for the workshop page, or demo.html for the interactive material.
The demonstration works offline. External app and source links need internet.
Each activity includes exact inputs, prompts, saved responses and detailed explanations.
Use the existing apps for fresh analyses; their usual access and provider requirements apply.

The talk and hands-on slides are available as PDFs. The talk, hands-on slides and interactive workshop were updated on 23 September.
detector_visuals.pdf contains three larger diagrams explaining perplexity,
conditional probability curvature and supervised classifier fine-tuning.
The worked_examples.md file contains the complete example explanations and source credits.
The interactive demonstration includes Northern and Cypriot generations recorded
on 21 September. Saved analyses retain their original dates and source credits.

Source texts and font licences retain the credits and terms stated with them.
Funding from Microsoft's LINGUA project supported CoDAG (Computational Dialectal Atlas
of Greek), making Svarna, GPT-4.1 fine-tuning and the Greek NLP Swiss Knife possible.

Public material: https://stergioschatzikyriakidis.org/teaching/clarin-2026/
'''
(OUT / 'README.md').write_text(readme)
assert (OUT / 'index.html').exists(), 'Create the workshop landing page first.'
assert not list(OUT.rglob('*.tex')) and not (OUT / 'slide_sources.zip').exists()
with zipfile.ZipFile(OUT / 'workshop_bundle.zip', 'w', zipfile.ZIP_DEFLATED) as archive:
    for path in sorted(OUT.rglob('*')):
        if path.is_file() and path.name not in ['workshop_bundle.zip', 'manifest.json']:
            archive.write(path, str(path.relative_to(OUT)))
manifest = {'edition': '2026-09-23', 'activities': 11, 'dialect_generations': 4,
            'private_checklist_included': False,
            'demo_sha256': hashlib.sha256((OUT / 'demo.html').read_bytes()).hexdigest(),
            'files': {str(p.relative_to(OUT)): p.stat().st_size for p in sorted(OUT.rglob('*')) if p.is_file() and p.name != 'manifest.json'}}
(OUT / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
print(json.dumps({'output': str(OUT), 'files': len(manifest['files']), 'demo_bytes': len(result.encode())}, indent=2))
