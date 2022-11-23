const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

// 获取数据库集合信息
const db = cloud.database()
const userCardCollection = db.collection('user-card-one');
const wxContext = cloud.getWXContext();

async function addRecord() {
  try {
    return await userCardCollection.add({
      // data 字段表示需新增的 JSON 数据
      data: {
        description: "learn cloud database",
        due: new Date("2018-09-01"),
        tags: [
          "cloud",
          "database"
        ],
        // 位置（113°E，23°N）
        location: new db.Geo.Point(113, 23),
        done: false
      }
    })
  } catch(e) {
    console.error(e)
  }
}

async function getClassCardRecord() {
  return await userCardCollection.count();
}

// 获取一班班级信息
exports.main = async (event, context) => {
  // console.log('cloud.DYNAMIC_CURRENT_ENV:' + cloud.DYNAMIC_CURRENT_ENV);
  let result;
  // 获取openId基础信息
 
  switch (event.params.key) {
    case 'add': result = await addRecord(); break;
    case 'get': result = await getClassCardRecord(); break;
  }

  return {
    data: result
  };
};
