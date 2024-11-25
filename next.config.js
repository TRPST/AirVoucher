// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://test-api.ott-mobile.com/api/:path*",
      },
    ];
  },
};
