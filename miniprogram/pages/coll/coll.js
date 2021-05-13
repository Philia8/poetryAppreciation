const DB_colls = wx.cloud.database().collection("collections");
const DB_poems = wx.cloud.database().collection("poems");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        collData:[], //所有收藏记录
        userid:'', //用户的 openid
        showEmpty:true //未收藏时显示
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (query) {
        this.setData({
            userid: query.openid
        });
        // this.getColls();
    },
    async onShow() {
        this.getUserid();
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
            // 获取用户的收藏记录
                this.getColls();
        })
    },
    // 获取所有收藏记录
    getColls() {
        wx.cloud.callFunction({
            name: 'getColPoems',
            data: {
                openid:this.data.userid
            }
        }).then(res => {
            console.log("获取用户收藏诗词成功！");
            console.log(res);
            this.setData({
                collData: res.result.data,
                showEmpty: false
            });
        }).catch(err => {
            this.setData({
                showEmpty: true
            });
            console.log("收藏列表为空："+this.data.showEmpty);
            console.log("获取用户收藏诗词出错！");
            console.log(err);
        });
    },
    // 进入诗词详情页
    goPoemDetail(e) {
        wx.navigateTo({
            //查询参数为诗词ID
            url: "/pages/poetry/poetry?id=" + e.currentTarget.dataset.id +
                "&author=" + e.currentTarget.dataset.author
        })
    }
})