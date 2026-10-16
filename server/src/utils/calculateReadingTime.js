const calculateReadingTime = (content) => {
    const wordsPerMinute = 200;

    const plainText = content.replace(/<[^>]*>/g, '');

    const wordCount = plainText
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length;

    const readingTime = Math.ceil(wordCount / wordsPerMinute);

    return readingTime < 1 ? 1 : readingTime;
};

export default calculateReadingTime;