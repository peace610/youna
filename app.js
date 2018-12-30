//app.js
var QQMapWX = require('./libs/qqmap-wx-jssdk.min.js');
const util = require('./utils/util.js')
App({
  onLaunch: function () {
      this.globalData.qqmapsdk = new QQMapWX({
          key: 'GIUBZ-DWEWW-6CVRK-OLZWV-26UUH-5OBRT'
      });
      // 获取用户信息
      wx.getSetting({
          success: res => {
              if (res.authSetting['scope.userInfo']) {
                  // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                  wx.getUserInfo({
                      success: res => {
                          // 可以将 res 发送给后台解码出 unionId
                          // console.info(res.userInfo,555)
                          this.globalData.userInfo = res.userInfo
                          // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                          // 所以此处加入 callback 以防止这种情况
                          if (this.userInfoReadyCallback) {
                              this.userInfoReadyCallback(res)
                          }
                      }
                  })
              }
          }
      })
  },
  getFixed: function (fun,failFun) {
      var vm = this
      wx.getLocation({
          success: function(data) {
              vm.globalData.qqmapsdk.reverseGeocoder({
                  location: {
                      latitude: data.latitude,
                      longitude: data.longitude
                  },
                  success: function(res) {
                      var city = res.result.address_component.city
                      if(city.indexOf('市')) {
                          city = city.substr(0,city.length-1)
                      }
                      wx.setStorageSync('latitude',data.latitude)
                      wx.setStorageSync('longitude',data.longitude)
                      wx.setStorageSync('city',city);
                      wx.setStorageSync('fixedText',res.result.address)
                      if (typeof fun == "function" ) {
                          fun()
                      }
                  },
                  fail: function(res) {
                  },
                  complete: function(res) {
                  }
              })
          },
          fail: function (res) {
              if (typeof failFun == "function" ) {
                  failFun()
              }
          }
      })
  },
  globalData: {
    userInfo: null,
      qqmapsdk: null,
  }
})