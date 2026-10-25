"""Quick check of which photo sources answer from GitHub Actions."""
import json, os, urllib.parse, urllib.request
OUT = os.path.join(os.path.dirname(__file__), "out")
os.makedirs(OUT, exist_ok=True)
H = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
     "Accept": "application/json", "Referer": "https://unsplash.com/"}
tests = {
    "unsplash_napi": "https://unsplash.com/napi/search/photos?query=plumber&per_page=5",
    "openverse": "https://api.openverse.org/v1/images/?q=plumber&page_size=5&license=cc0,by,by-sa",
    "commons": "https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=plumber%20filetype:bitmap&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=800",
    "pexels_page": "https://www.pexels.com/search/plumber/",
    "unsplash_page": "https://unsplash.com/s/photos/plumber",
}
res = {}
for k, u in tests.items():
    try:
        req = urllib.request.Request(u, headers={**H, "User-Agent": H["User-Agent"] if k != "commons" else "AlfaFindaPhotoBot/1.0 (hello@globalalfabet.com)"})
        with urllib.request.urlopen(req, timeout=15) as r:
            body = r.read()
            res[k] = {"status": r.status, "len": len(body), "head": body[:300].decode("utf8", "replace")}
    except Exception as e:  # noqa: BLE001
        res[k] = {"error": repr(e)[:300]}
json.dump(res, open(os.path.join(OUT, "probe.json"), "w"), indent=1)
print(json.dumps(res, indent=1)[:2000])
