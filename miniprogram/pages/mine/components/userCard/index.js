import awx from '../../../../api/awx'

import * as request from '../../../../api/request'

Component({
  properties: {
    userInfo: {
      type: Object,
      value: {
        nickname: String,
        className: String,
        avatarUrl: String,
        gender: String
      }
    }
  },
  data: {
    defaultAvatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
  },
  methods: {
    // 显示侧边栏
    showSider() {
      // this.triggerEvent('show');
    },
    // 编辑昵称
    editNickname(e) {
      if (this.data.userInfo.nickname === e.detail.value) {
        return
      }
      this.triggerEvent('modify', { nickname: e.detail.value })
    },
    // 编辑头像
    async editAvatar() {
      let chooseResult
      try {
        chooseResult = await awx.chooseMedia({
          count: 1,
          mediaType: ['image'],
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera']
        })
      } catch (error) {
        // 取消
        return
      }

      try {
        wx.showLoading({ title: '保存中', mask: true })

        const res = await request.uploadImage(chooseResult.tempFiles[0], true)
        console.log('uploadImage', res)

        const avatarUrl = res.data.data.url
        this.triggerEvent('modify', { avatarUrl })
        wx.hideLoading()

        // 更新用户头像
      } catch (e) {
        console.error(e)
        wx.showToast({ title: '保存失败', icon: 'error' })
      }
    }
  }
})