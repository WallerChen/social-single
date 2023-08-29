import Event from './utils/eventBus'
import { getUserRegister } from './api/request'
import * as request from './api/request'


function showLoadingAfter(title, ms) {
  return setTimeout(() => {
    wx.hideLoading()
    wx.showLoading({
      title: title,
      mask: true
    })
  }, ms)
}

function prepareMsgSequence() {
  let timerList = []
  timerList.push(showLoadingAfter('获取同学录中...', 1000))
  timerList.push(showLoadingAfter('仍在努力中...', 5000))
  timerList.push(showLoadingAfter('有点久哈...', 10000))
  timerList.push(showLoadingAfter('很快就好了...', 15000))
  timerList.push(showLoadingAfter('再稍微等一下...', 20000))
  return timerList
}

function clearMsgSequence(timerList) {
  for (let i = 0; i < timerList.length; i++) {
    clearTimeout(timerList[i])
  }
}

App({
  event: new Event(),
  globalData: {
    employ: '',
    user: {}
  },
  onLaunch: async function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'single-1g8xzqs704ef759e',
        traceUser: true
      })
    }

    // 1 秒后还没准备好就显示loading
    prepareMsgSequence()


    for (; ;) {
      // 一直循环，直到云API 可用
      try {
        // eslint-disable-next-line no-await-in-loop
        await request.getServerLiveness()
        clearMsgSequence()
        wx.hideLoading()

        break
      } catch (error) {
        console.log('cloud API not ready, retry', error)
      }
    }

    const userRegisterResult = await getUserRegister()
    const registered = userRegisterResult.data.data.registered
    const classId = userRegisterResult.data.data.classId
    const openid = userRegisterResult.data.data.openid
    const isAdmin = userRegisterResult.data.data.isAdmin
    this.globalData.user = {
      isAdmin,
      openid,
      classId: classId,
      registered
    }
    this.event.emit('checkoutRegister')
  }
})