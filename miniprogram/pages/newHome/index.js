import {classMap, classItemList} from '../../util/classUtil'
let startX = 0
let endX = 0
let shouldMove = true  // 防止频繁触发
Page({
    /**
     * 页面的初始数据
     */
    data: {
      classItemList,
      classMap,
      classUserList: [],
      // 卡片滑动
      prevList:[],
      nextList:[],
      currentPage: 0,
      pages:[
        'Page0',
        'Page1',
        'Page2',
        'Page3',
        'Page4'
      ]
    },
  
    onLoad(options) {
      wx.setNavigationBarColor({
          frontColor: '#000000',
          backgroundColor: '#f1F3F8',
      });
      let that = this;
      wx.request({
        url: 'http://localhost/user',
        success (res) {
          let userInfoList = res.data.rows;
          that.setData({
            classUserList: userInfoList
          })
        }
      });
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
    },

    // 卡片滑动
    touchStart(e){
      startX = e.touches[0].pageX
      shouldMove = true
    },
    touchMove(e){
      endX = e.touches[0].pageX
      if(shouldMove){
        if(startX - endX > 50){
          console.log('左滑')
          this.next()
          shouldMove = false
        } else if (endX - startX > 50){
          console.log('右滑')
          this.prev()
          shouldMove = false
        }      
      }
    },
    prev(){
      if(this.data.currentPage > 0){
        let currentPage = this.data.currentPage - 1
        console.log('prev');
        this.setData({
          ['nextList[' + currentPage + ']']: '',
          ['prevList[' + currentPage + ']']: 'prevAnimation',
          currentPage: currentPage
        })
      }
    },
    next(){
      if(this.data.currentPage < 4){
        let currentPage = this.data.currentPage
        console.log('next');
        this.setData({
          ['prevList[' + currentPage + ']']: '',
          ['nextList[' + currentPage + ']']: 'nextAnimation',
          currentPage: currentPage + 1
        })      
      }
    }
    
  });