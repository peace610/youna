const util = require('../../../utils/util.js')
Page({
    /**
     * 页面的初始数据
     */
    data: {
        showModalStatus: false,
        // orderState: 0, // 0:外卖还未送达指定地点 2：已接单 3：外卖已送达指定地点 4：订单已送达 0 3 4  6:订单已取消
        orderState: 0, // 0:未支付 1:未接单(等待同学接单)  2：已接单 3：配送中(同学已收到您的通知) 4：外卖已送达(订单完成) 6:订单已取消
        orderDetail: {},
        tel: '',
        code: '',
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var vm = this
        var id = options && options.id
        if (id) {
            vm.setData({
                id: id,
            })
            vm.getOrderDetail()
        }
    },
    getOrderDetail: function () {
        var vm = this
        var id = vm.data.id
        var param = {
            session_id: wx.getStorageSync('session_id'),
            order_id: id,
        }
        util.ajax('GET','/order',param,(res) => {
            var data = res.data
            var phone = data.recive_address.phone
            vm.setData({
                orderState: data.state,
                orderDetail: data,
                tel: phone.substr(phone.length-4)
            })
        })
    },
    phoneCall: function (e) {
        wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.replyPhone,
            success: function () {
                console.log("成功拨打电话")
            },
        })
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
        var vm = this
        var data = vm.data
        var param = {
            session_id: wx.getStorageSync('session_id'),
            post_vars: {
                order_id: data.id,
                user_id: wx.getStorageSync('user_id'),
                verification_code: data.code,
                description: '',
            }
        }
        util.ajax('POST','/order/actions/finish',param,(res) => {
            vm.getOrderDetail()
        })
    }
})