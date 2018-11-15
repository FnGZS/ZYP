const sendAjax = require('../../../utils/sendAjax.js')
var WxParse = require('../../../wxParse/wxParse.js');
Page({
  data: {
    URL: getApp().globalData.URL,
    detail:null,
    competeList:null,
    honorList:null,
    recommendList:null,
   phoneHeight:'',
    scientific:null,
    mes:[],
    messtring:[],
  },
  getPhoneInfo: function () {
    this.setData({
      phoneHeight: 750 / wx.getSystemInfoSync().windowWidth * wx.getSystemInfoSync().windowHeight
    })
  },
  getuserDetail:function(e){
    console.log(e);
    var that=this
    let infoOpt = {
      url: '/vote/search/'+e,
      type: 'GET',
      data: {
        
      },
      header: {
        'content-type': 'application/json',
        // 'authorization': wx.getStorageSync("authorization"),
      },
    }
    let infoCb = {}
    infoCb.success = function (res) {
      console.log(res);
      var arry = WxParse.wxParse('arry', 'html', res.detail, that, 30);
      that.setData({
        mes: res,
      })
      

    }
    sendAjax(infoOpt, infoCb, () => {
      // that.onLoad()
      // wx.setStorageSync('G_needUploadIndex', true)
    });
  },
  foreach:function(){
    
  },
  onLoad: function (options) {
    // console.log(options)
    this.getPhoneInfo();
    var detail = options.userDetail;
    console.log(options)
    this.getuserDetail(detail);
    
  },
  //获取用户详情
  // getUserDetail:function(){
  //   var that = this;
  //   wx.request({
  //     url: this.data.URL + `/vote/getAction/detail/${this.data.id}`,
  //     data: {},
  //     header: {
  //       'content-type': 'application/json'
  //     },
  //     success(res) {
  //      console.log(res)
  //     }
  //   })
  // },
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {}
})