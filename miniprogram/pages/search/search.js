// miniprogram/pages/search/search.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        searchResult: [], //查询结果
        isShow : false, //未找到时显示该元素
        isWait : false, //等待查找
        showRes : false //结果折叠
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
    inputHandler() {
        this.setData({
            showRes: false
        });
    },
    // 搜索内容
    searchValue(e) {
        this.setData({
            isWait: true,
            isShow: false,
            showRes:false
        });
        wx.cloud.callFunction({
            name: "getPoems",
            data: {
                searchKey: e.detail.detail.value
            }
        }).then(res => {
            console.log(res);
            this.setData({
                searchResult: res.result.data,
                showRes:true
            })
        }).catch(err => {
            console.log("未找到");
            this.setData({
                isWait:false,
                isShow: true
            });
        })
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