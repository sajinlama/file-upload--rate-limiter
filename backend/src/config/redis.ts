import { Redis } from 'ioredis';
import dotenv from "dotenv";
dotenv.config()

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error('REDIS_URL environment variable is not set');
}

const redis = new Redis(redisUrl);

redis.on('connect', () => {
  console.log('Connected to Redis successfully!');
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

export default redis;