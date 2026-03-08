#!/usr/bin/env python3

from __future__ import annotations

import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


FONT_PATH = "/System/Library/Fonts/Hiragino Sans GB.ttc"
IMAGE_WIDTH = 1920
IMAGE_HEIGHT = 220
CARD_X = 140
CARD_Y = 18
CARD_W = 1640
CARD_H = 170
TEXT_BOX_W = 1480


def fit_font(text: str) -> ImageFont.FreeTypeFont:
    for size in range(42, 27, -1):
        font = ImageFont.truetype(FONT_PATH, size)
        scratch = Image.new("RGBA", (IMAGE_WIDTH, IMAGE_HEIGHT), (0, 0, 0, 0))
        draw = ImageDraw.Draw(scratch)
        left, top, right, bottom = draw.multiline_textbbox(
            (0, 0),
            text,
            font=font,
            spacing=10,
            align="center",
            stroke_width=2,
        )
        if right - left <= TEXT_BOX_W and bottom - top <= 118:
            return font

    return ImageFont.truetype(FONT_PATH, 28)


def render_card(text: str, out_path: Path) -> None:
    image = Image.new("RGBA", (IMAGE_WIDTH, IMAGE_HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)

    draw.rounded_rectangle(
      (CARD_X, CARD_Y, CARD_X + CARD_W, CARD_Y + CARD_H),
      radius=34,
      fill=(7, 16, 28, 190),
      outline=(130, 217, 255, 125),
      width=2,
    )

    font = fit_font(text)
    left, top, right, bottom = draw.multiline_textbbox(
        (0, 0),
        text,
        font=font,
        spacing=10,
        align="center",
        stroke_width=2,
    )
    text_w = right - left
    text_h = bottom - top
    x = (IMAGE_WIDTH - text_w) / 2
    y = CARD_Y + (CARD_H - text_h) / 2 - top

    draw.multiline_text(
        (x, y),
        text,
        font=font,
        fill=(255, 255, 255, 255),
        spacing=10,
        align="center",
        stroke_width=2,
        stroke_fill=(0, 0, 0, 170),
    )
    image.save(out_path)


def main() -> int:
    if len(sys.argv) != 3:
        print("usage: render_subtitle_cards.py <segments.json> <out_dir>", file=sys.stderr)
        return 1

    segments_path = Path(sys.argv[1])
    out_dir = Path(sys.argv[2])
    out_dir.mkdir(parents=True, exist_ok=True)

    segments = json.loads(segments_path.read_text())
    for segment in segments:
        render_card(segment["japanese"], out_dir / f"{segment['id']}.png")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
