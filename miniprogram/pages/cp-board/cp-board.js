
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: 1,
  },

  onTab(e) {
    console.log("e", e);

    let index = e.currentTarget.dataset.index;
    this.setData({
      tab: index

    })

  }

})