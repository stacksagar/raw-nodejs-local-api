// dependencies
const url = require('url');
const { StringDecoder } = require('string_decoder');
const routes = require('../routes');
const { notFoundHandler } = require('../handlers/routeHandler/notFoundHandler');
const { parseJSON } = require('./utilities');

// module scaffolding
const handler = {};

handler.handleReqRes = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');
  const method = req.method.toLowerCase();
  const queryString = parsedUrl.query;
  const reqHeaders = req.headers;

  const queryProperties = { 
    path,
    trimmedPath,
    method,
    queryString,
    reqHeaders,
  };

  const decoder = new StringDecoder('utf-8');
  let realData = '';

  const chosenHandler = routes[trimmedPath]
    ? routes[trimmedPath]
    : notFoundHandler;

  req.on('data', (buffer) => {
    realData += decoder.write(buffer);
  });

  req.on('end', () => {
    queryProperties.body = parseJSON(realData);

    chosenHandler(queryProperties, (statusCode, payload) => {
      statusCode = typeof statusCode === 'number' ? statusCode : 500;
      payload =
        typeof payload === 'object'
          ? payload
          : { somethingError: 'Please check your application' };
      const stringPayload = JSON.stringify(payload);
      // res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.write(stringPayload);
      res.end();
    });
  });
};

module.exports = handler;
