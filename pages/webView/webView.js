Page({

    /**
     * 页面的初始数据
     */
    data: {
        url: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var url = options && options.url
        this.setData({
            url: url
        })
    }
})