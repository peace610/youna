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
    orderList: function () {
        wx.navigateTo({
            url: '/pages/employer/orderList/orderList'
        })
    },
    newsList: function () {
        wx.navigateTo({
            url: '/pages/employer/newsList/newsList'
        })
    },
    goMercenary: function () {
        wx.switchTab({
            url: '/pages/mercenary/index/index'
        })
    }
})