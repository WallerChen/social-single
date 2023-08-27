//  延时函数
export function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

// 字符串加密
export function toCode(str) { // 加密字符串
  // 定义密钥，36个字母和数字
  const key = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const len = key.length // 获取密钥的长度
  const a = key.split('') // 把密钥字符串转换为字符数组
  let s = ''; let b; let b1; let b2; let
    b3 // 定义临时变量
  for (let i = 0; i < str.length; i++) { // 遍历字符串
    b = str.charCodeAt(i) // 逐个提取每个字符，并获取Unicode编码值
    b1 = b % len // 求Unicode编码值得余数
    b = (b - b1) / len // 求最大倍数
    b2 = b % len // 求最大倍数的于是
    b = (b - b2) / len // 求最大倍数
    b3 = b % len // 求最大倍数的余数
    s += a[b3] + a[b2] + a[b1] // 根据余数值映射到密钥中对应下标位置的字符
  }
  return s // 返回这些映射的字符
}

// 字符串解密
export function fromCode(str) {
  // 定义密钥，36个字母和数字
  const key = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const len = key.length // 获取密钥的长度

  let b1; let b2; let b3; let d = 0
  const s = new Array(Math.floor(str.length / 3)) // 计算加密字符串包含的字符数，并定义数组
  const b = s.length // 获取数组的长度
  for (let i = 0; i < b; i++) { // 以数组的长度循环次数，遍历加密字符串
    b1 = key.indexOf(str.charAt(d)) // 截取周期内第一个字符串，计算在密钥中的下标值
    d++
    b2 = key.indexOf(str.charAt(d)) // 截取周期内第二个字符串，计算在密钥中的下标值
    d++
    b3 = key.indexOf(str.charAt(d)) // 截取周期内第三个字符串，计算在密钥中的下标值
    d++
    s[i] = b1 * len * len + b2 * len + b3 // 利用下标值，反推被加密字符的Unicode编码值
  }
  let decodeText = ''
  for (const charcode of s) {
    decodeText += String.fromCharCode(charcode)
  }
  return decodeText // 返回被解密的字符串
}

// 节流
export function throttle(func, interval, options = { leading: true }) {
  const { leading } = options
  let lastTime = 0
  const throttleFunc = function(...args) {
    if (!leading && lastTime === 0) {
      lastTime = new Date().getTime()
    }
    const currentTime = new Date().getTime()
    const remainTime = interval - (currentTime - lastTime)
    if (remainTime < 0) {
      func.apply(this, args)
      lastTime = currentTime
    }
  }
  return throttleFunc
}

export function wxPromisify(fn) {
  return (obj = {}) => new Promise((resolve, reject) => {
    obj.success = (res) => {
      resolve(res)
    }

    obj.fail = (res) => {
      reject(res)
    }

    fn(obj)
  })
}

// 判断是否是某一天
export function yearMonthDayStr(beginDateStr, endDateStr) {
  const currentData = new Date()
  const year = currentData.getFullYear()
  const mm = currentData.getMonth() + 1
  const dd = currentData.getDate()
  return year + '-' + mm + '-' + dd
}

// 深度clone
export function deepClone(obj) {
  if (typeof obj !== 'object' || !obj) {
    return obj
  }
  const newObj = obj instanceof Array ? [] : {}
  for (const key in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(key)) {
      newObj[key] = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key]
    }
  }
  return newObj
}