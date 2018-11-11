// pages/chinese/player/player.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: '',
    showAnswer: false,
    showList: false,
    word: ['',''],
    words: [],
    list: [],
    current: 0,
    progressText: '0/0',
    progressPercent: 0,
    isReading: false,
    currentSpeed: 1,
    speeds:[
      { title: '慢速', value: 4 },
      { title: '正常', value: 5 },
      { title: '快速', value: 6 }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.words = app.globalData.words
    
    if (app.globalData.manifest) {
      this.data.uid = app.globalData.manifest.uid
    }

    this.innerAudioContext = wx.createInnerAudioContext();
    this.innerAudioContext.autoplay = true;
    this.innerAudioContext.loop = false;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (this.validateWords()) {
      this.setData({
        list: this.data.words,
        progressText: '0 / ' + this.data.words.length,
        progressPercent: 0
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

  bindRestartTap: function() {
    if (!this.validateWords() || this.data.isReading ) {
      return
    }
    this.updateProgress(0)
    this.setData({
      showAnswer: false
    })
  },

  bindNextTap: function() {
    if (!this.validateWords() || this.data.isReading) {
      return
    }

    this.setData({
      showAnswer: false
    })

    if (this.data.current >= this.data.words.length) {
      wx.showToast({
        title: '已经到最后了',
        icon: 'none',
        duration: 2000
      })
      return
    }

    this.updateProgress(this.data.current + 1)
    this.readWord()
  },

  bindPrevTap: function() {
    if (!this.validateWords() || this.data.isReading) {
      return
    }

    this.setData({
      showAnswer: false
    })


    if (this.data.current <= 0 ) {
      wx.showToast({
        title: '已经到最开始了',
        icon: 'none',
        duration: 2000
      })
      return
    }

    this.updateProgress(this.data.current - 1)

    // 朗读单词
    this.readWord()
  },

  bindAgainTap: function() {
    if (!this.validateWords() || this.data.isReading) {
      return
    }
    // 朗读单词
    this.readWord()
  },

  bindAnswerTap: function() {
    this.setData({
      showAnswer: true
    })
  },

  validateWords: function() {
    if (this.data.words.length === 0) {
      wx.showToast({
        title: '没有找到听写的单词，请返回重试',
        icon: 'none',
        duration: 4000
      })
      return false
    }
    return true
  },

  updateProgress: function(index) {
    this.data.current = index

    this.setData({
      word: index > 0 ? this.data.words[index - 1] : ['',''],
      progressText: this.data.current + ' / ' + this.data.words.length,
      progressPercent:  Math.floor(Number(index) / this.data.words.length * 100.0)
    })
  },

  readWord: function(index) {
    let i = index || this.data.current
    if (i <= 0 || i > this.data.words.length) {
      return
    }

    let w = this.data.words[i-1]
    let spt = this.data.speeds[this.data.currentSpeed].value
    this.data.isReading = true
    let page = this
    wx.request({
      url: 'https://www.uorion.com/api/v2/speech',
      data: {
        uid: this.data.uid,
        text: w[0],
        spd: '' + spt,
        pit: '5',
        vol: '6',
        per: '0'
      },
      method: 'POST',
      success(res) {
        let data = res.data;
        if (data.result === 0) {
          page.innerAudioContext.src = data.content + '?rnd=' + new Date().getTime();
          page.innerAudioContext.onPlay(() => {
            page.data.isReading = false
          });
          page.innerAudioContext.onError((res) => {
            console.log(res.errMsg)
            console.log(res.errCode)
          });
        } else {
          wx.showToast({
            title: data.err,
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail(err) {
        console.log(err)
      }
    });
  },

  bindSpeedTap: function(evt) {
    this.setData({
      currentSpeed: Number(evt.currentTarget.dataset.id)
    })
  },

  bindListTap: function() {
    this.setData({
      showList: !this.data.showList
    })
  }
})