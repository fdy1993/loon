// 过滤器函数，参数为节点对象，返回值为布尔值
async function filter(proxy) {
  // 设置测试延迟的地址
  proxy.testUrl = "http://cp.cloudflare.com/generate_204";
  // 等待节点测试完成
  await proxy.test();
  // 只保留延迟小于300ms的节点
  if (proxy.delay < 200) {
    return true;
  }
  // 其他情况返回false
  return false;
}
