const util = require('../../../utils/util.js')
//获取应用实例
const app = getApp()
Page({
  data: {
      offset: 0,
    flagCertif: false,
    list: [],
    imgUrls: [],
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    fixedText: '',
  },
    onLoad: function (options) {
    },
    onShow: function () {
        var vm = this
        app.getFixed()
        vm.setData({
            offset: 0,
            list: [],
            fixedText: wx.getStorageSync('fixedText')
        })
        var session_id = wx.getStorageSync('session_id')
        var user_id = wx.getStorageSync('user_id')
        var paramBanner = {
            session_id: session_id
        }
        var param = {
            session_id: session_id,
            user_id: user_id
        }
        util.ajax('GET','/adbanner',paramBanner,(res) => {
            vm.setData({
                imgUrls: res.data
            })
        })
        util.ajax('GET','/user',param,(res) => {
            vm.setData({
                flagCertif: res.data.state == 2 ? true : false
            })
        })
        this.getList()
    },
    getList: function () {
        var vm = this
        var session_id = wx.getStorageSync('session_id')
        var user_id = wx.getStorageSync('user_id')
        var param = {
            session_id: session_id,
            user_id: user_id,
            longitude: wx.getStorageSync('longitude'),
            latitude: wx.getStorageSync('latitude'),
            limit:5,
            offset: vm.data.offset,
        }
        util.ajax('GET','/orders/actions/suggest',param,(res) => {
            vm.setData({
                offset: vm.data.offset + 5,
                list: vm.data.list.concat(res.data.order_list),
            })
        })
    },
    onReachBottom: function () {
        this.getList()
    },
    getOrder: function (e) {
        var vm = this
        if (vm.data.flagCertif) {
            var id = e.currentTarget.dataset.id
            var session_id = wx.getStorageSync('session_id')
            var user_id = wx.getStorageSync('user_id')
            var param = {
                session_id: session_id,
                post_vars: {
                    user_id: user_id,
                    order_id: id
                }
            }
            util.ajax('POST','/order/actions/accept',param,(res) => {
                wx.navigateTo({
                    url: '/pages/mercenary/orderDetail/orderDetail?id='+id
                })
            })
        } else {
            wx.navigateTo({
                url: '/pages/mercenary/material/material'
            })
        }
    }
})