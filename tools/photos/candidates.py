"""Find free-licensed photos per category (Openverse, then Wikimedia Commons) and draw a contact sheet per category.
Runs on GitHub Actions. Writes out/<category>.jpg and out/candidates.json."""
import io, json, os, re, time, urllib.parse, urllib.request
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(__file__)
OUT = os.path.join(HERE, "out")
os.makedirs(OUT, exist_ok=True)
QUERIES = json.load(open(os.path.join(HERE, "queries.json")))
UA = "AlfaFindaPhotoBot/1.0 (https://finda.globalalfabet.com; hello@globalalfabet.com)"
LOG = []


def get(url, timeout=25):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def openverse(q):
    url = "https://api.openverse.org/v1/images/?" + urllib.parse.urlencode({
        "q": q, "license": "cc0,by,by-sa", "page_size": 20, "mature": "false",
        "aspect_ratio": "wide", "size": "large", "category": "photograph"})
    data = json.loads(get(url))
    out = []
    for p in data.get("results", []):
        lic = p["license"].upper()
        lic = "CC0 1.0" if lic == "CC0" else f"CC {lic} {p.get('license_version') or ''}".strip()
        out.append({"src": p.get("source"), "id": p["id"], "q": q, "alt": p.get("title") or "",
                    "w": p.get("width"), "h": p.get("height"), "url": p["url"], "author": p.get("creator") or "",
                    "license": lic, "licenseUrl": p.get("license_url") or "", "page": p.get("foreign_landing_url") or ""})
    return out


def commons(q):
    url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode({
        "action": "query", "format": "json", "generator": "search", "gsrsearch": f"{q} filetype:bitmap",
        "gsrnamespace": 6, "gsrlimit": 20, "prop": "imageinfo", "iiprop": "url|size|extmetadata|mime", "iiurlwidth": 1600})
    data = json.loads(get(url))
    out = []
    for p in (data.get("query", {}).get("pages", {}) or {}).values():
        ii = (p.get("imageinfo") or [{}])[0]
        meta = ii.get("extmetadata", {})
        lic = (meta.get("LicenseShortName", {}).get("value") or "").strip()
        if not re.match(r"^(CC0|CC BY(-SA)? [0-9.]+|Public domain)", lic, re.I) or ii.get("mime") != "image/jpeg":
            continue
        if (ii.get("width") or 0) < 1400 or (ii.get("width") or 0) < (ii.get("height") or 0):
            continue
        artist = re.sub("<[^>]+>", "", meta.get("Artist", {}).get("value") or "").strip()
        out.append({"src": "wikimedia", "id": str(p["pageid"]), "q": q, "alt": p["title"].replace("File:", "").rsplit(".", 1)[0],
                    "w": ii.get("width"), "h": ii.get("height"), "url": ii.get("thumburl") or ii.get("url"),
                    "author": artist, "license": lic, "licenseUrl": meta.get("LicenseUrl", {}).get("value") or "",
                    "page": ii.get("descriptionurl") or ""})
    return out


font = ImageFont.load_default(size=18)
found = {}
for cat, queries in QUERIES.items():
    seen, items = set(), []
    for q in queries:
        got = []
        for fn in (openverse, commons):
            try:
                got = fn(q)
                LOG.append(f"{cat} | {q} | {fn.__name__}: {len(got)}")
            except Exception as e:  # noqa: BLE001
                LOG.append(f"{cat} | {q} | {fn.__name__} failed: {e}")
                got = []
            time.sleep(3.5 if fn is openverse else 1)
            if len(got) >= 6:
                break
        n = 0
        for it in got:
            if it["id"] in seen or not it["author"]:
                continue
            seen.add(it["id"])
            items.append(it)
            n += 1
            if n >= 10:
                break
    tw, th, cols = 320, 214, 5
    rows = max(1, (len(items) + cols - 1) // cols)
    sheet = Image.new("RGB", (cols * tw, rows * (th + 28)), "white")
    d = ImageDraw.Draw(sheet)
    keep = []
    for i, it in enumerate(items):
        x, y = (i % cols) * tw, (i // cols) * (th + 28)
        try:
            im = Image.open(io.BytesIO(get(it["url"], 20))).convert("RGB")
            it["w"], it["h"] = im.width, im.height
            r = max(tw / im.width, th / im.height)
            im = im.resize((int(im.width * r) + 1, int(im.height * r) + 1))
            l, t = (im.width - tw) // 2, (im.height - th) // 2
            sheet.paste(im.crop((l, t, l + tw, t + th)), (x, y))
        except Exception as e:  # noqa: BLE001
            LOG.append(f"thumb failed {cat} {i}: {e}")
        d.text((x + 6, y + th + 4), f"{i}  {it['src']}", fill="black", font=font)
        keep.append(it)
    found[cat] = keep
    sheet.save(os.path.join(OUT, f"{cat}.jpg"), quality=72)
    print(cat, len(keep), flush=True)

json.dump(found, open(os.path.join(OUT, "candidates.json"), "w"), indent=1)
open(os.path.join(OUT, "log.txt"), "w").write("\n".join(LOG))
