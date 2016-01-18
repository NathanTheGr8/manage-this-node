var fs = require('fs-extra');

var configFile         = __dirname + '/../config.json';
var configFileTemplate = configFile + '.template';

var config;

try {
  config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
} catch (err) {
  if (err.name === 'SyntaxError') {
    throw new Error('Invalid config file, please make sure the file is in JSON format.');
  }

  // config file not found
  if (err.code === 'ENOENT') {
    fs.copySync(configFileTemplate, configFile);
    config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
  }
}

config.app.title   = process.env.APP_TITLE   || config.app.title   || 'Manage This!';
config.app.port    = process.env.APP_PORT    || config.app.port    || 3000;

module.exports = config;