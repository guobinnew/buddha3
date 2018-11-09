/**
 * Created by ods_h on 2018/5/27.
 */
var express = require('express')
var router = express.Router()
var logger = require('./logger.js').logger
var path = require('path')
var fs = require('fs')
var settings = require('./setting')
var uuidv4 = require('uuid/v4')
var AipSpeechServer = require('baidu-aip-sdk').speech;

//设置appid/appkey/appsecret
var APP_ID = "14705286";
var API_KEY = "CGdZKSMie8N2NHfvccWkcwt8";
var SECRET_KEY = "ZeKRtWQMCQKV1iu5yXPGnpPqFqfpBa0t";
// 新建一个对象，建议只保存一个对象调用服务接口
var client =new AipSpeechServer(APP_ID, API_KEY, SECRET_KEY);

function isString(val) {
  return typeof val === 'string'
}

// 发送结果
function sendJson(res, data) {
  res.json(data)
}

// 日期比较
function dateCompare(d1, d2) {
  var od1 = new Date(d1);
  var od2 = new Date(d2);
  if (od1.getTime() > od2.getTime()) {
    return 1
  } else if (od1.getTime() < od2.getTime()) {
    return -1
  }
  return 0
}

var errorCodes = {
  OK: {result: 0, err: ''},
  SOURCE_TYPE_ERROR: {result: 1, err: '教程类型错误'},
  WRITE_DATAFILE_ERROR: {result: 100, err: '更新数据文件时发生错误'},
  READ_DATAFILE_ERROR: {result: 101, err: '读取数据文件时发生错误'},
  UNKNOWN_OPERATION_ERROR: {result: 102, err: '未知的操作'},
  RECORD_NOTFOUND_ERROR: {result: 103, err: '记录不存在'},
  LOGIN_ERROR: {result: 1000, err: '密码不正确'},
  AUDIO_ERROR: {result: 2000, err: '语音合成服务发生错误'},
  NETWORK_ERROR: {result: 3000, err: '发生网络错误'}
}

// 同步读取文件
function readDBFileSync(filepath, emptyContent, create = true) {
  var content = emptyContent
  try {
    if (!fs.existsSync(filepath)) {
      if (create) {
        // 创建目录
        var dir = path.dirname(filepath)
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir)
        }
        fs.writeFileSync(filepath, JSON.stringify(emptyContent))
      }
    } else {
      var data = fs.readFileSync(filepath)
      content = JSON.parse(data)
    }
  } catch (err) {
    logger.log('error', 'read file <' + filepath + '> failed, reason -' + err)
  }
  return content
}


function writeDBFileSync(filepath, data, emptyContent) {
  var content = data ? data : emptyContent
  var dir = path.dirname(filepath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
  fs.writeFileSync(filepath, JSON.stringify(content))
}

router.post('*', function (req, res, next) {
  if (isString(req.body.data)) {
    req.body.content = JSON.parse(req.body.data)
  }
  next()
})

// 身份验证
router.post('/login', function (req, res, next) {
  // 检查密码是否正确
  if (req.body.content.pwd === settings.admin.password) {
    sendJson(res, errorCodes.OK)
  } else {
    sendJson(res, errorCodes.LOGIN_ERROR)
  }
})

// 获取manifest
router.get('/manifest', function (req, res, next) {
  var _path = path.join(__dirname, 'data/manifest.json')
  var json = readDBFileSync(_path, {})
  sendJson(res, {result: 0, err: '', content: json})
})

// 更新用户信息
router.post('/updateProfile', function (req, res, next) {

  var _path = path.join(__dirname, 'data/manifest.json')
  try {
    var manifest = readDBFileSync(_path, {})
    var json = req.body.content

    manifest.user.name = json.name
    manifest.user.class = Number(json.class)
    // 计算source索引
    const src = manifest.database.sources
    src.current = src.items.map(function (item) {
      return item.id
    }).indexOf(json.source)

    if (src.current < 0) {
      sendJson(res, errorCodes.SOURCE_TYPE_ERROR)
    } else {
      writeDBFileSync(_path, manifest, {})
      sendJson(res, errorCodes.OK)
    }
  } catch (err) {

  }
})

// 获取词汇表
const dbpath = path.join(__dirname, 'data/db')
const emptyChapter = {
  first: [],
  second: [],
  extend: []
}

router.get('/getWords', function (req, res, next) {
  var _path = path.join(dbpath, req.query.source, req.query.grade, 'words.json')
  try {
    var json = readDBFileSync(_path, emptyChapter)
    sendJson(res, {result: 0, err: '', content: json})
  } catch (err) {
    logger.log('error', 'read file <' + _path + '> failed -' + err)
    sendJson(res, errorCodes.READ_DATAFILE_ERROR)
  }
})

router.get('/getGlossary', function (req, res, next) {
  var _path = path.join(dbpath, req.query.source, req.query.grade, 'glossary.json')
  try {
    var json = readDBFileSync(_path, emptyChapter)
    sendJson(res, {result: 0, err: '', content: json})
  } catch (err) {
    logger.log('error', 'read file <' + _path + '> failed -' + err)
    sendJson(res, errorCodes.READ_DATAFILE_ERROR)
  }
})

const audiopath = path.join(__dirname, '../client/dist/audio')
// 语音合成
router.post('/speech', function(req, res, next){
  console.log(req.body);//用这种content-type=www-form-urlencoded才能获取到参数
  console.log(req.body.text.length);

  client.text2audio(
    req.body.text || '你好，百度语音合成测试',
    {
      spd: req.body.spd || '5',//音速
      pit: req.body.pit || '5',//音调
      vol: req.body.vol || '5',//音量
      per: req.body.per || '0'//播音角色
    }
  )
  .then(
    function(result){
      if(result.data){
        if (!fs.existsSync(audiopath)) {
          fs.mkdirSync(audiopath)
        }

        fs.writeFileSync(path.join(audiopath, 'tts.audio.mp3'), result.data);
        sendJson(res, {result: 0, err: '', content: 'https://www.uorion.com/audio/tts.audio.mp3'})
      }else{
        // 服务发生错误
        console.log(result);
        sendJson(res, AUDIO_ERROR)
      }
    }, 
    function(e){
      // 发生网络错误
      console.log(e);
      sendJson(res, NETWORK_ERROR)
    }
  );
});

module.exports = router