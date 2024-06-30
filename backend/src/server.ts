// backend/src/server.ts

import express, { Application as ExpressApplication, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { createConnection } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Application as AppEntity } from './models/Application';

const PORT = process.env.PORT || 3000;

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
    // Middleware
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }

  private routes(): void {
    // Example route
    this.app.get('/', (req: Request, res: Response) => {
      res.send('Welcome to your application tracking API.');
    });

    // Route to get applications
    this.app.get('/api/applications', async (req: Request, res: Response) => {
      try {
        const applications = await AppEntity.find();
        res.json(applications);
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
  }

  private async database(): Promise<void> {
    try {
      const connectionOptions: PostgresConnectionOptions = {
        type: 'postgres',
        host: 'postgres', // Docker service name
        port: 5432,
        username: 'sean',
        password: 'thomas09',
        database: 'job_application_db',
        synchronize: true, // Set to false in production
        logging: true,
        entities: [__dirname + '/models/*.ts'],
      };

      await createConnection(connectionOptions);
      console.log('Connected to PostgreSQL');
    } catch (error) {
      console.error('Connection to PostgreSQL failed:', error);
    }
  }

  private start(): void {
    this.app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  }
}

new Server();
