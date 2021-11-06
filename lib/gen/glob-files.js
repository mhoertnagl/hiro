import glob from 'fast-glob';
export default function globFiles(pattern, cwd) {
    return glob(pattern, { cwd: cwd, onlyFiles: true });
}
