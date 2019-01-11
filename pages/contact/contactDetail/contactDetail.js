const url = require('../../../config.js')
const sendAjax = require('../../../utils/sendAjax.js')
Page({
  data: {
    contactPic: ["https://www.sxscott.com/crazyBirdimg/affairs/affairs15.png", "https://www.sxscott.com/crazyBirdimg/affairs/affairs16.png", "https://www.sxscott.com/crazyBirdimg/affairs/affairs17.png", "https://www.sxscott.com/crazyBirdimg/affairs/affairs18.png"]
  },
  onLoad: function (options) {
    this.getContactDetail();
  },
  handleMakeCall:function(){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.mobile
    })
  },
  getContactDetail:function(){
    var that = this;
    let infoOpt = {
      url: '/contacts/getContactsDetail/1',
      type: 'GET',
      data: {},
      header: {
        'content-type': 'application/json',
      },
    }
    let infoCb = {}
    infoCb.success = function (res) {
      console.log(res);
    }
    infoCb.beforeSend = () => { }
    sendAjax(infoOpt, infoCb, () => { });
  },
  imgYu: function (e) {
    var pic = e.currentTarget.dataset.img;
    var pics = this.data.contactPic;
    console.log(pic)
    console.log(pics)
    wx.previewImage({
      current: pic,     //当前图片地址
      urls: pics,               //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) {
        console.log(res)
       },
      complete: function (res) { },
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