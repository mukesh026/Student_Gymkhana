const express = require("express");
const { connectDB } = require("../../database/connection");
const { sha512 } = require('js-sha512');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const route = express.Router();

// Get JWT secret from environment variable
const JWT_SECRET_KEY = process.env.JWT_SECRET || (() => {
    console.warn('WARNING: JWT_SECRET not set in environment variables. Using default (INSECURE)');
    return 'default_insecure_secret_please_change';
})();
const JWT_EXPIRY = process.env.JWT_EXPIRY || '1h';

// Note: Validation is now handled by middleware in routes/user.js
route.post('/', connectDB, (req, res) => {
    try {
        const { field, pass } = req.body;
        const hashedPass = sha512(pass);

        const loginQuery = `
            SELECT * FROM ${req.db}.user WHERE (u_name = ? OR mail = ?) AND pass = ?
        `;

        req.conn.query(loginQuery, [field, field, hashedPass], (err, result) => {
            req.conn.release();

            if (err) {
                console.error('Login error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Internal server error'
                });
            }

            if (result.length === 1) {
                const user = result[0];
                const token = jwt.sign({ userId: user.mail }, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRY });

                return res.json({
                    success: true,
                    token,
                    message: 'Login successful',
                    user: {
                        username: user.u_name,
                        email: user.mail,
                        roll_number: user.roll_number
                    }
                });
            } else {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        if (req.conn) req.conn.release();
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = route;
