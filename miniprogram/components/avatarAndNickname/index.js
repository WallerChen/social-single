import { throttle } from '../../util/util';
const defaultAvatarUrl = 'https://single-student.bj.bcebos.com/default-avatar.png'
const app = getApp();
Component({
  /**
   * 页面的初始数据
   */
  data: {
    theme: wx.getSystemInfoSync().theme,
    avatarUrl: defaultAvatarUrl,
    nickNameValue: '',
    sex:'',
    items: [
      {value: '男', name: '男'},
      {value: '女', name: '女'}
    ]
  },
  properties: {
    visible: {
      type: Boolean,
      default: true
    }
  },
  lifetimes: {
    attached: function () { 
      let that  = this;
      wx.onThemeChange((result) => {
        this.setData({
          theme: result.theme
        })
      });
    },
    moved: function () { },
    detached: function () { },
  },
  observers: {
  },
  methods: {
    // 选择性别
    radioChange(e) {
      this.setData({
        sex: e.detail.value
      })
    },
    onInput(e) {
      console.log('e.detail.value:' + e.detail.value);
      this.setData({
        nickNameValue: e.detail.value
      })
    },
   // 当用户选择需要使用的头像之后，可以通过 bindchooseavatar 事件回调获取到头像信息的临时路径。
  onChooseAvatar: throttle(function(e) {  
    const { avatarUrl } = e.detail
    app.globalData.user.avatarUrl = avatarUrl;
    this.setData({
      avatarUrl: avatarUrl
    })
  }, 3000), // 节流，xx毫秒内重复点击无效
  // 点击保存按钮，先上传头像到存储，再保存数据到数据库
  onSaveAvatarNickname: throttle(function(e) {
    // 没有openid，则不继续处理
    if(!app.globalData.user.openid) {return}
    // 判断是否选择了头像
    let avatarUrl = app.globalData.user.avatarUrl
    if(!avatarUrl) {      
      console.log('please choose avatar...')
      wx.showToast({
        icon: 'none',
        title: '请选择头像',
      })
      return;
    }
    // 判断是否输入了昵称
    let nickname = this.data.nickNameValue;
    if(!nickname) {      
      console.log('please input nickname...')
      wx.showToast({
        icon: 'none',
        title: '请输入昵称',
      })
      return
    }
    // 提示
    wx.showLoading({
      mask: true,
      title: '保存...',
    })
    // 上传头像
    this.uploadAvatarUrl(avatarUrl, nickname)
  }, 3000), // 节流，xx毫秒内重复点击无效
  
  // 上传头像
  uploadAvatarUrl(avatarUrl, nickname) {
    let that = this
    let splitUrlArray = avatarUrl.split('.') || [];
    
    // 每个用户的头像唯一，采用openid命名
    let cloudPath = 'avatar/' + app.globalData.user.openid + '.' + splitUrlArray[splitUrlArray.length -1];
    console.log('avatarUrl is %s', avatarUrl )
    wx.cloud.uploadFile({
      cloudPath: cloudPath,   // 保存到存储中的路径及文件名
      filePath: avatarUrl,    // 本地待上传的文件路径
      success: res => {
        let fileID = res.fileID
        console.log("upload file success, file id is ", fileID)  
        // 再将fileID和nickname存储到数据库
        that.saveNickname(fileID, nickname)
      },
      fail: err => {
        console.log("upload file failure.", err)
      },
      complete: res => {
        console.log("upload option complete.", res)
      }
    })
  },
  // 保存头像和昵称性别
  saveNickname(fileID, nickname) {
    let validateKey = ['sex', 'nickname', 'avatarUrl']
    let that = this;
    let saveBody = {
      ...app.globalData.user,
      avatarUrl: fileID,
      nickName: nickname,
      sex: this.data.sex
    } 
    // 校验
    for (let key in Object.keys(saveBody)) {
      if(validateKey.includes(key) && (!saveBody[key] || saveBody[key] == '')) {
        wx.showToast({
          title: '信息请填写完整~',
          icon: 'none'
        })
        return;
      }
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
          key: 'add',
          body: saveBody
        }
      },
      success: res => {
        console.log('save nickname success', res) 
        app.globalData.user.avatarUrl = fileID;
        console.log('app.globalData.user.avatarUrl:' + app.globalData.user.avatarUrl);
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
            console.log('updateupdate:' + JSON.stringify(saveBody));
            that.triggerEvent('update',saveBody);        
            that.setData({
              visible: false
            })
          },
        })
      }
    })
  }
  }
});
