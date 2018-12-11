const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
    onShow: function () {
        var vm = this
        var session_id = wx.getStorageSync('session_id')
        var user_id = wx.getStorageSync('user_id')
        var param = {
            session_id: session_id,
            user_id: user_id
        }
        util.ajax('GET','/user',param,(res) => {
            vm.setData({
                userInfo: res.data
            })
        })
    },
    myWallet: function () {
        wx.navigateTo({
            url: '/pages/myWallet/myWallet'
        })
    },
    cash: function () {
        wx.navigateTo({
            url: '/pages/mercenary/cash/cash'
        })
    },
    newsList: function () {
        wx.navigateTo({
            url: '/pages/mercenary/newsList/newsList'
        })
    },
    feedback: function () {
        wx.navigateTo({
            url: '/pages/feedback/feedback'
        })
    },
    protocol: function () {
        wx.navigateTo({
            url: '/pages/protocol/protocol'
        })
    },
    help: function () {
        wx.navigateTo({
            url: '/pages/help/help'
        })
    },
    goMercenary: function () {
        wx.navigateTo({
            url: '/pages/employer/index/index'
        })
    }
})