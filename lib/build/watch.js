import chokidar from 'chokidar';
export default function watch(gen) {
    console.log('Watching for file changes ...');
    registerContentWatcher(gen);
    registerLayoutsWatcher(gen);
    registerAssetsWatcher(gen);
}
function registerContentWatcher(gen) {
    chokidar
        .watch('content/**/*', { persistent: true })
        .on('change', (path) => gen.generateContent(path));
}
function registerLayoutsWatcher(gen) {
    chokidar
        .watch('layouts/**/*', { persistent: true })
        .on('change', (path) => gen.generateAll());
}
function registerAssetsWatcher(gen) {
    chokidar
        .watch('public/**/*', { persistent: true })
        .on('change', (path) => gen.copyAssets());
}
