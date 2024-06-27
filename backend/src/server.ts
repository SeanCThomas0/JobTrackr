import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { createConnection } from 'typeorm';
import applicationRoutes from './routes/applicationRoutes';

const PORT = process.env.PORT || 3000;

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
    this.app.use('/api/applications', applicationRoutes);
    this.app.get('/', (req: Request, res: Response) => {
      res.send('Welcome to your application tracking API.');
    });
  }

  private async database(): Promise<void> {
    try {
      await createConnection({
        type: 'postgres',
        host: 'postgres', // Ensure this matches your Kubernetes service name or Docker Compose service name
        port: 5432,
        username: 'sean',
        password: 'thomas09',
        database: 'job_application_db',
        synchronize: true, // Set to false in production
        logging: true,
        entities: [__dirname + '/models/*.js'], // Adjust based on your models path
      });
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
