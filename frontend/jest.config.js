module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest', // Use babel-jest to transform JS/TS/JSX/TSX files
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(axios|lz-string)/)', // Transform axios and other ES modules
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(scss|css|less)$': 'identity-obj-proxy', // Mock CSS modules
  },
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
};
