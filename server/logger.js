/**
 * Created by unique on 2018/5/26.
 */
var winston = require('winston');
var path = require('path');

var logger = new(winston.Logger)({
  transports: [
    new(winston.transports.Console)(),
    new(winston.transports.File)({
      filename: path.join(__dirname, 'logs/analysis.log'),
      timestamp: 'true',
      maxsize: 10485760,
      maxFiles: 10
    })
  ]
});

exports.logger = logger;