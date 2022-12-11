//  
export function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

// 字符串加密
export function toCode (str) {  //加密字符串
    //定义密钥，36个字母和数字
    var key = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var len = key.length;  //获取密钥的长度
    var a = key.split("");  //把密钥字符串转换为字符数组
    var s = "",b, b1, b2, b3;  //定义临时变量
    for (var i = 0; i <str.length; i ++) {  //遍历字符串
        b = str.charCodeAt(i);  //逐个提取每个字符，并获取Unicode编码值
        b1 = b % len;  //求Unicode编码值得余数
        b = (b - b1) / len;  //求最大倍数
        b2 = b % len;  //求最大倍数的于是
        b = (b - b2) / len;  //求最大倍数
        b3 = b % len;  //求最大倍数的余数
        s += a[b3] + a[b2] + a[b1];  //根据余数值映射到密钥中对应下标位置的字符
    }
    return s;  //返回这些映射的字符
}
 // 字符串解密
 export function fromCode (str) {
    //定义密钥，36个字母和数字
    let key = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let len = key.length;  //获取密钥的长度
    let b, b1, b2, b3, d = 0, s;  //定义临时变量
    s = new Array(Math.floor(str.length / 3));  //计算加密字符串包含的字符数，并定义数组
    b = s.length;  //获取数组的长度
    for (let i = 0; i < b; i ++) {  //以数组的长度循环次数，遍历加密字符串
        b1 = key.indexOf(str.charAt(d));  //截取周期内第一个字符串，计算在密钥中的下标值
        d ++;
        b2 = key.indexOf(str.charAt(d));  //截取周期内第二个字符串，计算在密钥中的下标值
        d ++;
        b3 = key.indexOf(str.charAt(d));  //截取周期内第三个字符串，计算在密钥中的下标值
        d ++;
        s[i] = b1 * len * len + b2 * len + b3  //利用下标值，反推被加密字符的Unicode编码值
    }
    let decodeText = '';
    for (const charcode of s) {
        decodeText += String.fromCharCode(charcode);
    }
    return decodeText;  //返回被解密的字符串
}

export function throttle(func, interval, options = { leading: true }) {
    let { leading } = options;
    let lastTime = 0;
    const throttleFunc = function (...args) {
      if (!leading && lastTime === 0) {
        lastTime = new Date().getTime();
      }
      let currentTime = new Date().getTime();
      let remainTime = interval - (currentTime - lastTime);
      if (remainTime < 0) {
        func.apply(this, args);
        lastTime = currentTime;
      }
    };
    return throttleFunc;
  }