import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { config } from './config';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Vehicle Rental System API',
    status: 'running',
  });
});

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});

export default app;
