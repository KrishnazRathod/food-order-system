import Joi from 'joi';

const createMenuItemSchema = Joi.object({
  name: Joi.string().trim()
    .min(2)
    .max(100)
    .messages({
      'any.required': 'MENU_NAME_REQUIRED',
      'string.empty': 'MENU_NAME_REQUIRED',
      'string.min': 'MENU_NAME_MIN',
      'string.max': 'MENU_NAME_MAX',
    })
    .required(),
  description: Joi.string()
    .max(500)
    .messages({
      'string.max': 'MENU_DESCRIPTION_MAX',
    })
    .optional()
    .allow('', null),
  price: Joi.number()
    .greater(0)
    .messages({
      'any.required': 'MENU_PRICE_REQUIRED',
      'number.base': 'MENU_PRICE_REQUIRED',
      'number.greater': 'MENU_PRICE_MIN',
    })
    .required(),
  image: Joi.string().optional().allow('', null),
  category: Joi.string()
    .valid('pizza', 'burger', 'drink', 'dessert', 'side')
    .messages({
      'any.required': 'MENU_CATEGORY_REQUIRED',
      'any.only': 'MENU_CATEGORY_INVALID',
    })
    .required(),
  isAvailable: Joi.boolean().optional(),
});

const updateMenuItemSchema = Joi.object({
  id: Joi.number().integer().optional(),
  name: Joi.string().trim().min(2).max(100)
    .messages({
      'string.min': 'MENU_NAME_MIN',
      'string.max': 'MENU_NAME_MAX',
    })
    .optional(),
  description: Joi.string().max(500)
    .messages({
      'string.max': 'MENU_DESCRIPTION_MAX',
    })
    .optional()
    .allow('', null),
  price: Joi.number().greater(0)
    .messages({
      'number.greater': 'MENU_PRICE_MIN',
    })
    .optional(),
  image: Joi.string().optional().allow('', null),
  category: Joi.string()
    .valid('pizza', 'burger', 'drink', 'dessert', 'side')
    .messages({
      'any.only': 'MENU_CATEGORY_INVALID',
    })
    .optional(),
  isAvailable: Joi.boolean().optional(),
});

export default {
  createMenuItemSchema,
  updateMenuItemSchema,
};
