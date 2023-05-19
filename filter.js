// // 过滤器函数，参数为节点对象，返回值为布尔值
// async function filter(proxy) {
//   // 设置测试延迟的地址
//   const proxy.testUrl = "http://cp.cloudflare.com/generate_204";
//   // 设置超时时间为3秒
//   const timeout = new Promise((resolve, reject) => setTimeout(() => reject("timeout"), 3000));
//   // 等待节点测试完成或超时
//   try {
//     await Promise.race([proxy.test(), timeout]);
//     // 只保留延迟小于200ms的节点
//     return proxy.delay < 200 ? true : false;
//   } catch (error) {
//     // 如果超时，返回false
//     return false;
//   }
// }

// 引入ping模块
const ping = require('ping');

// 定义一个测试延迟的函数，接受一个代理列表作为参数
function testDelay(proxies) {
  // 遍历代理列表
  proxies.forEach(p => {
    // 获取代理的主机名
    const host = p.name.split('@')[1];
    // 调用ping模块的promisePing方法，传入主机名和一些选项
    ping.promise.probe(host, {
      timeout: 10,
      extra: ['-i', '2'],
    }).then(function (res) {
      // 如果测试成功，把平均延迟赋值给代理的delay属性
      if (res.alive) {
        p.delay = res.avg;
      } else {
        // 如果测试失败，把延迟赋值为-1
        p.delay = -1;
      }
    });
  });
}

// 定义一个过滤器函数，接受一个代理列表作为参数
function filter(proxies) {
  // 先调用测试延迟的函数
  testDelay(proxies);
  // 过滤出延迟小于等于300ms的节点
  return proxies.map(p => p.delay <= 300);
}
