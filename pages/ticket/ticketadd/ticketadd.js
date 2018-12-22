var weekday = [ "周日", "周一", "周二", "周三", "周四", "周五", "周六" ], minutes = [ "00", "30" ], hours = [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23" ], myDate = new Date(), hh = myDate.getHours();

++hh;
//时间选择
for (var dateTemp, time1, dateArrays = [], time = [], c = [], flag = 1, i = 0; i < 7; i++) {
    var m = "", d = "";
    dateTemp = (m = myDate.getMonth() + 1 < 10 ? "0" + (myDate.getMonth() + 1) : myDate.getMonth() + 1) + "月" + (d = myDate.getDate() < 10 ? "0" + myDate.getDate() : myDate.getDate()) + "日 " + weekday[myDate.getDay()], 
    dateArrays.push(dateTemp), time1 = m + "-" + d, time.push(time1), myDate.setDate(myDate.getDate() + flag);
}


Page({
    data: {
        current: 0,
        awardtype: 1,
        showtime: !1,
        showpaly: !1,
        index: 0,
      addticketArr:[1], //添加奖项数组
        palylist: [ "按时间自动开奖", "按人数自动开奖", "手动开奖" ],
        dateArrays: dateArrays,
        time: time,
        time1: time[0],
        dateArray: dateArrays[0],
        hours: hours,
        hour: hours[0],
        nowhour: hh,
        minutes: minutes,
        minute: minutes[0],
        inputValue1: [], //请输入奖品名称
        inputValue1show: !1,
        inputValue2: [],//请输入奖品数量
        inputValue2show: !1,
        inputValue3: 0,
        inputValue3show: !1,
        inputValue4: 0,
        inputValue4show: !1,
        inputValue5: 0,
        inputValue5show: !1,
        inputValue6show: !1,
        imgSrc: "",
        gName: "",
        pic: "",
        prizeList: []
    },
    onLoad: function(a) {
        
    },
    //添加奖项
  addTicket(){
    var that = this
    var addticketArr = that.data.addticketArr
    var addNum  = 1 //第一次循环数
    addticketArr.push(addNum++)//添加
    // console.log(addticketArr)
    that.setData({
      addticketArr
    })
  },
  //删除奖项
  removeTicket(){
    var that = this
    var addticketArr = that.data.addticketArr
    var inputValue2 = that.data.inputValue2
    var inputValue1 = that.data.inputValue1
    addticketArr.pop()//删除
    inputValue2.pop()
    inputValue1.pop()
    that.setData({
      addticketArr,
      inputValue2,
      inputValue1
    })
  },
    //设置封面
    upload: function() {
        wx.chooseImage({
            count: 1,
            sizeType: [ "original", "compressed" ],
            sourceType: [ "album", "camera" ],
            success: function(a) {
                var t = a.tempFilePaths[0];
                wx.redirectTo({
                    url: "../upload/upload?src=" + t
                });
            }
        });
    },
    //时间选择
    bindChange: function(a) {
        var t = this, e = a.detail.value, u = a.detail.value[1], i = t.data.inputValue6show;
        console.log(t.data.nowhour), i = u < t.data.nowhour && 0 == a.detail.value[0], this.setData({
            dateArray: this.data.dateArrays[e[0]],
            time1: this.data.time[e[0]],
            choosehour: u,
            hour: this.data.hours[e[1]],
            minute: this.data.minutes[e[2]],
            inputValue6show: i
        });
    },
    //皮一下
    // goPi: function() {
    //     把这个复制到wxml第二行 <image bindtap="goPi" class="piImg" src="../../../resource/images/pi.png"></image>
    //     wx.navigateTo({
    //         url: "../ticketPi/ticketPi"
    //     });
    // },

    // onShow: function() {
    //     var t = this;
    //     app.util.request({
    //         url: "entry/wxapp/url",
    //         cachetime: "0",
    //         success: function(a) {
    //             wx.setStorageSync("url", a.data), t.setData({
    //                 url: a.data
    //             });
    //         }
    //     }), app.util.request({
    //         url: "entry/wxapp/GetRed",
    //         data: {},
    //         success: function(a) {
    //             console.log(a), t.setData({
    //                 tz_audit: a.data.tz_audit,
    //                 is_car: a.data.is_car,
    //                 status: a.data.is_sjrz,
    //                 cjzt: a.data.cjzt,
    //                 cjzt1: t.data.url + "/" + a.data.cjzt,
    //                 day: a.data.is_open_pop
    //             }), console.log(t.data.cjzt);
    //         }
    //     });
    // },
    //发起抽奖
    goTicketdetail: function(a) {
      wx.navigateTo({
        url: "../ticketdetail/ticketdetail"
      });
    },
    goTicketmy: function(a) {
        wx.navigateTo({
            url: "../ticketmy/ticketmy"
        });
    },
    changetype: function(a) {
        var t = this, e = t.data.awardtype;
        t.data.inputValue1, t.data.inputValue2, t.data.inputValue1show, t.data.inputValue2show;
        e = 1 == e ? 2 : 1, t.setData({
            awardtype: e,
            inputValue1show: !1,
            inputValue2show: !1,
            inputValue1: 0,
            inputValue2: 0
        });
    },
    choosetime: function(a) {
        var t = this.data.showtime;
        t = !t, this.setData({
            showtime: t
        });
    },
    chooselotterytime: function() {
        this.data.showpaly;
        this.setData({
            showpaly: !0
        });
    },
    closeplay: function(a) {
        this.data.showpaly;
        var t = a.currentTarget.dataset.index;
        this.setData({
            showpaly: !1,
            index: t
        });
    },
    chooseImage: function(a) {
        var u = this, i = app.util.url("entry/wxapp/Toupload") + "&m=yzcj_sun";
        wx.chooseImage({
            count: 1,
            sizeType: [ "compressed" ],
            sourceType: [ "album" ],
            success: function(a) {
                var t = a.tempFilePaths, e = u.data.imgSrc;
                e = t, console.log(e), u.setData({
                    imgSrc: e
                }), wx.uploadFile({
                    url: i,
                    filePath: u.data.imgSrc[0],
                    name: "file",
                    formData: {},
                    success: function(a) {
                        console.log(a), u.setData({
                            pic: a.data
                        });
                    }
                });
            }
        });
    },
    //请输入奖品名称
    bindKeyInput1: function(a) {
      // console.log(a)
      var index = a.currentTarget.dataset.index
      var value = a.detail.value
      var bindKeyInput1 = this.data.bindKeyInput1
      bindKeyInput1[index] = value
      // console.log(bindKeyInput1)
      this.setData({
            bindKeyInput1
        });
    },
    //请输入奖品数量
    bindKeyInput2: function(a) {
      var index = a.currentTarget.dataset.index
      var value = parseInt(a.detail.value)

      var inputValue2 = this.data.inputValue2
      inputValue2[index] = value
      // console.log(inputValue2)
      this.setData({
        inputValue2
      });
    },
    bindKeyInput3: function(a) {
        var t = this.data.inputValue3show;
        t = 0 == a.detail.value || 200 < a.detail.value, this.setData({
            inputValue3: a.detail.value,
            inputValue3show: t
        });
    },
    bindKeyInput4: function(a) {
        var t = this.data.inputValue4show;
        t = 0 == a.detail.value || 100 < a.detail.value, this.setData({
            inputValue4: a.detail.value,
            inputValue4show: t
        });
    },
    bindKeyInput5: function(a) {
        var t = this.data.inputValue5show;
        t = 0 == a.detail.value.length, this.setData({
            inputValue5: a.detail.value.length,
            inputValue5show: t,
            accurate: a.detail.value
        });
    }
});