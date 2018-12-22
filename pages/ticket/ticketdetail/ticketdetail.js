var app = getApp();

Page({
    data: {
        product: []
    },
    onLoad: function(t) {
        var a = this;
        wx.getUserInfo({
            success: function(t) {
                a.setData({
                    userInfo: t.userInfo
                });
            }
        });
        a = this;
        var e = t.gid;
        
    },
    onReady: function() {},
    onShow: function() {},
    getUrl: function() {
        var e = this;
       
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onEditor: function() {
        wx.navigateTo({
            url: "../ticketeditor/ticketeditor"
        });
    },
    goTicketmy: function() {
        wx.redirectTo({
            url: "../ticketmy/ticketmy"
        });
    },
    onShareAppMessage: function(t) {
        var e = this, a = wx.getStorageSync("gid");
        if (console.log(t.target.dataset.cid), 2 == t.target.dataset.cid) var n = "红包 " + e.data.product[0].gname + " 元"; else n = e.data.product[0].gname;
        return "button" === t.from && console.log(t.target), {
            title: e.data.userInfo.nickName + "邀你参与[" + n + "]抽奖",
            path: "/yzcj_sun/pages/ticket/ticketmiandetail/ticketmiandetail?gid=" + a,
            success: function(t) {},
            fail: function(t) {}
        };
    }
});