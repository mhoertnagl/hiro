import loadConfig from '@/config/load-config.js'
import Generator from '@/gen/generator.js'
import watch from '@/build/watch.js'

export default async function build(options: HiroOptions) {
  const config = await loadConfig()
  const gen = new Generator(config)
  await gen.generateAll()

  if (options.watch) {
    watch(gen)
  }
}

interface HiroOptions {
  watch: boolean
}

// TODO: Add spinnies when building.
// import chalk from 'chalk'
// import Spinnies from 'spinnies'

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
