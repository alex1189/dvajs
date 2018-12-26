export default {
  "proxy": {
    "/api": {
      "target": "http://localhost:8080/api/",
      "changeOrigin": true,
      "pathRewrite": { "^/api" : "" }
    }
  },
}
