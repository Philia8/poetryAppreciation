// miniprogram/pages/search/search.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        searchResult: [] //查询结果
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },
    // 搜索内容
    searchValue(e) {
        wx.cloud.callFunction({
            name: "getPoems",
            data: {
                searchKey: e.detail.detail.value
            }
        }).then(res => {
            console.log(res);
            this.setData({
                searchResult: res.result.data
            })
        });
    },
    // 跳转至诗词详情
    poemDetail(e) {
        wx.navigateTo({
            //查询参数为诗词ID
            url: "/pages/poetry/poetry?id=" + e.currentTarget.dataset.id +
                "&author=" + e.currentTarget.dataset.author
        })
    }
})