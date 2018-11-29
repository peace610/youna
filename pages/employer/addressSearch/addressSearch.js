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
      vm.setData({
          city: wx.getStorageSync('city'),
          fixedText: wx.getStorageSync('fixedText')
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
        wx.redirectTo({
            url: this.data.goUrl+'?address='+address
        })
    },
    resetFixed: function () {
        app.getFixed()
    },
})