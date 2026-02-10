// ---- must be the very first lines ----
if (process.platform === 'win32' && process.env.NODE_ENV !== 'production') {
  require('win-ca'); // Load Windows cert store into Node (dev on Windows)
}
// ---------------------------------------

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const newsRouter = require("./routes/news");
const { notFound, errorHandler } = require("./middleware/errors");

const app = express();

const PORT = process.env.PORT || 3001;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

// Core middleware
app.use(helmet());
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(compression());
app.use(morgan("dev"));

// Health
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    route: "/api/health",
    time: new Date().toISOString()
  });
});

// Health alias (legacy)
app.get("/api/news/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    route: "/api/news/health",
    time: new Date().toISOString()
  });
});

// News routes
app.use("/api/news", newsRouter);

// 404 + error handling
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});
