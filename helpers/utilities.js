const crypto = require('crypto');
const environment = require('./environments');

const app = {};

app.parseJSON = (getData) => {
  let newData;
  if (typeof getData === 'object') {
    newData = getData;
  } else {
    newData = JSON.parse(getData);
  }
  return newData;
};

app.hash = (getString) => {
  if (typeof getString === 'string' && getString.length > 0) {
    const hash = crypto
      .createHmac('sha256', environment.secretKey)
      .update(getString)
      .digest('hex');
    return hash;
  } else {
    return false;
  }
};

app.randomStringData = (getLength) => {
  const length = getLength;
  const acceptedChars = 'abcdefghijklmnopqrstuvwxyz0123456789#*';
  let output = '';
  if (length > 0) {
    for (let i = 0; i < length; i++) {
      output += acceptedChars.charAt(Math.floor(Math.random() * length + 1));
    }
    return output
  }
};

module.exports = app;