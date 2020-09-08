// @desc-> Displays request console
const logger = (req, res, next) => {
  console.log(
    `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`
  );
  next(); // I can't understand it well !!
};
module.exports = logger;

// How to use this middleware ?
// 1 - Go to server.js
// 2 - Uncomment line-> const logger = require('./middleware/logger');
// 3 - Uncomment line-> app.use(logger);

// NOTE that we used morgan module instead !!
