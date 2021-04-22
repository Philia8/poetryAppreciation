// miniprogram/pages/search/search.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        searchResult: [], //查询结果
        notFind : false, //未找到时显示该元素
        isWait : false, //等待查找
        showRes : false, //结果折叠
        title:"", //搜索的key
        total:0//搜索结果总条数
     },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (query) {
        this.setData({
            showRes:false
        })
        // console.log(query);
        // 通过mainName 确定调用的实际的云函数
        // 分类查询实现
        switch (query.mainname) {
            case "类型": {
                wx.cloud.callFunction({
                    name: "getCatePoems",
                    data: {
                        searchKey:query.name
                    }
                }).then(res => {
                    console.log(res);
                    this.setData({
                        searchResult: res.result.data,
                        total: res.result.data.length,
                        showRes: true
                    })
                })
            };
            break;
            case "作者": {
                wx.cloud.callFunction({
                    name: "getPoems",
                    data: {
                        searchKey: query.name
                    }
                }).then(res => {
                    console.log(res);
                    this.setData({
                        searchResult: res.result.data,
                        total: res.result.data.length,
                        showRes: true
                    })
                })
            };
        break;
            case "朝代": {
                wx.cloud.callFunction({
                    name: "getPoetsDynasty",
                    data: {
                        searchKey: query.name
                    }
                }).then(res => {
                    console.log(res);
                    this.setData({
                        searchResult: res.result.data,
                        total: res.result.data.length,
                        showRes:true
                    })
                })
            };
        break;
        default:
            break;
        };
        this.setData({
            title: query.name
        })
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
            notFind: false,
            showRes: false,
            title: e.detail.detail.value
        });
        const searchKey = e.detail.detail.value;
        const searchPoet = wx.cloud.callFunction({
            name: "getPoems",
            data: {
                searchKey: searchKey
            }
        }).then(res => {
            console.log(res);
            this.setData({
                searchResult: res.result.data,
                showRes: true,
                total: res.result.data.length
            })
        }).catch(err => {
            // 通过诗人名称未找到，则查找诗名
            this.getPoemsByName(e);
        });
    },
    // 诗名查询
    getPoemsByName(e) {
        const searchKey = e.detail.detail.value;
        wx.cloud.callFunction({
            name: "getPoemByPoet",
            data: {
                searchKey: searchKey
            }
        }).then(res => {
            this.setData({
                searchResult: res.result.data,
                showRes: true,
                total: res.result.data.length,
                isWait:false
            })
        }).catch(err => {
            console.log("未找到");
            this.setData({
                isWait: false,
                notFind: true
            });
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