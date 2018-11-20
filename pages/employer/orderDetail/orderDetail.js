Page({
    /**
     * 页面的初始数据
     */
    data: {
        showModalStatus: false,
        animationData: {},
        animationDataCar: {},
        priceItem: '',
        price: '',
        orderState: 0, // 0:等待同学接单 1:订单已取消 2：已接单 3：同学已收到您的通知 4：外卖已送达
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (this.data.orderState == 3) {
            var animation = wx.createAnimation({
                duration: 14000,
                timingFunction: "linear",
                delay: 0
            })
            this.animation = animation
            animation.translateX(300).step()
            this.setData({
                animationDataCar: animation.export(),
            })
        }
    },
    cancelOrder: function () {
        var vm = this
        wx.showModal({
            content: '正在拼命寻找空闲的同学\r\n真的不再等下嘛？',
            cancelText: '不等了',
            confirmText: '再等下',
            confirmColor: '#1ABFC0',
            success: function(res){
                if (res.confirm) {
                    console.log('用户点击确定')
                } else if (res.cancel) {
                    vm.setData({
                        orderState: 1
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
        console.info(priceItem,111)
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
        
    }
})