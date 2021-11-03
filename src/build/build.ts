// import chalk from 'chalk'
// import Spinnies from 'spinnies'
// import chokidar from 'chokidar'

// import { read } from 'to-vfile'
import { reporter } from 'vfile-reporter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import remarkStringify from 'rehype-stringify'

// Get file path:
//   if it is a markdown file
//
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

function compileMarkdown(src: string, out: string) {}

function compileHandlebars(src: string, out: string) {}

// class Generator {
//   private compileMarkdown(src: string, out: string) {}

//   private compileHandlebars(src: string, out: string) {}
// }

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
