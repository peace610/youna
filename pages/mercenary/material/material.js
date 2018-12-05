Page({

    /**
     * 页面的初始数据
     */
    data: {
        school: '', // 学校
        surname: '', // 姓氏
        name: '', // 名字
        tel: '', //
        code: '', // 送达区域
        typeCheck: '1', // 宿舍类型 1男 2女
        card: '', // 身份证号码
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
    },
    school: function (e) {
        this.setData({
            school: e.detail.value
        })
    },
    surname: function (e) {
        this.setData({
            surname: e.detail.value
        })
    },
    name: function (e) {
        this.setData({
            name: e.detail.value
        })
    },
    tel: function (e) {
        this.setData({
            tel: e.detail.value
        })
    },
    code: function (e) {
        this.setData({
            code: e.detail.value
        })
    },
    typeCheck: function (e) {
        var type = e.currentTarget.dataset.type
        this.setData({
            typeCheck: type
        })
    },
    card: function (e) {
        this.setData({
            card: e.detail.value
        })
    },
    submitOrder: function (e) {
        var address = e.currentTarget.dataset.address
        var addressDetail = e.currentTarget.dataset.addressDetail
        wx.redirectTo({
            url: '/pages/mercenary/uploadCard/uploadCard'
        })
    }
})