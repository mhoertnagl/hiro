// import chalk from 'chalk'
// import Spinnies from 'spinnies'
// import { cosmiconfig } from 'cosmiconfig'
// import HiroConfig from '@/config/hiro-config'
// import chokidar from 'chokidar'

// import { read } from 'to-vfile'
import { reporter } from 'vfile-reporter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import remarkStringify from 'rehype-stringify'

export default async function () {
  // await loadConfig()
  // chokidarTest()
  // spinnnerTest()
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(remarkStringify)

  // const input = await read('example.md')
  const output = await processor.process('# Test')

  console.error(reporter(output))
  console.log(String(output))
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
