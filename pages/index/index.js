//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      userInfo: {},
      hasUserInfo: false,
      canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
      var vm = this
      if (app.globalData.userInfo) {
          vm.setData({
              userInfo: app.globalData.userInfo,
              hasUserInfo: true
          })
      } else if (this.data.canIUse){
          // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
          // 所以此处加入 callback 以防止这种情况
          app.userInfoReadyCallback = res => {
              vm.setData({
                  userInfo: res.userInfo,
                  hasUserInfo: true
              })
          }
      } else {
          // 在没有 open-type=getUserInfo 版本的兼容处理
          wx.getUserInfo({
              success: res => {
                app.globalData.userInfo = res.userInfo
                    vm.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        })
      }
      app.getFixed()
  },
    getUserInfoEmployer: function (e) {
        if (e.detail.errMsg == 'getUserInfo:ok'){
            app.globalData.userInfo = e.detail.userInfo
            this.setData({
                userInfo: e.detail.userInfo,
                hasUserInfo: true
            })
            wx.navigateTo({
                url: '/pages/employer/index/index'
            })
        }
    },
    getUserInfoMercenary: function (e) {
        console.log(e)
        if (e.detail.errMsg == 'getUserInfo:ok'){
            app.globalData.userInfo = e.detail.userInfo
            this.setData({
                userInfo: e.detail.userInfo,
                hasUserInfo: true
            })
            wx.switchTab({
                url: '/pages/mercenary/index/index'
            })
        }
    }
})