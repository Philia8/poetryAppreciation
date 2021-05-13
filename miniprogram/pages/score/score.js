Page({

  /**
   * 页面的初始数据
   */
  data: {
    details: Array,//所有积分明细
    showDetails:false, //是否有记录
    userid:'' //用户openid
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (query) {
    // const DB_log = wx.cloud.database().collection("log");
    // DB_log.where({
    //   _openid: query.openid
    // }).get().then(res => {
    //   console.log(res);
    //   const arr = res.data.length === 0 ? [] : res.data.reverse();
    //   this.setData({
    //     details: arr,
    //     showDetails: true
    //   });
    // }).catch(err => {
    //   this.setData({
    //     showDetails: false
    //   });
    //   console.log(err);
    //   console.log("获取个人积分明细出错");
    // });
    // console.log(query);
    this.setData({
      userid: query.openid
    });
    this.getDetails(this.data.userid);
  },
  onShow() {
    this.getDetails(this.data.userid);
  },
  // 获取用户积分明细
  getDetails(userid) {
    wx.cloud.callFunction({
      name: "getScoreDetail",
      data: {
        openid: userid
      }
    }).then(res => {
      console.log(res);
      const arr = res.result.data.length === 0 ? [] : res.result.data.reverse();
      this.setData({
        details: arr,
        showDetails: true
      });
    }).catch(err => {
      this.setData({
        showDetails: false
      });
      console.log(err);
      console.log("获取个人积分明细出错");
    });
  }
})