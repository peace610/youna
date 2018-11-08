Page({

  /**
   * 页面的初始数据
   */
  data: {
      name: '',
      address: '',
      addressDetail: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var address = options && options.address
      if (address) {
          this.setData({
              address: address
          })
      }

  },
    addressSearch: function () {
        wx.redirectTo({
            url: '/pages/employer/addressSearch/addressSearch?type=getAddress'
        })
    },
    setName: function (e) {
        this.setData({
            name: e.detail.value
        })
    },
    setAddressDetail: function (e) {
        this.setData({
            addressDetail: e.detail.value
        })
    },
    submitOrder: function (e) {
        // var getAddress = e.currentTarget.dataset.address + e.currentTarget.dataset.addressDetail
        // wx.navigateTo({
        //     url: '/pages/employer/employer?getAddress='+getAddress
        // })
        wx.navigateTo({
            url: '/pages/employer/index/index'
        })
    }
})