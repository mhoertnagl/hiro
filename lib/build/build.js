import loadConfig from '../config/load-config.js';
import Generator from '../gen/generator.js';
export default async function build() {
    const config = await loadConfig();
    const gen = new Generator(config);
    await gen.generateAll();
}
