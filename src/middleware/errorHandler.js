import { HttpError } from 'http-errors';

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    console.error(`HttpError: ${err.message}`);
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  // Multer errors are plain Errors; map to 400 instead of a generic 500.
  if (err.code === 'LIMIT_FILE_SIZE') {
    console.error('Multer error:', err.message);
    res.status(400).json({ message: 'File too large' });
    return;
  }
  if (err.message === 'Only images allowed') {
    console.error('Multer error:', err.message);
    res.status(400).json({ message: 'Only images allowed' });
    return;
  }

  console.error('Unexpected error:', err);
  res.status(500).json({ message: 'Internal server error' });
};
