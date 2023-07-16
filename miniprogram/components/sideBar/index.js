Component({
  properties: {
    show: Boolean,
    onhide: Object,
  },
  methods: {
    hide() {
      this.triggerEvent('onhide');
    },
    keepShow() {
    },
  },
});
