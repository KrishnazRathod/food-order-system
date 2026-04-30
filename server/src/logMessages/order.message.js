import utility from '../services/utility';
import logger from '../services/logger';

export default {
  orderErrorMessage(type, object) {
    const { data } = object;
    const error = utility.jsonToString(object?.error);
    const payload = utility.jsonToString(data);
    let message = '';
    switch (type) {
      case 'orderCreate':
        message = `order create error: ${error}, payload: ${payload}`;
        break;
      case 'orderList':
        message = `order list error: ${error}, payload: ${payload}`;
        break;
      case 'orderDetail':
        message = `order detail error: ${error}, payload: ${payload}`;
        break;
      case 'orderStatusUpdate':
        message = `order status update error: ${error}, payload: ${payload}`;
        break;
      case 'orderCancel':
        message = `order cancel error: ${error}, payload: ${payload}`;
        break;
      default:
        message = `order error ${error}`;
        break;
    }
    logger.dailyLogger('orderError').error(new Error(message));
  },
};
