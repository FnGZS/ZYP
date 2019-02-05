const url = require('../../../config.js')
const sendAjax = require('../../../utils/sendAjax.js')
Page({
  data: {
    id:null,
    detail:null
  },
  onLoad: function (options) {
    // var id = options.id;
    var id = 1;
    this.setData({
      id:id
    })
    this.getMesDetail();
  },
  getMesDetail:function(){
    var that = this;
    var id = this.data.id;
    let infoOpt = {
      url: '/secondary/violationDetail/' + id,
      type: 'GET',
      data: {},
      header: {
        'content-type': 'application/json',
        'authorization': wx.getStorageSync('userinfo').authorization
      },
    }
    let infoCb = {}
    infoCb.success = function (res) {
      console.log(res);
    }
    infoCb.beforeSend = () => { }
    sendAjax(infoOpt, infoCb, () => { });
  },
  onReady: function () {
  },
  onShow: function () {
  },
  onHide: function () {
  },
  onUnload: function () {
  },
  onPullDownRefresh: function () {
  },
  onReachBottom: function () {
  },
  onShareAppMessage: function () {
  }
})