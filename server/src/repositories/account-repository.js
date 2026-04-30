import bcrypt from 'bcryptjs';
import jwt from '../services/jwt';
import utility from '../services/utility';
import logMessage from '../logMessages/index';
import models from '../models';
import constant from '../constant';

const { commonConstant } = constant;
const { user, role, userRole } = models;

export default {
  /**
   * Check user email and password for login
   * @param {Object} req
   * @returns {Object} - User data with token or status
   */
  async checkLogin(req) {
    try {
      const { email, password } = req.body;
      const userResult = await user.findOne({
        where: { email, status: { [models.Sequelize.Op.ne]: 'deleted' } },
        include: [
          {
            model: userRole,
            required: true,
            include: [{ model: role, required: true }],
          },
        ],
      });

      if (userResult) {
        if (userResult.status === commonConstant.STATUS.ACTIVE) {
          const isPasswordMatch = await this.compareUserPassword(
            password,
            userResult.password,
          );
          if (isPasswordMatch) {
            const userData = {
              id: userResult.id,
              email: userResult.email,
              firstName: userResult.firstName,
              lastName: userResult.lastName,
            };
            const token = jwt.createToken(userData);
            return {
              token,
              ...userData,
              role: userResult.userRole.role.role,
            };
          }
        } else {
          return { status: commonConstant.STATUS.INACTIVE };
        }
      }
      return { status: commonConstant.STATUS.INVALID };
    } catch (error) {
      logMessage.accountErrorMessage('accountLogin', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },

  /**
   * Register a new user
   * @param {Object} req
   * @returns {Object} - New user data with token
   */
  async register(req) {
    const transaction = await models.sequelize.transaction();
    try {
      const {
        body: {
          firstName, lastName, email, password,
        },
      } = req;

      // Check if email already exists
      const existingUser = await user.findOne({ where: { email } });
      if (existingUser) {
        await transaction.rollback();
        return { status: 'email_exists' };
      }

      // Hash password
      const hashedPassword = await utility.generateHashPassword(password);

      // Create user
      const newUser = await user.create(
        {
          firstName,
          lastName,
          email,
          password: hashedPassword,
        },
        { transaction },
      );

      // Assign user role
      let userRoleRecord = await role.findOne({ where: { role: commonConstant.ROLE.USER } });
      if (!userRoleRecord) {
        userRoleRecord = await role.create(
          { role: commonConstant.ROLE.USER, description: 'Regular user' },
          { transaction },
        );
      }
      await userRole.create(
        { userId: newUser.id, roleId: userRoleRecord.id },
        { transaction },
      );

      await transaction.commit();

      const userData = {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      };
      const token = jwt.createToken(userData);
      return {
        token,
        ...userData,
        role: commonConstant.ROLE.USER,
      };
    } catch (error) {
      await transaction.rollback();
      logMessage.accountErrorMessage('accountSignup', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },

  /**
   * Compare user password
   * @param {String} password
   * @param {String} hashPassword
   * @returns {boolean}
   */
  async compareUserPassword(password, hashPassword) {
    try {
      let isPasswordMatch = '';
      if (password && hashPassword) {
        isPasswordMatch = await bcrypt.compare(password, hashPassword);
      }
      return !!isPasswordMatch;
    } catch (error) {
      logMessage.accountErrorMessage('comparePassword', { error });
      throw Error(error);
    }
  },

  /**
   * Get user profile
   * @param {Object} req
   * @returns {Object} - User profile data
   */
  async getProfile(req) {
    try {
      const { user: currentUser } = req;
      return {
        id: currentUser.id,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        role: currentUser.userRole.role.role,
        status: currentUser.status,
        createdAt: currentUser.createdAt,
      };
    } catch (error) {
      logMessage.accountErrorMessage('userDeviceToken', { error });
      throw Error(error);
    }
  },
};
