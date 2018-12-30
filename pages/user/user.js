// pages/user/user.js
var url = require('../../config.js')
const sendAjax = require('../../utils/sendAjax.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
   userbg:'',
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isboundUser:'绑定学号',
    platUserInfoMap:{},
    code:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  getbackground:function(){
      var that = this;
      console.log(1);
      let infoOpt = {
        url: '/user/background',
        type: 'GET',
        data: {
        },
        header: {
          'content-type': 'application/json',
          //  'authorization': wx.getStorageSync("authorization"),
        },
      }
      let infoCb = {}
      infoCb.success = function (data) {
        that.setData({
          userbg:data.background
        })
        console.log(that.data.userbg);
      }

      sendAjax(infoOpt, infoCb, () => {

      });
   
  },
  onLoad: function () {
    this.getbackground();
    if (app.globalData.userInfo) {
      // console.log(1)
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }else if (this.data.canIUse) {
      // console.log(2)
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        // console.log(12)
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        },
        fail: res => {
          // console.log(4);
          this.setData({
            getUserInfoFail: true
          })
        }
      })
    }
 
  },
  getUserInfo: function (e) {
    var that=this;
     console.log(e);
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo

      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      var platUserInfoMap = that.data.platUserInfoMap;
      platUserInfoMap["encryptedData"] = e.detail.encryptedData;
      platUserInfoMap["iv"] = e.detail.iv;
      // console.log(platUserInfoMap);
      // console.log(JSON.stringify(data));
      let infoOpt = {
        url: '/user/login',
        type: 'POST',
        data: {
          platCode: that.data.code,
          platUserInfoMap: platUserInfoMap,
        },
        header: {
          'content-type': 'application/json',
          // 'authorization': wx.getStorageSync("authorization"),
        },
      }
      let infoCb = {}
      infoCb.success = function (res) {
        // console.log(res)
        wx.setStorageSync("userinfo", res.data)
        wx.setStorageSync("userId", res.userId)
        wx.setStorageSync("isLogin", 1)
        wx.setStorageSync("nickName", res.userName)
        wx.setStorageSync("isbound", res.isbound)
        wx.setStorageSync("avatar", res.avatar)
        wx.setStorageSync("userKey", res.userKey)
        wx.setStorageSync("authorization", res.authorization)
        wx.setStorageSync("userId", res.userId)
        if (wx.getStorageSync('isbound') == 1) {
          that.setData({
            isboundUser: '已绑定学号'
          })
        }

      }
      infoCb.beforeSend = () => { }
      infoCb.complete = () => {

      }
      sendAjax(infoOpt, infoCb, () => {
        // that.onLoad()
        // wx.setStorageSync('G_needUploadIndex', true)
      });
    } else {
      this.openSetting();
    }
},
  login: function () {
    // console.log(111)
    var that = this
    // if (typeof success == "function") {
    //   console.log(6);
    //   console.log('success');
    //   this.data.getUserInfoSuccess = success
    // }
    wx.login({
      success: function (resp) {
        var code = resp.code;
       that.setData({
         code:resp.code,
       })
        wx.getUserInfo({
          success: function (resq) {
            app.globalData.userInfo = resq.userInfo
            that.setData({
              getUserInfoFail: false,
              userInfo: resq.userInfo,
              hasUserInfo: true
            })
            var platUserInfoMap = that.data.platUserInfoMap;
            platUserInfoMap["encryptedData"] = resq.encryptedData;
            platUserInfoMap["iv"] = resq.iv;
            // console.log(platUserInfoMap);
            // console.log(JSON.stringify(data));
            let infoOpt = {
              url: '/user/login',
              type: 'POST',
              data: {
                platCode: resp.code,
                platUserInfoMap: platUserInfoMap,
              },
              header: {
                'content-type': 'application/json',
                // 'authorization': wx.getStorageSync("authorization"),
              },
            }
            let infoCb = {}
            infoCb.success = function (res) {
              console.log(11111);
              // console.log(res)
              wx.setStorageSync("userId", res.userId)
              wx.setStorageSync("isLogin", 1)
              wx.setStorageSync("nickName", res.userName)
              wx.setStorageSync("isbound", res.isbound)
              wx.setStorageSync("avatar", res.avatar)
              wx.setStorageSync("userKey", res.userKey)
              wx.setStorageSync("authorization", res.authorization)
              wx.setStorageSync("userId", res.userId)

              if (wx.getStorageSync('isbound') == 1) {
                that.setData({
                  isboundUser: '已绑定学号'
                })
              }
       
            }
            infoCb.beforeSend = () => { }
            infoCb.complete = () => {

            }
            sendAjax(infoOpt, infoCb, () => {
              // that.onLoad()
              // wx.setStorageSync('G_needUploadIndex', true)
            });
            //平台登录
          },
          fail: function (res) {
            // console.log(8);
            // console.log(res);
            that.setData({
              getUserInfoFail: true
            })
          }
        })
      }
    })
  },
  //跳转设置页面授权
  openSetting: function () {
    var that = this
    if (wx.openSetting) {
      wx.openSetting({
        success: function (res) {
          // console.log(9);
          //尝试再次登录
          that.login()
        }
      })
    } else {
      // console.log(10);
      wx.showModal({
        title: '授权提示',
        content: '小程序需要您的微信授权才能使用哦~ 错过授权页面的处理方法：删除小程序->重新搜索进入->点击授权按钮'
      })
    }
  },
 //绑定页面
  binding:function(){
    var isLogin = wx.getStorageSync('isLogin');
    if (isLogin==1)
    {
      wx.navigateTo({
        url: 'binding/binding'
      })
    }else {
      wx.showModal({
        title: '请登录',
        content: '请获取头像昵称',
        showCancel: false
      })
    }

  },
  joinVote: function () {
    // console.log('12321313');

    var isLogin = wx.getStorageSync('isLogin');
    if (isLogin == 1) {
      wx.navigateTo({
        url: 'joinVote/joinVote'
      })
    } else {
      wx.showModal({
        title: '请登录',
        content: '请获取头像昵称',
        showCancel: false
      })
    }

  },
  ideaBack: function () {
    // console.log('12321313');
    wx.navigateTo({
      url: 'ideaBack/ideaBack'
    })

  },
  help: function () {
    // console.log('12321313');
    wx.navigateTo({
      url: 'help/help'
    })

  },
  aboutUs: function () {
    // console.log('12321313');
    wx.navigateTo({
      url: 'aboutUs/aboutUs'
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.login();
    if (wx.getStorageSync('isbound') == 1 ) {
      this.setData({
        isboundUser: '已绑定学号'
      })
    }
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})