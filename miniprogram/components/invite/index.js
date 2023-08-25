import { postUserRegister } from '../../api/request'

const app = getApp()

Component({
  properties: {
    show: Boolean
  },
  data: { inviteCode: '' },
  methods: {
    hide() {
      this.triggerEvent('onhide')
    },
    editInviteCode(e) {
      this.setData({ inviteCode: e.detail.value })
    },
    async register() {
      try {
        const result = await postUserRegister({ inviteCode: this.data.inviteCode })
        if (result.data.code === 200) {
          wx.showToast({ title: '加入成功', icon: 'success' })

          wx.setStorageSync('isRegister', true)
          wx.setStorageSync('classname', result.data.data.class)
          app.event.emit('checkoutRegister')

          this.hide()
        } else {
          wx.showToast({ title: '邀请码有误', icon: 'error' })
        }
      } catch (e) {
        console.error(e)
      }
    }
  }
})