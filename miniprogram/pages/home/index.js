Page({

  /**
   * 页面的初始数据
   */
  data: {
    // showUploadTip: false,
    // haveGetRecord: false,
    // envId: '',
    // record: ''
    envId:'single'
  },

  onLoad(options) {
    // this.setData({
    //   envId: options.envId
    // });
    this.getOpenId();
  },

  // 获取用户ID
  getOpenId() {
    wx.showLoading({
      title: '',
    });
   wx.cloud.callFunction({
      name: 'inithandler',
      config: {
        env: 'single'
      },
      data: {
        type: 'classCardData',
        params: {
          key: 'get'
        }
      }
    }).then((resp) => {
      console.log('resres:' + JSON.stringify(resp));
   }).catch((e) => {
    console.log('catchcatchL' + JSON.stringify(e));
    });
  },

  // 获取banner数据
  initBanner(){

  },

  touchStart(e) {
    let index = e.currentTarget.dataset.index
    let touches = e.touches
    let list = this.data.list || []
    // 多点触摸让图片回到原位
    if (touches.length > 1) {
      list[index].x = winWidth
      list[index].y = 0
      that.setData({ list })
    } else if (index === (list.length - 1)) {
      let startX = e.touches[0].clientX;
      let startY = e.touches[0].clientY;
      this.setData({ startX, startY }) 
    }
  },
  // 拖动结束
  touchEnd(e) {
    let index = e.currentTarget.dataset.index
    let list = this.data.list || []
    if (index === (list.length - 1)) {
      let that = this;
      let startX = this.data.startX;
      let startY = this.data.startY;
      let endX = e.changedTouches[0].clientX;
      let endY = e.changedTouches[0].clientY;
      var distance = that.data.distance;
      // 与结束点与图片初始位置距离
      let disX = Math.abs(distance - winWidth)
      // 当前操作，初始点与结束点距离
      let disClientX = Math.abs(endX - startX)
      let disClientY = Math.abs(endY - startY)
      // 当滑动大于 滑块宽度的1/3翻页
      let ratio = this.data.ratio
      let moveDis = 666 / (ratio * 3);
      console.log(disX, moveDis)
      if (disX > moveDis && disClientX > moveDis) {
        list[index].x = (endX - startX) > 0 ? winWidth * 2 : -winWidth
        // 移除时距离竖向距离
        // list[index].y = disClientY
        that.setData({
          list: list,
          animationA: null
        });
        // 移出动画结束后 从list内移除
        setTimeout(() => {
          list.splice((list.length - 1), 1);
          that.setData({ list })
          // 列表长度小于4的时候请求服务端
          if (list.length < 4) {
            that.getList()
          }
        }, 300)
      } else if (disClientX < 1 && disClientY < 1) {
        // 点击进入
        console.log('点击进入详情')
      } else {
        list[index].x = winWidth
        list[index].y = 0
        that.setData({ list })
      }
    }
  },
  touchMove (e) {
    // 左滑右滑手势可优化
  },
  onChange: function (e) {
    var that = this;
    that.setData({
      distance: e.detail.x
    })
  },

});
