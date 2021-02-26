const config = require('./jest.config')

module.exports = {
  ...config,
  testMatch: ['**/*.spec.ts']
}
