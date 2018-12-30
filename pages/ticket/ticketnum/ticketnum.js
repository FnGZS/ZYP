var app = getApp();
const url = require('../../../config.js')
const sendAjax = require('../../../utils/sendAjax.js')
Page({
    data: {},
    onLoad: function(a) {
      var t = a.luckId;
        this.setData({
          luckId: t
        });
    },
    onShow: function() {
      var t = this, a = t.data.luckId;
      let infoOpt = {
        url: '/luck/luckPartake',
        type: 'GET',
        data: {
          luckId: a,
            pageNo:1,
            pageSize:1000
        },
        header: {
          'content-type': 'application/json',
        },
      }
      let infoCb = {}
      infoCb.success = function (res) {
        console.log(res);
        t.setData({
          canyuList:res
        })
      }

      sendAjax(infoOpt, infoCb, () => {
      });
    }
});