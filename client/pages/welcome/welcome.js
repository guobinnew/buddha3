
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '开始使用懒爸爸',
    logo: '',
    fileList:[
      { id: "logo", url:"cloud://buddha-orion.6275-buddha-orion/lanbaba.png", path:""},
    ]
  },
  onLoad: function () {
    wx.showLoading({
      title: '加载中',
    })
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

    let files = this.data.fileList.map( v=> {
      return v.url
    })
    wx.cloud.getTempFileURL({
      fileList: files,
      success: res => {
        res.fileList.forEach( (v, index) => {
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
  bindEnter: function(e) {
    // 进入首页
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  updateFiles: function() {
    let data = {}
    this.data.fileList.forEach( v => {
      data[v.id] = v.path
    })
    this.setData(data)
  }
})
