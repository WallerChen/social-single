import { postUserRegister } from '../../api/request'

const app = getApp()

Component({
  properties: {
    show: Boolean
  },
  data: {
    inviteCode: '',
    showQr: false
  },
  methods: {
    hide() {
      this.triggerEvent('onhide')
    },
    editInviteCode(e) {
      this.setData({ inviteCode: e.detail.value })
    },
    onCloseAdminQr() {
      this.setData({ showQr: false })
    },
    onShowAdminQr() {
      this.setData({ showQr: true })
    },
    async onRegister() {
      try {
        const result = await postUserRegister({ inviteCode: this.data.inviteCode })
        if (result.code === 200) {
          // TODO: 提示为欢迎来到脱单二班?
          wx.showToast({ title: '加入成功', icon: 'success' })

          const registered = result.data.registered
          const classId = result.data.classId
          const openid = result.data.openid
          const isAdmin = result.data.isAdmin
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