var app = getApp();

Page({
    data: {},
    onLoad: function(a) {
        var t = a.gid;
        this.setData({
            gid: t
        });
    },
    onShow: function() {
        var t = this, a = t.data.gid;
        app.util.request({
            url: "entry/wxapp/ProNum",
            data: {
                gid: a
            },
            success: function(a) {
                console.log(a), t.setData({
                    product: a.data
                });
            }
        });
    }
});