import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import pino from 'pino';

const isDev = process.env.NODE_ENV !== 'production';

const logger = pino({
  name: 'http',
  level: process.env.LOG_LEVEL || 'info',
  transport: isDev
    ? { target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:HH:MM:ss' } }
    : undefined,
});

const app = express();

// Middleware
app.use(pinoHttp({ logger }));
app.use(cors());
app.use(express.json());

// Routes
app.get('/notes', (req, res) => {
  res.status(200).json({ message: 'Retrieved all notes' });
});

app.get('/notes/:noteId', (req, res) => {
  res
    .status(200)
    .json({ message: `Retrieved note with ID: ${req.params.noteId}` });
});

// Test route for simulating an error
app.get('/test-error', () => {
  throw new Error('Simulated server error');
});

// 404 middleware (after all routes, before error handler)
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware (last)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  logger.error(err, 'Error handling request');
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});