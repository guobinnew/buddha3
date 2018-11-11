//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '欢迎使用懒爸爸',
    userInfo: {},
    studentInfo: {},
    hasStudentInfo: false,
    splash: '',
    fileList: [
      { id: "splash", url: "cloud://buddha-orion.6275-buddha-orion/splash5.jpeg", path: "" },
    ]
  },
  onLoad: function () {
    wx.showLoading({
      title: '加载中',
    })

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      })
    } 

    if (app.globalData.studentInfo) {
      this.setData({
        studentInfo: app.globalData.studentInfo,
        hasStudentInfo: true
      })
    } 

    let files = this.data.fileList.map(v => {
      return v.url
    })
    wx.cloud.getTempFileURL({
      fileList: files,
      success: res => {
        res.fileList.forEach((v, index) => {
          this.data.fileList[index].path = v.tempFileURL
        })
        this.updateFiles()
        wx.hideLoading()
      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          title: '读取云文件失败',
        })
      }
    })
  },
  onReady: function() {
    if (!this.hasStudentInfo) {
      // 进入设置学生信息界面

    }
  },

  updateFiles: function () {
    let data = {}
    this.data.fileList.forEach(v => {
      data[v.id] = v.path
    })
    this.setData(data)
  }
})
