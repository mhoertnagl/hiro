import { matter } from 'vfile-matter';
export default function frontMatter() {
    return (tree, file) => {
        matter(file, { strip: true });
    };
}
