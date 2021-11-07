import loadConfig from '../config/load-config.js';
import Generator from '../gen/generator.js';
import watch from '../build/watch.js';
export default async function build(options) {
    const config = await loadConfig();
    const gen = new Generator(config);
    await gen.generateAll();
    if (options.watch) {
        watch(gen);
    }
}
