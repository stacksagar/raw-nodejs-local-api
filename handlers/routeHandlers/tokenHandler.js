const { last } = require('lodash');
const {
  hash,
  parseJSON,
  randomStringData,
} = require('../../helpers/utilities');
const data = require('../../lib/data');
const app = {};

app.tokenHandler = (reqProperties, callback) => {
  const acceptedMethods = ['get', 'post', 'put', 'delete'];
  const method = reqProperties.reqMethod.toLowerCase();
  if (acceptedMethods.indexOf(method) > -1) {
    app.tokens[method](reqProperties, callback);
  } else {
    callback(500, { error: 'request method not valid!' });
  }
};

app.tokens = {};

app.tokens.post = (reqProperties, callback) => {
  const password =
    typeof reqProperties.body.password === 'string' &&
    reqProperties.body.password.trim().length > 0
      ? reqProperties.body.password
      : false;
  const phone =
    typeof reqProperties.body.phone === 'string' &&
    reqProperties.body.phone.trim().length > 0
      ? reqProperties.body.phone
      : false;

  if (phone && password) {
    data.read('users', phone, (err, getData) => {
      if (!err && getData) {
        const hashedPassword = hash(password);
        if (hashedPassword === parseJSON(getData).password) {
          const tokenID = randomStringData(20);
          const expires = Date.now() + 60 * 60 * 1000;
          const tokenOBJ = {
            id: tokenID,
            phone,
            expires,
          };

          data.create('tokens', tokenID, tokenOBJ, (err2) => {
            if (!err2) {
              callback(200, { message: 'token successfully created!' });
            } else {
              callback(500, {
                error: 'failed to create new token! try again!',
              });
            }
          });
        } else {
          callback(500, { error: "password did't match!" });
        }
      } else {
        callback(404, { error: 'Request Not Found!' });
      }
    });
  } else {
    callback(500, { error: 'you have a problem in your request!' });
  }
};

app.tokens.get = (reqProperties, callback) => {
  const id =
    typeof reqProperties.query.id === 'string' &&
    reqProperties.query.id.trim().length > 0
      ? reqProperties.query.id
      : false;

  if (id) {
    data.read('tokens', id, (err, getData) => {
      if (!err) {
        callback(200, getData);
      } else {
        callback(404, { error: 'Requested token was not found!' });
      }
    });
  } else {
    callback(500, { error: 'Requested token was not found!' });
  }
};

app.tokens.put = (reqProperties, callback) => {
  const extend =
    typeof reqProperties.body.extend === 'boolean' && reqProperties.body.extend
      ? true
      : false;
  const id =
    typeof reqProperties.body.id === 'string' &&
    reqProperties.body.id.trim().length === 20
      ? reqProperties.body.id
      : false;

  if (id && extend) {
    data.read('tokens', id, (err, getData) => {
      if (!err && getData) {
        const tokenData = { ...parseJSON(getData) };
        if (tokenData.expires > Date.now()) {
          tokenData.expires = Date.now() + 60 * 60 * 1000;
          data.update('tokens', id, tokenData, (err2) => {
            if (!err2) {
              callback(200, { message: 'Token successfully updated!' });
            } else {
              callback(400, { error: 'Token updated failed!' });
            }
          });
        } else {
          callback(500, { error: 'your token date is expired!' });
        }
      } else {
        callback(404, { error: 'Your ID is not found! ' });
      }
    });
  } else {
    callback(500, { error: 'you have a problem in your request' });
  }
};
app.tokens.delete = (reqProperties, callback) => {
  const id =
    typeof reqProperties.query.id === 'string' &&
    reqProperties.query.id.trim().length === 20
      ? reqProperties.query.id
      : false;

  if (id) {
    data.read('tokens', id, (err, getData) => {
      if (!err && getData) {
        data.delete('tokens', id, (err2) => {
          if (!err2) {
            callback(200, { message: 'token was successfully deleted!' });
          } else {
            callback(400, {
              error: 'token failed to delete, please try again!',
            });
          }
        });
      } else {
        callback(404, { error: 'token is not exists!' });
      }
    });
  } else {
    callback(500, { error: 'You have a problem in your request!' });
  }
};

module.exports = app;
