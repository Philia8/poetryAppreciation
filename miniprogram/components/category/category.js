// components/category/category.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        propCategoryHeader: String,
        types: Array
    },
    onLoad() {
    },
    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        // 进入分类详情
        cateDetail(e) {
            console.log(e);
            let dataset = e.currentTarget.dataset;
            
            // 跳转至搜索结果展示页面
            wx.navigateTo({
                url: '/pages/search/search?name=' + dataset.name + "&mainname=" + dataset.mainname,
            });
            // 云函数调用
            //  wx.cloud.callFunction({
            //      name: 'getPoetsDynasty',
            //      data: {
            //          searchKey: dataset.name
            //      }
            //  }).then(res => {
            //      console.log(res);
            //      wx.navigateTo({
            //          url: '/pages/search/search?res='+res.result.data,
            //      })
            //  }).catch(err => {
            //      console.log(err);
            //      console.log("有问题");
            //  })

        }
    }
})
