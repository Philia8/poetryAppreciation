let DB_user = wx.cloud.database().collection("user");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo:{}, //用户信息
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
    getuserinfo(e) {
        // 获取openid及用户数据
        wx.cloud.callFunction({
            name:"login"
        }).then(res => {
            // 全局存储openid
            console.log(res);
             getApp().globalData.openid = res.result.openid;
            wx.setStorage({
              data: res.result.openid,
              key: 'openid',
            })
            // 查询该用户是否使用过小程序并登录，则展示对应信息；否则创建表项
            DB_user.where({
                _openid: this.data.openid   
            }).get().then(result => {
                console.log("用户数据查询");
                console.log(result);
                // 未查到用户数据
                if (result.data.length === 0) {
                    // 未找到用户则添加表项
                    DB_user.add({
                        data: {
                            score: 0
                        }
                    }).then(res => {
                    }).catch(err => {
                        console.log("添加用户出错");
                    });
                } else {
                    // 用户数据保存为全局变量
                    getApp().globalData.user = result.data[0];
                    // wx.removeStorage({
                    //     key: 'user',
                    // });
                    wx.setStorage({
                        data: result.data[0],
                        key: 'user',
                    });
                }
            }).catch(err => {
                console.log("查询用户信息出错");
            })
        })
        // 获取用户信息
        wx.getUserProfile({
            desc:"获取用户信息"
        }).then(res => {
            console.log(res);
            wx.setStorage({
                data: res.userInfo,
                key: 'userInfo',
            });
            getApp().globalData.userInfo = res.userInfo;
            wx.navigateBack({
                delta: 1,
            });
        }).catch(err => {
            console.log("出错了");
            console.log(err);
        })
    }
})