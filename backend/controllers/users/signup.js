const express = require("express");
const { connectDB } = require("../../database/connection");
const { validateSignup } = require("../../utils/validation");
const { sha512 } = require('js-sha512');

const route = express.Router();

// Note: Validation is now handled by middleware in routes/user.js
route.post('/', connectDB, (req, res) => {
    try {
        // Use parameterized query to prevent SQL injection
        const signUpQuery = `INSERT INTO ${req.db}.user (roll_number, u_name, mail, pass) VALUES (?, ?, ?, ?)`;
        const values = [
            req.body.roll_number,
            req.body.u_name,
            req.body.mail,
            sha512(req.body.pass)
        ];

        req.conn.query(signUpQuery, values, (err, result) => {
            req.conn.release();

            if (err) {
                console.error('Signup error:', err);

                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({
                        success: false,
                        message: 'Email already registered'
                    });
                }

                if (err.code === 'ER_CHECK_CONSTRAINT_VIOLATED') {
                    return res.status(400).json({
                        success: false,
                        message: 'Please use a valid @iitj.ac.in email address'
                    });
                }

                return res.status(500).json({
                    success: false,
                    message: 'Failed to create user',
                    error: process.env.NODE_ENV === 'development' ? err.message : undefined
                });
            }

            return res.status(201).json({
                success: true,
                message: 'User signed up successfully!'
            });
        });
    } catch (error) {
        console.error('Signup error:', error);
        if (req.conn) req.conn.release();
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = route;
