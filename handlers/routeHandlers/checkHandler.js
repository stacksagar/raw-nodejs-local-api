const exportEnvironment = require('../../helpers/environments');
const {
  hash,
  parseJSON,
  randomStringData,
} = require('../../helpers/utilities');
const data = require('../../lib/data');
const tokenHandler = require('./tokenHandler');

const app = {};

app.checkHandler = (reqProperties, callback) => {
  const acceptedMethods = ['get', 'post', 'put', 'delete'];
  const method = reqProperties.reqMethod.toLowerCase();
  if (acceptedMethods.indexOf(method) > -1) {
    app._check[method](reqProperties, callback);
  } else {
    callback(500, { error: 'request method not valid!' });
  }
};

app._check = {};
app._check.get = (reqProperties, callback) => {
  const protocol =
    typeof reqProperties.body.protocol === 'string' &&
    ['http', 'https'].indexOf(reqProperties.body.protocol) > -1
      ? reqProperties.body.protocol
      : false;
  const url =
    typeof reqProperties.body.url === 'string' &&
    reqProperties.body.url.trim().length > 0
      ? reqProperties.body.url
      : false;

  const method =
    typeof reqProperties.body.method === 'string' &&
    ['get', 'post', 'put', 'delete'].indexOf(reqProperties.body.method) > -1
      ? reqProperties.body.method
      : false;

  const successCodes =
    typeof reqProperties.body.successCodes === 'object' &&
    reqProperties.body.successCodes instanceof Array
      ? reqProperties.body.successCodes
      : false;

  const timeOutSeconds =
    typeof reqProperties.body.timeOutSeconds === 'number' &&
    reqProperties.body.timeOutSeconds % 1 === 0 &&
    reqProperties.body.timeOutSeconds > 0 &&
    reqProperties.body.timeOutSeconds < 6
      ? reqProperties.body.timeOutSeconds
      : false;

  if (protocol && url && method && successCodes && timeOutSeconds) {
    const token =
      typeof reqProperties.reqHeaders.token === 'string'
        ? reqProperties.reqHeaders.token
        : false;

    // lookup the user phone reading the token
    data.read('tokens', token, (err, tokenData) => {
      if (!err && tokenData) {
        let userPhone = parseJSON(tokenData).phone;

        // lookup the user data
        data.read('users', userPhone, (err2, userData) => {
          if (!err2 && userData) {
            tokenHandler.tokens.verify(token, userPhone, (tokenIsValid) => {
              if (tokenIsValid) {
                let userObject = parseJSON(userData);
                let userChecks =
                  typeof userObject.checks === 'object' &&
                  userObject.checks instanceof Array
                    ? userObject.checks
                    : [];

                if (userChecks.length < exportEnvironment.maxChecks) {
                  let checkID = randomStringData(20);
                  let checkObject = {
                    id: checkID,
                    userPhone: phone,
                    protocol,
                    url,
                    method,
                    successCodes,
                    timeOutSeconds,
                  };

                  data.create('checks', checkID, checkObject, (err3) => {
                    if (!err3) {
                      // add checkID to the users Object
                      userObject.checks = userChecks
                      userObject.checks.push(checkID)
                      // save the new user data 
                      data.update('users', userPhone, userObject, (err4) => {
                        if (!err4) {
                          callback(200, {
                            seeObject: checkObject
                          })
                        } else {
                          callback(500, {
                            error: 'There was a problem in your server side!'
                          })
                        }
                      })
                    } else {
                      callback(500, {
                        error: 'There was a problem in the server side!'
                      })
                    }
                  })

                } else {
                  // not allowed!
                  callback(401, {
                    error: 'User has already reached max check limit!',
                  });
                }
              } else {
                callback(403, {
                  error: 'Authentication Problem!',
                });
              }
            });
          } else {
            callback(403, {
              error: 'User not found!',
            });
          }
        });
      } else {
        callback(403, {
          error: 'Authentication Problem!',
        });
      }
    });
  } else {
    callback(400, { error: 'you have a problem in your request!' });
  }
};
app._check.post = (reqProperties, callback) => {};
app._check.put = (reqProperties, callback) => {};
app._check.delete = (reqProperties, callback) => {};

module.exports = app;
