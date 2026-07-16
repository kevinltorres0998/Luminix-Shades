import fs from "node:fs";

const [input, output] = process.argv.slice(2);
if (!input || !output) throw new Error("Usage: node generate-south-florida-map.mjs input.geojson output.svg");

const data = JSON.parse(fs.readFileSync(input, "utf8"));
const bounds = { west: -80.9, east: -79.94, north: 27.03, south: 25.91 };
const width = 720;
const height = 560;
const project = ([lon, lat]) => [
  ((lon - bounds.west) / (bounds.east - bounds.west)) * width,
  ((bounds.north - lat) / (bounds.north - bounds.south)) * height,
];

function distanceToSegment(point, start, end) {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  if (!dx && !dy) return Math.hypot(point[0] - start[0], point[1] - start[1]);
  const t = Math.max(0, Math.min(1, ((point[0] - start[0]) * dx + (point[1] - start[1]) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(point[0] - (start[0] + t * dx), point[1] - (start[1] + t * dy));
}

function simplify(points, tolerance = 0.75) {
  if (points.length < 3) return points;
  let index = -1;
  let maxDistance = 0;
  for (let i = 1; i < points.length - 1; i += 1) {
    const distance = distanceToSegment(points[i], points[0], points.at(-1));
    if (distance > maxDistance) { index = i; maxDistance = distance; }
  }
  if (maxDistance <= tolerance) return [points[0], points.at(-1)];
  return [...simplify(points.slice(0, index + 1), tolerance).slice(0, -1), ...simplify(points.slice(index), tolerance)];
}

function ringPath(ring) {
  const points = simplify(ring.map(project));
  return points.map(([x, y], index) => `${index ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("") + "Z";
}

function geometryPath(geometry) {
  const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
  return polygons.map((polygon) => polygon.map(ringPath).join("")).join("");
}

const counties = data.features
  .filter((feature) => ["Palm Beach County", "Broward County"].includes(feature.properties.NAME))
  .map((feature) => `<path class="county" data-county="${feature.properties.NAME}" d="${geometryPath(feature.geometry)}"/>`)
  .join("\n");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title description">
<title id="title">South Florida service area map</title>
<desc id="description">Complete county geography for the Luminix Shades service region from Broward through Palm Beach.</desc>
<rect width="720" height="560" fill="#dce6e7"/>
<g fill="#f4f0e8" stroke="#aab9bb" stroke-width="1.15" fill-rule="evenodd">${counties}</g>
<g fill="none" stroke-linecap="round">
  <path d="M650 0C649 86 647 174 644 260C641 348 637 455 628 560" stroke="#b6c1c0" stroke-width="2"/>
  <path d="M590 0C592 92 592 184 590 276C588 370 583 468 573 560" stroke="#d0d4cf" stroke-width="1.4"/>
</g>
<g fill="#a8a197" font-family="Arial, sans-serif" font-size="10" letter-spacing="2">
  <text x="74" y="154">PALM BEACH COUNTY</text>
  <text x="74" y="438">BROWARD COUNTY</text>
</g>
<text x="652" y="138" fill="#93a5a8" font-family="Arial, sans-serif" font-size="12" letter-spacing="2" transform="rotate(90 652 138)">ATLANTIC OCEAN</text>
</svg>`;

fs.writeFileSync(output, svg);
