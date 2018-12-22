function _defineProperty(t, e, a) {
    return e in t ? Object.defineProperty(t, e, {
        value: a,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[e] = a, t;
}

var app = getApp(), WxParse = require("../../../wxParse/wxParse.js");

Page({
    data: {
        hidden: !0,
        animationData: {},
        product: [1],
        status: "",
        gid:0
    },
    onLoad: function(t) {
        var e = this;
        this.data.isLogin;
        wx.getStorageSync("openid") ? wx.getSetting({
            success: function(t) {
                t.authSetting["scope.userInfo"] && wx.getUserInfo({
                    success: function(t) {
                        e.setData({
                            isLogin: !1,
                            userInfo: t.userInfo
                        });
                    }
                });
            }
        }) : e.setData({
            isLogin: !0
        });
        e = this, wx.getStorageSync("users").openid;
        var a = t.gid;
        e.setData({
            gid: a
        });
    },
    shareCanvas: function() {
        var t = this, e = "/yzcj_sun/pages/ticket/ticketmiandetail/ticketmiandetail?gid=" + t.data.gid;
        console.log(e);
        var a = t.data.product, n = [];
        n.gid = a[0].gid, n.url = t.data.url, n.logo = a[0].pic ? a[0].pic : "../addons/yzcj_sun/banner.jpg", 
        console.log(n), app.func.creatPoster(app, e, 430, n, 1, "shareImg");
    },
    onShareAppMessage: function(t) {
        var e = this, a = (wx.getStorageSync("users").openid, e.data.gid);
        if (2 == t.target.dataset.cid) var n = "红包 " + e.data.product[0].gname + " 元"; else n = e.data.product[0].gname;
        return "button" === t.from && console.log(t.target), {
            title: e.data.userInfo.nickName + "邀你参与[" + n + "]抽奖",
            path: "/yzcj_sun/pages/ticket/ticketmiandetail/ticketmiandetail?gid=" + a,
            success: function(t) {},
            fail: function(t) {}
        };
    },
    hidden: function(t) {
        this.setData({
            hidden: !0
        });
    },
    save: function() {
        var e = this;
        wx.saveImageToPhotosAlbum({
            filePath: e.data.prurl,
            success: function(t) {
                console.log("成功"), wx.showModal({
                    content: "图片已保存到相册，赶紧晒一下吧~",
                    showCancel: !1,
                    confirmText: "好哒",
                    confirmColor: "#ef8200",
                    success: function(t) {
                        t.confirm && (console.log("用户点击确定"), e.setData({
                            hidden: !0
                        }));
                    }
                });
            },
            fail: function(t) {
                console.log("失败"), wx.getSetting({
                    success: function(t) {
                        t.authSetting["scope.writePhotosAlbum"] || (console.log("进入信息授权开关页面"), wx.openSetting({
                            success: function(t) {
                                console.log("openSetting success", t.authSetting);
                            }
                        }));
                    }
                });
            }
        });
    },
    bindGetUserInfo: function(t) {
    },
    gohome: function() {
        wx.reLaunch({
            url: "../ticketmian/ticketmian"
        });
    },
    onShow: function() {
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
    rotateAndScale: function(t) {
        var e = this, a = wx.getStorageSync("users").openid, n = wx.getStorageSync("users").name, i = wx.getStorageSync("users").img, o = e.data.gid, s = wx.getStorageSync("users").id, c = t.detail.formId;
        if ("" != a && "" != n && "" != i && "" != s && "" != o && null != a && null != n && null != i && null != s && null != o) {
            this.animation.width("180rpx").height("180rpx").opacity(.3).step();
            this.setData(_defineProperty({
                animationData: this.animation.export()
            }, "product[0].jion", !0))
        }
    },
    getUrl: function() {
        var e = this;
        
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    goTicketadd: function(t) {
        wx.navigateTo({
            url: "../ticketadd/ticketadd"
        });
    },
    goTicketnum: function(t) {
        var e = t.currentTarget.dataset.gid;
        wx.navigateTo({
            url: "../ticketnum/ticketnum?gid=" + e
        });
    },
    goXcx: function(t) {
        var e = t.currentTarget.dataset.appid;
        wx.navigateToMiniProgram({
            appId: e,
            path: "",
            extraData: {
                foo: "bar"
            },
            envVersion: "develop",
            success: function(t) {
                console.log(t);
            }
        });
    }
});