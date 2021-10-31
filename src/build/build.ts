// import chalk from 'chalk'
// import Spinnies from 'spinnies'
// import { cosmiconfig } from 'cosmiconfig'
// import HiroConfig from '@/config/hiro-config'
import chokidar from 'chokidar'

export default async function () {
  // await loadConfig()

  chokidar
    .watch(['content/**/*', 'layouts/**/*', 'public/**/*'], {
      persistent: true,
    })
    .on('add', (path) => {
      console.log('Created: ' + path)
    })
    .on('change', (path) => {
      console.log('Changed: ' + path)
    })

  // spinnnerTest()
}

// async function loadConfig() {
//   const moduleName = 'hiro'
//   const explorer = cosmiconfig(moduleName, {
//     searchPlaces: [
//       `${moduleName}.config.json`,
//       `${moduleName}.config.yaml`,
//       `${moduleName}.config.yml`,
//     ],
//   })
//   const result = await explorer.search()
//   let config = new HiroConfig()
//   if (result && result.config) {
//     config = Object.assign<HiroConfig, HiroConfig>(config, result.config)
//   }
//   console.log(config)
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
