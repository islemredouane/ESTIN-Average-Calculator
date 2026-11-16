"""Render ESTIN Average Calculator README images with headless Edge/Chrome.

Usage:
    python scripts/render-readme-assets.py

Steps:
1. Captures live screenshots from https://estin-average-calculator.vercel.app:
   - Desktop homepage (1440x900 at 2x)
   - Mobile homepage (390x844 at 2x)
2. Renders .github/assets/src/{banner,stats,preview}.html at 2x with transparent background.
3. Generates optimized WebP assets in .github/assets/:
   - banner.webp (1760px wide)
   - stats.webp (1760px wide)
   - preview.webp (1760px wide)
"""
import http.server
import os
import shutil
import socketserver
import subprocess
import sys
import tempfile
import threading
import time
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / ".github" / "assets" / "src"
SHOTS = SRC / "shots"
OUT = ROOT / ".github" / "assets"
PORT = 5533
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


class AssetHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(SRC), **kwargs)

    def log_message(self, format, *args):
        pass


def start_server() -> socketserver.TCPServer:
    socketserver.TCPServer.allow_reuse_address = True
    httpd = socketserver.TCPServer(("127.0.0.1", PORT), AssetHandler)
    server_thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    server_thread.start()
    return httpd


def shoot(url: str, out: Path, width: int, height: int, transparent: bool = False, mobile: bool = False, delay_ms: int = 5000) -> None:
    out.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as profile:
        args = [
            find_browser(),
            "--headless=new",
            f"--user-data-dir={profile}",
            "--hide-scrollbars",
            "--force-device-scale-factor=2",
            f"--window-size={width},{height}",
            f"--virtual-time-budget={delay_ms}",
            f"--screenshot={str(out.resolve())}",
        ]
        if transparent:
            args.append("--default-background-color=00000000")
        if mobile:
            args.append(
                "--user-agent=Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) "
                "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
            )
        args.append(url)
        subprocess.run(args, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=120)
    print(f"  [+] Captured: {out.name} ({width}x{height})")


def convert_webp(src_png: Path, out_webp: Path, target_width: int = 1760, quality: int = 92) -> None:
    with Image.open(src_png) as img:
        w, h = img.size
        new_h = int(h * (target_width / w))
        resized = img.resize((target_width, new_h), Image.Resampling.LANCZOS)
        out_webp.parent.mkdir(parents=True, exist_ok=True)
        resized.save(out_webp, "WEBP", quality=quality, method=6)
    print(f"  [✦] Saved WebP: {out_webp.name} ({target_width}x{new_h}) [{out_webp.stat().st_size // 1024} KB]")


def main():
    print("=" * 60)
    print("ESTIN Average Calculator · README Asset Pipeline")
    print("=" * 60)

    SHOTS.mkdir(parents=True, exist_ok=True)
    OUT.mkdir(parents=True, exist_ok=True)

    # 1. Capture live screenshots
    print("\n1. Capturing live UI from Vercel...")
    shoot(LIVE_URL, SHOTS / "desktop.png", 1440, 900, delay_ms=6000)
    shoot(LIVE_URL, SHOTS / "mobile.png", 390, 844, mobile=True, delay_ms=6000)

    # 2. Start local server to render HTML cards
    print("\n2. Starting local server for card rendering...")
    httpd = start_server()
    time.sleep(1)

    try:
        cards = [
            ("banner.html", "banner.png", 1280, 440),
            ("stats.html", "stats.png", 1280, 300),
            ("preview.html", "preview.png", 1280, 740),
        ]

        print("\n3. Rendering cards via headless browser...")
        for html_name, png_name, w, h in cards:
            url = f"http://127.0.0.1:{PORT}/{html_name}"
            png_path = SHOTS / png_name
            shoot(url, png_path, w, h, transparent=True, delay_ms=3000)

        print("\n4. Converting to optimized WebP...")
        convert_webp(SHOTS / "banner.png", OUT / "banner.webp", target_width=1760, quality=94)
        convert_webp(SHOTS / "stats.png", OUT / "stats.webp", target_width=1760, quality=94)
        convert_webp(SHOTS / "preview.png", OUT / "preview.webp", target_width=1760, quality=94)

    finally:
        httpd.shutdown()

    print("\n" + "=" * 60)
    print("Asset generation complete!")
    print("=" * 60)


if __name__ == "__main__":
    main()
