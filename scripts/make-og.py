"""Render the social preview images (Open Graph / Twitter cards), 1200x630.

Usage: python scripts/make-og.py

Each card is scripts/og/card.html filled with parameters and rendered at 1200x630 with
headless Chrome/Edge, then saved as public/og/<name>.png and public/og.png.
"""
import os
import shutil
import subprocess
import tempfile
from pathlib import Path
from urllib.parse import urlencode
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
TEMPLATE = ROOT / "scripts" / "og" / "card.html"
OUT = ROOT / "public" / "og"

CARDS = {
    "default": {
        "title": "Average Calculator",
        "eyebrow": "OFFICIAL GRADING ENGINE · 2026/27",
        "line": "Instant, offline, and 100% accurate semester average and ECTS credits calculation based on official ESTIN grading formulas.",
        "stat": "15.42",
        "semester": "1cp",
    },
    "1cp": {
        "title": "1CP Preparatory Year",
        "eyebrow": "ESTIN BÉJAÏA · 1CP S1 & S2",
        "line": "Calculate ALSDS, ARCH 1, SYST 1, ANA 1, ALG 1, and ELECT averages with official module coefficients.",
        "stat": "16.20",
        "semester": "1cp",
    },
    "2cp": {
        "title": "2CP Preparatory Year",
        "eyebrow": "ESTIN BÉJAÏA · 2CP S1 & S2",
        "line": "Calculate SFSD, ARCH 2, ELECT 2, ANA 3, ALG 3, PROBA, POO, and SINF averages with official unit weights.",
        "stat": "15.80",
        "semester": "2cp",
    },
    "1cs": {
        "title": "1CS Common Core",
        "eyebrow": "ESTIN BÉJAÏA · 1CS S1 & S2",
        "line": "Calculate OS, Networking, Databases, Software Engineering, AI, and Cybersecurity module averages.",
        "stat": "15.10",
        "semester": "1cs",
    },
    "2cs": {
        "title": "2CS Specializations",
        "eyebrow": "ESTIN BÉJAÏA · AI & CYBER SECURITY",
        "line": "Advanced ECTS calculation for Artificial Intelligence & Data Science and Cyber Security tracks.",
        "stat": "16.50",
        "semester": "2csia",
    },
}

CANDIDATES = [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "google-chrome",
    "chromium",
]


def get_browser() -> str:
    for c in CANDIDATES:
        if os.path.exists(c) or shutil.which(c):
            return c
    raise RuntimeError("No Chrome or Edge browser found.")


def render_card(name: str, params: dict) -> Path:
    browser = get_browser()
    url = TEMPLATE.as_uri() + "?" + urlencode(params)

    with tempfile.TemporaryDirectory() as tmp:
        raw_png = Path(tmp) / "card.png"
        profile_dir = Path(tmp) / "profile"
        profile_dir.mkdir()

        cmd = [
            browser,
            "--headless=new",
            "--disable-gpu",
            "--hide-scrollbars",
            f"--user-data-dir={profile_dir}",
            "--window-size=1200,630",
            f"--screenshot={raw_png}",
            url,
        ]
        subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

        # Optimize PNG with PIL
        out_file = OUT / f"{name}.png"
        im = Image.open(raw_png).convert("RGB")
        im.save(out_file, "PNG", optimize=True)
        print(f"Generated {out_file.name} ({out_file.stat().st_size // 1024} KB)")

        # If default, also save to public/og.png and public/opengraph-image.png
        if name == "default":
            canonical_og = ROOT / "public" / "og.png"
            shutil.copyfile(out_file, canonical_og)
            print(f"Copied to public/og.png ({canonical_og.stat().st_size // 1024} KB)")

            next_og = ROOT / "public" / "opengraph-image.png"
            shutil.copyfile(out_file, next_og)
            print(f"Copied to public/opengraph-image.png ({next_og.stat().st_size // 1024} KB)")

        return out_file


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    print("Rendering Social Preview Open Graph Cards (1200x630)...")
    for name, params in CARDS.items():
        render_card(name, params)
    print("All OG cards rendered successfully!")


if __name__ == "__main__":
    main()
