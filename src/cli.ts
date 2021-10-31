import { Command } from 'commander'
import build from './build/build'

export function cli(args: string[]) {
  const program = new Command()

  program
    .command('build')
    .option('-w, --watch', 'Watch for file changes', false)
    .description('Builds the static site')
    .action(build)

  program.parse(args)
}
