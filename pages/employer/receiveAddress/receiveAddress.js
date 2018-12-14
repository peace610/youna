const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      id: '',
      surname: '', // 姓氏
      name: '', // 名字
      tel: '', //
      areaArray: ['宿舍', '图书馆', '教学楼', '其它'],
      areaIndex: 0, // 送达区域
      typeCheck: '1', // 宿舍类型 1男 0女
      address: '', // 地址
      addressDetail: '', // 楼号
      defaultCheck: true, // 是否为默认地址
      location: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var vm = this
      var address = options && options.address
      var location = options && options.location
      var receiveAddress = options && options.receiveAddress
      var id = options && options.id
      if (id) {
          var param = {
              session_id: wx.getStorageSync('session_id'),
              id: id,
          }
          util.ajax('GET','/user/address',param,(res) => {
              var data= res.data
              var typeCheck = '1'
              var areaIndex = 0
              if (data.property == 0 || data.property == 1) {
                  areaIndex = 0
                  typeCheck = data.property
              } else {
                  areaIndex = parseInt(data.property) - 1
              }
              var receiveAddressInfo = receiveAddress? JSON.parse(receiveAddress) : {}
              vm.setData({
                  id: id,
                  surname: receiveAddressInfo.surname || data.first_name,
                  name: receiveAddressInfo.name || data.last_name,
                  tel: receiveAddressInfo.tel || data.phone,
                  areaIndex: receiveAddressInfo.areaIndex || areaIndex,
                  typeCheck: receiveAddressInfo.typeCheck || typeCheck,
                  address: address || data.first_address,
                  addressDetail: receiveAddressInfo.addressDetail || data.last_address,
                  defaultCheck: receiveAddressInfo.defaultCheck || data.default,
                  location: location ? JSON.parse(location) : {
                      lat: data.latitude,
                      lng: data.longitude,
                  }
              })
          })
      } else {
          if (address && location) {
              vm.setData({
                  address: address,
                  location: JSON.parse(location),
              })
          }
          if (receiveAddress) {
              var receiveAddress = JSON.parse(receiveAddress)
              vm.setData({
                  surname: receiveAddress.surname,
                  name: receiveAddress.name,
                  tel: receiveAddress.tel,
                  areaIndex: receiveAddress.areaIndex,
                  typeCheck: receiveAddress.typeCheck,
                  addressDetail: receiveAddress.addressDetail,
                  defaultCheck: receiveAddress.defaultCheck
              })
          }
      }

  },
    surname: function (e) {
        this.setData({
            surname: e.detail.value
        })
    },
    name: function (e) {
        this.setData({
            name: e.detail.value
        })
    },
    tel: function (e) {
        this.setData({
            tel: e.detail.value
        })
    },
    pickerChange: function(e) {
        this.setData({
            areaIndex: e.detail.value
        })
    },
    typeCheck: function (e) {
        var type = e.currentTarget.dataset.type
        this.setData({
            typeCheck: type
        })
    },
    addressSearch: function () {
        var data = this.data
        var  receiveAddress= {
            surname: data.surname,
            name: data.name,
            tel: data.tel,
            areaIndex: data.areaIndex,
            typeCheck: data.typeCheck,
            addressDetail: data.addressDetail,
            defaultCheck: data.defaultCheck
        }
        wx.navigateTo({
            url: '/pages/employer/addressSearch/addressSearch?type=receiveAddress&id='+data.id+'&receiveAddress='+JSON.stringify(receiveAddress)
        })
    },
    addressDetail: function (e) {
        this.setData({
            addressDetail: e.detail.value
        })
    },
    defaultCheck: function () {
        var defaultCheck = this.data.defaultCheck
        this.setData({
            defaultCheck : !defaultCheck
        })
    },
    submitOrder: function (e) {
        var data = this.data
        var id = data.id
        var property = 4
        if (data.areaIndex == 0) {
            property = data.typeCheck
        } else {
            property = parseInt(data.areaIndex) + 1
        }
        // 悠拿添加收货地址
        var param = {
            session_id: wx.getStorageSync('session_id'),
            post_vars: {
                user_id: wx.getStorageSync('user_id'),
                type: 1,
                property: property,
                shop_name: "",
                first_name: data.surname,
                last_name: data.name,
                phone: data.tel,
                first_address: data.address,
                last_address: data.addressDetail,
                latitude: data.location.lat,
                longitude: data.location.lng,
                default: data.defaultCheck
            }
        }
        var type = 'POST'
        if (id ) {
            param.post_vars.id = id
            type = 'PUT'
        }
        util.ajax(type,'/user/address',param,(res) => {
            wx.redirectTo({
                url: '/pages/employer/receiveAddressList/receiveAddressList'
            })
        })
    }
})