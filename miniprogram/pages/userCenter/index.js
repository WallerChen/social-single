const app = getApp();
const genderMap = {
  0: '未知',
  1: '男',
  2: '女'
}
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: defaultAvatarUrl,
    userInfo: undefined,
    hasUserInfo: false,
    canIUseGetUserProfile: false,
    // 关联弹窗
    visible:false,
    // 昵称头像
    visibleAvatarName: true,
    // 编辑状态
    isEdit: false,
    // 编辑文本内容
    descInputText:'',
    // updateInput
    updateInputWxcode:''
  },

  onLoad(options) {
    let that = this;
    // 查看是否授权
    if (wx.getUserProfile) {
      if (app.globalData.employ && app.globalData.employ != '') {
        this.setData({
          canIUseGetUserProfile: true,
          userInfo: app.globalData?.user,
          visibleAvatarName: app.globalData?.user.nickName ? false : true
        })
      } else {
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        app.employCallback = employ => {
          if (employ != '') {
            that.setData({
              userInfo: app.globalData?.user,
              visibleAvatarName: app.globalData?.user.nickName ? false : true
            });         
          }
        }
      }
     
    }
  },
  // 更新用户信息
  updateUserInfo(newUserInfo){
    console.log('newUserInfonewUserInfo:' + JSON.stringify(newUserInfo));
    this.setData({
      userInfo: newUserInfo.detail
    })
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    let newUserInfo = this.data.userInfo;
    newUserInfo.avatarUrl = avatarUrl;
    this.setData({
      userInfo: newUserInfo
    })
  },
  getUserProfile(e) {
    // 推荐使用 wx.getUserProfile 获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        // 1、存储到个人信息资料库
        this.userInfoSave(res.userInfo);
        this.setData({
          userInfo: {
            class: app.globalData.user.class,
            ...res.userInfo
          },
          hasUserInfo: true
        })
      }
    })
  },
  bindGetUserInfo (e) {
    console.log(e.detail.userInfo)
  },

  // 获取banner数据
  initBanner(){

  },
// 现实弹窗
async showConnect() {
  this.setData({
    visible: true
  })
},
// 关联到微信号
async updateInfoSave(wxcode) {
  wx.cloud.callFunction({
    name: 'inithandler',
    config: {
      env: 'single-1g8xzqs704ef759e'
    },
    data: {
      type: 'user',
      params: {
        key: 'add',
        body: {
          wxcode: wxcode.detail,
          ...this.data.userInfo
        }
      }
    }
  }).then((resp) => {
    console.log(JSON.stringify(resp));
 }).catch((e) => {
  console.log(e);
  });
},
  // 查询用户信息并存储
async userInfoSave(body) {
    // 调整性别
    body.gender = genderMap[body.gender];
    wx.cloud.callFunction({
      name: 'inithandler',
      config: {
        env: 'single-1g8xzqs704ef759e'
      },
      data: {
        type: 'user',
        params: {
          key: 'add',
          body: {
            ...body,
            ...app.globalData.user
          }
        }
      }
    }).then((resp) => {
   }).catch((e) => {
    });
  },
// onInputDesc
onInputDesc(e) {
  this.setData({
    descInputText: e.detail.value
  });
  
},
onInput(e) {
  this.setData({
    updateInputWxcode: e.detail.value
  })
},
// onUpdate
// onUpdate() {
//   wx.cloud.callFunction({
//     name: 'inithandler',
//     config: {
//       env: 'single-1g8xzqs704ef759e'
//     },
//     data: {
//       type: 'classCardData',
//       params: {
//         key: 'update',
//         body: {
//           wxcode: this.data.updateInputWxcode,
//           desc: this.data.descInputText
//         }
//       }
//     }
//   }).then((resp) => {
//     console.log(resp);
//  }).catch((e) => {
//   });
// },
// onEdit
onEdit() {
  if (this.data.isEdit) {
    wx.showLoading({
      title: '保存中...',
    });
    wx.cloud.callFunction({
      name: 'inithandler',
      config: {
        env: 'single-1g8xzqs704ef759e'
      },
      data: {
        type: 'user',
        params: {
          key: 'add',
          body: {
            desc: this.data.descInputText
          }
        }
      }
    }).then((resp) => {
      let newUserInfo = this.data.userInfo;
      newUserInfo.desc = this.data.descInputText;
      this.setData({
        userInfo: newUserInfo
      })
      wx.hideLoading();
   }).catch((e) => {
      wx.hideLoading();
      wx.showToast({
        icon: 'none',
        title: '保存失败',
      })
    });
  }
  this.setData({
    isEdit: !this.data.isEdit
  })
},
onPublish() {
  wx.showLoading({
    title: '发布中...',
  });
  wx.cloud.callFunction({
    name: 'inithandler',
    config: {
      env: 'single-1g8xzqs704ef759e'
    },
    data: {
      type: 'user',
      params: {
        key: 'publicToClass'
      }
    }
  }).then((resp) => {
    console.log('resp:'+ JSON.stringify(resp));
    wx.hideLoading();
 }).catch((e) => {
    wx.hideLoading();
    wx.showToast({
      icon: 'none',
      title: '发布失败',
    })
  });
}
});
