const express = require("express");
const userRoute = require("./routes/user");
const commonRoute = require("./routes/common");
const fs = require("fs");
const passport = require('passport');
const session = require('express-session');
const { connectDB, connectdb } = require("./database/connection");
const cors = require("cors");
const rateLimit = require('express-rate-limit');
require("./utils/login_with_google");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3300;
const SESSION_SECRET = process.env.SESSION_SECRET || (() => {
    console.warn('WARNING: SESSION_SECRET not set in environment variables. Using default (INSECURE)');
    return 'default_insecure_session_secret_please_change';
})();

app.listen(PORT, () => {
    console.log("Server started at PORT", PORT);
});

// Session configuration
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(passport.initialize());
app.use(passport.session());

// Rate limiting for authentication endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per window
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again after 15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiting for general API endpoints
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: {
        success: false,
        message: 'Too many requests, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Apply rate limiting to auth routes
app.use('/apis/v1/user/login', authLimiter);
app.use('/apis/v1/user/signup', authLimiter);

// Apply general rate limiting to all API routes
app.use('/apis/v1', apiLimiter);

// Google OAuth callback
app.get('/auth/google/callback',
    (req, res, next) => {
        passport.authenticate('google', (err, user, info) => {
            if (err) {
                return res.status(500).json({ message: "Authentication error", error: err });
            }
            if (!user) {
                return res.status(401).json({ message: "Authentication failed" });
            }
            return res.status(200).json({ message: "Authentication successful" });
        })(req, res, next);
    }
);

// Body parser with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// API routes
app.use('/apis/v1/user', userRoute);
app.use('/apis/v1/common', commonRoute);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err : undefined
    });
});
