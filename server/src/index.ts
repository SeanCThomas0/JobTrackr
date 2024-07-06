import bcrypt from 'bcryptjs'; // Import bcryptjs instead of bcrypt
import cors from 'cors';
import express from 'express';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

const app = express();
const port = process.env.PORT || 5000;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Job Application Tracker API');
});

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the new user with the hashed password
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id',
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error during registration:', err);
    if (err.code === '23505') { // unique_violation error code
      res.status(400).json({ error: 'Username or email already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});
// User login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      // Make sure we're using the correct column name here
      const storedHash = user.password_hash; // Changed from user.password to user.password_hash
      if (!storedHash) {
        console.error('Stored password hash is undefined for user:', username);
        return res.status(500).json({ error: 'Internal server error' });
      }
      // Compare the provided password with the stored hash
      const isMatch = await bcrypt.compare(password, storedHash);
      if (isMatch) {
        // Here, you would typically create and send a JWT token
        // For now, we'll just send a success message
        res.json({ message: 'Login successful' });
      } else {
        res.status(400).json({ error: 'Invalid credentials' });
      }
    } else {
      res.status(400).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Middleware to verify JWT token
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Get all applications for a user
app.get('/applications', authenticateToken, async (req: any, res) => {
  try {
    const result = await pool.query('SELECT * FROM applications WHERE user_id = $1', [req.user.userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a new application
app.post('/applications', authenticateToken, async (req: any, res) => {
  const { company, position, status } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO applications (user_id, company, position, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.userId, company, position, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update an application
app.put('/applications/:id', authenticateToken, async (req: any, res) => {
  const { id } = req.params;
  const { company, position, status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE applications SET company = $1, position = $2, status = $3 WHERE id = $4 AND user_id = $5 RETURNING *',
      [company, position, status, id, req.user.userId]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Application not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
