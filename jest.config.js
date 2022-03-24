const nextJest = require('next/jest')

// Provides the path to Next.js app, which enables
// loading `next.config.js` and `.env` files
const createJestConfig = nextJest({ dir: './' })

// Custom config to be passed to Jest
const jestConfig = {
  testEnvironment:    'jsdom',
  testMatch:          [ '<rootDir>/tests/**/?(*.)test.js' ],
  moduleDirectories:  [ 'node_modules', './' ],
  moduleNameMapper:   { '^@/(.*)$': '<rootDir>/src/$1' },
  setupFilesAfterEnv: [ '<rootDir>/tests/setup.js' ]
}

// Exporting `createJestConfig` this way ensures that `next/jest`
// can load the Next.js config which is async
module.exports = createJestConfig(jestConfig)
