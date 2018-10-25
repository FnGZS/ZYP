//app.js
var url = require('config.js')
App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.setStorageSync('GradualNum',1);//用来判断是不是第一次打开小程序
    wx.hideTabBar();
    // 登录
    wx.login({
      success: resp => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // console.log(resp.code);
    var that=this;
    // 获取用户信息
    wx.getSetting({
     
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: userResult => {
              // 可以将 res 发送给后台解码出 unionId
              that.globalData.userInfo = userResult.userInfo
              console.log(userResult);
              var platUserInfoMap = that.globalData.platUserInfoMap;
              platUserInfoMap["encryptedData"] = userResult.encryptedData;
              platUserInfoMap["iv"] = userResult.iv;
              console.log(platUserInfoMap);
              // console.log(JSON.stringify(data));
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
                   wx.setStorageSync("isLogin", 1)
                   that.globalData.nickName = res.data.userName
                   that.globalData.headimgurl = res.data.avatar
                   wx.setStorageSync("nickName", res.data.userName)
                   wx.setStorageSync("isbound", res.data.isbound)
                   wx.setStorageSync("avatar", res.data.avatar)
                   wx.setStorageSync("userKey", res.data.userKey)
                   wx.setStorageSync("authorization", res.data.authorization)
                   console.log(res)
                 }
               })
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (that.userInfoReadyCallback) {
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


  globalData: {
    userInfo: null,
    PHPURL: "https://www.sxscott.com/gujie/index.php",
    IMGURL: "https://www.sxscott.com/gujie/public",
    platUserInfoMap:{},
    userInfo:'',
    authorization: '',
    nickName:'',
    headimgurl:'',
    authorization:'',


  }
})