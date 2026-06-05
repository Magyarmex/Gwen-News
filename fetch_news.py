"""
fetch_news.py — Gwen News RSS fetcher
Runs in GitHub Actions every hour. Writes news.json.
"""

import feedparser
import json
import re
import time
from datetime import datetime, timezone

# ──────────────────────────────────────────────
# FEEDS
# ──────────────────────────────────────────────

FEEDS = [
    # General / World
    {"url": "https://feeds.bbci.co.uk/mundo/rss.xml",                           "source": "BBC Mundo",        "cat": "Mundo"},
    {"url": "https://feeds.bbci.co.uk/mundo/america_latina/rss.xml",            "source": "BBC Mundo",        "cat": "México"},
    {"url": "https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada", "source": "El País",          "cat": "Mundo"},
    # Mexico
    {"url": "https://aristeguinoticias.com/feed/",                               "source": "Aristegui Noticias","cat": "México"},
    {"url": "https://www.proceso.com.mx/rss",                                    "source": "Proceso",          "cat": "México"},
    # Science / Tech
    {"url": "https://feeds.bbci.co.uk/mundo/ciencia_y_tecnologia/rss.xml",      "source": "BBC Mundo",        "cat": "Ciencia"},
    # Economy
    {"url": "https://www.elfinanciero.com.mx/rss/todas.xml",                     "source": "El Financiero",    "cat": "Economía"},
    {"url": "https://feeds.bbci.co.uk/mundo/economia/rss.xml",                   "source": "BBC Mundo",        "cat": "Economía"},
    # Sports
    {"url": "https://www.marca.com/rss/portada.xml",                             "source": "MARCA",            "cat": "Deportes"},
    {"url": "https://e00-marca.uecdn.es/rss/futbol/mexico.xml",                  "source": "MARCA México",     "cat": "Deportes"},
]

# ──────────────────────────────────────────────
# CATEGORY DETECTION
# ──────────────────────────────────────────────

CATEGORY_KEYWORDS = {
    "México":          ["méxico", "mexico", "cdmx", "sheinbaum", "pemex", "guadalajara",
                        "monterrey", "jalisco", "morena", "oaxaca", "veracruz", "michoacán"],
    "Tech":            ["inteligencia artificial", " ia ", "openai", "chatgpt", "elon musk",
                        "apple", "google", "microsoft", "meta ", "tesla", "robot", "algoritmo",
                        "software", "startup", "nvidia", "sam altman"],
    "Política":        ["elección", "presidente", "congreso", "trump", "gobierno", "senado",
                        "diputado", "partido", "campaña", "voto", "democracia", "republicano",
                        "demócrata", "parlamento"],
    "Entretenimiento": ["cine", "película", "música", "artista", "celebridad", "reggaetón",
                        "serie", "netflix", "oscar", "grammy", "actor", "actriz", "cantante",
                        "concierto", "disney", "spotify"],
    "Economía":        ["dólar", "peso", "economía", "inflación", "bolsa", "mercado", "banco",
                        "pib", "finanzas", "inversión", "recesión", "wall street", "tasas"],
    "Deportes":        ["fútbol", "futbol", "liga mx", "champions", "nba", "mlb", "f1",
                        "fórmula 1", "boxeo", "olimpiadas", "mundial", "fifa", "selección",
                        "béisbol", "golazo"],
    "Ciencia":         ["ciencia", "investigación", "nasa", "clima", "cambio climático",
                        "pandemia", "vacuna", "cáncer", "espacio", "astronomía", "salud",
                        "biología", "médico", "hospital", "estudio"],
    "Cultura":         ["arte", "literatura", "museo", "exposición", "festival", "gastronomía",
                        "arquitectura", "fotografía", "danza", "teatro", "moda", "diseño"],
}


def detect_category(title: str, desc: str, default: str) -> str:
    text = (title + " " + desc).lower()
    for cat, keywords in CATEGORY_KEYWORDS.items():
        if any(kw in text for kw in keywords):
            return cat
    return default


# ──────────────────────────────────────────────
# HELPERS
# ──────────────────────────────────────────────

def strip_html(text: str) -> str:
    """Remove HTML tags and normalise whitespace."""
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", text or "")).strip()


def get_thumbnail(entry) -> str | None:
    """Try several feedparser locations for an image URL."""
    # media:thumbnail
    if hasattr(entry, "media_thumbnail") and entry.media_thumbnail:
        return entry.media_thumbnail[0].get("url")
    # media:content with image type
    if hasattr(entry, "media_content"):
        for mc in entry.media_content:
            if mc.get("medium") == "image" or mc.get("type", "").startswith("image"):
                return mc.get("url")
    # enclosures
    if hasattr(entry, "enclosures"):
        for enc in entry.enclosures:
            t = enc.get("type", "")
            if t.startswith("image"):
                return enc.get("href") or enc.get("url")
    # first <img> in summary HTML
    if hasattr(entry, "summary"):
        m = re.search(r'<img[^>]+src=["\']([^"\']+)["\']', entry.summary)
        if m:
            return m.group(1)
    return None


def parse_date(entry) -> str:
    for attr in ("published_parsed", "updated_parsed"):
        val = getattr(entry, attr, None)
        if val:
            try:
                return time.strftime("%Y-%m-%dT%H:%M:%SZ", val)
            except Exception:
                pass
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


# ──────────────────────────────────────────────
# MAIN
# ──────────────────────────────────────────────

def main():
    all_articles = []

    for feed_cfg in FEEDS:
        url = feed_cfg["url"]
        source = feed_cfg["source"]
        default_cat = feed_cfg["cat"]

        try:
            d = feedparser.parse(url)
            count = 0
            for entry in d.entries[:14]:
                title = strip_html(entry.get("title", ""))
                if not title:
                    continue

                desc = strip_html(
                    entry.get("summary", entry.get("description", ""))
                )[:260]
                link  = entry.get("link", "")
                pub   = parse_date(entry)
                thumb = get_thumbnail(entry)
                cat   = detect_category(title, desc, default_cat)

                all_articles.append({
                    "title":       title,
                    "link":        link,
                    "description": desc,
                    "pubDate":     pub,
                    "source":      source,
                    "category":    cat,
                    "thumbnail":   thumb,
                })
                count += 1

            print(f"✓  {source:25s} — {count} articles")

        except Exception as exc:
            print(f"✗  {source:25s} — {exc}")

    # Deduplicate by link
    seen = set()
    unique = []
    for a in all_articles:
        if a["link"] and a["link"] not in seen:
            seen.add(a["link"])
            unique.append(a)

    # Sort newest first
    unique.sort(key=lambda a: a["pubDate"], reverse=True)

    output = {
        "generated": datetime.now(timezone.utc).isoformat(),
        "count":     len(unique),
        "articles":  unique[:120],
    }

    with open("news.json", "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"\n✓  Saved {len(output['articles'])} articles → news.json")


if __name__ == "__main__":
    main()
