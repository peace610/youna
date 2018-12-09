const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
    submitOrder: function () {
        var vm = this
        var param = {
            session_id: wx.getStorageSync('session_id'),
            post_vars: {
                user_id: wx.getStorageSync('user_id'),
                amount: 19.9
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
                        wx.switchTab({
                            url: '/pages/mercenary/my/my'
                        })
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