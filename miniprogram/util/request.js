const USE_WXCLOUD = false
// const USE_WXCLOUD = true
const LOCAL_SERVER = 'http://localhost:8100'

export const BOS_ADDR = "https://single-student.bj.bcebos.com/"

const DEBUG_OPENID = "DEBUG_OPENID"


function wxCloudContainer(method, path, data) {
  return new Promise((resolve, reject) => {
    wx.cloud.callContainer({
      config: {
        env: "prod-3g8yxq6d2db91adb"
      },
      method: method,
      path: path,
      data: data,
      header: {
        "X-WX-SERVICE": "user-info-auth",
        "content-type": "application/json"
      },
      success: async (res) => {
        if (res.data.code !== 200) {
          reject(res);
        } else {
          resolve(res);
        }
      },
      fail: (res) => {
        reject(res);
      }
    })
  })
}

export function APICall(method, path, data) {
  if (USE_WXCLOUD) {
    return wxCloudContainer(method, path, data)
  }

  return new Promise((resolve, reject) => {
    wx.request({
      method: method,
      url: `${LOCAL_SERVER}${path}`,
      data: data,
      header: {
        'content-type': 'application/json',
        'X-Wx-Openid': DEBUG_OPENID,
      },
      success: (res) => {
        if (res.data.code !== 200) {
          reject(res);
        } else {
          resolve(res.data);
        }
      },
      reject: (res) => {
        reject(res);
      }
    })
  })
}

export async function uploadOneFile(filePath, filename, formData = {}) {
  if (!formData['filename']) {
    formData['filename'] = filename
  }

  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: `${LOCAL_SERVER}/api/wx-upload`,
      header: {
        'X-Wx-Openid': DEBUG_OPENID,
      },
      formData: formData,
      filePath: filePath,
      name: 'file',
      success: async (res) => {
        // wx.uploadFile 返回的是 string
        try {
          res.data = JSON.parse(res.data)
          resolve(res)
        } catch (error) {
          reject(Error(res.data))
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}
