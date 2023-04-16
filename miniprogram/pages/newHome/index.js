import { classMap, classItemList } from '../../util/classUtil'
import { getUserCardlistCT } from '../../api/user'
import { deepClone } from '../../util/util'

let startX = 0
let endX = 0
let shouldMove = true  // 防止频繁触发

const admins = ['o6orS5emZUHW5BGNYAGO2SP2P7hg', 'o6orS5aPPXUXSFePhdLTy_Ygn-A8', 'o6orS5ZvU2Us8IMFLPkO_WHV8_Io', 'o6orS5UyuvCbL7HCHE8c8gk-WjoM'];
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
      pageIndex:0,
      pageSize: 10,
      adminClass: undefined
    },
  
    onLoad(options) {
      //   wx.setNavigationBarColor({
      //   frontColor: '#000000',
      //   backgroundColor: '#f1F3F8',
      //   animation: {
      //     duration: 400,
      //     timingFunc: 'easeIn'
      //   }
      // });
      this.initUserStatus();
      // 获取展现信息
      this.onGetUserInfo();
    },
    onShow(){
    },
    onUnload(){
    },

// 分享到朋友圈
    onShareAppMessage() {
      const promise = new Promise(resolve => {
        setTimeout(() => {
          resolve({
            title: '单身同学录'
          })
        }, 2000)
      })
      return {
        title: '单身同学录',
        path: '/page/home/index',
        promise 
      }
    },
    // 初始化登陆用户状态
    initUserStatus() {
      let app = getApp();
      if (app.globalData.employ && app.globalData.employ != '') {
        this.onShowVisible();
      } else {
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        app.employCallback = employ => {
          if (employ != '') {
           this.onShowVisible();
          }
        }
      }
    },
    // 设置卡片可视
    onShowVisible() {
      // 判断用户是哪个班级
      let app = getApp();
      // console.log('globalData.user:' + JSON.stringify(app.globalData.user));
      for (const index in this.data.classItemList) {
      if(admins.includes(app.globalData.user?.openid)){
        this.setData({
          [`classItemList[${index}].isShow`]: true,
          [`classItemList[${index}].isLock`]: false
        });
      }
      else {
        this.setData({
          [`classItemList[${index}].isShow`]: this.data.classItemList[index].title == app.globalData.user?.class,
          [`classItemList[${index}].isLock`]: !(this.data.classItemList[index].title == app.globalData.user?.class),
        });
      }
    }
      // 获取卡片信息
      this.setData({
      visible: !(app.globalData.user?.class || app.globalData.user?.class == ''),
      scrollToView: classMap[app.globalData.user?.class]
    }, ()=> {
        if(!this.data.visible){
          this.onGetUserInfo();
        }
    });
  },

    // 获取用户信息
    onGetUserInfo() {
      let app = getApp();
      getUserCardlistCT({
        cls: this.data.adminClass || classMap[app.globalData.user?.class],
        offset: this.data.pageIndex * this.data.pageSize,
        limit: this.data.pageSize
      }).then((resp) => {
        let studentList = this.data.studentList || [];
        let cardData  = resp?.data?.data?.rows;
        let total = resp?.data?.data?.count;
        let newArr = deepClone(cardData);
        for (let item of newArr) {
          studentList.push(item)
        }
        // 判断是否超出分页范围 超出则重新置0
        let finalPage = total / this.data.pageSize;
        let finalShowPage = 0;
        if(this.data.pageIndex + 1 > finalPage) {
          finalShowPage = 0;
        } else {
          finalShowPage = this.data.pageIndex + 1
        }
        this.setData({
          studentList,
          pageIndex: finalShowPage,
          total: total
        });
     }).catch((e) => {
        console.log(e)
      });
    },

    // 切换班级查询
    getClassCard(e) {
      let app = getApp();
      if(!admins.includes(app.globalData.user?.openid)) return;
      this.setData({
        adminClass: e.currentTarget.dataset.class,
        currentPage: 0,
        pageIndex: 0,
        pageSize: 10,
        prevList:[],
        nextList:[],
        total: 0,
        studentList: []
      }, () => {
        this.onGetUserInfo();
      })
    },
    openDetail() {
      this.setData({
        showModal:true
      })
    },
    
    closeModal() {
      this.setData({
        showModal:false
      })
    },
    
    previewImage(e) {
        let {image} = e.currentTarget.dataset;
        wx.previewImage({
          urls: [image], // 需要预览的图片http链接列表
          current: image, // 当前显示图片的http链接
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
          this.next()
          shouldMove = false
        } else if (endX - startX > 50){
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
      let {currentPage, pageSize, pageIndex, studentList, total} = this.data;
      if((currentPage % pageSize) == 6 && !studentList[pageIndex * pageSize] && pageIndex * pageSize < total) {
        this.onGetUserInfo();
      }

      if(currentPage < total){
        this.setData({
          ['prevList[' + currentPage + ']']: '',
          ['nextList[' + currentPage + ']']: 'nextAnimation',
          currentPage: currentPage + 1
        })      
      }
    }
  });