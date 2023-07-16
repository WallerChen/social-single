Component({
  properties: {
    show: Boolean,
  },
  methods: {
    hide() {
      this.triggerEvent('onhide');
    },
    delete() {
      this.triggerEvent('ondelete');
      this.hide();
    },
    save() {
      this.hide();
    },
  },
});
