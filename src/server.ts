import cluster from "cluster";
import http, { Server } from 'http';
import os from 'os';
import app, { logger } from "./app";
import mongoose from "mongoose";

const numCPUs = os.cpus().length;
const connectToMongoDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/mydatabase')
    logger.info("Connected to MongoDB")
  } catch (error) {
    logger.error(`Connection error ${error}`)
  }
}

const shutdown = async (server: Server) => {
  logger.info(`Shutting down gracefully`);
  await mongoose.disconnect()
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
  const server = http.createServer(app);
  const port = process.env.PORT || 4500;
  connectToMongoDB();

  server.listen(port, () => {
    logger.info(`Server running on port ${port}`);
  })

  process.on('SIGINT', async () => shutdown(server));
  process.on('SIGTERM', async () => shutdown(server))
}