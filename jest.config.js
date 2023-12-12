/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['lib/'],
  setupFiles: ["dotenv/config"],
  globalSetup: './test/setup-test.ts',
  globalTeardown: './test/tear-down-test.ts',
};