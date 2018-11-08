var QQMapWX = require('../../../libs/qqmap-wx-jssdk.min.js');
var qqmapsdk;
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
    goType: '',
    goUrl: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var type = options && options.type
      if (type && type === 'getAddress') {
          this.setData({
              goType: type,
              goUrl: '/pages/employer/getAddress/getAddress'
          })
      } else if (type && type === 'receiveAddress') {
          this.setData({
              goType: type,
              goUrl: '/pages/employer/receiveAddress/receiveAddress'
          })
      }
      var vm = this
      qqmapsdk = new QQMapWX({
          key: 'A6MBZ-SXPCW-6PDRN-OTXYN-GZFU6-KSBMC'
      });
      vm.resetFixed()
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
        qqmapsdk.getSuggestion({
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
        wx.redirectTo({
            url: this.data.goUrl+'?address='+address
        })
    },
    resetFixed: function () {
        var vm = this
        wx.getLocation({
            success: function(data) {
                qqmapsdk.reverseGeocoder({
                    location: {
                        latitude: data.latitude,
                        longitude: data.longitude
                    },
                    success: function(res) {
                        var city = res.result.address_component.city
                        if(city.indexOf('市')) {
                            city = city.substr(0,city.length-1)
                        }
                        vm.setData({
                            city: city,
                            fixedText: res.result.address
                        })
                    },
                    fail: function(res) {
                    },
                    complete: function(res) {
                    }
                })
            }
        })
    }
})