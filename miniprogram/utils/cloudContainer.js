export default (path, method, params = {}) => {
  return wx.cloud.callContainer({
    config: {
      env: 'prod-3g8yxq6d2db91adb',
    },
    path,
    method,
    header: {
      'X-WX-SERVICE': 'user-info-auth',
    },
    data: params,
  });
};
