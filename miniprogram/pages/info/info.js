import { classItemList } from '../../constant/classInfo'
import { getClassmateList } from '../../api/request'
import * as request from '../../api/request'
import { deepClone } from '../../utils/util'

const app = getApp()

let startX = 0
let endX = 0
let shouldMove = true

Page({
  data: {
    total: 0,
    page: 1,
    classId: null,
    classItemList,
    isShowInvite: false,
    isShowDetail: false,
    prevList: [],
    nextList: [],
    currentPage: 0,
    pageIndex: 0,
    pageSize: 4,
    isShowShare: false,
    studentList: []
  },
  async onShow() {
    // 仅当 app.globalData.user.registered 全等于 false 猜显示邀请框，因为要等待赋值
    const isShowInvite = app.globalData.user.registered === false
    const isRegister = app.globalData.user.registered === true
    this.setData({ isShowInvite: isShowInvite })
    if (isRegister) {
      this.setData({ classId: app.globalData.user.classId })
      this.showShareUser()
    }
  },
  async onLoad() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })

    app.event.on('checkoutRegister', this.checkoutRegister, this)
  },

  // 展示用户分享的信息页
  async showShareUser() {
    if (app.globalData.shareUserId) {
      const res = await request.getShareUserInfo({ id: app.globalData.shareUserId })
      console.log('share', app.globalData.shareUserId, res)
      app.globalData.shareUserId = 0

      this.setData({
        isShowShare: true,
        shareUserInfo: res.data.data.userInfo
      })
    }
  },
  onShareAppMessage(e) {
    if (this.data.isShowDetail) {
      const info = this.data.studentList[this.data.currentPage]
      console.log('studentList', info)
      return {
        title: '给你分享一位优秀的宝子~',
        path: 'pages/info/info?shareUserId=' + info.id
      }
    }
  },
  onUnload() {
    app.event.off('checkoutRegister', this.checkoutRegister)
  },
  checkoutRegister() {
    if (this.data.total === 0) {
      // 还没获取，在云API 准备好后再获取一次
      this.onGetClassmateList()
    }

    if (app.globalData.user.registered) {
      this.setData({ classId: app.globalData.user.classId })
      this.showShareUser()
    }

    const isShowInvite = app.globalData.user.registered === false
    this.setData({ isShowInvite: isShowInvite })
  },
  async onGetClassmateList() {
    const page = this.data.page
    try {
      const query = { page, limit: this.data.pageSize }

      if (this.data.classId) {
        query.classId = this.data.classId
      }

      const res = await getClassmateList(query)
      if (res.data.code !== 200) {
        throw new Error(res.data.msg)
      }
      this.setData({ page: page + 1 })
      const studentList = this.data.studentList
      const cardData = res.data.data.list
      const total = res.data.data.total

      const clonedCardData = deepClone(cardData)
      if (clonedCardData) {
        for (const item of clonedCardData) {
          studentList.push(item)
        }
      }
      const finalPage = total / this.data.pageSize
      const finalShowPage = (this.data.pageIndex + 1 > finalPage) ? 0 : this.data.pageIndex + 1
      this.setData({
        studentList,
        pageIndex: finalShowPage,
        total
      })
    } catch (e) {
      console.log('onGetClassmateList err', e)
    }
  },
  hideInvite() {
    this.setData({ isShowInvite: false })
  },
  getClassCard(e) {
    if (!app.globalData.user.isAdmin) {
      return
    }

    this.setData({
      classId: e.currentTarget.dataset.classId,
      page: 1,
      currentPage: 0,
      pageIndex: 0,
      prevList: [],
      nextList: [],
      total: 0,
      studentList: []
    }, () => this.onGetClassmateList())
  },
  onPublicToast() {
    wx.showToast({ title: '建设ing，小可爱们请等待~', icon: 'none' })
  },
  onCloseShare() {
    this.setData({ isShowShare: false })
  },
  onCloseDetail() {
    this.setData({ isShowDetail: false })
  },
  onShowDetail() {
    this.setData({ isShowDetail: true })
  },
  // 翻页效果
  touchStart(e) {
    startX = e.touches[0].pageX
    shouldMove = true
  },
  touchMove(e) {
    if (!shouldMove) return

    endX = e.touches[0].pageX
    if (startX - endX > 50) {
      this.next()
      shouldMove = false
    } else if (endX - startX > 50) {
      this.prev()
      shouldMove = false
    }
  },
  prev() {
    // 暂时不允许向前滑动

    // if (this.data.currentPage > 0) {
    //   const currentPage = this.data.currentPage - 1
    //   this.setData({
    //     ['nextList[' + currentPage + ']']: '',
    //     ['prevList[' + currentPage + ']']: 'prevAnimation',
    //     currentPage
    //   })
    // }
  },
  next() {
    const {
      page, currentPage, pageSize, total
    } = this.data
    // 数据全部已拉取
    console.log('page, currentPage, pageSize, total:', page, currentPage, pageSize, total)

    if ((currentPage + 1) === total) {
      wx.showToast({
        title: '翻到尽头了哦～',
        icon: 'none'
      })
      return
    } else if ((currentPage + 1) >= (pageSize * (page - 1) - 3)) {
      // 翻到末尾重新拉取新数据
      this.onGetClassmateList()
    }
    if (currentPage < total) {
      this.setData({
        ['prevList[' + currentPage + ']']: '',
        ['nextList[' + currentPage + ']']: 'nextAnimation',
        currentPage: currentPage + 1
      })
    }
  }
})