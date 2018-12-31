
const url = require('../../../config.js')
const sendAjax = require('../../../utils/sendAjax.js')
Page({
  data: {
    luckyList: []
  },
  onLoad(o) {
    
    var luckyList = JSON.parse(o.luckyList)
    // console.log(luckyList)
    this.setData({
      luckyList
    })
  },
  goluckyDetail(e) {
    // console.log(e.currentTarget.dataset.id)
    var index = e.currentTarget.dataset.id
    var that = this
    var luckyList = that.data.luckyList
    // console.log(luckyList[index].id)
    var luckId = luckyList[index].luckDrawId
    var win = luckyList[index]
    var winList = encodeURIComponent(JSON.stringify(win));

    // console.log(winList)
    let infoOpt = {
      url: '/luck/luckDetails',
      type: 'GET',
      data: {
        luckId
      },
      header: {
        'content-type': 'application/json',
      },
    }
    let infoCb = {}
    infoCb.success = function (res) {
      console.log(res);
      var my = encodeURIComponent(JSON.stringify(res));
      wx.navigateTo({
        url: '../ticketmydetail/ticketmydetail?my=' + my + "&&winList=" + winList
      })
    }

    sendAjax(infoOpt, infoCb, () => {
    });
  },
  onShow: function () {

  }
});