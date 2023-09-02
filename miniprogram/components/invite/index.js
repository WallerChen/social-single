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
          // TODO: 提示为欢迎来到脱单二班?
          wx.showToast({ title: '加入成功', icon: 'success' })

          const registered = result.data.data.registered
          const classId = result.data.data.classId
          const openid = result.data.data.openid
          const isAdmin = result.data.data.isAdmin
          app.globalData.user = {
            isAdmin,
            openid,
            classId,
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