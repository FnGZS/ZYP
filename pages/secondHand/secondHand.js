const url = require('../../config.js')
const sendAjax = require('../../utils/sendAjax.js')
var touchDotX = 0; //X按下时坐标
var touchDotY = 0; //y按下时坐标

Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: '',
    windowWidth: '',
    lunboImg: [],
    menuList: [],
    tabScroll: 0,
    currentTab: 0,
    currentTypeid: 0,
    goodsList: [],
    pageNo: 1,
    pageSize: 10,
    lodingHidden: true,
    isBottom: false
  },

  onLoad: function(options) {
    this.getPhoneInfo();
    this.getLunbo();
    this.getGoodsType();
    this.getGoodsList();
  },
  //获取手机系统参数
  getPhoneInfo: function() {
    wx.getSystemInfo({ // 获取当前设备的宽高
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      },
    })
  },
  //单击导航栏
  clickMenu: function(e) {
    var current = e.currentTarget.dataset.current //获取当前tab的index
    var tabWidth = this.data.windowWidth / 5 // 导航tab共5个，获取一个的宽度
    var typeid = e.currentTarget.dataset.typeid; //获取当前的类型id
    this.setData({
      tabScroll: (current - 2) * tabWidth, //使点击的tab始终在居中位置
      currentTypeid: typeid,
      currentTab: current,
      goodsList: [],
      pageNo: 1,
      lodingHidden: false,
      isBottom: false
    })
    this.getGoodsList();
  },
  // 触摸开始事件 
  touchStart: function(e) {
    touchDotX = e.touches[0].pageX; // 获取触摸时的原点
    touchDotY = e.touches[0].pageY;
  },
  // 触摸结束事件 
  touchEnd: function(e) {
    var touchMoveX = e.changedTouches[0].pageX;
    var touchMoveY = e.changedTouches[0].pageY;
    var tmX = touchMoveX - touchDotX;
    var tmY = touchMoveY - touchDotY;
    var absX = Math.abs(tmX);
    var absY = Math.abs(tmY);
    var currentTab = this.data.currentTab;
    var currentTypeid = this.data.currentTypeid;
    var tabWidth = this.data.windowWidth / 5;
    var menuList = this.data.menuList;
    if (absX > 2 * absY) {
      if (tmX < -50) { //左滑
        if (currentTab != this.data.menuList.length - 1) {
          currentTab = currentTab + 1;
          currentTypeid = menuList[currentTab].id;
          this.setData({
            tabScroll: (currentTab - 2) * tabWidth,
            currentTypeid: currentTypeid,
            currentTab: currentTab,
            goodsList: [],
            pageNo: 1,
            lodingHidden: false,
            isBottom: false
          })
          this.getGoodsList();
        }
      } else if (tmX > 50) { // 右滑
        if (currentTab != 0) {
          currentTab = currentTab - 1;
          currentTypeid = menuList[currentTab].id;
          this.setData({
            tabScroll: (currentTab - 2) * tabWidth,
            currentTypeid: currentTypeid,
            currentTab: currentTab,
            goodsList: [],
            pageNo: 1,
            lodingHidden: false,
            isBottom: false
          })
          this.getGoodsList();
        }
      }
      console.log(currentTab + '....' + currentTypeid)

    }

  },
  //获取轮播图
  getLunbo: function() {
    var that = this;
    let infoOpt = {
      url: '/secondary/slide',
      type: 'GET',
      data: {},
      header: {
        'content-type': 'application/json',
      },
    }
    let infoCb = {}
    infoCb.success = function(res) {
      console.log(res);
      that.setData({
        lunboImg: res.list
      })
    }
    infoCb.beforeSend = () => {}
    sendAjax(infoOpt, infoCb, () => {});
  },
  //获取商品分类
  getGoodsType: function() {
    var that = this;
    let infoOpt = {
      url: '/secondary/type',
      type: 'GET',
      data: {},
      header: {
        'content-type': 'application/json',
      },
    }
    let infoCb = {}
    infoCb.success = function(res) {
      console.log(res);
      that.setData({
        menuList: res.list
      })
    }
    infoCb.beforeSend = () => {}
    sendAjax(infoOpt, infoCb, () => {});
  },
  //获取商品列表
  getGoodsList: function() {
    var that = this;
    var typeid = this.data.currentTypeid;
    var pageNo = this.data.pageNo;
    var pageSize = this.data.pageSize;
    let infoOpt = {
      url: '/secondary/list',
      type: 'GET',
      data: {
        goodsType: typeid,
        pageNo: pageNo,
        pageSize: pageSize
      },
      header: {
        'content-type': 'application/json',
      },
    }
    let infoCb = {}
    infoCb.success = function(res) {
      console.log(res);
      var goodsNewList = res.list;
      var goodsList = that.data.goodsList;
      if (goodsNewList.length == 0 && goodsList.length != 0) {
        that.setData({
          lodingHidden: true,
          isBottom: true
        })
        // setTimeout(function () {
        //   wx.showToast({
        //     title: '没有更多的活动了',
        //     icon: 'none',
        //     duration: 1000
        //   })
        // }, 100)
      } else {
        for (var i = 0; i < goodsNewList.length; i++) {
          var arr = goodsNewList[i].goodsImg;
          goodsNewList[i]['goodsImg'] = JSON.parse(arr);
          goodsList.push(goodsNewList[i]);
        }
        console.log(goodsList)
        that.setData({
          goodsList: goodsList,
          lodingHidden: true
        })
      }
    }
    infoCb.beforeSend = () => {}
    sendAjax(infoOpt, infoCb, () => {});
  },
  toDetail: function() {
    wx.showToast({
      title: '跳转详情',
      icon: 'none'
    })
  },
  onReady: function() {

  },
  onShow: function() {

  },
  onHide: function() {

  },
  onUnload: function() {

  },
  onPullDownRefresh: function() {
    this.setData({
      pageNo: 1,
      lodingHidden: false
    })
    this.getLunbo();
    this.getGoodsType();
    this.getGoodsList();
    wx.stopPullDownRefresh();
  },
  //上拉加载
  onReachBottom: function() {
    var pageNo = this.data.pageNo;
    console.log(this.data.isBottom)
    if (this.data.isBottom == false){
      this.setData({
        pageNo: pageNo + 1,
        lodingHidden: false
      })
      this.getGoodsList();
    }
    
  },
  onShareAppMessage: function() {

  }
})