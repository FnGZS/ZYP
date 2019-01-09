function _defineProperty(t, e, a) {
  return e in t ? Object.defineProperty(t, e, {
    value: a,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : t[e] = a, t;
}

var app = getApp(), WxParse = require("../../../wxParse/wxParse.js");
const url = require('../../../config.js')
const sendAjax = require('../../../utils/sendAjax.js')
Page({
  data: {
    //参与信息
    message: "",
    againTicket:0,
    getDetailList:[],
    hidden: !0,
    animationData: {},
    product: [1],
    status: "",
    gid: 0,
    luckId: 0
  },
  onLoad: function (options) {
    var my = decodeURIComponent(options.my);
    if (options.winList){
      var winList = decodeURIComponent(options.winList);
      var winList = JSON.parse(winList)
      this.setData({
        winList
      })
      console.log(winList)
    }
    var getDetailList = JSON.parse(my)
    var arr = WxParse.wxParse('article', 'html', getDetailList.prizeExplain, this, 30)
    
    this.setData({
      getDetailList,
      luckId: getDetailList.id,
      luckStatus: getDetailList.status,
      userInfo: getApp().globalData.userInfo,
      userId: getApp().globalData.userId
    })
    if(options.name == undefined){
      this.getisPart()
    }else{
      console.log("aaaaaaaaaaaaaaaaaa")
      this.setData({
        againTicket:1
      })
    }
    this.getjoinMan()
    this.getwinMan()
  },
  getstatus(){
    var t = this, a = t.data.luckId, b = t.data.luckStatus
    let infoOpt = {
      url: '/luck/luckWinner',
      type: 'GET',
      data: {
        status: b,
        luckId: a,
        orderByType: '',
        pageNo: 1,
        pageSize: 1000
      },
      header: {
        'content-type': 'application/json',
      },
    }
    let infoCb = {}
    infoCb.success = function (res) {
      console.log(res.items);
      t.setData({
        comwinList: res.items
      })
      let infoOpt = {
        url: '/luck/luckDetails',
        type: 'GET',
        data: {
          luckId: t.data.luckId
        },
        header: {
          'content-type': 'application/json',
        },
      }
      let infoCb = {}
      infoCb.success = function (res) {
        console.log(res);
        t.setData({
          getDetailList: res
        })
      }

      sendAjax(infoOpt, infoCb, () => {
      });
    }

    sendAjax(infoOpt, infoCb, () => {
    });




   
  },
  //中奖者名单
  getwinMan() {
    var t = this, a = t.data.luckId, b = t.data.luckStatus
    let infoOpt = {
      url: '/luck/luckWinner',
      type: 'GET',
      data: {
        status:b,
        luckId: a,
        orderByType:'',
        pageNo: 1,
        pageSize: 1000
      },
      header: {
        'content-type': 'application/json',
      },
    }
    let infoCb = {}
    infoCb.success = function (res) {
      console.log(res.items);
      t.setData({
        comwinList:res.items
      })
      
    }

    sendAjax(infoOpt, infoCb, () => {
    });

  },
  //参与人数
  getjoinMan(a) {
    var t = this,a = t.data.luckId
    let infoOpt = {
      url: '/luck/luckPartake',
      type: 'GET',
      data: {
        luckId: a,
        pageNo: 1,
        pageSize: 1000
      },
      header: {
        'content-type': 'application/json',
      },
    }
    let infoCb = {}
    infoCb.success = function (res) {
      console.log(res);
      t.setData({
        joinMan: res,
        num:res.items.length
      })
    }

    sendAjax(infoOpt, infoCb, () => {
    });

  },

  //是否参加
  getisPart() {
    var that = this
    let infoOpt = {
      url: '/luck/isPart',
      type: 'POST',
      data: {
        userId: wx.getStorageSync('userId'),
        luckId: that.data.luckId
      },
      header: {
        'content-type': 'application/json',
      },
    }
    let infoCb = {}
    infoCb.success = function (res) {
      console.log(res);
      that.setData({
        message: res.message
      })
    }

    sendAjax(infoOpt, infoCb, () => {
    });
  },
  //现在开奖
  xianzaikaijiang(){
    
    var that = this
    if(that.data.num == 0){
      wx.showModal({
        title: '暂无参与人数',
        content: '快邀请好友吧~',
      })
    }else{
      let infoOpt = {
        url: '/luck/random',
        type: 'GET',
        data: {
          luckId: that.data.luckId,
          mode: 2
        },
        header: {
          'content-type': 'application/json',
        },
      }
      let infoCb = {}
      infoCb.success = function (res) {
        console.log(res);
        that.getstatus()
      }

      sendAjax(infoOpt, infoCb, () => {
      });
    }
   
  },
  shareCanvas: function () {
    var t = this, e = "/yzcj_sun/pages/ticket/ticketmiandetail/ticketmiandetail?gid=" + t.data.gid;
    console.log(e);
    var a = t.data.product, n = [];
    n.gid = a[0].gid, n.url = t.data.url, n.logo = a[0].pic ? a[0].pic : "../addons/yzcj_sun/banner.jpg",
      console.log(n), app.func.creatPoster(app, e, 430, n, 1, "shareImg");
  },
  onShareAppMessage: function (t) {
    var that = this
    console.log(t)
    var top = "快来参与“"
    var bottom = "”发布的抽奖吧~"
    if (that.data.getDetailList.mode == 2 && that.data.getDetailList.status == 2 || that.data.getDetailList.mode == 1 && that.data.getDetailList.status == 2){
      top = "快来查看“"
      bottom = "”发布的抽奖结果吧~"
    }
    return  {
      title: top + that.data.getDetailList.userName+ bottom,
      path: '',
      success: function (t) { },
      fail: function (t) { }
    };
  },
  hidden: function (t) {
    this.setData({
      hidden: !0
    });
  },
  save: function () {
    var e = this;
    wx.saveImageToPhotosAlbum({
      filePath: e.data.prurl,
      success: function (t) {
        console.log("成功"), wx.showModal({
          content: "图片已保存到相册，赶紧晒一下吧~",
          showCancel: !1,
          confirmText: "好哒",
          confirmColor: "#ef8200",
          success: function (t) {
            t.confirm && (console.log("用户点击确定"), e.setData({
              hidden: !0
            }));
          }
        });
      },
      fail: function (t) {
        console.log("失败")
      }
    });
  },
  bindGetUserInfo: function (t) {
  },
  gohome: function () {
    wx.reLaunch({
      url: "../ticketmian/ticketmian"
    });
  },
  onShow: function () {
    var t = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 1e3,
      timingFunction: "ease-in-out",
      delay: 0
    });
    this.animation = t, this.setData({
      animationData: t.export()
    });
    var i = this, e = wx.getStorageSync("users").openid, o = i.data.gid;
    console.log(o)
  },
  rotateAndScale: function (t) {
    console.log(t)
    var that = this
    let infoOpt = {
      url: '/luck/part',
      type: 'POST',
      data: {
        luckId: that.data.luckId,
        userId: wx.getStorageSync("userId")
      },
      header: {
        'content-type': 'application/json',
      },
    }
    let infoCb = {}
    infoCb.success = function (res) {
      console.log(res);
      that.setData({
        message: res.message
      })
      that.getjoinMan()
    }

    sendAjax(infoOpt, infoCb, () => {
    });
  },
  getUrl: function () {
    var e = this;

  },
  onHide: function () { },
  onUnload: function () { },
  onPullDownRefresh: function () { },
  onReachBottom: function () { },
  goTicketadd: function (t) {
    wx.navigateTo({
      url: "../ticketadd/ticketadd"
    });
  },
  goTicketnum: function (t) {
    wx.navigateTo({
      url: "../ticketnum/ticketnum?luckId=" + this.data.luckId
    });
  },
  goXcx: function (t) {
    var e = t.currentTarget.dataset.appid;
    wx.navigateToMiniProgram({
      appId: e,
      path: "",
      extraData: {
        foo: "bar"
      },
      envVersion: "develop",
      success: function (t) {
        console.log(t);
      }
    });
  }
});