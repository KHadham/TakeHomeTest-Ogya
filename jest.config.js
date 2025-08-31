module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: [
    "@testing-library/jest-native/extend-expect",
    "./jest.setup.js",
  ],

  // This is a more aggressive pattern to ensure the right modules are transformed.
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|expo-router|@gorhom/bottom-sheet|msw))",
  ],

  moduleNameMapper: {
    // This line is still required to help Jest find the module in the first place
    "msw/node": require.resolve("msw/node"),
  },
};
