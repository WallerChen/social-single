import Event from './utils/eventBus'
import { getUserRegister } from './api/request'
import * as request from './api/request'

App({
  event: new Event(),
  globalData: {
    employ: '',
    user: {}
  },
  onLaunch: async function() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'single-1g8xzqs704ef759e',
        traceUser: true
      })
    }

    // 1 秒后还没准备好就显示loading
    const timer = setTimeout(() => {
      wx.showLoading({
        title: '获取同学录中...',
        mask: true
      })
    }, 1000)

    for (;;) {
      // 一直循环，直到云API 可用
      try {
        // eslint-disable-next-line no-await-in-loop
        await request.getServerLiveness()
        clearTimeout(timer)
        wx.hideLoading()

        break
      } catch (error) {
        console.log('cloud API not ready, retry', error)
      }
    }

    const userRegisterResult = await getUserRegister()
    const registered = userRegisterResult.data.data.registered
    const classname = userRegisterResult.data.data.class
    wx.setStorageSync('isRegister', registered)
    wx.setStorageSync('classname', classname)
    this.event.emit('checkoutRegister')
  }
})