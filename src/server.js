import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectMongoDB } from './db/connectMongoDB.js';
import { httpLogger, logger } from './middleware/logger.js';
import notesRouter from './routes/notesRoutes.js';
import notFoundHandler from './middleware/notFoundHandler.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

// Middleware
app.use(httpLogger);
app.use(express.json());
app.use(cors());

// Routes
app.use(notesRouter);

// 404 middleware (after all routes, before error handler)
app.use(notFoundHandler);

// Error handling middleware (last)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectMongoDB();
  } catch (err) {
    logger.error(err, 'Failed to connect to MongoDB');
    process.exit(1);
  }

  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
};

startServer();
