const sendAjax = require('../../utils/sendAjax.js')
Page({

  data: {
    phoneHeight:null,
    innovatPics:[]
  },
  onLoad: function (options) {
    this.getInnovateList();
  },
  getPhoneInfo: function () {
    this.setData({
      phoneHeight: 750 / wx.getSystemInfoSync().windowWidth * wx.getSystemInfoSync().windowHeight
    })
  },
  //获取创新创业学院列表
  getInnovateList:function(){
    var that = this
    let infoOpt = {
      url: '/innovate/list',
      type: 'GET',
      data: {
      },
      header: {
        'content-type': 'application/json',
      },
    }
    let infoCb = {}
    infoCb.success = function (res) {
      console.log(res);
      that.setData({
        innovatPics: res.items
      })
      console.log(that.data.innovatPics)
    }
    sendAjax(infoOpt, infoCb, () => {});
  },
  //跳转详情
  toDetail:function(e){
    // console.log(e)
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'innovateDetail/innovateDetail?id=' + id,
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