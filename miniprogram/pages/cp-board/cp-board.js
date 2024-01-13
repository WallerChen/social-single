const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: 0,
    lockContent: true
  },

  onShow(e) {
    this.setData({
      lockContent: !app.globalData.user.registered
    })
  },
  onTab(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      tab: index

    })
  },
  onUnlock(e) {
    // this.setData({
    //   lockContent: false
    // })

    if (!app.globalData.user.registered) {
      wx.switchTab({
        url: '/pages/mine/mine'
      })
    }
  }

})