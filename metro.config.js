const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  // Polyfill for Node.js modules
  crypto: require.resolve('crypto-browserify'),
  stream: require.resolve('stream-browserify'),
  util: require.resolve('util/'),
  buffer: require.resolve('buffer/'),
  process: require.resolve('process/browser'),
};

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = config;