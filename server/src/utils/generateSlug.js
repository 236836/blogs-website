import slugify from 'slugify';

const generateSlug = (text) => {
    const slug = slugify(text, {
        lower: true,
        strict: true,
        trim: true
    });

    const randomNum = Math.floor(Math.random() * 10000);

    return `${slug}-${randomNum}`;
};

export default generateSlug;