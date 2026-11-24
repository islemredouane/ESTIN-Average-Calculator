"""Render ESTIN Average Calculator README images with headless Edge/Chrome using CDP.

Ensures Google Fonts (Space Grotesk) and Framer Motion / Three.js animations
fully settle before taking 2x retina screenshots.

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


async def capture_cdp(url: str, out_png: Path, width: int, height: int, mobile: bool = False, wait_sec: int = 4):
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

            async with websockets.connect(ws_url, max_size=25*1024*1024) as ws:
                await ws.send(json.dumps({
                    'id': 1, 'method': 'Emulation.setDeviceMetricsOverride',
                    'params': {'width': width, 'height': height, 'deviceScaleFactor': 2, 'mobile': mobile}
                }))
                await ws.recv()

                await ws.send(json.dumps({
                    'id': 2, 'method': 'Page.navigate', 'params': {'url': url}
                }))
                await ws.recv()

                # Wait for web fonts (Space Grotesk) to load and animations to settle
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
            print(f"  [+] Captured: {out_png.name} ({width}x{height}) [font & animation settled]")
        finally:
            proc.terminate()
            proc.wait()


def convert_webp(src_png: Path, out_webp: Path, target_width: int = 1760, quality: int = 95) -> None:
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
    print("Using official website font: Space Grotesk")
    print("=" * 60)

    SHOTS.mkdir(parents=True, exist_ok=True)
    OUT.mkdir(parents=True, exist_ok=True)

    # 1. Start local server to render HTML cards
    print("\n1. Starting local server for card rendering...")
    httpd = start_server()
    time.sleep(1)

    try:
        # Render banner card with Space Grotesk font settling
        print("\n2. Rendering banner with Space Grotesk...")
        asyncio.run(capture_cdp(f"http://127.0.0.1:{PORT}/banner.html", SHOTS / "banner.png", 1280, 440, wait_sec=4))
        convert_webp(SHOTS / "banner.png", OUT / "banner.webp", target_width=1760, quality=95)

        # Render stats card
        print("\n3. Rendering stats with Space Grotesk...")
        asyncio.run(capture_cdp(f"http://127.0.0.1:{PORT}/stats.html", SHOTS / "stats.png", 1280, 300, wait_sec=3))
        convert_webp(SHOTS / "stats.png", OUT / "stats.webp", target_width=1760, quality=95)

        # Cleanup shots directory
        for p in [SHOTS / "banner.png", SHOTS / "stats.png"]:
            if p.exists():
                p.unlink()

    finally:
        httpd.shutdown()

    print("\n" + "=" * 60)
    print("Asset generation complete!")
    print("=" * 60)


if __name__ == "__main__":
    main()
