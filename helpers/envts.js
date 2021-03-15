const envts = {};

envts.staging = {
  port: 3000,
  evnName: 'staging',
  secretKey: 'kljsduerhsdf;'
};
envts.production = {
  port: 5000,
  evnName: 'production',
  secretKey: 'asdfsdafgasr;'
};

const currentEnv =
  typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

const envToExport =
  typeof envts[currentEnv] === 'object' ? envts[currentEnv] : envts.staging;

module.exports = envToExport;