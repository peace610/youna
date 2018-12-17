const util = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        school: '', // 学校
        surname: '', // 姓氏
        name: '', // 名字
        tel: '', //
        code: '', // 验证码
        codeFlag: false, // 验证码是否发送
        authCodeText: '获取验证码',
        typeCheck: '1', //  1男 0女
        card: '', // 身份证号码
        filePaths: '', //图片
        submitFilePaths: '',
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
    getCode: function () {
        var vm = this
        var session_id = wx.getStorageSync('session_id')
        var param = {
            session_id: session_id,
            phone: vm.data.tel
        }
        util.ajax('GET','/verification',param,(res) => {
            vm.setData({
                codeFlag: true
            })
            var i = 59
            vm.setData({
                authCodeText: `${i}s重新获取`
            })
            i--
            const counter = setInterval(() => {
                vm.setData({
                    authCodeText: `${i}s重新获取`
                })
                i--
                if (i < 0) {
                    clearInterval(counter)
                    vm.setData({
                        authCodeText: `获取验证码`,
                        codeFlag: false
                    })
                }
            }, 1000)
        })
    },
    card: function (e) {
        this.setData({
            card: e.detail.value
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
                        type: 0
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
    submitOrder: function (e) {
        var vm = this
        var data = vm.data
        var session_id = wx.getStorageSync('session_id')
        var user_id = wx.getStorageSync('user_id')
        var param = {
            session_id: session_id,
            post_vars: {
                user_id: user_id,
                school: data.school,
                first_name: data.surname,
                last_name: data.name,
                phone: data.tel,
                verification_code: data.code,
                gender: data.typeCheck,
                id_number: data.card,
                id_photo_path: data.submitFilePaths,
            }
        }
        util.ajax('PUT','/user',param,(res) => {
            if (res.data.deposit) {
                wx.switchTab({
                    url: '/pages/mercenary/index/index'
                })
            } else {
                wx.navigateTo({
                    url: '/pages/mercenary/cash/cash'
                })
            }

        })
    }
})