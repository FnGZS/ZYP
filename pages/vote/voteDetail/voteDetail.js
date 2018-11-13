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
    mes:[]
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
     var arry=[];
   var arr=JSON.parse(res.detail)
    for(var i=0;i<arr.length;i++){
        arry[i]='arr['+i+']'
    }
    console.log(arry);
   var qqq='arr[0]';
      var qqa = arr[0]
      var arry = WxParse.wxParse(qqq, 'html', qqa, that, 30);
      that.setData({
        mes: arr
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