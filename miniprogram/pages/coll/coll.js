const DB_colls = wx.cloud.database().collection("collections");
const DB_poems = wx.cloud.database().collection("poems");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        collData:[], //所有收藏记录
        userid:"", //openid
        showEmpty:false //未收藏时显示
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (query) {
        this.setData({
            userid: query.openid
        });
        await this.getColls();
    },
    onShow() {
        this.getColls();  
    },
    // 获取所有收藏记录
    getColls() {
        DB_colls.where({
            _openid: this.data.userid
        }).get().then(res => {
            if (res.data.length === 0) {
                this.setData({
                    showEmpty: true
                });
            } else {
                this.setData({
                    collData: res.data.reverse(),
                    showEmpty:false
                });
            }
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