let DB_user = wx.cloud.database().collection("user");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {}, //用户信息
        openid:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 用户登录
        wx.login({
            timeout: 5000,
        });
    },
    // 获取openid及用户数据
    getuserinfo(e) {    
        wx.cloud.callFunction({
            name: "login"
        }).then(res => {
            // 存储当前用户的openid
            wx.setStorage({
                data: res.result.openid,
                key: 'openid',
            });
            this.setData({
                openid: res.result.openid
            });
            this.getDataByDB();
        });
        // 获取登录用户的授权信息
        this.getInfo();
    },
    // 获取数据库中的用户数据
    getDataByDB() {
        // 查询该用户是否使用过小程序并登录，则展示对应信息；否则创建表项
        DB_user.where({
            _openid: this.data.openid
        }).get().then(result => {
            // console.log("用户数据查询");
            // console.log(result);
            // 未查到用户数据，则添加
            if (result.data.length === 0) {
                DB_user.add({
                    data: {
                        score: 0,
                        // userid: this.data.openid,
                        checktime:""
                    }
                }).then(res => {
                    console.log("添加用户成功");
                }).catch(err => {
                    console.log("添加用户出错");
                    console.log(err);
                });
            } else {
                // 将数据库中的用户信息存入本地缓存中
                // console.log("登录时本地存储用户信息");
                // console.log(result);
                wx.setStorage({
                    key: 'user_db',
                    data: result.data[0],
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
            // console.log(res);
            wx.setStorage({
                data: res.userInfo,
                key: 'userInfo',
            });
            // getApp().globalData.userInfo = res.userInfo;
            wx.navigateBack({
                delta: 1,
            });
        }).catch(err => {
            console.log("用户未登录");
            // console.log(err);
            wx.showToast({
                title: '请登录查看',
                icon: "error"
            });
            wx.navigateTo({
                url: 'pages/login/login.wxml',
            })
        });
    }
})