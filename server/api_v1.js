/**
 * Created by ods_h on 2018/5/27.
 */
var express = require('express')
var router = express.Router()
var logger = require('./logger.js').logger
var path = require('path')
var fs = require('fs')
var CryptoJS = require('crypto-js')
var settings = require('./setting')
var uuidv4 = require('uuid/v4')

var cryptoSecret = 'unique@buddha2'

function isString(val) {
  return typeof val === 'string'
}

// JSON解码
function decodeJson(code) {
  var bytes = CryptoJS.AES.decrypt(code, cryptoSecret);
  return bytes.toString(CryptoJS.enc.Utf8);
}

// JSON编码
function encodeJson(json) {
  var cipher = CryptoJS.AES.encrypt(
    JSON.stringify(json),
    cryptoSecret
  );
  return cipher.toString()
}

// 发送结果
function sendJson(res, data, crypto = false) {
  if (crypto) {
    res.send(encodeJson(data))
  } else {
    res.json(data)
  }
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

var emptyRecords = {
  "score": 0,
  "records": []
}

var errorCodes = {
  OK: {result: 0, err: ''},
  SOURCE_TYPE_ERROR: {result: 1, err: '教程类型错误'},
  WRITE_DATAFILE_ERROR: {result: 100, err: '更新数据文件时发生错误'},
  READ_DATAFILE_ERROR: {result: 101, err: '读取数据文件时发生错误'},
  UNKNOWN_OPERATION_ERROR: {result: 102, err: '未知的操作'},
  RECORD_NOTFOUND_ERROR: {result: 103, err: '记录不存在'},
  LOGIN_ERROR: {result: 1000, err: '密码不正确'}
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

router.get('/quit', function (req, res, next) {
  process.send({cmd: 'quit'})
  sendJson(res, errorCodes.OK)
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


const scorepath = path.join(__dirname, 'data/score')
// 获取积分记录
router.get('/score/record', function (req, res, next) {
  var _path = path.join(scorepath, 'score_vip.json')
  try {
    var json = readDBFileSync(_path, emptyRecords)
    sendJson(res, {result: 0, err: '', content: json})
  } catch (err) {
    logger.log('error', 'read file <' + _path + '> failed -' + err)
    sendJson(res, errorCodes.READ_DATAFILE_ERROR)
  }
})

// 修改积分记录
router.post('/score/update', function (req, res, next) {
  var _path = path.join(scorepath, 'score_vip.json')
  try {
    var db = readDBFileSync(_path, emptyRecords)
    // 解码数据
    var json = req.body.content
    let found = -1
    if (json.type === 'add') { // 添加积分记录
      // 排序添加
      json.record.id = uuidv4()
      db.records.forEach((val, index) => {
        var c = dateCompare(val.date, json.record.date)
        if (c > 0) {
          found = index
          return false
        }
      })

      if (found >= 0) {
        db.records.splice(found, 0, json.record)
      } else {
        db.records.push(json.record)
      }

      if (json.record.category === '1') {  //奖励
        db.score += (+json.record.number)
      } else {
        db.score -= (+json.record.number)
      }
      writeDBFileSync(_path, db, emptyRecords)
      sendJson(res, {result: 0, err: '', content: {score: db.score, id: json.record.id}})

      sendJson(res, {result: 0, err: '', content: json})
    } else if (json.type === 'delete') { // 删除积分记录
      // 查找id
      db.records.forEach((val, index) => {
        if (val.id === json.id) {
          found = index
          return false
        }
      })

      if (found >= 0) {
        // 修改分数
        const rec = db.records.splice(found, 1)
        if (rec[0].category === '1') {  //奖励
          db.score -= (+rec[0].number)
        } else {
          db.score += (+rec[0].number)
        }
        writeDBFileSync(_path, db, emptyRecords)
        sendJson(res, {result: 0, err: '', content: {score: db.score}})
      } else {
        sendJson(res, errorCodes.RECORD_NOTFOUND_ERROR)
      }
    } else if (json.type === 'update') { // 更新积分记录
      // 查找id
      db.records.forEach((val, index) => {
        if (val.id === json.record.id) {
          found = index
          return false
        }
      })
      if (found >= 0) {
        // 修改分数
        const oldrec = db.records[found]
        if (oldrec.category === '1') {  //奖励
          db.score -= (+oldrec.number)
        } else {
          db.score += (+oldrec.number)
        }
        db.records[found] = json.record
        if (json.record.category === '1') {  //奖励
          db.score += (+json.record.number)
        } else {
          db.score -= (+json.record.number)
        }
        writeDBFileSync(_path, db, emptyRecords)
        sendJson(res, {result: 0, err: '', content: {score:db.score}})
      } else {
        sendJson(res, errorCodes.RECORD_NOTFOUND_ERROR)
      }
    } else {
      sendJson(res, errorCodes.UNKNOWN_OPERATION_ERROR)
    }
  } catch (err) {
    logger.log('error', 'read file <' + _path + '> failed -' + err)
    sendJson(res, errorCodes.READ_DATAFILE_ERROR)
  }
})


// 获取成绩表
router.get('/score/:grade/:type', function (req, res, next) {
  var _path = path.join(scorepath, req.params.grade, req.params.type + '.json')
  try {
    var json = readDBFileSync(_path, [])
    sendJson(res, {result: 0, err: '', content: json})
  } catch (err) {
    logger.log('error', 'read file <' + _path + '> failed -' + err)
    sendJson(res, errorCodes.READ_DATAFILE_ERROR)
  }
})

// 修改成绩表
router.post('/score/:grade/:type', function (req, res, next) {
  // 覆盖目标文件
  var _path = path.join(scorepath, req.params.grade, req.params.type + '.json')
  try {
    var json = req.body.content
    writeDBFileSync(_path, json, [])
    sendJson(res, errorCodes.OK)
  } catch (err) {
    logger.log('error', 'write file <' + _path + '> failed -' + err)
    sendJson(res, errorCodes.WRITE_DATAFILE_ERROR)
  }
})


// 获取词汇表
const dbpath = path.join(__dirname, 'data/db')
const emptyWords = {
  first: [],
  second: [],
  extend: []
}

router.get('/whole/:source/:type/:grade', function (req, res, next) {
  var _path = path.join(dbpath, req.params.source, req.params.grade, req.params.type + '.json')
  try {
    var json = readDBFileSync(_path, emptyWords)
    sendJson(res, {result: 0, err: '', content: json})
  } catch (err) {
    logger.log('error', 'read file <' + _path + '> failed -' + err)
    sendJson(res, errorCodes.READ_DATAFILE_ERROR)
  }
})

// 更新词汇表
router.post('/whole/:source/:type/:grade', function (req, res, next) {
  // 覆盖目标文件
  var _path = path.join(dbpath, req.params.source, req.params.grade, req.params.type + '.json')
  try {
    var json = req.body.content
    writeDBFileSync(_path, json, emptyWords)
    sendJson(res, errorCodes.OK)
  } catch (err) {
    logger.log('error', 'write file <' + _path + '> failed -' + err)
    sendJson(res, errorCodes.WRITE_DATAFILE_ERROR)
  }
})

// 更新词汇表section
router.post('/partial/:source/:type/:grade/:section', function (req, res, next) {
  // 覆盖目标文件
  var _path = path.join(dbpath, req.params.source, req.params.grade, req.params.type + '.json')
  var json = readDBFileSync(_path, emptyWords)
  var oldSection = json[req.params.section]
  // 根据课序号进行替换, 如果没有则进行追加

  sendJson(res, errorCodes.OK)
})


module.exports = router