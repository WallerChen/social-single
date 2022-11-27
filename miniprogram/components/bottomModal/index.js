// miniprogram/components/cloudTipModal/index.js

Component({

  /**
   * 页面的初始数据
   */
  data: {
    showBottom: false,
    introduce:''
  },
  properties: {
    showBottomTip: Boolean,
    showIntroduce: String
  },
  observers: {
    showIntroduce: function(introduce) {
      console.log(introduce);
      this.setData({
        introduce:introduce
      })
    },
    showBottomTip: function(showBottomTip) {
      console.log(showBottomTip);
      this.setData({
        showBottom: showBottomTip
      });
    }
  },
  methods: {
    onChangeShowBottomTip() {
      this.setData({
        showBottom: !this.data.showBottom
      });
    },
  }

});
