Component({
  properties: {
    userInfo: Object
  },
  methods: {
    previewImage(e) {
      const { image } = e.currentTarget.dataset
      wx.previewImage({ urls: [image], current: image })
    },
    close() {
      this.triggerEvent('close')
    }
  }
})