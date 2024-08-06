import bcrypt from 'bcryptjs';
import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

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

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set");
}

app.get('/', (req, res) => {
  res.send('Job Application Tracker API');
});

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id',
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error during registration:', err);
    if (err.code === '23505') {
      res.status(400).json({ error: 'Username or email already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedHash = user.password_hash;
      if (!storedHash) {
        console.error('Stored password hash is undefined for user:', username);
        return res.status(500).json({ error: 'Internal server error' });
      }

      const isMatch = await bcrypt.compare(password, storedHash);
      if (isMatch) {
        const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
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

// Middleware to authenticate token and attach user info to request
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    // Attach user info to request object using a symbol
    (req as any)._user = user;
    next();
  });
};

const getUserFromRequest = (req: Request) => {
  return (req as any)._user;
};

app.get('/applications', authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = getUserFromRequest(req);
    const result = await pool.query('SELECT * FROM applications WHERE user_id = $1', [user.userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/applications', authenticateToken, async (req: Request, res: Response) => {
  const { company, position, status, applied_date, notes } = req.body;
  
  // Validate required fields
  if (!company || !position || !status || !applied_date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const user = getUserFromRequest(req);
    const result = await pool.query(
      'INSERT INTO applications (user_id, company, position, status, applied_date, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [user.userId, company, position, status, applied_date, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/applications/:id', authenticateToken, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { company, position, status, applied_date, notes } = req.body;
  try {
    const user = getUserFromRequest(req);
    const result = await pool.query(
      'UPDATE applications SET company = $1, position = $2, status = $3, applied_date = $4, notes = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 AND user_id = $7 RETURNING *',
      [company, position, status, applied_date, notes, id, user.userId]
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

app.delete('/applications/:id', authenticateToken, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = getUserFromRequest(req);
    const result = await pool.query(
      'DELETE FROM applications WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, user.userId]
    );
    if (result.rows.length > 0) {
      res.json({ message: 'Application deleted successfully' });
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
