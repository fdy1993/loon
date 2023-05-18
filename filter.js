const PORTS = [80, 443]; // 端口号
const MAX_LATENCY = 100; // 延迟阈值，单位为毫秒
const TEST_URL = "http://cp.cloudflare.com/generate_204"; // 测延迟的地址

async function filter(proxies){
// 过滤出符合端口号的节点
 proxies = proxies.filter(node => PORTS.includes(node.port));
 
 // 定义一个异步函数，用于测试节点延迟，并返回一个Promise对象
 async function testNodeLatency(node) {
 try {
 // 调用$resource.testLatency方法，并等待结果
 let latency = await $resource.testLatency(node, TEST_URL);
 // 打印测试结果，并返回延迟值
 console.log(`Tested latency for ${node.name}: ${latency} ms`);
 return latency;
 } catch (error) {
 // 如果有错误发生，就打印错误信息，并返回null
 console.error(`Failed to test latency for ${node.name}: ${error}`);
 return null;
 }
 }
 
 // 创建一个新的数组，用于存放所有节点的延迟测试的Promise对象
 let promises = proxies.map(testNodeLatency);
 
 try {
 // 等待所有节点延迟测试完成，并获取结果数组
 let results = await Promise.all(promises);
 
 // 过滤出低于阈值的节点，并返回过滤后的节点列表
 return proxies.filter((node, i) => {
 let latency = results[i];
 if (latency < MAX_LATENCY) {
 return true;
 } else {
 // 打印一条信息，表示这个节点被过滤掉了
 console.log(`Filtered out ${node.name} due to high latency: ${latency} ms`);
 return false;
 }
 });
 } catch (error) {
 // 如果有任何错误发生，就打印错误信息，并返回空的节点列表
 console.error(`Failed to filter proxies: ${error}`);
 return [];
 }
}
