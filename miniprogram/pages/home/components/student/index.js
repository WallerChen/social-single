// miniprogram/components/cloudTipModal/index.js
// const { isMac } = require('../../envList.js');

Component({
  /**
   * 组件
   */
  data: {
    userInfo: {
      nickName: '事实上',
      avatar: 'https://single-student.bj.bcebos.com/image.png',
      desc: `深夜来一个平平无奇的自我介绍吧，一个工科背景却意外转行做了大厂HR的双子座妹子。爱好广泛，喜欢美食、喜欢帅哥。
      大家晚安啦[月亮]
      `
    },
    baseInfoList: [{
      tag: '昵称',
      key: 'nickName'
    },
    {
      tag: '性别',
      key: 'sexType'
    },
    {
      tag: '星座',
      key: 'constellation'
    }
  ]
    
  },
  options: {
  },
  lifetimes: {
    attached: function () { 
    },
    moved: function () { },
    detached: function () { },
  },
  properties: {
  },
  observers: {
  },
  methods: {
  }
});