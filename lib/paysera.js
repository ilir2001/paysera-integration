const crypto = require('crypto');
const axios = require('axios');

/**
 * Paysera class to handle payment gateway interactions
 */
class Paysera {
  /**
   * Initializes the Paysera class with project configuration
   * @param {Object} config - Paysera configuration object
   */
  constructor(config) {
    if (!config || !config.projectId || !config.signPassword) {
      throw new Error('Paysera: projectId and signPassword are required.');
    }

    this.projectId = config.projectId;
    this.signPassword = config.signPassword;
    this.acceptUrl = config.acceptUrl || '';
    this.cancelUrl = config.cancelUrl || '';
    this.callbackUrl = config.callbackUrl || '';
  }

  /**
   * Generates the Paysera payment URL for redirection
   * @param {Object} options - Payment details
   * @returns {string} - Redirect URL to Paysera payment gateway
   */
  generatePaymentUrl(options) {
    // Validate required fields
    if (!options.amount) {
      throw new Error('Paysera: "amount" is a required field and must be specified in cents.');
    }

    if (!options.currency) {
      throw new Error('Paysera: "currency" is a required field.');
    }

    if (!options.firstName) {
      throw new Error('Paysera: "firstName" is a required field.');
    }

    if (!options.lastName) {
      throw new Error('Paysera: "lastName" is a required field.');
    }

    if (!options.email) {
      throw new Error('Paysera: "email" is a required field.');
    }

    // Set up payment data
    const paymentData = {
      projectid: this.projectId,
      orderid: options.orderId || this._generateOrderId(),
      accepturl: this.acceptUrl,
      cancelurl: this.cancelUrl,
      callbackurl: this.callbackUrl,
      amount: options.amount,
      currency: options.currency,
      p_firstname: options.firstName,
      p_lastname: options.lastName,
      p_email: options.email,
      test: options.testMode ? 1 : 0, // Test mode enabled by default
    };

    // Sign the data
    paymentData.sign = this._signData(paymentData);

    // Return the Paysera payment URL
    return `https://www.paysera.com/pay/?${new URLSearchParams(paymentData).toString()}`;
  }


  /**
   * Validates the Paysera callback data
   * @param {Object} callbackData - Data received from Paysera callback
   * @returns {boolean} - Returns true if callback is valid, false otherwise
   */
  validateCallback(callbackData) {
    if (!callbackData || !callbackData.sign) {
      throw new Error('Paysera: Invalid callback data.');
    }

    const receivedSign = callbackData.sign;
    delete callbackData.sign;

    const expectedSign = this._signData(callbackData);
    return receivedSign === expectedSign;
  }

  /**
   * Private method to generate a random order ID
   * @returns {string} - Generated order ID
   */
  _generateOrderId() {
    return Math.floor(Math.random() * 1000000).toString();
  }

  /**
   * Private method to sign data using MD5 hash
   * @param {Object} data - Data to be signed
   * @returns {string} - MD5 signature
   */
  _signData(data) {
    const sortedKeys = Object.keys(data).sort();
    const dataString = sortedKeys.map(key => data[key]).join('|');
    return crypto.createHmac('sha256', this.signPassword)
      .update(dataString)
      .digest('hex');
  }
}

module.exports = Paysera;
