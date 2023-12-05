import * as request from '../../api/request'

Page({

  data: {
    activity: {},
    tagStyle: {
      // img: 'object-fit: cover; width: 200rpx; height: 200rpx; margin: 10px; border: 5px solid red; padding: 3px;'
      // '.small-img { object-fit: cover; max-width:100px; max-height:100px; margin: 10px; border: 5px dashed red; padding: 3px; }',
    }
    // externStyle: '.small-img { object-fit: cover; max-width:100px; max-height:100px; margin: 10px; border: 5px dashed red; padding: 3px; }'
  },

  async onLoad(options) {
    console.log('options', options)

    const res = await request.APICall('GET', '/api/v1/activity?id=' + options.id)
    console.log('activityList', res)

    this.setData({
      activity: res.data
    })
  },

  onShow() {

  }

})