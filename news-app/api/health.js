module.exports = async (req, res) => {
  res.status(200).json({
    status: "ok",
    route: "/api/news/health",
    time: new Date().toISOString()
  });
};
