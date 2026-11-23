"""Render product images + hero poster with headless Chrome.
Usage: python tools/render-images.py   (from the project root)"""
import base64, http.server, json, os, re, subprocess, threading, functools, html, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = 4174

class Quiet(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map, ".js": "text/javascript", ".mjs": "text/javascript"}
    def log_message(self, *a): pass

srv = http.server.ThreadingHTTPServer(("127.0.0.1", PORT), functools.partial(Quiet, directory=ROOT))
threading.Thread(target=srv.serve_forever, daemon=True).start()
only = sys.argv[1] if len(sys.argv) > 1 else ""
url = f"http://127.0.0.1:{PORT}/tools/render.html" + (f"?only={only}" if only else "")
prof = os.path.join(os.environ.get("TEMP", "."), "chem-render-profile")
dom = subprocess.run([CHROME, "--headless=new", "--use-angle=swiftshader", "--enable-unsafe-swiftshader",
    "--ignore-gpu-blocklist", f"--user-data-dir={prof}", "--virtual-time-budget=120000", "--dump-dom", url],
    capture_output=True, text=True, encoding="utf-8", timeout=600).stdout
srv.shutdown()
m = re.search(r'<pre id="out">(.*?)</pre>', dom, re.S)
data = json.loads(html.unescape(m.group(1))) if m and m.group(1) else {}
if not data or "error" in data:
    print("RENDER FAILED:", data.get("error", dom[-1500:])); sys.exit(1)
os.makedirs(os.path.join(ROOT, "public", "images", "products"), exist_ok=True)
for key, durl in data.items():
    path = os.path.join(ROOT, "public", "images", "hero-3d.webp" if key == "hero" else f"products/{key}.webp")
    with open(path, "wb") as f:
        f.write(base64.b64decode(durl.split(",", 1)[1]))
    print("saved", os.path.relpath(path, ROOT), os.path.getsize(path) // 1024, "KB")
