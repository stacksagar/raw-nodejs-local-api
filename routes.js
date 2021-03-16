const { userHandler } = require('./handlers/routeHandlers/userHandler');
const app = {
  user: userHandler,
};
module.exports = app;