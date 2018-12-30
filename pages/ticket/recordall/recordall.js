
const url = require('../../../config.js')
const sendAjax = require('../../../utils/sendAjax.js')
Page({
    data: {
      joinList:[]
    },
    onLoad(o){
      console.log(o)
      var joinList = JSON.parse(o.joinList)
      this.setData({
        joinList
      })
    },
  gojoinDetail(e){

    console.log(e.currentTarget.dataset.id)
    var index = e.currentTarget.dataset.id
    console.log(index)
    var that = this
    var joinList = that.data.joinList
    var prizeId = joinList[index].id
    let infoOpt = {
      url: '/luck/luckDetails',
      type: 'GET',
      data: {
        luckId: prizeId
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
        url: '../ticketmydetail/ticketmydetail?my=' + my
      })
    }

    sendAjax(infoOpt, infoCb, () => {
    });



  },
    onShow: function() {
        
    }
});