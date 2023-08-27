Component({
  properties: {
    desc: String,
    imageList: Array,
    avatarUrl: String
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