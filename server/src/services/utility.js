import bcrypt from 'bcryptjs';
import dayjs from 'dayjs';
import language from '../language';

export default {
  /**
   * Get the current date in a specified format.
   * @param {string} format - The format to use (default: 'YYYY-MM-DD').
   * @returns {string} - The current date in the specified format.
   */
  getCurrentDateFormat(format) {
    return dayjs().format(format || 'YYYY-MM-DD');
  },

  /**
   * Generate a hash of the given data string.
   * @param {string} dataString - The data string to hash.
   * @returns {Promise<string>} - A promise that resolves to the hashed data.
   */
  async generateHashPassword(dataString) {
    try {
      const salt = await bcrypt.genSalt();
      return await bcrypt.hash(dataString, salt);
    } catch (error) {
      throw new Error(error);
    }
  },

  /**
   * Get a message from the language module.
   * @param {object} req - The request object.
   * @param {object} data - The data for the message.
   * @param {string} key - The message key.
   * @returns {string} - The retrieved message.
   */
  getMessage(req, data, key) {
    let message = '';
    const languageCode = (req.headers && (req.headers.language || req.headers.language)) || 'en';
    if (data) {
      message = language[languageCode] && language.en[`${key}`]
        ? language[languageCode][`${key}`](data)
        : key;
    } else {
      message = language[languageCode] && language.en[`${key}`]
        ? language[languageCode][`${key}`]
        : key;
    }
    return message;
  },

  /**
   * Convert an object to a JSON string or return the object's string representation if not empty.
   * @param {object} obj - The object to convert.
   * @returns {string} - The JSON string or the object's string representation.
   */
  jsonToString(obj = {}) {
    try {
      if (obj && typeof obj === 'object' && Object.keys(obj).length !== 0) {
        return JSON.stringify(obj);
      }
      return Object.keys(obj).length === 0 ? String(obj) : obj;
    } catch (error) {
      throw new Error(error);
    }
  },

  /**
   * Create a custom error with a message and error code.
   * @param {variable} req - The request variable.
   * @param {string} message - The error message.
   * @param {number} errorCode - The error code.
   * @returns {object} - The custom error object.
   */
  customError(req, message, errorCode) {
    return Object.assign(new Error(this.getMessage(req, false, message)), { errorCode });
  },

  /**
   * Custom response function
   * @param {variable} req
   * @param {object} res
   * @param {boolean} success
   * @param {object} data
   * @param {string} message
   * @param {number} status
   */
  handleResponse(req, res, success, data, message, status) {
    res.status(status).json({
      success,
      data,
      message: this.getMessage(req, false, message),
    });
  },
};
