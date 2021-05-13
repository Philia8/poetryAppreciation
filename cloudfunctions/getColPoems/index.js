const cloud = require('wx-server-sdk')
cloud.init({
    env: 'poetryappreciation-0dndxcb13f505'
})
const DB_colls = cloud.database().collection("collections");
const MAX_LIMIT = 100
exports.main = async (event, context) => {
    // console.log(event.searchKey);
    // 先取出记录总数
    const result = await DB_colls.where({
        _openid: event.openid
    }).count();
    const total = result.total;
    // 计算需分几次取
    const batchTimes = Math.ceil(total / 100);
    // 承载所有读操作的 promise 的数组
    const tasks = [];
    for (let i = 0; i < batchTimes; i++) {
        const promise = DB_colls.where({
            _openid: event.openid
        }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get();
        // skip 方法,从指定索引查找数据,根据i 值每次更新开始的索引,分次拿出所有数据
        tasks.push(promise);
    }
    return (await Promise.all(tasks)).reduce((acc, cur) => {
        return {
            data: acc.data.concat(cur.data),
            errMsg: acc.errMsg,
        }
    });
}