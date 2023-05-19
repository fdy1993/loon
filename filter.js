// 过滤器函数，参数为节点对象，返回值为布尔值
async function filter(proxy) {
  // 设置测试延迟的地址
  const proxy.testUrl = "http://cp.cloudflare.com/generate_204";
  // 设置超时时间为3秒
  const timeout = new Promise((resolve, reject) => setTimeout(() => reject("timeout"), 3000));
  // 等待节点测试完成或超时
  try {
    await Promise.race([proxy.test(), timeout]);
    // 只保留延迟小于200ms的节点
    return proxy.delay < 200 ? true : false;
  } catch (error) {
    // 如果超时，返回false
    return false;
  }
}
