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
      this.getList()
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
        var receiveAddress = e.currentTarget.dataset.receiveAddress
        wx.navigateTo({
            url: '/pages/employer/index/index?receiveAddress='+JSON.stringify(receiveAddress)
        })
    },
    editAddress: function (e) {
        var id = e.currentTarget.dataset.id
        wx.redirectTo({
            url: '/pages/employer/receiveAddress/receiveAddress?id='+id
        })
    },
    delAddress: function (e) {
        var id = e.currentTarget.dataset.id
        var session_id = wx.getStorageSync('session_id')
        var param = {
            session_id: session_id,
            post_vars: {
                id: id
            }
        }
        util.ajax('DELETE','/user/address',param,(res) => {
            this.getList()
        })
    },
    receiveAddress: function () {
        wx.redirectTo({
            url: '/pages/employer/receiveAddress/receiveAddress'
        })
    }
})