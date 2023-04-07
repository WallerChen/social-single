import {classMap} from '../../util/classUtil';
import {sleep} from '../../util/util'

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
    updateInputWxcode:'',
    // 是否首次发布
    isFirstPublish: false,
    // 是否编辑昵称
    isEditNickname: false,
    // 编辑昵称
    editNickName: '',
    showModal:true
  },
  cancel() {
    this.setData({
      showModal:false
    })
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
    // 增加监听器
    app.event.on('updateHomeInfo', this.updateHomeInfo, this);
    
  },
  onShow(){
    this.setData({
      visibleAvatarName: app.globalData?.user?.nickName ? false : true,
      editNickName: app.globalData?.user?.nickName
    });   
  },
  onUnload(){
    app.event.off('updateHomeInfo',this.updateHomeInfo);
  },

  onReady() {
    // this.drawLine();
  },

  updateHomeInfo(body) {
    this.setData({
      userInfo: {
        ...this.data.userInfo,
        ...body
      }
    })
  },
  // 更新用户信息
  updateUserInfo(newUserInfo){
    this.setData({
      userInfo: {
        ...this.data.userInfo,
        ...newUserInfo.detail
      }
    });
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
  // 输入昵称
  onInputEditNickName(e) {
      this.setData({
        editNickName: e.detail.value
      })
  },
  // 更改昵称
  onEditNickName() {
    this.setData({
      isEditNickname: true,
      editNickName: this.data.userInfo.nickName
    })
  },
  // 选择照片
  chooseWxImage: function () {
    const that = this;
    wx.chooseImage({
      // 最多可以选择的图片张数
      count: 1,
      // 所选的图片的尺寸
      sizeType: ['original', 'compressed'],
      // 选择图片的来源
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.showLoading({
          title: '正在上传...',
          icon: 'loading',
          mask: true
        });
        that.upImgs(res.tempFilePaths[0], 0); // 调用上传方法
      },
      fail: function (res) {
        console.log('fail', res);
      },
      complete: function (res) {
      }
    });
  },

  upImgs: function (avatarUrl) {
    let that = this
    // 每个用户的头像唯一，采用openid命名
    let cloudPath = 'avatar/' + new Date().getTime() + '.jpg'
    wx.cloud.uploadFile({
      cloudPath: cloudPath,   // 保存到存储中的路径及文件名
      filePath: avatarUrl,    // 本地待上传的文件路径
      success: res => {
        let fileID = res.fileID 
        // 本地展示
        app.globalData.user.avatarUrl = fileID;
        wx.hideLoading({
          success: (res) => {    
            wx.showToast({
              title:'点击「发布」后，大家才能看到您的新头像哟',
              icon: 'none'
            })
            that.updateHomeInfo(app.globalData.user) 
          },
        })
      },
      fail: err => {
        wx.hideLoading();
        wx.showToast({
          icon: 'none',
          title: '上传失败'
        })
        console.log("upload file failure.", err)
      },
      complete: res => {
        wx.hideLoading();
        console.log("upload option complete.", res)
      }
    })
  },
  // 保存昵称
  saveNickName(nickname) {
      let that = this;
      let saveBody = {
        ...app.globalData.user,
        nickName: nickname
      } 
      // 调用云函数
      wx.cloud.callFunction({
        // 要调用的云函数名称
        name: "inithandler",
        config: {
          env: 'single-1g8xzqs704ef759e'
        },
        data: {
          type: 'user',
          params: {
            collection: classMap[app.globalData.user?.class],
            key: 'add',
            body: saveBody
          }
        },
        success: res => {
          app.globalData.user.nickName = nickname;
        },
        fail: err => {
          console.error('save nickname fail', err)   
        },
        complete: () => {
          console.log('save nickname complete')
          // 关闭提示
          wx.hideLoading({
            success: (res) => {     
              that.updateHomeInfo(app.globalData.user) 
            },
          })
        }
      })
  },
  // 获取banner数据
  initBanner(){

  },
