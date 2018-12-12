const util = require('../../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
      offset: 0,
      list: [],
      state: ['未支付', '未接单', '已接单', '订单等待送达', '已送达', '已送达', '已取消'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
    onShow: function () {
        this.setData({
            offset: 0,
            list: [],
        })
        this.getOrder()
    },
    getOrder: function () {
        var vm = this
        var session_id = wx.getStorageSync('session_id')
        var user_id = wx.getStorageSync('user_id')
        var paramUser = {
            session_id: session_id,
            master_id: '',
            slave_id: user_id,
            state: '',
            limit:5,
            offset: vm.data.offset,
        }
        util.ajax('GET','/orders',paramUser,(res) => {
            vm.setData({
                offset: vm.data.offset + 5,
                list: vm.data.list.concat(res.data.order_list),
            })
        })
    },
    onReachBottom: function () {
        this.getOrder()
    }
})