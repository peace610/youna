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
    goEmployer: function (e) {
        var receiveAddress = e.currentTarget.dataset.receiveAddress
        console.info(receiveAddress)
        wx.navigateTo({
            url: '/pages/employer/index/index?receiveAddress='+receiveAddress
        })
    },
    editAddress: function () {
        wx.redirectTo({
            url: '/pages/employer/receiveAddress/receiveAddress'
        })
    },
    delAddress: function () {

    },
    receiveAddress: function () {
        wx.redirectTo({
            url: '/pages/employer/receiveAddress/receiveAddress'
        })
    }
})