Component({
  /**
   * 页面的初始数据
   */
  data: {
    inputValue:'',
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
