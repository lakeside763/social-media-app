module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts$',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  setupFilesAfterEnv: ['./src/tests/setup.config.ts'],
  globalSetup: './src/tests/setup.config.ts',
  globalTeardown: './src/tests/teardown.config.ts',
  testTimeout: 30000,
};