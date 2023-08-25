import {
  getUserInfo,
  postUserInfoDraft,
  deleteUserInfoDraft,
  publishUserInfo,
  uploadImage
} from '../../api/request'
import { deepClone } from '../../utils/util'

const app = getApp()

Page({
  data: {

    hasDraft: false,
    userInfoPublished: {}, // 已发布
    userInfoDraft: {}, // 草稿
    userInfoEdit: {}, // 当前UI 编辑

    showConfirmPublish: false, // 确认发布
    sideBar: { // 侧边栏
      show: false
    },
    maxWords: 500, // 最大字数
    isShowInvite: false,
    isShowDeleteDraft: false
  },
  onLoad() {
    this.onGetUserInfo()
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
  },

  hideInvite() {
    this.setData({
      isShowInvite: false
    })
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