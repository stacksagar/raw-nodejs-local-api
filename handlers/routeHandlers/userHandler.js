const { last } = require('lodash');
const { hash } = require('../../helpers/utilities');
const data = require('../../lib/data');
const app = {};

app.userHandler = (reqProperties, callback) => {
  const acceptedMethods = ['get', 'post', 'put', 'delete'];
  const method = reqProperties.reqMethod.toLowerCase();
  if (acceptedMethods.indexOf(method) > -1) {
    app._users[method](reqProperties, callback);
  } else {
    callback(500, { error: 'request method not valid!' });
  }
};

app._users = {};
app._users.get = (reqProperties, callback) => {
  const phone =
    typeof reqProperties.query.phone === 'string' &&
    reqProperties.query.phone.trim().length === 11
      ? reqProperties.query.phone
      : false;

  if (phone) {
    data.read('users', phone, (err, getData) => {
      if (!err) {
        const newData = { ...JSON.parse(getData) };
        delete newData.password;
        callback(200, getData);
      } else {
        callback(404, { error: 'Not found! \n please try again!' });
      }
    });
  } else {
    callback(500, { error: 'request type error!' });
  }
};

app._users.post = (reqProperties, callback) => {
  const firstName =
    typeof reqProperties.body.firstName === 'string' &&
    reqProperties.body.firstName.trim().length > 0
      ? reqProperties.body.firstName
      : false;

  const lastName =
    typeof reqProperties.body.lastName === 'string' &&
    reqProperties.body.lastName.trim().length > 0
      ? reqProperties.body.lastName
      : false;

  const phone =
    typeof reqProperties.body.phone === 'string' &&
    reqProperties.body.phone.trim().length === 11
      ? reqProperties.body.phone
      : false;

  const password =
    typeof reqProperties.body.password === 'string' &&
    reqProperties.body.password.trim().length > 0
      ? reqProperties.body.password
      : false;

  const tosAgree =
    typeof reqProperties.body.tosAgree === 'boolean'
      ? reqProperties.body.tosAgree
      : false;

  if (firstName && lastName && phone && password && tosAgree) {
    data.read('users', phone, (err, getData) => {
      if (err) {
        const userObject = {
          firstName,
          lastName,
          phone,
          password: hash(password),
          tosAgree,
        };

        data.create('users', phone, userObject, (err2) => {
          if (!err2) {
            callback(200, { error: 'user successfully created!' });
          } else {
            callback(500, {
              error: `failed to create new user! \n Error: ${err2}`,
            });
          }
        });
      } else {
        callback(400, {
          error: `this name file is may already exists! \n Error: ${err}`,
        });
      }
    });
  } else {
    callback(500, {error:'you have a problem in your request'})
  }
};

app._users.put = (reqProperties, callback) => {
  const firstName =
    typeof reqProperties.body.firstName === 'string' &&
    reqProperties.body.firstName.trim().length > 0
      ? reqProperties.body.firstName
      : false;

  const lastName =
    typeof reqProperties.body.lastName === 'string' &&
    reqProperties.body.lastName.trim().length > 0
      ? reqProperties.body.lastName
      : false;

  const phone =
    typeof reqProperties.body.phone === 'string' &&
    reqProperties.body.phone.trim().length === 11
      ? reqProperties.body.phone
      : false;

  const password =
    typeof reqProperties.body.password === 'string' &&
    reqProperties.body.password.trim().length > 0
      ? reqProperties.body.password
      : false;

  if (firstName || lastName || phone || password) {
    data.read('users', phone, (err, getData) => {
      if (!err) {
        const newData = { ...JSON.parse(getData) };

        firstName && (newData.firstName = firstName);
        lastName && (newData.lastName = lastName);
        password && (newData.password = hash(password));

        data.update('users', phone, newData, (err2) => {
          if (!err2) {
            callback(200, { message: 'user successfully updated!' });
          } else {
            callback(500, { error: 'user updated failed!' });
            console.log('err2 ', err2)
          }
        });
      } else {
        callback(404, { error: 'Not Found!' });
      }
    });
  } else {
    callback(500, { error: 'you have a problem in your request!' });
  }
};

app._users.delete = (reqProperties, callback) => {
  const phone =
    typeof reqProperties.body.phone === 'string' &&
    reqProperties.body.phone.trim().length === 11
      ? reqProperties.body.phone
      : false;

  if (phone) {
    data.read('users', phone, (err, getData) => {
      if (!err && getData) {
        data.delete('users', phone, (err2) => {
          if (!err2) {
            callback(200, { message: 'file successfully deleted!' });
          } else {
            callback(500, { error: 'failed to delete!' });
          }
        });
      } else {
        callback(404, { error: 'Not Found!' });
      }
    });
  } else {
    console.log(phone)
    callback(404, { error: 'you have a problem in your request!' });
  }
};

module.exports = app;
