const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      options: {},
      name: '',
      address: '',
      addressDetail: '',
      location: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      options: options
    })
  },
  onShow: function () {
      var options = this.data.options
      var address = options && options.address
      var location = options && options.location
      var goIndex = options && options.goIndex
      var getAddress = options && options.getAddress
      if (goIndex && getAddress) {
          var data = JSON.parse(getAddress)
          this.setData({
            name: data.shop_name,
            address: data.first_address,
            addressDetail: data.last_address,
              location: {
                  lat: data.latitude,
                  lng: data.longitude
              },
          })
      } else {
          if (address && location) {
              this.setData({
                  address: address,
                  location: JSON.parse(location),
              })
          }
          if (getAddress) {
              var getAddress = JSON.parse(getAddress)
              this.setData({
                  name: getAddress.name,
                  addressDetail: getAddress.addressDetail,
              })
          }
      }
      wx.setStorageSync('getAddressFlag',true)
  },
    onUnload: function () {
      if(wx.getStorageSync('getAddressFlag')) {
        wx.navigateTo({
              url: '/pages/employer/index/index'
          })
      }
    },
    addressSearch: function () {
      wx.setStorageSync('getAddressFlag', false)
      var data = this.data
      var  getAddress= {
          name: data.name,
          addressDetail: data.addressDetail
      }
        wx.navigateTo({
            url: '/pages/employer/addressSearch/addressSearch?type=getAddress&getAddress='+JSON.stringify(getAddress)
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
        // // 悠拿添加取货地址
        var param = {
            session_id: wx.getStorageSync('session_id'),
            post_vars: {
                user_id: wx.getStorageSync('user_id'),
                type: 0, // type: 0-取货地址，1-收货地址
                property: 4,
                shop_name: this.data.name,
                first_name: "",
                last_name: "",
                phone: "",
                first_address: this.data.address,
                last_address: this.data.addressDetail,
                latitude: this.data.location.lat,
                longitude: this.data.location.lng,
                default: true
            }
        }
        util.ajax('POST','/user/address',param,(res) => {
            wx.setStorageSync('getAddressFlag',false)
          wx.redirectTo({
                url: '/pages/employer/index/index'
            })
        })
    }
})