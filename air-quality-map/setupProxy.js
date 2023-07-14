import { createProxyMiddleware } from "http-proxy-middleware";

module.exports = function (app) {
  app.use(
    "/reverse",
    createProxyMiddleware({
      target: "https://nominatim.openstreetmap.org",
      changeOrigin: true,
    })
  );
};
