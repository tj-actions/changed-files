module.exports = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    '^@actions/core$': '<rootDir>/jest/actionsCore.cjs',
    '^@actions/exec$': '<rootDir>/jest/actionsExec.cjs',
    '^@actions/github$': '<rootDir>/jest/actionsGithub.cjs'
  },
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        diagnostics: false,
        tsconfig: {
          module: 'commonjs',
          moduleResolution: 'node',
          target: 'ES2022',
          esModuleInterop: true,
          strict: true,
          skipLibCheck: true,
          isolatedModules: true
        }
      }
    ]
  },
  verbose: true,
  testTimeout: 10000,
  setupFiles: [
    "<rootDir>/jest/setupEnv.cjs"
  ]
};
