const util = require('../../../utils/util.js')
Page({
    /**
     * 页面的初始数据
     */
    data: {
        showModalStatus: false,
        // orderState: 0, // 0:外卖还未送达指定地点 2：已接单 3：外卖已送达指定地点 4：订单已送达 0 3 4  6:订单已取消
        orderState: 0, // 0:未支付 1:未接单(等待同学接单)  2：已接单 3：配送中(同学已收到您的通知) 4：外卖已送达 5：订单完成 6:订单已取消
        orderDetail: {},
        tel: '',
        code: '',
        counter: 0,
        time: 0,
        timeStr: '',
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
    onUnload: function () {
        this.clearCount()
    },
    getOrderDetail: function () {
        var vm = this
        var id = vm.data.id
        vm.clearCount()
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
            if (data.state == 3) {
                var distribution_time = new Date(res.data.distribution_time);
                vm.setData({
                    time: distribution_time.getTime(),
                })
                vm.countTime()
                vm.setData({
                    counter: setInterval(() => {
                        vm.countTime()
                    }, 1000)
                })
            }
        })
    },
    countTime: function () {
        var time = this.data.time;
        var date = new Date(time);
        var h = parseInt(date.getHours(),10);
        var m = parseInt(date.getMinutes(),10);
        var s = parseInt(date.getSeconds(),10);
        this.setData({
            time : ( time/1000 + 1 ) * 1000,
            timeStr: (h >= 10 ? h : '0'+ h) + ':' + (m >= 10 ? m : '0'+ m) + ':' + (s >= 10 ? s : '0'+ s)
        })
    },
    clearCount: function () {
        clearInterval(this.data.counter)
        this.setData({
            time : 0,
            timeStr: ''
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
            this.setData({
                showModalStatus: false,
            })
            vm.getOrderDetail()
        })
    }
})