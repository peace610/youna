const util = require('../../../utils/util.js')
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
        orderState: 0, // 0:未支付 1:未接单(等待同学接单)  2：已接单 3：配送中(同学已收到您的通知) 4：外卖已送达(订单完成) 6:订单已取消
        orderDetail: {},
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
            if (res.status == 200) {
                vm.setData({
                    orderState: data.state,
                    orderDetail: data,
                })
                if (data.state == 3) {
                    var animation = wx.createAnimation({
                        duration: 14000,
                        timingFunction: "linear",
                        delay: 0
                    })
                    vm.animation = animation
                    animation.translateX(300).step()
                    vm.setData({
                        animationDataCar: animation.export(),
                    })
                }
            }
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
                        if (res.status == 200) {
                            vm.getOrderDetail()
                        }
                    })
                    console.log('用户点击取消')
                }
            }
        })
    },
    takeOrder: function () {

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
    setPriceItem: function (e) {
        var priceItem = e.currentTarget.dataset.price
        this.setData({
            priceItem: priceItem,
            price: ''
        })
    },
    setPrice: function (e) {
        var price = e.detail.value
        this.setData({
            price: price,
            priceItem: price
        })
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
            if (res.status == 200) {
                wx.requestPayment(
                    {
                        timeStamp: data.timeStamp,
                        nonceStr: data.nonceStr,
                        package: data.package,
                        signType: data.signType,
                        paySign: data.paySign,
                        success: function(res){},
                        fail: function(res){},
                        complete: function(res){}
                    })
            }
        })
    }
})