import {
  getUserInfo,
  postUserInfoDraft,
  deleteUserInfoDraft,
  publishUserInfo,
  uploadImage
} from '../../api/request'
import * as request from '../../api/request'
import { deepClone } from '../../utils/util'

const app = getApp()

Page({
  data: {

    hasDraft: false,
    userInfoReady: false, // 标记是否已获取用户信息，避免进入页面后重复获取
    userInfoPublished: {}, // 已发布
    userInfoDraft: {}, // 草稿
    userInfoEdit: {}, // 当前UI 编辑

    showConfirmPublish: false, // 确认发布
    sideBar: { // 侧边栏
      show: false
    },
    maxWords: 500, // 最大字数
    isShowInvite: false,
    isShowDeleteDraft: false,

    // 首次填写用户资料
    isShowBaseInfo: false,
    infoStep: 1,
    showNextBtn: false,
    baseInfoSex: '',
    baseInfoNickname: '',
    baseInfoAvatar: ''

  },

  async onShow() {
    // 仅当 app.globalData.user.registered 全等于 false 猜显示邀请框，因为要等待赋值
    const isShowInvite = app.globalData.user.registered === false
    const isRegister = app.globalData.user.registered === true
    this.setData({ isShowInvite: isShowInvite })
    if (isRegister) {
      await this.onGetUserInfo()
      // 判断用户有没有基础资料
      if (!this.data.userInfoPublished.sex) {
        this.setData({ isShowBaseInfo: true })
      }
    }
  },
  async onLoad() {
    app.event.on('checkoutRegister', this.checkoutRegister, this)
    // this.onGetUserInfo()
  },

  onUnload() {
    app.event.off('checkoutRegister', this.checkoutRegister)
  },
  async checkoutRegister() {
    const isShowInvite = app.globalData.user.registered === false
    this.setData({ isShowInvite: isShowInvite })
    if (isShowInvite) {
      // 未填邀请码先填邀请码，接着再问用户资料
      return
    }

    if (!this.data.userInfoReady) {
      // 还没获取，在云API 准备好后再获取一次
      await this.onGetUserInfo()
      // 判断用户有没有基础资料
      if (!this.data.userInfoPublished.sex) {
        this.setData({ isShowBaseInfo: true })
      }
    }
  },

  onSelectFirstAvatar(e) {
    console.log('onSelectFirstAvatar', e)

    this.setData({
      baseInfoAvatar: e.detail.avatarUrl
    })

    this.updateNextBtnShow()
  },
  onInfoPrev() {
    this.setData({
      infoStep: this.data.infoStep - 1
    })
    this.updateNextBtnShow()
  },
  async onInfoNext() {
    if (this.data.infoStep === 3) {
      // 提交资料
      console.log('baseInfoSex', this.data.baseInfoSex)
      console.log('baseInfoNickname', this.data.baseInfoNickname)
      console.log('baseInfoAvatar', this.data.baseInfoAvatar)

      wx.showLoading({ title: '确认中...', mask: true })
      try {
        await this.setUserBaseInfo(this.data.baseInfoSex, this.data.baseInfoNickname, this.data.baseInfoAvatar)
        wx.hideLoading()
      } catch (error) {
        console.log('setUserBaseInfo err', error)
        wx.hideLoading()
        wx.showToast({ title: '失败了呢' })
        return
      }

      this.setData({
        isShowBaseInfo: false
      })
      return
    }

    this.setData({
      infoStep: this.data.infoStep + 1
    })
    this.updateNextBtnShow()
  },

  shouldShowNextBtn() {
    switch (this.data.infoStep) {
      case 1:
        return false

      case 2:
        return !!this.data.baseInfoNickname

      case 3:
        return !!this.data.baseInfoAvatar

      default:
        return false
    }
  },
  updateNextBtnShow() {
    this.setData({
      showNextBtn: this.shouldShowNextBtn()
    })
  },
  onSetBaseInfo(e) {
    const data = e.currentTarget.dataset
    console.log('onSetBaseInfo', data)
    this.setData({
      [data.type]: data.val
    })
    this.onInfoNext()
  },

  isEmpty(obj) {
    if (!obj) {
      return true
    }
    return Object.keys(obj).length === 0
  },

  async onHide() {
    // 离开当前页面触发保存草稿

    // 头像和昵称不要草稿，照片墙和介绍会有草稿
    // 判断是否有改动
    if (this.isInfoModified()) {
      this.setData({ hasDraft: true })
      await this.saveDraft()
      wx.showToast({ title: '已保存草稿' })
    }
  },

  isSameArray(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      return false
    }

    for (const index in arr1) {
      if (arr1[index] !== arr2[index]) {
        return false
      }
    }
    return true
  },

  isInfoModified() {
    let targetInfo = this.data.userInfoPublished
    if (this.data.hasDraft) {
      targetInfo = this.data.userInfoDraft
    }

    const draftKeys = ['desc', 'imageList']

    for (const key of draftKeys) {
      if (this.isEmpty(targetInfo[key]) && this.isEmpty(this.data.userInfoEdit[key])) {
        continue
      }

      if (targetInfo[key] instanceof Array) {
        if (!this.isSameArray(targetInfo[key], this.data.userInfoEdit[key])) {
          return true
        }
        continue
      }

      if (targetInfo[key] !== this.data.userInfoEdit[key]) {
        return true
      }
    }

    return false
  },

  async saveDraft() {
    const params = {
      imageList: this.data.userInfoEdit.imageList,
      desc: this.data.userInfoEdit.desc
    }

    const result = await postUserInfoDraft(params)
    if (result.data.code !== 200) {
      throw new Error(result.data)
    }

    this.data.userInfoDraft = this.data.userInfoEdit
  },

  // 设置用户初始信息
  async setUserBaseInfo(sex, nickname, avatar) {
    const res = await getUserInfo()

    // 上传用户头像
    const res2 = await request.uploadImage({ tempFilePath: avatar })
    avatar = res2.data.data.url

    const userInfo = res.data.data
    userInfo.sex = sex
    userInfo.avatarUrl = avatar
    userInfo.nickname = nickname

    const result = await publishUserInfo(userInfo)
    console.log('saving publishUserInfo result', result)

    await this.onGetUserInfo()// 重新载入用户信息
  },
  async onGetUserInfo() {
    // 进入页面加载，如果有未保存草稿，优先恢复展示
    let res
    try {
      res = await getUserInfo()
    } catch (e) {
      console.error('getUserInfo err', e)
    }
    const userInfo = res.data.data

    const userInfoDraft = deepClone(userInfo.draftInfo)
    userInfo.draftInfo = undefined

    const userInfoEdit = deepClone(userInfo)

    if (userInfo.hasDraft) {
      wx.showToast({ title: '已恢复草稿' })
      userInfoEdit.desc = userInfoDraft.desc
      userInfoEdit.imageList = userInfoDraft.imageList
    }

    this.setData({
      hasDraft: userInfo.hasDraft,
      userInfoPublished: deepClone(userInfo),
      userInfoDraft: deepClone(userInfoDraft),
      userInfoEdit: deepClone(userInfoEdit),

      imageList: userInfo.imageList || []
    })
    this.data.userInfoReady = true
  },

  hideInvite() {
    this.setData({ isShowInvite: false })

    // 判断用户有没有基础资料
    if (!this.data.userInfoPublished.sex) {
      this.setData({ isShowBaseInfo: true })
    }
  },

  async addImageList() {
    if (!this.data.userInfoEdit.imageList) {
      this.data.userInfoEdit.imageList = []
    }
    // 最多9张
    const allowCnt = 9 - this.data.userInfoEdit.imageList.length

    let chooseResult
    try {
      chooseResult = await wx.chooseMedia({
        count: allowCnt,
        mediaType: ['image'],
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera']
      })
    } catch (error) {
      // cancel
      return
    }

    wx.showLoading({ title: '保存中', mask: true })

    let promiseList = []
    promiseList = chooseResult.tempFiles.map((file) => uploadImage(file))

    try {
      const res = await Promise.all(promiseList)
      console.log('uploadImage', res)

      const imgList = res.map((item) => item.data.data.url)

      if (!this.data.userInfoEdit.imageList) {
        this.data.userInfoEdit.imageList = []
      }
      const newImageList = [...this.data.userInfoEdit.imageList, ...imgList]
      // 照片墙是保存草稿的
      const params = {
        imageList: newImageList,
        desc: this.data.userInfoEdit.desc
      }

      const result = await postUserInfoDraft(params)
      if (result.data.code !== 200) {
        console.log('save draft error', result)
        throw new Error(result.data)
      }

      this.setData({
        'userInfoEdit.imageList': newImageList,
        hasDraft: true
      })
    } catch (e) {
      console.error('addImageList err', e)
      wx.showToast({ title: '保存失败', icon: 'error' })
    }
    wx.hideLoading()
  },

  async onDeleteImage(e) {
    const res = await wx.showModal({
      title: '提示',
      content: '确定要删除这张照片吗？'
    })
    if (!res.confirm) {
      return
    }

    const index = e.currentTarget.dataset.index

    const newImageList = this.data.userInfoEdit.imageList
    newImageList.splice(index, 1)

    this.setData({
      'userInfoEdit.imageList': newImageList,
      hasDraft: true
    })

    // 同时更新草稿
    const params = {
      imageList: this.data.userInfoEdit.imageList,
      desc: this.data.userInfoEdit.desc
    }

    const result = await postUserInfoDraft(params)
    if (result.data.code !== 200) {
      console.log('update draft error', result)
    }
  },
  onDescEdit(e) {
    this.setData({
      'userInfoEdit.desc': e.detail.value,
      hasDraft: true
    })
  },
  async onModifyUserInfo(e) {
    console.log('onModifyUserInfo', e.detail)
    // 编辑头像
    this.setData({
      userInfoEdit: {
        ...this.data.userInfoEdit,
        ...e.detail
      }
    })

    // 保存
    const params = {
      nickname: this.data.userInfoEdit.nickname,
      sex: this.data.userInfoEdit.sex,
      avatarUrl: this.data.userInfoEdit.avatarUrl,
      birthday: this.data.userInfoEdit.birthday,
      imageList: this.data.userInfoPublished.imageList,
      desc: this.data.userInfoPublished.desc
    }

    const result = await publishUserInfo(params)

    if (result.data.code !== 200) {
      console.log('save  error', result)
      wx.showToast({ title: '保存失败', icon: 'error' })
    }
    this.data.userInfoPublished = deepClone(this.data.userInfoEdit)
  },

  // 放弃之前保存的草稿
  async onDiscard() {
    const res = await wx.showModal({
      title: '提示',
      content: '确定要放弃未发布改动？'
    })
    if (!res.confirm) {
      return
    }

    try {
      await deleteUserInfoDraft()

      this.setData({
        hasDraft: false,
        userInfoEdit: deepClone(this.data.userInfoPublished)
      })
    } catch (error) {
      wx.showToast({ title: '放弃失败', icon: 'error' })
    }
  },
  showNotImplement() {
    wx.showToast({ title: '建设ing，小可爱们请等待~', icon: 'none' })
  },
  async onPublish() {
    this.setData({
      showConfirmPublish: true
    })
  },
  onCancelPublish() {
    this.setData({
      showConfirmPublish: false
    })
  },
  async onConfirmPublish() {
    this.setData({
      showConfirmPublish: false
    })
    const params = {
      nickname: this.data.userInfoEdit.nickname,
      sex: this.data.userInfoEdit.sex,
      avatarUrl: this.data.userInfoEdit.avatarUrl,
      birthday: this.data.userInfoEdit.birthday,
      imageList: this.data.userInfoEdit.imageList,
      desc: this.data.userInfoEdit.desc
    }
    try {
      wx.showLoading({ title: '发布中', mask: true })
      console.log('params', params)
      const result = await publishUserInfo(params)
      console.log('publishUserInfo', result)
      wx.hideLoading()
      if (result.data.code !== 200) {
        wx.showToast({ title: '发布失败', icon: 'error' })
        return
      }

      await deleteUserInfoDraft()
      this.setData({
        hasDraft: false,
        userInfoPublished: deepClone(this.data.userInfoEdit)
      })

      wx.showToast({ title: '发布成功', icon: 'success' })
    } catch (e) {
      console.error(e)
      wx.showToast({ title: '发布失败', icon: 'error' })
    }
  }
})