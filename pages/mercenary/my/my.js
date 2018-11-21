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
    newsList: function () {
        wx.navigateTo({
            url: '/pages/mercenary/newsList/newsList'
        })
    },
    goMercenary: function () {
        wx.navigateTo({
            url: '/pages/employer/index/index'
        })
    }
})