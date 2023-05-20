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

// 这个函数用于测试和过滤代理数组
// proxies: 一个代理对象的数组
// testUrl: 一个可选的测试地址，默认为"http://cp.cloudflare.com/generate_204"
// timeout: 一个可选的超时时间，单位为毫秒，默认为300
function filter(proxies, testUrl = "http://cp.cloudflare.com/generate_204", timeout = 300) {
  return proxies.map(p => {
    // 测试代理的延迟
    const latency = $subStore.api.testLatency(p, testUrl, timeout);
    // 如果延迟大于300毫秒，设置discard属性为true
    p.discard = latency > 300 ? true : false;
    // 返回修改后的代理对象
    return p;
  });
}
