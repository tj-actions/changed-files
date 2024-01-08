module.exports = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  verbose: true,
  testTimeout: 10000,
  setupFiles: [
    "<rootDir>/jest/setupEnv.cjs"
  ]
};
