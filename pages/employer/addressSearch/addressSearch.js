//获取应用实例
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    searchInput: '',
    searchFlag: false,
    searchList: [],
    searchResult: true,
    city: '',
    fixedText: '',
    location: {},
    goType: '',
    goUrl: '',
    id: '',
    getAddress: '{}',
    redeiveAddress: '{}',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var type = options && options.type
      var id = options && options.id
      var getAddress = options && options.getAddress
      var receiveAddress = options && options.receiveAddress
      if (type && type == 'getAddress') {
          this.setData({
              goType: type,
              goUrl: '/pages/employer/getAddress/getAddress',
              getAddress: getAddress,
          })
      } else if (type && type == 'receiveAddress') {
          this.setData({
              goType: type,
              goUrl: '/pages/employer/receiveAddress/receiveAddress',
              id: id,
              receiveAddress: receiveAddress
          })
      }
  },
    onShow: function () {
        this.resetFixed()
    },
    resetFixed: function () {
        var vm = this
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (!res.authSetting['scope.userLocation']) {
                    wx.showModal({
                        title: '是否授权当前位置',
                        content: '需要获取您的地理位置，请确认授权',
                        success: function (res) {
                            if (res.cancel) {
                            } else if (res.confirm) {
                                wx.openSetting({
                                    success: function (data) {
                                        if (data.authSetting["scope.userLocation"] == true) {

                                        }
                                    }
                                })
                            }
                        }
                    })
                } else {
                    app.getFixed(function () {
                        vm.setData({
                            city: wx.getStorageSync('city'),
                            fixedText: wx.getStorageSync('fixedText'),
                            location: {
                                lat: wx.getStorageSync('latitude'),
                                lng: wx.getStorageSync('longitude')
                            }
                        })
                    })

                }
            }
        })
    },
    focusSearchFlag: function () {
        this.setData({
            searchFlag: true
        })
    },
    blurSearchFlag: function () {
        this.setData({
            searchFlag: false
        })
    },
    setSearchInput: function (e) {
        var inputValue = e.detail.value
        this.setData({
            searchInput: inputValue
        })
    },
    submitSearch: function () {
      var vm = this
        var inputValue = vm.data.searchInput
        var city = vm.data.city
        app.globalData.qqmapsdk.getSuggestion({
            keyword: inputValue,
            region: city,
            region_fix: 1,
            success: function (res) {
                var data = res.data
                if (data.length >= 1) {
                    vm.setData({
                        searchResult: true,
                        searchList: res.data
                    })
                } else {
                    vm.setData({
                        searchResult: false,
                        searchList: []
                    })
                }

            },
            fail: function (res) {
            },
            complete: function (res) {
            }
        })
    },
    resetSearch: function () {
        this.setData({
            searchInput: ''
        })
    },
    goAddress: function (e) {
      var address = e.currentTarget.dataset.address
      var location = e.currentTarget.dataset.location
        var url = ''
        var data = this.data
        if (data.goType == 'getAddress') {
            url = data.goUrl+'?address='+address+'&location='+JSON.stringify(location)+'&getAddress='+data.getAddress
        }else if (data.goType == 'receiveAddress') {
            url = data.goUrl+'?address='+address+'&location='+JSON.stringify(location)+'&id='+data.id+'&receiveAddress='+data.receiveAddress
        }
        wx.redirectTo({
            url: url
        })
    }
})