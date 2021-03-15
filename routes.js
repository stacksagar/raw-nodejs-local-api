const { sampleHandler } = require('./handlers/routeHandler/sampleHandler');
const { tokenHandler } = require('./handlers/routeHandler/tokenHandler');
const { userHandler } = require('./handlers/routeHandler/userHandler');

const routes = {
  sample: sampleHandler,
  user: userHandler,
  token: tokenHandler
};

module.exports = routes;
