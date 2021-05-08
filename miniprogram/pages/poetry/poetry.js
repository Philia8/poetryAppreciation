// pages/poetry/poetry.js
// 随机诗词
// const poems = require('../../utils/jinrishici')
const DB_poems = wx.cloud.database().collection("poems");
const DB_colls = wx.cloud.database().collection("collections");
const DB_poets = wx.cloud.database().collection("poems-authors");
let { getDateStr }  = require('../../utils/util');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        name:"", //诗名
        content: [], //诗词中所有数据
        poem_id:"",  //诗的id
        isShow: true, //收藏按钮样式是否显示
        author:"", //作者
        currentIndex: 0, //记录当前是诗人或诗词赏析的索引
        type: ["诗人详情", "诗词赏析", "诗人故事"],
        lifetime:"",
        poetryAppre:[], //赏析
        describe:[], //诗人更多故事
        currentIndex:0, //当前活跃type
        crrIdx : 0, //当前点击详情的index
        userid:"" //登录用户的openid
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (query) {
        this.setData({
            poem_id: query.id,
            author:query.author
        });
        await this.queryPoem(this.data.poem_id); //获取诗词详情
        await this.data.author && this.queryPoetDesc(this.data.author); //获取诗人详情
        // 获取缓存，主要需要登录用户的openid
        wx.getStorage({
            key: 'user_db',
        }).then(res => {
            // console.log(res);
            this.setData({
                userid: res.data._openid
            });
        }).catch(err => {
            console.log("诗词详情页面获取本地缓存出错");
        });
        // 查询是否已收藏，设置收藏按钮样式
        DB_colls.where({
            poem_id:this.data.poem_id
        }).get().then(res => {
            console.log(res);
            if (res.data.length === 0) { //说明未收藏，则显示收藏 按钮
                this.setData({
                    isShow: true
                });
            } else {
                this.setData({
                    isShow: false
                });
            }
        }).catch(err => {
            console.log("诗词详情页面检查是否已收藏出错");
        })
    },
    // 每次页面加载时都判断当前诗词是否被收藏过
    onShow() {
        // 查询是否已收藏，设置收藏按钮样式
        DB_colls.where({
            poem_id: this.data.poem_id
        }).get().then(res => {
            // console.log(res);
            if (res.data.length === 0) {
                this.setData({
                    isShow: true
                });
            } else {
                this.setData({
                    isShow: false
                });
            }
        }).catch(err => {
            console.log("诗词详情页面检查是否已收藏出错");
        })
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
                poetryAppre: porApp
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
    },
    // 点击已收藏按钮，则取消收藏
    poetColl(e) {
        // 通过判断isShow 的值（收藏按钮是否显示） 来判断当前诗词是否被收藏
        if (this.data.isShow) {
            this.coll(this.data.poem_id);
            this.setData({
                isShow: !this.data.isShow
            });
        } else {
            // 已收藏则取消收藏，并删除收藏记录
            console.log("将取消收藏");
            this.setData({
                // 显示收藏按钮
                isShow: !this.data.isShow
            });
            // 删除数据库中的收藏记录
            this.rmColl(this.data.poem_id,this.data.userid);
        }
    },
    // 添加收藏
    coll(id) {
        DB_colls.add({
            data: {
                coll_time: getDateStr(new Date().getTime()),
                poem_id: id,
                poem_name: this.data.name,
                author: this.data.author,
                content:this.data.content[0]
            }
        }).then(res => {
            console.log("收藏记录添加成功");
        }).catch(err => {
            console.log("收藏记录添加失败");
        })
    },
    // 取消收藏
    rmColl(poemid,userid) {
        DB_colls.where({
            poem_id: poemid,
            _openid: userid            
        }).remove().then(res => {
            console.log("删除收藏记录成功");
        }).catch(err => {
            console.log("删除收藏记录失败");
        })
        // DB_colls.doc(id).remove().then(res => {
        //     console.log("取消收藏成功");
        // }).catch(err => {
        //     console.log("取消收藏失败");
        // })
    }
})