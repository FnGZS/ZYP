var app = getApp();

Page({
    data: {
        allnum: 0,
        launchnum: 0,
        luckynum: 0,
        money: 0,
        userInfo:{}
    },
    onLoad: function(n) {
      console.log(app.globalData.userInfo)
      this.setData({
       userInfo:app.globalData.userInfo
      })
      
        // var o = wx.getStorageSync("user_info"), e = wx.getStorageSync("is_tel"), a = wx.getStorageSync("is_openzx");
        // this.setData({
        //     userInfo: o,
        //     is_openzx: a,
        //     is_tel: e
        // });
    },
    onReady: function() {},
    goMydance: function(n) {
        wx.navigateTo({
            url: "../../circle/mydance/mydance"
        });
    },
    onShow: function() {
        
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    goAddress: function(n) {
        wx.chooseAddress({
            success: function(n) {
                console.log(n);
            }
        });
    },
    goTicketadd: function(n) {
        wx.navigateTo({
            url: "../ticketadd/ticketadd"
        });
    },
    goSponsor: function(n) {
        wx.navigateTo({
            url: "../sponsortwo/sponsortwo"
        });
    },
    goTicketmain: function(n) {
        wx.reLaunch({
            url: "../ticketmian/ticketmian"
        });
    },
    goRecordall: function(n) {
        wx.navigateTo({
            url: "../recordall/recordall"
        });
    },
    goRecordlaunch: function(n) {
        wx.navigateTo({
            url: "../recordlaunch/recordlaunch"
        });
    },
    goRecordlucky: function(n) {
        wx.navigateTo({
            url: "../recordlucky/recordlucky"
        });
    },
    goBalance: function(n) {
        wx.navigateTo({
            url: "../balance/balance"
        });
    },
    goHelpcenter: function(n) {
        wx.navigateTo({
            url: "/pages/user/help/help"
        });
    },
    goGiftorder: function(n) {
        wx.navigateTo({
            url: "../../gift/giftorder/giftorder"
        });
    },
    goAdmin: function() {
        var n = wx.getStorageSync("users").openid;
        
    }
});