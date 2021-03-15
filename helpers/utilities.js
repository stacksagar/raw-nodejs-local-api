const crypto = require('crypto');
const envts = require('./envts');
const utilities = {};

utilities.parseJSON = (jsonString) => {
  let output = {};

  try {
    output = JSON.parse(jsonString);
  } catch {
    output = {};
  }

  return output;
};

utilities.hash = (str) => {
  if (typeof str === 'string' && str.length > 0) {
    const hash = crypto
      .createHmac('sha256', envts.secretKey)
      .update(str)
      .digest('hex');
    return hash;
  } else {
    return false;
  }
};

// create random string
utilities.createRS = (strLength) => {
  let length = strLength;
  let output = '';
  typeof strLength === 'number' && strLength.length > 0 ? strLength : false;
  if (length) {
    let possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 1; i < length; i++) {
      const randomChars = possibleCharacters.charAt(
        Math.floor(Math.random() * length + 1)
      );
      output += randomChars;
    }
  }
  return output;
};

module.exports = utilities;
