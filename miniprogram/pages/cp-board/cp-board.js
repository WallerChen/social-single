Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: 0,
    lockContent: true
  },

  onTab(e) {
    console.log('e', e)

    const index = e.currentTarget.dataset.index
    this.setData({
      tab: index

    })
  },
  onUnlock(e) {
    this.setData({
      lockContent: false
    })
  }

})