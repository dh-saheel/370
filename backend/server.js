const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const auth = require('./auth');

const institutionRoutes = require('./src/routes/InstitutionRoutes');
const departmentRoutes = require('./src/routes/DepartmentRoutes');
const couresRoutes = require('./src/routes/CourseRoutes');
const professorRoutes = require('./src/routes/ProfessorRoutes');

require('dotenv').config();
    
const app = express();

// cors configuration to allow requests from the frontend
app.use(cors());

/* Allow preflight requests */
//app.options('*', cors());

app.use(express.json());

app.use('/api/auth', auth); 
app.use('/api/institutions', institutionRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/courses', couresRoutes);
app.use('/api/professors', professorRoutes);

// PostgreSQL connection pool
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
});

const connectWithRetry = () => {
    console.log('Attempting to connect to the database...');
    pool.connect((err, client, release) => {
        if (err) {
            console.error('Database connection failed. Retrying in 5 seconds...', err.stack);
            setTimeout(connectWithRetry, 5000);
        } else {
            console.log('Successfully connected to the database!');

            /* Start the server after DB is ready */
            app.listen(process.env.PORT || 5000, '0.0.0.0', () => console.log(`Server running on port ${process.env.PORT || 5000}`));
        }
    });
};

connectWithRetry();

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to PostgreSQL database');
    }
});


app.get('/', (req, res) => {
    res.json({ message: 'Hello, World!' });
});

// handler for new review creation
app.post('/api/reviews', async (req, res) => {
    const {
        rating,
        title,
        content,
        assignments,
        exams,
        labs,
        courseId = 1,
        professorId = 1,
        userId = 1
    } = req.body;

    // checking required fields
    if (!rating || !title || !content) {
        return res.status(400).json({ 
            message: 'Missing required fields: rating, title, content' 
        });
    }

    // checking rating range
    if (rating < 1 || rating > 5) {
        return res.status(400).json({ 
            message: 'Rating must be between 1 and 5' 
        });
    }

    try {
        // inserting review into database, currently using placeholder values
        const query = `
            INSERT INTO reviews (user_id, course_id, professor_id, rating, title, content, assignments, exams, labs)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *;
        `;

        const values = [
            userId,
            courseId,
            professorId,
            parseInt(rating),
            title,
            content,
            assignments || '[@NA]',
            exams || '[@NA]',
            labs || '[@NA]'
        ];

        const result = await pool.query(query, values);
        const newReview = result.rows[0];

        console.log('Review created:', newReview);
        res.status(201).json({ 
            message: 'Review created successfully', 
            data: newReview 
        });
    } catch (err) {
        console.error('Error creating review:', err);
        res.status(500).json({ 
            message: 'Error creating review', 
            error: err.message 
        });
    }
});

/* "GET" handler to fetch reviews */
app.get('/api/reviews', async (req, res) => {
    const { courseId, search } = req.query;

    try {
        /* Build query with JOINs for rich course and professor data */
        let query = `
            SELECT
                reviews.*,
                courses.name AS course_name,
                courses.code AS course_code,
                professors.name AS professor_name
            FROM reviews
                JOIN courses ON reviews.course_id = courses.id
                JOIN professors ON reviews.professor_id = professors.id
        `;

        let values = [];

        /* Filter by courseId if provided */
        if (courseId) {
            query += ` WHERE reviews.course_id = $1`;
            values.push(courseId);
        } else if (search && search.trim() !== '') {
            /* Otherwise apply text search across course, professor, and review fields */
            query += `
                WHERE
                    courses.name ILIKE $1 OR
                    courses.code ILIKE $1 OR
                    professors.name ILIKE $1 OR
                    reviews.title ILIKE $1 OR
                    reviews.content ILIKE $1
            `;
            values.push(`%${search.trim()}%`);
        }

        query += ` ORDER BY reviews.created_at DESC`;

        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching reviews:', err);
        res.status(500).json({
            message: 'Error fetching reviews',
            error: err.message
        });
    }
});



/* "PATCH" handler to flag one review */
app.patch('/api/reviews/:id/flag', async (req, res) =>  {
    const { id } = req.params;

    try {
        /* Increase the flags count by 1 for the selected review */
        const result = await pool.query(
            `UPDATE reviews
            SET flags = COALESCE(flags, 0) + 1
            WHERE id = $1
            RETURNING *`,
            [id]
        );

        /* If no review was found, return an error */
        if (result.rowCount === 0) {
            return res.status(404).json({
                message: 'Review not found'
            });
        }

        /* Return the updated review */
        res.status(200).json({
            message: 'Review flagged successfully',
            data: result.rows[0]
        });
    } catch (err) {
        console.error('Error flagging review:', err);
        res.status(500).json({
            message: 'Error flagging review',
            error: err.message
        });
    }
});

