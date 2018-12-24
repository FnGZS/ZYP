Page({
    data: {
        btn: !1,
        txt: !1
    },
    onLoad: function(t) {
        var a = this;
        setTimeout(function() {
            console.log(11), a.setData({
                txt: !0
            });
        }, 1500);
        a = this;
        var n = wx.getStorageSync("user_info");
        a.setData({
            userInfo: n
        });
    },
    open: function() {
        this.data.btn;
        this.setData({
            btn: !1
        });
    }
});