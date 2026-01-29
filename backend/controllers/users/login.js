// const express = require("express")
// const {connectDB,connectdb} = require("../../database/connection")
// const { sha512, sha384, sha512_256, sha512_224 } = require('js-sha512')

// const route = express.Router()

// route.post('/',connectDB,(req,res)=> {

//     try {let loginQuery = `SELECT * FROM ${req.db}.user WHERE pass = '${sha512(req.body.pass)}' and u_name = '${req.body.field}' or mail = '${req.body.field}'`

//     req.conn.query(loginQuery,(err,result)=> {

//         if(result.length == 1) {
//             return res.json(result)
//         }
//         else {
//             req.conn.end()
//             return res.status(401).json({ message: 'Unauthorized' });
//         }
//     })}
//     catch (error) {
//         console.log(error)
//         return res.status(500).json({message:error})
//     }
// })

// module.exports = route
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

route.post('/', connectDB, (req, res) => {
    try {
        const { field, pass } = req.body;
        const hashedPass = sha512(pass); // Hash the password

        const loginQuery = `
            SELECT * FROM ${req.db}.user WHERE (u_name = ? OR mail = ?) AND pass = ?
        `;

        req.conn.query(loginQuery, [field, field, hashedPass], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            if (result.length === 1) {
                // Generate JWT token
                const user = result[0];
                const token = jwt.sign({ userId: user.mail }, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRY });

                // Send the token in the response
                return res.json({
                    token,
                    message: 'Login successful',
                    user: {
                        id: user.id,
                        username: user.u_name,
                        email: user.mail
                    }
                });
            } else {
                return res.status(401).json({ message: 'Unauthorized' });
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
});

module.exports = route;
