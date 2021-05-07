Page({

  /**
   * 页面的初始数据
   */
  data: {
    details: Array,//所有积分明细
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
      wx.cloud.callFunction({
          name:"getScoreDetail"
      }).then(res => {
        //   console.log(res);
          this.setData({
              details: res.result.data.reverse()
          });
      }).catch(err => {
          console.log("获取个人积分明细出错");
      })
  },
})