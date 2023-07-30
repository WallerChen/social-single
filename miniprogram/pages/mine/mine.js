import awx from '../../api/awx';
import {
  getUserInfo,
  postUserInfoDraft,
  deleteUserInfoDraft,
  publishUserInfo
} from '../../api/request';

Page({
  data: {
    userInfo: { // 用户信息
    },
    announceModal: { // 通知弹窗
      show: false,
    },
    sideBar: { // 侧边栏
      show: false,
    },
    imageList: [], //  介绍配图
    desc: '', //描述
    maxWords: 500, // 最大字数
    isShowInvite: false,
    isShowDeleteDraft: false,
  },
  onLoad() {
    this.onGetUserInfo();
  },

  async onGetUserInfo() {
    try {
      const userInfoResult = await getUserInfo();
      const hasDraft = userInfoResult?.data?.data?.hasDraft ?? false;
      if (hasDraft) {
        this.setData({
          isShowDeleteDraft: true
        });
      }
      let userInfo = userInfoResult?.data?.data
      delete (userInfo, "userInfo")
      let userInfoDraft = userInfoResult?.data?.data.draftInfo

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
        imageList: userInfo.imageList,
      });
    } catch (e) {
      console.error(e);
    }
  },

  hideInvite() {
    this.setData({
      isShowInvite: false
    });
  },
  showAnnounceModal() {
    this.setData({
      announceModal: {
        ...this.data.announceModal,
        show: true
      },
    });
  },
  hideAnnounceModal() {
    this.setData({
      announceModal: {
        ...this.data.announceModal,
        show: false
      },
    });
  },
  restoreDraft() {
    this.setData({
      isShowDeleteDraft: false,
      userInfo: this.data.userInfoDraft,
      desc: this.data.userInfoDraft.desc,
      imageList: this.data.userInfoDraft.imageList,
    });

    console.log("userInfo", this.data.userInfo);
  },
  async discardDraft() {
    try {
      await deleteUserInfoDraft();
    } catch (e) {
      console.error(e);
    }
  },

  showSideBar() {
    this.setData({
      sideBar: {
        ...this.data.sideBar,
        show: true
      },
    });
  },
  hideSideBar() {
    this.setData({
      sideBar: {
        ...this.data.sideBar,
        show: false
      },
    });
  },

  async addImageList() {
    try {
      const chooseResult = await awx.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
      });
      const imageItem = chooseResult.tempFiles[0].tempFilePath;
      const newImageList = [...this.data.imageList, imageItem];
      this.setData({
        imageList: newImageList
      });
    } catch (e) {
      console.error(e);
    }
  },
  deleteImageList(e) {
    const url = e.currentTarget.dataset.imageUrl;
    const newImageList = [];
    for (const value of this.data.imageList) {
      if (value !== url) {
        newImageList.push(value);
      }
    }
    this.setData({
      imageList: newImageList
    });
  },
  descEdit(e) {
    this.setData({
      desc: e.detail.value
    });
  },
  modifyUserInfo(e) {
    this.setData({
      userInfo: {
        ...this.data.userInfo,
        ...e.detail
      }
    });
  },

  async save() {
    const params = {
      nickname: this.data.userInfo.nickname,
      sex: this.data.userInfo.sex,
      avatarUrl: this.data.userInfo.avatarUrl,
      birthday: this.data.userInfo.birthday,
      imageList: this.data.imageList,
      desc: this.data.desc,
    };
    try {
      wx.showLoading({
        title: '保存中',
        mask: true,
      });
      const result = await postUserInfoDraft(params);
      wx.hideLoading();
      if (result.data.code !== 200) {
        wx.showToast({
          title: '保存失败',
          icon: 'error',
        })
      }
    } catch (e) {
      console.error(e);
    }
  },
  async release() {

    const params = {
      nickname: this.data.userInfo.nickname,
      sex: this.data.userInfo.sex,
      avatarUrl: this.data.userInfo.avatarUrl,
      birthday: this.data.userInfo.birthday,
      imageList: this.data.imageList,
      desc: this.data.desc,
    };
    try {
      wx.showLoading({
        title: '保存中',
        mask: true,
      });
      const result = await publishUserInfo(params);
      wx.hideLoading();
      if (result.data.code !== 200) {
        wx.showToast({
          title: '保存失败',
          icon: 'error',
        })
      }

      await deleteUserInfoDraft();
    } catch (e) {
      console.error(e);
    }
  },
});