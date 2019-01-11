var url = require('../../config.js')
const sendAjax = require('../../utils/sendAjax.js')
var login = require('../../utils/wxlogin.js')
var app = getApp()
Page({
  data: {
    userInfo: wx.getStorageSync('userinfo'),
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isboundUser: '绑定学号',
    platUserInfoMap: {},
    code: '',
    dallNum: 0,
    launchnum: 0,
    luckynum: 0,
  },
  onLoad: function (options) {
       
  },
  // getUserInfo: function (e) {
  //   var that = this;
  //   console.log(e);
  //   if (e.detail.userInfo) {
  //     app.globalData.userInfo = e.detail.userInfo

  //     this.setData({
  //       userInfo: e.detail.userInfo,
  //       hasUserInfo: true
  //     })
  //     var platUserInfoMap = that.data.platUserInfoMap;
  //     platUserInfoMap["encryptedData"] = e.detail.encryptedData;
  //     platUserInfoMap["iv"] = e.detail.iv;
  //     // console.log(platUserInfoMap);
  //     // console.log(JSON.stringify(data));
  //     let infoOpt = {
  //       url: '/user/login',
  //       type: 'POST',
  //       data: {
  //         platCode: that.data.code,
  //         platUserInfoMap: platUserInfoMap,
  //       },
  //       header: {
  //         'content-type': 'application/json',
  //         // 'authorization': wx.getStorageSync("authorization"),
  //       },
  //     }
  //     let infoCb = {}
  //     infoCb.success = function (res) {
  //       console.log(res)
  //       wx.setStorageSync("userId", res.userId)
  //       wx.setStorageSync("isLogin", 1)
  //       wx.setStorageSync("nickName", res.userName)
  //       wx.setStorageSync("isbound", res.isbound)
  //       wx.setStorageSync("avatar", res.avatar)
  //       wx.setStorageSync("userKey", res.userKey)
  //       wx.setStorageSync("authorization", res.authorization)
  //       wx.setStorageSync("userId", res.userId)
  //       if (wx.getStorageSync('isbound') == 1) {
  //         that.setData({
  //           isboundUser: '已绑定学号'
  //         })
  //       }

  //     }
  //     infoCb.beforeSend = () => { }
  //     infoCb.complete = () => {

  //     }
  //     sendAjax(infoOpt, infoCb, () => {
  //       // that.onLoad()
  //       // wx.setStorageSync('G_needUploadIndex', true)
  //     });
  //   } else {
  //     this.openSetting();
  //   }
  // },
  login: function () {
    var that = this
    login.wxLogin();
  
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
  binding: function () {
    var isLogin = wx.getStorageSync('isLogin');
    if (isLogin == 1) {
      wx.navigateTo({
        url: 'binding/binding'
      })
    } else {
      wx.showModal({
        title: '请登录',
        content: '请获取头像昵称',
        showCancel: false
      })
    }
  },
  //跳转二手我发布的
  toSecHandMyPublish: function () {
    wx.navigateTo({
      url: '../secondHand/secondHandMyPublish/secondHandMyPublish',
    })
  },
  //跳转二手我卖出的
  toSecHandMySold: function () {
    wx.navigateTo({
      url: '../secondHand/secondHandOrderSold/secondHandOrderSold',
    })
  },
  //跳转二手我买入的
  toSecHandMyBought: function () {
    wx.navigateTo({
      url: '../secondHand/secondHandOrderBought/secondHandOrderBought',
    })
  },
  //跳转二手我想要的
  toSecHandMyWant: function () {
    wx.navigateTo({
      url: '../secondHand/secondHandMyWant/secondHandMyWant',
    })
  },
  //跳转二手消息中心
  toSecMes: function () {
    wx.navigateTo({
      url: '../secondHand/secondHandMes/secondHandMes',
    })
  },
  //跳转二手地址管理
  toSecHandAddress: function () {
    wx.navigateTo({
      url: '../secondHand/secondHandAddress/secondHandAddress',
    })
  },
  //跳转意见反馈
  toIdeaBack: function () {
    wx.navigateTo({
      url: 'ideaBack/ideaBack',
    })
  },
  //跳转帮助文档
  toHelp: function () {
    wx.navigateTo({
      url: 'help/help',
    })
  },
  //跳转关于我们
  toAboutUs: function () {
    wx.navigateTo({
      url: 'aboutUs/aboutUs',
    })
  },
  //点击我参与的
  goRecordall: function (n) {
    var that = this;
    let infoOpt = {
      url: '/luck/joinList',
      type: 'GET',
      data: {
        userId: wx.getStorageSync('userId'),
        pageNo: 1,
        pageSize: 1000
      },
      header: {
        'content-type': 'application/json',
        //  'authorization': wx.getStorageSync("authorization"),
      },
    }
    let infoCb = {}
    infoCb.success = function (data) {
      console.log(data.items)
      wx.navigateTo({
        url: "/pages/ticket/recordall/recordall?joinList=" + JSON.stringify(data.items)
      });
    }

    sendAjax(infoOpt, infoCb, () => {

    });




  },
  //点击我发布的
  goRecordlaunch: function (n) {
    var that = this;
    let infoOpt = {
      url: '/luck/delease',
      type: 'GET',
      data: {
        userId: wx.getStorageSync('userId'),
        pageNo: 1,
        pageSize: 1000
      },
      header: {
        'content-type': 'application/json',
        //  'authorization': wx.getStorageSync("authorization"),
      },
    }
    let infoCb = {}
    infoCb.success = function (data) {
      wx.navigateTo({
        url: "/pages/ticket/recordlaunch/recordlaunch?launchList=" + JSON.stringify(data.items)
      });
    }
    sendAjax(infoOpt, infoCb, () => {

    });


  },
  //中奖纪录
  goRecordlucky: function (n) {
    var that = this;
    let infoOpt = {
      url: '/luck/award',
      type: 'GET',
      data: {
        userId: wx.getStorageSync('userId'),
        pageNo: 1,
        pageSize: 1000
      },
      header: {
        'content-type': 'application/json',
        //  'authorization': wx.getStorageSync("authorization"),
      },
    }
    let infoCb = {}
    infoCb.success = function (data) {
      wx.navigateTo({
        url: "/pages/ticket/recordlucky/recordlucky?luckyList=" + JSON.stringify(data.items)
      });
    }

    sendAjax(infoOpt, infoCb, () => {

    });


  },
  //跳转抽奖
  goTicketadd: function (n) {
    wx.navigateTo({
      url: "/pages/ticket/ticketadd/ticketadd"
    });
  },
  //我参与的
  godall: function () {
    var that = this;
    let infoOpt = {
      url: '/luck/joinList',
      type: 'GET',
      data: {
        userId: wx.getStorageSync('userId'),
        pageNo: 1,
        pageSize: 1000
      },
      header: {
        'content-type': 'application/json',
        //  'authorization': wx.getStorageSync("authorization"),
      },
    }
    let infoCb = {}
    infoCb.success = function (data) {
      console.log(data.items.length)
      that.setData({
        dallNum: data.items.length
      })
    }

    sendAjax(infoOpt, infoCb, () => {

    });
  },
  //我发起的
  godlaunch: function () {
    var that = this;
    let infoOpt = {
      url: '/luck/delease',
      type: 'GET',
      data: {
        userId: wx.getStorageSync('userId'),
        pageNo: 1,
        pageSize: 1000
      },
      header: {
        'content-type': 'application/json',
        //  'authorization': wx.getStorageSync("authorization"),
      },
    }
    let infoCb = {}
    infoCb.success = function (data) {
      console.log(data.items.length)
      that.setData({
        launchnum: data.items.length
      })
    }

    sendAjax(infoOpt, infoCb, () => {

    });
  },
  //中奖纪录
  godlucky: function () {
    var that = this;
    let infoOpt = {
      url: '/luck/award',
      type: 'GET',
      data: {
        userId: wx.getStorageSync('userId'),
        pageNo: 1,
        pageSize: 1000
      },
      header: {
        'content-type': 'application/json',
        //  'authorization': wx.getStorageSync("authorization"),
      },
    }
    let infoCb = {}
    infoCb.success = function (data) {
      console.log(data.items.length)
      that.setData({
        luckynum: data.items.length
      })
    }

    sendAjax(infoOpt, infoCb, () => {

    });
  },
  onReady: function () {
  },
  onShow: function () {
    this.login();
    if (this.data.userInfo) {
      this.setData({
        isboundUser: '已绑定'
      })
    }
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