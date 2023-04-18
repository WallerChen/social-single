// pages/activity/activity.js
Page({

  data: {
    showDropdown: [0, 0]

  },

  onLoad(options) {

  },
  onShowDropdown(e) {
    let index = e.currentTarget.dataset.index
    this.data.showDropdown[index] = 1
    this.setData({ showDropdown: this.data.showDropdown });
  },
  onSelectItem(e) {
    let menu = e.currentTarget.dataset.menu
    let item = e.currentTarget.dataset.item
    console.log("select", item);

    this.data.showDropdown[menu] = 0

    this.setData({ showDropdown: this.data.showDropdown });
  },
})