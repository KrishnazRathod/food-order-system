const DATE_TIME_FORMATE = {
  ONLY_DATE: 'YYYY-MM-DD',
  DATE_AND_TIME: 'YYYY-MM-DD HH:mm:ss',
};

const ROLE = {
  ADMIN: 'admin',
  USER: 'user',
};

const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DELETED: 'deleted',
  INVALID: 'invalid',
  UPDATED: 'updated',
};

const ORDER_STATUS = {
  RECEIVED: 'received',
  PREPARING: 'preparing',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

const ORDER_STATUS_FLOW = [
  ORDER_STATUS.RECEIVED,
  ORDER_STATUS.PREPARING,
  ORDER_STATUS.OUT_FOR_DELIVERY,
  ORDER_STATUS.DELIVERED,
];

const MENU_CATEGORY = {
  PIZZA: 'pizza',
  BURGER: 'burger',
  DRINK: 'drink',
  DESSERT: 'dessert',
  SIDE: 'side',
};

export default {
  DATE_TIME_FORMATE,
  ROLE,
  STATUS,
  ORDER_STATUS,
  ORDER_STATUS_FLOW,
  MENU_CATEGORY,
};
