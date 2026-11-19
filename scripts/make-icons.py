"""Generate the PWA and site icons for ESTIN Average Calculator.

Uses headless Chromium to render app/icon.svg at 1024x1024 (executing all SVG filters
and glows with pixel precision), then uses Pillow to produce:
  - public/icons/icon-192.png       (192x192, standard PWA)
  - public/icons/icon-512.png       (512x512, standard PWA)
  - public/icons/maskable-512.png   (512x512, with safe margin for Android adaptive icons)
  - public/icons/apple-touch-icon.png (180x180, iOS home screen)
  - public/icons/favicon-16.png     (16x16)
  - public/icons/favicon-32.png     (32x32)
  - public/icons/favicon-48.png     (48x48)
  - public/icons/favicon-96.png     (96x96)
  - public/favicon.ico              (Multi-size 16/32/48 ICO)
  - public/favicon.png              (Updated 192x192)
"""
import os
import shutil
import subprocess
import tempfile
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
SVG_PATH = ROOT / "app" / "icon.svg"
OUT = ROOT / "public" / "icons"
BG_HEX = "#030712"
BG_COLOR = (3, 7, 18, 255)

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


def render_svg_to_png(svg_path: Path, output_png: Path, size: int = 1024) -> None:
    """Renders the SVG at a large canvas size via headless browser."""
    browser = get_browser()
    html_content = f"""<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  html, body {{ width: {size}px; height: {size}px; background: transparent; overflow: hidden; display: flex; align-items: center; justify-content: center; }}
  img {{ width: {size}px; height: {size}px; }}
</style>
</head>
<body>
  <img src="{svg_path.as_uri()}" />
</body>
</html>"""

    with tempfile.TemporaryDirectory() as tmp:
        html_file = Path(tmp) / "render.html"
        html_file.write_text(html_content, encoding="utf-8")
        profile_dir = Path(tmp) / "profile"
        profile_dir.mkdir()

        cmd = [
            browser,
            "--headless=new",
            "--disable-gpu",
            "--hide-scrollbars",
            "--default-background-color=00000000",
            f"--user-data-dir={profile_dir}",
            f"--window-size={size},{size}",
            f"--screenshot={output_png}",
            html_file.as_uri(),
        ]
        subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def create_icons(master_png: Path) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    master = Image.open(master_png).convert("RGBA")

    # 1. Standard PWA Icons (192, 512) on transparent background
    for sz in [192, 512]:
        icon = master.resize((sz, sz), Image.LANCZOS)
        p = OUT / f"icon-{sz}.png"
        icon.save(p, "PNG", optimize=True)
        print(f"Generated {p.name}: {sz}x{sz} ({p.stat().st_size // 1024} KB)")

    # 2. Maskable 512x512 icon (centered within the 80% safe zone with dark background)
    maskable = Image.new("RGBA", (512, 512), BG_COLOR)
    safe_size = int(512 * 0.76)
    scaled_master = master.resize((safe_size, safe_size), Image.LANCZOS)
    offset = ((512 - safe_size) // 2, (512 - safe_size) // 2)
    maskable.alpha_composite(scaled_master, offset)
    maskable_path = OUT / "maskable-512.png"
    maskable.convert("RGB").save(maskable_path, "PNG", optimize=True)
    print(f"Generated maskable-512.png: 512x512 ({maskable_path.stat().st_size // 1024} KB)")

    # 3. Apple Touch Icon (180x180) with dark background
    apple = Image.new("RGBA", (180, 180), BG_COLOR)
    apple_size = int(180 * 0.82)
    scaled_apple = master.resize((apple_size, apple_size), Image.LANCZOS)
    apple_offset = ((180 - apple_size) // 2, (180 - apple_size) // 2)
    apple.alpha_composite(scaled_apple, apple_offset)
    apple_path = OUT / "apple-touch-icon.png"
    apple.convert("RGB").save(apple_path, "PNG", optimize=True)
    print(f"Generated apple-touch-icon.png: 180x180 ({apple_path.stat().st_size // 1024} KB)")

    # 4. Small Favicons (16, 32, 48, 96)
    for sz in [16, 32, 48, 96]:
        fav = master.resize((sz, sz), Image.LANCZOS)
        p = OUT / f"favicon-{sz}.png"
        fav.save(p, "PNG", optimize=True)
        print(f"Generated {p.name}: {sz}x{sz}")

    # 5. Root favicon.ico (multi-res 16, 32, 48)
    ico_path = ROOT / "public" / "favicon.ico"
    ico_img = master.resize((48, 48), Image.LANCZOS)
    ico_img.save(
        ico_path,
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)],
    )
    print(f"Generated public/favicon.ico ({ico_path.stat().st_size // 1024} KB)")

    # 6. Update public/favicon.png with crisp 192px
    fav_png = ROOT / "public" / "favicon.png"
    master.resize((192, 192), Image.LANCZOS).save(fav_png, "PNG", optimize=True)
    print("Updated public/favicon.png")


def main() -> None:
    with tempfile.TemporaryDirectory() as tmp:
        master_png = Path(tmp) / "master-1024.png"
        print(f"Rendering {SVG_PATH} at 1024x1024 via {get_browser()}...")
        render_svg_to_png(SVG_PATH, master_png, 1024)
        print("Generating PWA and web icons...")
        create_icons(master_png)
        print("All icons successfully generated!")


if __name__ == "__main__":
    main()
