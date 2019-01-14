// const url = require('sendAjax.js')
var url = require('../config.js')
const sendAjax = require('sendAjax.js')
var app = getApp()

// function checkLogin() {
//   var uesrinfo=wx.getStorageSync("userinfo")
//   if(uesrinfo){
//     return true
//   }else {
//     wx.navigateTo({
//       url: '/pages/start/start'
//     })
//   }
// }
//type:1 授权页面 0其他页面
function wxLogin(type,callBack) {
  console.log(type)
  const scallback = callBack || function (data) { };
  wx.login({
    success: resp => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      console.log(resp);
      var that = this;
      // 获取用户信息
      wx.getSetting({
        success: res => {
          //  console.log(res);
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: userResult => {
                var platUserInfoMap = {}
                platUserInfoMap["encryptedData"] = userResult.encryptedData;
                platUserInfoMap["iv"] = userResult.iv;
                let infoOpt = {
                  url: '/user/login',
                  type: 'POST',
                  data: {
                    platCode: resp.code,
                    platUserInfoMap: platUserInfoMap,
                  },
                  header: {
                    'content-type': 'application/json',
                  },
                }
                let infoCb = {}
                infoCb.success = function (res) {
                  console.log(res)
                  wx.setStorageSync("userinfo", res)
                  scallback(res)
                }
                sendAjax(infoOpt, infoCb, () => { });
           
              }
       

            })
          }else if(type!=1){
            wx.navigateTo({
              url: '/pages/start/start'
            })
          }
        }
      })
    }
  })

}

module.exports = {
  wxLogin: wxLogin,

}