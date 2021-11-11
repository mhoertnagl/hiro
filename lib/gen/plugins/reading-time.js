import computeReadingTime from 'reading-time';
export default function readingTime() {
    return (tree, file) => {
        file.data.readTime = computeReadingTime(String(file));
    };
}
