export function getActivityCT (params) {
    return wx.cloud.callContainer({
        config: {
          env: 'prod-3g8yxq6d2db91adb', // 微信云托管的环境ID
        },
        path: '/activity', // 填入业务自定义路径和参数，根目录，就是 / 
        method: 'GET', // 按照自己的业务开发，选择对应的方法
        header: {
          'X-WX-SERVICE': 'koa-rkk6', // xxx中填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称）
          // 其他header参数
        },
        // params,
        data: {...params}
        // dataType:'text', // 默认不填是以JSON形式解析返回结果，若不想让SDK自己解析，可以填text
        // 其余参数同 wx.request  /home/getUserCardlist
      });
  }
  