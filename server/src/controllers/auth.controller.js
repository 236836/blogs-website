import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/User.model.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { uploadImage, deleteImage } from '../utils/uploadToCloudinary.js';

// ─────────────────────────────────────────────────────────
// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
// ─────────────────────────────────────────────────────────
export const registerUser = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        // Step 1: Check if email already exists
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return errorResponse(res, 400, 'Email already registered');
        }

        // Step 2: Check if username already exists
        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return errorResponse(res, 400, 'Username already taken');
        }

        // Step 3: Hash the password before saving
        // Never save plain password in database
        // genSalt(12) = how strong encryption is
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Step 4: Create new user in database
        const user = await User.create({
            name,
            username,
            email,
            password: hashedPassword
        });

        // Step 5: Generate JWT token for this user
        const token = generateToken(user._id);

        // Step 6: Send success response
        return successResponse(res, 201, 'Registration successful', {
            token,
            user: {
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
                bio: user.bio,
                socialLinks: user.socialLinks,
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        console.error('Register Error:', error.message);
        return errorResponse(res, 500, 'Registration failed. Try again');
    }
};


// ─────────────────────────────────────────────────────────
// @route   POST /api/auth/login
// @desc    Login user and return token
// @access  Public
// ─────────────────────────────────────────────────────────
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Step 1: Find user by email
        // .select('+password') because password field
        // has select:false in model
        // so we need to explicitly ask for it
        const user = await User.findOne({ email }).select('+password');

        // Step 2: Check if user exists
        if (!user) {
            return errorResponse(res, 401, 'Invalid email or password');
        }

        // Step 3: Check if user is blocked by admin
        if (user.isBlocked) {
            return errorResponse(
                res,
                403,
                'Your account has been blocked. Contact support'
            );
        }

        // Step 4: Compare entered password with hashed password
        const isPasswordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordMatch) {
            return errorResponse(res, 401, 'Invalid email or password');
        }

        // Step 5: Generate JWT token
        const token = generateToken(user._id);

        // Step 6: Send success response
        return successResponse(res, 200, 'Login successful', {
            token,
            user: {
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
                bio: user.bio,
                socialLinks: user.socialLinks,
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        console.error('Login Error:', error.message);
        return errorResponse(res, 500, 'Login failed. Try again');
    }
};


// ─────────────────────────────────────────────────────────
// @route   GET /api/auth/me
// @desc    Get current logged in user profile
// @access  Private (needs token)
// ─────────────────────────────────────────────────────────
export const getMe = async (req, res) => {
    try {
        // req.user is set by authMiddleware
        // authMiddleware runs before this function
        // and attaches the user to req.user
        const user = await User.findById(req.user._id);

        if (!user) {
            return errorResponse(res, 404, 'User not found');
        }

        return successResponse(
            res,
            200,
            'Profile fetched successfully',
            { user }
        );

    } catch (error) {
        console.error('GetMe Error:', error.message);
        return errorResponse(res, 500, 'Failed to fetch profile');
    }
};


// ─────────────────────────────────────────────────────────
// @route   PUT /api/auth/update-profile
// @desc    Update user profile info and avatar
// @access  Private (needs token)
// ─────────────────────────────────────────────────────────
export const updateProfile = async (req, res) => {
    try {
        const { name, username, bio, socialLinks } = req.body;

        // Check if new username is taken by another user
        if (username) {
            const usernameExists = await User.findOne({
                username,
                // $ne = not equal
                // exclude current user from check
                _id: { $ne: req.user._id }
            });

            if (usernameExists) {
                return errorResponse(res, 400, 'Username already taken');
            }
        }

        // Build update object
        // Only add fields that were provided
        const updateData = {};
        if (name) updateData.name = name;
        if (username) updateData.username = username;
        if (bio !== undefined) updateData.bio = bio;
        if (socialLinks) updateData.socialLinks = socialLinks;

        // Handle avatar image upload
        if (req.file) {
            // Delete old avatar from cloudinary first
            if (req.user.avatarPublicId) {
                await deleteImage(req.user.avatarPublicId);
            }

            // Upload new avatar to cloudinary
            const uploaded = await uploadImage(
                req.file.buffer,
                'avatars'
            );
            updateData.avatar = uploaded.url;
            updateData.avatarPublicId = uploaded.publicId;
        }

        // Update user in database
        // new: true means return updated user not old one
        // runValidators: true means run schema validations
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            updateData,
            { new: true, runValidators: true }
        );

        return successResponse(
            res,
            200,
            'Profile updated successfully',
            { user: updatedUser }
        );

    } catch (error) {
        console.error('UpdateProfile Error:', error.message);
        return errorResponse(res, 500, 'Profile update failed');
    }
};


