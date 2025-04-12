const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    // Handle .svg files with react-native-svg-transformer
    assetExts: (getDefaultConfig(__dirname).resolver.assetExts || []).filter(
      ext => ext !== 'svg'
    ),
    sourceExts: [...(getDefaultConfig(__dirname).resolver.sourceExts || []), 'svg'],
    blockList: [
      /node_modules\/react-native\/src\/private\/featureflags\/NativeReactNativeFeatureFlags\.js/,
    ],
  },
  transformer: {
    // Use react-native-svg-transformer for SVG files
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  watchFolders: [
    // Add any custom watch folders here if needed
  ],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
