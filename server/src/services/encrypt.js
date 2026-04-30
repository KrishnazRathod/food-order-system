/* eslint-disable no-bitwise */
/* eslint-disable new-cap */
/* eslint-disable no-param-reassign */
import { createCipheriv } from 'crypto';
import config from '../config';

const { key } = config.encryption;

export default {
/**
   * Encrypt a string using AES-128-ECB encryption.
   *
   * @param {string} str - The string to be encrypted.
   * @returns {string} The encrypted string in lowercase hex format.
   */
  encrypt(str) {
    // Create a cipher object with the provided encryption key
    const cipherIvObject = createCipheriv('aes-128-ecb', this.convertCryptKey(key), '');

    // Encrypt the string and return it in lowercase hex format
    const encryptedString = cipherIvObject.update(str, 'utf8', 'hex') + cipherIvObject.final('hex');
    return encryptedString.toLowerCase();
  },

  /**
   * Convert a string key to a Buffer for encryption.
   *
   * @param {string} strKey - The encryption key as a string.
   * @returns {Buffer} The encryption key as a Buffer.
   */
  convertCryptKey(strKey) {
    // Create a new Buffer with 16 bytes and initialize it with zeros
    const newKey = Buffer.alloc(16);

    // Convert the string key to a Buffer
    const keyBuffer = Buffer.from(strKey);

    // XOR the newKey with the keyBuffer, ensuring it's 16 bytes long
    for (let i = 0; i < keyBuffer.length; i++) {
      newKey[i % 16] ^= keyBuffer[i];
    }

    return newKey;
  },

  /**
   * Encrypt specific columns in an object.
   *
   * @param {Array<string>} columns - The columns to be encrypted.
   * @param {object} value - The object containing data to be encrypted.
   * @returns {object} An object with specified columns encrypted.
   */
  multipleEncrypt(columns, value) {
    // Clone the dataValues object
    const userObject = { ...value.dataValues };

    // Iterate through the specified columns and encrypt their values
    columns.forEach((element) => {
      if (userObject[element]) {
        userObject[element] = this.encrypt(userObject[element]);
      }
    });

    return userObject;
  },
};
