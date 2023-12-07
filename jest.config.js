/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['lib/'],
  globalSetup: './test/setup/setup.js',
  globalTeardown: './test/setup/teardown.js',
};