// pages/games/games.js
const { getDateStr } = require("../../utils/util.js");
const DB_user = wx.cloud.database().collection("user");
const DB_log = wx.cloud.database().collection("log");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userid:'', //用户ID
        userInfo_db:{}, //用户数据
        score:0, //用户分数
        poems: [],
        gamePoem: "",
        answer:'', //答案
        poemId:"", // 诗词id，进入诗词详情
        poemAuthor:"",  //诗人姓名
        usrAns:"" //用户答案
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 判断是否登录并获取用户信息
        this.isLogin();
        // 获取游戏的诗词素材
        this.getPoem();
    },
    onShow() {
        // 判断是否登录并获取用户信息
        this.isLogin();
    },
    // 判断是否登录
    isLogin() {
        // 检测登录状态并获取用户的信息
        wx.checkSession({}).then(res => {
            // 获取用户的登录信息
            wx.getStorage({
                key: 'userInfo',
            }).then(res => {
                // 获取用户openid
                this.getUserid();
            });
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
        }).get().then(res => {
            // console.log(res);
            this.setData({
                userInfo_db: res.data[0],
                score:res.data[0].score
            });
        }).catch(err => {
            console.log("个人中心获取用户数据库信息失败！");
        });
    },
    // 获取一句诗词
    getPoem() {
        /*
            思路：在唐诗三百首中随机获取一首诗，取第2句，展示
        */
        // 从唐诗三百首中随机推荐诗词
        wx.cloud.callFunction({
            name: "getGamePoem",
            data: {
                searchKey: "唐诗三百首"
            }
        }).then(res => {
            console.log(res);
            // 调用云函数随机获取一句诗词
            this.setData({
                poems: res.result,
                gamePoem: res.result.content[1],
                poemId: res.result._id,
                poemAuthor:res.result.author
            });
            this.game();
        }).catch(err => {
            console.log(err);
        });
    },
    // 游戏逻辑
    game() {
        const random = parseInt(Math.random() * 10);
        let arr = this.data.gamePoem.split('');
        // console.log(arr);
        //  被删除的填词答案
        let ss = arr.splice(random, 1, '__');
        console.log(ss);
        if (ss === ',' || ss === '，') {
            this.game();
            return;
        } else {
            this.setData({
                gamePoem: arr.join(''),
                answer: ss
            });
        }
    },
    // 获取并存储用户输入的答案
    userAns(e) {
        // console.log(e);
        this.setData({
            usrAns: e.detail.value
        })
    },
    // 验证答案
    subAns(e) {
        if (this.data.usrAns === this.data.answer[0]) {
            wx.showToast({
              title: '答对了！',
            })
            this.setData({
                score: this.data.score + 2
            });
            // 存储积分明细
            this.setScoreDetail(new Date().getTime(),"+2",0);
            // 下一关
            this.getPoem();
        } else {
            wx.showToast({
                title: '答错了！',
                icon:'error'
            });
        }
    },
    // 下一关
    next() {
        
        // 直接点击下一关-1
        wx.showModal({
            cancelColor: '#bfa',
            title: "放弃本关 积分-1"
        }).then(res => {
            if (res.confirm) {
                if (this.data.score < 1) {
                    wx.showToast({
                        title: '您的积分不足',
                        icon:"error"
                    });
                } else {
                    // 扣除积分
                    this.setData({
                        score: this.data.score - 1
                    });
                    DB_log.add({
                        data: {
                            cause: 1,
                            action: "-1",
                            time: getDateStr(new Date().getTime())
                        }
                    }).then(res => {
                        console.log("下一关积分明细更新成功！");
                    }).catch(err => {
                        console.log("下一关积分明更新失败！");
                    })
                    console.log(this.data.score);
                    console.log("用户选择进入下一关");
                    this.getPoem();
                }
            } else {
                console.log("用户未选择进入下一关");
            }
        });
    },
    // 用户点击查看诗词详情，有偿
    goPoemDetail() {
        const time_now = new Date().getTime();
        wx.showModal({
            cancelColor: '#bfa',
            title: "查看答案积分-3"
        }).then(res => {
            if (res.confirm) {
                if (this.data.score < 3) {
                    wx.showToast({
                        title: '您的积分不够哦',
                        icon: "error"
                    });
                } else {
                    this.setData({
                        score: this.data.score - 3
                    });
                    this.poemDetail();
                    console.log("用户查看答案扣分成功！");
                    // 存储积分明细
                    this.setScoreDetail(time_now, "-3", 1);
                }
            } else {
                console.log("用户未选择查看答案！");
            }
        }).catch(err => {
            console.log("用户查看答案扣分失败！");
        })

    },
    // 跳转至诗词详情
    poemDetail(e) {
        // console.log(e);
        wx.navigateTo({
            //查询参数为诗词ID
            url: "/pages/poetry/poetry?id=" + this.data.poemId +
                "&author=" + this.data.poemAuthor
        });
    },
    // 用户离开页面时更新数据库数据
    onHide() {
        this.updateDataForDB();
    },
    onUnload() {
        this.updateDataForDB();
    },
    // 存储积分明细
    /**
     * 
     * @param {String} time_now 时间戳
     * @param {String} action +2 游戏得分，+2 签到积分，-3 道具扣分 
     * @param {Number} cause  0 游戏得分,1 游戏扣分,2 签到得分
     */
    setScoreDetail(time_now,action,cause) {
        DB_log.add({
            data: {
                action: action,
                cause: cause,
                time: getDateStr(time_now)
            }
        }).then(res => {
            console.log("游戏积分更新记录成功");
        }).catch(err => {
            console.log("游戏积分更新记录添加出错！");
        });
    },
    // 更新个人积分
    updateDataForDB() {
        // 更新数据库数据
        DB_user.where({
            _openid: this.data.userid
        }).update({
            data: {
                score: this.data.score
            }
        }).then(res => {
            console.log("游戏页面积分更新完成");
        }).catch(err => {
            console.log("游戏页面积分更新失败！");
            console.log(err);
        });
    }
})