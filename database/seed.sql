-- 1. 20 Institutions
INSERT INTO institutions (name)
SELECT 'University of ' || name
FROM (VALUES 
    ('Tech'), ('Science'), ('Arts'), ('Engineering'), ('Medicine'), 
    ('Business'), ('Design'), ('History'), ('Law'), ('Philosophy'),
    ('Northern'), ('Southern'), ('Eastern'), ('Western'), ('Central'),
    ('Coastal'), ('Mountain'), ('Urban'), ('Global'), ('Pacific')
) AS t(name);

-- 2. 5 Departments per Institution (100 total)
INSERT INTO departments (name, institution_id)
SELECT d.dept, i.id
FROM institutions i
CROSS JOIN (VALUES 
    ('Computer Science'), ('Mathematics'), ('Physics'), 
    ('Literature'), ('Economics')
) AS d(dept);

-- 3. 3 Professors per Department (300 total)
INSERT INTO professors (name, department_id, institution_id)
SELECT 
    'Prof. ' || substr(md5(random()::text), 1, 6),
    d.id,
    d.institution_id
FROM departments d
CROSS JOIN generate_series(1, 3);

-- 4. 8 Courses per Department (800 total)
INSERT INTO courses (name, code, department_id, institution_id, level)
SELECT 
    (ARRAY['Intro to ', 'Advanced ', 'Topic: ', 'Seminar in '])[floor(random() * 4 + 1)] || d.name,
    substr(d.name, 1, 2) || (100 + i),
    d.id,
    d.institution_id,
    (ARRAY['100', '200', '300', '400'])[floor(random() * 4 + 1)]
FROM departments d
CROSS JOIN generate_series(1, 8) i;

-- 5. Linking (Junction Table)
INSERT INTO course_professors (course_id, professor_id)
SELECT c.id, p.id
FROM courses c
JOIN professors p ON p.department_id = c.department_id
WHERE random() < 0.5 -- Most courses have 1-2 professors assigned
ON CONFLICT DO NOTHING;

-- 6. 500 Users
INSERT INTO users (username, email, password_hash, isAdmin)
SELECT 
    'user_' || i,
    'user' || i || '@example.com',
    '$2b$10$fixed_hash_for_speed',
    (i <= 5) -- First 5 users are Admins
FROM generate_series(1, 500) i;

-- 7. RANDOMIZED Reviews (Approx 3,000 - 5,000 total)
-- Some classes get 0 reviews, some get up to 12.
INSERT INTO reviews (user_id, course_id, professor_id, rating, title, content, flags, created_at)
SELECT 
    u.id,
    c.id,
    (SELECT professor_id FROM course_professors WHERE course_id = c.id LIMIT 1),
    floor(random() * 5 + 1),
    'Review by ' || u.username,
    'This class was ' || (ARRAY['great', 'okay', 'bad', 'hard'])[floor(random() * 4 + 1)],
    CASE WHEN random() < 0.1 THEN floor(random() * 15) ELSE 0 END, -- 10% chance of being flagged
    now() - (random() * (interval '365 days'))
FROM courses c
CROSS JOIN LATERAL (
    SELECT id, username FROM users ORDER BY random() LIMIT floor(random() * 12)
) u
WHERE EXISTS (SELECT 1 FROM course_professors WHERE course_id = c.id);

-- 8. 50 Reports (For your Admin Dashboard)
INSERT INTO reports (user_id, review_id, reason)
SELECT 
    (SELECT id FROM users ORDER BY random() LIMIT 1),
    (SELECT id FROM reviews WHERE flags > 0 ORDER BY random() LIMIT 1),
    (ARRAY['Spam', 'Harassment', 'False Info', 'Inappropriate'])[floor(random() * 4 + 1)]
FROM generate_series(1, 50) i;
