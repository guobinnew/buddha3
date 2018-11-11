(function() {
  'use strict'

  var express = require('express')
  var path = require('path')
  var fs = require('fs')
  var winston = require('winston')
  var expressWinston = require('express-winston')
  var cookieParser = require('cookie-parser')
  var bodyParser = require('body-parser')
  var settings = require('./setting')

  var app = express()

  // root参数指定静态文件的根目录
  var rootDir = path.join(__dirname, '../client/dist')
  app.use('/', express.static(rootDir))
  app.use(bodyParser.urlencoded({
    extended: true
  }))
  app.use(bodyParser.json())
  app.use(cookieParser())

  // 创建日志目录
  var logDir = path.join(__dirname, 'logs')
  //检测文件或者文件夹存在
  function fsExistsSync(path) {
    try{
      fs.accessSync(path,fs.F_OK);
    }catch(e){
      return false;
    }
    return true;
  }
  if (!fsExistsSync(logDir)) {
    fs.mkdirSync(logDir)
  }

  // 正常请求的日志
  app.use(expressWinston.logger({
    transports: [
      new(winston.transports.Console)({
        json: true,
        colorize: true
      }),
      new winston.transports.File({
        filename: path.join(logDir, 'success.log'),
      })
    ]
  }));

  // 跨域设置
  app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Credentials", true)
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "X-Requested-With")
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8")
    next()
  })

  app.use('/api/v1', require('./api_v1'));
  app.use('/api/v2', require('./api_v2'));

  // 错误请求的日志
  app.use(expressWinston.errorLogger({
    transports: [
      new winston.transports.Console({
        json: true,
        colorize: true
      }),
      new winston.transports.File({
        filename: path.join(logDir, 'error.log'),
      })
    ]
  }));

  var server = app.listen(settings.server.port, function() {
    console.log('info', 'Launch server... port <' + settings.server.port + '>...')
  })

}());
