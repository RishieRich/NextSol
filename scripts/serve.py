"""Serve the static export locally, the way a static host would.

Usage:
    python scripts/serve.py [port] [directory]      (defaults: 4173, ui/frontend/out)

Python's `python -m http.server` keeps a listen backlog of 5, so a page that asks for many images at
once (the emoji) gets some connections refused, mostly on Windows. This uses the same standard-library
server with a deeper backlog. `/about` redirects to `/about/` as `trailingSlash: true` expects.
"""

from __future__ import annotations

import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


class Server(ThreadingHTTPServer):
    request_queue_size = 256
    daemon_threads = True


class Handler(SimpleHTTPRequestHandler):
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        ".webp": "image/webp",
        ".txt": "text/plain; charset=utf-8",
        ".js": "text/javascript",
        ".webmanifest": "application/manifest+json",
    }

    def send_error(self, code: int, message: str | None = None, explain: str | None = None) -> None:
        """Serve the site's own 404 page, as a static host does."""
        page = Path(self.directory) / "404.html"
        if code != 404 or not page.exists():
            super().send_error(code, message, explain)
            return
        body = page.read_bytes()
        self.send_response(404)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)

    def log_message(self, format: str, *args) -> None:  # noqa: A002 - signature from the base class
        if args and str(args[1]).startswith(("4", "5")):
            super().log_message(format, *args)


def main() -> None:
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 4173
    root = Path(sys.argv[2]) if len(sys.argv) > 2 else Path(__file__).resolve().parent.parent / "ui" / "frontend" / "out"
    if not (root / "index.html").exists():
        raise SystemExit(f"No build at {root}. Run: npm --prefix ui/frontend run build")
    with Server(("127.0.0.1", port), partial(Handler, directory=str(root))) as httpd:
        print(f"Serving {root} at http://localhost:{port}/", flush=True)
        httpd.serve_forever()


if __name__ == "__main__":
    main()
