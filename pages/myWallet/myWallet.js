const util = require('../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        offset: 0,
        amountList: [],
        amountInfo : null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var session_id = wx.getStorageSync('session_id')
        var user_id = wx.getStorageSync('user_id')
        var vm = this
        var param = {
            session_id: session_id,
            user_id: user_id,
        }
        util.ajax('GET','/user/account',param,(res) => {
            if (res.status == 200) {
                vm.setData({
                    amountInfo: res.data
                })
            }
        })
    },
    // getAmountList: function () {
    //     var vm = this
    //     var session_id = wx.getStorageSync('session_id')
    //     var user_id = wx.getStorageSync('user_id')
    //     var param = {
    //         session_id: session_id,
    //         user_id: user_id,
    //         type: '',
    //         limit:5,
    //         offset: vm.data.offset,
    //     }
    //     util.ajax('GET','/user/messages',param,(res) => {
    //         if (res.status == 200) {
    //             vm.setData({
    //                 offset: vm.data.offset + 5,
    //                 amountList: vm.data.amountList.concat(res.data.message_list),
    //             })
    //         }
    //
    //     })
    // },
    // onReachBottom: function () {
    //     this.getAmountList()
    // },
    withdraw: function () {
        wx.navigateTo({
            url: '/pages/withdraw/withdraw'
        })
    },
})