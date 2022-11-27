// app.js
App({
  globalData: {
    employ: '',
    // 登陆用户信息
    user: {}
  },
  onLaunch: function () {
    let that = this;
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'single-1g8xzqs704ef759e',
        traceUser: true,
      });
    }
    //  获取用户登陆
    wx.cloud.callFunction({
      name: 'inithandler',
      config: {
        env: 'single-1g8xzqs704ef759e'
      },
      data: {
        type: 'user',
        params: {
          key: 'get'
        }
      }
    }).then((resp) => {
      // 判断是库里是否存在此用户
      let result = resp?.result?.data?.data;
      // 存在登陆用户
      if(result.length > 0){
        this.globalData.user = result[result.length -1];
      }
      that.globalData.employ = true;
      /* 由于这里是网络请求，可能会在 Page.onLoad 之后才返回
      * 所以此处加入 callback 以防止这种情况 */
      if (that.employCallback) {
        that.employCallback(true);
      }
   })
  }
});