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


const MAX_LATENCY = 100; // 延迟阈值，单位为毫秒
const TEST_URL = "http://cp.cloudflare.com/generate_204"; // 测延迟的地址

// 定义一个过滤器函数，接受一个代理列表作为参数
async function filter(proxies) {
  // 定义一个新的数组，用于存放过滤后的节点
  let filteredNodes = [];

  // 遍历所有节点，对每个节点进行延迟测试，并把返回的延迟值赋给节点的delay属性
  for (let node of proxies) {
    node.delay = await $resource.testLatency(node, TEST_URL);
  }

  // 遍历所有节点，如果延迟低于阈值，就把这个节点放入新的数组中
  for (let node of proxies) {
    if (node.delay < MAX_LATENCY) {
      filteredNodes.push(node);
    } 
  }
  proxies = filteredNodes
  // 返回过滤后的节点列表
  return proxies;
}