// ─────────────────────────────────────────────────────────
// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private (needs token)
// ─────────────────────────────────────────────────────────
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Validate both fields exist
        if (!currentPassword || !newPassword) {
            return errorResponse(
                res,
                400,
                'Current password and new password are required'
            );
        }

        // Validate new password length
        if (newPassword.length < 6) {
            return errorResponse(
                res,
                400,
                'New password must be at least 6 characters'
            );
        }

        // Get user with password from database
        const user = await User.findById(req.user._id).select('+password');

        // Check if current password is correct
        const isMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isMatch) {
            return errorResponse(
                res,
                400,
                'Current password is incorrect'
            );
        }

        // Hash new password
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(newPassword, salt);

        // Save updated user
        await user.save();

        return successResponse(
            res,
            200,
            'Password changed successfully'
        );

    } catch (error) {
        console.error('ChangePassword Error:', error.message);
        return errorResponse(res, 500, 'Password change failed');
    }
};


// ─────────────────────────────────────────────────────────
// @route   POST /api/auth/forgot-password
// @desc    Send password reset link to email
// @access  Public
// ─────────────────────────────────────────────────────────
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return errorResponse(res, 400, 'Email is required');
        }

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return errorResponse(
                res,
                404,
                'No account found with this email'
            );
        }

        // Generate a random reset token
        // crypto is built into Node.js no install needed
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Hash the token before saving to database
        // We save hashed version for security
        // We send plain version to email
        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Save hashed token and expiry to user
        user.resetPasswordToken = hashedToken;
        // Token expires in 15 minutes
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
        await user.save();

        // Create reset URL that we send in email
        const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        // Email HTML template
        const html = `
            <div style="font-family: Arial, sans-serif; 
                        max-width: 600px; 
                        margin: 0 auto;
                        padding: 20px;">
                <h2 style="color: #4F46E5;">
                    Password Reset Request
                </h2>
                <p>
                    You requested to reset your password 
                    for your BlogFlow account.
                </p>
                <p>
                    Click the button below to reset your password:
                </p>
                <a href="${resetURL}"
                   style="background-color: #4F46E5; 
                          color: white;
                          padding: 12px 24px; 
                          text-decoration: none;
                          border-radius: 6px; 
                          display: inline-block; 
                          margin: 16px 0;">
                    Reset Password
                </a>
                <p style="color: #666;">
                    This link expires in 
                    <strong>15 minutes</strong>.
                </p>
                <p style="color: #666;">
                    If you did not request this, 
                    please ignore this email.
                </p>
                <hr style="border: 1px solid #eee; margin: 20px 0;">
                <p style="color: #999; font-size: 12px;">
                    BlogFlow Team
                </p>
            </div>
        `;

        // Send the email
        await sendEmail({
            to: user.email,
            subject: 'BlogFlow - Password Reset Request',
            html
        });

        return successResponse(
            res,
            200,
            'Password reset email sent. Check your inbox'
        );

    } catch (error) {
        console.error('ForgotPassword Error:', error.message);

        // If email fails clear the reset token from database
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            user.resetPasswordToken = null;
            user.resetPasswordExpire = null;
            await user.save();
        }

        return errorResponse(
            res,
            500,
            'Email could not be sent. Try again'
        );
    }
};


// ─────────────────────────────────────────────────────────
// @route   PUT /api/auth/reset-password/:token
// @desc    Reset password using token from email
// @access  Public
// ─────────────────────────────────────────────────────────
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        if (!newPassword) {
            return errorResponse(res, 400, 'New password is required');
        }

        if (newPassword.length < 6) {
            return errorResponse(
                res,
                400,
                'Password must be at least 6 characters'
            );
        }

        // Hash the token from URL
        // to compare with hashed token in database
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // Find user with this token
        // Also check token is not expired
        // $gt = greater than (expire time must be in future)
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return errorResponse(
                res,
                400,
                'Invalid or expired reset token. Please request again'
            );
        }

        // Hash new password
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(newPassword, salt);

        // Clear reset token fields
        user.resetPasswordToken = null;
        user.resetPasswordExpire = null;

        // Save user with new password
        await user.save();

        return successResponse(
            res,
            200,
            'Password reset successful. You can now login'
        );

    } catch (error) {
        console.error('ResetPassword Error:', error.message);
        return errorResponse(res, 500, 'Password reset failed. Try again');
    }
};