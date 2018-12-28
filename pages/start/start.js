var url = require('../../config.js')
const sendAjax = require('../../utils/sendAjax.js')
var app = getApp()

Page({
  data: {
    userInfo: {},
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    platUserInfoMap: {},
    code:"",
    sessionKey:''
  },
  onLoad: function () {
  },
//   getPhoneNumber:function(e){
//     console.log(e);
// var that=this;
//     console.log(wx.getStorageSync("sessionKey"))
//     // console.log(platUserInfoMap);
//     // console.log(JSON.stringify(data));
//     // console.log(platUserInfoMap);
//     //request请求
//     // wx.request({
//     //   url: "http://192.168.1.102:8080/crazyBird/user/deciphering",
//     //   method: 'get',
//     //   data: {
//     //     encrypdata: e.detail.encryptedData,
//     //     ivdata: e.detail.iv,
//     //     sessionkey: wx.getStorageSync("sessionKey")
//     //   },
//     //   header: {
//     //     'content-type': 'application/json' // 默认值
//     //   },
//     //   success(res) {
//     //     console.log(res);
//     //   }
//     // })
//     var that = this;

//     let infoOpt = {
//       url: '/user/deciphering',
//       type: 'GET',
//       data: {
//         encrypdata: e.detail.encryptedData,
//         ivdata: e.detail.iv,
//         sessionkey: wx.getStorageSync("sessionKey")
//       },
//       header: {
//         'content-type': 'application/json',
//       },
//     }
//     let infoCb = {}
//     infoCb.success = function (res) {
//       console.log(res);
//     }
//     infoCb.beforeSend = () => { }
//     sendAjax(infoOpt, infoCb, () => { });
//     if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
//       wx.showModal({
//         title: '提示',
//         showCancel: false,
//         content: '未授权',
//         success: function (res) { }
//       })
//     } else {
//       wx.showModal({
//         title: '提示',
//         showCancel: false,
//         content: '同意授权',
//         success: function (res) { }
//       })
//     } 
//   },
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮

      wx.login({
        success: resp => {
          // 发送 resp.code 到后台换取 openId, sessionKey, unionId
          // console.log(resp.code);
          var that = this;
          wx.setStorageSync("code", resp.code)

          that.setData({
            code: resp.code
          })
          wx.getUserInfo({
                  success: userResult => {
                    
                    that.setData({
                      userInfo: userResult.userInfo
                    })
                    
                    var platUserInfoMap = that.data.platUserInfoMap;
                    platUserInfoMap["encryptedData"] = userResult.encryptedData;
                    platUserInfoMap["iv"] = userResult.iv;
                    // console.log(platUserInfoMap);
                    // console.log(JSON.stringify(data));
                    console.log(platUserInfoMap);
                    //request请求
                    wx.request({
                      url: url.loginUrl,
                      method: 'POST',
                      data: {
                        platCode: resp.code,
                        platUserInfoMap: platUserInfoMap,
                      },
                      header: {
                        'content-type': 'application/json' // 默认值
                      },
                      success(res) {
                        console.log(res);
                        wx.setStorageSync("userId", res.data.userId)
                        wx.setStorageSync("isLogin", 1)
                        wx.setStorageSync("nickName", res.data.userName)
                        wx.setStorageSync("isbound", res.data.isbound)
                        wx.setStorageSync("avatar", res.data.avatar)
                        wx.setStorageSync("userKey", res.data.userKey)
                        wx.setStorageSync("authorization", res.data.authorization)
                        wx.setStorageSync("userId", res.data.userId)
                        wx.setStorageSync("sessionKey", res.data.sessionKey)
                        wx.setStorageSync("phone", res.data.phone)
                        console.log(res.data.authorization)
                      }
                    })
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              // console.log(that.userInfoReadyCallback);
              if (that.userInfoReadyCallback) {
                // console.log(222);
                that.userInfoReadyCallback(userResult)
              }
            }
          })

              
            
        }
      })
      // wx.setStorageSync("isFir", true)
      // //授权成功后，跳转进入小程序首页
      wx.switchTab({
        url: '../index/index'
      })
    } else {
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
  }
})