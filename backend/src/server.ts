import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { createConnection } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Application as JobApplication } from './models/Application';

const PORT = process.env.PORT || 8000;

class Server {
  private app: Application;

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
    this.app.get('/', (req: Request, res: Response) => {
      res.send('Welcome to your application tracking API.');
    });

    this.app.get('/applications', async (req: Request, res: Response) => {
      try {
        const applications = await JobApplication.find();
        res.json(applications);
      } catch (error) {
        res.status(500).send('Error fetching applications');
      }
    });
  }

  private async database(): Promise<void> {
    try {
      const connectionOptions: PostgresConnectionOptions = {
        type: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: parseInt(process.env.POSTGRES_PORT as string, 10),
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        synchronize: true,
        logging: true,
        entities: [JobApplication],
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
