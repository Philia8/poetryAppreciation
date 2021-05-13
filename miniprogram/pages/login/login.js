let DB_user = wx.cloud.database().collection("user");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {}, //用户信息
        user_db:{} //用户的数据库数据
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 用户登录
        wx.login({
            timeout: 5000,
        });
        wx.removeStorage({
            key: 'user_db',
        });
        wx.removeStorage({
            key: 'userInfo',
        });
    },
    // 获取openid及用户数据
    getuserinfo(e) {
        // 获取登录用户的授权信息
        this.getInfo();
        wx.cloud.callFunction({
            name: "login"
        }).then(res => {
            // 获取用户数据库信息
            this.getDataByDB(res.result.openid);
            getApp().globalData.userid = res.result.openid;
            wx.setStorage({
                data: res.result.openid,
                key: 'userid',
            });
        });
    },
    // 获取数据库中的用户数据，未查到则添加新用户
    getDataByDB(id) {
        // console.log(id);
        // 查询该用户是否使用过小程序并登录，则展示对应信息；否则创建表项
        DB_user.where({
            _openid: id
        }).get().then(result => {
            // console.log("用户数据查询");
            // console.log(result);
            // 未查到用户数据，则添加
            if (result.data.length === 0) {
                DB_user.add({
                    data: {
                        score: 0,
                        checktime:0
                    }
                }).then(res => {
                    console.log("添加用户成功");
                }).catch(err => {
                    console.log("添加用户出错");
                    console.log(err);
                });
            }
        }).catch(err => {
            console.log("查询用户信息出错");
        });
    },
    // 用户登录授权获取用户信息
    getInfo() {
        // 获取用户信息
        wx.getUserProfile({
            desc: "获取用户信息"
        }).then(res => {
            // 存储用户授权信息
            wx.setStorage({
                data: res.userInfo,
                key: 'userInfo',
            });
            // 返回上一页
            wx.navigateBack({
                delta: 1
            });
        }).catch(err => {
            console.log("用户未登录");
            // console.log(err);
            wx.showToast({
                title: '未登录无法查看个人信息和游戏',
                icon: "error"
            });
        });
    }
})