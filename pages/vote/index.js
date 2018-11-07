const url = require('../../config.js')
const sendAjax = require('../../utils/sendAjax.js')
Page({
  data: {
    // URL: getApp().globalData.URL,
    scrollTop:0,  //距离顶部的高度
    phoneHeight: 0, //系统手机的高度
    lodingHidden: '', //是否加载
    navId: 0, //导航栏Id
    currentPageNum: 1, //当前的页面
    scrollTopA: 500, //下面导航条距离顶部的高度（初始值设置高一点）
    navIsToTop: 0, //导航条是否到达顶部
    imgUrls: [
    ],
    voteList: [], //投票列表
    scrollheight:0,
  },
  //获取轮播图
  getslide:function(){
    var that=this;
    let infoOpt = {
      url: '/vote/getAction/slide',
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
        imgUrls:res.items
      })
    }

    sendAjax(infoOpt, infoCb, () => {
      // that.onLoad()
      // wx.setStorageSync('G_needUploadIndex', true)
    });

  },
  onLoad: function (options) {
    console.log(111);
    this.getslide();
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
    let infoOpt = {
      url: '/vote/getAction',
      type: 'POST',
      data: {
        status: navId,
        // status:0,
        pageNo: pageNum,
        pageSize: 5
      },
      header: {
        'content-type': 'application/json',
      },
    }
    let infoCb = {}
    infoCb.success = function (res) {
      console.log(res);
      if (res.code == 500) { }
      else {
        // console.log(1);
        if (res.code == 400 ) {
          if (that.data.voteList.length != 0)
          {
            wx.showToast({
              title: '暂无更多',
              icon: 'none',
              duration: 1000
            })
          }else 
          {
          }
        } else {
          var voteList = that.data.voteList;
          for (var i = 0; i < res.voteList.length; i++) {
            voteList.push(res.voteList[i]);
          }
          that.setData({
            voteList: voteList,
        
          })
        }
      }
    }
    infoCb.beforeSend = () => { }
    infoCb.complete = () => {

    }
    sendAjax(infoOpt, infoCb, () => {
      // that.onLoad()
      // wx.setStorageSync('G_needUploadIndex', true)
    });
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
    var a = e.detail.scrollTop
  this.setData({
    scrollheight:a
  })
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
    var islogin=(wx.getStorageSync("isLogin"));
    if(islogin){
  //  var isbound=wx.getStorageSync('isbound', 1);//判断是否绑定了学号
  //  if(isbound==2)
  //  {
  //    wx.showModal({
  //      title: '提示',
  //      content: '您还未绑定学号',
  //      showCancel: false,
  //      success(res) {
  //        wx.switchTab({
  //          url: '../user/user',
  //        })
  //      }
  //    })
  //  }else if(isbound==1){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'scholarship/scholarship?id=' + id,
    })
   }
   else {
      wx.showModal({
       title: '提示',
       content: '请登录',
       showCancel: false,
       success(res) {
         wx.switchTab({
           url: '../user/user',
         })
       }
     })
   }
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
  refresh:function(){
   var that=this
    if (that.data.scrollheight<-80){
    setTimeout(function () {
   that.setData({
     currentPageNum: 1
   })
      var navId = that.data.navId
      var pageNum = that.data.currentPageNum;
      let infoOpt = {
        url: '/vote/getAction',
        type: 'POST',
        data: {
          status: navId,
          // status:0,
          pageNo: pageNum,
          pageSize: 5
        },
        header: {
          'content-type': 'application/json',
        },
      }
      let infoCb = {}
      infoCb.success = function (res) {
        console.log(res);
        if (res.code == 500) { }
        else {
          // console.log(1);
          if (res.code == 400) {
        
          } else {
            var voteList = that.data.voteList;
            for (var i = 0; i < res.voteList.length; i++) {
              voteList.push(res.voteList[i]);
            }
            that.setData({
              voteList: voteList,

            })
          }
        }
      }
  
      sendAjax(infoOpt, infoCb, () => {
        // that.onLoad()
        // wx.setStorageSync('G_needUploadIndex', true)
      });
    }, 100);
    }

  },
   onPullDownRefresh: function () {

     this.getVoteList();
     wx.stopPullDownRefresh();
  //   this.setData({
  //     // URL: getApp().globalData.URL,
  //     scrollTop: 0,  //距离顶部的高度
  //     phoneHeight: 0, //系统手机的高度
  //     lodingHidden: '', //是否加载
  //     navId: 0, //导航栏Id
  //     currentPageNum: 1, //当前的页面
  //     scrollTopA: 500, //下面导航条距离顶部的高度（初始值设置高一点）
  //     navIsToTop: 0, //导航条是否到达顶部
  //     imgUrls: [
  //       '../../images/poster.png',
  //       '../../images/poster2.png',
  //       '../../images/poster3.png'
  //     ],
  //     voteList: [] //投票列表
  //   })
  //   this.getPhoneInfo();
  //   this.getVoteList();
  //   wx.stopPullDownRefresh();
   },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {
  }
})