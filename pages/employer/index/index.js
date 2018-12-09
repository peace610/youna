const util = require('../../../utils/util.js')
//获取应用实例
const app = getApp()
Page({
  data: {
    count: 0,
    getAddress: {
        first_address: '',
    },
    receiveAddress: {
        first_address: '',
    },
    num: 1,
    des: '',
    price: 0.02
  },
  onLoad: function (options) {
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
          if (res.status == 200) {
              vm.setData({
                  count: res.data.count,
              })
          }

      })
      // 悠拿获取默认地址
      var param = {
          session_id: session_id,
          user_id: user_id,
      }
      util.ajax('GET','/user/address/default',param,(res) => {
          if (res.status == 200) {
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
          }
      })

      // 获取定位 到经纬度
      app.getFixed()
  },
    getAddress: function () {
        wx.navigateTo({
            url: '/pages/employer/getAddress/getAddress'
        })
    },
    receiveAddress: function () {
      var receiveAddress = this.data.receiveAddress
      var goUrl = '/pages/employer/receiveAddress/receiveAddress'
        if (receiveAddress.first_address) {
            goUrl = '/pages/employer/receiveAddressList/receiveAddressList'
        }
        wx.navigateTo({
            url: goUrl
        })
    },
    calculate : function () {
        var vm = this
        // 计算订单金额
        var session_id = wx.getStorageSync('session_id')
        var paramUser = {
            session_id: session_id,
            count: vm.data.num
        }
        util.ajax('GET','/order/actions/calculate',paramUser,(res) => {
            if (res.status == 200) {
                vm.setData({
                    price: res.data.amount,
                })
            }
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
    submitOrder: function () {
        var vm = this
        var data = vm.data
        // 获取在线人数
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
                description: data.des
            }
        }
        util.ajax('POST','/order',param,(res) => {
            var data = res.data
            if (res.status == 200) {
                wx.requestPayment(
                    {
                        timeStamp: data.timeStamp,
                        nonceStr: data.nonceStr,
                        package: data.package,
                        signType: data.signType,
                        paySign: data.paySign,
                        success: function(res){
                            setTimeout(() => {
                                wx.navigateTo({
                                    url: '/pages/employer/orderDetail/orderDetail?id='+data.id
                                })
                            },100)
                        },
                        fail: function(res){
                        },
                        complete: function(res){
                        }
                    })
            }
        })
    },
    scan: function () {
      wx.scanCode({
        success: (res) => {
          console.log(res)
        }
      })
    }
})