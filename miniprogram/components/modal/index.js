Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    showModal: {
      type: Boolean
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // confirmText: '确认',
    // cancelText: '取消',
    // tintColor: 'color:#00a48f'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    closeDialog() {
        this.setData({
            showWx: false
        })
      }
  },

//   ready: function () {
    // let that = this
    // wxPromisify(wx.getSystemInfo)().then(res => {
    //   that.setData({
    //     height: res.windowHeight + 'px'
    //   })
    // })
//   }
})
