Page({
  data: {
  },
  onLoad: function (options) {
  },
  backSec:function(){
    wx.reLaunch({
      url: '../secondHand',
    })
  },
  toOrder:function(){
    wx.navigateTo({
      url: '../secondHandOrderBought/secondHandOrderBought',
    })
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