const url = require('../../../config.js')
const sendAjax = require('../../../utils/sendAjax.js')
Page({
    data: {
      radom:1,
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
       
    },
    //获取列表详情
    getmian(a){
      
      var that=this
      let infoOpt = {
        url: '/luck/luckList',
        type: 'GET',
        data: {
          status:1,
          pageNo:a,
          pageSize:5
        },
        header: {
          'content-type': 'application/json',
        },
      }
      let infoCb = {}
      infoCb.success = function (res) {
        console.log(res);
         var cullingList = res.items
        for (let i in cullingList){


          wx.request({
            url: url.host+'/luck/isPart',
            method: 'POST',
            data: {
              userId: wx.getStorageSync('userId'),
              luckId: cullingList[i].id
            },    //参数为键值对字符串
            header: {
              'content-type': 'application/json',
              'authorization': wx.getStorageSync('authorization')
            },
            success: function (res) {
              console.log(res);
              if (res.data.message == "未参与") {
                cullingList[i]["joinkey"] = false
              } else {
                cullingList[i]["joinkey"] = true

              }
              that.setData({
                cullingList
              })
              console.log(cullingList)
            }
          })
        }
      }

      sendAjax(infoOpt, infoCb, () => {
        // that.onLoad()
        // wx.setStorageSync('G_needUploadIndex', true)
      });
    },
  //是否参加
  getisPart(aa) {
    var that = this
    let infoOpt = {
      url: '/luck/isPart',
      type: 'POST',
      data: {
        userId: wx.getStorageSync('userId'),
        luckId: aa
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
  //回到首页
  gohome: function () {
    wx.reLaunch({
      url: "/pages/index/index"
    });
  },
    //广告
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
        var radom = this.data.radom
        this.getmian(radom)
      this.getAD()
    },
    getUrl: function() {
       
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
      wx.showNavigationBarLoading();
      var radom = this.data.radom;
      radom > 9? radom =1 : radom++
      this.setData({
        radom
      })
      this.getmian(radom)
      this.getAD()
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();


    },
    onReachBottom: function() {},
    goSponsor: function(t) {
        wx.navigateTo({
            url: "../sponsor/sponsor"
        });
    },
    goTicketmiandetail: function(t) {
        var id = t.currentTarget.dataset.item;
      var cullingList = encodeURIComponent(JSON.stringify(this.data.cullingList));
      
        wx.navigateTo({
            url: "../ticketmiandetail/ticketmiandetail?id=" + id +"&&cullingList=" + cullingList
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
    },
  toAdd(){
    wx.navigateTo({
      url: "../ticketadd/ticketadd"
    });
  }
    
});