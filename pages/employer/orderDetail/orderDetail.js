const util = require('../../../utils/util.js')
var  counter = 0
var  detailCounter = 0
Page({
    /**
     * 页面的初始数据
     */
    data: {
        id: '',
        showModalStatus: false,
        animationData: {},
        animationDataCar: {},
        priceItem: '',
        price: '',
        orderState: 0, // 0:未支付 1:未接单(等待同学接单)  2：已接单 3：配送中(同学已收到您的通知) 4：外卖已送达 5：订单完成 6:订单已取消
        orderDetail: {},
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
            vm.setData({
                orderState: data.state,
                orderDetail: data,
            })
            var currentTime = new Date().getTime() // 当前时间毫秒数
            if (data.state == 0 || data.state == 1) {
                var create_time = new Date((data.create_time).replace(/-/g,'/'));
                vm.setData({
                    timer: parseInt((currentTime - create_time.getTime()) / 1000, 10)
                })
                vm.countTime()
                counter = setInterval(() => {
                    vm.countTime()
                }, 1000)
            } else if (data.state == 3) {
                var distribution_time = new Date((data.distribution_time).replace(/-/g,'/'));
                vm.setData({
                    timer: parseInt((currentTime - distribution_time.getTime()) / 1000, 10)
                })
                vm.countTime()
                counter =  setInterval(() => {
                    vm.countTime()
                }, 1000)
                var animation = wx.createAnimation({
                    duration: 14000,
                    timingFunction: "linear",
                    delay: 0
                })
                vm.animation = animation
                animation.translateX(283).step()
                vm.setData({
                    animationDataCar: animation.export(),
                })
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
    cancelOrder: function () {
        var vm = this
        var id = vm.data.id
        wx.showModal({
            content: '正在拼命寻找空闲的同学\r\n真的不再等下嘛？',
            cancelText: '不等了',
            confirmText: '再等下',
            confirmColor: '#1ABFC0',
            success: function(res){
                if (res.confirm) {
                } else if (res.cancel) {
                    var param = {
                        session_id: wx.getStorageSync('session_id'),
                        post_vars: {
                            order_id: id,
                            user_id: wx.getStorageSync('user_id'),
                            description: '',
                        }
                    }
                    util.ajax('POST','/order/actions/cancle',param,(res) => {
                        vm.getOrderDetail()
                    })
                }
            }
        })
    },
    takeOrder: function () {
        var vm = this
        var id = vm.data.id
        var param = {
            session_id: wx.getStorageSync('session_id'),
            post_vars: {
                order_id: id,
                user_id: wx.getStorageSync('user_id'),
            }
        }
        util.ajax('POST','/order/actions/arrive',param,(res) => {
            vm.getOrderDetail()
        })
    },
    resetOrder: function () {
        wx.redirectTo({
            url: '/pages/employer/index/index'
        })
    },
    //显示对话框
    showModal: function () {
        // 显示遮罩层
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        })
        this.animation = animation
        animation.translateY(300).step()
        this.setData({
            animationData: animation.export(),
            showModalStatus: true
        })
        setTimeout(function () {
            animation.translateY(0).step()
            this.setData({
                animationData: animation.export()
            })
        }.bind(this), 200)
    },
    //隐藏对话框
    hideModal: function () {
        // 隐藏遮罩层
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        })
        this.animation = animation
        animation.translateY(300).step()
        this.setData({
            animationData: animation.export(),
        })
        setTimeout(function () {
            animation.translateY(0).step()
            this.setData({
                animationData: animation.export(),
                showModalStatus: false
            })
        }.bind(this), 200)
    },
    phoneCall: function (e) {
        wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.replyPhone,
            success: function () {
                console.log("成功拨打电话")
            },
        })
    },
    setPriceItem: function (e) {
        var priceItem = e.currentTarget.dataset.price
        this.setData({
            priceItem: priceItem,
            price: ''
        })
    },
    setPrice: function (e) {
        var price = e.detail.value
        if(price < 1 || price > 100 ) {
            wx.showToast({
                title: '请输入1-100的数字',
                icon: 'none'
            })
            this.setData({
                priceItem: ''
            })
        } else {
            this.setData({
                price: price,
                priceItem: price
            })
        }
    },
    submitPrice: function () {
        var vm = this
        var param = {
            session_id: wx.getStorageSync('session_id'),
            post_vars: {
                order_id: vm.data.id,
                amount: vm.data.price || vm.data.priceItem,
                descrpition: ''
            }
        }
        util.ajax('POST','/order/actions/addtip',param,(res) => {
            var data = res.data
            var vm = this
            wx.requestPayment(
                {
                    timeStamp: data.timeStamp,
                    nonceStr: data.nonceStr,
                    package: data.package,
                    signType: data.signType,
                    paySign: data.paySign,
                    success: function(res){
                        vm.getOrderDetail()
                    },
                    fail: function(res){
                    },
                    complete: function(res){
                        vm.hideModal()
                    }
                })
        })
    }
})