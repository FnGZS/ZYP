const sendAjax = require('../../../utils/sendAjax.js')
var WxParse = require('../../../wxParse/wxParse.js');
Page({
  data: {
    id:null,
    name:'',
    detail:null,
    lodingHidden:false
  },
  onLoad: function (options) {
    var id = options.id;
    this.setData({
      id : id
      // id:1
    })
    this.getInnovateDetail();

  },
  getInnovateDetail:function(){
    var that = this;
    var id = that.data.id;
    let infoOpt = {
      url: '/innovate/list/' + id,
      type: 'GET',
      data: {
      },
      header: {
        'content-type': 'application/json',
      },
    }
    let infoCb = {}
    infoCb.success = function (res) {
      console.log(res)
      wx.setNavigationBarTitle({
        title: res.name
      })
      var detail = res.content;
      var arry = WxParse.wxParse('arry', 'html', detail, that, 30);
      that.setData({
        detail:res,
        lodingHidden:true
      })
    }
    sendAjax(infoOpt, infoCb, () => { });
  },

  //点击拨打电话
  callPhone:function(e){
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },
  //二维码预览
  codeImgYu:function(e){
    console.log(e)
    var pic = e.currentTarget.dataset.img;
    var pics = [];
    pics.push(pic);
    wx.previewImage({
      current: pic,     //当前图片地址
      urls: pics,               //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
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