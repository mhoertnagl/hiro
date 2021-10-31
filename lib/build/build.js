import chokidar from 'chokidar';
export default async function () {
    chokidar
        .watch(['content/**/*', 'layouts/**/*', 'public/**/*'], {
        persistent: true,
    })
        .on('add', (path) => {
        console.log('Created: ' + path);
    })
        .on('change', (path) => {
        console.log('Changed: ' + path);
    });
}
