"""Download the chosen photos and save web-sized copies (runs on GitHub Actions).
Reads selected.json { key: {url, ...} } and writes public/photos/examples/<key>-1400.webp and <key>-640.webp."""
import io, json, os, urllib.request
from PIL import Image, ImageOps

HERE = os.path.dirname(__file__)
OUT = os.path.join(HERE, "..", "..", "public", "photos", "examples")
os.makedirs(OUT, exist_ok=True)
UA = "AlfaFindaPhotoBot/1.0 (https://finda.globalalfabet.com; hello@globalalfabet.com)"
sel = json.load(open(os.path.join(HERE, "selected.json")))
log = []
for key, p in sel.items():
    try:
        req = urllib.request.Request(p["url"], headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=60) as r:
            im = Image.open(io.BytesIO(r.read()))
        im = ImageOps.exif_transpose(im).convert("RGB")
        # crop to 3:2 around the centre (or the focus point given as fx, fy in 0..1)
        ratio = 3 / 2
        w, h = im.size
        fx, fy = p.get("fx", 0.5), p.get("fy", 0.5)
        if w / h > ratio:
            nw = int(h * ratio)
            l = int(min(max(fx * w - nw / 2, 0), w - nw))
            im = im.crop((l, 0, l + nw, h))
        else:
            nh = int(w / ratio)
            t = int(min(max(fy * h - nh / 2, 0), h - nh))
            im = im.crop((0, t, w, t + nh))
        for size in (1400, 640):
            cp = im.copy()
            if cp.width > size:
                cp = cp.resize((size, round(size / ratio)), Image.LANCZOS)
            cp.save(os.path.join(OUT, f"{key}-{size}.webp"), "WEBP", quality=70, method=6)
        log.append(f"ok {key} {w}x{h}")
    except Exception as e:  # noqa: BLE001
        log.append(f"FAILED {key}: {e}")
open(os.path.join(HERE, "out", "fetch-log.txt"), "w").write("\n".join(log))
print("\n".join(log))
