"""Screenshot the built site at desktop and phone widths, in light and dark mode.

Usage:
    python scripts/screenshot.py http://localhost:4173 /out/dir [path ...]

Needs Playwright for Python and a Chrome binary (CHROME_PATH, default /opt/google/chrome/chrome).
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

VIEWPORTS = {"desktop": (1440, 900), "phone": (390, 844)}


def main() -> int:
    base, out = sys.argv[1].rstrip("/"), Path(sys.argv[2])
    paths = sys.argv[3:] or ["/"]
    schemes = os.environ.get("SCHEMES", "light").split(",")
    full = os.environ.get("FULL", "1") == "1"
    out.mkdir(parents=True, exist_ok=True)
    chrome = os.environ.get("CHROME_PATH", "/opt/google/chrome/chrome")

    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=chrome, args=["--no-sandbox"])
        for scheme in schemes:
            for name, (w, h) in VIEWPORTS.items():
                ctx = browser.new_context(viewport={"width": w, "height": h}, color_scheme=scheme, device_scale_factor=1)
                page = ctx.new_page()
                errors: list[str] = []
                page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
                page.on("pageerror", lambda e: errors.append(str(e)))
                for path in paths:
                    page.goto(f"{base}{path}", wait_until="networkidle")
                    page.wait_for_timeout(2600)
                    if full:
                        # Scroll through once so scroll-triggered sections play, then return to the top.
                        height = page.evaluate("document.body.scrollHeight")
                        for y in range(0, height, h // 2):
                            page.evaluate(f"window.scrollTo(0, {y})")
                            page.wait_for_timeout(120)
                        page.wait_for_timeout(1400)
                        page.evaluate("window.scrollTo(0, 0)")
                        page.wait_for_timeout(300)
                    slug = path.strip("/").replace("/", "-") or "home"
                    target = out / f"{slug}-{name}-{scheme}.png"
                    page.screenshot(path=str(target), full_page=full)
                    print(target)
                for error in errors:
                    print(f"CONSOLE ERROR [{name} {scheme}]: {error}")
                ctx.close()
        browser.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
