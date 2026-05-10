module.exports = {
  preset: 'react-native',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js',
  ],
  collectCoverageFrom: [
    'services/**/*.js',
    'context/**/*.js',
    'screens/**/*.js',
    'components/**/*.js',
    '!**/*.test.js',
    '!**/node_modules/**',
  ],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
};
