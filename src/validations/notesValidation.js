import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';
import { TAGS } from '../constants/tags.js';

// Custom validator: value must be a valid MongoDB ObjectId
const objectIdValidator = (value, helpers) => {
  if (!isValidObjectId(value)) {
    return helpers.message('Invalid id format');
  }
  return value;
};

const tagRule = Joi.string()
  .valid(...TAGS)
  .messages({
    'any.only': `Tag must be one of: ${TAGS.join(', ')}`,
    'string.base': 'Tag must be a string',
  });

// GET /notes — query string
export const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1).messages({
      'number.base': 'Page must be a number',
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be at least 1',
    }),
    perPage: Joi.number().integer().min(5).max(20).default(10).messages({
      'number.base': 'PerPage must be a number',
      'number.integer': 'PerPage must be an integer',
      'number.min': 'PerPage must be at least 5',
      'number.max': 'PerPage must be at most 20',
    }),
    tag: tagRule.optional().allow(''),
    search: Joi.string().allow('').optional(),
  }),
};

// GET /notes/:noteId, DELETE /notes/:noteId — route params
export const noteIdSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required(),
  }),
};

// POST /notes — request body
export const createNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).required().messages({
      'string.base': 'Title must be a string',
      'string.min': 'Title should have at least 1 character',
      'any.required': 'Title is required',
    }),
    content: Joi.string().allow('').optional(),
    tag: tagRule.optional(),
  }),
};

// PATCH /notes/:noteId — route params + request body
export const updateNoteSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required(),
  }),
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).optional().messages({
      'string.base': 'Title must be a string',
      'string.min': 'Title should have at least 1 character',
    }),
    content: Joi.string().allow('').optional(),
    tag: tagRule.optional(),
  })
    .min(1)
    .messages({
      'object.min':
        'At least one of the fields title, content or tag is required',
    }),
};
