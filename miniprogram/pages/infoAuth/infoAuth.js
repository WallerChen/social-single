
Page({

  data: {
    menu: [{
      title: "实名认证",
      desc: "连接公安系统大数据验证身份真实性",
      path : '/pages/infoAuth/idCard/idCard',
    }, {
      title: "工作认证",
      desc: "互联网/金融/事业单位等优质青年聚集地",
      path : '/pages/infoAuth/job/job',
    }, {
      title: "学历认证",
      desc: "985/211/名校/海归等高学历人群聚集地",
      path : '/pages/infoAuth/education/education',
    }]
  },

  onAuthClick(e){ 
    let index = e.currentTarget.dataset.index
      
     
    wx.navigateTo({
      url: this.data.menu[index].path
    })

  }
})