const express = require("express");
const { connectDB, connectdb } = require("../../database/connection");
const route = express.Router();
const upload = require('../../utils/multer_setup');
const uploadFile = require('../../utils/google_upload');

// GET all blogs with comments
route.get('/', connectDB, (req, res) => {
    try {
        const getQuery = `
            SELECT b.*, c.comment as comment, c.date as comment_date, u1.u_name as comment_user 
            FROM ${req.db}.blog b
            JOIN ${req.db}.user u1 ON b.u_mail = u1.mail
            LEFT JOIN ${req.db}.comment c ON c.blog_id = b.blog_id
            LEFT JOIN ${req.db}.user u2 ON u2.mail = c.u_mail
        `;

        req.conn.query(getQuery, (err, result) => {
            req.conn.release();

            if (err) {
                console.error('Error fetching blogs:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to fetch blogs',
                    error: process.env.NODE_ENV === 'development' ? err.message : undefined
                });
            }

            if (!result || result.length === 0) {
                return res.json({ success: true, data: [] });
            }

            const blogs = {};
            result.forEach(row => {
                if (!blogs[row.blog_id]) {
                    blogs[row.blog_id] = {
                        blog_id: row.blog_id,
                        title: row.title,
                        content: row.description,
                        user: row.u_mail,
                        image_url: row.image_url,
                        likes: row.likes,
                        date: row.date,
                        comments: []
                    };
                }
                if (row.comment) {
                    blogs[row.blog_id].comments.push({
                        comment: row.comment,
                        comment_date: row.comment_date,
                        comment_user: row.comment_user
                    });
                }
            });

            const blogArray = Object.values(blogs);
            return res.json({ success: true, data: blogArray });
        });
    } catch (error) {
        console.error('Error in get blogs:', error);
        if (req.conn) req.conn.release();
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// GET blog by ID with comments - FIXED SQL INJECTION
route.get('/comment/:blog_id', connectDB, (req, res) => {
    try {
        // Use parameterized query to prevent SQL injection
        const getQuery = `
            SELECT b.*, c.comment as comment, c.date as comment_date, u.u_name as comment_user 
            FROM ${req.db}.blog b
            JOIN ${req.db}.user u1 ON b.u_mail = u1.mail
            LEFT JOIN ${req.db}.comment c ON c.blog_id = b.blog_id
            LEFT JOIN ${req.db}.user u ON u.mail = c.u_mail
            WHERE b.blog_id = ?
            ORDER BY c.date
        `;

        req.conn.query(getQuery, [req.params.blog_id], (err, result) => {
            req.conn.release();

            if (err) {
                console.error('Error fetching blog comments:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to fetch blog comments',
                    error: process.env.NODE_ENV === 'development' ? err.message : undefined
                });
            }

            if (!result || result.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Blog not found'
                });
            }

            const blogs = {};
            result.forEach(row => {
                if (!blogs[row.blog_id]) {
                    blogs[row.blog_id] = {
                        blog_id: row.blog_id,
                        title: row.title,
                        content: row.description,
                        user: row.u_mail,
                        image_url: row.image_url,
                        likes: row.likes,
                        date: row.date,
                        comments: []
                    };
                }
                if (row.comment) {
                    blogs[row.blog_id].comments.push({
                        comment: row.comment,
                        comment_date: row.comment_date,
                        comment_user: row.comment_user
                    });
                }
            });

            const blogArray = Object.values(blogs);
            return res.json({ success: true, data: blogArray });
        });
    } catch (error) {
        console.error('Error in get blog comments:', error);
        if (req.conn) req.conn.release();
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// UPDATE blog likes - FIXED SQL SYNTAX ERROR AND SQL INJECTION
route.put('/:blog_id', connectDB, (req, res) => {
    try {
        // Fixed: Removed "TABLE" keyword and used parameterized query
        const updateQuery = `UPDATE ${req.db}.blog SET likes = likes + 1 WHERE blog_id = ?`;

        req.conn.query(updateQuery, [req.params.blog_id], (err, result) => {
            req.conn.release();

            if (err) {
                console.error('Error updating blog likes:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to update likes',
                    error: process.env.NODE_ENV === 'development' ? err.message : undefined
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Blog not found'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Blog liked successfully!'
            });
        });
    } catch (error) {
        console.error('Error in update blog likes:', error);
        if (req.conn) req.conn.release();
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// POST new blog - FIXED SQL INJECTION
route.post('/',
    upload.single('image'),
    uploadFile,
    connectDB,
    async (req, res) => {
        try {
            // Validate required fields
            if (!req.body.u_mail || !req.body.title || !req.body.description) {
                if (req.conn) req.conn.release();
                return res.status(400).json({
                    success: false,
                    message: 'Email, title, and description are required'
                });
            }

            const today = new Date();
            const yyyy = today.getFullYear();
            let mm = today.getMonth() + 1;
            let dd = today.getDate();

            mm = mm < 10 ? '0' + mm : mm;
            dd = dd < 10 ? '0' + dd : dd;

            const formattedDate = `${yyyy}-${mm}-${dd}`;
            const likes = 0;

            // Use parameterized query to prevent SQL injection
            const insertQuery = `
                INSERT INTO ${req.db}.blog (u_mail, image_url, title, description, likes, date) 
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            const values = [
                req.body.u_mail,
                req.body.image_url || null,
                req.body.title,
                req.body.description,
                likes,
                formattedDate
            ];

            req.conn.query(insertQuery, values, (err, result) => {
                req.conn.release();

                if (err) {
                    console.error('Error creating blog:', err);
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to create blog',
                        error: process.env.NODE_ENV === 'development' ? err.message : undefined
                    });
                }

                return res.status(201).json({
                    success: true,
                    message: 'Blog uploaded successfully',
                    blog_id: result.insertId
                });
            });
        } catch (error) {
            console.error('Error in create blog:', error);
            if (req.conn) req.conn.release();
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
);

// POST comment on blog - FIXED SQL INJECTION
route.post('/comment/:blog_id', connectDB, (req, res) => {
    try {
        // Validate required fields
        if (!req.body.u_mail || !req.body.comment) {
            req.conn.release();
            return res.status(400).json({
                success: false,
                message: 'Email and comment are required'
            });
        }

        const today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1;
        let dd = today.getDate();

        mm = mm < 10 ? '0' + mm : mm;
        dd = dd < 10 ? '0' + dd : dd;

        const formattedDate = `${yyyy}-${mm}-${dd}`;

        // Use parameterized query to prevent SQL injection
        const insertQuery = `
            INSERT INTO ${req.db}.comment (u_mail, comment, blog_id, date) 
            VALUES (?, ?, ?, ?)
        `;

        const values = [
            req.body.u_mail,
            req.body.comment,
            req.params.blog_id,
            formattedDate
        ];

        req.conn.query(insertQuery, values, (err, result) => {
            req.conn.release();

            if (err) {
                console.error('Error creating comment:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to create comment',
                    error: process.env.NODE_ENV === 'development' ? err.message : undefined
                });
            }

            return res.status(201).json({
                success: true,
                message: 'Comment added successfully',
                comment_id: result.insertId
            });
        });
    } catch (error) {
        console.error('Error in create comment:', error);
        if (req.conn) req.conn.release();
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = route;