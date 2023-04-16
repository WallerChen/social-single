import { yearMonthDayStr } from '../../util/util';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 活动列表
    activityList: [],
  },

  onLoad(options) {
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#9DC6FF',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    });
    // 加载活动
    let that = this;
    wx.request({
      url: 'http://localhost/activity',
      success (res) {
        console.log('res:' + JSON.stringify(res));
        console.log('res:' + res.data.rows);
        let activityData = res.data.rows.map(item => {
          return {
            date: yearMonthDayStr(item.createdAt),
            ...item
          }
        })
        that.setData({
          activityList: activityData
        })
      }
    });
  },
  onShow(){
  },
  onUnload(){
  },
});
