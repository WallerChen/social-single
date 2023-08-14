Component({
  properties: {
    show: Boolean,
  },
  methods: {
    onDiscard() {
      this.triggerEvent('ondiscard');
      this.setData({
        show: false
      })
    },
    onRestore() {
      this.triggerEvent('onrestore');
      this.setData({
        show: false
      })
    }, 
  },
});
