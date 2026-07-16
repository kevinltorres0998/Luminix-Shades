import io
import math
import sys
import urllib.request
from pathlib import Path

from PIL import Image, ImageEnhance

if len(sys.argv) != 2:
    raise SystemExit("Usage: generate-south-florida-basemap.py OUTPUT.webp")

OUTPUT = Path(sys.argv[1])
ZOOM = 10
BOUNDS = (-81.25, 25.88, -79.75, 27.05)  # west, south, east, north
TILE_SIZE = 256


def lon_to_x(lon):
    return (lon + 180.0) / 360.0 * (2**ZOOM)


def lat_to_y(lat):
    rad = math.radians(lat)
    return (1.0 - math.asinh(math.tan(rad)) / math.pi) / 2.0 * (2**ZOOM)


west, south, east, north = BOUNDS
x0, x1 = lon_to_x(west), lon_to_x(east)
y0, y1 = lat_to_y(north), lat_to_y(south)
tile_x0, tile_x1 = math.floor(x0), math.floor(x1)
tile_y0, tile_y1 = math.floor(y0), math.floor(y1)

canvas = Image.new("RGB", ((tile_x1 - tile_x0 + 1) * TILE_SIZE, (tile_y1 - tile_y0 + 1) * TILE_SIZE), "#f3efe7")
headers = {"User-Agent": "LuminixShadesMap/1.0 (https://www.luminixshades.com)"}

for x in range(tile_x0, tile_x1 + 1):
    for y in range(tile_y0, tile_y1 + 1):
        url = f"https://a.basemaps.cartocdn.com/light_all/{ZOOM}/{x}/{y}.png"
        request = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(request, timeout=30) as response:
            tile = Image.open(io.BytesIO(response.read())).convert("RGB")
        canvas.paste(tile, ((x - tile_x0) * TILE_SIZE, (y - tile_y0) * TILE_SIZE))

crop = (
    round((x0 - tile_x0) * TILE_SIZE),
    round((y0 - tile_y0) * TILE_SIZE),
    round((x1 - tile_x0) * TILE_SIZE),
    round((y1 - tile_y0) * TILE_SIZE),
)
image = canvas.crop(crop).resize((1440, 1120), Image.Resampling.LANCZOS)
image = ImageEnhance.Color(image).enhance(0.22)
image = ImageEnhance.Contrast(image).enhance(1.28)
image = ImageEnhance.Sharpness(image).enhance(1.35)
cream = Image.new("RGB", image.size, "#f3efe7")
image = Image.blend(image, cream, 0.035)
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
image.save(OUTPUT, "WEBP", quality=91, method=6)
