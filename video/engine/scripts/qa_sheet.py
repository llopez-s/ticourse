#!/usr/bin/env python3
"""Contact sheets for qa-frames.mjs --sheet: the review stills of a folder, cols x rows per sheet.

    python qa_sheet.py --src video/<slug>/out/qa/all --out video/<slug>/out/qa/sheets [--cols 3 --rows 4]

Each still is scaled to one tile (--tile-width, height from the stills' aspect) under a label with
its file name; sheets are written as sheet01.jpg, sheet02.jpg, ... in file-name order (qa-frames
names stills f<frame>_..., so that is timeline order). Needs Pillow: exits with code 3 without it.
"""
import argparse
import glob
import os
import sys

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print(f"qa_sheet: Pillow is not installed for {sys.executable} (pip install pillow)", file=sys.stderr)
    sys.exit(3)

LABEL_H = 26
BG = (0, 0, 0)
FG = (255, 255, 0)


def label_font(size=16):
    try:
        return ImageFont.load_default(size=size)  # scalable since Pillow 10.1
    except TypeError:
        return ImageFont.load_default()


def make_sheets(files, out, cols=3, rows=4, tile_w=640):
    if not files:
        return []
    with Image.open(files[0]) as first:
        tile_h = round(tile_w * first.height / first.width)
    per = cols * rows
    font = label_font()
    os.makedirs(out, exist_ok=True)
    written = []
    for start in range(0, len(files), per):
        chunk = files[start:start + per]
        used_rows = -(-len(chunk) // cols)  # a short last sheet is only as tall as its rows
        sheet = Image.new("RGB", (tile_w * cols, (tile_h + LABEL_H) * used_rows), BG)
        draw = ImageDraw.Draw(sheet)
        for i, f in enumerate(chunk):
            x, y = (i % cols) * tile_w, (i // cols) * (tile_h + LABEL_H)
            with Image.open(f) as im:
                sheet.paste(im.convert("RGB").resize((tile_w, tile_h)), (x, y + LABEL_H))
            draw.text((x + 6, y + 4), os.path.splitext(os.path.basename(f))[0], fill=FG, font=font)
        name = os.path.join(out, f"sheet{start // per + 1:02d}.jpg")
        sheet.save(name, quality=85)
        written.append(name)
    return written


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--src", required=True, help="folder with the stills (*.jpeg / *.jpg)")
    ap.add_argument("--out", required=True, help="folder for sheetNN.jpg")
    ap.add_argument("--cols", type=int, default=3)
    ap.add_argument("--rows", type=int, default=4)
    ap.add_argument("--tile-width", type=int, default=640)
    args = ap.parse_args()
    files = sorted(f for ext in ("*.jpeg", "*.jpg") for f in glob.glob(os.path.join(args.src, ext)))
    for name in make_sheets(files, args.out, args.cols, args.rows, args.tile_width):
        print(name)
    print(f"qa_sheet: {len(files)} stills")


if __name__ == "__main__":
    main()
