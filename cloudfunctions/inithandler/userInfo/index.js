const cloud = require('wx-server-sdk');
cloud.init({
  env: 'single-1g8xzqs704ef759e'
});
// 获取数据库集合信息
const db = cloud.database();
const userUserCollection = db.collection('user-info');
const userCardCollection = db.collection('user-card-one');
// 添加用户信息
async function addRecord(body) {
  console.log('body:' + JSON.stringify(body));
  // 获取基础信息
  const wxContext = cloud.getWXContext();
  // 先查询是否班级卡片有此同学 并更新相关信息到卡片展现
  let haveShowCard;
  if(body.wxcode){
    haveShowCard = await userCardCollection.where({
      wxcode: body.wxcode
    }).get();
    // 更新除_id类信息
    if(haveShowCard.data && haveShowCard.data.length > 0){
      let {...originCardBody} = haveShowCard.data[haveShowCard.data.length-1];
      let finalBody = {
        openid: wxContext.OPENID,
        ...originCardBody,
        ...body
      }
      let {_id, ...deleteBody} = finalBody;
      console.log('deleteBodydeleteBody:' + JSON.stringify(deleteBody));
      // 如果存在openid 则用openid来修改
      if(originCardBody.openid && originCardBody.openid !== ''){
        userCardCollection.where({
          wxcode: body.wxcode
        }).update({
          // data 字段表示需新增的 JSON 数据
          data: deleteBody
        }).catch(e =>{
          console.log('------------------------:' + e);
        });
      } else {
        userCardCollection.where({
          wxcode: body.wxcode
        }).update({
          // data 字段表示需新增的 JSON 数据
          data: deleteBody
        }).catch(e =>{
          console.log('------------------------:' + e);
        });
      }
    }
  }
  // 先查询是否存在用户 存在则更新用户信息
  let isLive =  await userUserCollection.where({
    openid: wxContext.OPENID
  }).get();
  if(isLive.data.length > 0) {
    // 更新除_id类信息
    let {...originBody} = isLive.data[isLive.data.length-1];
    let cardBody = {};
    if(body.wxcode && haveShowCard.length > 0) {
      let {...originCardBody} = haveShowCard[haveShowCard.length-1];
      cardBody = originCardBody;
    }
    let finalBody = {
      openid: wxContext.OPENID,
      ...originBody,
      ...cardBody,
      ...body
    }
    let {_id, ...deleteBody} = finalBody;
    return await userUserCollection.where({
        openid: wxContext.OPENID
      }).update({
        // data 字段表示需新增的 JSON 数据
        data: {
         openid: wxContext.OPENID,
         ...deleteBody
        }
      })
  } else {
    // 新增
    try {
        return await userUserCollection.add({
          // data 字段表示需新增的 JSON 数据
          data: {
           openid: wxContext.OPENID,
           ...body
          }
        })
      } catch(e) {
        console.error(e)
      }
  }
}
// 查询用户信息登陆记录
async function getUserRecord() {
    // 获取openId基础信息
    const wxContext = cloud.getWXContext();
    let selfData =  await userUserCollection.where({
      openid: wxContext.OPENID
    }).get();
    if (selfData.data.length == 0){
      let result = {
        data:[{
          openid: wxContext.OPENID
        }]
      }
      return result;
    } else {
      return selfData
    }
  }

// 获取一班班级信息
exports.main = async (event, context) => {
    let result;
    switch (event.params.key) {
        case 'add': result = await addRecord(event.params.body); break;
        case 'get': result = await getUserRecord(); break;
    }
    return {
        data: result
    };
};
