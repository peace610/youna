Page({
  /**
   * 页面的初始数据
   */
  data: {
      showModalStatus: false,
      orderState: 3, // 0:外卖还未送达指定地点 1:订单已取消 2：已接单 3：外卖已送达指定地点 4：订单已送达 0 3 4
      code: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
    setCode: function (e) {
        this.setData({
            code: e.detail.value,
        })
    },
    confirmGet: function () {
        this.setData({
            showModalStatus: true,
        })
    },
    hideCode: function () {
        this.setData({
            showModalStatus: false,
        })
    },
    submitCode: function () {

    }
})