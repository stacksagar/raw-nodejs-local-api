const URL = require('url');
const { StringDecoder } = require('string_decoder');
const { parseJSON } = require('./utilities');
const routes = require('../routes');
const { notFound } = require('../handlers/routeHandlers/notFound');

const app = {};

app.ReqResHandler = (req, res) => {
  const parsedURL = URL.parse(req.url, true);
  const path = parsedURL.pathname;
  const query = parsedURL.query;
  const trimmedPath = path.replace(/\/+|\//g, '');
  const reqHeaders = req.headers;
  const reqMethod = req.method;
  const requestProperties = {
    path,
    trimmedPath,
    query,
    reqHeaders,
    reqMethod,
  };

  let realData = '';
  const decoder = new StringDecoder('utf-8');

  const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFound;

  req.on('data', (buffer) => {
    realData += decoder.write(buffer);
  });

  req.on('end', () => {
    if (realData) {
      requestProperties.body = JSON.parse(realData);
    }
    chosenHandler(requestProperties, (getStatusCode, payload) => {
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(getStatusCode);
      const stringData =
        typeof payload === 'object' ? JSON.stringify(payload) : payload;
      res.write(stringData);
      res.end();
    });
  });
};

module.exports = app;
