//app.js
App({
  onLaunch: function () {
    // 获取本地存储
    let studentInfo = wx.getStorageSync('student')
    if (studentInfo) {
        // 更新学生信息
        this.globalData.studentInfo = studentInfo
    }

    wx.cloud.init({
      env: 'buddha-orion'
    })

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    // 请求manifest
    wx.request({
      url: 'https://www.uorion.com/api/v2/manifest',
      success: res => {
        if (res.data.result === 0) {
          this.globalData.manifest = res.data.content
        } else {
          wx.showToast({
            title: '获取配置信息出错',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    manifest: null,
    studentInfo: null,
    systemInfo: null,
    words: []
  }
})