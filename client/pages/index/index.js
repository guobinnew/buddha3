//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '欢迎使用懒爸爸',
    userInfo: {},
    studentInfo: {},
    hasStudentInfo: false
  },
  onLoad: function () {
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
  },
  onReady: function() {
    if (!this.hasStudentInfo) {
      // 进入设置学生信息界面

    }

  }
})
