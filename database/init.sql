-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create applications table with user_id foreign key
CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    company VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    applied_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default data
INSERT INTO users (username, email, password_hash) VALUES
('john_doe', 'john@example.com', 'hashed_password_1'),
('jane_smith', 'jane@example.com', 'hashed_password_2');

INSERT INTO applications (user_id, company, position, status, applied_date, notes) VALUES
(1, 'Tech Corp', 'Software Engineer', 'Applied', '2023-07-01', 'Sent application via their website'),
(1, 'Innovate Inc', 'Full Stack Developer', 'Interview', '2023-07-05', 'Phone interview scheduled for next week'),
(2, 'Data Systems', 'Data Analyst', 'Applied', '2023-07-03', 'Waiting for response'),
(2, 'Web Solutions', 'Frontend Developer', 'Rejected', '2023-06-28', 'Position filled internally');