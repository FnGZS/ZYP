//app.js
var url = require('config.js')
var login = require('/utils/wxlogin.js')
App({
  onLaunch: function() {
    this.test();
    // 展示本地存储能力
    wx.login({
      success: (res) => {
        if (res.code) {
          wx.request({
            url: "https://api.weixin.qq.com/sns/jscode2session",
            data: {
              appid: 'wx070db500b5e5740f', //你的appid
              secret: 'd22b361c01e467afd5a55418a04ecb78', //你的secret
              js_code: res.code,
              grant_type: "authorization_code"
            },
            success: (res) => {
              console.log(res);
              wx.setStorageSync('oppenid', res.data.openid)
            }
          })
        }
      }
    })
    // wx.setStorageSync("sessionKey",'')
    // wx.setStorageSync("userinfo","")
    // this.getStart()
    // 登录


  },
  test: function() {
    var that = this;
    var isbound = wx.getStorageSync('userinfo').isbound;
    wx.request({
      url: 'https://www.sxscott.com/crazyBird/vote/test',
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(res)
        if (res.data.type == 1 && isbound != 1) {
          wx.hideTabBar({

          })
        } else {
          wx.showTabBar({

          })
        }
      }
    })
  },
  //自定义的消息弹窗
  toastShow: function(that, str, icon) {
    that.setData({
      isShow: true,
      txt: str,
      iconClass: icon
    });
    setTimeout(function() {
      that.setData({
        isShow: false
      });
    }, 1500);
  },
  data: {},

  globalData: {
    userInfo: null,
    platUserInfoMap: {},

  },

})