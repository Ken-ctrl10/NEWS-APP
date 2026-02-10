Server (Express + Axios) — Local Development Guide
This server folder contains a Node/Express backend that proxies requests to NewsAPI.org.
It’s designed to work reliably on corporate networks using:

Axios for HTTP requests
win-ca to load the Windows certificate store at runtime (dev only), so no TLS bypass is required
Optional NODE_EXTRA_CA_CERTS support for custom PEM bundles (macOS/Linux or special cases)

----------------------

Table of Contents

Prerequisites
Quick Start
Environment Variables
Available Scripts
API Endpoints
Frontend Integration
TLS & Corporate Network Notes
Troubleshooting
Contributing

----------------------
Prerequisites

Node.js ≥ 18 (Node 20/22/24 are fine)
npm ≥ 9
A NewsAPI key: https://newsapi.org


On Windows, TLS trusts should “just work” via win-ca.
On macOS/Linux, see the TLS section below for NODE_EXTRA_CA_CERTS.

------------------------------
Quick Start

# From repo root
cd news-app/server

# 1) Install deps
npm install

# 2) Create your .env (see Environment Variables below)
cp .env.example .env
# then edit .env and set NEWS_API_KEY=...

# 3) Run the server (nodemon)
npm run dev

# Health check
# -> http://localhost:3001/api/health


Expected outputs:

http://localhost:3001 → {"status":"error","code":"notFound","message":"Not found"} (expected)
http://localhost:3001/api/health → { "status": "ok", ... }
http://localhost:3001/api/news/top-headlines?country=us&page=1&pageSize=12 → JSON news articles


Environment Variables
Create server/.env (don’t commit) using .env.example as a template:

PORT=3001
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173

# Required
NEWS_API_KEY=(get on CLIENT .ENV)

# Optional: only if you get a PEM bundle from IT (macOS/Linux or advanced cases)
# NODE_EXTRA_CA_CERTS=/absolute/path/to/corp-ca-bundle.pem

-----------------------------------
Available Scripts
In server/package.json:

npm run dev — start with nodemon (auto-restart on changes)
npm start — start once with Node

----------------------------------
API Endpoints
All routes are prefixed with /api.
Health:
GET /api/health
→ 200 { status: "ok", route: "/api/health", time: "..." }

--------------------------------
Top Headlines
GET /api/news/top-headlines?country=us&page=1&pageSize=12&category=&q=&sources=


Rules (NewsAPI): if sources is provided, do not use country/category.
Returns { totalResults, articles: [...] }

Example:
GET /api/news/top-headlines?country=us&page=1&pageSize=12

Search (Everything)
GET /api/news/search?q=apple&language=en&sortBy=publishedAt&page=1&pageSize=20&sources=


Required: q
Returns { totalResults, articles: [...] }


------------------------------------------
Frontend Integration
Local dev (recommended):

Run this server on http://localhost:3001
In the Vite client (already set), /api is proxied to the Express server:


// client/vite.config.js
server: {
  proxy: {
    '/api': 'http://localhost:3001'
  }
}


Your React app can call /api/... seamlessly.

Deployed (Vercel):

The /api path in production is handled by serverless functions in /api.
You do not need to run this Express server in production for the current setup.

TLS & Corporate Network Notes
This project is set up to avoid insecure TLS bypasses.
Windows (dev)

We automatically load the Windows certificate store in development:

// server/src/index.js
if (process.platform === 'win32' && process.env.NODE_ENV !== 'production') {
  require('win-ca');
}

-------------------
No extra setup needed. Axios should trust NewsAPI’s TLS through your corporate proxy.

macOS / Linux (if you hit TLS errors)

Ask IT for your corporate Root and Intermediate CAs as Base‑64 PEM.
Concatenate them into a bundle (order doesn’t matter in most cases):
cat corp-root.pem corp-intermediate.pem > corp-ca-bundle.pem

Point Node to the bundle:
export NODE_EXTRA_CA_CERTS=/absolute/path/to/corp-ca-bundle.pem






-----------------------------------------------------------------
Troubleshooting
UNABLE_TO_GET_ISSUER_CERT_LOCALLY

Windows: Ensure win-ca is at the very top of src/index.js. Restart terminal/VS Code.
macOS/Linux: Get PEM bundle from IT and set NODE_EXTRA_CA_CERTS=/path/to/bundle.pem.

Missing NEWS_API_KEY

Check server/.env, set NEWS_API_KEY, restart terminal → npm run dev.

EADDRINUSE: port 3001

Another app is using 3001. Stop it or override:

In .env set PORT=3002, restart dev.
Update Vite proxy if needed (client).



CORS errors from client

Ensure CLIENT_ORIGIN in server/.env matches your Vite URL (default http://localhost:5173).
Restart server after changing env.

“Cannot find module 'axios'”

Run npm install inside /server.