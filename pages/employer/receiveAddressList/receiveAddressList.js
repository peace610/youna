const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  onShow: function () {
    this.getList()
    wx.setStorageSync('receiveAddressListFlag', true)
  },
  onUnload: function () {
    if (wx.getStorageSync('receiveAddressListFlag')) {
      wx.navigateTo({
        url: '/pages/employer/index/index'
      })
    }
  },
    getList: function () {
        var vm = this
        var session_id = wx.getStorageSync('session_id')
        var user_id = wx.getStorageSync('user_id')
        var param = {
            session_id: session_id,
            user_id:user_id,
            type: 1,
            property:'',
            default: '',
            limit: 100,
            offset: 0,
        }
        util.ajax('GET','/user/addresses',param,(res) => {
            vm.setData({
                list: res.data.address_list,
            })
        })
    },
    goEmployer: function (e) {
      wx.setStorageSync('receiveAddressListFlag', false)
        var receiveAddress = e.currentTarget.dataset.receiveAddress
        wx.redirectTo({
            url: '/pages/employer/index/index?receiveAddress='+JSON.stringify(receiveAddress)
        })
    },
    editAddress: function (e) {
        wx.setStorageSync('receiveAddressListFlag', false)
        var id = e.currentTarget.dataset.id
        var goUrl = '/pages/employer/receiveAddress/receiveAddress?id='+id
        wx.setStorageSync('goAddressUrl', goUrl)
        wx.setStorageSync('receiveAddressFirst', false)
        wx.redirectTo({
            url: goUrl
        })
    },
    delAddress: function (e) {
        var vm = this
        var id = e.currentTarget.dataset.id
        var session_id = wx.getStorageSync('session_id')
        var param = {
            session_id: session_id,
            post_vars: {
                id: id
            }
        }
        wx.showModal({
            content: '是否确认要删除?',
            confirmColor: '#1ABFC0',
            success: function(res){
                if (res.confirm) {
                    util.ajax('DELETE','/user/address',param,(res) => {
                        vm.getList()
                    })
                } else if (res.cancel) {
                }
            }
        })
    },
    receiveAddress: function () {
        wx.setStorageSync('receiveAddressListFlag', false)
        var goUrl = '/pages/employer/receiveAddress/receiveAddress'
        wx.setStorageSync('goAddressUrl', goUrl)
        wx.setStorageSync('receiveAddressFirst', false)
        wx.redirectTo({
            url: goUrl
        })
    }
})