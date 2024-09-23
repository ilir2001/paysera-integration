const Paysera = require('./lib/paysera');
const config = require('./config');

// Initialize Paysera with configuration
const paysera = new Paysera(config);

module.exports = paysera;
