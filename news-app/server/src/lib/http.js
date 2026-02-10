const axios = require('axios');
const https = require('https');
const fs = require('fs');

let httpsAgent;

// Optional: if later you get a PEM bundle, Node can use it automatically.
const caPath = process.env.NODE_EXTRA_CA_CERTS;
if (caPath && fs.existsSync(caPath)) {
  try {
    const ca = fs.readFileSync(caPath, 'utf8');
    httpsAgent = new https.Agent({
      ca,
      keepAlive: true,
    });
    console.log(`🔒 Using custom CA bundle from ${caPath}`);
  } catch (e) {
    console.warn(`⚠️ Failed to load custom CA bundle at ${caPath}: ${e.message}`);
  }
}

const http = axios.create({
  timeout: 10000,
  httpsAgent, // undefined by default; win-ca already patched global trust
});

module.exports = { http };