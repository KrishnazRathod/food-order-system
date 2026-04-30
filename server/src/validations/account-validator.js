import Joi from 'joi';

const loginSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: false } })
    .min(6)
    .max(50)
    .messages({
      'string.empty': 'EMAIL_REQUIRED',
      'any.required': 'EMAIL_REQUIRED',
      'string.email': 'VALID_EMAIL_ALLOWED',
      'string.min': 'EMAIL_MIN_VALIDATION',
      'string.max': 'EMAIL_MAX_VALIDATION',
    })
    .required(),
  password: Joi.string()
    .messages({
      'string.empty': 'PASSWORD_REQUIRED',
      'any.required': 'PASSWORD_REQUIRED',
    })
    .required(),
});

const registerSchema = Joi.object({
  firstName: Joi.string().trim()
    .min(2)
    .max(50)
    .messages({
      'any.required': 'FIRST_NAME_REQUIRED',
      'string.empty': 'FIRST_NAME_REQUIRED',
      'string.min': 'FIRST_NAME_MIN_VALIDATION',
      'string.max': 'FIRST_NAME_MAX_VALIDATION',
    })
    .required(),
  lastName: Joi.string().trim()
    .min(2)
    .max(50)
    .messages({
      'any.required': 'LAST_NAME_REQUIRED',
      'string.empty': 'LAST_NAME_REQUIRED',
      'string.min': 'LAST_NAME_MIN_VALIDATION',
      'string.max': 'LAST_NAME_MAX_VALIDATION',
    })
    .required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: false } })
    .min(6)
    .max(50)
    .messages({
      'any.required': 'EMAIL_REQUIRED',
      'string.empty': 'EMAIL_REQUIRED',
      'string.email': 'VALID_EMAIL_ALLOWED',
      'string.min': 'EMAIL_MIN_VALIDATION',
      'string.max': 'EMAIL_MAX_VALIDATION',
    })
    .required(),
  password: Joi.string()
    .min(6)
    .max(50)
    .messages({
      'string.empty': 'PASSWORD_REQUIRED',
      'any.required': 'PASSWORD_REQUIRED',
      'string.min': 'PASSWORD_MIN_VALIDATION',
      'string.max': 'PASSWORD_MAX_VALIDATION',
    })
    .required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .messages({
      'string.empty': 'CONFIRM_PASSWORD_REQUIRED',
      'any.required': 'CONFIRM_PASSWORD_REQUIRED',
      'any.only': 'PASSWORD_NOT_MATCH',
    })
    .required(),
});

export default {
  loginSchema,
  registerSchema,
};
