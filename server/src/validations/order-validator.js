import Joi from 'joi';

const createOrderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        menuItemId: Joi.number().integer().required()
          .messages({
            'any.required': 'ORDER_MENU_ITEM_ID_REQUIRED',
            'number.base': 'ORDER_MENU_ITEM_ID_REQUIRED',
          }),
        quantity: Joi.number().integer().min(1).required()
          .messages({
            'number.min': 'ORDER_ITEM_QUANTITY_MIN',
          }),
      }),
    )
    .min(1)
    .messages({
      'array.min': 'ORDER_ITEMS_REQUIRED',
      'any.required': 'ORDER_ITEMS_REQUIRED',
    })
    .required(),
  deliveryName: Joi.string().trim().required()
    .messages({
      'any.required': 'ORDER_DELIVERY_NAME_REQUIRED',
      'string.empty': 'ORDER_DELIVERY_NAME_REQUIRED',
    }),
  deliveryAddress: Joi.string().trim().required()
    .messages({
      'any.required': 'ORDER_DELIVERY_ADDRESS_REQUIRED',
      'string.empty': 'ORDER_DELIVERY_ADDRESS_REQUIRED',
    }),
  deliveryPhone: Joi.string().trim()
    .pattern(/^[0-9+\-\s()]{6,20}$/)
    .required()
    .messages({
      'any.required': 'ORDER_DELIVERY_PHONE_REQUIRED',
      'string.empty': 'ORDER_DELIVERY_PHONE_REQUIRED',
      'string.pattern.base': 'ORDER_DELIVERY_PHONE_INVALID',
    }),
  notes: Joi.string().optional().allow('', null),
});

const updateOrderStatusSchema = Joi.object({
  id: Joi.number().integer().optional(),
  status: Joi.string()
    .valid('received', 'preparing', 'out_for_delivery', 'delivered', 'cancelled')
    .messages({
      'any.required': 'ORDER_STATUS_REQUIRED',
      'any.only': 'ORDER_STATUS_INVALID',
    })
    .required(),
});

export default {
  createOrderSchema,
  updateOrderStatusSchema,
};
