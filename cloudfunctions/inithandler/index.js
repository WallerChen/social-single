const getOpenId = require('./getOpenId/index');
const classCardData = require('./classCardData/index');
// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'getOpenId':
      return await getOpenId.main(event, context);
    case 'classCardData':
      return await classCardData.main(event, context);
  }
};
