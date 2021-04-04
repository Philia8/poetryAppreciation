const cloud = require('wx-server-sdk')
cloud.init({
    env: 'poetryappreciation-0dndxcb13f505'
})
const DB_poems = cloud.database().collection("poems");
const DB_category = cloud.database().collection("poems-category");
const DB_authors = cloud.database().collection("poems-authors");
const MAX_LIMIT = 100
exports.main = async (event, context) => {
    // 先取出记录总数
    let result = null,
    // DB = null;
    switch (event.type) {
        case "author": {
            result = await DB_poems.where({
                author: event.searchKey
            }).count();
        }
    }
    // const authorCount = await DB_poems.where({
    //     author: event.search
    // }).count();
    const total = result.total;
    // 计算需分几次取
    const batchTimes = Math.ceil(total / 100);
    // 承载所有读操作的 promise 的数组
    const tasks = [];
    for (let i = 0; i < batchTimes; i++) {
        const promise = result.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get();
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