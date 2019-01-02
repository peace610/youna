const util = require('../../../utils/util.js')
//获取应用实例
const app = getApp()
Page({
  data: {
    options: {},
    count: 0,
    getAddress: {
        first_address: '',
    },
    receiveAddress: {
        first_address: '',
    },
    num: 1,
    des: '',
    price: 0,
    balance: 0,
    wx_amount: 0,
    showModalStatus: false,
    showAreaStatus: false,
    animationData: {},
  },
    onLoad: function (options) {
      this.setData({
        options: options
      })
    },
    onShow: function () {
        var vm = this
      // console.info(getCurrentPages(),111)
        var options = vm.data.options
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
                            vm.init(options)
                        })
                    })
                    // 发送 res.code 到后台换取 openId, sessionKey, unionId
                }
            })
        } else {
            vm.init(options)
        }
  },
    init: function (options) {
        var vm = this
        // 悠拿获取在线人数
        var session_id = wx.getStorageSync('session_id')
        var user_id = wx.getStorageSync('user_id')
        var paramUser = {
            session_id: session_id,
            state: '',
            status: '',
            limit:5,
            offset: 0,
        }
        util.ajax('GET','/users',paramUser,(res) => {
            vm.setData({
                count: res.data.count,
            })
        })
        // 悠拿获取默认地址
        var param = {
            session_id: session_id,
            user_id: user_id,
        }
        util.ajax('GET','/user/address/default',param,(res) => {
            var data = res.data
            if (data.tack_address) {
                vm.setData({
                    getAddress: data.tack_address,
                })
            } else {
                vm.setData({
                    getAddress: {
                        first_address: '',
                    },
                })
            }
            var receiveAddress = options && options.receiveAddress
            if (receiveAddress) {
                vm.setData({
                    receiveAddress: JSON.parse(receiveAddress)
                })
            } else if (data.recive_address) {
                vm.setData({
                    receiveAddress: data.recive_address
                })
            } else {
                vm.setData({
                    receiveAddress: {
                        first_address: '',
                    }
                })
            }
        })

        // 获取定位 到经纬度
        app.getFixed()
        // 计算金额
        this.calculate()
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
    getAddress: function () {
      var getAddress = this.data.getAddress.first_address ? JSON.stringify(this.data.getAddress) : ''
      var goUrl = '/pages/employer/getAddress/getAddress?goIndex="index"&getAddress=' + getAddress
      wx.setStorageSync('goAddressUrl', goUrl)
      wx.redirectTo({
        url: goUrl
        })
    },
    receiveAddress: function () {
      var receiveAddress = this.data.receiveAddress
      var goUrl = '/pages/employer/receiveAddress/receiveAddress'
      wx.setStorageSync('goAddressUrl', goUrl)
      wx.setStorageSync('receiveAddressFirst', true)
      if (receiveAddress.first_address) {
        wx.setStorageSync('receiveAddressFirst', false)
        goUrl = '/pages/employer/receiveAddressList/receiveAddressList'
      }
      wx.redirectTo({
            url: goUrl
        })
    },
    areaDec: function () {
        wx.navigateTo({
            url: '/pages/employer/areaDec/areaDec'
        })
    },
    calculate : function () {
        var vm = this
        // 计算订单金额
        var session_id = wx.getStorageSync('session_id')
        var user_id = wx.getStorageSync('user_id')
        var paramUser = {
            session_id: session_id,
            user_id: user_id,
            count: vm.data.num
        }
        util.ajax('GET','/order/actions/calculate',paramUser,(res) => {
            vm.setData({
                price: res.data.amount,
                balance: res.data.balance,
                wx_amount: res.data.wx_amount,
            })
        })
    },
    subtractNum: function () {
        var num = this.data.num
        if (num > 1) {
            num--
            this.setData({
                num: num
            })
        }
        this.calculate()
    },
    addNum: function () {
        var num = this.data.num
        num++
        this.setData({
            num: num
        })
        this.calculate()
    },
    des: function (e) {
        this.setData({
            des: e.detail.value
        })
    },
    //显示对话框
    showModal: function () {
        // 显示遮罩层
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        })
        this.animation = animation
        animation.translateY(300).step()
        this.setData({
            animationData: animation.export(),
            showModalStatus: true
        })
        setTimeout(function () {
            animation.translateY(0).step()
            this.setData({
                animationData: animation.export(),
                showAreaStatus: true
            })
        }.bind(this), 200)
    },
    //隐藏对话框
    hideModal: function () {
        // 隐藏遮罩层
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        })
        this.animation = animation
        animation.translateY(300).step()
        this.setData({
            animationData: animation.export(),
            showAreaStatus: false
        })
        setTimeout(function () {
            animation.translateY(0).step()
            this.setData({
                animationData: animation.export(),
                showModalStatus: false
            })
        }.bind(this), 200)
    },
    submitOrder: function () {
        var vm = this
        var data = vm.data
        var wx_amount = data.wx_amount
        var session_id = wx.getStorageSync('session_id')
        var user_id = wx.getStorageSync('user_id')
        var param = {
            session_id: session_id,
            post_vars: {
                master_id: user_id,
                tack_address_id: vm.data.getAddress.id,
                recive_address_id: vm.data.receiveAddress.id,
                takeaway_state: 0,
                amount: data.price,
                count: data.num,
                description: data.des
            }
        }
        util.ajax('POST','/order',param,(res) => {
            var data = res.data
            if (parseFloat(wx_amount)) {
                wx.requestPayment(
                    {
                        timeStamp: data.timeStamp,
                        nonceStr: data.nonceStr,
                        package: data.package,
                        signType: data.signType,
                        paySign: data.paySign,
                        success: function(res){
                            vm.goOrderDetail(data.id)
                        },
                        fail: function(res){
                        },
                        complete: function(res){
                        }
                    })
            } else {
                vm.goOrderDetail(data.id)
            }
        })
    },
    goOrderDetail: function (id) {
        this.hideModal()
        setTimeout(() => {
            wx.navigateTo({
                url: '/pages/employer/orderDetail/orderDetail?id='+id
            })
        },100)
    },
    scan: function () {
      wx.scanCode({
        success: (res) => {
          console.log(res)
        }
      })
    }
})