import express, { Application as ExpressApplication, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { createConnection } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Application as AppEntity } from './models/Application';
import { User } from './models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Use an environment variable in production

// Extend the Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: { userId: number }
    }
  }
}

class Server {
  private app: ExpressApplication;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
    this.database();
    this.start();
  }

  private config(): void {
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }

  private routes(): void {
    this.app.post('/api/register', this.register);
    this.app.post('/api/login', this.login);
    this.app.get('/api/applications', this.authenticateToken, this.getApplications);
    this.app.post('/api/applications', this.authenticateToken, this.createApplication);
  }

  private async register(req: Request, res: Response): Promise<void> {
    const { username, password, email } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = User.create({ username, password: hashedPassword, email });
      await user.save();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Registration failed' });
    }
  }

  private async login(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ where: { username } });
      if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
  }

  private authenticateToken(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
      res.sendStatus(401);
      return;
    }

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) {
        res.sendStatus(403);
        return;
      }
      req.user = user;
      next();
    });
  }

  private async getApplications(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }
      const applications = await AppEntity.find({ where: { userId: req.user.userId } });
      res.json(applications);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch applications' });
    }
  }

  private async createApplication(req: Request, res: Response): Promise<void> {
    const { companyName, position, status } = req.body;
    try {
      if (!req.user) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }
      const application = AppEntity.create({ companyName, position, status, userId: req.user.userId });
      await application.save();
      res.status(201).json(application);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create application' });
    }
  }

  private async database(): Promise<void> {
    // ... (keep your existing database connection code)
  }

  private start(): void {
    this.app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  }
}

new Server();