// 现实弹窗
async showConnect() {
  this.setData({
    visible: true,
    publishType: 'connect'
  })
},
// 关联到微信号
async updateInfoSave(wxcode) {
  app.globalData.user.wxcode = wxcode.detail;
  let updatedBody =  {
    wxcode: wxcode.detail,
    collection: classMap[app.globalData.user?.class],
    ...this.data.userInfo
  };
  wx.cloud.callFunction({
    name: 'inithandler',
    config: {
      env: 'single-1g8xzqs704ef759e'
    },
    data: {
      type: 'user',
      params: {
        key: 'syncInfo',
        body: updatedBody
      }
    }
  }).then((resp) => {
    this.setData({
      visible: false,
      userInfo: {
        ...this.data.userInfo,
        ...updatedBody
      }
    });
    if(resp?.result?.data?.openid) {
      console.log('resp?.result?.data:' + JSON.stringify(resp?.result?.data));
      this.setData({
        userInfo: resp?.result?.data
      });
    }
    wx.showToast({
      icon: 'none',
      title: '操作成功'
    });
    // 自动发布触发
    if(this.data.isFirstPublish) {
      this.onPublish();
    }
 }).catch((e) => {
  wx.showToast({
    icon: "none",
    title: '操作错误'
  })
  });
},
// 查询用户信息并存储
async userInfoSave(body = {}) {
   let that = this;
    // 调整性别
    body.gender = genderMap[body.gender];
    body.collection = classMap[app.globalData.user?.class];
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
            ...app.globalData.user,
            nickName: that.data.editNickName !== app.globalData?.user?.nickName
              ? that.data.editNickName : app.globalData?.user?.nickName
          }
        }
      }
    }).then((resp) => {
      if(that.data.editNickName !== app.globalData?.user?.nickName) {
        that.onConfirmEdit(false);
      }
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
// onEdit
onEdit() {
  if (!this.data.isEdit){
    this.setData({
      descInputText: this.data.userInfo.desc,
      isEdit: !this.data.isEdit
    });
    return;
  } 
  else {
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
            collection: classMap[app.globalData.user?.class],
            desc: this.data.descInputText
          }
        }
      }
    }).then((resp) => {
      app.globalData.user.desc = this.data.descInputText;
      this.setData({
        ['userInfo.desc']: this.data.descInputText
      })
      wx.hideLoading();
   }).catch((e) => {
      wx.showToast({
        icon: 'none',
        title: '保存失败',
      })
    });
  }
  this.setData({
    isEdit: !this.data.isEdit
  });
},
async onPublish() {
  // 弹窗类型更改
  this.setData({
    publishType: 'publish'
  })
  if(!this.data.userInfo.wxcode) {
    this.setData({
      visible: true,
      isFirstPublish: true
    });
    return;
  }
  if(!(this.data.userInfo.desc.length > 0)) {
    wx.showToast({
      icon: 'none',
      title: '请填写自我介绍～',
    })
    return;
  }
  wx.showLoading({
    title: '发布中...',
  });

  // 顺便更新用户信息
  await this.userInfoSave();
  await sleep(2000);
  wx.cloud.callFunction({
    name: 'inithandler',
    config: {
      env: 'single-1g8xzqs704ef759e'
    },
    data: {
      type: 'user',
      params: {
        key: 'publicToClass',
        body: {
          collection: classMap[app.globalData.user?.class],
        }
      }
    }
  }).then((resp) => {
    console.log('publcik:' + JSON.stringify(resp));
    this.setData({
      isFirstPublish: false
    })
    wx.showToast({
      icon: 'none',
      title: '发布成功',
    })
    wx.hideLoading();
 }).catch((e) => {
    wx.hideLoading();
    wx.showToast({
      icon: 'none',
      title: '发布失败',
    })
  });
},
// 输入框确认
onConfirmEdit(showToast = true) {
  app.globalData.user.nickName = this.data.editNickName;
  this.setData({
    isEditNickname: false,
    ['userInfo.nickName']: this.data.editNickName
  }, ()=> {
    if (showToast)
      wx.showToast({
        title:'点击「发布」后，大家才能看到您的新昵称哟',
        icon: 'none'
      })
  })
},
});
