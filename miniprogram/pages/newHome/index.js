import {classMap, classItemList} from '../../util/classUtil'

Page({
    /**
     * 页面的初始数据
     */
    data: {
      classItemList,
      classMap
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
    navigatorToActivite() {
      wx.navigateToMiniProgram({
        appId: 'wx059cd327295ab444',
        path: 'page/index/index?id=123',
        extraData: {
          foo: 'bar'
        },
        envVersion: 'develop',
        success(res) {
          // 打开成功
        }
      })
    }
  });