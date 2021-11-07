import chokidar from 'chokidar'

import Generator from '@/gen/generator.js'

export default function watch(gen: Generator) {
  console.log('Watching for file changes ...')
  registerContentWatcher(gen)
  registerLayoutsWatcher(gen)
  registerAssetsWatcher(gen)
}

function registerContentWatcher(gen: Generator) {
  chokidar
    .watch('content/**/*', { persistent: true })
    .on('change', async (path) => {
      await gen.generateContent(path)
      await gen.generateIndex()
    })
}

function registerLayoutsWatcher(gen: Generator) {
  chokidar
    .watch('layouts/**/*', { persistent: true })
    .on('change', async (path) => {
      await gen.generateAllContent()
      await gen.generateIndex()
    })
}

function registerAssetsWatcher(gen: Generator) {
  chokidar
    .watch('public/**/*', { persistent: true })
    .on('change', async (path) => await gen.copyAssets())
}
