const app = {};

app.notFound = (reqProperties, callback) => {
  console.log('reqProperties ', reqProperties);
  callback(404, {error: 'Not Found'});
};

module.exports = app;