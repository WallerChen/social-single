
Page({

    data: {

    },

    onLoad(options) {
        wx.onNeedPrivacyAuthorization(resolve => {
            // 需要用户同意隐私授权时
            // 弹出开发者自定义的隐私授权弹窗
            this.setData({
                showPrivacy: true
            })
            // this.resolvePrivacyAuthorization = resolve
        })

        wx.requirePrivacyAuthorize({
            success: () => {
                // 用户同意授权
                // 继续小程序逻辑
            },
            fail: () => { }, // 用户拒绝授权
            complete: () => { }
        })
    },

    handleAgreePrivacyAuthorization() {
        // 用户点击同意按钮后
        
        // this.resolvePrivacyAuthorization({ buttonId: 'agree-btn', event: 'agree' })
    },
    getPhoneNumber(e) {
        console.log(e.detail.code)  // 动态令牌
        console.log(e.detail.errMsg) // 回调信息（成功失败都会返回）
        console.log(e.detail.errno)  // 错误码（失败时返回）
    }

})