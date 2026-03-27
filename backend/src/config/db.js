const { Pool } = require('pg');

require('dotenv').config();

const ON_LOCAL = process.env.ONLOCAL === 'true';
if (ON_LOCAL) {
    console.log('Running in local development mode');
} else {
    console.log('Running in production mode');
}

const poolConfig = ON_LOCAL ? {
    user: process.env.DB_USER || 'root',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'mainDB',
    password: process.env.DB_PASSWORD || 'rootpassword',
    port: process.env.DB_PORT || 5432,
} : {
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
};

const pool = new Pool(poolConfig);

module.exports = pool;