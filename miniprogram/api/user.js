// // 云函数
// export function getUserShowList (str) {  //加密字符串
//   return  wx.cloud.callFunction({
//     name: 'inithandler',
//     config: {
//       env: 'single-1g8xzqs704ef759e'
//     },
//     data: {
//       type: 'user',
//       params: {
//         key: 'get'
//       }
//     }
//   });
// }
// // 云托管
// export function getUserShowListCT (params) {
//     return wx.cloud.callContainer({
//         config: {
//           env: 'prod-3g8yxq6d2db91adb', // 微信云托管的环境ID
//         },
//         path: '/user', // 填入业务自定义路径和参数，根目录，就是 / 
//         method: 'GET', // 按照自己的业务开发，选择对应的方法
//         header: {
//           'X-WX-SERVICE': 'koa-rkk6', // xxx中填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称）
//           // 其他header参数
//         },
//         params
//         // dataType:'text', // 默认不填是以JSON形式解析返回结果，若不想让SDK自己解析，可以填text
//         // 其余参数同 wx.request  /home/getUserCardlist
//       });
//   }
export function getUserCardlistCT (params) {
  return wx.cloud.callContainer({
      config: {
        env: 'prod-3g8yxq6d2db91adb', // 微信云托管的环境ID
      },
      path: '/home/getUserCardlist', // 填入业务自定义路径和参数，根目录，就是 / 
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

  