// QR code generator for tables
// Usage:
//   cd "qr code"
//   npm install qrcode
//   node generate.js
//
// Configure these URLs for your environment:
const API_BASE = process.env.API_BASE || "http://localhost:4000";
const USER_APP_BASE = process.env.USER_APP_BASE || "http://localhost:8080";

const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");
// Use global fetch if available (Node 18+), otherwise require node-fetch
const fetchFn = global.fetch ? global.fetch : require("node-fetch");

async function fetchJson(url) {
  const res = await fetchFn(url);
  if (!res.ok) throw new Error(`Request failed ${res.status} ${res.statusText}`);
  return res.json();
}

async function main() {
  const outputDir = path.join(__dirname, "out");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  // Fetch tables
  const tables = await fetchJson(`${API_BASE}/tables`);
  console.log(`Fetched ${tables.length} tables from ${API_BASE}/tables`);

  // Fetch restaurants to get names
  const restaurants = await fetchJson(`${API_BASE}/restaurants`);
  console.log(`Fetched ${restaurants.length} restaurants from ${API_BASE}/restaurants`);
  const restaurantNameMap = new Map(restaurants.map(r => [r.id || r._id, r.name]));

  for (const table of tables) {
    const restaurantId = table.restaurantId;
    const restaurantName = restaurantNameMap.get(restaurantId) || "Restaurant";
    const targetUrl = `${USER_APP_BASE}/?tableId=${encodeURIComponent(table.id)}&restaurantId=${encodeURIComponent(restaurantId)}&tableNumber=${encodeURIComponent(table.number)}&restaurantName=${encodeURIComponent(restaurantName)}`;

    const fileName = `table-${restaurantName.replace(/\s+/g, '-').toLowerCase()}-${table.number}.png`;
    const filePath = path.join(outputDir, fileName);

    await QRCode.toFile(filePath, targetUrl, {
      width: 512,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    console.log(`Generated ${fileName} -> ${targetUrl}`);
  }

  console.log(`\nDone. Files in: ${outputDir}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
