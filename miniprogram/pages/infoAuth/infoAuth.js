import * as request from "../../util/request"
let app = getApp()

Page({

  data: {
    menu: [{
      title: "实名认证",
      desc: "连接公安系统大数据验证身份真实性",
      path: '/pages/infoAuth/idCard/idCard',
      authStep: 0,// 0，1，2 => 未认证，审核中，已认证
    }, {
      title: "工作认证",
      desc: "互联网/金融/事业单位等优质青年聚集地",
      path: '/pages/infoAuth/job/job',
      authStep: 0,
    }, {
      title: "学历认证",
      desc: "985/211/名校/海归等高学历人群聚集地",
      path: '/pages/infoAuth/education/education',
      authStep: 0,
    }]
  },

  async onShow() {
    // 重新新加载获取学生信息
    let res = await request.APICall("GET", "/api/student/info")
    console.log("GET student info", res);
    let studentInfo = res.data
    app.globalData.studentInfo = studentInfo
    if (studentInfo.has) {

      if (studentInfo.info.idCardValid) {
        this.data.menu[0].authStep = 2
      }
      if (studentInfo.info.educationImages) {
        this.data.menu[1].authStep = 1
      }
      if (studentInfo.info.jobAuthValid) {
        this.data.menu[1].authStep = 2
      }

      if (studentInfo.info.jobImages) {
        this.data.menu[2].authStep = 1
      }
      if (studentInfo.info.educationAuthValid) {
        this.data.menu[2].authStep = 2
      }
      this.setData({ menu: this.data.menu })
    }

  },
  onAuthClick(e) {
    let index = e.currentTarget.dataset.index


    wx.navigateTo({
      url: this.data.menu[index].path
    })

  }
})