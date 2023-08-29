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

          const registered = result.data.data.registered
          const classId = result.data.data.classId
          const openid = result.data.data.openid
          this.globalData.user = {
            openid,
            classId: classId,
            registered
          }

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