const cloud = require('wx-server-sdk')
cloud.init({
    env: 'poetryappreciation-0dndxcb13f505'
})
const DB_poems = cloud.database().collection("poems");
const MAX_LIMIT = 100
exports.main = async (event, context) => {
    // 先取出记录总数
    const result = await DB_poems.where({
        author: event.searchKey
    }).count();
    const total = parseInt(result.total);
    // 计算需分几次取
    let batchTimes = Math.ceil(total / 100);
    // if (batchTimes > 12) {
    //     batchTimes = 12;
    // }
    // 承载所有读操作的 promise 的数组
    const tasks = [];
    for (let i = 0; i < batchTimes; i++) {
        const promise = DB_poems.where({
            author: event.searchKey
        }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get();
        tasks.push(promise);
    }
    // 等待所有
    return (await Promise.all(tasks)).reduce((acc, cur) => {
        return {
            data: acc.data.concat(cur.data),
            errMsg: acc.errMsg,
        }
    })
}