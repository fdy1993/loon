// 过滤器函数，参数为节点对象，返回值为布尔值
function filter(proxy) {
  // 设置测试延迟的地址为https://www.google.com
  proxy.testUrl = "http://cp.cloudflare.com/generate_204";
  // 只保留延迟小于300ms的节点
  if (proxy.delay < 200) {
    return true;
  }
  // 只保留地区为美国或日本的节点
  if (proxy.region === "US" || proxy.region === "JP") {
    return true;
  }
  // 其他情况返回false
  return false;
}
