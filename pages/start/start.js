var url = require('../../config.js')
const sendAjax = require('../../utils/sendAjax.js')
var app = getApp()
var login = require('../../utils/wxlogin.js')
Page({
  data: {
    userInfo:null,
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    platUserInfoMap: {},
    code: "",
    sessionKey: '',
     cloudsShow: false,
  },
  onLoad: function () { 

  },
  
  bindGetUserInfo: function (e) {
    var that=this;
    if (e.detail.userInfo) {
      console.log(e.detail.userInfo)
     login.wxLogin(function(res){
       console.log(res)
       wx.setStorageSync("userinfo", res)
       that.setData({
         userInfo:res,
       })
       console.log(that.data.userInfo)
       if (that.data.userInfo.phone) {
         that.setData({
           cloudsShow: false
         })
         wx.navigateBack({
           data: 1
         });
       } else {
         that.setData({
           cloudsShow: true
         })
       }
     });
    }
    else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },
  getPhoneNumber: function (e) {
    var that = this;
    var sessionkey = wx.getStorageSync("userinfo").sessionKey;
    let infoOpt = {
      url: '/user/deciphering',
      type: 'GET',
      data: {
        encrypdata: e.detail.encryptedData,
        ivdata: e.detail.iv,
        sessionkey: sessionkey
      },
      header: {
        'content-type': 'application/json',
      },
    }
    let infoCb = {}
    infoCb.success = function (res) {
      // console.log(res)
      if (res.message == "成功")
      login.wxLogin();
    }
    infoCb.beforeSend = () => { }
    sendAjax(infoOpt, infoCb, () => { });
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      wx.showModal({
        title: '警告',
        showCancel: false,
        content: '如未授权手机号将无法使用功能',
        success: function (res) {
          that.setData({
            cloudsShow: true
          })
        }
      })
    } else {
      wx.showModal({
        title: '',
        showCancel: false,
        content: '欢迎进入在元培',
        success: function (res) {
          that.setData({
            cloudsShow: false
          })
          wx.navigateBack({
            data: 1
          });
        }
      })
    }
   }
})