
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '开始使用懒爸爸',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    items: [
      { name: 'avatar', value: '获得你的公开信息（昵称、头像等）', checked: 'true' }
    ],
    reserved: [
      'dictation/extend'
    ],
    isClearing: false
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  bindAboutTap: function() {
    wx.showModal({
      title: '关于我们',
      content: '懒爸爸（v0.1.2)',
      showCancel: false,
      success(res) {
      }
    })
  },

  bindClearTap: function() {
    try {
      if (this.data.isClearing) {
        return
      }
      const storage = wx.getStorageInfoSync()
      let page = this
      let keys = []
      // 遍历keys, 跳过保留数据
      storage.keys.forEach(v => {
        let found = false
        page.data.reserved.forEach(k => {
          if (v.indexOf(k) >= 0) {
            found = true
            return false
          }
        })
        if (!found) {
          keys.push(v)
        }
      })

      if (keys.length === 0) {
        wx.showToast({
          title: '没有缓存',
          icon: 'none',
          duration: 2000
        })
        return
      }

      wx.showModal({
        title: '提示',
        content: '确认要清除本地缓存(' + storage.currentSize + 'KB)吗？',
        success(res) {
          if (res.confirm) {
            page.data.isClearing = true
            wx.showToast({
              title: '缓存清除中...',
              icon: 'none'
            })
            // 遍历keys, 跳过保留数据
            keys.forEach( v => {
              wx.removeStorageSync(v)
            })
            wx.hideToast()
            wx.showToast({
              title: '缓存清除完成',
              icon: 'none',
              duration: 2000
            })
            page.data.isClearing = false
          } else if (res.cancel) {
          }
        }
      })
    } catch (e) {
      // Do something when catch error
    }
  },

  bindDataTap: function() {
    wx.navigateTo({
      url: '/pages/data/data',
    })
  }
})
