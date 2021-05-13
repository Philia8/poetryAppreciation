const { getDateStr } = require('../../utils/util.js');
const DB_user = wx.cloud.database().collection("user");
const DB_log = wx.cloud.database().collection("log");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfos: {}, //登录用户信息
        isChecked:false, //用户签到标识
        userInfo_db:{}, //用户数据库信息
        _id:"", //用户id
        userid:"" //用户的openid
    },  

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad:function (options) {
        // 判断是否登录
        this.isLogin();
        // 判断是否签到
        // this.isCheckedJudge();
    },
    // 每次显示页面时，判断用户是否已签到，决定isChecked 的值
    onShow() {
        // 判断是否登录
        this.isLogin();
        // 判断当前时间与缓存中的时间是否为同一天
        // this.isCheckedJudge(this.data.userInfo_db.checktime);
    },
    // 判断是否登录
     isLogin() {
        // 检测登录状态并获取用户的信息
        wx.checkSession({}).then(res => {
            // 获取用户的登录信息
            wx.getStorage({
                key: 'userInfo',
            }).then(res => {
                // console.log(res);
                this.setData({
                    userInfos: res.data
                });
            });
            // 获取用户openid
            this.getUserid();
        }).catch(err => { //未登录则跳转登陆页面
            wx.navigateTo({
                url: '/pages/login/login',
            });
        });
    },
    //  获取缓存中的用户openid
    getUserid() {
        wx.getStorage({
          key: 'userid',
        }).then(res => {
            // console.log(res);
            this.setData({
                userid: res.data
            }); 
            // 获取用户在数据库中的游戏相关信息
            this.getInfosByDB(res.data);
        })
    },
    // 获取用户的数据库信息
    getInfosByDB(userid) {
        DB_user.where({
            _openid: userid
        }).get().then(async res => {
            // console.log(res);
            this.setData({
                userInfo_db: res.data[0]
            });
            res.data[0].checktime === 0 ? console.log("新用户") : this.isCheckedJudge(res.data[0].checktime);  
        }).catch(err => {
            console.log("个人中心获取用户数据库信息失败！");
        });
    },
    // 用户签到
    check() {
        console.log("用户点击签到");
        // 获取当前点击时的时间
        const time_now = new Date().getTime();
        // 当前用户未签到
        if (!this.data.isChecked) {
            let temp = this.data.userInfo_db;
            temp.checktime = time_now;
            // console.log(typeof temp.checktime);
            temp.score = this.data.userInfo_db.score + 2;
            this.setData({
                isChecked: true,
                userInfo_db: temp
            });
            // 证明使用以上方法修改页面数据没有问题
            // console.log(time_now);
            // console.log(this.data.userInfo_db);
            wx.showToast({
                title: '签到成功 积分+2',
            });
            
            // 插入积分更新记录
            DB_log.add({
                data: {
                    action: "+2",
                    cause: 2,
                    time: getDateStr(time_now)
                }   
            }).then(res => {
                console.log("签到积分更新记录成功！");
            }).catch(err => {
                console.log("签到积分更新记录添加出错！");
                console.log(err);
            });
        } 
    },
    // 判断是否为同一天点击签到按钮
    isCheckedJudge(time_old) {
        // toDateString() 以特定格式实现的格式化日期，星期几在前
        // const res = new Date(time_old).toDateString() === new Date().toDateString() ? true : false;
        const old = new Date(time_old).toDateString();
        const now = new Date().toDateString();
        // console.log(old);
        // console.log(now);
        const res = old === now ? true : false;
        if (res) {
            this.setData({
                isChecked: true
            });
        } else {
            this.setData({
                isChecked: false
            });
        }
    },
    // 跳转至积分明细
    goScore() {
        // console.log(this.data.userInfo_db._openid);
        wx.navigateTo({
            url: '/pages/score/score?openid=' + this.data.userInfo_db._openid
        });
    },
    // 进入我的收藏
    goMyColl() {
        wx.navigateTo({
            url: '/pages/coll/coll?openid=' + this.data.userInfo_db._openid
        });
    },
    // 用户离开页面，更新数据库签到时间和缓存数据
    onHide() {
        this.updateDataForDB();
    },
    // 用户离开小程序时触发
    onUnload() {
        this.updateDataForDB();
    },
    // 更新数据库中的签到时间和积分明细
    async updateDataForDB() {
        // console.log(this.data.userInfo_db.checktime);
        const c = this.data.userInfo_db.checktime === undefined ? 0 : this.data.userInfo_db.checktime;
        // console.log(c);
        // 更新数据库数据
        await DB_user.where({
            _openid: this.data.userid
        }).update({
            data: {
                checktime: c,
                score:this.data.userInfo_db.score
            }
        }).then(res => {
            console.log("签到时间和积分更新完成");
        }).catch(err => {
            console.log("签到时间和积分更新失败！");
            console.log(err);
        });
    }
})