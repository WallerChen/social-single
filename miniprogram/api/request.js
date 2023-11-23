const USE_WX_CLOUD_RUN = true
// const USE_WX_CLOUD_RUN = false

const API_SERVER = 'http://127.0.0.1:8100'
// const API_SERVER = 'http://192.168.6.227:8100'
// const API_SERVER = 'http://192.168.8.236:8100'


const DEBUG_OPENID = 'o6orS5YktKqMOeqS0oXIPO_h--dI'

const CLOUD_ENV = 'prod-3g8yxq6d2db91adb'

export const BOS_ADDR = 'https://single-student.bj.bcebos.com/'

export async function APICall(method, path, params = {}) {
  let res
  if (USE_WX_CLOUD_RUN) {
    res = await wx.cloud.callContainer({
      config: {
        env: CLOUD_ENV
      },
      path,
      method,
      header: {
        // 'X-WX-SERVICE': 'go-backend'
        'X-WX-SERVICE': 'go-backend-test'
      },
      data: params
    })
  } else {
    res = await new Promise((resolve, reject) => {
      wx.request({
        url: API_SERVER + path,
        method,
        data: params,
        header: {
          'X-Wx-Openid': DEBUG_OPENID
        },

        success: (resp) => {
          resolve(resp)
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  }

  if (res.statusCode !== 200) {
    console.log('request err', res)
    throw Error(`code: ${res.statusCode}, data: ${res.data}`)
  }
  res = res.data

  return res
}

function getRand(size) {
  let str = ''
  for (let i = 0; i < size; i++) {
    str += Math.floor(Math.random() * 10)
  }
  return str
}

export async function uploadImage(tempFile, compressImg = true, filename = null) {
  if (!filename) {
    const ext = tempFile.tempFilePath.split('.').pop()
    filename = `tmp/${getRand(5)}_${Date.now()}.${ext}`
  }

  let res

  if (USE_WX_CLOUD_RUN) {
    // 辣鸡微信云，不支持上传文件
    res = await wx.cloud.uploadFile({
      cloudPath: filename,
      filePath: tempFile.tempFilePath,
      config: {
        env: CLOUD_ENV
      }
    })

    // 微信COS 转 BOS
    return APICall('POST', '/api/v1/upload-from-cos', {
      filename,
      compressImg: compressImg,
      fileID: res.fileID,
      deleteCos: true
    })
  } else {
    res = await new Promise((resolve, reject) => {
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
        success: (resp) => {
          // uploadFile 返回的是字符串，需要转换成对象
          resp.data = JSON.parse(resp.data)
          resolve(resp)
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  }

  if (res.statusCode !== 200) {
    console.log('request err', res)
    throw Error(`code: ${res.statusCode}, data: ${res.data}`)
  }
  res = res.data

  return res
}

export const getServerLiveness = () => APICall('GET', '/liveness')
export const getClassmateList = (params) => APICall('GET', '/api/v1/classmate/list', params)
export const getUserInfo = (params) => APICall('GET', '/api/v1/user/info', params)
export const getUserRegister = (params) => APICall('GET', '/api/v1/user/register', params)
export const postUserRegister = (params) => APICall('POST', '/api/v1/user/register', params)
export const deleteUserInfoDraft = (params) => APICall('DELETE', '/api/v1/user/info-draft', params)
export const postUserInfoDraft = (params) => APICall('POST', '/api/v1/user/info-draft', params)
export const publishUserInfo = (params) => APICall('POST', '/api/v1/user/info', params)
export const getShareUserInfo = (params) => APICall('GET', '/api/v1/classmate/share', params)