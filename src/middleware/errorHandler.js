import { logger } from './logger.js';

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  logger.error(err, 'Error handling request');

  const status = err.status || err.statusCode || 500;

  res.status(status).json({ message: err.message });
};

export default errorHandler;
