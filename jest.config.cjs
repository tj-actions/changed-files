module.exports = {
  clearMocks: true,
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ['js', 'ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', {useESM: true}]
  },
  verbose: true,
  testTimeout: 10000,
  setupFiles: [
    "<rootDir>/jest/setupEnv.cjs"
  ]
};
