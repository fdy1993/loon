// 这个函数用于过滤出名字含有香港、台湾、日本、新加坡或美国的节点
// proxies: 一个代理对象的数组
function filter(proxies) {
    // 定义一个数组，包含要匹配的关键字
    const keywords = ["香港", "台湾", "日本", "新加坡", "美国", "沪港", "us", "hk", "sg", "tw", "jp", "US", "HK", "SG", "TW", "JP"];
    // 使用map方法遍历代理数组，并返回一个布尔值，表示节点名是否含有任意一个关键字
    return proxies.map(p => keywords.some(keyword => p.name.includes(keyword)));
  }
  
