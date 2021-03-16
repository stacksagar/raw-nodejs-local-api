const app = {};

app.staging = {
  port: 3000,
  message: 'Staging server running...',
  secretKey: 'staging-encpw',
};
app.production = {
  port: 5000,
  message: 'Production server running...',
  secretKey: 'production-encpw',
};

const currentEnvironment =
  typeof process.env.NODE_ENV === 'string' ? app[process.env.NODE_ENV] : '';

const exportEnvironment =
  typeof currentEnvironment === 'object' ? currentEnvironment : app.staging;

module.exports = exportEnvironment;