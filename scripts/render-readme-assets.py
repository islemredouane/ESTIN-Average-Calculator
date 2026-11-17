"""Render ESTIN Average Calculator README images with headless Edge/Chrome.

Usage:
    python scripts/render-readme-assets.py
"""
import asyncio
import base64
import http.server
import json
import os
import shutil
import socketserver
import subprocess
import sys
import tempfile
import threading
import time
import urllib.request
from pathlib import Path
from PIL import Image
import websockets

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / ".github" / "assets" / "src"
SHOTS = SRC / "shots"
OUT = ROOT / ".github" / "assets"
PORT = 5533
DEBUG_PORT = 9228
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


async def capture_cdp(url: str, out_png: Path, width: int, height: int, mobile: bool = False, wait_sec: int = 6):
    browser = find_browser()
    with tempfile.TemporaryDirectory() as profile:
        proc = subprocess.Popen([
            browser, '--headless=new', f'--user-data-dir={profile}',
            f'--remote-debugging-port={DEBUG_PORT}',
            f'--window-size={width},{height}',
            'about:blank'
        ])
        await asyncio.sleep(1.5)
        try:
            res = urllib.request.urlopen(f'http://127.0.0.1:{DEBUG_PORT}/json/list')
            pages = json.loads(res.read())
            page = next(p for p in pages if p.get('type') == 'page')
            ws_url = page['webSocketDebuggerUrl']

            async with websockets.connect(ws_url, max_size=20*1024*1024) as ws:
                if mobile:
                    await ws.send(json.dumps({
                        'id': 1, 'method': 'Emulation.setDeviceMetricsOverride',
                        'params': {'width': width, 'height': height, 'deviceScaleFactor': 2, 'mobile': True}
                    }))
                    await ws.recv()
                else:
                    await ws.send(json.dumps({
                        'id': 1, 'method': 'Emulation.setDeviceMetricsOverride',
                        'params': {'width': width, 'height': height, 'deviceScaleFactor': 2, 'mobile': False}
                    }))
                    await ws.recv()

                await ws.send(json.dumps({
                    'id': 2, 'method': 'Page.navigate', 'params': {'url': url}
                }))
                await ws.recv()

                print(f"  [⏳] Waiting {wait_sec}s for full Framer Motion & Three.js animations ({width}x{height})...")
                await asyncio.sleep(wait_sec)

                await ws.send(json.dumps({'id': 3, 'method': 'Page.captureScreenshot', 'params': {'format': 'png'}}))
                while True:
                    msg = json.loads(await ws.recv())
                    if msg.get('id') == 3:
                        data = base64.b64decode(msg['result']['data'])
                        out_png.parent.mkdir(parents=True, exist_ok=True)
                        with open(out_png, 'wb') as f:
                            f.write(data)
                        break
            print(f"  [+] Captured: {out_png.name} ({width}x{height})")
        finally:
            proc.terminate()
            proc.wait()


def shoot_card(url: str, out: Path, width: int, height: int) -> None:
    out.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as profile:
        args = [
            find_browser(),
            "--headless=new",
            f"--user-data-dir={profile}",
            "--hide-scrollbars",
            "--force-device-scale-factor=2",
            f"--window-size={width},{height}",
            "--default-background-color=00000000",
            f"--screenshot={str(out.resolve())}",
            url
        ]
        subprocess.run(args, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=60)
    print(f"  [+] Card rendered: {out.name} ({width}x{height})")


def convert_webp(src_png: Path, out_webp: Path, target_width: int = 1760, quality: int = 94) -> None:
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

    # 1. Capture live UI screenshots with full animation settling
    print("\n1. Capturing live UI from Vercel (waiting for full hero content)...")
    asyncio.run(capture_cdp(LIVE_URL, SHOTS / "desktop.png", 1440, 900, mobile=False, wait_sec=6))
    asyncio.run(capture_cdp(LIVE_URL, SHOTS / "mobile.png", 390, 844, mobile=True, wait_sec=6))

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
            shoot_card(url, SHOTS / png_name, w, h)

        print("\n4. Converting to optimized WebP...")
        convert_webp(SHOTS / "banner.png", OUT / "banner.webp", target_width=1760, quality=94)
        convert_webp(SHOTS / "stats.png", OUT / "stats.webp", target_width=1760, quality=94)
        convert_webp(SHOTS / "preview.png", OUT / "preview.webp", target_width=1760, quality=94)

        # Remove unneeded intermediate PNGs
        for p in [SHOTS / "banner.png", SHOTS / "stats.png", SHOTS / "preview.png"]:
            if p.exists():
                p.unlink()

    finally:
        httpd.shutdown()

    print("\n" + "=" * 60)
    print("Asset generation complete!")
    print("=" * 60)


if __name__ == "__main__":
    main()
