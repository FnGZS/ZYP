//app.js
var url = require('config.js')
var login = require('/utils/wxlogin.js')
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // wx.setStorageSync("sessionKey",'')
    // wx.setStorageSync("userinfo","")
    // this.getStart()
    // 登录
    

  },
  //自定义的消息弹窗
  toastShow: function (that, str, icon) {
    that.setData({
      isShow: true,
      txt: str,
      iconClass: icon
    });
    setTimeout(function () {
      that.setData({
        isShow: false
      });
    }, 1500);
  }, 
  data:{
  },

  globalData: {
    userInfo: null,
    platUserInfoMap: {},
  
  },
  
})
