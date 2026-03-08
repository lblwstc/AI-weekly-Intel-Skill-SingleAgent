#!/usr/bin/env python3

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path


REQUIRED = [
    "data/ai_updates.json",
    "content/weekly_ai_brief.md",
    "webapp/package.json",
    "README.md",
]


def fail(message: str) -> int:
    print(f"[FAIL] {message}")
    return 1


def ffprobe_specs(video_path: Path) -> dict[str, str]:
    result = subprocess.run(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "stream=width,height,codec_name",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1",
            str(video_path),
        ],
        capture_output=True,
        text=True,
        check=True,
    )
    data = {}
    for line in result.stdout.splitlines():
        if "=" in line:
            key, value = line.split("=", 1)
            data.setdefault(key, value)
    return data


def main() -> int:
    if len(sys.argv) != 2:
        return fail("usage: validate_weekly_intel.py <project-root>")

    root = Path(sys.argv[1]).expanduser().resolve()
    if not root.exists():
        return fail(f"project root not found: {root}")

    for rel_path in REQUIRED:
        if not (root / rel_path).exists():
            return fail(f"missing required file: {rel_path}")

    updates = json.loads((root / "data/ai_updates.json").read_text())
    items = updates.get("items", [])
    if len(items) < 5:
        return fail("dataset has fewer than 5 updates")

    demo_dir = root / "demo"
    videos = sorted(demo_dir.glob("*.mp4"))
    if not videos:
        return fail("no MP4 demo video found in demo/")

    print(f"[OK] Required files present under {root}")
    print(f"[OK] Dataset items: {len(items)}")

    for video in videos:
        specs = ffprobe_specs(video)
        print(
            f"[OK] Video: {video.name} | "
            f"{specs.get('width', '?')}x{specs.get('height', '?')} | "
            f"{specs.get('duration', '?')}s"
        )

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
