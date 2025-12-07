import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { config } from './config';
import './config/database';
import authRoutes from './modules/auth/routes';
import userRoutes from './modules/users/routes';
import vehicleRoutes from './modules/vehicles/routes';
import bookingRoutes from './modules/bookings/routes';

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

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/vehicles', vehicleRoutes);
app.use('/api/v1/bookings', bookingRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    errors: 'The requested endpoint does not exist',
  });
});

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});

export default app;
