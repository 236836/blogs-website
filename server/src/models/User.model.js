import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            maxlength: [50, 'Name cannot exceed 50 characters']
        },

        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
            trim: true,
            lowercase: true,
            maxlength: [30, 'Username cannot exceed 30 characters']
        },

        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true
        },

        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false
        },

        avatar: {
            type: String,
            default: ''
        },

        avatarPublicId: {
            type: String,
            default: ''
        },

        bio: {
            type: String,
            maxlength: [200, 'Bio cannot exceed 200 characters'],
            default: ''
        },

        socialLinks: {
            twitter: { type: String, default: '' },
            github: { type: String, default: '' },
            linkedin: { type: String, default: '' },
            website: { type: String, default: '' }
        },

        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        },

        isBlocked: {
            type: Boolean,
            default: false
        },

        isEmailVerified: {
            type: Boolean,
            default: false
        },

        emailVerifyToken: {
            type: String,
            default: null
        },

        resetPasswordToken: {
            type: String,
            default: null
        },

        resetPasswordExpire: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model('User', userSchema);

export default User;