
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '开始使用懒爸爸'
  },
  onLoad: function () {
  },
  onReady: function() {
    wx.getSystemInfo({
      success: function (res) {
        let windowHeight = (res.windowHeight * (750 / res.windowWidth)); //将高度乘以换算后的该设备的rpx与px的比例
        let windowWidth = (res.windowWidth * (750 / res.windowWidth)); //将高度乘以换算后的该设备的rpx与px的比例
        app.globalData.systemInfo = {
          info: res,
          windowWidth: Math.floor(windowWidth),
          windowHeight: Math.floor(windowHeight)
        }
        console.log(app.globalData.systemInfo)
      }
    })
  },
  bindEnter: function(e) {
    // 进入首页
    wx.switchTab({
      url: '/pages/index/index',
    })
  }
})
