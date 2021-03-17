const { checkHandler } = require('./handlers/routeHandlers/checkHandler');
const { tokenHandler } = require('./handlers/routeHandlers/tokenHandler');
const { userHandler } = require('./handlers/routeHandlers/userHandler');
const app = {
  user: userHandler,
  token: tokenHandler,
  check: checkHandler,
};
module.exports = app;
