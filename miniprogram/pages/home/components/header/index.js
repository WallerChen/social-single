// miniprogram/components/cloudTipModal/index.js
// const { isMac } = require('../../envList.js');

Component({
  /**
   * 组件
   */
  data: {
    cardCur: 0,
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84000.jpg'
    }, {
      id: 1,
        type: 'image',
        url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84001.jpg',
    }],
  },
  options: {
    styleIsolation: 'shared'
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在 methods 段中定义的方法名
    attached: function () { 
      console.log('attachedattached:');
      this.towerSwiper('swiperList');
    },
    moved: function () { },
    detached: function () { },
  },
  properties: {
  },
  observers: {
  },
  methods: {
    DotStyle(e) {
      this.setData({
        DotStyle: e.detail.value
      })
    },
    // cardSwiper
    cardSwiper(e) {
      this.setData({
        cardCur: e.detail.current
      })
    },
    // towerSwiper
    // 初始化towerSwiper
    towerSwiper(name) {
      let list = this.data[name];
      for (let i = 0; i < list.length; i++) {
        list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
        list[i].mLeft = i - parseInt(list.length / 2)
      }
      this.setData({
        swiperList: list
      })
    },
    // // towerSwiper触摸开始
    // towerStart(e) {
    //   this.setData({
    //     towerStart: e.touches[0].pageX
    //   })
    // },
  //   // towerSwiper计算方向
  //   towerMove(e) {
  //     this.setData({
  //       direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
  //     })
  //   },
  //   // towerSwiper计算滚动
  //   towerEnd(e) {
  //     let direction = this.data.direction;
  //     let list = this.data.swiperList;
  //     if (direction == 'right') {
  //       let mLeft = list[0].mLeft;
  //       let zIndex = list[0].zIndex;
  //       for (let i = 1; i < list.length; i++) {
  //         list[i - 1].mLeft = list[i].mLeft
  //         list[i - 1].zIndex = list[i].zIndex
  //       }
  //       list[list.length - 1].mLeft = mLeft;
  //       list[list.length - 1].zIndex = zIndex;
  //       this.setData({
  //         swiperList: list
  //       })
  //     } else {
  //       let mLeft = list[list.length - 1].mLeft;
  //       let zIndex = list[list.length - 1].zIndex;
  //       for (let i = list.length - 1; i > 0; i--) {
  //         list[i].mLeft = list[i - 1].mLeft
  //         list[i].zIndex = list[i - 1].zIndex
  //       }
  //       list[0].mLeft = mLeft;
  //       list[0].zIndex = zIndex;
  //       this.setData({
  //         swiperList: list
  //       })
  //     }
  //   }
  }
});