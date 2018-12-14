const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      amount: 0
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
      }
      util.ajax('GET','/config',param,(res) => {
          vm.setData({
              amount: parseFloat(res.data.deposit)
          })
      })
  },
    submitOrder: function () {
        var vm = this
        var param = {
            session_id: wx.getStorageSync('session_id'),
            post_vars: {
                user_id: wx.getStorageSync('user_id'),
                amount: vm.data.amount
            }
        }
        util.ajax('POST','/user/account/actions/deposit',param,(res) => {
            var data = res.data
            var vm = this
            wx.requestPayment(
                {
                    timeStamp: data.timeStamp,
                    nonceStr: data.nonceStr,
                    package: data.package,
                    signType: data.signType,
                    paySign: data.paySign,
                    success: function(res){
                        setTimeout(() => {
                            wx.switchTab({
                                url: '/pages/mercenary/index/index'
                            })
                        },100)
                    },
                    fail: function(res){
                    },
                    complete: function(res){
                        vm.hideModal()
                    }
                })
        })
    }
})