let app = getApp()

import * as request from "../../../util/request"
import * as util from "../../../util/util"

Page({

  data: {
    company: '',
    BOS_ADDR: request.BOS_ADDR,
    images: []// { url:'', cloud: false } // cloud: 是否是云端图片
  },

  onLoad(options) {
    let studentInfo = app.globalData.studentInfo
    if (studentInfo.has) {
      console.log("studentInfo", studentInfo);
      let jobImages = studentInfo.info.jobImages
      let imgList = jobImages.split("\n")
      for (const img of imgList) {
        this.data.images.push({ url: img, cloud: true })
      }
      this.setData({ images: this.data.images })
    }

  },
  onRemove(e) {
    let index = e.currentTarget.dataset.index
    this.data.images.splice(index, 1)
    this.setData({ images: this.data.images })
  },
  onSelectImage(e) {
    let index = e.currentTarget.dataset.index
    let selectCnt = 1 - this.data.images.length // 选择图片的数量
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

          filePathList = filePathList.map(img => { return { url: img, cloud: false } })

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

    let wxFileList = this.data.images.filter(img => img.cloud).map(img => { return { filepath: img.url } })
    let localImgList = this.data.images.filter(img => !img.cloud)

    for (let i = 0; i < localImgList.length; i++) {
      let img = localImgList[i].url;

      wx.showLoading({ title: `上传中(${i + 1}/${localImgList.length})...` })
      let res = await request.uploadOneFile(img, util.getFilename(img), { 'compressImg': '1' })
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

    let res = await request.APICall("POST", "/api/student/job", { wxFileList: wxFileList })
    console.log("POST job", res);
    // TODO: 检查返回错误

    wx.showModal({
      title: '提交成功',
      content: "虾虾~ 请等待审核(*^_^*)",
      showCancel: false,
    })
  }

})