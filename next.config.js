/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer({
  // compiler: {
  //   removeConsole: true,
  // },
  productionBrowserSourceMaps: true,
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_ENV: 'PRODUCTION'
  },
  images: {
    domains: ['d3lh8dfkp7q6os.cloudfront.net', 'd2sv1zkyiqv9y5.cloudfront.net', 'i.ytimg.com'],
  },
  NEXT_SHARP_PATH: "/tmp/node_modules/sharp",
  redirects: async () => [
    {
      source: '/:path*',
      has: [{ type: 'host', value: 'nexdro.com' }],
      destination: 'https://www.nexdro.com/:path*',
      permanent: true
    }
  ],
  compress: true,
  // headers: async () => [
  //     {
  //       source: '/:all*(svg|jpg|png)',
  //       locale: false,
  //       headers: [
  //         {
  //           key: 'Cache-Control',
  //           value: 'no-cache, no-store, max-age=31536000, must-revalidate',
  //         }
  //       ],
  //     },
  //   ],
})

// const nextConfig = {
//   compiler: {
//     removeConsole: true,
//   },
//   reactStrictMode: false,
//   env: {
//     PUBLIC_URL: '/',
//   },
//   images: {
//     domains: ['d3lh8dfkp7q6os.cloudfront.net', 'd2sv1zkyiqv9y5.cloudfront.net'],
//   },
//   NEXT_SHARP_PATH: "/tmp/node_modules/sharp",
//   redirects: async () => [
//     {
//       source: '/:path*',
//       has: [{ type: 'host', value: 'nexdro.com' }],
//       destination: 'https://www.nexdro.com/:path*',
//       permanent: true
//     }
//   ],
//   // headers: async () => [
//   //     {
//   //       source: '/:all*(svg|jpg|png)',
//   //       locale: false,
//   //       headers: [
//   //         {
//   //           key: 'Cache-Control',
//   //           value: 'no-cache, no-store, max-age=31536000, must-revalidate',
//   //         }
//   //       ],
//   //     },
//   //   ],
// }

// module.exports = nextConfig