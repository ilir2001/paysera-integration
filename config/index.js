require('dotenv').config();

const config = {
  projectId: process.env.PAYSERA_PROJECT_ID,
  signPassword: process.env.PAYSERA_SIGN_PASSWORD,
  acceptUrl: process.env.ACCEPT_URL,
  cancelUrl: process.env.CANCEL_URL,
  callbackUrl: process.env.CALLBACK_URL,
};

module.exports = config;
