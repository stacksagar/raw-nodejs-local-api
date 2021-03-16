const http = require('http');
const { ReqResHandler } = require('./helpers/ReqResHandler');
const environment = require('./helpers/environments');
const app = {};
app.createServer = () => {
  const server = http.createServer(ReqResHandler);
  server.listen(environment.port, () => {
    console.log(
      `Server running... \n preview http://localhost:${environment.port}`
    );
  });
};
app.createServer();
