// 这个脚本用于筛选出端口为80或443的节点，并且删除掉延迟超过300ms的节点
// 你可以根据你自己的需求，修改下面的参数
const PORTS = [80, 443]; // 端口号
const MAX_LATENCY = 100; // 延迟阈值，单位为毫秒
const TEST_URL = "https://www.google.com"; // 测延迟的地址

// 获取节点列表
let nodes = $resource.nodes();

// 过滤出符合端口号的节点
nodes = nodes.filter(node => {
  let port = node.port;
  return PORTS.includes(port);
});

// 定义一个函数，用于测试节点延迟，并返回一个Promise对象
function testNodeLatency(node) {
  return new Promise((resolve, reject) => {
    // 调用$resource.testLatency方法，传入节点和回调函数
    $resource.testLatency(node, TEST_URL， (latency, error) => {
      // 如果有错误，就拒绝这个Promise，并打印错误信息
      if (error) {
        reject(error);
        console.error(`Failed to test latency for ${node.name}: ${error}`);
      } else {
        // 否则，就解决这个Promise，并返回延迟值
        resolve(latency);
        console.log(`Tested latency for ${node.name}: ${latency} ms`);
      }
    });
  });
}

// 定义一个数组，用于存放所有节点的延迟测试的Promise对象
let promises = [];

// 遍历所有节点，对每个节点进行延迟测试，并把返回的Promise对象放入数组中
for (let node of nodes) {
  let promise = testNodeLatency(node);
  promises.push(promise);
}

// 等待所有节点延迟测试完成
Promise.all(promises).then(results => {
  // 定义一个新的数组，用于存放过滤后的节点
  let filteredNodes = [];

  // 遍历所有节点和对应的延迟结果
  for (let i = 0; i < nodes.length; i++) {
    let node = nodes[i];
    let latency = results[i];

    // 如果延迟低于阈值，就把这个节点放入新的数组中
    if (latency < MAX_LATENCY) {
      filteredNodes.push(node);
    } else {
      // 否则，就打印一条信息，表示这个节点被过滤掉了
      console.log(`Filtered out ${node.name} due to high latency: ${latency} ms`);
    }
  }

  // 返回过滤后的节点列表
  $done(filteredNodes);
}).catch(error => {
  // 如果有任何错误发生，就打印错误信息，并返回空的节点列表
  console.error(`Failed to filter nodes: ${error}`);
  $done([]);
});
