const util = require('../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        price: '',
        userInfo: {},
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var vm = this
        var session_id = wx.getStorageSync('session_id')
        var user_id = wx.getStorageSync('user_id')
        var param = {
            session_id: session_id,
            user_id: user_id
        }
        util.ajax('GET','/user',param,(res) => {
            vm.setData({
                userInfo: res.data
            })
        })
    },
    setPrice: function (e) {
        this.setData({
            price: e.detail.value
        })
    },
    priceAll: function () {
        this.setData({
            price: this.data.userInfo.amount
        })
    },
    submitOrder: function () {
        var vm = this
        var session_id = wx.getStorageSync('session_id')
        var user_id = wx.getStorageSync('user_id')
        var param = {
            session_id: session_id,
            post_vars: {
                user_id: user_id,
                amount: parseFloat(vm.data.price)
            }
        }
        util.ajax('POST','/user/account/actions/withdraw',param,(res) => {
            wx.showToast({
                title: '提现申请提交成功\r\n请耐心等待',
                icon: 'none'
            })
        })

        // wx.showModal({
        //     showCancel: false,
        //     content: '提现申请提交成功\r\n请耐心等待',
        //     confirmColor: '#1ABFC0',
        //     success (res) {
        //         if (res.confirm) {
        //             console.log('用户点击确定')
        //         }
        //     }
        // })
    }
})