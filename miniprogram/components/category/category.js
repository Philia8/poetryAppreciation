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
        more() {
            console.log("分类详情");
        },
        // 右滑刷新功能
        refreshData(e) {
            this.triggerEvent("refresh",);
        }
    }
})
