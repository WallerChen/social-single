import awx from '../../../../api/awx';

Component({
  properties: {
    userInfo: {
      type: Object,
      value: {
        nickname: String,
        classname: String,
        avatarUrl: String,
        gender: String,
      }
    }
  },
  data: {
    defaultAvatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
  },
  methods: {
    // 显示侧边栏
    showSider() {
      // this.triggerEvent('show');
    },
    // 编辑昵称
    editNickname(e) {
      this.triggerEvent('modify', { nickname: e.detail.value });
    },
    // 编辑头像
    async editAvatar() {
      try {
        const chooseResult = await awx.chooseMedia({
          count: 1,
          mediaType: ['image'],
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
        });
        const avatarUrl = chooseResult.tempFiles[0].tempFilePath;
        this.triggerEvent('modify', { avatarUrl });
      }
      catch (e) {
        console.error(e);
      }
    },
  },
});
