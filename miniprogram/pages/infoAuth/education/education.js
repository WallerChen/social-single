
import * as request from "../../../util/request"
import * as util from "../../../util/util"

Page({

  data: {
    images: []
  },

  onLoad(options) {

  },
  onRemove(e) {
    let index = e.currentTarget.dataset.index
    this.data.images.splice(index, 1)
    this.setData({ images: this.data.images })
  },
  onSelectImage(e) {
    let index = e.currentTarget.dataset.index
    let selectCnt = 3 - this.data.images.length // 选择图片的数量
    if (index != null) {
      selectCnt = 1
    }

    wx.showActionSheet({
      itemList: ['拍照', '相册图片', '聊天图片'],
      success: async (res) => {
        let filePathList = []
        try {
          if (res.tapIndex === 0) { // 拍照
            filePathList = await util.chooseCamera(selectCnt)
          } else if (res.tapIndex === 1) { // 相册
            filePathList = await util.chooseAlbum(selectCnt)
          } else { // 聊天记录
            filePathList = await util.chooseMessageFile(selectCnt)
          }

          if (index == null) {
            // 新增图片
            this.data.images = this.data.images.concat(filePathList)
          } else {
            // 替换图片
            this.data.images[index] = filePathList[0]
          }
          this.setData({ images: this.data.images })
        } catch (error) {
          console.log(error);
          // ignore cancel
        }
      }
    })
  },

  async onConfirm() {
    // 未修改的图片不触发上传文件

    if (!this.data.images.length) {
      wx.showToast({
        icon: 'error',
        title: "请先上传照片"
      })
      return
    }

    let wxFileList = []
    for (let i = 0; i < this.data.images.length; i++) {
      let img = this.data.images[i];
      wx.showLoading({ title: `上传中(${i + 1}/${this.data.images.length})...` })
      let res = await request.uploadOneFile(img, 'test.jpg', { 'compressImg': '1' })
      console.log("res", i, res);
      if (res.data.code !== 200) {
        wx.hideLoading()
        wx.showToast({
          icon: 'error',
          title: res.data.msg
        })
        return
      }
      wxFileList.push(res.data.data)
    }
    console.log("wxFileList", wxFileList);
    wx.hideLoading()

    let res = await request.APICall("POST", "/api/validate/education", { wxFileList: wxFileList })
    console.log("validate/education", res);
    // TODO: 检查返回错误

    wx.showModal({
      title: '提示',
      content: "虾虾~ 请等待审核(*^_^*)",
      showCancel: false,
    })
  }

})