function notFound(req, res, next) {
  res.status(404).json({ status: "error", code: "notFound", message: "Not found" });
}

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const code = err.code || "serverError";
  const message = err.message || "Internal server error";
  const payload = err.payload ? { upstream: err.payload } : undefined;

  if (process.env.NODE_ENV !== "production") {
    console.error("Error:", err);
  }

  res.status(status).json({
    status: "error",
    code,
    message,
    ...(payload || {})
  });
}

module.exports = { notFound, errorHandler };
