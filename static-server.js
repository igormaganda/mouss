const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const BUILD_DIR = path.join(__dirname, ".next");
const SERVER_APP = path.join(BUILD_DIR, "server/app");

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "*",
};

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".map": "application/json",
};

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || "application/octet-stream";
}

// Map of route paths to pre-rendered HTML files
const PAGE_MAP = {
  "/": "index.html",
  "/creer-mon-entreprise": "creer-mon-entreprise.html",
  "/outils": "outils.html",
  "/comparatifs": "comparatifs.html",
  "/tarifs": "tarifs.html",
  "/audit": "audit.html",
  "/login": "login.html",
  "/register": "register.html",
  "/actualites": "actualites.html",
  "/dashboard": "dashboard.html",
};

const server = http.createServer((req, res) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, CORS_HEADERS);
    res.end();
    return;
  }

  let urlPath = req.url.split("?")[0];

  // Serve pre-rendered HTML pages
  if (PAGE_MAP[urlPath]) {
    const htmlFile = path.join(SERVER_APP, PAGE_MAP[urlPath]);
    if (fs.existsSync(htmlFile)) {
      const content = fs.readFileSync(htmlFile, "utf-8");
      res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
        ...CORS_HEADERS,
      });
      res.end(content);
      return;
    }
  }

  // Serve _next/static/* (JS, CSS, fonts, images)
  if (urlPath.startsWith("/_next/static/")) {
    const relativePath = urlPath.replace("/_next/static/", "");
    const filePath = path.join(BUILD_DIR, "static", relativePath);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath);
      res.writeHead(200, {
        "Content-Type": getMimeType(filePath),
        "Cache-Control": "public, max-age=31536000, immutable",
        ...CORS_HEADERS,
      });
      res.end(content);
      return;
    }
  }

  // Serve _next/static/media/*
  if (urlPath.startsWith("/_next/media/")) {
    const relativePath = urlPath.replace("/_next/media/", "");
    const filePath = path.join(BUILD_DIR, "static", "media", relativePath);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath);
      res.writeHead(200, {
        "Content-Type": getMimeType(filePath),
        "Cache-Control": "public, max-age=31536000, immutable",
        ...CORS_HEADERS,
      });
      res.end(content);
      return;
    }
  }

  // Serve RSC data routes (_next/{buildId}/...)
  if (urlPath.startsWith("/_next/") && !urlPath.startsWith("/_next/static/") && !urlPath.startsWith("/_next/image")) {
    // Try server/app/ for RSC payloads
    const cleanPath = urlPath.replace(/^\/_next\/[^/]+\//, "");
    const filePath = path.join(SERVER_APP, cleanPath);
    if (fs.existsSync(filePath) && !fs.statSync(filePath).isDirectory()) {
      const content = fs.readFileSync(filePath);
      res.writeHead(200, {
        "Content-Type": getMimeType(filePath),
        "Cache-Control": "public, max-age=3600",
        ...CORS_HEADERS,
      });
      res.end(content);
      return;
    }
  }

  // Serve favicon
  if (urlPath === "/favicon.ico") {
    res.writeHead(204, CORS_HEADERS);
    res.end();
    return;
  }

  // Fallback: try to serve index.html for any unknown route
  const htmlFile = path.join(SERVER_APP, "index.html");
  if (fs.existsSync(htmlFile)) {
    const content = fs.readFileSync(htmlFile, "utf-8");
    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=60",
      ...CORS_HEADERS,
    });
    res.end(content);
    return;
  }

  res.writeHead(404, CORS_HEADERS);
  res.end("Not Found");
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Static server running on http://localhost:${PORT}`);
});
