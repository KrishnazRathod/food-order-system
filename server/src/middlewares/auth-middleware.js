import HttpStatus from 'http-status';
import jwt from '../services/jwt';
import utility from '../services/utility';
import models from '../models';

const { user } = models;

/**
 * Authorization jwt token verification
 * Simplified: no userDevice table lookup
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
const authValidateRequest = async (req, res, next) => {
  try {
    if (req.headers && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2) {
        const scheme = parts[0];
        const token = parts[1];

        if (/^Bearer$/i.test(scheme)) {
          const decodedToken = await jwt.verifyToken(token);
          if (decodedToken) {
            const userResult = await user.findOne({
              where: { id: decodedToken.id, status: 'active' },
              include: [
                {
                  model: models.userRole,
                  required: true,
                  include: [
                    {
                      model: models.role,
                      required: true,
                    },
                  ],
                },
              ],
            });
            if (userResult) {
              req.user = userResult;
              req.userRole = userResult.userRole.role.dataValues.role;
              next();
            } else {
              const error = new Error();
              error.status = HttpStatus.UNAUTHORIZED;
              error.message = utility.getMessage(req, false, 'ACCOUNT_INACTIVE');
              next(error);
            }
          } else {
            const error = new Error('TOKEN_NOT_FOUND');
            error.status = HttpStatus.BAD_REQUEST;
            error.message = utility.getMessage(req, false, 'UNAUTHORIZED_ACCESS');
            next(error);
          }
        } else {
          const error = new Error('TOKEN_BAD_FORMAT');
          error.status = HttpStatus.UNAUTHORIZED;
          error.message = utility.getMessage(req, false, 'SESSION_EXPIRE');
          next(error);
        }
      } else {
        const error = new Error('TOKEN_BAD_FORMAT');
        error.status = HttpStatus.UNAUTHORIZED;
        error.message = utility.getMessage(req, false, 'UNAUTHORIZED_USER_ACCESS');
        next(error);
      }
    } else {
      const error = new Error('TOKEN_NOT_FOUND');
      error.status = HttpStatus.BAD_REQUEST;
      error.message = utility.getMessage(req, false, 'UNAUTHORIZED_ACCESS');
      next(error);
    }
  } catch (error) {
    error.status = HttpStatus.UNAUTHORIZED;
    next(error);
  }
};
export default authValidateRequest;
