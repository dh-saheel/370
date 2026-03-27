CREATE TABLE institutions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE
);

CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    institution_id INT NOT NULL,
    FOREIGN KEY (institution_id) REFERENCES institutions(id)
);

CREATE TABLE professors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    department_id INT,
    institution_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (institution_id) REFERENCES institutions(id)
);

CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL,
    department_id INT,
    institution_id INT,
    level VARCHAR(20), 
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (institution_id) REFERENCES institutions(id)
);

CREATE TABLE course_professors (
    course_id INT NOT NULL,
    professor_id INT NOT NULL,
    PRIMARY KEY (course_id, professor_id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (professor_id) REFERENCES professors(id)
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    isAdmin BOOLEAN DEFAULT FALSE,
    isBanned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    professor_id INT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    likes INT DEFAULT 0,
    dislikes INT DEFAULT 0,
    flags INT DEFAULT 0,
    assignments TEXT,
    exams TEXT,
    labs TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (professor_id) REFERENCES professors(id)
);

CREATE TABLE review_votes (
    user_id INT NOT NULL,
    review_id INT NOT NULL,
    is_like BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (review_id) REFERENCES reviews(id),
    UNIQUE (user_id, review_id)
);

CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    review_id INT NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (review_id) REFERENCES reviews(id)
);

CREATE OR REPLACE VIEW admin_reports_view AS
SELECT 
    report.id AS report_id,
    report.review_id AS review_id,
    user_author.id AS review_author_id,
    report.reason AS report_reason,
    report.created_at AS report_created_at,
    user_reporter.username AS reporter_name,
    user_author.username AS review_author,
    user_author.isBanned AS is_banned,
    review.title AS review_title,
    review.content AS review_body,
    review.assignments AS review_assignments,
    review.labs AS review_labs,
    review.exams AS review_exams,
    review.flags AS review_flags,
    review.created_at AS review_created_at,
    professor.name AS professor_name,
    course.name AS course_name
FROM reports AS report
JOIN users AS user_reporter ON report.user_id = user_reporter.id
JOIN reviews AS review ON report.review_id = review.id
JOIN users AS user_author ON review.user_id = user_author.id
JOIN professors AS professor ON review.professor_id = professor.id
JOIN courses AS course ON review.course_id = course.id;

-- dummy institutions
INSERT INTO institutions (name) VALUES 
('University of Saskatchewan');

-- dummy departments
INSERT INTO departments (name, institution_id) VALUES
('Computer Science', 1);

-- Add a dummy user
INSERT INTO users (username, email, password_hash) VALUES 
('test', 'test@example.com', 'password');

INSERT INTO users (username, email, password_hash) VALUES 
('user2', 'test2@example.com', 'password');

-- Add dummy professors
INSERT INTO professors (name, department_id, institution_id) VALUES
('Dr. John Smith', 1, 1);

-- Add dummy courses
INSERT INTO courses (name, code, department_id, institution_id, level) VALUES
('Introduction to Programming', 'CMPT141', 1, 1, 'Undergraduate');

INSERT INTO courses (name, code, department_id, institution_id, level) VALUES
('Data Structures', 'CMPT 145', 1, 1, 'Undergraduate');

-- Add dummy course-professor relationships
INSERT INTO course_professors (course_id, professor_id) VALUES
(1, 1);

-- Add dummy reviews
INSERT INTO reviews (user_id, course_id, professor_id, rating, title, content, flags, assignments, exams, labs) VALUES
(1, 1, 1, 5, 'Test Review', 'Test Review Content',  4, 'Test Assignments', 'Test Exams', 'Test Labs');

INSERT INTO reviews (user_id, course_id, professor_id, rating, title, content, flags, assignments, exams, labs) VALUES
(2, 1, 1, 5, '2', '2',  2, '2', '2', '2');

INSERT INTO reviews (user_id, course_id, professor_id, rating, title, content, assignments, exams, labs) VALUES
(1, 1, 1, 5, 'Test Review', 'Test Review Content', 'Test Assignments', 'Test Exams', 'Test Labs');

INSERT INTO reviews(user_id, course_id, professor_id, rating, title, content, assignments, exams, labs) VALUES
(1,1,1,5,'Test Review 2', 'Test Review Content', 'Test Assignments','Test Exams', 'Test Labs');

INSERT INTO reviews(user_id, course_id, professor_id, rating, title, content, assignments, exams, labs) VALUES
(1,1,1,5,'Different Title', 'Test Review Content', 'Test Assignments','Test Exams', 'Test Labs');

INSERT INTO reviews(user_id, course_id, professor_id, rating, title, content, assignments, exams, labs) VALUES
(1,1,1,5,'CMPT 141', 'Test Review Content', 'Test Assignments','Test Exams', 'Test Labs');

INSERT INTO reviews(user_id, course_id, professor_id, rating, title, content, assignments, exams, labs) VALUES
(1,1,1,5,'Boring Class', 'Test Review Content', 'Test Assignments','Test Exams', 'Test Labs');

-- Add dummy reports
INSERT INTO reports (user_id, review_id, reason) VALUES
(1, 1, 'This is a test report.');

INSERT INTO reports (user_id, review_id, reason) VALUES
(1, 2, '2');

INSERT INTO reports (user_id, review_id, reason) VALUES
(1, 1, '3');

INSERT INTO reports (user_id, review_id, reason) VALUES
(2, 1, '4');

