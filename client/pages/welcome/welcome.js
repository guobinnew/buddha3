
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '开始使用懒爸爸'
  },
  onLoad: function () {
  },
  bindEnter: function(e) {
    // 进入首页
    wx.switchTab({
      url: '/pages/index/index',
    })
  }
})
