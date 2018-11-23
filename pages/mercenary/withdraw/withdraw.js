// pages/employer/newsList/newsList.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        price: '',
        total: 1999.90,
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
    priceAll: function () {
        this.setData({
            price: this.data.total
        })
    },
    submitOrder: function () {
        wx.showModal({
            showCancel: false,
            content: '提现申请提交成功\r\n请耐心等待',
            confirmColor: '#1ABFC0',
            success (res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                }
            }
        })
    }
})