import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import { connectMongoDB } from './db/connectMongoDB.js';
import { httpLogger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRouter from './routes/notesRoutes.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express();

// Middleware
app.use(httpLogger);
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Routes
app.use(authRouter);
app.use(notesRouter);
app.use(userRouter);

// 404 middleware (after all routes, before error handler)
app.use(notFoundHandler);

// Validation error handling (celebrate)
app.use(errors());

// Error handling middleware (last)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectMongoDB();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
