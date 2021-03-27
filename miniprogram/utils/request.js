// 引入服务器相关配置
import config from './config'
// 请求功能封装
export default (url, data = {}, method = "GET") => {
    // 返回一个Promise 实例
    return new Promise((resolve, reject) => {
        wx.request({
            url: config.host + url,
            data,
            method,
            success: (res) => {
                resolve(res.data);
            },
            fail: (err) => {
                reject(err);
            }
        })
    })
};