// pages/grade/grade.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    course: {
      type: String,
      value: 'chinese',
    },
    scrollHeight: {
      type: Number,
      value: 1206
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    categories: [
      { name: "p1", value: "小学" },
      { name: "m1", value: "初中" },
      { name: "h1", value: "高中" }
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
    toView: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindCategoryTap: function (evt) {
      let name = evt.currentTarget.dataset.name
      this.setData({
        toView: name
      })
    },

    bindGradeTap: function (evt) {
      // 进入听写页面
      let id = evt.currentTarget.id
      wx.navigateTo({
        url: '/pages/source/source?type=' + this.properties.course + '&grade=' + id
      })
    }
  }
})
