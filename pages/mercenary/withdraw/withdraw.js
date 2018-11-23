// pages/employer/newsList/newsList.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        price: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    setPrice: function (e) {
        this.setData({
            price: e.detail.value
        })
    },
    submitOrder: function () {
        wx.redirectTo({
            url: '/pages/mercenary/cash/cash'
        })
    }
})