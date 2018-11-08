// pages/chinese/dictation/dictation.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categories: ["小学", "初中", "高中"],
    grades: [
      { name:"g1",  value:"小学一年级", icon: ""},
      { name: "g2", value: "小学二年级", icon: "" },
      { name: "g3", value: "小学三年级", icon: "" },
      { name: "g4", value: "小学四年级", icon: "" }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let arr = []
    for (let i=0; i<100; i++) {
      arr.push(i)
    }
    this.setData({
      grades: arr
    })
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

  }
})