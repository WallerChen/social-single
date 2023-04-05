
import { APICall } from "../../../util/request"
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

    wx.showActionSheet({
      itemList: ['拍照', '相册图片', '聊天图片'],
      success: async (res) => {
        let filePath = null
        try {
          if (res.tapIndex === 0) { // 拍照
            filePath = await util.chooseCamera(1)
          } else if (res.tapIndex === 1) { // 相册
            filePath = await util.chooseAlbum(1)
          } else { // 聊天记录
            filePath = await util.chooseMessageFile(1)
          }

          if (index == null) {
            // 新增图片
            this.data.images.push(filePath)
          } else {
            // 替换图片
            this.data.images[index] = filePath
          }
          this.setData({ images: this.data.images })
        } catch (error) {
          console.log(error);
          // ignore cancel
        }
      }
    })
  },

})