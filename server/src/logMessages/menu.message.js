import utility from '../services/utility';
import logger from '../services/logger';

export default {
  menuErrorMessage(type, object) {
    const { data } = object;
    const error = utility.jsonToString(object?.error);
    const payload = utility.jsonToString(data);
    let message = '';
    switch (type) {
      case 'menuList':
        message = `menu list error: ${error}, payload: ${payload}`;
        break;
      case 'menuDetail':
        message = `menu detail error: ${error}, payload: ${payload}`;
        break;
      case 'menuCreate':
        message = `menu create error: ${error}, payload: ${payload}`;
        break;
      case 'menuUpdate':
        message = `menu update error: ${error}, payload: ${payload}`;
        break;
      case 'menuDelete':
        message = `menu delete error: ${error}, payload: ${payload}`;
        break;
      default:
        message = `menu error ${error}`;
        break;
    }
    logger.dailyLogger('menuError').error(new Error(message));
  },
};
