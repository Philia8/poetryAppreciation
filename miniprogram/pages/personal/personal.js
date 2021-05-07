const { getDateStr } = require('../../utils/util.js');
const DB_user = wx.cloud.database().collection("user");
const DB_log = wx.cloud.database().collection("log");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        code: '',
        userInfos: {}, //登录用户信息
        isChecked:false, //用户签到标识
        userInfo_db:{}, //用户数据库信息
        _id:"", //用户id
    },  

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const date = new Date();
        console.log();
    },
    // 获取登录用户的个人信息
    async onShow() {
        await wx.checkSession({}).then(res => {
            // 缓存中获取用户信息
            wx.getStorage({
                key: 'userInfo',
            }).then(res => {
                this.setData({
                    userInfos: res.data
                });
            });
            // 获取本地缓存中的用户信息
            this.getInfosByStorage();
        }).catch(err => { //未登录则跳转登陆页面
            wx.navigateTo({
                url: '/pages/login/login',
            });
        });
    },
    // 用户签到
    check() {
        console.log("用户点击签到");
        // 获取当前点击时的时间
        const time_now = new Date().getTime();
        // 当前用户未签到
        if (!this.data.isChecked) {
            this.setData({
                isChecked: true
            });
            // 存储当前时间戳作为签到时间
            DB_user.where({
                _id: this.data.userInfo_db._id
            }).update({
                data: {
                    checktime: time_now,
                    score: this.data.userInfo_db.score + 2,
                }
            }).then(res => {
                console.log("用户已签到");
                // 更新缓存中的签到时间
                wx.setStorage({
                    data: this.data.userInfo_db,
                    key: 'user_db',
                });
                // 签到成功提醒
                wx.showToast({
                  title: '积分+2!',
                })
            }).catch(err => {
                console.log("用户签到出错");
            });
            // 插入积分更新记录
            DB_log.add({
                data: {
                    action: "+2",
                    cause: 2,
                    time:getDateStr(time_now)
                }
            }).then(res => {
                console.log("签到积分更新记录成功");
            }).catch(err => {
                console.log("签到积分更新记录添加出错！");
            })
        } else { //用户已签到，再次点击签到按钮
            // 判断当前用户点击是否与数据库中存储的时间为同一天，不是则需要更新签到状态为未签到
            // 获取数据库中用户的签到时间
            const time_old = this.data.userInfo_db.checktime;
            const res = this.isCheckedJudge(time_old);
            this.setData({
                isChecked:res 
            });
        }
    },
    // 判断是否为同一天点击签到按钮
    isCheckedJudge(time_old) {
        // toDateString() 以特定格式实现的格式化日期，星期几在前
        return new Date(time_old).toDateString() === new Date().toDateString();
    },
    // 获取本地缓存中的用户数据
    getInfosByStorage() {
        wx.getStorage({
            key: 'user_db',
        }).then(res => {
            // console.log(res);
            this.getDataByDB(res.data._id);
        }).catch(err => {
            console.log("个人页面获取用户本地缓存数据出错");
            console.log(err);
        });
    },
    // 获取数据库中的用户数据
    getDataByDB(id) {
        DB_user.where({
            _id: id
        }).get().then(res => {
            // console.log(res);
            this.setData({
                userInfo_db: res.data[0]
            });
        }).catch(err => {
            console.log("个人页面获取数据库中的用户数据出错");
        })
    },
    // 跳转至积分明细
    goScore() {
        wx.navigateTo({
          url: '/pages/score/score'
        })
    }
})