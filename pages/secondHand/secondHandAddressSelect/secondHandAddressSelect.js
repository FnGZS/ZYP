const url = require('../../../config.js')
const sendAjax = require('../../../utils/sendAjax.js')
Page({
  data: {
    userId: null,
    addressList: []
  },
  onLoad: function (options) {
    var userId = wx.getStorageSync('userinfo').userId;
    this.setData({
      userId: userId
    })
    this.getAddressList();
  },
  //获取用户的地址
  getAddressList: function () {
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
      // console.log(res);
      that.setData({
        addressList: res.list
      })
    }
    infoCb.beforeSend = () => { }
    sendAjax(infoOpt, infoCb, () => { });
  },
  //新增地址
  toAddAddress: function () {
    wx.navigateTo({
      url: '../secondHandAddressAdd/secondHandAddressAdd',
    })
  },
  //修改地址
  toAddressEdit: function (e) {
    console.log(e)
    var detail = JSON.stringify(e.currentTarget.dataset.detail);
    wx.navigateTo({
      url: '../secondHandAddressEdit/secondHandAddressEdit?detail=' + detail,
    })
  },
  //确认地址
  confirmAddress:function(e){
    var detail = e.currentTarget.dataset.detail;
    var addressId = detail.id;
    var address = detail.address;
    var phone = detail.telephone;
    var name = detail.name;
    let pages = getCurrentPages();//当前页面
    let prevPage = pages[pages.length - 2];//上一页面
    prevPage.setData({//直接给上移页面赋值
      addressId: addressId,
      address: address,
      addressPhone: phone,
      addressName: name,
      isSelect:1
    });
    wx.navigateBack({//返回
      delta: 1
    })
  },
  onReady: function () {
  },
  onShow: function () {
    this.getAddressList();
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