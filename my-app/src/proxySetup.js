/* eslint-disable no-undef */
// eslint-disable-next-line no-undef
const { createProxyMiddleware } = require("http-proxy-middleware")

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:5235",
      changeOrigin: true,
      logLevel: "debug",
    })
  )
}
