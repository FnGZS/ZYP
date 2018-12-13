const sendAjax = require('../../../utils/sendAjax.js')
var WxParse = require('../../../wxParse/wxParse.js');
Page({
  data: {
    id:null,
    name:''
  },
  onLoad: function (options) {
    var id = options.id;
    this.setData({
      id : id
    })
    this.getInnovateDetail();

  },
  getInnovateDetail:function(){
    var that = this;
    var id = that.data.id;
    let infoOpt = {
      url: '/innovate/list/' + id,
      type: 'GET',
      data: {
      },
      header: {
        'content-type': 'application/json',
      },
    }
    let infoCb = {}
    infoCb.success = function (res) {
      console.log(1111);
      var name = res.name;
      console.log(name)
      wx.setNavigationBarTitle({
        title: name
      })
    }
    sendAjax(infoOpt, infoCb, () => { });
    // var detail = '<div class="businessBrief">      <div class="businessBrief-title">业务简介</div>      <div class="businessBrief-title-eng">OUR SERVICE</div>     <div class="businessBrief-content">应用软件开发、网站开发、小程序开发</div>      <div class="businessBrief-img">        <div class="businessBrief-img-list">          <img src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1035881097,2689997786&fm=26&gp=0.jpg"></image>          <div class="businessBrief-img-list-title">湿地公园</div>        </div>        <div class="businessBrief-img-list">         <img src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1035881097,2689997786&fm=26&gp=0.jpg"></image>         <div class="businessBrief-img-list-title">城市森林公园</div>       </div>       <div class="businessBrief-img-list">         <img src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1035881097,2689997786&fm=26&gp=0.jpg"></image>       <div class="businessBrief-img-list-title">城市道路绿化</div>       </div>     </div>   </div>     <div class="product">       <div class="product-title">产品中心</div>       <div class="product-title-eng">PRODUCTS</div>     </div>';
    // var arry = WxParse.wxParse('arry', 'html', detail, that, 30);
    // var that = this
    // let infoOpt = {
    //   url: '/vote/search/' + e,
    //   type: 'GET',
    //   data: {
    //   },
    //   header: {
    //     'content-type': 'application/json',
    //   },
    // }
    // let infoCb = {}
    // infoCb.success = function (res) {
    //   var arry = WxParse.wxParse('arry', 'html', res.detail, that, 30);
    // }
    // sendAjax(infoOpt, infoCb, () => {
    // });
  },
  onReady: function () {
    
  },
  onShow: function () {
    
  },
  onHide: function () {
    
  },
  onUnload: function () {
    
  },
  onPullDownRefresh: function () {
    
  },
  onReachBottom: function () {
    
  },
  onShareAppMessage: function () {
    
  }
})