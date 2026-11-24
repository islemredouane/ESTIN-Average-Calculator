"""Render ESTIN Average Calculator README images with headless Edge/Chrome.

Ensures Google Fonts (Space Grotesk) and animations settle, and applies a 4x
supersampled rounded alpha mask so that corners outside the card radius are
100% transparent (no white triangles).

Usage:
    python scripts/render-readme-assets.py
"""
import asyncio
import base64
import json
import shutil
import subprocess
import sys
import tempfile
import urllib.request
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / ".github" / "assets" / "src"
SHOTS = SRC / "shots"
OUT = ROOT / ".github" / "assets"
LIVE_URL = "https://estin-average-calculator.vercel.app"

CANDIDATES = [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "google-chrome",
    "chromium",
]


def find_browser() -> str:
    for c in CANDIDATES:
        if Path(c).exists() or shutil.which(c):
            return c
    sys.exit("No Chrome or Edge binary found.")


def render_card_with_transparent_corners(
    html_name: str,
    out_webp_name: str,
    width: int,
    height: int,
    target_width: int = 1760,
    radius_px: int = 33,
    quality: int = 95,
) -> None:
    browser = find_browser()
    url = (SRC / html_name).resolve().as_uri()

    with tempfile.TemporaryDirectory() as profile:
        raw_png = Path(profile) / "raw.png"
        args = [
            browser,
            "--headless=new",
            f"--user-data-dir={profile}",
            "--hide-scrollbars",
            "--force-device-scale-factor=2",
            f"--window-size={width},{height}",
            "--default-background-color=00000000",
            f"--screenshot={raw_png}",
            url,
        ]
        subprocess.run(args, check=True)

        with Image.open(raw_png).convert("RGBA") as img:
            w, h = img.size
            new_h = int(h * (target_width / w))
            resized = img.resize((target_width, new_h), Image.Resampling.LANCZOS)

            if radius_px > 0:
                # 4x supersampled rounded mask for buttery-smooth transparent corners
                scale = 4
                big_mask = Image.new("L", (target_width * scale, new_h * scale), 0)
                draw = ImageDraw.Draw(big_mask)
                draw.rounded_rectangle(
                    [(0, 0), (target_width * scale - 1, new_h * scale - 1)],
                    radius=int(radius_px * scale),
                    fill=255,
                )
                smooth_mask = big_mask.resize((target_width, new_h), Image.Resampling.LANCZOS)
                resized.putalpha(smooth_mask)

            out_path = OUT / out_webp_name
            out_path.parent.mkdir(parents=True, exist_ok=True)
            resized.save(out_path, "WEBP", quality=quality, method=6)
            print(f"  [✦] Saved Transparent WebP: {out_webp_name} ({target_width}x{new_h}) [{out_path.stat().st_size // 1024} KB]")


def main():
    print("=" * 60)
    print("ESTIN Average Calculator · README Asset Pipeline")
    print("Font: Space Grotesk · Corners: 100% Transparent")
    print("=" * 60)

    SHOTS.mkdir(parents=True, exist_ok=True)
    OUT.mkdir(parents=True, exist_ok=True)

    print("\n1. Rendering banner card with Space Grotesk & transparent corners...")
    render_card_with_transparent_corners("banner.html", "banner.webp", 1280, 440, radius_px=33)

    print("\n2. Rendering stats card with Space Grotesk & transparent corners...")
    render_card_with_transparent_corners("stats.html", "stats.webp", 1280, 300, radius_px=33)

    print("\n" + "=" * 60)
    print("Asset generation complete!")
    print("=" * 60)


if __name__ == "__main__":
    main()
