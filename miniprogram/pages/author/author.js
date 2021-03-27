// pages/author/author.js
const DB_author = wx.cloud.database().collection("authors");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        author:{} //诗人
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (query) {
        console.log(query._id);
        this.queryAuByID(query._id)
    },
    queryAuByID(id) {
        DB_author.doc(id).get().then(res => {
            console.log(res);
            this.setData({
                    author:res.data
                })
        })
    }
})