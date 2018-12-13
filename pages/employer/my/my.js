const util = require('../../../utils/util.js')
//获取应用实例
const app = getApp()
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
    orderList: function () {
        wx.navigateTo({
            url: '/pages/employer/orderList/orderList'
        })
    },
    newsList: function () {
        wx.navigateTo({
            url: '/pages/employer/newsList/newsList'
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
        wx.switchTab({
            url: '/pages/mercenary/index/index'
        })
    }
})