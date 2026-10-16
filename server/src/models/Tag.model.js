import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Tag name is required'],
            trim: true,
            unique: true,
            maxlength: [30, 'Tag name cannot exceed 30 characters']
        },

        slug: {
            type: String,
            required: [true, 'Slug is required'],
            unique: true,
            trim: true,
            lowercase: true
        }
    },
    {
        timestamps: true
    }
);

const Tag = mongoose.model('Tag', tagSchema);

export default Tag;