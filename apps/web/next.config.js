// @ts-check
const { composePlugins, withNx } = require('@nx/next');

/** @type {import('@nx/next/plugins/with-nx').WithNxOptions} */
const nextConfig = {
  nx: { svgr: false },
  reactStrictMode: true,
  experimental: {},
};

module.exports = composePlugins(withNx)(nextConfig);
