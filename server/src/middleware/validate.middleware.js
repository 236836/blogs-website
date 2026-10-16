import { errorResponse } from '../utils/apiResponse.js';

export const validateRegister = (req, res, next) => {
    const { name, username, email, password } = req.body;
    const errors = [];

    if (!name || name.trim() === '') {
        errors.push('Name is required');
    } else if (name.length > 50) {
        errors.push('Name cannot exceed 50 characters');
    }

    if (!username || username.trim() === '') {
        errors.push('Username is required');
    } else if (username.length > 30) {
        errors.push('Username cannot exceed 30 characters');
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        errors.push('Username can only contain letters numbers and underscores');
    }

    if (!email || email.trim() === '') {
        errors.push('Email is required');
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
        errors.push('Please enter a valid email');
    }

    if (!password || password.trim() === '') {
        errors.push('Password is required');
    } else if (password.length < 6) {
        errors.push('Password must be at least 6 characters');
    }

    if (errors.length > 0) {
        return errorResponse(res, 400, 'Validation failed', errors);
    }

    next();
};

export const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    const errors = [];

    if (!email || email.trim() === '') {
        errors.push('Email is required');
    }

    if (!password || password.trim() === '') {
        errors.push('Password is required');
    }

    if (errors.length > 0) {
        return errorResponse(res, 400, 'Validation failed', errors);
    }

    next();
};

export const validateBlog = (req, res, next) => {
    const { title, content, category } = req.body;
    const errors = [];

    if (!title || title.trim() === '') {
        errors.push('Blog title is required');
    } else if (title.length > 200) {
        errors.push('Title cannot exceed 200 characters');
    }

    if (!content || content.trim() === '') {
        errors.push('Blog content is required');
    }

    if (!category) {
        errors.push('Category is required');
    }

    if (errors.length > 0) {
        return errorResponse(res, 400, 'Validation failed', errors);
    }

    next();
};

export const validateComment = (req, res, next) => {
    const { content } = req.body;
    const errors = [];

    if (!content || content.trim() === '') {
        errors.push('Comment content is required');
    } else if (content.length > 1000) {
        errors.push('Comment cannot exceed 1000 characters');
    }

    if (errors.length > 0) {
        return errorResponse(res, 400, 'Validation failed', errors);
    }

    next();
};