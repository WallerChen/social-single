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
        console.log(result);
        this.hide();
      }
      catch (e) {
        console.error(e);
      }
    },
  },
});
