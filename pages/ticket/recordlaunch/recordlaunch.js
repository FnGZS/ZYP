
const url = require('../../../config.js')
const sendAjax = require('../../../utils/sendAjax.js')
Page({
  data: {
    launchList: []
  },
  onLoad(o) {
    console.log(o)
    var launchList = JSON.parse(o.launchList)
    console.log(launchList)
    this.setData({
      launchList
    })
  },
  golaunchDetail(e) {
    console.log(e.currentTarget.dataset.id)
    var index = e.currentTarget.dataset.id
    var that = this
    var launchList = that.data.launchList
    console.log(launchList[index].id)
    var prizeId = launchList[index].id
      let infoOpt = {
        url: '/luck/luckDetails',
        type: 'GET',
        data: {
          luckId:prizeId
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
          url:'../ticketmydetail/ticketmydetail?my=' + my +"&&name="+"我是男神"
        })
      }

      sendAjax(infoOpt, infoCb, () => {
      });
    




  },
  onShow: function () {

  }
});