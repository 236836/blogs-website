import { v2 as cloudinary } from 'cloudinary';

export const uploadImage = async (fileBuffer, folder) => {
    try {
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: `blogflow/${folder}`,
                    resource_type: 'image',
                    transformation: [
                        { quality: 'auto' },
                        { fetch_format: 'auto' }
                    ]
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

            uploadStream.end(fileBuffer);
        });

        return {
            url: result.secure_url,
            publicId: result.public_id
        };

    } catch (error) {
        console.error(`❌ Upload failed: ${error.message}`);
        throw new Error('Image upload failed');
    }
};

export const deleteImage = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
        console.log(`✅ Image deleted: ${publicId}`);
    } catch (error) {
        console.error(`❌ Delete failed: ${error.message}`);
        throw new Error('Image deletion failed');
    }
};