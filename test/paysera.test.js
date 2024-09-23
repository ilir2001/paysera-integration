const Paysera = require('../lib/paysera');
const crypto = require('crypto');

describe('Paysera Payment Integration', () => {
  let paysera;

  beforeAll(() => {
    paysera = new Paysera({
      projectId: '123',
      signPassword: 'testpass',
      acceptUrl: 'https://example.com/success',
      cancelUrl: 'https://example.com/cancel',
      callbackUrl: 'https://example.com/callback'
    });
  });

  test('should generate valid payment URL', () => {
    const paymentUrl = paysera.generatePaymentUrl({
      amount: 1000,
      currency: 'EUR',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com'
    });

    expect(paymentUrl).toContain('https://www.paysera.com/pay/?');
    expect(paymentUrl).toContain('amount=1000');
    expect(paymentUrl).toContain('p_firstname=John');
  });

  test('should validate correct callback data', () => {
    const callbackData = {
      projectid: '123',
      orderid: '12345',
      amount: '1000',
      currency: 'EUR',
      sign: crypto.createHash('md5').update('123|12345|1000|EUR|testpass').digest('hex'),
    };

    const isValid = paysera.validateCallback(callbackData);
    expect(isValid).toBe(true);
  });

  test('should return false for invalid callback signature', () => {
    const callbackData = {
      projectid: '123',
      orderid: '12345',
      amount: '1000',
      currency: 'EUR',
      sign: 'invalidsignature',
    };

    const isValid = paysera.validateCallback(callbackData);
    expect(isValid).toBe(false);
  });
});
