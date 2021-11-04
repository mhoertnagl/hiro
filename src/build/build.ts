// import chalk from 'chalk'
// import Spinnies from 'spinnies'
// import chokidar from 'chokidar'

import loadConfig from '@/config/load-config.js'
import Generator from '@/gen/generator.js'

export default async function build() {
  const config = await loadConfig()
  const gen = new Generator(config)
  await gen.generateAll()
  // await loadConfig()
  // chokidarTest()
  // spinnnerTest()
}

// function chokidarTest() {
//   chokidar
//     .watch(['content/**/*', 'layouts/**/*', 'public/**/*'], {
//       persistent: true,
//     })
//     .on('add', (path) => {
//       console.log('Created: ' + path)
//     })
//     .on('change', (path) => {
//       console.log('Changed: ' + path)
//     })
// }

// function spinnnerTest() {
//   const spinnies = new Spinnies()

//   spinnies.add('spinner-1', { text: 'I am a spinner' })
//   spinnies.add('spinner-2', { text: 'I am another spinner' })

//   setTimeout(() => {
//     spinnies.succeed('spinner-1', { text: 'Success!' })
//     spinnies.fail('spinner-2', { text: 'Fail :(' })
//   }, 2000)

//   console.log(chalk.green('Test'))
// }
