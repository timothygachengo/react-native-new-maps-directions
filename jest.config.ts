/** @type {import('jest').Config} */
module.exports = {
  preset: 'react-native',
  modulePathIgnorePatterns: [
    '<rootDir>/example/node_modules',
    '<rootDir>/lib/',
    '<rootDir>/node_modules/',
    '<rootDir>/coverage/',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-maps)/)',
  ],
  setupFilesAfterEnv: [
    // "./jest.setup.js"
  ],
};
