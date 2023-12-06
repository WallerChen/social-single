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
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/activity/detail?id=${id}`
    })
  }
})