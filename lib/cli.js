#!/usr/bin/env node
import { Command } from 'commander';
import build from './build/build.js';
export default function run(args) {
    const program = new Command();
    program
        .name('hiro')
        .description('A simple static site generator.')
        .version('1.0.0')
        .command('build')
        .option('-w, --watch', 'Watch for file changes', false)
        .description('Builds the static site')
        .action(build);
    program.parse(args);
}
run(process.argv);
