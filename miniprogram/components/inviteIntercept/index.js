Component({
  /**
   * 页面的初始数据
   */
  data: {
    inputValue:''
  },
  properties: {
    visible: {
      type: Boolean,
      default: true
    }
  },
  observers: {
    visible(oldObj, newObj) {
    }
  },
  methods: {
    bindKeyInput: function (e) {
      this.setData({
        inputValue: e.detail.value
      })
    },
    onPopHelp() {
      wx.previewImage({
        current: 'https://single-design.bj.bcebos.com/shizi.jpeg', // 当前显示图片的 http 链接
        urls: ['https://single-design.bj.bcebos.com/shizi.jpeg']
      })
    },
    // 触发页面方法
    onConfirm() {
      this.triggerEvent("confirm",this.data.inputValue);
    },
    closeDialog() {
      this.setData({
        visible: false
      })
    }
  }
});
