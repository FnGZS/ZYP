const url = require('../../config.js')
const sendAjax = require('../../utils/sendAjax.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    URL: url.host,
    calendar:null,
    lodingHidden:false
  },
  onLoad: function (options) {
    this.getCalendar();
  },

  getCalendar:function(){
    var that = this;
    wx.request({
      method: 'GET',
      url: this.data.URL + '/calendar',
      data: {
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(res)
        that.setData({
          calendar: res.data.calendar,
          lodingHidden:true
        })
      }
    })
  },
  //图片预览
  previewImage: function (e) {
    console.log(e)
    var pic = e.currentTarget.dataset.pic;
    var pics = [];
    pics.push(pic)
    wx.previewImage({
      current: pic, // 当前显示图片的http链接   
      urls: pics // 需要预览的图片http链接列表   
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