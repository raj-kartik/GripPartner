module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@components': './components',
          '@screens': './screens',
          '@utils': './utils',
          '@assets': './assets',
          '@constants': './components/constants',
          '@hooks': './components/Hooks',
          '@cards': './components/Cards',
          '@redux': './redux',
        },
      },
    ],
    'react-native-reanimated/plugin', // 👈 keep this last
  ],
};
