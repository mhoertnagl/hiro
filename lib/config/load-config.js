import { cosmiconfig } from 'cosmiconfig';
import HiroConfig from '../config/hiro-config.js';
import { normalize } from '../utils/file-paths.js';
const Options = {
    searchPlaces: ['hiro.config.yaml', 'hiro.config.yml', 'hiro.config.json'],
};
export default async function loadConfig() {
    const explorer = cosmiconfig('hiro', Options);
    const result = await explorer.search();
    let config = new HiroConfig();
    if (result && result.config) {
        config = Object.assign(config, result.config);
    }
    config.outDir = normalize(config.outDir);
    return config;
}
