const url = require('../../config.js')
Page({
  data: {
    // URL: getApp().globalData.URL,
    scrollTop: 0,  //距离顶部的高度
    phoneHeight: 0, //系统手机的高度
    lodingHidden: '', //是否加载
    navId: 0, //导航栏Id
    currentPageNum: 1, //当前的页面
    scrollTopA: 500, //下面导航条距离顶部的高度（初始值设置高一点）
    navIsToTop: 0, //导航条是否到达顶部
    imgUrls: [
      '../../images/poster.png',
      '../../images/poster2.png',
      '../../images/poster3.png'
    ],
    voteList: [] //投票列表
  },
  onLoad: function (options) {
    this.getPhoneInfo();
    this.getVoteList();
  },
  //获取系统手机高度
  getPhoneInfo: function () {
    this.setData({
      phoneHeight: 750 / wx.getSystemInfoSync().windowWidth * wx.getSystemInfoSync().windowHeight
    })
  },
  //获取活动列表
  getVoteList: function () {
    var that = this;
    var navId = that.data.navId
    var pageNum = that.data.currentPageNum;
    wx.request({
      method: 'POST',
      url: url.host + '/vote/getAction',
      data: {
        status: navId,
        // status:0,
        pageNo: pageNum,
        pageSize: 5
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
   if(res.code==500){}
   else {
        if (res.data.code == 400 && that.data.voteList.length != 0) {
          that.setData({
            lodingHidden:'hidden'
          })
          wx.showToast({
            title: '已经到底了',
            icon:'none',
            duration:1000
          })
        } else {
          var voteList = that.data.voteList;
        
          for (var i = 0; i < res.data.voteList.length; i++) {
            voteList.push(res.data.voteList[i]);
          }
          that.setData({
            voteList: voteList,
            lodingHidden: 'hidden'
          })
        }
      }
      }
    })
  },
  //获取导航栏的内容到顶部的高度
  getTabToTop: function () {
    var that = this;
    var queryA = wx.createSelectorQuery()
    queryA.select('#view_A').boundingClientRect()
    queryA.selectViewport().scrollOffset()
    queryA.exec(function (res) {
      that.setData({
        scrollTopA: res[0].top
      })
    })
    // console.log(that.data.scrollTopA);
  },
  // 滚动条位置
  handleScroll: function (e) {
    // console.log(e.detail.scrollTop)
    this.getTabToTop();
    var that = this;
    var A = that.data.scrollTopA;
    if (A <= 20) {
      that.setData({
        navIsToTop: 1
      })
    } else {
      that.setData({
        navIsToTop: 0
      })
    }
    // this.setData({
    //   scrollTopstart: e.detail.scrollTop
    // })
  },
  //滚动到底部
  scrollToLower: function () {
    console.log('滚动到底部')
    var currentPageNum = this.data.currentPageNum + 1;
    this.setData({
      currentPageNum: currentPageNum,
      lodingHidden: ''
    })
    console.log(this.data.currentPageNum)
    this.getVoteList();
  },
  nav_notStart: function () {
    this.setData({
      navId: 0,
      currentPageNum: 1,
      voteList: [],
      navIsToTop: 0,
      scrollTopA: 30
    })
    this.getVoteList();
  },
  nav_begining: function () {
    this.setData({
      navId: 1,
      currentPageNum: 1,
      voteList: [],
      navIsToTop:0,
      scrollTopA:30
    })
    this.getVoteList();
  },
  nav_finished: function () {
    this.setData({
      navId: 2,
      currentPageNum: 1,
      voteList: [],
      navIsToTop: 0,
      scrollTopA: 30

    })
    this.getVoteList();
  },
  toVoteDetail:function(e){
    console.log(e)
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'scholarship/scholarship?id=' + id,
    })
  },
  toSpecialDetail:function(){
    wx.navigateTo({
      url: 'scholarship/scholarship?id=1' ,
    })
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