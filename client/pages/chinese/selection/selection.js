// pages/chinese/selection/selection.js
//获取应用实例
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    categories: [
      { name: "p1",  value: "小学" },
      { name: "m1",  value: "初中" },
      { name: "h1",  value: "高中" }
    ],
    grades: [
      { name: "p1", value: "小学一年级", icon: "/imgs/primary.png", bgcolor: "#FFEBCD" },
      { name: "p2", value: "小学二年级", icon: "/imgs/primary.png", bgcolor: "#FFEBCD" },
      { name: "p3", value: "小学三年级", icon: "/imgs/primary.png", bgcolor: "#FFEBCD" },
      { name: "p4", value: "小学四年级", icon: "/imgs/primary.png", bgcolor: "#FFEBCD" },
      { name: "p5", value: "小学五年级", icon: "/imgs/primary.png", bgcolor: "#FFEBCD" },
      { name: "p6", value: "小学六年级", icon: "/imgs/primary.png", bgcolor: "#FFEBCD" },
      { name: "m1", value: "初中一年级", icon: "/imgs/middle.png", bgcolor: "#FFEBCD" },
      { name: "m2", value: "初中二年级", icon: "/imgs/middle.png", bgcolor: "#FFEBCD" },
      { name: "m3", value: "初中三年级", icon: "/imgs/middle.png", bgcolor: "#FFEBCD" },
      { name: "h1", value: "高中一年级", icon: "/imgs/high.png", bgcolor: "#FFEBCD" },
      { name: "h2", value: "高中二年级", icon: "/imgs/high.png", bgcolor: "#FFEBCD" },
      { name: "h3", value: "高中三年级", icon: "/imgs/high.png", bgcolor: "#FFEBCD" }
    ],
    toView: '',
    scrollHeight: 1206
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.systemInfo) {
      this.data.scrollHeight = app.globalData.systemInfo.windowHeight
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  bindCategoryTap: function(evt) {
    let name = evt.currentTarget.dataset.name
    this.setData({
      toView: name
    })
  },

  bindGradeTap: function(evt) {
    // 进入听写页面
    let id = evt.currentTarget.id
    wx.navigateTo({
      url: '/pages/chinese/dictation/dictation?id=' + id
    })
  }
})
