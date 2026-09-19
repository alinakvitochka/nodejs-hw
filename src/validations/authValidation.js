import { Joi, Segments } from 'celebrate';

const passwordRule = Joi.string().min(8).required().messages({
  'string.base': 'Password must be a string',
  'string.min': 'Password should have at least 8 characters',
  'any.required': 'Password is required',
});

const emailRule = Joi.string().email().required().messages({
  'string.email': 'Email must be a valid email address',
  'any.required': 'Email is required',
});

// POST /auth/register — request body
export const registerUserSchema = {
  [Segments.BODY]: Joi.object({
    email: emailRule,
    password: passwordRule,
  }),
};

// POST /auth/login — request body
export const loginUserSchema = {
  [Segments.BODY]: Joi.object({
    email: emailRule,
    password: Joi.string().required().messages({
      'string.base': 'Password must be a string',
      'any.required': 'Password is required',
    }),
  }),
};

// POST /auth/request-reset-email — request body
export const requestResetEmailSchema = {
  [Segments.BODY]: Joi.object({
    email: emailRule,
  }),
};

// POST /auth/reset-password — request body
export const resetPasswordSchema = {
  [Segments.BODY]: Joi.object({
    password: passwordRule,
    token: Joi.string().required().messages({
      'string.base': 'Token must be a string',
      'any.required': 'Token is required',
    }),
  }),
};
