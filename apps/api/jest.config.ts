import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  testEnvironment: 'node',
  collectCoverage: true,
  coverageReporters: ['text', 'json-summary', 'json'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$'
};

export default config;


