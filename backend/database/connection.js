const mysql = require("mysql2");
require("dotenv").config();

// Create connection pool for better performance
const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "gymkhana",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Legacy function for backward compatibility
function connectdb() {
    const connection = mysql.createConnection({
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || "gymkhana"
    });

    connection.connect(function (err) {
        if (err) {
            console.error('Database connection error:', err);
            return [null, err];
        }
        console.log("Connection established");
    });

    return [connection, process.env.DB_NAME || "gymkhana"];
}

// Middleware to provide database connection from pool
const connectDB = function (req, res, next) {
    pool.getConnection(function (err, connection) {
        if (err) {
            console.error('Database connection error:', err);
            return res.status(500).json({
                success: false,
                message: 'Database connection failed',
                error: process.env.NODE_ENV === 'development' ? err.message : undefined
            });
        }

        console.log("Connection established from pool");
        req.conn = connection;
        req.db = process.env.DB_NAME || "gymkhana";
        next();
    });
};

// Graceful shutdown
process.on('SIGTERM', () => {
    pool.end((err) => {
        if (err) {
            console.error('Error closing pool:', err);
        } else {
            console.log('Database pool closed');
        }
        process.exit(err ? 1 : 0);
    });
});

module.exports = { connectDB, connectdb, pool };
