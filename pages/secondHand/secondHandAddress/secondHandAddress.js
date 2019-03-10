const url = require('../../../config.js')
const sendAjax = require('../../../utils/sendAjax.js')
Page({
  data: {
    userId:null,
    addressList:[]
  },
  onLoad: function (options) {
   
  },
  onShow: function () {
    if (wx.getStorageSync('userinfo').isbound != 1) {
      wx.showModal({
        title: '提示',
        content: '请先绑定学号后再进行操作',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../../user/binding/binding',
            })
          }
        }
      })
    }else{
      var userId = wx.getStorageSync('userinfo').userId;
      this.setData({
        userId: userId
      })
      this.getAddressList();
    }
  },
  //获取用户的地址
  getAddressList:function(){
    var userId = this.data.userId;
    var that = this;
    let infoOpt = {
      url: '/secondary/userAddress/' + userId,
      type: 'GET',
      data: {},
      header: {
        'content-type': 'application/json',
      },
    }
    let infoCb = {}
    infoCb.success = function (res) {
      console.log(res);
      that.setData({
        addressList: res.list
      })
    }
    infoCb.beforeSend = () => { }
    sendAjax(infoOpt, infoCb, () => { });
  },
  //新增地址
  toAddAddress:function(){
    wx.navigateTo({
      url: '../secondHandAddressAdd/secondHandAddressAdd',
    })
  },
  //修改地址
  toAddressEdit:function(e){
    console.log(e)
    var detail = JSON.stringify(e.currentTarget.dataset.detail) ;
    wx.navigateTo({
      url: '../secondHandAddressEdit/secondHandAddressEdit?detail=' + detail,
    })
  },
  onReady: function () {
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