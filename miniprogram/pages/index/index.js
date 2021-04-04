// 获取poems 集合
const DB_poems = wx.cloud.database().collection("poems");
const DB_category = wx.cloud.database().collection("poems-category");
Page({

    properties: {
        query: {
            type: String,
            default () {
                return "";
            }
        }
    },

    /**
     * 页面的初始数据
     */
    data: {
        recommandPoem: {}, //推荐诗句的全部数据，诗句、诗人
        dynasty:{}, //所有朝代
        theme:{}, //所有题材
        poets:{}, //所有诗人
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // 随机诗词推荐
        this.randomPoem && this.randomPoem();
        // 获取所有朝代
        this.getTypes && this.getTypes("朝代");
        this.getTypes && this.getTypes("类型");
        this.getTypes && this.getTypes("作者");
    },
    searchHandler(e) {
        wx.navigateTo({
            url: '/pages/search/search'
        })
    },
    /**
     * 查看诗词详情
     */
    poetDetails: function(e) {
        wx.navigateTo({
            //查询参数为诗词ID
            url: "/pages/poetry/poetry?id="+ e.currentTarget.dataset.id
                +"&author=" + e.currentTarget.dataset.author
        })
    },
    // 随机古诗词获取
    randomPoem() {
        // 从唐诗三百首中随机推荐诗词
        const random = Math.round(Math.random() * 10); //随机数
        DB_poems.where({
            type: "唐诗三百首"
        }).get().then(res => {
            // console.log(res);
            this.setData({
                recommandPoem: res.data[random]
            });
        }).catch(err => {
            console.log(err);
        });
    },
    // 获取所有朝代
    getTypes(mainName) {
        DB_category.where({
            mainName:mainName
        }).get().then(res => {
            switch (mainName) {
                case "类型": {
                    this.setData({
                        theme: res.data
                    })
                }; break;
                case "作者": {
                    this.setData({
                        poets: res.data
                    })
                }; break;
                case "朝代": {
                    this.setData({
                        dynasty: res.data
                    })
                }; break;
                default: {
                    break;
                }
            }
        }).catch(err => {
            console.log(err);
        })
    },
    // 右拉刷新
    refreshHandler(e) {
            // console.log("HHH");
        this.getTypes(e.currentTarget.dataset.type);
        // console.log(this.data.theme);
        // 当前问题:从数据库中取数据始终取到相同的数据集,需要进行分批显示
    }
})