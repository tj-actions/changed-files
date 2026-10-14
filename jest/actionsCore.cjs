const actual = require('./shims/core.cjs')

const wrapped = {__esModule: true}
for (const key of Object.keys(actual)) {
  Object.defineProperty(wrapped, key, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: actual[key]
  })
}

module.exports = wrapped
