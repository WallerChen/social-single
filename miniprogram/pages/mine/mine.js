import {
  getUserInfo,
  postUserInfoDraft,
  deleteUserInfoDraft,
  publishUserInfo,
  uploadImage
} from '../../api/request'

const app = getApp()

Page({
  data: {
    userInfo: { // 用户信息
    },
    announceModal: { // 通知弹窗
      show: false
    },
    sideBar: { // 侧边栏
      show: false
    },
    imageList: [], //  介绍配图
    desc: '', // 描述
    maxWords: 500, // 最大字数
    draftInfo: {},
    isShowInvite: false,
    isShowDeleteDraft: false
  },
  onLoad() {
    this.onGetUserInfo()
  },

  onShowDraftInfo() {
    const draftInfo = this.data.draftInfo
    const avatarUrl = draftInfo?.avatarUrl ?? 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
    const gender = draftInfo?.sex ?? ''
    const nickname = draftInfo?.nickname ?? ''
    const birthday = draftInfo?.birthday
    const desc = draftInfo?.desc ?? ''
    const imageList = draftInfo?.imageList ?? []
    this.setData({
      userInfo: {
        ...this.data.userInfo, avatarUrl, nickname, gender, birthday
      },
      desc,
      imageList
    })
  },

  async onGetUserInfo(isDraft = false) {
    try {
      const userInfoResult = await getUserInfo()
      const hasDraft = userInfoResult?.data?.data?.hasDraft ?? false
      if (hasDraft) {
        this.setData({
          isShowDeleteDraft: true
        })
      }
      const userInfo = userInfoResult?.data?.data
      delete (userInfo, 'draftInfo')
      const userInfoDraft = userInfoResult?.data?.data.draftInfo

      // const avatarUrl = userInfoResult?.data?.data?.avatarUrl ?? 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0';
      // const classname = userInfoResult?.data?.data?.class ?? '';
      // const gender = userInfoResult?.data?.data?.sex ?? '';
      // const nickname = userInfoResult?.data?.data?.nickname ?? '';
      // const birthday = userInfoResult?.data?.data?.birthday;
      // const desc = userInfoResult?.data?.data?.desc ?? '';
      // const imageList = userInfoResult?.data?.data?.imageList ?? [];
      this.setData({
        // userInfo: { avatarUrl, classname, nickname, gender, birthday },
        userInfo,
        userInfoDraft,

        desc: userInfo.desc,
        imageList: userInfo.imageList || []
      })
    } catch (e) {
      console.error(e)
    }
  },

  hideInvite() {
    this.setData({
      isShowInvite: false
    })
  },
  showAnnounceModal() {
    this.setData({
      announceModal: {
        ...this.data.announceModal,
        show: true
      }
    })
  },
  hideAnnounceModal() {
    this.setData({
      announceModal: {
        ...this.data.announceModal,
        show: false
      }
    })
  },
  restoreDraft() {
    this.setData({
      isShowDeleteDraft: false,
      userInfo: { ...this.data.userInfo, ...this.data.userInfoDraft },
      desc: this.data.userInfoDraft.desc,
      imageList: this.data.userInfoDraft.imageList || []
    })

    // console.log("userInfo", this.data.userInfo);
  },
  async discardDraft() {
    try {
      await deleteUserInfoDraft()
    } catch (e) {
      console.error(e)
    }
  },

  showSideBar() {
    this.setData({
      sideBar: {
        ...this.data.sideBar,
        show: true
      }
    })
  },
  hideSideBar() {
    this.setData({
      sideBar: {
        ...this.data.sideBar,
        show: false
      }
    })
  },

  async addImageList() {
    // 最多9张
    const allowCnt = 9 - this.data.imageList.length
    const chooseResult = await wx.chooseMedia({
      count: allowCnt,
      mediaType: ['image'],
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera']
    })

    wx.showLoading({ title: '保存中', mask: true })

    let promiseList = []
    promiseList = chooseResult.tempFiles.map((file) => uploadImage(file))

    try {
      const res = await Promise.all(promiseList)
      console.log('uploadImage', res)

      const imgList = res.map((item) => item.data.data.url)

      const newImageList = [...this.data.imageList, ...imgList]
      this.setData({ imageList: newImageList })

      // TODO: 同时保存草稿
      const params = {
        nickname: this.data.userInfo.nickname,
        sex: this.data.userInfo.sex,
        avatarUrl: this.data.userInfo.avatarUrl,
        birthday: this.data.userInfo.birthday,
        imageList: this.data.imageList,
        desc: this.data.desc
      }

      const result = await postUserInfoDraft(params)
      if (result.data.code !== 200) {
        console.log('save draft error', result)
        throw new Error(result.data)
      }
    } catch (e) {
      console.error('addImageList err', e)
      wx.showToast({ title: '保存失败', icon: 'error' })
    }
    wx.hideLoading()
  },
  deleteImageList(e) {
    const url = e.currentTarget.dataset.imageUrl
    const newImageList = []
    for (const value of this.data.imageList) {
      if (value !== url) {
        newImageList.push(value)
      }
    }
    this.setData({
      imageList: newImageList
    })
  },
  descEdit(e) {
    this.setData({
      desc: e.detail.value
    })
  },
  async modifyUserInfo(e) {
    // 编辑头像
    this.setData({
      userInfo: {
        ...this.data.userInfo,
        ...e.detail
      }
    })

    // 保存
    const params = {
      nickname: this.data.userInfo.nickname,
      sex: this.data.userInfo.sex,
      avatarUrl: this.data.userInfo.avatarUrl,
      birthday: this.data.userInfo.birthday,
      imageList: this.data.imageList,
      desc: this.data.desc
    }

    const result = await publishUserInfo(params)
    if (result.data.code !== 200) {
      console.log('save  error', result)
      wx.showToast({ title: '保存失败', icon: 'error' })
    }
  },

  async save() {
    const params = {
      nickname: this.data.userInfo.nickname,
      sex: this.data.userInfo.sex,
      avatarUrl: this.data.userInfo.avatarUrl,
      birthday: this.data.userInfo.birthday,
      imageList: this.data.imageList,
      desc: this.data.desc
    }
    try {
      wx.showLoading({ title: '保存中', mask: true })
      const result = await postUserInfoDraft(params)
      console.log('postUserInfoDraft', result)
      wx.hideLoading()
      if (result.data.code !== 200) {
        wx.showToast({ title: '保存失败', icon: 'error' })
        return
      }

      wx.showToast({ title: '已存草稿', icon: 'success' })
    } catch (e) {
      wx.showToast({ title: '保存失败', icon: 'error' })
      console.error(e)
    }
  },
  async release() {
    const params = {
      nickname: this.data.userInfo.nickname,
      sex: this.data.userInfo.sex,
      avatarUrl: this.data.userInfo.avatarUrl,
      birthday: this.data.userInfo.birthday,
      imageList: this.data.imageList,
      desc: this.data.desc
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
      wx.showToast({ title: '发布成功', icon: 'success' })
    } catch (e) {
      console.error(e)
      wx.showToast({ title: '发布失败', icon: 'error' })
    }
  }
})