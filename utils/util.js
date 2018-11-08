const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

// 接口请求
const ajax = (Type, url, params, successFun, failFun, completeFun) => {
    // 默认数据传输格式
    var methonType = 'application/json'
    // 访问主域名
    var https = 'https://hdzhang.xyz/api'
    if (Type === 'PUT') {
        var p = Object.keys(params).map(function (key) {
            return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
        }).join("&");
        url += '?' + p;
        params = {}
    } else if (Type == "POST") {
        methonType = "application/x-www-form-urlencoded"
    }
    // 请求接口
    wx.request({
        url: https + url,
        method: Type,
        header: {
            'content-type': methonType,
        },
        data: params,
        // 成功回调
        success: res => {
        successFun(res)
    },
        // 错误回调
        fail: (res) => {
        if (failFun) {
            failFun(res)
        }
    },
    // 接口调用结束的回调函数
    complete: (res) => {
        if (completeFun) {
            completeFun(res)
        }
    }
})
}

module.exports = {
    formatTime: formatTime,
    ajax: ajax
}
