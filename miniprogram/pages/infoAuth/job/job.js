import * as request from '../../../api/request'
import * as util from '../../../utils/util'

const app = getApp()

Page({

  data: {
    BOS_ADDR: request.BOS_ADDR,
    company: '',
    authStep: 0,
    images: []// { url:'', cloud: false } // cloud: 是否是云端图片
  },

  onLoad(options) {
    const authStep = Number(options.authStep)
    this.setData({ authStep })

    const studentInfo = app.globalData.studentInfo
    if (studentInfo.has) {
      console.log('studentInfo', studentInfo)
      const jobImages = studentInfo.info.jobImages
      const imgList = jobImages.split('\n')
      for (const img of imgList) {
        if (img) {
          this.data.images.push({ filepath: img, url: request.BOS_ADDR + img, cloud: true })
        }
      }
      this.setData({
        images: this.data.images,
        company: studentInfo.info.jobCompany,
        authStep: authStep
      })
    }
  },
  onRemove(e) {
    const index = e.currentTarget.dataset.index
    this.data.images.splice(index, 1)
    this.setData({ images: this.data.images })
  },
  onSelectImage(e) {
    const index = e.currentTarget.dataset.index
    let selectCnt = 1 - this.data.images.length // 选择图片的数量
    if (index != null) {
      selectCnt = 1
    }

    wx.showActionSheet({
      itemList: ['拍照', '相册图片', '聊天图片'],
      success: async(res) => {
        let filePathList = []
        try {
          if (res.tapIndex === 0) { // 拍照
            filePathList = await util.chooseCamera(selectCnt)
          } else if (res.tapIndex === 1) { // 相册
            filePathList = await util.chooseAlbum(selectCnt)
          } else { // 聊天记录
            filePathList = await util.chooseMessageFile(selectCnt)
          }

          filePathList = filePathList.map((img) => ({ url: img, cloud: false }))

          if (index == null) {
            // 新增图片
            this.data.images = this.data.images.concat(filePathList)
          } else {
            // 替换图片
            this.data.images[index] = filePathList[0]
          }
          this.setData({ images: this.data.images })
        } catch (error) {
          console.log(error)
          // ignore cancel
        }
      }
    })
  },

  async onConfirm() {
    // 未修改的图片不触发上传文件

    if (!this.data.company) {
      wx.showToast({
        icon: 'error',
        title: '请填写工作信息'
      })
      return
    }

    if (!this.data.images.length) {
      wx.showToast({
        icon: 'error',
        title: '请先上传照片'
      })
      return
    }

    const wxFileList = this.data.images.filter((img) => img.cloud).map((img) => ({ filepath: img.filepath }))
    const localImgList = this.data.images.filter((img) => !img.cloud)

    for (let i = 0; i < localImgList.length; i++) {
      const img = localImgList[i].url

      wx.showLoading({ title: `上传中(${i + 1}/${localImgList.length})...` })
      // eslint-disable-next-line no-await-in-loop
      const res = await request.uploadImage({ tempFilePath: img })
      console.log('res', i, res)
      if (res.code !== 200) {
        wx.hideLoading()
        wx.showToast({
          icon: 'error',
          title: res.msg
        })
        return
      }
      wxFileList.push(res.data)
    }
    console.log('wxFileList', wxFileList)
    wx.hideLoading()

    const res = await request.APICall('POST', '/api/v1/info-auth/job', {
      wxFileList: wxFileList,
      company: this.data.company
    })
    console.log('POST job', res)
    // TODO: 检查返回错误

    wx.showModal({
      title: '提交成功',
      content: '虾虾~ 请等待审核(*^_^*)',
      showCancel: false
    })
  }

})