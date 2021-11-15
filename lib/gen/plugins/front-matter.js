import { matter } from 'vfile-matter';
export default function frontMatter() {
    return (tree, file) => {
        const f = matter(file, { strip: true });
        file.data = f.data;
        file.value = f.value;
    };
}
