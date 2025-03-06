export default {
  transform: {
    '^.+\\.jsx?$': 'babel-jest', // Tells Jest to use Babel for JavaScript files
  },
  testEnvironment: 'jsdom', // Simulates a browser environment for React
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'], // Runs setup before tests
  moduleNameMapper: {
    '\\.(css|scss|less)$': 'identity-obj-proxy', // Mocks CSS imports
  },
};

