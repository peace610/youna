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
    // 微信支付
        wx.requestPayment(
            {
                'timeStamp': '',
                'nonceStr': '',
                'package': '',
                'signType': 'MD5',
                'paySign': '',
                'success':function(res){},
                'fail':function(res){},
                'complete':function(res){}
            })
    }

})