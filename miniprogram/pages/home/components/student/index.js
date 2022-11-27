// miniprogram/components/cloudTipModal/index.js
// const { isMac } = require('../../envList.js');

Component({
  /**
   * 组件
   */
  properties: {
    info: {
      type: Object,
      value: {}
    }
  },
  data: {
    baseInfoList: [{
      tag: '昵称',
      key: 'nickName'
    },
    {
      tag: '性别',
      key: 'gender'
    } 
  ]
  },
  options: {
  },
  lifetimes: {
    attached: function () { 
      // console.log(this.data.info);
    },
    moved: function () { },
    detached: function () { },
  },
  observers: {
  },
  methods: {
    
  }
});