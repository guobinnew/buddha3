// pages/chinese/dictation/dictation.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sections: ["上册", "下册", "扩展"],
    chapters: [],
    words: {},
    currentSection: 0,
    scrollHeight: 1206,
    currentMode: 1,
    modes: [
      { title: '顺序' },
      { title: '随机' },
    ],
    commands: {
      'chinese': 'getWords',
      'english': 'getGlossary'
    },
    type: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.type = options.type
    let key = options.type + '/dictation/' + options.source + '/' + options.grade
    // 根据url参数读取词汇表
    let words = wx.getStorageSync(key)
    let cmd = this.data.commands[options.type]
    if (!words) {
      // 请求词汇表
      wx.request({
        url: 'https://www.uorion.com/api/v2/' + cmd + '?source=' + options.source + '&grade=' + options.grade,
        success: res => {
          if (res.data.result === 0) {
            wx.setStorageSync(key, res.data.content)
            this.data.words = res.data.content
            this.loadWords()
          } else {
            wx.showToast({
              title: '获取单词表出错',
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    } else {
      this.data.words = words
      this.loadWords()
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (app.globalData.systemInfo) {
      this.setData({
        scrollHeight: app.globalData.systemInfo.windowHeight - 420
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

  bindSectionTap: function(evt) {
    this.setData({
      currentSection: Number(evt.currentTarget.dataset.id)
    })
    this.loadWords()
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

  shuffleWord: function(words) {
    // 洗牌
    var len = words.length
    for (let i = 0; i < len - 1; i++) {
      let idx = Math.floor(Math.random() * (len - i));
      let temp = words[idx];
      words[idx] = words[len - i - 1]
      words[len - i - 1] = temp
    }
    return words
  },

  bindActionTap: function (evt) {
    // 判断是否有单词
    let words = []
    this.data.chapters.forEach( v => {
      if (v.sel) {
        words = words.concat(v.data)
      }
    })

    if (words.length === 0) {
      wx.showToast({
        title: '没有可听写的单词',
        icon: 'none',
        duration: 2000
      })
      return
    }

    // 随机打乱
    if (this.data.currentMode === 1) {
      this.shuffleWord(words)
    }

    app.globalData.words = words

    wx.navigateTo({
      url: '/pages/' + this.data.type + '/player/player',
    })
  },

  loadWords() {
    let sectionName = 'first'
    if (this.data.currentSection === 1) {
      sectionName = 'second'
    } else if (this.data.currentSection === 2) {
      sectionName = 'extend'
    }

    let chps = []
    this.data.words[sectionName].forEach(v => {
      chps.push({
        sel: false,
        data: v
      })
    })

    this.setData({
      chapters: chps
    })
  },

  bindModeTap: function(evt) {
    this.setData({
      currentMode: Number(evt.currentTarget.dataset.id)
    })
  }
})