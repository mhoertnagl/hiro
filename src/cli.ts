#!/usr/bin/env node

import { Command } from 'commander'
import build from '@/build/build.js'

export default function run(args: string[]) {
  const program = new Command()

  program
    .version('1.0.0')
    .command('build')
    .option('-w, --watch', 'Watch for file changes', false)
    .description('Builds the static site')
    .action(build)

  program.parse(args)
}

run(process.argv)
