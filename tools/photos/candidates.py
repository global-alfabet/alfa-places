"""Find free Unsplash photos for each category and draw a contact sheet per category (runs on GitHub Actions)."""
import io, json, os, time, urllib.parse, urllib.request
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(__file__)
OUT = os.path.join(HERE, "out")
os.makedirs(OUT, exist_ok=True)
QUERIES = json.load(open(os.path.join(HERE, "queries.json")))
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "en-GB,en;q=0.9",
    "Referer": "https://unsplash.com/",
}


def get(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=40) as r:
        return r.read()


font = ImageFont.load_default(size=18)
found = {}
for cat, queries in QUERIES.items():
    seen, items = set(), []
    for q in queries:
        url = "https://unsplash.com/napi/search/photos?" + urllib.parse.urlencode({"query": q, "per_page": 20, "orientation": "landscape"})
        try:
            data = json.loads(get(url))
        except Exception as e:  # noqa: BLE001
            print("search failed", cat, q, e)
            continue
        n = 0
        for p in data.get("results", []):
            raw = p["urls"]["raw"]
            if p.get("premium") or p.get("plus") or "plus.unsplash.com" in raw or p["id"] in seen:
                continue
            seen.add(p["id"])
            n += 1
            items.append({
                "id": p["id"], "q": q, "alt": p.get("alt_description") or p.get("description") or "",
                "w": p["width"], "h": p["height"], "raw": raw.split("?")[0], "small": p["urls"]["small"],
                "author": p["user"]["name"], "username": p["user"]["username"], "page": p["links"]["html"],
            })
            if n >= 8:
                break
        time.sleep(1.2)
    found[cat] = items
    tw, th, cols = 320, 214, 6
    rows = max(1, (len(items) + cols - 1) // cols)
    sheet = Image.new("RGB", (cols * tw, rows * (th + 28)), "white")
    d = ImageDraw.Draw(sheet)
    for i, it in enumerate(items):
        x, y = (i % cols) * tw, (i // cols) * (th + 28)
        try:
            im = Image.open(io.BytesIO(get(it["small"]))).convert("RGB")
            r = max(tw / im.width, th / im.height)
            im = im.resize((int(im.width * r) + 1, int(im.height * r) + 1))
            l, t = (im.width - tw) // 2, (im.height - th) // 2
            sheet.paste(im.crop((l, t, l + tw, t + th)), (x, y))
        except Exception as e:  # noqa: BLE001
            print("thumb failed", it["id"], e)
        d.text((x + 6, y + th + 4), f"{i}", fill="black", font=font)
    sheet.save(os.path.join(OUT, f"{cat}.jpg"), quality=72)
    print(cat, len(items))

json.dump(found, open(os.path.join(OUT, "candidates.json"), "w"), indent=1)
