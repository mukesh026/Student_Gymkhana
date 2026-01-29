const { body, param, validationResult } = require('express-validator');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

// Validation rules for user signup
const validateSignup = [
    body('roll_number')
        .trim()
        .notEmpty().withMessage('Roll number is required')
        .isLength({ min: 3, max: 50 }).withMessage('Roll number must be between 3 and 50 characters'),

    body('u_name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 150 }).withMessage('Name must be between 2 and 150 characters'),

    body('mail')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Must be a valid email')
        .normalizeEmail()
        .custom((value) => {
            if (!value.endsWith('@iitj.ac.in')) {
                throw new Error('Email must be from @iitj.ac.in domain');
            }
            return true;
        }),

    body('pass')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

    handleValidationErrors
];

// Validation rules for user login
const validateLogin = [
    body('field')
        .trim()
        .notEmpty().withMessage('Username or email is required'),

    body('pass')
        .notEmpty().withMessage('Password is required'),

    handleValidationErrors
];

// Validation rules for blog creation
const validateBlog = [
    body('u_mail')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Must be a valid email'),

    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),

    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ min: 10 }).withMessage('Description must be at least 10 characters long'),

    handleValidationErrors
];

// Validation rules for comment creation
const validateComment = [
    body('u_mail')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Must be a valid email'),

    body('comment')
        .trim()
        .notEmpty().withMessage('Comment is required')
        .isLength({ min: 1, max: 1000 }).withMessage('Comment must be between 1 and 1000 characters'),

    param('blog_id')
        .isInt({ min: 1 }).withMessage('Invalid blog ID'),

    handleValidationErrors
];

// Validation rules for blog ID parameter
const validateBlogId = [
    param('blog_id')
        .isInt({ min: 1 }).withMessage('Invalid blog ID'),

    handleValidationErrors
];

module.exports = {
    validateSignup,
    validateLogin,
    validateBlog,
    validateComment,
    validateBlogId,
    handleValidationErrors
};
