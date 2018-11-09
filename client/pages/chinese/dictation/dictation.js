// pages/chinese/dictation/dictation.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sections: ["上册", "下册", "扩展"],
    chapters: [
      { sel: false, data:["小草"]  },
      { sel: false, data: ["小草"] },
      { sel: false, data: ["小草"] },
      { sel: false, data: ["小草"] },
      { sel: false, data: ["小草"] },
      { sel: false, data: ["小草"] }
    ],
    currentSection: 0,
    scrollHeight: 1206
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.systemInfo) {
      this.data.scrollHeight = app.globalData.systemInfo.windowHeight
    }

    // 默认人教版
    let source = 'rj'
    // 根据url参数读取词汇表
    let words =  wx.getStorageSync('chs/words/rj/' + options.id)
    if (!words) {
      // 如果没有找到，则提示下载
    } else {

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

  bindSectionTap: function(evt) {
    this.setData({
      currentSection: Number(evt.currentTarget.dataset.id)
    })
  },

  bindChapterTap: function(evt) {
    let id = Number(evt.currentTarget.dataset.id)
    let state = !this.data.chapters[id].sel
    console.log(state)
    let change = 'chapters[' + id + '].sel'
    this.setData({
      [change]: state
    })
  },

  bindActionTap: function (evt) {
    wx.navigateTo({
      url: '/pages/chinese/player/player',
    })
  }
})