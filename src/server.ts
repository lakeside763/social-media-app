import * as dotenv from 'dotenv';
dotenv.config();

import cluster from "cluster";
import http, { Server } from 'http';
import os from 'os';
import app, { logger } from "./app";
import mongoose from "mongoose";
import Redis from 'ioredis';
import { redisConfig } from './config';
import followersNotificationQueue from './queues/notification.queue';

export const redisClient = new Redis(redisConfig)
export const server = http.createServer(app);

const numCPUs = os.cpus().length;
export const connectToMongoDB = async () => {
  try {
    await mongoose.connect(`${process.env.DB_URI}`)
    logger.info("Connected to MongoDB")
  } catch (error) {
    logger.error(`Connection error ${error}`)
  }
}

const shutdown = async (server: Server) => {
  logger.info(`Shutting down gracefully`);
  await mongoose.disconnect();
  await followersNotificationQueue.close();
  server.close();
  return process.exit();
}

if (cluster.isPrimary && process.env.NODE_ENV === 'production') {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    logger.info(`Worker ${worker.process.pid} died`)
  })
} else {
  const port = process.env.PORT;
  connectToMongoDB();

  redisClient.on('connect', () => logger.info('Redis connected'))
  redisClient.on('error', (err) => logger.error('Redis connection failed', err))

  server.listen(port, () => {
    logger.info(`Server running on port ${port}`);
  })

  process.on('SIGINT', async () => shutdown(server));
  process.on('SIGTERM', async () => shutdown(server))
}