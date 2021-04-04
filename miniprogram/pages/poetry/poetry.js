// pages/poetry/poetry.js
// 随机诗词
// const poems = require('../../utils/jinrishici')
const DB_poems = wx.cloud.database().collection("poems");
const DB_colls = wx.cloud.database().collection("collections");
const DB_poets = wx.cloud.database().collection("poems-authors");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        name:"", //诗名
        content: [], //诗词中所有数据
        poem_id:"",  //诗
        isShow: true, //已收藏按钮样式是否显示
        author:"", //作者
        currentIndex: 0, //记录当前是诗人或诗词赏析的索引
        type: ["诗人详情", "诗词赏析", "诗人故事"],
        lifetime:"",
        poetryAppre:[], //赏析
        describe:[], //诗人更多故事
        currentIndex:0, //当前活跃type
        crrIdx : 0, //当前点击详情的index
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (query) {
        this.setData({
            poem_id: query.id,
            author:query.author
        });
        /*
            函数执行之间有关联，所以在执行顺序和执行时机上需要设计
        */
        this.queryPoem && this.queryPoem(this.data.poem_id); //获取诗词详情
        this.queryPoetDesc && this.data.author && this.queryPoetDesc(this.data.author); //获取诗人详情
    },
    // 诗词信息
    queryPoem(id) {
        DB_poems.doc(id).get().then(res => {
            // console.log("id = " + id);
            // console.log("poemRes + " + res.data);
            const porApp = res.data.poetryAppre || res.data.translate
            this.setData({
                content: res.data.content,
                name: res.data.name,
                author: res.data.author,
                poetryAppre:porApp
            });
        }).catch(err => {
            console.log(err);
        })
    },
    // 诗人信息
    queryPoetDesc(name) {
        DB_poets.where({
            name:name
        }).get().then(res => {
            this.setData({
                lifetime: res.data[0].lifetime,
                describe:res.data[0].describe
            })
        }).catch(err => {
            console.log(err);
        })
    },
    // 点击切换type
    changeType(e) {
        this.setData({
            currentIndex: e.currentTarget.dataset.index 
        });
        // 诗词赏析内容未填充
        if (!this.data.poetryAppre) {
            this.queryPoem(this.data.poem_id);
        }
    },
    // 是否显示详情
    // 默认所有列表项隐藏内容，点击时肯定不相等，则使当前crrIdx 与列表项index 相等，
    detailShowHandler(e) {
        const itemIndex = e.currentTarget.dataset.index; //点击时的索引
        const crrIdx = this.data.crrIdx; //当前记录的id  
        // console.log(itemIndex);
        // console.log(crrIdx);
        if (itemIndex === crrIdx) {
            this.setData({
                crrIdx: -1
            })
        } else {
            this.setData({
                crrIdx: itemIndex
            });
        }
    }
    // 诗词收藏
    // poetColl(e) {
    //     /**
    //      * 进入该页面时可获取诗词id，查询该ID是否在collections 集合中，不在则加入，否则删除；
    //      * 更新收藏按钮对应的isShow 值；
    //      */
    //     DB_colls.where({
    //         poet_id: this.data.poetid
    //     }).get().then(res => {
    //         console.log("已收藏");
    //         this.setData({
    //             // 显示收藏按钮
    //             isShow: !this.data.isShow
    //         });
    //         this.rmColl(res.data[0]._id);
    //     }).catch(err => {
    //         console.log("未收藏");
    //         this.setData({
    //             isShow: false
    //         });
    //         this.coll();
    //     });
    // },
    // 添加收藏
    // coll()x
    // 取消收藏
    // rmColl(id) {
    //     DB_colls.doc(id).remove().then(res => {
    //         console.log("取消收藏成功");
    //     }).catch(err => {
    //         console.log("取消收藏失败");
    //     })
    // }
})