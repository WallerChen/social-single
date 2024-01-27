import Event from './utils/eventBus'
import { getUserRegister } from './api/request'
import * as request from './api/request'

const waitMsgList = [
  ['获取同学录中...', 2000],
  ['仍在努力中...', 5000],
  ['再稍微等一下...', 5000],
  ['有点久哈...', 5000],
  ['服务器在努力启动了...', 10000],
  ['估计是冷启动了..', 5000],
  ['太冷了吧这也...', 15000]
]

let msgTimer = null
function startWaitMsg(index = 0) {
  const title = waitMsgList[index][0]
  const ms = waitMsgList[index][1]

  wx.hideLoading()
  wx.showLoading({
    title: title,
    mask: true
  })
  msgTimer = setTimeout(() => {
    if (index >= waitMsgList.length) {
      return
    }
    startWaitMsg(index + 1)
  }, ms)
}

function stopWaitMsg() {
  if (msgTimer) {
    wx.hideLoading()
    clearTimeout(msgTimer)
    msgTimer = null
  }
}
App({
  event: new Event(),
  globalData: {
    employ: '',
    user: {}
  },

  onShow(options) {
    // 小程序挂后台，点分享卡片再进来会触发onshow
    // 热启动都会触发app onShow所以应该放到对应页面onLoad 判断
    console.log('app onShow', options)
    // 1007 单人聊天会话中的小程序消息卡片
    // 1008 群聊会话中的小程序消息卡片
    // 1044 带 shareTicket 的小程序消息卡片

    // if (e.scene === 1044) {
    // 通过分享进来的
    // if ( options.query.shareUserId) {
    // if (e.shareTicket && e.query.shareUserId) {
    // const shareUserId = e.query.shareUserId
    // this.globalData.shareUserId = shareUserId
    // }
    // }
  },

  delay: (ms) => new Promise((resolve) => {
    setTimeout(resolve, ms)
  }),
  onLaunch: async function(options) {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'single-1g8xzqs704ef759e',
        traceUser: true
      })
    }

    // 如果有新的版本强制更新版本
    if (wx.getUpdateManager) {
      const updateManager = wx.getUpdateManager()
      updateManager.onUpdateReady(() => {
        updateManager.applyUpdate()
      })
    }

    // 1 秒后还没准备好就显示loading
    const startMsgTimer = setTimeout(() => {
      startWaitMsg()
    }, 1500)

    for (; ;) {
      // 一直循环，直到云API 可用
      try {
        // eslint-disable-next-line no-await-in-loop
        await request.getServerLiveness()
        stopWaitMsg()
        clearTimeout(startMsgTimer)
        break
      } catch (error) {
        console.log('API not ready, retry', error)
        // eslint-disable-next-line no-await-in-loop
        await this.delay(500)
      }
    }

    const userRegisterResult = await getUserRegister()
    const registered = userRegisterResult.data.registered
    const classId = userRegisterResult.data.classId
    const openid = userRegisterResult.data.openid
    const isAdmin = userRegisterResult.data.isAdmin
    this.globalData.user = {
      isAdmin,
      openid,
      classId: classId,
      registered
    }
    this.event.emit('checkoutRegister')
  }
})