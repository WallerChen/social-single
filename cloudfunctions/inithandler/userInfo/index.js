const cloud = require('wx-server-sdk');
cloud.init({
  env: 'single-1g8xzqs704ef759e'
});
// 获取数据库集合信息
const db = cloud.database();
const userUserCollection = db.collection('user-info');

// 获取一班班级信息
exports.main = async (event, context) => {
  let result;
  switch (event.params.key) {
      case 'add': result = await addRecord(event.params.body); break;
      case 'get': result = await getUserRecord(); break;
      // 信息发布到班级
      case 'publicToClass': result = await publicMySelf(event.params.body); break;
      // 同步信息
      case 'syncInfo' : result = await syncInfo(event.params.body); break;
  }
  return {
      data: result
  };
};

// 添加用户信息
async function addRecord(body) {
  const wxContext = cloud.getWXContext();
  // 如果不存在班级 则非社群用户
  if(!body.collection) {
    return await userUserCollection.add({
      // data 字段表示需新增的 JSON 数据
      data: {
       openid: wxContext.OPENID,
       ...body
      }
    });
  }
  // 获取基础信息
  const userCardCollection = db.collection('user-card-' + body.collection);
 
  // 先查询是否班级卡片有此同学 并更新相关信息到卡片展现
  let haveShowCard = await userCardCollection.where({
    openid: wxContext.OPENID
  }).get();
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
// 发布信息到班级
async function publicMySelf(body) {
  // 获取openId基础信息
  const wxContext = cloud.getWXContext();
  const userCardCollection = db.collection('user-card-' + body.collection);
  // 获取个个人信息
  let cardInfo = await userCardCollection.where({
    openid: wxContext.OPENID
  }).get();
  let ownerInfo = await userUserCollection.where({
    openid: wxContext.OPENID
  }).get();
  let ownerbody = {}
  if(ownerInfo.data.length > 0){
    ownerbody = ownerInfo.data[ownerInfo.data.length -1];
  }
  // 更新除_id类信息
  if(cardInfo.data && cardInfo.data.length > 0){
    let {...originCardBody} = cardInfo.data[cardInfo.data.length-1];
    let finalBody = {
      openid: wxContext.OPENID,
      ...originCardBody,
      ...ownerbody
    }
    let {_id, ...deleteBody} = finalBody;
    // 如果存在openid 则用openid来修改
     return await userCardCollection.where({
        openid: originCardBody.openid
      }).update({
        data: deleteBody
      }).catch(e =>{
      });
    } else {
      return await userCardCollection.add({
        data: ownerbody
      })
    }
}
// 同步信息
async function syncInfo(body) {
  // 获取基础信息
  const userCardCollection = db.collection('user-card-' + body.collection);
  const wxContext = cloud.getWXContext();
  
  if(!body.wxcode) {
    return {};
  } else {
    let haveShowCard = await userCardCollection.where({
      wxcode: body.wxcode
    }).get();
    console.log('haveShowCard:' + JSON.stringify(haveShowCard));
    // 更新除_id类信息
    if(haveShowCard.data && haveShowCard.data.length > 0){
      let {...originCardBody} = haveShowCard.data[haveShowCard.data.length-1];
      let finalBody = {
        openid: wxContext.OPENID,
        ...body,
        ...originCardBody,
      }
      let {_id, ...deleteBody} = finalBody;
      // 如果存在openid 则用openid来修改
      if(originCardBody.openid && originCardBody.openid !== ''){
        if(wxContext.OPENID !== originCardBody.openid) {
          return;
        }
       await userCardCollection.where({
          openid: wxContext.OPENID
        }).update({
          // data 字段表示需新增的 JSON 数据
          data: deleteBody
        }).catch(e =>{
        });
        // 更新个人信息
       await userUserCollection.where({
          openid: wxContext.OPENID,
        }).update({
          data: deleteBody
        }).catch(e =>{
        });
        return deleteBody;
      } else {
        console.log('deleteBody:' + JSON.stringify(deleteBody));
        console.log('wxContext.OPENID:' + wxContext.OPENID);
        // 更新卡片
        await userCardCollection.where({
          wxcode: body.wxcode
        }).update({
          // data 字段表示需新增的 JSON 数据
          data: deleteBody
        }).catch(e =>{
        });
        // 更新个人信息
        await userUserCollection.where({
          openid: wxContext.OPENID,
        }).update({
          data: deleteBody
        }).catch(e =>{
        });
        return deleteBody;
      }
    }
  }
}


