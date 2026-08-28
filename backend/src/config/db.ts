import { Pool } from '../../node_modules/@types/pg/index.js';
import dotenv from "dotenv";
dotenv.config()

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({ connectionString });

pool.on('connect', () => {
  console.log('Connected to PostgreSQL successfully!');
});

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL error:', err);
});

export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};

export default pool;