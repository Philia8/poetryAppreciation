// pages/index/index.js
// 调用每日推荐诗句的接口
// const poems = require('../../utils/jinrishici');
// 获取peots 集合
const DB_peots = wx.cloud.database().collection("poets");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // recommendVerse: "", //每日推荐诗句
        // recommendAuthor: "", //诗人
        // recommendPoem: []
        recommendPoem: {} //诗句的全部数据
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // 获取一句推荐诗句
        // const poemData = await request("/rensheng.zheli.json");
        // this.setData({
        //     recommendVerse: poemData.data.sentence,
        //     recommendAuthor: poemData.data.author
        // });
        // 需求：获取诗词
        DB_peots.doc('ad703885604a3e120072630a79135a6e').get().then(res => {
            // console.log(res);
            this.setData({
                recommendPoem: res.data
            });
        })
    },
    /**
     * 查看诗词详情
     */
    poetDetails: function(e) {
        console.log(e.currentTarget.dataset.id);
        // console.log(e);
        wx.navigateTo({
            url: "/pages/poetry/poetry?_id="+e.currentTarget.dataset.id //查询参数为诗词ID
        })
    }
})