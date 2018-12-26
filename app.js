//app.js
var url = require('config.js')
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.setStorageSync("isLogin",0)
    wx.setStorageSync("sessionKey",'')
    // this.getStart()

    // 登录
    wx.login({
      success: resp => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // console.log(resp.code);
        var that = this;
     
        // 获取用户信息
        wx.getSetting({
         
          success: res => {
                  //  console.log(res);
    
            if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.getUserInfo({
                success: userResult => {
                  // console.log(userResult);
                  // 可以将 res 发送给后台解码出 unionId
                  // wx.setStorageSync("isFirst", userResult.userInfo)

                  that.globalData.userInfo = userResult.userInfo
                  // console.log(userResult);
                  var platUserInfoMap = that.globalData.platUserInfoMap;
                  platUserInfoMap["encryptedData"] = userResult.encryptedData;
                  platUserInfoMap["iv"] = userResult.iv;
                  // console.log(platUserInfoMap);
                  // console.log(JSON.stringify(data));
                  console.log(platUserInfoMap)
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
                      that.globalData.nickName = res.data.userName
                      that.globalData.headimgurl = res.data.avatar
                      wx.setStorageSync("nickName", res.data.userName)
                      wx.setStorageSync("isbound", res.data.isbound)
                      wx.setStorageSync("avatar", res.data.avatar)
                      wx.setStorageSync("userKey", res.data.userKey)
                      wx.setStorageSync("authorization", res.data.authorization)
                      
                      wx.setStorageSync("userId", res.data.userId)
                      wx.setStorageSync("sessionKey", res.data.sessionKey)
                      // console.log(res.data.authorization)
                      // wx.setStorageSync("sessionKey", res.data.sessionKey)
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
          }
        })
      }
    })

  },
  getStart(){
    var isFir = wx.getStorageSync("isFir")
    // console.log(isFir)
    if (isFir == true) {
      wx.navigateTo({
        url: "/pages/index/index"
      })
    }
  
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
    PHPURL: "https://www.sxscott.com/gujie/index.php",
    IMGURL: "https://www.sxscott.com/gujie/public",
    platUserInfoMap: {},
    userInfo: '',
    authorization: '',
    nickName: '',
    headimgurl: '',
    authorization: '',
    isbound: '',

  },
})