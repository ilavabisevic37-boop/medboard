// @ts-check
const { composePlugins, withNx } = require('@nx/next');

/** @type {import('@nx/next/plugins/with-nx').WithNxOptions} */
const nextConfig = {
  nx: { svgr: false },
  reactStrictMode: true,
  output: process.env.NEXT_PRIVATE_STANDALONE === 'true' || process.platform !== 'win32' ? 'standalone' : undefined,
  experimental: {},
};

module.exports = composePlugins(withNx)(nextConfig);

