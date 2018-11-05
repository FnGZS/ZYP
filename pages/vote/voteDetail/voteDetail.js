Page({
  data: {
    URL: getApp().globalData.URL,
    detail:null,
    competeList:null,
    honorList:null,
    recommendList:null,
   phoneHeight:'',
    scientific:null
  },
  getPhoneInfo: function () {
    this.setData({
      phoneHeight: 750 / wx.getSystemInfoSync().windowWidth * wx.getSystemInfoSync().windowHeight
    })
  },
  onLoad: function (options) {
    console.log(options)
    this.getPhoneInfo();
    var detail = JSON.parse(options.userDetail);
    console.log(detail);
    
    var compete = detail.compete;
    var honor = detail.honor;
    var recommend = detail.recommend;
    var competeList = compete.split('；');
    var honorList = honor.split('；');
    var recommendList = recommend.split('——');
    var scientific = detail.scientific;
    var scientificList = scientific.split('；');
    console.log(recommendList)

    this.setData({
      detail: detail,
      competeList: competeList,
      honorList: honorList,
      recommendList: recommendList,
      scientific: scientificList
    })
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