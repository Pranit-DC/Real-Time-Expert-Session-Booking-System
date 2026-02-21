import dotenv from 'dotenv';
import http from 'http';
import mongoose from 'mongoose';
import app from './src/app';
import connectDB from './src/config/db';
import { initSocket } from './src/utils/socketManager';

dotenv.config();

const PORT = process.env.PORT || 5000;

// catch async errors that escaped try/catch
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

// catch sync throws that escaped try/catch
process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught Exception:', err.message);
  process.exit(1);
});

const start = async (): Promise<void> => {
  await connectDB();

  // Wrap Express in native http.Server so Socket.io can share the same port
  const server = http.createServer(app);
  initSocket(server);

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  // graceful shutdown — lets in-flight requests finish before exiting
  // needed for Docker/PM2/k8s rolling restarts
  const shutdown = async (signal: string): Promise<void> => {
    console.log(`${signal} received, shutting down...`);
    server.close(async () => {
      await mongoose.disconnect();
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => { void shutdown('SIGTERM'); });
  process.on('SIGINT', () => { void shutdown('SIGINT'); });
};

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
