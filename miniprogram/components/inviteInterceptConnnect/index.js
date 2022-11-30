const publishText = '请宝子输入微信号，后续可在「我的」中直接编辑您的资料卡片~（不要填错哟）'
const connectText = '若「资料>学生档案」中已有您的介绍，可输入「微信号」直接同步信息，进行后续编辑~ (P.S 不要填错哟~)'
Component({
  /**
   * 页面的初始数据
   */
  data: {
    inputValue:'',
    dialogType: '',
    dialogTitle: ''
  },
  properties: {
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'publish'
    }
  },
  observers: {
    type: function(value){
      this.setData({
        dialogType: value,
        dialogTitle: value === 'publish' ? publishText : connectText
      });
    }
  },
  methods: {
    bindKeyInput: function (e) {
      this.setData({
        inputValue: e.detail.value
      })
    },
    // 触发页面方法
    onConfirm() {
      this.triggerEvent("confirm",this.data.inputValue);
    },
    closeDialog() {
      this.setData({
        visible: false
      })
    }
  }
});
