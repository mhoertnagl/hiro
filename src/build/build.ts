import chalk from 'chalk'
import Spinnies from 'spinnies'

export default async function () {
  const spinnies = new Spinnies()

  spinnies.add('spinner-1', { text: 'I am a spinner' })
  spinnies.add('spinner-2', { text: 'I am another spinner' })

  setTimeout(() => {
    spinnies.succeed('spinner-1', { text: 'Success!' })
    spinnies.fail('spinner-2', { text: 'Fail :(' })
  }, 2000)

  console.log(chalk.green('Test'))
}
