var url = require('../../config.js')
const sendAjax = require('../../utils/sendAjax.js')
var login = require('../../utils/wxlogin.js')
var app = getApp()
Page({
  data: {
    userInfo:null,
    hasUserInfo: false,
    // canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isboundUser: '绑定学号',
    platUserInfoMap: {},
    code: '',
    balance:'',
    dallNum: 0,
    launchnum: 0,
    luckynum: 0,
  },
  onLoad: function (options) {
    console.log(this.data.userInfo)
  },



  //绑定页面
  binding: function () {
      wx.navigateTo({
        url: 'binding/binding'
      })
  },
  //跳转资金提现页面
  cash:function(){
    wx.navigateTo({
      url: 'cash/cash'
    })
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
  //获取用户的账户余额
  getBalance: function () {
    var that = this;
    let infoOpt = {
      url: '/secondary/order/getSecondaryCapital',
      type: 'GET',
      data: {},
      header: {
        'content-type': 'application/json',
      },
    }
    let infoCb = {}
    infoCb.success = function (res) {
      var balance = res.list.remainder.toFixed(2);
      that.setData({
        balance: balance,
      })
    }
    infoCb.beforeSend = () => { }
    sendAjax(infoOpt, infoCb, () => { });
  },
  //点击我参与的
  goRecordall: function (n) {
    var that = this;
    let infoOpt = {
      url: '/luck/joinList',
      type: 'GET',
      data: {
        userId: that.data.userInfo.userId,
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
        userId: that.data.userInfo.userId,
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
        userId: that.data.userInfo.userId,
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
    console.log(1111111111111111111111111 + this.data.userInfo)
    var that = this;
    let infoOpt = {
      url: '/luck/joinList',
      type: 'GET',
      data: {
        userId: that.data.userInfo.userId,
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
        userId: that.data.userInfo.userId,
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
        userId: that.data.userInfo.userId,
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
    // console.log(wx.getStorageSync('userinfo'))
    var that=this 
    login.wxLogin(0, function (res) {
      console.log(res);
      that.setData({
        userInfo: res,
      })
      console.log(that.data.userInfo)
      if (that.data.userInfo.isbound == 1) {
        that.setData({
          isboundUser: '已绑定'
        })
      }
      that.getBalance()
      that.godall()
      that.godlucky()
      that.godlaunch()

    });

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