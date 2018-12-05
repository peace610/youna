const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    state: ['未支付', '未接单', '已接单', '配送中', '已送达', '', '已取消'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var vm = this
      // 悠拿获取在线人数
      var session_id = wx.getStorageSync('session_id')
      var user_id = wx.getStorageSync('user_id')
      var paramUser = {
          session_id: session_id,
          user_id: user_id,
          state: '',
          limit:5,
          offset: 0,
      }
      util.ajax('GET','/orders',paramUser,(res) => {
          if (res.status == 200) {
              vm.setData({
                list: res.data.order_list,
              })
          }

      })
  }
})