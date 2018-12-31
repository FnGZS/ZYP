var app = getApp();
const url = require('../../../config.js')
const sendAjax = require('../../../utils/sendAjax.js')
Page({
    data: {
        dallNum: 0,
        launchnum: 0,
        luckynum: 0,

        userInfo:{}
    },
    onLoad: function(n) {
      
    },
    onReady: function() {},
    goMydance: function(n) {
        wx.navigateTo({
            url: "../../circle/mydance/mydance"
        });
    },
    onShow: function() {
      console.log(app.globalData.userInfo)
      this.setData({
        userInfo: app.globalData.userInfo
      })
      this.godlucky()
      this.godlaunch()
      this.godall()
        // var o = wx.getStorageSync("user_info"), e = wx.getStorageSync("is_tel"), a = wx.getStorageSync("is_openzx");
        // this.setData({
        //     userInfo: o,
        //     is_openzx: a,
        //     is_tel: e
        // });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
      wx.showNavigationBarLoading();
      this.godall()
      this.godlaunch()
      this.godlucky()
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();


    },
    onReachBottom: function() {},
    goAddress: function(n) {
        wx.chooseAddress({
            success: function(n) {
                console.log(n);
            }
        });
    },
    //点击我参与的
    goRecordall: function(n) {
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
          url: "../recordall/recordall?joinList=" + JSON.stringify(data.items)
        });
      }

      sendAjax(infoOpt, infoCb, () => {

      });


        
    
    },
    //点击我发布的
    goRecordlaunch: function(n) {
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
          url: "../recordlaunch/recordlaunch?launchList=" + JSON.stringify(data.items)
        });
      }
      sendAjax(infoOpt, infoCb, () => {

      });

        
    },
    //中奖纪录
    goRecordlucky: function(n) {
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
            url: "../recordlucky/recordlucky?luckyList=" + JSON.stringify(data.items)
          });
      }

      sendAjax(infoOpt, infoCb, () => {

      });
      
        
    },
    //跳转抽奖
  goTicketadd: function (n) {
    wx.navigateTo({
      url: "../ticketadd/ticketadd"
    });
  },
    //跳转首页
  goTicketmain: function (n) {
    wx.reLaunch({
      url: "../ticketmian/ticketmian"
    });
  },
    //问题
    goHelpcenter: function(n) {
        wx.navigateTo({
            url: "/pages/user/help/help"
        });
    },
    //我参与的
    godall: function() {
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
  gohome: function () {
    wx.reLaunch({
      url: "../ticketmian/ticketmian"
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
  }
});