/* "PATCH" handler to UNFLAG one review */
app.patch('/api/reviews/:id/unflag', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `UPDATE reviews
            SET flags = 0
            WHERE id = $1
            RETURNING *`,
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: 'Review not found'
            });
        }

        res.status(200).json({
            message: 'Review unflagged successfully',
            data: result.rows[0]
        });
    } catch (err) {
        console.error('Error unflagging review:', err);
        res.status(500).json({
            message: 'Error unflagging review',
            error: err.message
        });
    }
});


/* "GET" handler to fetch reports */
app.get('/api/admin/reports', (req, res) => {
    let {limit=20, timeSort='created_desc', flagSort='flags_desc'} = req.query;
    let sqlQuery = `SELECT * FROM admin_reports_view`;
    let queryArguments = [];
    
    let flagSortType;
    if (flagSort == 'flags_desc') {
        flagSortType = 'DESC';
    }
    else if (flagSort == 'flags_asc') {
        flagSortType = 'ASC';
    }

    let timeSortType;
    if (timeSort == 'created_desc') {
      timeSortType = 'DESC';
    }
    else if (timeSort == 'created_asc') {
      timeSortType = 'ASC';
    }
    sqlQuery += ` ORDER BY review_flags ${flagSortType}, report_created_at ${timeSortType}, report_id DESC`;
    
    sqlQuery += ` LIMIT $1`;
    queryArguments.push(parseInt(limit));

    /* Ask the database for all rows in the reviews table */
    pool.query(sqlQuery, queryArguments, (err, result) => {
        if (err) {
            /* Tells the frontend about errors */
            res.status(500).send(err);
        } else {
            /* Otherwise ends the rows of data to the frontend */
            res.json(result.rows);
        }
    });
});

/* Deletes the report. */
app.delete('/api/admin/reports/:id', async (req, res) => {
    const {id} = req.params;

    let sqlQuery = 'DELETE FROM reports WHERE review_id = $1';
    let queryArguments = [id];

    pool.query(sqlQuery, queryArguments, (err, result) => {
        if (err) {
            /* Tells the frontend about errors */
            res.status(500).send(err);
        }
        else if (result.rowCount <= 0) {
            res.status(404).json({ error: 'Report not found' });
        }
    });

    sqlQuery = 'UPDATE reviews SET flags = 0 WHERE id = $1'
    pool.query(sqlQuery, queryArguments, (err, result) => {
        if (err) {
            /* Tells the frontend about errors */
            res.status(500).send(err);
        } 
        else if (result.rowCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Report not found' });
        }
    });
});

/* Deletes both the report to the review and the review itself. */
app.delete('/api/admin/reviews/:id', async (req, res) => {
    const {id} = req.params;

    let sqlQuery = 'DELETE FROM reports WHERE review_id = $1';
    let queryArguments = [id];

    pool.query(sqlQuery, queryArguments, (err, result) => {
        if (err) {
            /* Tells the frontend about errors */
            res.status(500).send(err);
        }
        else if (result.rowCount <= 0) {
            res.status(404).json({ error: 'Report not found' });
        }
    });

    sqlQuery = 'DELETE FROM reviews WHERE id = $1';
    pool.query(sqlQuery, queryArguments, (err, result) => {
        if (err) {
            /* Tells the frontend about errors */
            res.status(500).send(err);
        } 
        else if (result.rowCount <= 0) {
            res.status(404).json({ error: 'Review not found' });
        } else {
            res.status(204).send();
        }
    });
});

/* Bans a user based on the user ID. */
app.patch('/api/admin/users/:id', async (req, res) => {
    const {id} = req.params;

    let sqlQuery = 'UPDATE users SET isBanned = true WHERE id = $1';
    let queryArguments = [id];

    pool.query(sqlQuery, queryArguments, (err, result) => {
        if (err) {
            /* Tells the frontend about errors */
            res.status(500).send(err);
        }
        else if (result.rowCount > 0) {
            res.status(200).send();
        } else {
            res.status(404).json({ error: 'User not found'})
        }
    });
});
