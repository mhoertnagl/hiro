/**
 * Overrides the tsconfig used for the app.
 * In the test environment we need some tweaks.
 */
// const tsNode = require('ts-node')
// const testTSConfig = require('./test/tsconfig.json')

import tsNode from 'ts-node'

tsNode.register({
  files: true,
  transpileOnly: true,
  project: './test/tsconfig.json',
  require: ['tsconfig-paths/register'],
})
