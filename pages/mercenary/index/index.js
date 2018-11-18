Page({
  data: {
    flagCertif: true,
      listS: [],
    list: [{
      name: '弄堂里',
        address: '浙江工业大学之江校区北门校区北门',
        price: 3,
    }, {
        name: '弄堂里1',
        address: '浙江工业大学之江校区北门校区北门江工业大学之江校区北门',
        price: 3,
    }, {
        name: '弄堂里2',
        address: '浙江工业大学之江校区北门校区北门',
        price: 33,
    }],
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
  },
  onLoad: function () {
  }
})