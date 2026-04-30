import HttpStatus from 'http-status';
import utility from '../services/utility';
import repositories from '../repositories';

const { accountRepository } = repositories;

export default {
  /**
   * User login api
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async login(req, res, next) {
    try {
      const result = await accountRepository.checkLogin(req);
      if (result.token) {
        utility.handleResponse(req, res, true, result, 'LOGIN_SUCCESS', HttpStatus.OK);
      } else if (result.status === 'inactive') {
        utility.handleResponse(req, res, false, [], 'ACCOUNT_INACTIVE', HttpStatus.BAD_REQUEST);
      } else {
        utility.handleResponse(req, res, false, [], 'INVALID_CREDENTIAL', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * User registration api
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async register(req, res, next) {
    try {
      const result = await accountRepository.register(req);
      if (result.token) {
        utility.handleResponse(req, res, true, result, 'SIGNUP_SUCCESS', HttpStatus.CREATED);
      } else if (result.status === 'email_exists') {
        utility.handleResponse(req, res, false, null, 'EMAIL_EXIST', HttpStatus.BAD_REQUEST);
      } else {
        utility.handleResponse(req, res, false, null, 'INTERNAL_ERROR', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get current user profile
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getProfile(req, res, next) {
    try {
      const profile = await accountRepository.getProfile(req);
      utility.handleResponse(req, res, true, profile, 'USER_DETAIL', HttpStatus.OK);
    } catch (error) {
      next(error);
    }
  },
};
