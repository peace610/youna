const util = require('../../../utils/util.js')
//获取应用实例
const app = getApp()
Page({
  data: {
    offset: 0,
    loading: true,
    flagCertif: false,
    deposit: false,
    list: [],
    imgUrls: [],
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    fixedText: '',
    fixFlag: false,
  },
    onLoad: function (options) {
    },
    onShow: function () {
        var vm = this
        if (!wx.getStorageSync('user_id')) {
            // 登录
            wx.login({
                success: res => {
                    // 悠拿登录
                    var param = {
                        post_vars: {
                            appid: 'wx002b7e790dfa4a25',
                            secret: '561d8379e6c830ca0ad282d48810ec61',
                            js_code: res.code
                        }
                    }
                    util.ajax('POST','/login',param,(res) => {
                        var data = res.data
                        wx.setStorageSync('session_id',data.session_id);
                        wx.setStorageSync('user_id',data.user_id);
                        var param_user = {
                            session_id: data.session_id,
                            post_vars: {
                                user_id: data.user_id,
                                user_info: JSON.stringify(app.globalData.userInfo),
                                raw_data: "",
                                signature: "",
                                encrypted_data: "",
                                iv: ""
                            }
                        }
                        // 悠拿用户注册
                        util.ajax('POST','/user',param_user, (res) => {
                            vm.init()
                        })
                    })
                    // 发送 res.code 到后台换取 openId, sessionKey, unionId
                }
            })
        } else {
            vm.init()
        }

    },
    init: function () {
        var vm = this
        vm.setData({
            offset: 0,
            loading: true,
            list: [],
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
                flagCertif: res.data.state == 2 ? true : false,
                deposit: res.data.deposit
            })
        })
        // 获取定位 到经纬度
        app.getFixed(function () {
            // 获取成功
            vm.setData({
                fixedText: wx.getStorageSync('fixedText'),
                fixFlag: true
            })
            vm.getList()
        }, function () {
            // 获取失败
            vm.setData({
                loading: false
            })
        })
    },
    onShareAppMessage(res) {
      if (res.from === 'button') {
        // 来自页面内转发按钮
        console.log(res.target)
      }
      return {
        title: '悠拿',
        path: '/pages/index/index'
      }
    },
    resetFixed: function () {
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

                }
            }
        })
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
                loading: false
            })
        })

    },
    onReachBottom: function () {
        this.getList()
    },
    getOrder: function (e) {
        var vm = this
        if (vm.data.flagCertif && vm.data.deposit) {
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
            if (!vm.data.flagCertif) {
                wx.navigateTo({
                    url: '/pages/mercenary/material/material'
                })
            } else if (vm.data.flagCertif && !vm.data.deposit) {
                wx.navigateTo({
                    url: '/pages/mercenary/cash/cash'
                })
            }

        }
    }
})