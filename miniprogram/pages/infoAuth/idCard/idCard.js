import * as request from '../../../api/request'

Page({

  data: {
    name: '',
    idCard: ''
  },

  onLoad(options) {

  },

  userInfoAuth() {

  },

  async onConfirm() {
    if (this.data.idCard.length !== 18 && this.data.idCard.length !== 15) {
      console.log('this.data.idNo.length', this.data.idCard.length)
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
      const res = await request.APICall('POST', '/api/v1/info-auth/id-card', {
        name: this.data.name,
        idCard: this.data.idCard
      })
      wx.hideLoading()
      console.log('POST idcard', res)

      if (res.code !== 200) {
        wx.showToast({
          icon: 'fail',
          title: res.msg
        })
        return
      }

      if (res.data.respCode === '0000') {
        wx.showToast({
          icon: 'success',
          title: '实名验证成功'
        })
        return
      }

      wx.showModal({
        showCancel: false,
        title: '实名认证失败',
        content: `${res.data.respMsg}, 错误码: ${res.data.respCode}`
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