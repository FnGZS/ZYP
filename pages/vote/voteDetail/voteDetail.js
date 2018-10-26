Page({
  data: {
    URL: getApp().globalData.URL,
    detail:null,
    competeList:null,
    honorList:null,
    recommendList:null

  },
  onLoad: function (options) {
    console.log(options)
    var detail = JSON.parse(options.userDetail);
    // console.log(JSON.parse(options));
    
    var compete = detail.compete;
    var honor = detail.honor;
    var recommend = detail.recommend;
    var competeList = compete.split('；');
    var honorList = honor.split('；');
    var recommendList = recommend.split('——');
    console.log(recommendList)

    this.setData({
      detail: detail,
      competeList: competeList,
      honorList: honorList,
      recommendList: recommendList
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