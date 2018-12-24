
const url = require('../../../config.js')
const sendAjax = require('../../../utils/sendAjax.js')
Page({
  data: {
    luckyList: []
  },
  onLoad(o) {
    console.log(o)
    var luckyList = JSON.parse(o.luckyList)
    this.setData({
      luckyList
    })
  },
  goluckyDetail() {

  },
  onShow: function () {

  }
});