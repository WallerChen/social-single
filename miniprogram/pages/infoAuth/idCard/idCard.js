import * as request from '../../../util/request'

Page({

  data: {
    name: '',
    idNum: ''
  },

  onLoad(options) {

  },

  userInfoAuth() {

  },

  async onConfirm() {
    if (this.data.idNum.length !== 18 && this.data.idNum.length != 15) {
      console.log('this.data.idNo.length', this.data.idNum.length)
      wx.showToast({
        icon: 'error',
        title: '请输入有效身份证号码'
      })
      return
    }

    try {
      wx.showLoading({
        title: '验证中...'
      })
      const res = await request.APICall('POST', '/api/student/idcard', {
        name: this.data.name,
        idNum: this.data.idNum
      })
      wx.hideLoading()
      console.log('POST idcard', res)
      const data = res.data

      if (data.respCode == '0000') {
        wx.showToast({
          icon: 'success',
          title: '实名验证成功'
        })
        return
      }

      wx.showModal({
        showCancel: false,
        title: '实名认证失败',
        content: `${data.respMsg}, 错误码: ${data.respCode}`
      })
    } catch (error) {
      wx.hideLoading()
      console.error('idcard/validate fail', error)

      wx.showModal({
        showCancel: false,
        title: '实名认证失败',
        content: `错误：${error.data.msg || JSON.stringify(error.data)}`
      })
    }
  }

})