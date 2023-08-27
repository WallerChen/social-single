// 微信原生 api 封装 async
import promisify from '../utils/promisify';

const toAsync = (names) => {
  return (names || [])
    .map(name => (
      {
        name,
        member: wx[name]
      }
    ))
    .filter(t => typeof t.member === "function")
    .reduce((r, t) => {
      r[t.name] = promisify(wx[t.name]);
      return r;
    }, {});
}

export default toAsync(['chooseMedia']);
