const classCardData = require('./classCardData/index');
const user = require('./userInfo/index');
// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'classCardData':
      return await classCardData.main(event, context);
    case 'user':
      return await user.main(event, context);
  }
};
