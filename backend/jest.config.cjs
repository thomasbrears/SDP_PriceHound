module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': 'babel-jest', // Use babel-jest for JS and TS files
  },
  transformIgnorePatterns: ['/node_modules/'],
  testTimeout: 20000, // 20 seconds timeout for each test
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'], // Match test files
};
