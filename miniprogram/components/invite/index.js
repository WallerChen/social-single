import { postUserRegister } from '../../api/request';

Component({
  properties: {
    show: Boolean,
  },
  data: { inviteCode: '' },
  methods: {
    hide() {
      this.triggerEvent('onhide');
    },
    editInviteCode(e) {
      this.setData({ inviteCode: e.detail.value });
    },
    async register() {
      try {
        const result = await postUserRegister({ inviteCode: this.data.inviteCode });
        console.log('#yudi', result.data.code);
        if (result.data.code === 200) {
          wx.showToast({ title: '加入成功', icon: 'success' });
          this.hide();
        }
        else {
          wx.showToast({ title: '邀请码有误', icon: 'error' });
        }
      }
      catch (e) {
        console.error(e);
      }
    },
  },
});
