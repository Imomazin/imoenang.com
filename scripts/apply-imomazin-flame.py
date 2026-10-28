#!/usr/bin/env python3
"""Apply the approved static flame to Imomazin website brand assets.

The entrance animation retains the original unlit asset to preserve ignition.
"""
from pathlib import Path
from io import BytesIO
import base64
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'assets'

original = Image.open(ASSETS / 'imomazin-dark.png').convert('RGBA')
patch = Image.open(ASSETS / 'imomazin-flame-patch.png').convert('RGBA')
assert original.size == (1672, 941), f'Unexpected original logo size: {original.size}'
assert patch.size == (137, 138), f'Unexpected flame patch size: {patch.size}'

flame_logo = original.copy()
flame_logo.paste(patch, (1097, 43))
flame_logo.save(ASSETS / 'imomazin-flame.png', optimize=True)
flame_logo.save(ASSETS / 'imomazin-logo.png', optimize=True)

# The square app icon keeps the flag, ascending figure and newly lit flame.
# A deep green canvas matches the existing Imomazin website identity.
cutout = flame_logo.crop((705, 18, 1265, 600))

def create_icon(size):
    canvas = Image.new('RGBA', (size, size), (5, 14, 10, 255))
    maxsize = int(size * .87)
    cut = cutout.copy()
    cut.thumbnail((maxsize, maxsize), Image.Resampling.LANCZOS)
    canvas.alpha_composite(cut, ((size - cut.width)//2, (size-cut.height)//2))
    return canvas

for size in (16, 32, 48, 96, 192, 512):
    create_icon(size).save(ASSETS / f'icon-{size}.png', optimize=True)

create_icon(96).save(ROOT / 'favicon.png', optimize=True)
create_icon(180).save(ASSETS / 'apple-touch-icon.png', optimize=True)
create_icon(256).save(ROOT / 'favicon.ico', sizes=[(16,16),(32,32),(48,48),(64,64),(128,128),(256,256)])

# Self-contained SVG icon; PNG/ICO remain fallbacks.
buffer = BytesIO()
create_icon(192).save(buffer, format='PNG', optimize=True)
encoded = base64.b64encode(buffer.getvalue()).decode('ascii')
(ROOT / 'favicon.svg').write_text(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">'
    '<title>Imomazin flame emblem</title>'
    '<image width="192" height="192" href="data:image/png;base64,' + encoded + '"/>'
    '</svg>', encoding='utf-8'
)
print('Generated flame-bearing logos, favicons and web app icons.')
