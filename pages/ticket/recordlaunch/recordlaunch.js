
const url = require('../../../config.js')
const sendAjax = require('../../../utils/sendAjax.js')
Page({
  data: {
    launchList: []
  },
  onLoad(o) {
    console.log(o)
    var launchList = JSON.parse(o.launchList)
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
        url: '/luck/contentByPrize',
        type: 'GET',
        data: {
          prizeId
        },
        header: {
          'content-type': 'application/json',
        },
      }
      let infoCb = {}
      infoCb.success = function (res) {
        console.log(res);
        
        wx.navigateTo({
          url:'../ticketmydetail/ticketmydetail?myDetail='+JSON.stringify(res)
        })
      }

      sendAjax(infoOpt, infoCb, () => {
      });
    




  },
  onShow: function () {

  }
});