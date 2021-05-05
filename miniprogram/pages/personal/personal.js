Page({

    /**
     * 页面的初始数据
     */
    data: {
        code: '',
        userInfos:{} //用户信息
    },  

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
    },
    async onShow() {
        await wx.checkSession({}).then(res => {
            // 缓存中获取用户信息
            wx.getStorage({
              key: 'userInfo',
            }).then(res => {
                this.setData({
                    userInfos:res.data
                })                
            })
        }).catch(err => { //未登录则跳转登陆页面
            wx.navigateTo({
                url: '/pages/login/login',
            })
        })
    }
})