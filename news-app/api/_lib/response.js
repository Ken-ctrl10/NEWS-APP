function ok(res, data, status = 200) {
  return res.status(status).json({ status: "ok", ...data });
}

function fail(res, code, message, status = 400, extra = {}) {
  return res.status(status).json({
    status: "error",
    code,
    message,
    ...extra
  });
}

module.exports = { ok, fail };