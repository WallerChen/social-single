import * as request from '../../api/request'

Page({

  data: {
    showDropdown: [0, 0],
    activityList: [],
    total: 0

  },

  async onLoad() {
    const res = await request.APICall('GET', '/api/v1/activityList')
    console.log('activityList', res)
    this.setData({
      activityList: res.data.rows,
      total: res.data.total
    })
  },
  onShowDropdown(e) {
    const index = e.currentTarget.dataset.index
    this.data.showDropdown[index] = 1
    this.setData({ showDropdown: this.data.showDropdown })
  },
  onSelectItem(e) {
    const menu = e.currentTarget.dataset.menu
    const item = e.currentTarget.dataset.item
    console.log('select', item)

    this.data.showDropdown[menu] = 0

    this.setData({ showDropdown: this.data.showDropdown })
  },

  onActivityClick(e) {
    // const id = e.currentTarget.dataset.id
    const qjlPath = e.currentTarget.dataset.qjlPath
    if (!qjlPath) {
      wx.showModal({
        title: '提示',
        content: '未设置群接龙活动，请告诉管理员设置一下先',
        showCancel: false
      })
      return
    }

    wx.navigateToMiniProgram({
      appId: 'wx974b793334f3667b',
      path: qjlPath
      //  `pro/pages/seq-detail/detail-read/detail-read?hotPointValue=1655ac7262651500c19bedf3fd2841a7&actId=2312030010954924&inviteUid=100942443&fromShare=1&groupId=PsX7Vq5_bsx0P7m_7943d37a`,
    })
    // wx.navigateTo({
    //   url: `/pages/activity/detail?id=${id}`
    // })
  }
})