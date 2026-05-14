import { createServer } from "http";
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const STANDALONE_DIR = join(__dirname, ".next/standalone");
const STATIC_HTML = join(STANDALONE_DIR, ".next/server/app/index.html");

const PORT = 3000;

// Ensure the static HTML exists
if (!existsSync(STATIC_HTML)) {
  console.error(`Static HTML not found at: ${STATIC_HTML}`);
  process.exit(1);
}

const html = readFileSync(STATIC_HTML, "utf-8");
console.log(`Serving static HTML (${html.length} bytes) from: ${STATIC_HTML}`);

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  // Serve the home page as static HTML
  if (pathname === "/" || pathname === "") {
    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "*",
      "Cache-Control": "no-cache, no-store",
    });
    res.end(html);
    return;
  }

  // For all other routes, proxy to the Next.js standalone server on port 3001
  // We'll use the standalone server as a fallback
  res.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "*",
  });
  res.end(html); // Fallback to home page for now
}).listen(PORT, "0.0.0.0", () => {
  console.log(`Static server listening on port ${PORT}`);
});
