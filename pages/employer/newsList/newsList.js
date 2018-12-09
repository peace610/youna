const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    offset: 0,
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNews()
  },
    getNews: function () {
        var vm = this
        // 悠拿获取在线人数
        var session_id = wx.getStorageSync('session_id')
        var user_id = wx.getStorageSync('user_id')
        var param = {
            session_id: session_id,
            user_id: user_id,
            type: '',
            limit:5,
            offset: vm.data.offset,
        }
        util.ajax('GET','/user/messages',param,(res) => {
            vm.setData({
                offset: vm.data.offset + 5,
                list: vm.data.list.concat(res.data.message_list),
            })
        })
    },
    onReachBottom: function () {
        this.getNews()
    }
})