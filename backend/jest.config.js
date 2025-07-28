module.exports = {
  // Tell Jest what type of files to test
  moduleFileExtensions: ['js', 'json', 'ts'],
  
  // Where to look for test files (any file ending with .spec.ts or .test.ts)
  testRegex: '.*\\.(spec|test)\\.ts$',
  
  // How to transform TypeScript files before testing
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  
  // Test environment (Node.js for backend)
  testEnvironment: 'node',
  
  // Where to save coverage reports
  coverageDirectory: './coverage',
  
  // Which files to include in coverage reports
  collectCoverageFrom: [
    'src/**/*.(t|j)s',
    '!src/**/*.spec.ts',
    '!src/**/*.test.ts',
    '!src/main.ts',
  ],
};
