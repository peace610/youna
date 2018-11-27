//app.js
var QQMapWX = require('./libs/qqmap-wx-jssdk.min.js');
const util = require('./utils/util.js')
App({
  onLaunch: function () {
      this.globalData.qqmapsdk = new QQMapWX({
          key: 'GIUBZ-DWEWW-6CVRK-OLZWV-26UUH-5OBRT'
      });
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 悠拿登录
        var param = {
            post_vars: {
                appid: 1,
                secret: "qasdcd",
                js_code: "1qasxdfg"
            }
        }
        util.ajax('POST','/login',param,(res) => {
          console.info(res)
          console.info('成功了')
          var param_user = {
              session_id: res.session_id,
              post_vars: {
                  user_id: res.user_id,
                  user_info: "{\"nickName\": \"hdzhang\",\"gender\": 1,\"avatarUrl\": \"AVATARURL\"}",
                  raw_data: "",
                  signature: "",
                  encrypted_data: "",
                  iv: ""
              }
          }
          // 悠拿用户注册
          util.ajax('POST','/user',param_user)
        })
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              console.info(res.userInfo,555)
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
  globalData: {
    userInfo: null,
      qqmapsdk: null,
  }
})