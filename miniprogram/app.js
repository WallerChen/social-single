
import Event from './utils/eventBus';
import { getUserRegister } from './api/request';
App({
  event: new Event(),
  globalData: {
    employ: '',
    user: {},
  },
  onLaunch: async function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    }
    else {
      wx.cloud.init({
        env: 'single-1g8xzqs704ef759e',
        traceUser: true,
      });
    }
    const userRegisterResult = await getUserRegister();
    const registered = userRegisterResult?.data?.data?.registered;
    const classname = userRegisterResult?.data?.data?.class;
    wx.setStorageSync('isRegister', registered);
    wx.setStorageSync('classname', classname);
  },
});