import {classMap, classItemList} from '../../util/classUtil'

Page({
    /**
     * 页面的初始数据
     */
    data: {
      classItemList,
      classMap,
      showModal:false,
    },
  
    onLoad(options) {
      wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#f1F3F8',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
    },
    onShow(){
    },
    onUnload(){
    },
    closeModal() {
      this.setData({
        showModal:false
      })
    }
  });