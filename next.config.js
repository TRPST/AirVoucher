// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   async rewrites() {
//     return [
//       {
//         source: "/api/airtime",
//         destination:
//           "https://api.qa.bltelecoms.net/v2/trade/mobile/airtime/products",
//       },
//       {
//         source: "/api/data",
//         destination:
//           "https://api.qa.bltelecoms.net/v2/trade/mobile/bundle/products",
//       },
//     ];
//   },
//   async headers() {
//     return [
//       {
//         source: "/api/:path*",
//         headers: [
//           { key: "Access-Control-Allow-Origin", value: "*" },
//           { key: "Access-Control-Allow-Methods", value: "GET, POST, OPTIONS" },
//           {
//             key: "Access-Control-Allow-Headers",
//             value: "X-API-KEY, Authorization, Content-Type, Trade-Vend-Channel",
//           },
//         ],
//       },
//     ];
//   },
// };

// module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // BL Telecoms API for Airtime & Data
      {
        source: "/api/airtime",
        destination:
          "https://api.qa.bltelecoms.net/v2/trade/mobile/airtime/products",
      },
      {
        source: "/api/data",
        destination:
          "https://api.qa.bltelecoms.net/v2/trade/mobile/bundle/products",
      },

      // BL Telecoms API for Purchasing (Selling Airtime & Data)
      {
        source: "/api/airtime/sales",
        destination:
          process.env.BL_TELECOMS_AIRTIME_SALES_URL ||
          "https://api.qa.bltelecoms.net/v2/trade/mobile/airtime/sales",
      },
      {
        source: "/api/data/sales",
        destination:
          process.env.BL_TELECOMS_DATA_SALES_URL ||
          "https://api.qa.bltelecoms.net/v2/trade/mobile/bundle/sales",
      },

      // OTT Mobile API (Handles all paths under /api/ott/)
      {
        source: "/api/ott/:path*",
        destination: "https://test-api.ott-mobile.com/api/:path*",
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, OPTIONS" },
          {
            key: "Access-Control-Allow-Headers",
            value: "X-API-KEY, Authorization, Content-Type, Trade-Vend-Channel",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
