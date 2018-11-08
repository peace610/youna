Page({

  /**
   * 页面的初始数据
   */
  data: {
      surname: '', // 姓氏
      name: '', // 名字
      tel: '', //
      areaArray: ['宿舍', '图书馆', '教学楼', '其它'],
      areaIndex: 0, // 送达区域
      typeCheck: '1', // 宿舍类型 1男 2女
      address: '', // 地址
      addressDetail: '', // 楼号
      defaultCheck: false, // 是否为默认地址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var address = options && options.address
      if (address) {
          this.setData({
              address: address
          })
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
        wx.redirectTo({
            url: '/pages/employer/addressSearch/addressSearch?type=receiveAddress'
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
        var address = e.currentTarget.dataset.address
        var addressDetail = e.currentTarget.dataset.addressDetail
        console.info(address,addressDetail)
        wx.redirectTo({
            url: '/pages/employer/receiveAddressList/receiveAddressList?address='+address+'&addressDetail='+addressDetail
        })
    }
})