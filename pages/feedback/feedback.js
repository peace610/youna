Page({

    /**
     * 页面的初始数据
     */
    data: {
        des: '',
        tempFilePaths: '',
        tel: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    des: function (e) {
        this.setData({
            des: e.detail.value
        })
    },
    setTel: function (e) {
        this.setData({
            tel: e.detail.value
        })
    },
    uploadImg: function () {
        const vm = this
        wx.chooseImage({
            count: 1,
            // sizeType: ['original', 'compressed'],
            // sourceType: ['album', 'camera'],
            success (res) {
                console.info(res)
                const tempFilePaths = res.tempFilePaths
                vm.setData({
                    tempFilePaths: tempFilePaths.join(','),
                })
                // wx.uploadFile({
                //     url: 'https://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
                //     filePath: tempFilePaths[0],
                //     name: 'file',
                //     formData: {
                //         'user': 'test'
                //     },
                //     success (res){
                //         const data = res.data
                //         //do something
                //     }
                // })
            }
        })
    },
    submitOrder: function () {
        wx.redirectTo({
            url: '/pages/mercenary/cash/cash'
        })
    }
})