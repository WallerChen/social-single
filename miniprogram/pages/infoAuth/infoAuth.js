
Page({

  data: {
    menu: [{
      title: "实名认证",
      desc: "连接公安系统大数据验证身份真实性"
    }, {
      title: "工作认证",
      desc: "互联网/金融/事业单位等优质青年聚集地"
    }, {
      title: "学历认证",
      desc: "985/211/名校/海归等高学历人群聚集地"
    }]
  },

  onAuthClick(e){ 
    wx.navigateTo({
      url: '/pages/infoAuth/idCard/idCard',
    })

  }
})