import { classMap, classItemList } from '../../util/classUtil'

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
      showModal: false,
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
    },
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
        this.setData({
          ['prevList[' + currentPage + ']']: '',
          ['nextList[' + currentPage + ']']: 'nextAnimation',
          currentPage: currentPage + 1
        })      
      }
    }
  });