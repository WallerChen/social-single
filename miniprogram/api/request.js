const USE_WX_CLOUD_RUN = true
// const USE_WX_CLOUD_RUN = false

// const API_SERVER = 'http://192.168.6.227:8100'
const API_SERVER = 'http://127.0.0.1:8100'
// const API_SERVER = 'http://192.168.8.236:8100'
const DEBUG_OPENID = 'o6orS5emZUHW5BGNYAGO2SP2P7hg'

const CLOUD_ENV = 'prod-3g8yxq6d2db91adb'

function apiCall(path, method, params = {}) {
  if (USE_WX_CLOUD_RUN) {
    return wx.cloud.callContainer({
      config: {
        env: CLOUD_ENV
      },
      path,
      method,
      header: {
        // 'X-WX-SERVICE': 'user-info-auth',
        // 'X-WX-SERVICE': 'go-backend-test'
        'X-WX-SERVICE': 'go-backend-debug'
      },
      data: params
    })
  }

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

function getRand(size) {
  let str = ''
  for (let i = 0; i < size; i++) {
    str += Math.floor(Math.random() * 10)
  }
  return str
}

export const uploadImage = async function(tempFile, compressImg = true, filename = null) {
  if (!filename) {
    const ext = tempFile.tempFilePath.split('.').pop()
    filename = `tmp/${getRand(5)}_${Date.now()}.${ext}`
  }

  if (USE_WX_CLOUD_RUN) {
    // 辣鸡微信云，不支持上传文件
    const res = await wx.cloud.uploadFile({
      cloudPath: filename,
      filePath: tempFile.tempFilePath,
      config: {
        env: CLOUD_ENV
      }
    })

    // 微信COS 转 BOS
    return apiCall('/api/v1/upload-from-cos', 'POST', {
      filename,
      compressImg: compressImg,
      fileID: res.fileID,
      deleteCos: true
    })
  }

  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: API_SERVER + '/api/v1/wx-upload',
      filePath: tempFile.tempFilePath,
      name: 'file',
      formData: {
        filename,
        compressImg: compressImg ? '1' : '0'// formdata 只有字符串
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
}

export const getServerLiveness = () => apiCall('/liveness', 'GET')
export const getClassmateList = (params) => apiCall('/api/v1/classmate/list', 'GET', params)
export const getUserInfo = (params) => apiCall('/api/v1/user/info', 'GET', params)
export const getUserRegister = (params) => apiCall('/api/v1/user/register', 'GET', params)
export const postUserRegister = (params) => apiCall('/api/v1/user/register', 'POST', params)
export const deleteUserInfoDraft = (params) => apiCall('/api/v1/user/info-draft', 'DELETE', params)
export const postUserInfoDraft = (params) => apiCall('/api/v1/user/info-draft', 'POST', params)
export const publishUserInfo = (params) => apiCall('/api/v1/user/info', 'POST', params)