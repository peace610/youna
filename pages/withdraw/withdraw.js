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
        wx.showModal({
            title: '温馨提示',
            showCancel: false,
            content: '受微信政策影响，提现请加微信"xxx",我们会人工审核打款一般1-3个工作日到账',
            confirmColor: '#1ABFC0',
            confirmText: '我知道',
            success(res) {
                if (res.confirm) {
                    util.ajax('POST','/user/account/actions/withdraw',param,(res) => {
                    })
                }
            }
        })
    }
})