// const USE_WXCLOUD = false
const USE_WXCLOUD = true
const LOCAL_SERVER = 'http://localhost:8100'

let DEBUG_OPENID = "DEBUG_OPENID"


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
          resolve(res);
        }
      },
      reject: (res) => {
        reject(res);
      }
    })
  })
}
