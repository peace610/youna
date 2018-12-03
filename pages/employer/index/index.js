//获取应用实例
const util = require('../../../utils/util.js')
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
    price: 2
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
              console.info(res.data.count,vm)
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
              }
              if (data.recive_address) {
                  vm.setData({
                      receiveAddress: data.recive_address
                  })
              }
          }
      })

      var getAddress = options && options.getAddress
      var receiveAddress = options && options.receiveAddress
      if (getAddress) {
          this.setData({
              getAddress: getAddress
          })
      }
      if (receiveAddress) {
          this.setData({
              receiveAddress: receiveAddress
          })
      }
      // 获取定位 到经纬度
      app.getFixed()
  },
    getAddress: function () {
        wx.navigateTo({
            url: '/pages/employer/getAddress/getAddress'
        })
    },
    receiveAddress: function () {
      // var goUrl = '/pages/receiveAddress/receiveAddress'
      var goUrl = '/pages/employer/receiveAddressList/receiveAddressList'
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
            count: vm.data.count
        }
        util.ajax('GET','/order/actions/calculate',paramUser,(res) => {
            vm.setdata({
                price: res.amount,
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
    submitOrder: function () {
        var vm = this
        var data = vm.data
        // 获取在线人数
        var session_id = wx.getStorageSync('session_id')
        var paramUser = {
            session_id: session_id,
            post_vars: {
                master_id: 1,
                tack_address: {
                    first_address: data.getAddress.first_address,
                    last_address: data.getAddress.last_address,
                    nick_name: data.getAddress.nick_name,
                    phone: data.getAddress.phone,
                    latitude: "纬度",
                    longitude: "经度"
                },
                recive_address: {
                    first_address: "收货地址(大致地址)",
                    last_address: "收货地址(详细地址)",
                    nick_name: "昵称2",
                    phone: "189xxxxxxxx",
                    latitude: "纬度",
                    longitude: "经度"
                },
                takeaway_state: 0,
                amount: data.count,
                description: data.des
            }
        }
        util.ajax('GET','/users',paramUser,(res) => {
            wx.navigateTo({
                url: '/pages/employer/orderDetail/orderDetail'
            })
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