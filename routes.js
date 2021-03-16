const { tokenHandler } = require('./handlers/routeHandlers/tokenHandler');
const { userHandler } = require('./handlers/routeHandlers/userHandler');
const app = {
  user: userHandler,
  token: tokenHandler
};
module.exports = app;