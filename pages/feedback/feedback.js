const util = require('../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        des: '',
        filePaths: '',
        submitFilePaths: '',
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
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success (res) {
                const filePaths = res.tempFilePaths
                vm.setData({
                    filePaths: filePaths[0]
                })
                wx.uploadFile({
                    url: 'https://hdzhang.xyz/api/upload',
                    filePath: filePaths[0],
                    name: 'file',
                    header: {
                        'content-type': 'multipart/form-data',
                    },
                    formData: {
                        session_id: wx.getStorageSync('session_id'),
                        user_id: wx.getStorageSync('user_id'),
                        type: 1
                    },
                    success (res){
                        var resData = JSON.parse(res.data)
                        var data = resData.data
                        if (resData.status == 200) {
                            wx.showToast({
                                title: '上传成功',
                                icon: 'none'
                            })
                            vm.setData({
                                submitFilePaths: data.path
                            })
                        }
                    }
                })
            }
        })
    },
    submitOrder: function () {
        var vm = this
        var data = vm.data
        var param = {
            session_id: wx.getStorageSync('session_id'),
            post_vars: {
                user_id: wx.getStorageSync('user_id'),
                context: data.des,
                path: data.submitFilePaths,
                contact: data.tel
            }
        }
        util.ajax('POST','/user/actions/suggestion',param,(res) => {
            wx.showToast({
                title: res.message,
                icon: 'none',
                complete: function () {
                    setTimeout(() => {
                        wx.navigateBack()
                    },1000)
                }
            })

        })
    }
})