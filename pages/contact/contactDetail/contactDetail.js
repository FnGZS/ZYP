const url = require('../../../config.js')

const sendAjax = require('../../../utils/sendAjax.js')
const login = require('../../../utils/wxlogin.js')
Page({
  data: {
    id: null,
    userInfo: wx.getStorageSync('userinfo'),
    manger: '',
    name: '',
    phone: '',
    phone2: '',
    pic: [],
    typeName: ''
  },
  onLoad: function (options) {
    var id = options.id;
    var isShare = options.isShare;
    var that=this;
    that.setData({
      id: id
    })
    if (isShare == 1){
    
      login.wxLogin(0, function (res) {
        console.log(res);
        that.setData({
          userInfo: res,
        })
      })
    }
    that.getContactDetail();
  },
  onShow: function (options) {
    var that=this;
    that.getContactDetail();
  },
  handleMakeCall: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.mobile
    })
  },
  getContactDetail: function () {
    var that = this;
    var id = that.data.id;
    let infoOpt = {
      url: '/contacts/getContactsDetail/' + id,
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
        manger: res.manger,
        name: res.name,
        phone: res.phone,
        phone2: res.phone2,
        pic: JSON.parse(res.pic),
        typeName: res.typeName
      })
      wx.hideLoading();
    }
    infoCb.beforeSend = () => {
      wx.showLoading({
        title: '加载中',
      })
    }
    sendAjax(infoOpt, infoCb, () => { });
  },
  imgYu: function (e) {
    var pic = e.currentTarget.dataset.img;
    var pics = this.data.pic;
    console.log(pic)
    console.log(pics)
    wx.previewImage({
      current: pic,     //当前图片地址
      urls: pics,               //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) {
        // console.log(res)
      },
      complete: function (res) { },
    })
  },
  btn_more: function () {
    console.log(111)
    wx.switchTab({
      url: '../contact',
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

    var id = this.data.id;
    var name = this.data.name;
    return {
      title: '推荐给您 ' + name,
      path: 'pages/contact/contactDetail/contactDetail?id=' + id + '&isShare=1',
    };

  }
})