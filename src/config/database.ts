import { Pool } from 'pg';
import { config } from './index';

// Use DATABASE_URL if available (for production), otherwise use individual config
export const pool = config.database.connectionString
  ? new Pool({
      connectionString: config.database.connectionString,
      ssl: config.database.ssl,
    })
  : new Pool({
      host: config.database.host,
      port: config.database.port,
      user: config.database.user,
      password: config.database.password,
      database: config.database.database,
      ssl: config.database.ssl,
    });

pool.on('connect', () => {
  console.log('Database connected successfully');
});

pool.on('error', (err: Error) => {
  console.error('Unexpected database error:', err);
});
