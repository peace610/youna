Page({
  data: {
    getAddress: '',
    receiveAddress: '',
    num: 1,
    des: '',
    price: 2
  },
  onLoad: function (options) {
      // var getAddress = options && options.getAddress
      var receiveAddress = options && options.receiveAddress
      // if (getAddress) {
      //     this.setData({
      //         getAddress: getAddress
      //     })
      // }
      if (receiveAddress) {
          this.setData({
              receiveAddress: receiveAddress
          })
      }
  },
    getAddress: function () {
        wx.navigateTo({
            url: '/pages/employer/getAddress/getAddress'
        })
    },
    receiveAddress: function () {
      // var goUrl = '/pages/receiveAddress/receiveAddress'
      var goUrl = '/pages/employer/receiveAddressList/receiveAddressList'
        wx.navigateTo({
            url: goUrl
        })
    },
    subtractNum: function () {
        var num = this.data.num
        if (num > 1) {
            num--
            this.setData({
                num: num
            })
        }
    },
    addNum: function () {
        var num = this.data.num
        num++
        this.setData({
            num: num
        })
    },
    des: function (e) {
        this.setData({
            des: e.detail.value
        })
    },
    submitOrder: function () {
        wx.navigateTo({
            url: '/pages/employer/orderDetail/orderDetail'
        })
    },
    scan: function () {
      wx.scanCode({
        success: (res) => {
          console.log(res)
        }
      })
    }
})