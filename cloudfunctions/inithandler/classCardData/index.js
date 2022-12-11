const cloud = require('wx-server-sdk');
cloud.init({
  env: 'single-1g8xzqs704ef759e'
});

// 获取数据库集合信息
const db = cloud.database()
async function getClassCardRecord(body) {
  const userCardCollection = db.collection('user-card-' + body.collection);
  // 获取卡片总数用于分页
  let countObj = await userCardCollection.count();
  let showList = await userCardCollection.field({
    avatarUrl: true,
    avatar_self: true,
    desc: true,
    sex: true,
    gender: true,
    nickName: true
  }).orderBy('collection', 'desc').skip(body.currentPage * body.pageSize).limit(body.pageSize).get();
  let result = {
    total: countObj.total,
    data: showList.data
  }
  return result;
}

async function updateCardInfo(body) {
  const userCardCollection = db.collection('user-card-' + body.collection);
  let haveShowCard = await userCardCollection.where({
    wxcode: body.wxcode
  }).get();
  // 更新除_id类信息
  if(haveShowCard.data && haveShowCard.data.length > 0){
    let {...originCardBody} = haveShowCard.data[haveShowCard.data.length-1];
    let finalBody = {
      ...originCardBody,
      ...body
    }
    let {_id, ...deleteBody} = finalBody;
    return  await userCardCollection.where({
      wxcode: body.wxcode
    }).update({
      // data 字段表示需新增的 JSON 数据
      data: deleteBody
    }).catch(e =>{
      console.log('------------------------:' + e);
    });
  }
  return [];
}

// 获取一班班级信息
exports.main = async (event, context) => {
  let result;
  // 获取openId基础信息
  const wxContext = cloud.getWXContext();
  switch (event.params.key) {
    case 'get': result = await getClassCardRecord(event.params.body); break;
    case 'update': result = await updateCardInfo(event.params.body); break;
  }
  return {
    data: result
  };
};
