import {toCode, fromCode} from '../..//util/util';
let winWidth = 414;
let winHeight = 736;
function deepClone(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }
  let newObj = obj instanceof Array ? [] : {}
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key]
    }
  }
  return newObj
}
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    studentList: [],
    x: 414,
    y: 736,
    animationA: {},
    startX: '', // 初始点X位置
    startY: '', // 初始点Y位置
    currentIndex: -1, // 当前最上层滑块
    ratio: 2, // 屏幕比例,
    // 邀请码展现
    visible: true,
    currentPage: 0,
    pageSize: 10,
    total: 0,
    // 展现底部详情
    showBottom: false,
    showIntroduce: ''
},

  onLoad(options) {
    let res = wx.getSystemInfoSync();
    let ratio = res.pixelRatio;
    winWidth = res.windowWidth;
    winHeight = res.windowHeight;

    if (app.globalData.employ && app.globalData.employ != '') {
      console.log(' app.globalData.user:' + JSON.stringify( app.globalData.user))
      this.setData({
        visible: app.globalData.user.class ? false : true
      })
    } else {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.employCallback = employ => {
      console.log(' app.globalData.user2:2' + JSON.stringify( app.globalData.user))
        if (employ != '') {
          this.setData({
            visible: app.globalData.user.class ? false : true
          });         
        }
      }
    }
    this.setData({ ratio });
    // 获取卡片信息
    this.getShowCardList();
    this.setData({
      visible: app.globalData.user.class ? false : false
    })
  },
  // 获取用户ID
  getShowCardList() {
    wx.cloud.callFunction({
      name: 'inithandler',
      config: {
        env: 'single-1g8xzqs704ef759e'
      },
      data: {
        type: 'classCardData',
        params: {
          key: 'get',
          body: {
            currentPage: this.data.currentPage,
            pageSize: this.data.pageSize
          }
        }
      }
    }).then((resp) => {
      let studentList = this.data.studentList || [];
      let cardData  = resp?.result?.data?.data;
      let total = resp?.result?.data?.total;
      let newArr = deepClone(cardData);
      for (let item of newArr) {
        item.x = winWidth
        item.y = 0
        studentList.unshift(item)
      }
      // 判断是否超出分页范围 超出则重新置0
      let finalPage = total / this.data.pageSize;
      let finalShowPage = 0;
      if(this.data.currentPage + 1 > finalPage) {
        finalShowPage = 0;
      } else {
        finalShowPage = this.data.currentPage + 1
      }
      this.setData({
        studentList,
        currentPage: finalShowPage,
        total: total
      });
   }).catch((e) => {
      console.log(e)
    });
  },
  
  // 邀请码确认
  confirm(value) {
    let openClass = '脱单一班';
    let decodeText = fromCode(value.detail);
    if (openClass != decodeText) {
      wx.showToast({
        icon: 'none',
        title: '邀请码错误～',
      })
      return;
    } else {
      app.globalData.user.class = fromCode(value.detail);
      // 更新用户class
      wx.cloud.callFunction({
        name: 'inithandler',
        config: {
          env: 'single-1g8xzqs704ef759e'
        },
        data: {
          type: 'user',
          params: {
            key: 'add',
            body: {
              ...app.globalData.user
            }
          }
        }
      }).then((resp) => {
        app.event.emit('updateHomeInfo', app.globalData.user);
     }).catch((e) => {
      });
      this.setData({
        visible: false
      })
    }
  },

  touchStart(e) {
    let index = e.currentTarget.dataset.index
    let touches = e.touches
    let list = this.data.studentList || []
    // 多点触摸让图片回到原位
    if (touches.length > 1) {
      list[index].x = winWidth
      list[index].y = 0
      that.setData({ studentList: list })
    } else if (index === (list.length - 1)) {
      let startX = e.touches[0].clientX;
      let startY = e.touches[0].clientY;
      this.setData({ startX, startY }) 
    }
  },
  // 拖动结束
  touchEnd(e) {
    let index = e.currentTarget.dataset.index
    let list = this.data.studentList || []
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
      // 1、只生效向左滑动
      if(endX - startX > 0) return;
      let disClientX = Math.abs(endX - startX)
      let disClientY = Math.abs(endY - startY)
      // 当滑动大于 滑块宽度的1/3翻页
      let ratio = this.data.ratio
      let moveDis = 666 / (ratio * 3);
      // console.log(disX, moveDis)
      if (disX > moveDis && disClientX > moveDis) {
        list[index].x = (endX - startX) > 0 ? winWidth * 2 : -winWidth
        // 移除时距离竖向距离
        that.setData({
          studentList: list,
          animationA: null
        });
        // 移出动画结束后 从list内移除
        setTimeout(() => {
          list.splice((list.length - 1), 1);
          that.setData({ studentList: list })
          // 列表长度小于7的时候请求服务端
          if (list.length < 7) {
              that.getShowCardList();
          }
        })
      } else if (disClientX < 1 && disClientY < 1) {
        // 点击进入
        that.setData({
          showBottom: true,
          showIntroduce: that.data.studentList[index].desc
        })
        console.log('点击进入详情')
      } else {
        list[index].x = winWidth
        list[index].y = 0
        that.setData({ studentList: list })
      }
    }
  },
  touchMove (e) {
    // 左滑右滑手势可优化
  },
  onChange: function (e) {
    this.setData({
      distance: e.detail.x
    })
  },

});
