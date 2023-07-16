export default (path, method, params = {}) => {
  return wx.cloud.callContainer({
    config: {
      env: 'prod-3g8yxq6d2db91adb',
    },
    path,
    method,
    header: {
      'X-WX-SERVICE': 'user-info-auth',
      // 'X-WX-OPENID': 'fasiehfias',
      // 'X-WX-EXCLUDE-CREDENTIALS': 'openid' // 不附带用户unionid，openid，access—token
    },
    data: params,
  });
};
