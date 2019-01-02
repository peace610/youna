const util = require('../../../utils/util.js')
var  counter = 0
var  detailCounter = 0
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
        timer: 0,
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
            detailCounter = setInterval(()=> {
                vm.getOrderDetail()
            },1000*30)
        }
    },
    onUnload: function () {
        clearInterval(detailCounter)
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
            var currentTime = new Date().getTime() // 当前时间毫秒数
            if (data.state == 3) {
                var distribution_time = new Date((data.distribution_time).replace(/-/g,'/'));
                vm.setData({
                    timer: parseInt((currentTime - distribution_time.getTime()) / 1000, 10)
                })
                vm.countTime()
                counter =  setInterval(() => {
                    vm.countTime()
                }, 1000)
            }
        })
    },
    countTime: function () {
        var timer = this.data.timer;
        var h = parseInt(timer / 60 / 60 % 24, 10) // 计算小时数
        var m = parseInt(timer / 60 % 60, 10) // 计算分钟数
        var s = parseInt(timer % 60, 10) // 计算秒数
        this.setData({
            timer : timer + 1,
            timeStr: (h >= 10 ? h : '0'+ h) + ':' + (m >= 10 ? m : '0'+ m) + ':' + (s >= 10 ? s : '0'+ s)
        })
    },
    clearCount: function () {
        clearInterval(counter)
        this.setData({
            timer : 0,
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