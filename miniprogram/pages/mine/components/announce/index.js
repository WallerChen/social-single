Component({
  methods: {
    cancel() {
      this.triggerEvent('cancel')
    },
    confirm() {
      this.triggerEvent('confirm')
    }
  }
})