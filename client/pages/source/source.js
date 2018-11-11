// pages/chinese/source/source.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    grade: '',
    type: '',
    source: '',
    sources: {
      'chinese': ['rj'],
      'english': ['wys']
    },
    list: [],
    scrollHeight: 1206
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.type = options.type
    this.data.grade = options.grade
    if (app.globalData.systemInfo) {
      this.setData({
        scrollHeight: app.globalData.systemInfo.windowHeight - 200
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (app.globalData.manifest) {
      let valids = this.data.sources[this.data.type]
      let list = []
      app.globalData.manifest.database.items.forEach( v => {
        if (valids.indexOf(v.id) >= 0) {
          v.icon = "/imgs/" + v.id + ".jpeg"
          list.push(v)
        }
      })
     
      this.setData({
        list: list
      })
    }
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

  bindSourceTap: function (evt) {
    // 进入听写页面
    let id = evt.currentTarget.id
    wx.navigateTo({
      url: '/pages/dictation/dictation?type=' + this.data.type +'&grade=' + this.data.grade + '&source=' + id
    })
  }
})