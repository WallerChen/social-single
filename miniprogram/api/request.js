const USE_API = true
// const USE_API = false

const API_SERVER = 'http://localhost:8100'
const DEBUG_OPENID = 'o6orS5emZUHW5BGNYAGO2SP2P7hg'

function cloudContainer(path, method, params = {}) {
  if (USE_API) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: API_SERVER + path,
        method,
        data: params,
        header: {
          'X-Wx-Openid': DEBUG_OPENID
        },

        success: (res) => {
          resolve(res)
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  }

  return wx.cloud.callContainer({
    config: {
      env: 'prod-3g8yxq6d2db91adb'
    },
    path,
    method,
    header: {
      // 'X-WX-SERVICE': 'user-info-auth',
      'X-WX-SERVICE': 'go-backend-test'
      // 'X-WX-OPENID': 'fasiehfias',
      // 'X-WX-EXCLUDE-CREDENTIALS': 'openid' // 不附带用户unionid，openid，access—token
    },
    data: params
  })
}

export const uploadImage = function(tempFile, compressImg = true) {
  // fileType: "image"
  // size: 192997
  // tempFilePath: "http://tmp/"

  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: API_SERVER + '/api/v1/wx-upload',
      filePath: tempFile.tempFilePath,
      name: 'file',
      formData: {
        // filename,
        compressImg
      },
      header: {
        'X-Wx-Openid': DEBUG_OPENID
      },
      success: (res) => {
        // uploadFile 返回的是字符串，需要转换成对象
        res.data = JSON.parse(res.data)
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })

  // cloud.uploadFile({
  //     cloudPath: 'user-info/' + new Date().getTime() + '.png',
  //     filePath: tempFile.tempFilePath,
  //     success: res => {
  //         // get resource ID
  //         console.log(res.fileID)
  //     }
  // })
}

export const getClassmateList = (params) => cloudContainer('/api/v1/classmate/list', 'GET', params)
export const getUserInfo = (params) => cloudContainer('/api/v1/user/info', 'GET', params)
export const getUserRegister = (params) => cloudContainer('/api/v1/user/register', 'GET', params)
export const postUserRegister = (params) => cloudContainer('/api/v1/user/register', 'POST', params)
export const deleteUserInfoDraft = (params) => cloudContainer('/api/v1/user/info-draft', 'DELETE', params)
export const postUserInfoDraft = (params) => cloudContainer('/api/v1/user/info-draft', 'POST', params)
export const publishUserInfo = (params) => cloudContainer('/api/v1/user/info', 'POST', params)