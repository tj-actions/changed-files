const path = require('path')

process.env.GITHUB_WORKSPACE = path.join(
  path.resolve(__dirname, '..'), '.'
)
process.env.GITHUB_ACTION_PATH = path.join(
  path.resolve(__dirname, '..'), '.'
)
