Component({
  /**
   * 组件
   */
  properties: {
    userInfo: {
      type: Object,
      value: {},
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
    ],
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