var app = getApp();

Page({
    data: {
        address: []
    },
    onLoad: function(e) {
        var t = e.gid;
        this.setData({
            gid: t
        });
    },
    address: function() {
        var t = this;
        wx.chooseAddress({
            success: function(e) {
                t.setData({
                    name: e.userName,
                    postalCode: e.postalCode,
                    provinceName: e.provinceName,
                    cityName: e.cityName,
                    countyName: e.countyName,
                    detailInfo: e.detailInfo,
                    nationalCode: e.nationalCode,
                    telNumber: e.telNumber
                });
            }
        });
    },
    saveAddress: function(e) {
        var t = this, a = wx.getStorageSync("users").id, n = e.detail.formId;
        if (t.data.name) {
            var o = wx.getStorageSync("users").openid, i = t.data.gid;
            app.util.request({
                url: "entry/wxapp/GetAddr",
                data: {
                    userName: t.data.name,
                    telNumber: t.data.telNumber,
                    postalCode: t.data.postalCode,
                    provinceName: t.data.provinceName,
                    cityName: t.data.cityName,
                    countyName: t.data.countyName,
                    detailInfo: t.data.detailInfo,
                    detailAddr: t.data.detail,
                    openid: o,
                    gid: i
                },
                success: function(e) {
                    app.util.request({
                        url: "entry/wxapp/SaveFormid1",
                        data: {
                            openid: o,
                            user_id: a,
                            form_id: n,
                            gid: i,
                            state: 1
                        },
                        success: function(e) {
                            wx.navigateBack({
                                url: "../ticketresults/ticketresults"
                            });
                        }
                    });
                }
            });
        } else console.log(2);
    },
    bindKeyInput1: function(e) {
        this.setData({
            length1: e.detail.value.length
        }), console.log(this.data.length1);
    },
    bindKeyInput2: function(e) {
        this.setData({
            detail: e.detail.value
        });
    },
    onShow: function(e) {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});