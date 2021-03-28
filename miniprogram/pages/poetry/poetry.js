// pages/poetry/poetry.js
// 随机诗词
// const poems = require('../../utils/jinrishici')
// const DB_poets = wx.cloud.database().collection("poets");
// const DB_colls = wx.cloud.database().collection("collections");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // poetry: {}, //诗词中所有数据
        poetid: "",
        isShow: true, //已收藏按钮样式是否显示
        // author:{}, //作者
        currentIndex: 0, //记录当前是诗人或诗词赏析的索引
        type: ["诗人详情", "诗词赏析", "更多操作"],
        contents: { //详情数据
            poetry: {}, //诗词赏析
            author: {} //诗人详情
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(query) {
        // 对应诗句
        this.queryPoetById(query._id);
        this.setData({
            poetid: query._id
        });
        this.queryAuthorByID(this.poetid);
    },
    // 根据author_id 查询诗人信息
    queryPoetById(id) {
        DB_poets.doc(id).get().then(res => {
            this.setData({
                poetry: res.data,
                isColl: res.data.iscoll
            })
        })
    },
    // 跳转至诗人详情
    poetDetails(e) {
        // wx.navigateTo({
        //     // 携带诗人ID
        //   url: '/pages/author/author?_id='+e.currentTarget.dataset.id
        // })

    },
    // 诗词收藏
    poetColl(e) {
        /**
         * 进入该页面时可获取诗词id，查询该ID是否在collections 集合中，不在则加入，否则删除；
         * 更新收藏按钮对应的isShow 值；
         */
        DB_colls.where({
            poet_id: this.data.poetid
        }).get().then(res => {
            console.log("已收藏");
            this.setData({
                // 显示收藏按钮
                isShow: !this.data.isShow
            });
            this.rmColl(res.data[0]._id);
        }).catch(err => {
            console.log("未收藏");
            this.setData({
                isShow: false
            });
            this.coll();
        });
    },
    // 添加收藏
    coll() {
        DB_colls.add({
            data: {
                poet_id: this.data.poetid
            }
        }).then(res => {
            console.log("收藏成功");
        }).catch(err => {
            console.log("收藏失败");
        });
    },
    // 取消收藏
    rmColl(id) {
        DB_colls.doc(id).remove().then(res => {
            console.log("取消收藏成功");
        }).catch(err => {
            console.log("取消收藏失败");
        })
    },
    // 查找诗人详情
    queryAuthorByID(id) {
        DB_author.doc(id).get().then(res => {
            console.log(res);
            this.setData({
                author: res.data
            })
        })
    }
})