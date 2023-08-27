export default function promisify(fn) {
  return async function (args) {
    return new Promise((resolve, reject) => {
      fn({
        ...(args || {}),
        success: res => resolve(res),
        fail: err => reject(err),
      });
    });
  };
}