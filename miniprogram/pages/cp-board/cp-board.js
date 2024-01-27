const app = getApp()

Page({

  data: {
    tab: 0,
    lockContent: true,
    cpPhoto: [
      '/cp-data/cp1/cover.jpg',
      '/cp-data/cp2/cover.jpg'
    ],
    shareTitle: [
      '桃花榜 - 对话养生少女',
      '桃花榜 - 荷尔蒙下的真实'
    ]
  },
  onLoad() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  onSub() {
    wx.requestSubscribeMessage({
      tmplIds: [
        'merClK981fy5JZrRb1n6zKlyAkkK6ym1Lnbglpc4wug'
      ],
      success(res) {
        console.log('success', res)

        // TODO: 告诉后端订阅成功
      },
      fail(err) {
        console.log('error', err)
      }
    })
  },

  onTab(e) {
    console.log('e', e)

    const index = e.currentTarget.dataset.index

    if (index) {
      if (!app.globalData.user.registered) {
        wx.switchTab({
          url: '/pages/mine/mine'
        })
      }
    }

    this.setData({
      tab: index
    })
  },
  onShow() {
    if (app.globalData.user.registered) {
      this.setData({
        lockContent: false
      })
    }
  },
  onUnlock(e) {
    if (!app.globalData.user.registered) {
      wx.switchTab({
        url: '/pages/mine/mine'
      })
    }
  },
  onPreviewImg(e) {
    // 什么垃圾小程序，包内图片不支持预览
    const { image } = e.currentTarget.dataset
    wx.previewImage({
      urls: [image],
      current: image
    })
  },
  onShareAppMessage(e) {
    return {
      title: this.data.shareTitle[this.data.tab],
      path: `pages/cp-board/cp-board?tab=${this.data.tab}`
    }
  }
})