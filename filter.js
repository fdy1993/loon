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


function filter(proxies) {
  // 过滤出名字含有香港等节点
  return proxies.map(p => p.name.indexOf("香港") !== -1);
}

// 测试节点延迟并删除掉延迟超过300ms节点
function testAndDelete(proxies) {
  // 使用script operator修改proxy属性
  return proxies.map(p => {
    // 调用sub-store的API测试延迟
    let latency = $subStore.api.testLatency(p);
    // 如果延迟大于300ms，设置discard属性为true
    if (latency > 300) {
      p.discard = true;
    }
    return p;
  });
}

// 最终返回过滤后节点的sub-store脚本过滤器
return testAndDelete(filter(proxies));
