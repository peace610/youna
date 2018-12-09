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
    myWallet: function () {
        wx.navigateTo({
            url: '/pages/myWallet/myWallet'
        })
    },
    cash: function () {
        wx.navigateTo({
            url: '/pages/mercenary/cash/cash'
        })
    },
    newsList: function () {
        wx.navigateTo({
            url: '/pages/mercenary/newsList/newsList'
        })
    },
    feedback: function () {
        wx.navigateTo({
            url: '/pages/feedback/feedback'
        })
    },
    protocol: function () {
        wx.navigateTo({
            url: '/pages/protocol/protocol'
        })
    },
    help: function () {
        wx.navigateTo({
            url: '/pages/help/help'
        })
    },
    goMercenary: function () {
        wx.navigateTo({
            url: '/pages/employer/index/index'
        })
    }
})