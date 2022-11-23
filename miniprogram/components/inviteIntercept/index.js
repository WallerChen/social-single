Component({
  /**
   * 页面的初始数据
   */
  data: {
  },
  properties: {
    visiable: {
      type: Boolean,
      default: false
    }
  },
  observers: {
  },
  methods: {
    closeDialog() {
      this.setData({
        visiable: false
      })
    }
  }
});
