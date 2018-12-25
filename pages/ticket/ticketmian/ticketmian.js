const url = require('../../../config.js')
const sendAjax = require('../../../utils/sendAjax.js')

Page({
    data: {
        audit:1,
        addnews: "",
        resAutomatic: [],
        resManual: [],
        resScene: [],
        imgUrls: [],
        indicatorDots: !1,
        autoplay: !1,
        interval: 3e3,
        duration: 800,
        url: [],
        notice: []
    },
    onLoad: function(t) {
        this.getmian()
          this.getAD()
    },
    //获取列表详情
    getmian(){
      var that=this
      let infoOpt = {
        url: '/luck/luckList',
        type: 'GET',
        data: {
          status:1,
          pageNo:1,
          pageSize:5
        },
        header: {
          'content-type': 'application/json',
        },
      }
      let infoCb = {}
      infoCb.success = function (res) {
        console.log(res);
        that.setData({
          cullingList:res.items
        })
      }

      sendAjax(infoOpt, infoCb, () => {
        // that.onLoad()
        // wx.setStorageSync('G_needUploadIndex', true)
      });
    },
    //
    getAD(){
      var that = this
      let infoOpt = {
        url: '/luck/advertisement',
        type: 'GET',
        data: {
        },
        header: {
          'content-type': 'application/json',
        },
      }
      let infoCb = {}
      infoCb.success = function (res) {
        console.log(res);
        that.setData({
          adList: res.items
        })
      }

      sendAjax(infoOpt, infoCb, () => {
        // that.onLoad()
        // wx.setStorageSync('G_needUploadIndex', true)
      });
    },
    changeindex: function(t) {
        var a = t.currentTarget.dataset.index;
        this.setData({
            navIndex: a
        });
    },
    goDetails: function(t) {
        wx.navigateTo({
            url: "../psDetails/psDetails"
        });
    },
    
    
    
    closeAd: function() {
    },
    AutoMessage: function(t) {
    },
    bindGetUserInfo: function(t) {
        var e = this;
        wx.setStorageSync("user_info", t.detail.userInfo);
        var o = t.detail.userInfo.nickName, n = t.detail.userInfo.avatarUrl;
        wx.login({
            success: function(t) {
               
            }
        });
    },
    onShow: function() {
        
    },
    getUrl: function() {
       
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    goSponsor: function(t) {
        wx.navigateTo({
            url: "../sponsor/sponsor"
        });
    },
    goTicketmiandetail: function(t) {
        var id = t.currentTarget.dataset.item;
        wx.navigateTo({
            url: "../ticketmiandetail/ticketmiandetail?id=" + id
        });
    },
    goTicketadd: function(t) {
        wx.navigateTo({
            url: "../ticketadd/ticketadd"
        });
    },
    goTicketmy: function(t) {
        wx.reLaunch({
            url: "../ticketmy/ticketmy"
        });
    },
    goCall: function(t) {
        wx.makePhoneCall({
            phoneNumber: t.currentTarget.dataset.phone,
            success: function() {
                console.log("拨打电话成功！");
            },
            fail: function() {
                console.log("拨打电话失败！");
            }
        });
    },
    
    onShareAppMessage: function(t) {
        
    },
    goRecordall: function(t) {
        wx.navigateTo({
            url: "../recordall/recordall"
        });
    }
});